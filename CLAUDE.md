# CLAUDE.md

This file provides guidance for Claude Code when working with this repository.

## Project Overview

AI Chatbot Interface ("The Provisional v0.1") - A fine-tuned GPT-4.1 chatbot built with Next.js that generates poetry using associative logic and tonal ambiguity. The project demonstrates building custom AI chatbots with OpenAI's fine-tuning capabilities, as part of a course taught by Halim Madi at Brown University Library CDS.

## Tech Stack

- **Framework:** Next.js 13.4 with App Router
- **Language:** TypeScript 5.1
- **Styling:** Tailwind CSS 3.3
- **AI/ML:** OpenAI API 4.2, Vercel AI SDK 2.2
- **Runtime:** Vercel Edge Functions
- **Package Manager:** pnpm

## Project Structure

```
app/
├── api/chat/route.ts    # OpenAI streaming chat endpoint (Edge runtime)
├── page.tsx             # Main chat UI component (client-side)
├── layout.tsx           # Root layout with metadata
├── icons.tsx            # SVG icon components
└── globals.css          # Tailwind directives

scripts/
├── fine-tune.ts         # OpenAI fine-tuning orchestration
└── data.jsonl           # Training data (15 examples, JSONL format)

public/
└── sample-image.png     # Bot avatar image
```

## Commands

```bash
# Development
pnpm dev              # Start dev server at http://localhost:3000

# Production
pnpm build            # Build for production
pnpm start            # Run production server

# Fine-tuning
pnpm tune             # Run fine-tuning script with training data
```

## Key Files

- **`app/api/chat/route.ts`** - POST endpoint that streams OpenAI completions using the fine-tuned model (`ft:gpt-4.1-2025-04-14:brown-university-library-cds:weirding-cody:DAhGkXPQ`). Generation parameters (e.g. `max_tokens`, `temperature`, `top_p`) are not currently set and would be added to the `openai.chat.completions.create()` call here.
- **`app/page.tsx`** - React client component with `useChat` hook for message handling, auto-expanding input, and streaming response display
- **`scripts/fine-tune.ts`** - Uploads training data and monitors fine-tuning job progress
- **`scripts/data.jsonl`** - Training examples in OpenAI JSONL format with system/user/assistant message triplets

## Architecture Notes

- Uses Next.js App Router pattern (`/app` directory)
- Chat API runs on Vercel Edge Runtime for low latency
- Streaming responses via `OpenAIStream` and `StreamingTextResponse` from Vercel AI SDK
- Client-side state managed by `useChat` hook from `ai/react`
- System prompt defines the chatbot personality: "You are a poet whose writing favors associative logic, tonal slippage, and reflective ambiguity. You avoid narrative closure and allow thought to unfold indirectly through images and syntax."

## Environment Variables

Required:
- `OPENAI_API_KEY` - OpenAI API key for chat completions and fine-tuning

## Code Conventions

- TypeScript strict mode enabled
- Prettier with Tailwind CSS plugin for formatting
- Path alias: `@/*` maps to project root
- Client components marked with `"use client"` directive
