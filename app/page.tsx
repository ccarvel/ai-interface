"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SendIcon } from "./icons";
import Textarea from "react-textarea-autosize";
import Image from "next/image";
import clsx from "clsx";

const examples = [
  "Write a short poem about the present moment. Let the sentence revise itself once. Avoid ending conclusively.",
  "Write a poem where abstraction feels social. Keep the setting indoors. Let the tone shift slightly midway.",
  "Write a poem that begins mid-thought. Allow syntax to guide the movement. End with uncertainty rather than resolution.",
];

export default function Home() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const [input, setInput] = useState("");

  const disabled = input.length === 0;

  function startChat(prompt: string) {
    sessionStorage.setItem("initial_prompt", prompt);
    router.push("/chat");
  }

  return (
    <main className="flex flex-col items-center justify-between pb-40">
      <div className="border-gray-200sm:mx-0 mx-5 mt-20 max-w-screen-md rounded-md border sm:w-full">
        <div className="flex flex-col space-y-4 p-7 sm:p-10">
          <Image
            src="/image.png"
            alt="image"
            width={40}
            height={40}
            className="h-20 w-20"
          />
          <h1 className="text-lg font-semibold text-black">
            The Provisional v0.1: LLM fine-tuned on gpt-4.1
          </h1>
          <p className="text-gray-500">
            I'm part of a series of computational experiments taught by{" "}
            <a
              href="https://linkin.bio/yallahalim/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 transition-colors hover:text-black"
            >
              Halim Madi
            </a>. I was built using{" "}
            <a
              href="https://openai.com/blog/gpt-3-5-turbo-fine-tuning-and-api-updates"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 transition-colors hover:text-black"
            >
              fine-tuned GPT4.
            </a>
          </p>
        </div>
        <div className="flex flex-col space-y-4 border-t border-gray-200 bg-gray-50 p-7 sm:p-10">
          {examples.map((example, i) => (
            <button
              key={i}
              className="rounded-md border border-gray-200 bg-white px-5 py-3 text-left text-sm text-gray-500 transition-all duration-75 hover:border-black hover:text-gray-700 active:bg-gray-50"
              onClick={() => startChat(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 flex w-full flex-col items-center space-y-3 bg-gradient-to-b from-transparent via-gray-100 to-gray-100 p-5 pb-3 sm:px-0">
        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) startChat(input.trim());
          }}
          className="relative w-full max-w-screen-md rounded-xl border border-gray-200 bg-white px-4 pb-2 pt-3 shadow-lg sm:pb-3 sm:pt-4"
        >
          <Textarea
            ref={inputRef}
            tabIndex={0}
            required
            rows={1}
            autoFocus
            placeholder="Send a message"
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
            <SendIcon
              className={clsx(
                "h-4 w-4",
                input.length === 0 ? "text-gray-300" : "text-white",
              )}
            />
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
