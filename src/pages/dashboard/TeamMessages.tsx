
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
  recipientType: "driver" | "engineer";
  relatedToId?: string;
  relatedToType?: "seat" | "job";
  relatedToTitle?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const TeamMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv1",
      recipientId: "driver1",
      recipientName: "John Smith",
      recipientAvatar: undefined,
      recipientType: "driver",
      relatedToId: "seat1",
      relatedToType: "seat",
      relatedToTitle: "European GT Challenge - GT4",
      lastMessage: "I'll be available for a call tomorrow at 2 PM",
      lastMessageTime: "2025-05-06T14:45:00",
      unreadCount: 1,
      messages: [
        {
          id: "msg1",
          senderId: "driver1",
          senderName: "John Smith",
          content: "Hello, I'm interested in your seat for the European GT Challenge.",
          timestamp: "2025-05-06T13:45:00",
          isRead: true,
        },
        {
          id: "msg2",
          senderId: "team1",
          senderName: "You",
          content: "Hi there, thank you for your interest! Do you have any GT4 experience?",
          timestamp: "2025-05-06T14:00:00",
          isRead: true,
        },
        {
          id: "msg3",
          senderId: "driver1",
          senderName: "John Smith",
          content: "Yes, I've completed two seasons in GT4 with multiple podium finishes.",
          timestamp: "2025-05-06T14:15:00",
          isRead: true,
        },
        {
          id: "msg4",
          senderId: "team1",
          senderName: "You",
          content: "Thanks for your application. Can we schedule a call to discuss?",
          timestamp: "2025-05-06T14:30:00",
          isRead: true,
        },
        {
          id: "msg5",
          senderId: "driver1",
          senderName: "John Smith",
          content: "I'll be available for a call tomorrow at 2 PM",
          timestamp: "2025-05-06T14:45:00",
          isRead: false,
        },
      ],
    },
    {
      id: "conv2",
      recipientId: "engineer1",
      recipientName: "Emily Johnson",
      recipientAvatar: undefined,
      recipientType: "engineer",
      relatedToId: "job1",
      relatedToType: "job",
      relatedToTitle: "Race Engineer - Full Season",
      lastMessage: "Thank you for considering my application.",
      lastMessageTime: "2025-05-05T16:30:00",
      unreadCount: 0,
      messages: [
        {
          id: "msg6",
          senderId: "team1",
          senderName: "You",
          content: "Hello Emily, we've received your application for the Race Engineer position.",
          timestamp: "2025-05-05T15:30:00",
          isRead: true,
        },
        {
          id: "msg7",
          senderId: "engineer1",
          senderName: "Emily Johnson",
          content: "Thank you for considering my application.",
          timestamp: "2025-05-05T16:30:00",
          isRead: true,
        },
      ],
    },
  ]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const updatedMessage: Message = {
      id: `msg${Date.now()}`,
      senderId: "team1",
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
            <Input placeholder="Search messages..." className="mb-4" />
            <h2 className="text-lg font-medium mb-4">Conversations</h2>
            <div className="space-y-2">
              {conversations.map((conversation) => (
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
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === "team1" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.senderId === "team1"
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
              ))}
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
                  disabled={!newMessage.trim()}
                >
                  Send
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
