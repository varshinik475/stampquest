import {
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai";

import { AI_MODEL, SYSTEM_PROMPT } from "@/lib/ai";
import { destinationTool } from "@/lib/tools/destination-tool";
import { rateLimit } from "@/lib/rate-limit";

export const maxDuration = 30;

const MAX_BODY_BYTES = 32_000;
const MAX_MESSAGES = 30;
const MAX_MESSAGE_CHARS = 4_000;

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || "anonymous";
}

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return Response.json({ error: "Request is too large." }, { status: 413 });
    }

    const limit = rateLimit(getClientKey(request));
    if (!limit.allowed) {
      return Response.json(
        { error: "Too many requests. Please try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfter ?? 60) },
        }
      );
    }

    const body = await request.json();
    const messages = body?.messages as UIMessage[] | undefined;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "At least one message is required." }, { status: 400 });
    }

    if (messages.length > MAX_MESSAGES) {
      return Response.json({ error: "Conversation is too long." }, { status: 400 });
    }

    const hasOversizedMessage = messages.some((message) => {
      return JSON.stringify(message).length > MAX_MESSAGE_CHARS;
    });

    if (hasOversizedMessage) {
      return Response.json({ error: "A message is too long." }, { status: 400 });
    }

    const result = streamText({
      model: AI_MODEL,
      system: `${SYSTEM_PROMPT}

You have access to a destination information tool.

When the user asks for information about a specific
destination, use the getDestinationInfo tool instead
of inventing destination details.

After the tool returns, explain the result naturally
and help the user decide whether to add the destination
to their StampQuest passport.`,
      messages: await convertToModelMessages(messages),
      tools: {
        getDestinationInfo: destinationTool,
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    return Response.json(
      { error: "Unable to process the chat request." },
      { status: 500 }
    );
  }
}
