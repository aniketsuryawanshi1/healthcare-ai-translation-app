import React, { useState, useEffect } from "react";
import Split from "react-split";
import { Typography, Input, Button, List, Avatar } from "antd";
import { useDispatch, useSelector } from "react-redux";
import useLogout from "../../hooks/Authentication/useLogout";
import { Desc } from "../../components";
import { fetchPatients } from "../../store/slices/patientSlice";
import {
  fetchMessages,
  sendMessage,
  addMessage,
  clearMessages,
} from "../../store/slices/chatSlice";
import useChatWebSocket from "../../hooks/Healthcare/useChatWebSocket";

const { TextArea } = Input;

// New ChatMessage component with sender and receiver bubbles
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

const TestOnePage = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.chat.messages);
  const loading = useSelector((state) => state.chat.loading);
  const error = useSelector((state) => state.chat.error);
  const patientState = useSelector((state) => state.patients);

  const { handleLogout } = useLogout();

  const [input, setInput] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // WebSocket only active when patient selected
  const { send: wsSend } = useChatWebSocket(
    selectedPatientId,
    (data) => {
      dispatch(addMessage(data));
    },
    { enabled: !!selectedPatientId }
  );

  useEffect(() => {
    dispatch(fetchPatients());

    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (selectedPatientId) {
      dispatch(fetchMessages(selectedPatientId));
    } else {
      dispatch(clearMessages());
    }
  }, [dispatch, selectedPatientId]);

  const sendChatMessage = (text) => {
    if (!text.trim() || !selectedPatientId) return;

    dispatch(sendMessage({ userId: selectedPatientId, text }))
      .unwrap()
      .then(() => {
        wsSend({ text, sender: "me" });
        dispatch(addMessage({ text, sender: "me" }));
      })
      .catch(console.error);
  };

  const handleSend = () => {
    if (!selectedPatientId) return; // Don't send if no patient selected
    sendChatMessage(input);
    setInput("");
  };

  const handleVoiceSend = (text) => {
    if (!selectedPatientId) return;
    sendChatMessage(text);
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatientId(patient.user.id);
    dispatch(clearMessages());
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
        {/* Left Panel */}
        <div style={{ overflow: "hidden", height: "100%", padding: "10px" }}>
          <Desc text="Voice Assistant" onSendMessage={handleVoiceSend} />
          <Button
            type="primary"
            danger
            onClick={handleLogout}
            style={{ marginTop: 16 }}
          >
            Logout
          </Button>

          <Typography.Title level={5} style={{ marginTop: "24px" }}>
            Patients
          </Typography.Title>

          {patientState.loading && <p>Loading patients...</p>}
          {patientState.error && (
            <p style={{ color: "red" }}>{patientState.error}</p>
          )}

          <div style={{ overflowY: "auto", maxHeight: "60vh", marginTop: 8 }}>
            <List
              itemLayout="horizontal"
              dataSource={patientState.patients}
              renderItem={(patient) => {
                const initials = `${patient.first_name?.[0] || ""}${
                  patient.last_name?.[0] || ""
                }`;
                const isSelected = patient.user.id === selectedPatientId;
                return (
                  <List.Item
                    onClick={() => handlePatientSelect(patient)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: isSelected ? "#e6f7ff" : undefined,
                      borderRadius: 5,
                      padding: 8,
                      marginBottom: 4,
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar style={{ backgroundColor: "#1890ff" }}>
                          {initials}
                        </Avatar>
                      }
                      title={`${patient.first_name} ${patient.last_name}`}
                      description={`User ID: ${patient.user.id}`}
                    />
                  </List.Item>
                );
              }}
            />
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
              Voice4Care
            </Typography.Title>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px",
              backgroundColor: "#fafafa",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            {!selectedPatientId ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "1.2rem",
                  color: "#999",
                  textAlign: "center",
                  paddingTop: 40,
                  paddingBottom: 40,
                }}
              >
                <p>Select a patient from the left to start chatting.</p>
                <p style={{ fontStyle: "italic", marginTop: 8 }}>
                  Voice4Care is here to assist you.
                </p>
              </div>
            ) : loading ? (
              <p>Loading messages...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : messages.length === 0 ? (
              <p>No messages yet. Start the conversation!</p>
            ) : (
              messages.map((msg, idx) => (
                <ChatMessage
                  key={idx}
                  text={msg.text}
                  sender={msg.sender || "other"}
                />
              ))
            )}
          </div>

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
              placeholder={
                selectedPatientId
                  ? "Type a message"
                  : "Select a patient to enable sending messages"
              }
              disabled={!selectedPatientId}
              style={{ marginRight: 8, resize: "none" }}
            />
            <Button
              type="primary"
              onClick={handleSend}
              disabled={!selectedPatientId || !input.trim()}
            >
              Send
            </Button>
          </div>
        </div>
      </Split>
    </div>
  );
};

export default TestOnePage;
