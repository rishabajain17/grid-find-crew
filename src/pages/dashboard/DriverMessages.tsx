
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ConversationList } from "@/components/messages/ConversationList";
import { MessageView } from "@/components/messages/MessageView";
import { Conversation } from "@/types/messages.types";

const DriverMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv1",
      recipientId: "team1",
      recipientName: "Velocity Racing",
      recipientAvatar: undefined,
      recipientType: "team",
      lastMessage: "Thanks for your application. Can we schedule a call to discuss?",
      lastMessageTime: "2025-05-06T14:30:00",
      unreadCount: 2,
      messages: [
        {
          id: "msg1",
          senderId: "driver1",
          senderName: "You",
          content: "Hello, I'm interested in your seat for the European GT Challenge.",
          timestamp: "2025-05-06T13:45:00",
          isRead: true,
        },
        {
          id: "msg2",
          senderId: "team1",
          senderName: "Velocity Racing",
          content: "Hi there, thank you for your interest! Do you have any GT4 experience?",
          timestamp: "2025-05-06T14:00:00",
          isRead: true,
        },
        {
          id: "msg3",
          senderId: "driver1",
          senderName: "You",
          content: "Yes, I've completed two seasons in GT4 with multiple podium finishes.",
          timestamp: "2025-05-06T14:15:00",
          isRead: true,
        },
        {
          id: "msg4",
          senderId: "team1",
          senderName: "Velocity Racing",
          content: "Thanks for your application. Can we schedule a call to discuss?",
          timestamp: "2025-05-06T14:30:00",
          isRead: false,
        },
      ],
    },
    {
      id: "conv2",
      recipientId: "team2",
      recipientName: "Apex Motorsport",
      recipientAvatar: undefined,
      recipientType: "team",
      lastMessage: "Your seat for the ADAC GT Masters has been confirmed.",
      lastMessageTime: "2025-05-05T16:20:00",
      unreadCount: 0,
      messages: [
        {
          id: "msg5",
          senderId: "team2",
          senderName: "Apex Motorsport",
          content: "Hello, we've received your application for the ADAC GT Masters.",
          timestamp: "2025-05-05T15:30:00",
          isRead: true,
        },
        {
          id: "msg6",
          senderId: "team2",
          senderName: "Apex Motorsport",
          content: "Your seat for the ADAC GT Masters has been confirmed.",
          timestamp: "2025-05-05T16:20:00",
          isRead: true,
        },
      ],
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const updatedMessage = {
      id: `msg${Date.now()}`,
      senderId: "driver1",
      senderName: "You",
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          lastMessage: newMessage.trim(),
          lastMessageTime: new Date().toISOString(),
          messages: [...conv.messages, updatedMessage],
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation({
      ...selectedConversation,
      lastMessage: newMessage.trim(),
      lastMessageTime: new Date().toISOString(),
      messages: [...selectedConversation.messages, updatedMessage],
    });
    setNewMessage("");
  };

  const handleConversationSelect = (conversation: Conversation) => {
    // Mark all messages as read
    const updatedConversations = conversations.map(conv => {
      if (conv.id === conversation.id) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(msg => ({ ...msg, isRead: true })),
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(conversation);
  };

  return (
    <DashboardLayout title="Messages" userType="driver">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex h-[calc(100vh-180px)]">
        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          loading={loading}
          onSelectConversation={handleConversationSelect}
        />
        
        <MessageView
          conversation={selectedConversation}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          sendingMessage={false}
        />
      </div>
    </DashboardLayout>
  );
};

export default DriverMessages;
