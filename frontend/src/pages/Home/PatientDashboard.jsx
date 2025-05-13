import React, { useState, useRef } from "react";
import {
  Col,
  Row,
  Dropdown,
  Avatar,
  Select,
  Button,
  Input,
  Tooltip,
  Progress,
  Space,
  Menu,
} from "antd";
import {
  AudioOutlined,
  PauseOutlined,
  SendOutlined,
  DownOutlined,
  SoundOutlined,
  UserOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./patientDashboard.css";

const { TextArea } = Input;
const { Option } = Select;

const PatientDashboard = () => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const [healthcareMessages, setHealthcareMessages] = useState([]);
  const [playingMessageIndex, setPlayingMessageIndex] = useState(null);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = language;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    isListening ? stopListening() : startListening();
  };

  const handleSend = () => {
    if (transcript.trim()) {
      setHealthcareMessages((prev) => [
        ...prev,
        { text: transcript, progress: 0 },
      ]);
      setTranscript("");
    }
  };

  const handlePlayMessage = (index) => {
    setPlayingMessageIndex(index);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setHealthcareMessages((prev) => {
        const updated = [...prev];
        updated[index].progress = progress;
        return updated;
      });
      if (progress >= 100) {
        clearInterval(interval);
        setPlayingMessageIndex(null);
      }
    }, 200);
  };

  const userMenu = (
    <Menu
      onClick={({ key }) => {
        if (key === "3") alert("Logging out...");
      }}
      items={[
        {
          key: "1",
          icon: <UserOutlined />,
          label: "View Profile",
        },
        {
          key: "2",
          icon: <EditOutlined />,
          label: "Edit Profile",
        },
        {
          key: "3",
          icon: <LogoutOutlined />,
          label: "Logout",
        },
      ]}
    />
  );

  return (
    <section className="patient-dashboard">
      <Row className="top-bar" justify="space-between" align="middle">
        <Col>
          <Dropdown overlay={userMenu} trigger={["hover"]}>
            <div className="user-profile hover-glow">
              <Avatar size={64} src="https://via.placeholder.com/150" />
              <span className="username">
                Aniket Suryavanshi <DownOutlined />
              </span>
            </div>
          </Dropdown>
        </Col>
        <Col>
          <div className="healthcare-profile hover-glow">
            <Avatar size={64} src="https://via.placeholder.com/150" />
            <span className="username">Healthcare Provider</span>
          </div>
        </Col>
      </Row>

      <Row gutter={32} className="dashboard-body">
        <Col span={12} className="user-column">
          <h3 className="section-title">👤 Patient Input</h3>
          <Select
            className="language-select"
            value={language}
            onChange={(val) => setLanguage(val)}
          >
            <Option value="en-US">English (US)</Option>
            <Option value="hi-IN">Hindi</Option>
            <Option value="mr-IN">Marathi</Option>
          </Select>

          <div className="action-buttons">
            <Tooltip title={isListening ? "Pause Listening" : "Start Listening"}>
              <div className="circular-button" onClick={toggleListening}>
                {isListening ? <PauseOutlined /> : <AudioOutlined />}
              </div>
            </Tooltip>

            <Tooltip title="Send to Healthcare">
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleSend}
                disabled={!transcript}
              >
                Send
              </Button>
            </Tooltip>
          </div>

          <TextArea
            rows={4}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Your message appears here..."
          />
        </Col>

        <Col span={12} className="healthcare-column">
          <h3 className="section-title">🏥 Healthcare Responses</h3>
          <div className="chat-box">
            {healthcareMessages.map((msg, index) => (
              <div
                key={index}
                className="chat-bubble"
                onClick={() => handlePlayMessage(index)}
              >
                <SoundOutlined style={{ marginRight: 10 }} />
                {msg.progress > 0 ? (
                  <div style={{ width: "100%" }}>
                    <Progress percent={msg.progress} size="small" />
                    {msg.progress >= 100 && (
                      <p className="chat-text">{msg.text}</p>
                    )}
                  </div>
                ) : (
                  <span>Audio message (click to play)</span>
                )}
              </div>
            ))}
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default PatientDashboard;
