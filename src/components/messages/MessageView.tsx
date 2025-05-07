
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Conversation, Message } from "@/types/messages.types";

interface MessageViewProps {
  conversation: Conversation | null;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  sendingMessage: boolean;
}

export const MessageView = ({
  conversation,
  newMessage,
  setNewMessage,
  handleSendMessage,
  sendingMessage
}: MessageViewProps) => {
  
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!conversation) {
    return (
      <div className="w-2/3 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-700">No conversation selected</h3>
          <p className="text-gray-500 mt-2">Select a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-2/3 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center">
          <Avatar className="h-10 w-10">
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
          <div className="ml-3">
            <h2 className="text-md font-medium">{conversation.recipientName}</h2>
            <div className="flex items-center">
              <Badge variant="outline" className={`mr-2 text-xs ${
                conversation.recipientType === "driver" 
                  ? "border-racing-red text-racing-red" 
                  : "border-racing-blue text-racing-blue"
                }`}>
                {conversation.recipientType === "driver" ? "Driver" : "Engineer"}
              </Badge>
              {conversation.relatedToTitle && (
                <span className="text-xs text-gray-500">
                  Re: {conversation.relatedToTitle}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message List */}
      <MessageList messages={conversation.messages} />

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
            disabled={!newMessage.trim() || sendingMessage}
          >
            {sendingMessage ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
};

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}

export const MessageList = ({ 
  messages,
  currentUserId = "" // We'll get this from context in real usage
}: MessageListProps) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
        <p className="text-gray-500">Start a conversation</p>
      </div>
    );
  }
  
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.senderId === currentUserId ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[70%] rounded-lg p-3 ${
              message.senderId === currentUserId
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
  );
};
