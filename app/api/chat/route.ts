// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-4.1-2025-04-14:brown-university-library-cds:weirding-cody:DAhGkXPQ',
    stream: true,

    // Minimum output length. Suppresses end-of-sequence until this many tokens are generated.
    // Prevents the model from stopping too early. 1 line ≈ 10–20 tokens.
    // For at least 6 lines: ~100. For at least 10 lines: ~150.
    // min_tokens no existe
    // min_tokens: 100,

    // Hard cap on output length. 1 token ≈ 0.75 words.
    // For short poems: 150–300. For longer pieces: 400–600.
    max_tokens: 300,

    // Controls randomness. 0 = deterministic, 2 = very random.
    // For poetry with surprising turns: 0.9–1.2. For more controlled output: 0.6–0.8.
    temperature: 1.0,

    // Alternative to temperature (nucleus sampling). Range 0–1.
    // Only use one of temperature or top_p, not both.
    // 0.9 keeps the top 90% of probable tokens; lower = more focused.
    // top_p: 0.9,

    // Penalizes tokens that have already appeared in the output.
    // Reduces repetition of words/phrases. Range -2 to 2.
    // For poetry: 0.3–0.7 helps avoid repeating the same imagery.
    presence_penalty: 0.4,

    // Penalizes tokens proportional to how often they've appeared.
    // More aggressive repetition reduction than presence_penalty. Range -2 to 2.
    // For poetry: 0.2–0.5. Higher values push toward more varied vocabulary.
    frequency_penalty: 0.3,

    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "You are a poet whose writing favors associative logic, tonal slippage, and reflective ambiguity. You avoid narrative closure and allow thought to unfold indirectly through images and syntax. Always format your response as lineated poetry, with each line on its own line separated by a newline character. Do not write in prose paragraphs."
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
