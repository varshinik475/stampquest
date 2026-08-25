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

type DestinationToolPart = {
  type: "tool-getDestinationInfo";
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error";

  input?: {
    destination?: string;
    reason?: string;
  };

  output?: DestinationResult;

  errorText?: string;
};

export function Chat() {
  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
  } = useChat();

  const messagesContainerRef =
    useRef<HTMLDivElement>(null);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const shouldAutoScroll =
    useRef(true);

  const isStreaming =
    status === "submitted" ||
    status === "streaming";

  /*
   * Automatically scroll to the newest
   * message while the user is near the bottom.
   */
  useEffect(() => {
    if (!shouldAutoScroll.current) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /*
   * Stop auto-scrolling when the user
   * manually scrolls upward.
   */
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

  /*
   * Send a new message.
   */
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

  /*
   * Retry the latest user message.
   */
  const handleRetry = async () => {
    const lastUserMessage =
      [...messages]
        .reverse()
        .find(
          (message) =>
            message.role === "user"
        );

    if (!lastUserMessage) {
      return;
    }

    const text =
      lastUserMessage.parts
        .filter(
          (part) => part.type === "text"
        )
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
    <section className="chat" aria-labelledby="chat-title">
      {/* Header */}
      <header className="chat-header">
        <div>
          <div className="brand">
            🎫 StampQuest
          </div>

          <h1 id="chat-title">
            Your AI travel guide
          </h1>

          <p>
            Discover destinations, plan
            adventures, and build your
            digital passport.
          </p>
        </div>
      </header>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="chat-messages"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-label="Conversation"
      >
        {/* First-run empty state */}
        {messages.length === 0 && (
          <EmptyState
            onSuggestion={(suggestion) =>
              setInput(suggestion)
            }
          />
        )}

        {/* Conversation */}
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
                  /*
                   * Streamed text.
                   */
                  if (
                    part.type === "text"
                  ) {
                    return (
                      <span
                        key={index}
                      >
                        {part.text}
                      </span>
                    );
                  }

                  /*
                   * Destination tool.
                   */
                  if (
                    part.type ===
                    "tool-getDestinationInfo"
                  ) {
                    return (
                      <DestinationToolPartView
                        key={index}
                        part={
                          part as DestinationToolPart
                        }
                      />
                    );
                  }

                  return null;
                }
              )}
            </div>
          </div>
        ))}

        {/* Thinking before first token */}
        {status === "submitted" && (
          <ThinkingIndicator />
        )}

        {/* Chat/API error */}
        {error && (
          <ChatError
            message={error.message}
            onRetry={handleRetry}
          />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
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
            className="stop-button"
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

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  onSuggestion,
}: {
  onSuggestion: (text: string) => void;
}) {
  const suggestions = [
    "Tell me about Tokyo",
    "What should I see in Paris?",
    "Suggest a weekend destination",
  ];

  return (
    <div className="chat-empty">
      <div className="empty-icon">
        🌍
      </div>

      <h2>
        Where will your passport take you?
      </h2>

      <p>
        Ask StampQuest AI about destinations,
        experiences, or your next adventure.
      </p>

      <div className="suggestion-list">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() =>
              onSuggestion(suggestion)
            }
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   THINKING INDICATOR
========================================================= */

function ThinkingIndicator() {
  return (
    <div className="thinking-status">
      <div className="thinking-dots">
        <span />
        <span />
        <span />
      </div>

      <span>
        StampQuest AI is thinking...
      </span>
    </div>
  );
}

/* =========================================================
   CHAT ERROR
========================================================= */

function ChatError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="chat-error"
      role="alert"
    >
      <div className="error-icon">
        ⚠️
      </div>

      <div className="error-content">
        <strong>
          Something went wrong
        </strong>

        <p>
          We couldn't finish generating
          the response. Your conversation
          is still here.
        </p>

        <button
          type="button"
          onClick={onRetry}
        >
          Try again
        </button>

        {message && (
          <details>
            <summary>
              Technical details
            </summary>

            <p>{message}</p>
          </details>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   TOOL LIFECYCLE
========================================================= */

function DestinationToolPartView({
  part,
}: {
  part: DestinationToolPart;
}) {
  /*
   * STATE 1:
   * Input is still streaming.
   */
  if (
    part.state ===
    "input-streaming"
  ) {
    return (
      <div className="tool-state tool-input-streaming">
        <div className="tool-state-icon">
          🌍
        </div>

        <div>
          <strong>
            Preparing destination search
          </strong>

          <p>
            Reading your request...
          </p>
        </div>
      </div>
    );
  }

  /*
   * STATE 2:
   * Input is available and the
   * tool is ready/running.
   */
  if (
    part.state ===
    "input-available"
  ) {
    return (
      <div className="tool-state tool-input-available">
        <div className="tool-state-icon">
          🔎
        </div>

        <div className="tool-state-content">
          <strong>
            Looking up destination
          </strong>

          <p>
            {part.input?.destination ??
              "Destination"}
          </p>
        </div>

        <span className="tool-badge">
          Searching
        </span>
      </div>
    );
  }

  /*
   * STATE 3:
   * Tool successfully returned data.
   */
  if (
    part.state ===
    "output-available"
  ) {
    if (!part.output) {
      return null;
    }

    return (
      <DestinationCard
        destination={part.output}
      />
    );
  }

  /*
   * STATE 4:
   * Tool execution failed.
   */
  if (
    part.state ===
    "output-error"
  ) {
    return (
      <div
        className="tool-state tool-error"
        role="alert"
      >
        <div className="tool-state-icon">
          ⚠️
        </div>

        <div>
          <strong>
            Destination lookup failed
          </strong>

          <p>
            {part.errorText ??
              "We couldn't retrieve destination information."}
          </p>

          <span className="error-help">
            Try asking about another
            destination.
          </span>
        </div>
      </div>
    );
  }

  return null;
}

/* =========================================================
   DESTINATION RESULT CARD
========================================================= */

function DestinationCard({
  destination,
}: {
  destination: DestinationResult;
}) {
  return (
    <article className="destination-card">
      <div className="destination-card-header">
        <div>
          <span className="destination-label">
            DESTINATION
          </span>

          <h3>
            {destination.destination}
          </h3>

          <p>
            {destination.country}
          </p>
        </div>

        <div className="stamp-icon">
          🎫
        </div>
      </div>

      <p className="destination-description">
        {destination.description}
      </p>

      <div className="destination-details">
        <div className="detail">
          <span>Best for</span>

          <div className="tag-list">
            {destination.bestFor.map(
              (item) => (
                <span
                  key={item}
                  className="tag"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        <div className="detail">
          <span>
            Recommended stay
          </span>

          <strong>
            {destination.recommendedDays}{" "}
            days
          </strong>
        </div>

        <div className="detail">
          <span>
            Stamp difficulty
          </span>

          <strong>
            {destination.stampDifficulty}
          </strong>
        </div>
      </div>

      <button
        type="button"
        className="add-stamp-button"
      >
        + Add to Passport
      </button>
    </article>
  );
}
