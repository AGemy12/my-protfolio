import { adminMessages } from "@/lib/admin-data";
import { MessagesInbox } from "@/components/admin/messages-inbox";

export default async function MessagesPage() {
  const messages = await adminMessages();
  return <MessagesInbox messages={messages} />;
}
