"use client";

import { useChat } from "@ai-sdk/react";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

interface DestinationResult {
  destination: string;
  country: string;
  description: string;
  bestFor: string[];
  stampDifficulty: string;
  recommendedDays: number;
  reason: string | null;
}

export function Chat() {
  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
  } = useChat();

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const messagesContainerRef =
    useRef<HTMLDivElement>(null);

  const shouldAutoScroll =
    useRef(true);

  const isStreaming =
    status === "streaming" ||
    status === "submitted";

  useEffect(() => {
    if (!shouldAutoScroll.current) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleScroll = () => {
    const container =
      messagesContainerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    shouldAutoScroll.current =
      distanceFromBottom < 100;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const text = input.trim();

    if (!text || isStreaming) {
      return;
    }

    setInput("");

    await sendMessage({
      text,
    });
  };

  const handleRetry = async () => {
    const lastUserMessage =
      [...messages]
        .reverse()
        .find(
          (message) => message.role === "user"
        );

    if (!lastUserMessage) {
      return;
    }

    const text = lastUserMessage.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("");

    if (!text) {
      return;
    }

    await sendMessage({
      text,
    });
  };

  return (
    <section className="chat">
      <header className="chat-header">
        <div>
          <h1>StampQuest AI</h1>

          <p>
            Discover destinations and build your
            digital travel passport.
          </p>
        </div>
      </header>

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="chat-messages"
      >
        {messages.length === 0 && (
          <EmptyState
            onSuggestion={(suggestion) => {
              setInput(suggestion);
            }}
          />
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.role === "user"
                ? "message-user"
                : "message-assistant"
            }`}
          >
            <div className="message-label">
              {message.role === "user"
                ? "You"
                : "StampQuest AI"}
            </div>

            <div className="message-content">
              {message.parts.map(
                (part, index) => {
                  if (part.type === "text") {
                    return (
                      <span key={index}>
                        {part.text}
                      </span>
                    );
                  }

                  if (
                    part.type ===
                    "tool-getDestinationInfo"
                  ) {
                    return (
                      <DestinationToolPart
                        key={index}
                        part={part}
                      />
                    );
                  }

                  return null;
                }
              )}
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <ThinkingIndicator />
        )}

        {error && (
          <ChatError
            message={error.message}
            onRetry={handleRetry}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="chat-form"
      >
        <input
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          placeholder="Ask about a destination..."
          disabled={isStreaming}
          aria-label="Message StampQuest AI"
        />

        {isStreaming ? (
          <button
            type="button"
            onClick={stop}
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
          >
            Send
          </button>
        )}
      </form>
    </section>
  );
}
