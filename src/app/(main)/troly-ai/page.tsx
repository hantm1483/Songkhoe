/**
 * AI Assistant Page
 * Chat with Tâm - diabetes health companion
 */

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Page } from "@/components/layout/page";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

interface Conversation {
  id: string;
  created_at: string;
  message_count: number;
  last_message: {
    role: string;
    content: string;
    created_at: string;
  } | null;
}

// Initial greeting
const INITIAL_GREETING = {
  id: "welcome",
  role: "assistant" as const,
  content:
    "Xin chào! Tôi là Tâm, trợ lý AI đồng hành cùng bạn trong hành trình quản lý bệnh tiểu đường.\n\nTôi có thể giúp bạn:\n- Trả lời các câu hỏi về chế độ ăn uống\n- Tư vấn về lối sống lành mạnh\n- Giải thích các thuốc điều trị\n- Chia sẻ mẹo kiểm soát đường huyết\n\nBạn cần tôi hỗ trợ gì hôm nay?",
  created_at: new Date().toISOString(),
};

// Chat Message Component
function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-[85%]",
        isUser ? "ml-auto flex-row-reverse" : "mr-auto"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
          isUser
            ? "bg-primary text-on-primary"
            : "bg-secondary text-on-secondary"
        )}
      >
        {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div
        className={cn(
          "p-4 rounded-2xl",
          isUser
            ? "bg-primary text-on-primary rounded-br-sm"
            : "bg-surface-container text-on-surface rounded-bl-sm"
        )}
      >
        <div className="text-body-lg whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>
      </div>
    </div>
  );
}

// Chat Input Component
function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (message: string) => void;
  disabled?: boolean;
}) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          className={cn(
            "w-full min-h-touch-target px-4 py-3 rounded-xl resize-none",
            "bg-surface-container border border-outline",
            "text-body-lg text-on-surface placeholder:text-on-surface-variant",
            "focus:border-primary focus:ring-2 focus:ring-primary/20",
            "transition-all duration-200"
          )}
          rows={1}
          disabled={disabled}
        />
      </div>
      <Button variant="primary" onClick={handleSubmit} disabled={disabled || !input.trim()} className="flex-shrink-0">
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}

// Conversation List Component
function ConversationList({
  conversations,
  activeId,
  onSelect,
}: {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    } else if (days === 1) {
      return "Hôm qua";
    } else if (days < 7) {
      return date.toLocaleDateString("vi-VN", { weekday: "short" });
    } else {
      return date.toLocaleDateString("vi-VN", { month: "short", day: "numeric" });
    }
  };

  if (conversations.length === 0) {
    return (
      <div className="text-body-sm text-on-surface-variant p-3 text-center">
        Chưa có cuộc trò chuyện
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {conversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => onSelect(conv.id)}
          className={cn(
            "w-full flex items-center justify-between gap-2 p-3 rounded-lg text-left",
            "transition-colors duration-200",
            activeId === conv.id
              ? "bg-primary/10 text-primary"
              : "bg-surface-container-low hover:bg-surface-container text-on-surface"
          )}
        >
          <span className="text-body-sm truncate flex-1">
            {conv.last_message?.content.substring(0, 25) || "Cuộc trò chuyện mới"}
            {(conv.last_message?.content.length || 0) > 25 && "..."}
          </span>
          <span className="text-xs text-on-surface-variant flex-shrink-0">
            {formatDate(conv.created_at)}
          </span>
        </button>
      ))}
    </div>
  );
}

// Main Page Component
export default function TrolyAIPage() {
  const [supabase] = useState(() => createClient());
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    const { data, error } = await supabase
      .from("conversations")
      .select(`
        id,
        created_at,
        messages (
          id,
          role,
          content,
          created_at
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch conversations:", error);
      return;
    }

    const transformed = (data || []).map((conv) => {
      const msgs = (conv.messages as Array<{ id: string; role: string; content: string; created_at: string }>) || [];
      return {
        id: conv.id,
        created_at: conv.created_at,
        message_count: msgs.length,
        last_message: msgs[msgs.length - 1]
          ? {
              role: msgs[msgs.length - 1].role,
              content: msgs[msgs.length - 1].content,
              created_at: msgs[msgs.length - 1].created_at,
            }
          : null,
      };
    });

    setConversations(transformed);
  }, [supabase]);

  // Fetch messages for active conversation
  const fetchMessages = useCallback(
    async (conversationId: string) => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Failed to fetch messages:", error);
        return;
      }

      setMessages(
        (data || []).map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          created_at: m.created_at,
        }))
      );
    },
    [supabase]
  );

  // Create new conversation
  const createConversation = useCallback(async () => {
    const { data, error } = await supabase
      .from("conversations")
      .insert({})
      .select()
      .single();

    if (error) {
      console.error("Failed to create conversation:", error);
      return null;
    }

    await fetchConversations();
    return data?.id;
  }, [supabase, fetchConversations]);

  // Initialize
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle conversation selection
  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    await fetchMessages(id);
  };

  // Handle new conversation
  const handleNewConversation = async () => {
    const newId = await createConversation();
    if (newId) {
      setActiveConversationId(newId);
      setMessages([]);
      setError(null);
    }
  };

  const handleSendMessage = async (content: string) => {
    // If no active conversation, create one
    let convId = activeConversationId;
    if (!convId) {
      convId = await createConversation();
      if (!convId) return;
      setActiveConversationId(convId);
    }

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversation_id: convId,
          message: content,
          idempotency_key: `${convId}-${Date.now()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Bạn đã gửi quá nhiều tin nhắn. Vui lòng chờ vài phút.");
        }
        throw new Error(data.error || "Đã xảy ra lỗi. Vui lòng thử lại.");
      }

      // Add assistant response from API
      if (data.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.message.id,
            role: "assistant",
            content: data.message.content,
            created_at: data.message.created_at,
          },
        ]);
      }

      // Refresh conversations list
      await fetchConversations();
    } catch (err) {
      console.error("Chat error:", err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi. Vui lòng thử lại.");

      const fallbackResponse: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: err instanceof Error ? err.message : "Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại sau.",
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, fallbackResponse]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page title="Trợ lý AI">
      <div className="flex flex-col h-full">
        {/* Conversation List */}
        <div className="hidden md:block p-4 border-b border-outline-variant">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-headline-md text-on-surface">Tâm - AI</h2>
            <Button variant="ghost" onClick={handleNewConversation}>
              <Plus className="w-4 h-4 mr-1" />
              Tin mới
            </Button>
          </div>
          <ConversationList
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={handleSelectConversation}
          />
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-8 h-8 text-on-secondary" />
                </div>
                <h2 className="text-lg font-medium text-on-surface mb-2">
                  Chào bạn! Tôi là Tâm
                </h2>
                <p className="text-on-surface-variant mb-6 max-w-xs">
                  Tôi sẽ đồng hành cùng bạn trên hành trình quản lý tiểu đường.
                </p>
                <Button variant="primary" onClick={handleNewConversation}>
                  <Plus className="w-4 h-4 mr-1" />
                  Bắt đầu trò chuyện
                </Button>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="bg-secondary text-on-secondary w-8 h-8 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-surface-container p-4 rounded-2xl rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-error/10 text-error p-3 rounded-lg text-body-sm">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface-container-low border-t border-outline-variant">
          <ChatInput onSend={handleSendMessage} disabled={loading} />
        </div>
      </div>
    </Page>
  );
}