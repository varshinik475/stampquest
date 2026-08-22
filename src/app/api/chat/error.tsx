"use client";

import { useEffect } from "react";

interface ChatErrorPageProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function ChatErrorPage({
  error,
  reset,
}: ChatErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="route-error">
      <div className="route-error-card">
        <div className="error-icon">
          ⚠️
        </div>

        <h1>
          StampQuest is taking a break
        </h1>

        <p>
          We couldn't load this page correctly.
          Your travel journey hasn't been lost.
        </p>

        <button
          type="button"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
