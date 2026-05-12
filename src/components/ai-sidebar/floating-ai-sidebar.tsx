"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, BookOpen, MessageCircle, Copy, Check, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// WCAG AAA High Contrast Colors (7:1+ contrast ratio)
const COLORS = {
  background: "#1a1a2e",
  surface: "#252542",
  border: "#4a4a6a",
  textPrimary: "#FFFFFF",
  textSecondary: "#E0E0E0",
  accent: "#FFD700",
  accentHover: "#FFC000",
  success: "#4ADE80",
  error: "#F87171",
};

interface FloatingAISidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText?: string | null;
  articleContent?: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function FloatingAISidebar({
  isOpen,
  onClose,
  selectedText,
  articleContent,
}: FloatingAISidebarProps) {
  const [activeTab, setActiveTab] = useState<"medical" | "summarize">("medical");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [summarizedContent, setSummarizedContent] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, summarizedContent]);

  // Handle selected text changes
  useEffect(() => {
    if (selectedText && selectedText.trim().length >= 2) {
      setActiveTab("medical");
    }
  }, [selectedText]);

  const handleCopy = useCallback(() => {
    const contentToCopy = summarizedContent || messages[messages.length - 1]?.content;
    if (contentToCopy) {
      navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [summarizedContent, messages]);

  const handleSummarizeRequest = useCallback(async () => {
    if (!articleContent) return;

    setActiveTab("summarize");
    setIsLoading(true);
    setSummarizedContent(null);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "summarize",
          messages: [{ role: "user", content: articleContent }],
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      // Read the stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      setSummarizedContent(fullText.trim());
    } catch (error) {
      console.error("Summarize error:", error);
      setSummarizedContent("Xin lỗi, đã xảy ra lỗi khi tóm tắt.");
    } finally {
      setIsLoading(false);
    }
  }, [articleContent]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedText: selectedText || undefined,
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) throw new Error("API request failed");

      // Read the stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fullText.trim(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, selectedText]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: 400 }}
            animate={{ x: 0 }}
            exit={{ x: 400 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col"
            style={{ backgroundColor: COLORS.background }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: COLORS.border }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  <Sparkles size={20} color="#1a1a2e" />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: COLORS.textPrimary }}>
                    Trợ lý Y khoa
                  </h2>
                  <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                    Claude 3.5 Sonnet
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-colors hover:bg-white/10"
                aria-label="Đóng thanh bên"
              >
                <X size={24} color={COLORS.textPrimary} />
              </button>
            </div>

            {/* Tab Navigation */}
            <div
              className="flex border-b"
              style={{ borderColor: COLORS.border }}
            >
              <button
                onClick={() => setActiveTab("medical")}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                  activeTab === "medical" ? "border-b-2" : ""
                }`}
                style={{
                  color: activeTab === "medical" ? COLORS.accent : COLORS.textSecondary,
                  borderColor: activeTab === "medical" ? COLORS.accent : "transparent",
                  backgroundColor: activeTab === "medical" ? COLORS.surface : "transparent",
                }}
              >
                <MessageCircle size={16} className="inline mr-2" />
                Giải thích thuật ngữ
              </button>
              <button
                onClick={() => setActiveTab("summarize")}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors ${
                  activeTab === "summarize" ? "border-b-2" : ""
                }`}
                style={{
                  color: activeTab === "summarize" ? COLORS.accent : COLORS.textSecondary,
                  borderColor: activeTab === "summarize" ? COLORS.accent : "transparent",
                  backgroundColor: activeTab === "summarize" ? COLORS.surface : "transparent",
                }}
              >
                <BookOpen size={16} className="inline mr-2" />
                Tóm tắt bài viết
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === "medical" && (
                <MedicalChatView
                  messages={messages}
                  input={input}
                  isLoading={isLoading}
                  selectedText={selectedText}
                  onInputChange={setInput}
                  onSendMessage={handleSendMessage}
                  onKeyDown={handleKeyDown}
                  messagesEndRef={messagesEndRef}
                />
              )}

              {activeTab === "summarize" && (
                <SummarizeView
                  articleContent={articleContent}
                  isLoading={isLoading}
                  summarizedContent={summarizedContent}
                  onSummarize={handleSummarizeRequest}
                  onCopy={handleCopy}
                  copied={copied}
                />
              )}
            </div>

            {/* Instructions Footer */}
            <div
              className="p-4 border-t text-center"
              style={{ borderColor: COLORS.border }}
            >
              <p className="text-xs" style={{ color: COLORS.textSecondary }}>
                Bôi đen văn bản để giải thích thuật ngữ y khoa
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Medical Chat View Component
interface MedicalChatViewProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  selectedText?: string | null;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

