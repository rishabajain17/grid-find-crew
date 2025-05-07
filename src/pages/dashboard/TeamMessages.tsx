import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserType } from "@/types/database.types";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientAvatar?: string;
  recipientType: UserType;
  relatedToId?: string;
  relatedToType?: "seat" | "job";
  relatedToTitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const TeamMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
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
  });

  // Fetch conversations (unique recipients the team has messaged with)
  const fetchConversations = async () => {
    if (!currentUser) return [];
    
    try {
      // Get all messages where the team is either sender or recipient
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
      
      // Extract unique user IDs the team has messaged with
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
        
        // Get any related info (job/seat) if available
        // For now, we're not implementing this part as it requires additional queries
        
        if (profile.user_type === 'driver' || profile.user_type === 'engineer') {
          conversationsMap.set(userId, {
            id: userId,
            recipientId: userId,
            recipientName: profile.full_name || profile.username || 'Unknown User',
            recipientAvatar: profile.avatar_url || undefined,
            recipientType: profile.user_type as UserType,
            lastMessage: lastMessage?.content || '',
            lastMessageTime: lastMessage?.created_at || new Date().toISOString(),
            unreadCount: unreadCount,
            messages: conversationMessages.map(msg => ({
              id: msg.id,
              senderId: msg.sender_id,
              senderName: msg.sender_id === currentUser.id ? 'You' : (profile.full_name || profile.username || 'Unknown User'),
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

  useEffect(() => {
    if (fetchedConversations && fetchedConversations.length > 0) {
      setConversations(fetchedConversations);
      // Select the first conversation if none is selected
      if (!selectedConversation) {
        setSelectedConversation(fetchedConversations[0]);
      }
    }
    setLoading(isLoading);
  }, [fetchedConversations, isLoading]);

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

  const filteredConversations = conversations.filter(conversation =>
    conversation.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <DashboardLayout title="Messages" userType="team">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex h-[calc(100vh-180px)]">
        {/* Conversation List */}
        <div className="w-1/3 border-r overflow-y-auto">
          <div className="p-4">
            <Input 
              placeholder="Search messages..." 
              className="mb-4" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <h2 className="text-lg font-medium mb-4">Conversations</h2>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading conversations...</p>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No conversations found</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-lg cursor-pointer ${
                      selectedConversation?.id === conversation.id
                        ? "bg-racing-red/10 border border-racing-red/20"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleConversationSelect(conversation)}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <div className={`${
                          conversation.recipientType === "driver" 
                            ? "bg-racing-red/20" 
                            : "bg-racing-blue/20"
                          } h-full w-full flex items-center justify-center rounded-full`}>
                          <span className={`font-medium ${
                            conversation.recipientType === "driver" 
                              ? "text-racing-red" 
                              : "text-racing-blue"
                            }`}>
                            {conversation.recipientName.charAt(0)}
                          </span>
                        </div>
                      </Avatar>
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium truncate">
                            {conversation.recipientName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatDate(conversation.lastMessageTime)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Badge variant="outline" className={`mr-1 py-0 px-1 text-xs ${
                            conversation.recipientType === "driver" 
                              ? "border-racing-red text-racing-red" 
                              : "border-racing-blue text-racing-blue"
                            }`}>
                            {conversation.recipientType === "driver" ? "Driver" : "Engineer"}
                          </Badge>
                          <p className="text-xs truncate text-gray-500">
                            {conversation.lastMessage}
                          </p>
                        </div>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="ml-2 bg-racing-red text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Content */}
        {selectedConversation ? (
          <div className="w-2/3 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  <div className={`${
                    selectedConversation.recipientType === "driver" 
                      ? "bg-racing-red/20" 
                      : "bg-racing-blue/20"
                    } h-full w-full flex items-center justify-center rounded-full`}>
                    <span className={`font-medium ${
                      selectedConversation.recipientType === "driver" 
                        ? "text-racing-red" 
                        : "text-racing-blue"
                      }`}>
                      {selectedConversation.recipientName.charAt(0)}
                    </span>
                  </div>
                </Avatar>
                <div className="ml-3">
                  <h2 className="text-md font-medium">{selectedConversation.recipientName}</h2>
                  <div className="flex items-center">
                    <Badge variant="outline" className={`mr-2 text-xs ${
                      selectedConversation.recipientType === "driver" 
                        ? "border-racing-red text-racing-red" 
                        : "border-racing-blue text-racing-blue"
                      }`}>
                      {selectedConversation.recipientType === "driver" ? "Driver" : "Engineer"}
                    </Badge>
                    {selectedConversation.relatedToTitle && (
                      <span className="text-xs text-gray-500">
                        Re: {selectedConversation.relatedToTitle}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Message List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Start a conversation</p>
                </div>
              ) : (
                selectedConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === currentUser?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === currentUser?.id
                          ? "bg-racing-red/10 text-gray-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <div className="text-right mt-1">
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex">
                <Textarea
                  placeholder="Type a message..."
                  className="flex-1 resize-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  className="ml-2 bg-racing-red hover:bg-racing-red/90 self-end"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                >
                  {sendMessageMutation.isPending ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-2/3 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700">No conversation selected</h3>
              <p className="text-gray-500 mt-2">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeamMessages;
