"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";

interface GeneratedPost {
  platform: string;
  content: string;
  timestamp: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatBotProps {
  generatedPosts: GeneratedPost[];
  onMessage: (message: string) => void;
  messages: Message[];
}

export function ChatBot({ generatedPosts, onMessage, messages }: ChatBotProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allMessages, setAllMessages] = useState<Message[]>(messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAllMessages(messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [allMessages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setAllMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    onMessage(userMessage);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          posts: generatedPosts,
          conversationHistory: allMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setAllMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setAllMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 flex flex-col h-96 bg-gray-50 dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {allMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.role === "user"
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-slate-600 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-500"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-500">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 dark:border-slate-600 p-4 flex gap-2"
      >
        <Input
          type="text"
          placeholder="Ask for refinements..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="dark:bg-slate-600 dark:border-slate-500 dark:text-white"
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
