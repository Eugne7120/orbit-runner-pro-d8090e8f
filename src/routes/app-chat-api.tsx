import { createFileRoute } from "@tanstack/react-router";
import OpenAI from "openai";

export const Route = createFileRoute("/app-chat-api")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: "https://openrouter.ai/api/v1",
            defaultHeaders: {
              "HTTP-Referer": "https://0rbit.ai",
              "X-Title": "0RBIT",
            },
          });
          const { messages, model } = (await request.json()) as {
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
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`)
                    );
                  }
                }
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
                );
              } catch (err) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`)
                );
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
    },
  },
  component: () => null,
});
