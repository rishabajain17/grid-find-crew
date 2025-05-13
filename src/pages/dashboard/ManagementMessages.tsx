
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import ConversationList from "@/components/messages/ConversationList";
import MessageView from "@/components/messages/MessageView";
import { useMessages } from "@/hooks/useMessages";

const ManagementMessages = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { conversations } = useMessages();
  
  return (
    <DashboardLayout
      title="Messages"
      subtitle="Communicate with potential and current clients"
      navItems={[
        { label: "Dashboard", href: "/dashboard/management" },
        { label: "Services", href: "/dashboard/management/services" },
        { label: "Messages", href: "/dashboard/management/messages" },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="md:col-span-1 border rounded-lg overflow-hidden h-full">
          <ConversationList
            conversations={conversations} 
            selectedUserId={selectedUserId}
            onSelectUser={setSelectedUserId}
          />
        </div>
        <div className="md:col-span-2 border rounded-lg overflow-hidden h-full">
          <MessageView 
            selectedUserId={selectedUserId}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagementMessages;
