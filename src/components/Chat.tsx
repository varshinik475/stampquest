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

  return (
    <section className="chat">
      <header className="chat-header">
        <h1>StampQuest AI</h1>

        <p>
          Discover destinations and build your
          digital travel passport.
        </p>
      </header>

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="chat-messages"
      >
        {messages.length === 0 && (
          <div className="chat-empty">
            <h2>
              Where are you going next?
            </h2>

            <p>
              Try asking:
            </p>

            <p>
              "Tell me about Tokyo"
            </p>
          </div>
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
                  /*
                   * Normal streamed text
                   */
                  if (part.type === "text") {
                    return (
                      <span key={index}>
                        {part.text}
                      </span>
                    );
                  }

                  /*
                   * Tool lifecycle
                   */
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

function ThinkingIndicator() {
  return (
    <div className="tool-status thinking-status">
      <span className="status-icon">●</span>

      <div>
        <strong>Thinking</strong>

        <p>
          StampQuest AI is preparing a response...
        </p>
      </div>
    </div>
  );
}

function DestinationToolPart({
  part,
}: {
  part: {
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
}) {
  /*
   * STATE 1
   *
   * The model is still generating
   * the tool input.
   */
  if (part.state === "input-streaming") {
    return (
      <div className="tool-card tool-input-streaming">
        <div className="tool-icon">🌍</div>

        <div>
          <strong>
            Preparing destination search
          </strong>

          <p>
            Reading destination details...
          </p>
        </div>
      </div>
    );
  }

  /*
   * STATE 2
   *
   * The input has been completely
   * generated and the tool is ready/running.
   */
  if (part.state === "input-available") {
    return (
      <div className="tool-card tool-input-available">
        <div className="tool-icon">🔎</div>

        <div>
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
   * STATE 3
   *
   * Tool successfully returned data.
   */
  if (part.state === "output-available") {
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
   * STATE 4
   *
   * Tool execution failed.
   */
  if (part.state === "output-error") {
    return (
      <div className="tool-card tool-error">
        <div className="tool-icon">⚠️</div>

        <div>
          <strong>
            Destination lookup failed
          </strong>

          <p>
            {part.errorText ??
              "We couldn't retrieve destination information."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return null;
}

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
        <div>
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

        <div>
          <span>Recommended stay</span>

          <strong>
            {destination.recommendedDays} days
          </strong>
        </div>

        <div>
          <span>Stamp difficulty</span>

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