function MedicalChatView({
  messages,
  input,
  isLoading,
  selectedText,
  onInputChange,
  onSendMessage,
  onKeyDown,
  messagesEndRef,
}: MedicalChatViewProps) {
  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Selected Text Display */}
      {selectedText && (
        <Card
          className="p-4"
          style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: COLORS.accent }}>
            Từ đã chọn:
          </p>
          <p className="text-base font-bold" style={{ color: COLORS.textPrimary }}>
            "{selectedText}"
          </p>
        </Card>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-3 min-h-[200px]">
        {messages.length === 0 && !selectedText && (
          <div className="text-center py-8">
            <MessageCircle
              size={48}
              color={COLORS.textSecondary}
              className="mx-auto mb-3 opacity-50"
            />
            <p className="text-sm" style={{ color: COLORS.textSecondary }}>
              Hỏi về thuật ngữ y khoa hoặc bôi đen văn bản trên trang
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-xl ${
              message.role === "user"
                ? "ml-8 bg-blue-600/20 border border-blue-500/30"
                : "mr-4 bg-white/5 border border-white/10"
            }`}
          >
            <p
              className="text-sm leading-relaxed"
              style={{ color: message.role === "user" ? COLORS.accent : COLORS.textPrimary }}
            >
              {message.content}
            </p>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: COLORS.surface }}>
            <Loader2 size={20} color={COLORS.accent} className="animate-spin" />
            <span style={{ color: COLORS.textSecondary }}>Đang trả lời...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="flex gap-2 mt-auto">
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Hỏi về thuật ngữ y khoa..."
          className="flex-1 px-4 py-3 rounded-xl text-base"
          style={{
            backgroundColor: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.textPrimary,
          }}
        />
        <Button
          onClick={onSendMessage}
          disabled={isLoading || !input.trim()}
          style={{ backgroundColor: COLORS.accent, color: COLORS.background }}
          aria-label="Gửi tin nhắn"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}

// Summarize View Component
interface SummarizeViewProps {
  articleContent?: string;
  isLoading: boolean;
  summarizedContent: string | null;
  onSummarize: () => void;
  onCopy: () => void;
  copied: boolean;
}

function SummarizeView({
  articleContent,
  isLoading,
  summarizedContent,
  onSummarize,
  onCopy,
  copied,
}: SummarizeViewProps) {
  return (
    <div className="space-y-4">
      {/* Summarize Button */}
      <button
        onClick={onSummarize}
        disabled={!articleContent || isLoading}
        className="w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 text-base font-bold transition-all"
        style={{
          backgroundColor: articleContent ? COLORS.accent : COLORS.surface,
          color: articleContent ? COLORS.background : COLORS.textSecondary,
          cursor: articleContent ? "pointer" : "not-allowed",
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Đang tóm tắt...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Tóm tắt bài viết cho người già
          </>
        )}
      </button>

      {/* Loading State */}
      {isLoading && !summarizedContent && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: COLORS.surface }}>
          <Loader2 size={20} color={COLORS.accent} className="animate-spin" />
          <span style={{ color: COLORS.textSecondary }}>Đang xử lý...</span>
        </div>
      )}

      {/* Summarized Output */}
      {summarizedContent && (
        <Card
          className="p-4"
          style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold" style={{ color: COLORS.accent }}>
              Tóm tắt (Dễ hiểu):
            </p>
            <button
              onClick={onCopy}
              className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold transition-colors"
              style={{
                backgroundColor: copied ? COLORS.success : COLORS.border,
                color: copied ? COLORS.background : COLORS.textPrimary,
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Đã copy" : "Copy"}
            </button>
          </div>
          <p
            className="text-lg leading-relaxed"
            style={{ color: COLORS.textPrimary, fontSize: "18px" }}
          >
            {summarizedContent}
          </p>
        </Card>
      )}

      {/* No Content State */}
      {!articleContent && !summarizedContent && (
        <div className="text-center py-8">
          <BookOpen size={48} color={COLORS.textSecondary} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm" style={{ color: COLORS.textSecondary }}>
            Không có nội dung bài viết để tóm tắt
          </p>
        </div>
      )}
    </div>
  );
}

// Toggle Button Component (separate for use on page)
export function FloatingSidebarToggle({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
      style={{
        backgroundColor: isOpen ? COLORS.border : COLORS.accent,
      }}
      aria-label={isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
    >
      {isOpen ? (
        <X size={24} color={COLORS.textPrimary} />
      ) : (
        <Sparkles size={24} color={COLORS.background} />
      )}
    </motion.button>
  );
}