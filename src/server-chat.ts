import { createAPIFileRoute } from "@tanstack/react-start/api";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const APIRoute = createAPIFileRoute("/api/chat")({
  POST: async ({ request }) => {
    try {
      const { messages, model } = await request.json() as {
        messages: { role: string; content: string }[];
        model: string;
      };

      const stream = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are 0RBIT, an AI assistant powered by the 0RBIT decentralized AI network. You are helpful, knowledgeable, and concise.",
          },
          ...(messages as any),
        ],
        stream: true,
        max_completion_tokens: 4096,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const delta = chunk.choices[0]?.delta?.content ?? "";
              if (delta) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`));
              }
            }
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
          } catch (err) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`));
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    } catch (err) {
      console.error("Chat API error:", err);
      return new Response(JSON.stringify({ error: "Failed to process request" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
