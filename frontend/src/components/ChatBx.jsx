import { useState } from "react";

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input) return;

    setMessages([...messages, { user: input }]);

    const res = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    setMessages(prev => [...prev, { bot: data.reply }]);
    setInput("");
  };

  return (
    <div style={{ width: "350px", border: "1px solid #ccc", padding: "10px" }}>
      <h3>🍔 AI Food Assistant</h3>

      <div style={{ height: "300px", overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.user ? "You" : "Bot"}:</b> {msg.user || msg.bot}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask for food..."
        style={{ width: "100%" }}
      />
      <button onClick={sendMessage} style={{ width: "100%" }}>
        Send
      </button>
    </div>
  );
};

export default ChatBox;
