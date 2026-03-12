"use client";

export default function AIChatbot({
  isOpen,
  onClose,
  messages,
  input,
  setInput,
  onSend,
  isLoading
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "100px",
        left: "280px",
        width: "350px",
        height: "500px",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 2000
      }}
    >
      {/* HEADER */}
      <div
        style={{
          background: "#10B981",
          color: "white",
          padding: "15px",
          display: "flex",
          justifyContent: "space-between"
        }}
      >
        <span>🤖 Money Pilot AI</span>

        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer"
          }}
        >
          ✕
        </button>
      </div>

      {/* MESSAGES */}
      <div
        style={{
          flex: 1,
          padding: "15px",
          overflowY: "auto",
          background: "#f8fafc"
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <b>{msg.role === "assistant" ? "AI:" : "You:"}</b> {msg.content}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #eee"
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your finances..."
          style={{ flex: 1, padding: "8px" }}
        />

        <button
          onClick={onSend}
          disabled={isLoading}
          style={{
            marginLeft: "10px",
            padding: "8px 12px",
            background: "#10B981",
            color: "white",
            border: "none",
            borderRadius: "6px"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}