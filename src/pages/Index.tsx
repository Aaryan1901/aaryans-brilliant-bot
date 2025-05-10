
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2, MessageSquarePlus, Loader } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import ChatMessage from "@/components/ChatMessage";
import ApiKeyForm from "@/components/ApiKeyForm";
import Sidebar from "@/components/Sidebar";
import { useChat } from "@/hooks/useChat";

const Index = () => {
  const {
    apiKey,
    saveApiKey,
    chats,
    currentChatId,
    currentChat,
    isLoading,
    createNewChat,
    selectChat,
    deleteChat,
    clearCurrentChat,
    sendMessage
  } = useChat();
  
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto focus the input when chat changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentChatId]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    sendMessage(input);
    setInput("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!apiKey) {
    return <ApiKeyForm onSubmit={saveApiKey} />;
  }
  
  return (
    <div className="flex h-screen overflow-hidden">
      {sidebarOpen && (
        <Sidebar 
          chats={chats}
          currentChatId={currentChatId}
          onSelectChat={selectChat}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
        />
      )}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4" 
              onClick={() => setSidebarOpen(prev => !prev)}
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1.5 7C1.22386 7 1 7.22386 1 7.5C1 7.77614 1.22386 8 1.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H1.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
              </svg>
            </Button>
            <h1 className="text-xl font-bold text-primary">Aaryan's SuperBot</h1>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearCurrentChat}
              className="flex items-center gap-1"
            >
              <Trash2 size={14} /> Clear
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={createNewChat}
              className="flex items-center gap-1"
            >
              <MessageSquarePlus size={14} /> New Chat
            </Button>
          </div>
        </header>
        
        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4">
          {currentChat.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <div className="mb-2 bg-primary/10 p-2 rounded-full">
                <svg width="24" height="24" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                  <path d="M12.5 3L2.5 3.00002C1.67157 3.00002 1 3.6716 1 4.50002V9.50003C1 10.3285 1.67157 11 2.5 11H7.50003C7.63264 11 7.75982 11.0527 7.85358 11.1465L10 13.2929V11.5C10 11.2239 10.2239 11 10.5 11H12.5C13.3284 11 14 10.3285 14 9.50003V4.5C14 3.67157 13.3284 3 12.5 3ZM2.49999 2.00002L12.5 2C13.8807 2 15 3.11929 15 4.5V9.50003C15 10.8807 13.8807 12 12.5 12H11V14.5C11 14.7022 10.8782 14.8845 10.6913 14.9619C10.5045 15.0393 10.2894 14.9965 10.1464 14.8536L7.29292 12H2.5C1.11929 12 0 10.8807 0 9.50003V4.50002C0 3.11931 1.11928 2.00003 2.49999 2.00002Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              </div>
              <h2 className="text-xl font-bold">How can I assist you today?</h2>
              <p className="text-muted-foreground mt-2 max-w-md">
                Ask me anything, or start with one of these examples:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4 w-full max-w-2xl">
                {[
                  "Write a short story about a robot discovering emotions",
                  "Explain quantum computing in simple terms",
                  "Create a healthy meal plan for a week",
                  "Help me debug this JavaScript code..."
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    className="text-sm justify-start h-auto p-4 text-left"
                    onClick={() => {
                      setInput(suggestion);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-w-3xl mx-auto">
              {currentChat.messages.map((message, index) => (
                <ChatMessage 
                  key={index} 
                  role={message.role} 
                  content={message.content} 
                />
              ))}
              {isLoading && (
                <ChatMessage 
                  role="assistant" 
                  content="" 
                  isLoading={true} 
                />
              )}
            </div>
          )}
        </ScrollArea>
        
        {/* Input Form */}
        <div className="p-4 border-t border-border">
          <form onSubmit={handleSubmit} className="flex space-x-2 max-w-3xl mx-auto">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
            </Button>
          </form>
          <div className="text-xs text-muted-foreground text-center mt-2">
            Powered by Groq + llama3-70b-8192 • API Key stored locally
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
