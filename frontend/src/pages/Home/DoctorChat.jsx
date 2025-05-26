import React, { useEffect, useState } from "react";
import { Input, Button, List, Spin, Space, Tooltip } from "antd";
import { SoundOutlined, AudioMutedOutlined, SendOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage, addMessage } from "../../store/slices/chatSlice";
import useChatWebSocket  from "../../hooks/Healthcare/useChatWebSocket";

// TTS browser API
const synth = window.speechSynthesis;

const DoctorChat = ({ roomName, senderId, receiverId, languageCode }) => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chat);
  const [text, setText] = useState("");
  const [playingId, setPlayingId] = useState(null);

  // WebSocket
  const sendWS = useChatWebSocket(roomName, (data) => {
    if (data.message) {
      dispatch(addMessage({ text: data.message, sender: data.sender_id, receiver: data.receiver_id }));
    }
  });

  useEffect(() => {
    dispatch(fetchMessages(receiverId));
    // eslint-disable-next-line
  }, [receiverId]);

  // TTS: Play message
  const handlePlay = (msg, id) => {
    if (synth.speaking) synth.cancel();
    const utter = new SpeechSynthesisUtterance(msg);
    utter.lang = languageCode || "en-US";
    utter.onend = () => setPlayingId(null);
    synth.speak(utter);
    setPlayingId(id);
  };

  // TTS: Stop playback
  const handleStop = () => {
    synth.cancel();
    setPlayingId(null);
  };

  // Send message
  const handleSend = () => {
    if (!text.trim()) return;
    dispatch(sendMessage({ patientId: receiverId, text }));
    sendWS({ message: text, sender_id: senderId, receiver_id: receiverId });
    setText("");
  };

  if (loading) return <Spin />;
  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <List
        header={<b>Chat</b>}
        dataSource={messages}
        renderItem={(item, idx) => (
          <List.Item key={idx}>
            <Space>
              <span>
                <b>{item.sender === senderId ? "You" : "Patient"}:</b> {item.text}
              </span>
              <Tooltip title="Listen">
                <Button
                  icon={<SoundOutlined />}
                  size="small"
                  onClick={() => handlePlay(item.text, idx)}
                  disabled={playingId === idx}
                />
              </Tooltip>
              {playingId === idx && (
                <Tooltip title="Stop">
                  <Button
                    icon={<AudioMutedOutlined />}
                    size="small"
                    danger
                    onClick={handleStop}
                  />
                </Tooltip>
              )}
            </Space>
          </List.Item>
        )}
        style={{ marginBottom: 16, background: "#fff" }}
      />
      <Input.TextArea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={2}
        placeholder="Type your message..."
        style={{ marginBottom: 8 }}
      />
      <Space>
        <Tooltip title="Listen">
          <Button
            icon={<SoundOutlined />}
            onClick={() => handlePlay(text, "input")}
            disabled={!text}
          />
        </Tooltip>
        {playingId === "input" && (
          <Tooltip title="Stop">
            <Button
              icon={<AudioMutedOutlined />}
              danger
              onClick={handleStop}
            />
          </Tooltip>
        )}
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!text.trim()}
        >
          Send
        </Button>
      </Space>
    </div>
  );
};

export default DoctorChat;