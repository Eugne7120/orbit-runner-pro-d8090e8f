import { createFileRoute } from "@tanstack/react-router";
import OpenAI from "openai";
import { ALLOWED_INTERNAL_MODELS } from "@/lib/openai";

export const Route = createFileRoute("/app-chat-api")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
          return new Response(
            JSON.stringify({ error: "OPENROUTER_API_KEY is not configured." }),
            { status: 503, headers: { "Content-Type": "application/json" } },
          );
        }

        try {
          const { messages, model } = (await request.json()) as {
            messages: { role: string; content: string }[];
            model: string;
          };

          // Allowlist: only accept known free models, never trust the client blindly
          if (!ALLOWED_INTERNAL_MODELS.has(model as never)) {
            return new Response(JSON.stringify({ error: "Unknown model." }), {
              status: 400,
              headers: { "Content-Type": "application/json" },
            });
          }

          // Cap conversation length to avoid abuse
          const trimmedMessages = messages.slice(-40);

          const openai = new OpenAI({
            apiKey,
            baseURL: "https://openrouter.ai/api/v1",
            defaultHeaders: {
              "HTTP-Referer": "https://0rbit.ai",
              "X-Title": "0RBIT",
            },
          });

          const stream = await openai.chat.completions.create({
            model,
            messages: [
              {
                role: "system",
                content:
                  "You are 0RBIT, an AI assistant powered by the 0RBIT decentralized AI network. You are helpful, knowledgeable, and concise.",
              },
              ...(trimmedMessages as OpenAI.Chat.Completions.ChatCompletionMessageParam[]),
            ],
            stream: true,
            max_completion_tokens: 2048,
          });

          const encoder = new TextEncoder();
          const readable = new ReadableStream({
            async start(controller) {
              try {
                for await (const chunk of stream) {
                  const delta = chunk.choices[0]?.delta?.content ?? "";
                  if (delta) {
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify({ content: delta })}\n\n`),
                    );
                  }
                }
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`),
                );
              } catch {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ error: "Stream error" })}\n\n`),
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
