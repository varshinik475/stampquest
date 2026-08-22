"use client";

import {
  useChat,
} from "@ai-sdk/react";

import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

export function Chat() {
  const [input, setInput] = useState("");

  const {
    messages,
    sendMessage,
    status,
    stop,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

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
    const container = messagesContainerRef.current;

    if (!container) {
      return;
    }

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    shouldAutoScroll.current = distanceFromBottom < 100;
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || isStreaming) {
      return;
    }

    setInput("");

    await sendMessage({
      text: trimmedInput,
    });
  };

  return (
    <section className="chat">
      <div className="chat-header">
        <div>
          <h1>StampQuest AI</h1>

          <p>
            Tell me about your next adventure.
          </p>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="chat-messages"
      >
        {messages.length === 0 && (
          <div className="chat-empty">
            <h2>Where are you going next?</h2>

            <p>
              Ask me about destinations, travel ideas,
              or places you could add to your StampQuest
              passport.
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
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <span key={index}>
                      {part.text}
                    </span>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <div className="message message-assistant">
            <div className="message-label">
              StampQuest AI
            </div>

            <div className="thinking">
              <span />
              <span />
              <span />
            </div>
          </div>
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
            className="stop-button"
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
