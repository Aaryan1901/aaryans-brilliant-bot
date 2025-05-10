
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isLoading?: boolean;
}

const ChatMessage = ({ role, content, isLoading = false }: ChatMessageProps) => {
  const messageRef = useRef<HTMLDivElement>(null);
  
  // Automatically scroll to the bottom when a new message is added
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [content]);
  
  return (
    <div 
      ref={messageRef}
      className={cn(
        "slide-in",
        role === "user" ? "chat-bubble-user" : "chat-bubble-bot"
      )}
    >
      <div className="flex items-start">
        <div className="mr-2 flex-shrink-0 rounded-full bg-primary/10 p-2">
          {role === "user" ? (
            <div className="h-6 w-6 rounded-full bg-primary/80 flex items-center justify-center text-xs font-bold text-primary-foreground">
              U
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              AI
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="font-semibold mb-1">
            {role === "user" ? "You" : "Aaryan's Bot"}
          </p>
          <div className={cn("prose prose-invert max-w-none", {
            "typing-animation": isLoading
          })}>
            {isLoading ? "Thinking" : content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
