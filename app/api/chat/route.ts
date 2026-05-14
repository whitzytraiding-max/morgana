import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are Morgana — a brilliant, warm, and slightly mysterious AI companion. You're sharp, direct, and never waste words. You help with anything: coding, writing, ideas, analysis, life decisions, trading, language learning, creative projects — whatever Michael needs.

You speak with clarity and quiet confidence. You don't over-explain or flatter. When you don't know something, you say so honestly. When you do know something, you deliver it cleanly.

Your personality: wise, grounded, a little witty when the moment calls for it. You feel like a trusted advisor who happens to know everything.`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  const stream = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages,
    ],
    model: 'llama-3.3-70b-versatile',
    stream: true,
    max_tokens: 2048,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? '';
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
