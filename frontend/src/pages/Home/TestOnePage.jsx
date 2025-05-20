import React, { useState, useEffect } from "react";
import Split from "react-split";
import { Typography, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import useLogout from "../../hooks/Authentication/useLogout";
import { Desc, ChatMessage } from "../../components";
import { fetchPatients } from "../../store/slices/patientSlice";
import {
  fetchMessages,
  sendMessage,
  addMessage,
  clearMessages,
} from "../../store/slices/chatSlice"; // path as needed
import useChatWebSocket from "../../hooks/Healthcare/useChatWebSocket"; // path as needed

const { TextArea } = Input;

const TestOnePage = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const loading = useSelector((state) => state.chat.loading);
  const error = useSelector((state) => state.chat.error);

  const patientState = useSelector((state) => state.patients);

  const { handleLogout } = useLogout();

  const [input, setInput] = useState("");
  const roomName = "general"; // You can set this dynamically if needed

  // WebSocket hook, receive new message and dispatch to redux
  const { send: wsSend } = useChatWebSocket(roomName, (data) => {
    dispatch(addMessage(data));
  });

  // Fetch initial messages on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;

    if (user && user.id) {
      dispatch(fetchMessages(user.id));
    }

    dispatch(fetchPatients());

    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  const sendChatMessage = (text) => {
    if (!text.trim()) return;
    // Send message via API
    dispatch(sendMessage({ patientId: roomName, text }))
      .unwrap()
      .then(() => {
        // After successful API send, send via websocket for others
        wsSend({ text, sender: "me" });
        // Also add the message locally so user sees it instantly
        dispatch(addMessage({ text, sender: "me" }));
      })
      .catch(console.error);
  };

  // Handler for manual text input send
  const handleSend = () => {
    sendChatMessage(input);
    setInput("");
  };

  // Handler for voice input send
  const handleVoiceSend = (text) => {
    sendChatMessage(text);
  };

  return (
    <div style={{ height: "100vh", width: "100%", overflow: "hidden" }}>
      <Split
        sizes={[40, 60]}
        minSize={100}
        gutterSize={10}
        direction="horizontal"
        style={{ display: "flex", height: "100%" }}
      >
        {/* Left Panel with voice input */}
        <div style={{ overflow: "hidden", height: "100%" }}>
          <Desc text="Voice Assistant" onSendMessage={handleVoiceSend} />
          <div style={{ padding: "10px" }}>
            <Button type="primary" danger onClick={handleLogout}>
              Logout
            </Button>

            {/* Patients List */}
            <Typography.Title level={5} style={{ marginTop: "16px" }}>
              Patients
            </Typography.Title>
            {patientState.loading && <p>Loading patients...</p>}
            {patientState.error && (
              <p style={{ color: "red" }}>{patientState.error}</p>
            )}
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {patientState.patients.map((patient) => (
                <li key={patient.id} style={{ padding: "4px 0" }}>
                  🧑‍⚕️ {patient.first_name} {patient.last_name} (ID: {patient.id})
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Chat Panel */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            backgroundColor: "#fff",
          }}
        >
          {/* Header */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              backgroundColor: "#ffffff",
              padding: "12px 16px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <Typography.Title level={4} style={{ margin: 0 }}>
              Chat Panel {loading && "(Loading...)"}{" "}
              {error && `(Error: ${error})`}
            </Typography.Title>
          </div>

          {/* Chat messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              backgroundColor: "#fafafa",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
            className="hide-scrollbar"
          >
            {messages.map((msg, idx) => (
              <ChatMessage
                key={idx}
                text={msg.text}
                sender={msg.sender || "other"}
              />
            ))}
          </div>

          {/* Manual Input */}
          <div
            style={{
              padding: "10px",
              display: "flex",
              borderTop: "1px solid #ddd",
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
              placeholder="Type a message"
              style={{ marginRight: 8, resize: "none" }}
            />
            <Button type="primary" onClick={handleSend}>
              Send
            </Button>
          </div>
        </div>
      </Split>

      {/* Scrollbar Hiding CSS */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default TestOnePage;
