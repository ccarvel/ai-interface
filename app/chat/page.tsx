"use client";

import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react";
import clsx from "clsx";
import { LoadingCircle, SendIcon, UserIcon } from "../icons";
import Textarea from "react-textarea-autosize";
import Image from "next/image";

function downloadConversation(messages: { role: string; content: string }[]) {
  const text = messages
    .map((m) => (m.role === "user" ? "You:\n" : "Poem:\n") + m.content)
    .join("\n\n---\n\n");
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "poem.txt";
  a.click();
  URL.revokeObjectURL(url);
}

export default function ChatPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const hasAppended = useRef(false);

  const { messages, input, setInput, handleSubmit, append, isLoading } =
    useChat({
      onResponse: (response) => {
        if (response.status === 429) {
          window.alert("You have reached your request limit for the day.");
        }
      },
    });

  useEffect(() => {
    if (hasAppended.current) return;
    const prompt = sessionStorage.getItem("initial_prompt");
    if (prompt) {
      sessionStorage.removeItem("initial_prompt");
      hasAppended.current = true;
      append({ role: "user", content: prompt });
    }
  }, [append]);

  const disabled = isLoading || input.length === 0;
  const hasAssistantMessage = messages.some((m) => m.role === "assistant");

  return (
    <main className="flex flex-col items-center justify-between pb-40">
      <div className="fixed top-4 left-4 z-10 flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          ← Start over
        </button>
        {hasAssistantMessage && (
          <button
            onClick={() => downloadConversation(messages)}
            className="text-sm text-gray-500 hover:text-black transition-colors border border-gray-200 rounded px-3 py-1 bg-white hover:border-black"
          >
            Save as .txt
          </button>
        )}
      </div>

      {messages.length > 0 ? (
        messages.map((message, i) => (
          <div
            key={i}
            className={clsx(
              "flex w-full items-center justify-center border-b border-gray-200 py-8",
              message.role === "user" ? "bg-white" : "bg-gray-100",
            )}
          >
            <div className="flex w-full max-w-screen-md items-start space-x-4 px-5 sm:px-0">
              <div
                className={clsx(
                  message.role === "assistant"
                    ? "bg-white"
                    : "bg-black p-1.5 text-white",
                )}
              >
                {message.role === "user" ? (
                  <UserIcon />
                ) : (
                  <Image
                    src="/sample-image.png"
                    alt="sample-image"
                    width={36}
                    height={36}
                  />
                )}
              </div>
              <div className="prose prose-p:leading-relaxed mt-1 w-full break-words whitespace-pre-wrap">
                {message.content}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="mt-20 text-gray-400 text-sm">Generating poem...</div>
      )}

      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            placeholder={
              messages.length > 0 ? "Refine or continue..." : "Send a message"
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                formRef.current?.requestSubmit();
                e.preventDefault();
              }
            }}
            spellCheck={false}
            className="w-full pr-10 focus:outline-none"
          />
          <button
            className={clsx(
              "absolute inset-y-0 right-3 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
              disabled
                ? "cursor-not-allowed bg-white"
                : "bg-green-500 hover:bg-green-600",
            )}
            disabled={disabled}
          >
            {isLoading ? (
              <LoadingCircle />
            ) : (
              <SendIcon
                className={clsx(
                  "h-4 w-4",
                  input.length === 0 ? "text-gray-300" : "text-white",
                )}
              />
            )}
          </button>
        </form>
        <p className="text-center text-xs text-gray-400">
          Built with{" "}
          <a
            href="https://sdk.vercel.ai/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            Vercel AI SDK
          </a>
          ,{" "}
          <a
            href="https://openai.com/blog/gpt-3-5-turbo-fine-tuning-and-api-updates"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            OpenAI GPT-4.1, as part of a course taught by
          </a>{" "}
          Halim Madi.{" "}
          <a
            href="https://linkin.bio/yallahalim/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-black"
          >
            Learn to build your own
          </a>
          .
        </p>
      </div>
    </main>
  );
}
