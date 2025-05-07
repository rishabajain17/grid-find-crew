
import DashboardLayout from "@/components/DashboardLayout";
import { ConversationList } from "@/components/messages/ConversationList";
import { MessageView } from "@/components/messages/MessageView";
import { useMessages } from "@/hooks/useMessages";

const TeamMessages = () => {
  const {
    conversations,
    selectedConversation,
    newMessage,
    loading,
    setNewMessage,
    handleSendMessage,
    handleConversationSelect,
    isSending,
    currentUser
  } = useMessages();

  return (
    <DashboardLayout title="Messages" userType="team">
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
          sendingMessage={isSending}
        />
      </div>
    </DashboardLayout>
  );
};

export default TeamMessages;
