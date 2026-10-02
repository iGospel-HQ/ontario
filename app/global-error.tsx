"use client";

/** Last-resort error boundary for failures in the root layout itself. */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>Something went wrong</h1>
        <p style={{ marginTop: "1rem", color: "#555" }}>Please try again in a moment.</p>
        <button
          onClick={reset}
          style={{
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            background: "#dc2626",
            color: "#fff",
            border: 0,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
