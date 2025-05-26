import React, { useState } from "react";
import { Typography, Input, Button } from "antd";
import { Desc } from "../../components"; // Optional voice assistant component

const { TextArea } = Input;

const ChatMessage = ({ text, sender }) => {
  const isSenderMe = sender === "me";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isSenderMe ? "flex-end" : "flex-start",
        marginBottom: 8,
        padding: 8,
      }}
    >
      <div
        style={{
          maxWidth: "70%",
          backgroundColor: isSenderMe ? "#1890ff" : "#f0f0f0",
          color: isSenderMe ? "white" : "black",
          borderRadius: 12,
          padding: "8px 16px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          wordBreak: "break-word",
        }}
      >
        {text}
      </div>
    </div>
  );
};

const PatientDashboard = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { text: "Hello, how can I help you today?", sender: "other" },
    { text: "I have a question about my medication.", sender: "me" },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "me" }]);
    setInput("");
  };

  return (
    <div style={{ height: "100vh", display: "flex", width: "100%" }}>
      {/* Left Panel */}
      <div
        style={{
          width: "40%",
          backgroundColor: "#f7f7f7",
          padding: "20px",
          borderRight: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Typography.Title level={4}>Voice4Care</Typography.Title>
          <p style={{ marginTop: 12, marginBottom: 4 }}>Voice Assistant:</p>
          <Desc
            text="Ask a question"
            onSendMessage={(text) =>
              setMessages([...messages, { text, sender: "me" }])
            }
          />
        </div>
        <Button type="primary" danger onClick={() => alert("Logged out!")}>
          Logout
        </Button>
      </div>

      {/* Right Panel - Chat */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Chat Header */}
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #ddd",
            backgroundColor: "#ffffff",
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            Chat with Healthcare
          </Typography.Title>
        </div>

        {/* Messages Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px",
            backgroundColor: "#fafafa",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.length === 0 ? (
            <p>No messages yet.</p>
          ) : (
            messages.map((msg, idx) => (
              <ChatMessage key={idx} text={msg.text} sender={msg.sender} />
            ))
          )}
        </div>

        {/* Message Input */}
        <div
          style={{
            display: "flex",
            padding: "12px",
            borderTop: "1px solid #ddd",
            backgroundColor: "#ffffff",
          }}
        >
          <TextArea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={(e) => {
              e.preventDefault();
              handleSend();
            }}
            placeholder="Type a message..."
            style={{ marginRight: 8, resize: "none" }}
          />
          <Button type="primary" onClick={handleSend} disabled={!input.trim()}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
