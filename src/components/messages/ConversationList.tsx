
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Conversation } from "@/types/messages.types";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  loading: boolean;
  onSelectConversation: (conversation: Conversation) => void;
}

export const ConversationList = ({
  conversations,
  selectedConversation,
  loading,
  onSelectConversation
}: ConversationListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conversation =>
    conversation.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                onClick={() => onSelectConversation(conversation)}
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
  );
};
