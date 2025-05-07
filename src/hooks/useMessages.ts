
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Conversation, Message } from "@/types/messages.types";
import { toast } from "sonner";
import { UserType } from "@/types/database.types";

export const useMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return { ...user, profile };
    },
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Fetch conversations
  const fetchConversations = async () => {
    if (!currentUser) return [];
    
    try {
      // Get all messages where the user is either sender or recipient
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          read,
          created_at
        `)
        .or(`sender_id.eq.${currentUser.id},recipient_id.eq.${currentUser.id}`)
        .order('created_at', { ascending: false });
        
      if (messagesError) throw messagesError;
      
      // Extract unique user IDs the user has messaged with
      const uniqueUserIds = new Set<string>();
      messagesData.forEach(msg => {
        if (msg.sender_id === currentUser.id) {
          uniqueUserIds.add(msg.recipient_id);
        } else {
          uniqueUserIds.add(msg.sender_id);
        }
      });
      
      // Get user profiles for those IDs
      const userIds = Array.from(uniqueUserIds);
      if (userIds.length === 0) return [];
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
        
      if (profilesError) throw profilesError;
      
      // Build conversations from messages data
      const conversationsMap = new Map<string, Conversation>();
      
      for (const userId of userIds) {
        const profile = profiles.find(p => p.id === userId);
        if (!profile) continue;
        
        // Get the latest message for this conversation
        const conversationMessages = messagesData.filter(msg => 
          (msg.sender_id === userId && msg.recipient_id === currentUser.id) || 
          (msg.sender_id === currentUser.id && msg.recipient_id === userId)
        ).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        
        const lastMessage = conversationMessages[0];
        const unreadCount = conversationMessages.filter(msg => 
          msg.sender_id === userId && !msg.read
        ).length;
        
        if (profile.user_type === 'driver' || profile.user_type === 'engineer' || profile.user_type === 'team') {
          conversationsMap.set(userId, {
            id: userId,
            recipientId: userId,
            recipientName: profile.full_name || 'Unknown User',
            recipientAvatar: profile.avatar_url || undefined,
            recipientType: profile.user_type as UserType,
            lastMessage: lastMessage?.content || '',
            lastMessageTime: lastMessage?.created_at || new Date().toISOString(),
            unreadCount: unreadCount,
            messages: conversationMessages.map(msg => ({
              id: msg.id,
              senderId: msg.sender_id,
              senderName: msg.sender_id === currentUser.id ? 'You' : (profile.full_name || 'Unknown User'),
              content: msg.content,
              timestamp: msg.created_at,
              isRead: msg.read
            }))
          });
        }
      }
      
      return Array.from(conversationsMap.values());
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
      return [];
    }
  };

  const { data: fetchedConversations, isLoading } = useQuery({
    queryKey: ['conversations', currentUser?.id],
    queryFn: fetchConversations,
    enabled: !!currentUser,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!currentUser || !selectedConversation) 
        throw new Error('Cannot send message without user or conversation');
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUser.id,
          recipient_id: selectedConversation.recipientId,
          content: content
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  });

  // Mark messages as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageIds: string[]) => {
      if (!currentUser || messageIds.length === 0) return;
      
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .in('id', messageIds);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    }
  });

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    
    // Mark unread messages as read
    const unreadMessageIds = conversation.messages
      .filter(msg => !msg.isRead && msg.senderId === conversation.recipientId)
      .map(msg => msg.id);
      
    if (unreadMessageIds.length > 0) {
      markAsReadMutation.mutate(unreadMessageIds);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    sendMessageMutation.mutate(newMessage.trim());
  };

  // Set up real-time subscription for messages
  useEffect(() => {
    if (!currentUser) return;
    
    const subscription = supabase
      .channel('messages_channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'messages',
        filter: `recipient_id=eq.${currentUser.id}`
      }, () => {
        // Refresh conversations when new messages arrive
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [currentUser, queryClient]);

  useEffect(() => {
    if (fetchedConversations && fetchedConversations.length > 0) {
      setConversations(fetchedConversations);
      // Select the first conversation if none is selected
      if (!selectedConversation) {
        setSelectedConversation(fetchedConversations[0]);
      }
    }
    setLoading(isLoading);
  }, [fetchedConversations, isLoading, selectedConversation]);

  return {
    conversations,
    selectedConversation,
    newMessage,
    loading,
    setNewMessage,
    handleSendMessage,
    handleConversationSelect,
    isSending: sendMessageMutation.isPending,
    currentUser
  };
};
