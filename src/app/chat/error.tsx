"use client";

import { useEffect } from "react";

export default function ChatError({
  error,
  reset,
}: {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="route-error">
      <div className="route-error-card">
        <div>⚠️</div>

        <h1>
          StampQuest is taking a break
        </h1>

        <p>
          We couldn't load the chat correctly.
        </p>

        <button onClick={reset}>
          Try again
        </button>
      </div>
    </main>
  );
}
