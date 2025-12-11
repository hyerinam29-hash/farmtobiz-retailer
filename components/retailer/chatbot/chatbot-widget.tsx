"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import type { ChatMessage } from "@/actions/retailer/chat-with-gemini";

interface ChatStateMessage extends ChatMessage {
  id: string;
}

const initialBotMessage: ChatStateMessage = {
  id: "welcome",
  role: "model",
  content: "안녕하세요! 궁금한 점을 물어보시면 도와드릴게요.",
};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatStateMessage[]>([
    initialBotMessage,
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isInquiryMode, setIsInquiryMode] = useState(false);
  const [inquiryTitle, setInquiryTitle] = useState("");
  const [inquiryContent, setInquiryContent] = useState("");
  const [inquiryOrderId, setInquiryOrderId] = useState("");
  const [isSavingInquiry, setIsSavingInquiry] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const hasInput = input.trim().length > 0;
  const hasInquiryInput =
    inquiryTitle.trim().length > 0 && inquiryContent.trim().length > 0;

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isOpen]);

  const safeMessagesForApi = useMemo(
    () =>
      messages.map<ChatMessage>((m) => ({
        role: m.role,
        content: m.content,
      })),
    [messages]
  );

  const toggleOpen = () => setIsOpen((prev) => !prev);
  const toggleInquiryMode = () => {
    setIsInquiryMode((prev) => !prev);
    setInquiryMessage(null);
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    console.log("💬 [chatbot-ui] 전송 시도");

    const userMessage: ChatStateMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/retailer/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...safeMessagesForApi, userMessage].map(({ role, content }) => ({
            role,
            content,
          })),
        }),
      });

      if (!response.ok) {
        console.error("❌ [chatbot-ui] 응답 실패", response.status);
        const errorText = await response.text();
        throw new Error(errorText || "챗봇 요청 실패");
      }

      const data = (await response.json()) as { reply?: string; error?: string };

      if (data.error || !data.reply) {
        const errorMessage = data.error || "챗봇 응답이 없습니다.";
        console.error("❌ [chatbot-ui] 에러 응답", errorMessage);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "model",
            content: errorMessage,
          },
        ]);
        return;
      }

      console.log("✅ [chatbot-ui] 응답 수신", { length: data.reply.length });

      const botMessage: ChatStateMessage = {
        id: crypto.randomUUID(),
        role: "model",
        content: data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("❌ [chatbot-ui] 전송 중 오류", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "model",
          content: "잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveInquiry = async () => {
    const title = inquiryTitle.trim();
    const content = inquiryContent.trim();
    if (!title || !content) {
      setInquiryMessage("제목과 내용을 입력해주세요.");
      return;
    }
    if (isSavingInquiry) return;

    setIsSavingInquiry(true);
    setInquiryMessage(null);
    console.log("✉️ [chatbot-ui] 문의 저장 시도", {
      hasOrderId: Boolean(inquiryOrderId.trim()),
    });

    try {
      const response = await fetch("/api/retailer/chatbot/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          orderId: inquiryOrderId.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        const message = data.error || "문의 저장에 실패했습니다.";
        console.error("❌ [chatbot-ui] 문의 저장 실패", message);
        setInquiryMessage(message);
        return;
      }

      console.log("✅ [chatbot-ui] 문의 저장 성공");
      setInquiryMessage("문의가 접수되었습니다. 관리자 확인 후 답변 예정입니다.");
      setInquiryTitle("");
      setInquiryContent("");
      setInquiryOrderId("");
      setIsInquiryMode(false);
    } catch (error) {
      console.error("❌ [chatbot-ui] 문의 저장 오류", error);
      setInquiryMessage("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSavingInquiry(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="w-[320px] sm:w-[360px] h-[480px] flex flex-col rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl transition-colors duration-200">
          <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 dark:text-green-200">
                <MessageCircle size={18} />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Gemini 챗봇
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  무엇을 도와드릴까요?
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleInquiryMode}
                className="text-xs font-semibold px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-200 border border-green-100 dark:border-green-800 transition-colors duration-200 hover:bg-green-100 dark:hover:bg-green-900"
              >
                문의 남기기
              </button>
            <button
              type="button"
              onClick={toggleOpen}
              className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 dark:focus-visible:outline-green-300"
              aria-label="챗봇 닫기"
            >
              <X size={18} />
            </button>
          </div>
          </header>

          {isInquiryMode ? (
            <div className="flex-1 px-4 py-3 space-y-3 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  제목
                </label>
                <input
                  value={inquiryTitle}
                  onChange={(event) => setInquiryTitle(event.target.value)}
                  placeholder="예: 주문 관련 문의"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 dark:focus-visible:outline-green-300"
                  maxLength={120}
                  disabled={isSavingInquiry}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  내용
                </label>
                <textarea
                  rows={4}
                  value={inquiryContent}
                  onChange={(event) => setInquiryContent(event.target.value)}
                  placeholder="문의 내용을 입력하세요."
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 dark:focus-visible:outline-green-300"
                  maxLength={1000}
                  disabled={isSavingInquiry}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  주문 ID (선택, 관련 문의 시)
                </label>
                <input
                  value={inquiryOrderId}
                  onChange={(event) => setInquiryOrderId(event.target.value)}
                  placeholder="예: 주문 상세 URL 마지막 UUID"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 dark:focus-visible:outline-green-300"
                  maxLength={100}
                  disabled={isSavingInquiry}
                />
              </div>
              {inquiryMessage && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {inquiryMessage}
                </p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSaveInquiry}
                  disabled={!hasInquiryInput || isSavingInquiry}
                  className="flex-1 h-10 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
                >
                  {isSavingInquiry ? "전송 중..." : "문의 전송"}
                </button>
                <button
                  type="button"
                  onClick={toggleInquiryMode}
                  className="h-10 px-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
                  disabled={isSavingInquiry}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                ref={listRef}
                className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 dark:bg-gray-900"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed transition-colors duration-200 ${
                        message.role === "user"
                          ? "bg-green-600 text-white"
                          : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-3">
                <div className="flex items-end gap-2">
                  <textarea
                    rows={2}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="메시지를 입력하세요"
                    className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 py-2 text-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500 dark:focus-visible:outline-green-300"
                    disabled={isSending}
                  />
                  <button
                    type="button"
                    onClick={handleSend}
                    disabled={!hasInput || isSending}
                    className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
                    aria-label="메시지 전송"
                  >
                    <Send size={18} />
                  </button>
                </div>
                {isSending && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    응답을 불러오는 중이에요...
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={toggleOpen}
        className="w-14 h-14 rounded-full bg-green-600 text-white shadow-xl flex items-center justify-center hover:bg-green-500 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-500"
        aria-label="챗봇 열기"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}

