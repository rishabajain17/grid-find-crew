
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { ConversationList } from "@/components/messages/ConversationList";
import { MessageView } from "@/components/messages/MessageView";
import { useMessages } from "@/hooks/useMessages";

const ManagementMessages = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { conversations } = useMessages();
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const selectedConversation = selectedUserId 
    ? conversations.find(conv => conv.id === selectedUserId) || null
    : null;

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    setSendingMessage(true);
    // In a real app, you would call an API to send the message
    setTimeout(() => {
      setSendingMessage(false);
      setNewMessage("");
    }, 500);
  };
  
  return (
    <DashboardLayout
      title="Messages"
      subtitle="Communicate with potential and current clients"
      userType="management"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="md:col-span-1 border rounded-lg overflow-hidden h-full">
          <ConversationList
            conversations={conversations} 
            selectedConversation={selectedConversation}
            loading={false}
            onSelectConversation={(conversation) => setSelectedUserId(conversation.id)}
          />
        </div>
        <div className="md:col-span-2 border rounded-lg overflow-hidden h-full">
          <MessageView 
            conversation={selectedConversation}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            sendingMessage={sendingMessage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagementMessages;
