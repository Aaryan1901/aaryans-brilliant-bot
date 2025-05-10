
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  id: string;
  messages: Message[];
}

const MODEL = "llama3-70b-8192";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const API_KEY = "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";

// Simple function to generate a unique ID without relying on uuid
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const useChat = () => {
  const [chats, setChats] = useState<Record<string, Chat>>(() => {
    const savedChats = localStorage.getItem("chats");
    return savedChats ? JSON.parse(savedChats) : {};
  });
  const [currentChatId, setCurrentChatId] = useState<string>(() => {
    const savedChatId = localStorage.getItem("currentChatId");
    if (savedChatId && chats[savedChatId]) {
      return savedChatId;
    }
    const newChatId = generateId();
    return newChatId;
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize current chat if it doesn't exist
  useEffect(() => {
    if (!chats[currentChatId]) {
      setChats(prev => ({
        ...prev,
        [currentChatId]: {
          id: currentChatId,
          messages: []
        }
      }));
    }
  }, [currentChatId, chats]);

  // Save chats to localStorage
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  // Save current chat ID to localStorage
  useEffect(() => {
    localStorage.setItem("currentChatId", currentChatId);
  }, [currentChatId]);

  const createNewChat = useCallback(() => {
    const newChatId = generateId();
    setChats(prev => ({
      ...prev,
      [newChatId]: {
        id: newChatId,
        messages: []
      }
    }));
    setCurrentChatId(newChatId);
    return newChatId;
  }, []);

  const selectChat = useCallback((chatId: string) => {
    if (chats[chatId]) {
      setCurrentChatId(chatId);
    }
  }, [chats]);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => {
      const newChats = { ...prev };
      delete newChats[chatId];
      
      // If we're deleting the current chat, create a new one
      if (chatId === currentChatId) {
        const newChatId = generateId();
        setCurrentChatId(newChatId);
        newChats[newChatId] = {
          id: newChatId,
          messages: []
        };
      }
      
      return newChats;
    });
  }, [currentChatId]);

  const clearCurrentChat = useCallback(() => {
    setChats(prev => ({
      ...prev,
      [currentChatId]: {
        id: currentChatId,
        messages: []
      }
    }));
  }, [currentChatId]);

  const sendMessage = useCallback(async (message: string) => {
    // Add user message to chat
    const userMessage: Message = { role: "user", content: message };
    setChats(prev => ({
      ...prev,
      [currentChatId]: {
        id: currentChatId,
        messages: [...(prev[currentChatId]?.messages || []), userMessage]
      }
    }));

    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [...(chats[currentChatId]?.messages || []), userMessage],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API Error ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = data.choices[0].message;

      setChats(prev => ({
        ...prev,
        [currentChatId]: {
          id: currentChatId,
          messages: [...(prev[currentChatId]?.messages || []), assistantMessage]
        }
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [chats, currentChatId, toast]);

  return {
    chats,
    currentChatId,
    currentChat: chats[currentChatId] || { id: currentChatId, messages: [] },
    isLoading,
    createNewChat,
    selectChat,
    deleteChat,
    clearCurrentChat,
    sendMessage
  };
};
