import {
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai";

import { AI_MODEL, SYSTEM_PROMPT } from "@/lib/ai";
import { destinationTool } from "@/lib/tools/destination-tool";

export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const {
      messages,
    }: {
      messages: UIMessage[];
    } = await request.json();

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

    return new Response(
      JSON.stringify({
        error: "Unable to process the chat request.",
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
