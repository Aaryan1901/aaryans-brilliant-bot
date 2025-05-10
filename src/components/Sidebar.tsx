
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquarePlus, Trash2, MessageCircle } from "lucide-react";

interface Chat {
  id: string;
  messages: {
    role: "user" | "assistant";
    content: string;
  }[];
}

interface SidebarProps {
  chats: Record<string, Chat>;
  currentChatId: string;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

const Sidebar = ({ chats, currentChatId, onSelectChat, onNewChat, onDeleteChat }: SidebarProps) => {
  const getChatTitle = (chat: Chat) => {
    if (chat.messages.length === 0) return "New chat";
    const firstUserMessage = chat.messages.find(msg => msg.role === "user");
    if (!firstUserMessage) return "New chat";
    
    return firstUserMessage.content.length > 20 
      ? `${firstUserMessage.content.substring(0, 20)}...` 
      : firstUserMessage.content;
  };
  
  return (
    <div className="w-64 h-screen bg-sidebar bg-sidebar-background flex flex-col border-r border-sidebar-border">
      <div className="p-4">
        <Button 
          className="w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 flex gap-2 items-center"
          onClick={onNewChat}
        >
          <MessageSquarePlus size={16} />
          <span>New Chat</span>
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-2">
          {Object.entries(chats).map(([chatId, chat]) => (
            <div 
              key={chatId} 
              className={cn(
                "group flex justify-between items-center px-3 py-2 rounded-md text-sm",
                chatId === currentChatId 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
              )}
            >
              <button 
                className="flex items-center gap-2 overflow-hidden text-left w-full"
                onClick={() => onSelectChat(chatId)}
              >
                <MessageCircle size={16} />
                <span className="truncate">{getChatTitle(chat)}</span>
              </button>
              
              {chatId === currentChatId && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                  onClick={() => onDeleteChat(chatId)}
                >
                  <Trash2 size={14} />
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/70">
          <p className="font-semibold">SuperChat</p>
          <p className="mt-1">Using Groq API & llama3-70b-8192</p>
        </div>
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";

export default Sidebar;
