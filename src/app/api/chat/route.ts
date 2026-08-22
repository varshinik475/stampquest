import { streamText, convertToModelMessages } from "ai";
import { AI_MODEL, SYSTEM_PROMPT } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const messages = body.messages;

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({
          error: "Invalid messages",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const result = streamText({
      model: AI_MODEL,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response(
      JSON.stringify({
        error: "Unable to generate response.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
