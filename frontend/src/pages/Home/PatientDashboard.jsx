import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Select,
  Typography,
  Row,
  Col,
  Card,
  message,
  Input,
  Divider
} from "antd";
import {
  AudioOutlined,
  SendOutlined,
  UserOutlined,
  RobotOutlined
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";
import "./patientDashboard.css";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const PatientDashboard = () => {
  const [language, setLanguage] = useState("en-US");
  const [userText, setUserText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleLanguageChange = (value) => setLanguage(value);

  const handleSpeechInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      message.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setUserText(transcript);
    };

    recognition.onerror = (event) => {
      message.error("Speech recognition error: " + event.error);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleSendMessage = () => {
    if (!userText.trim()) {
      message.warning("Please say or type something.");
      return;
    }

    const reply =
      "Thank you for your message. We will assist you shortly.";
    setReplyText(reply);
    handleSpeak(reply);
  };

  const handleSpeak = (text) => {
    if (!window.speechSynthesis) {
      message.error("Speech synthesis not supported.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    setIsSpeaking(true);

    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="dashboard-container">
      <Title level={2} className="dashboard-title">
        🩺 Patient Interaction Panel
      </Title>
      <Row gutter={[24, 24]} justify="center" className="dashboard-content">
        <Col xs={24} md={10} data-aos="fade-right">
          <Card
            className="interaction-card"
            title={
              <>
                <UserOutlined /> Patient Communication
              </>
            }
            bordered={false}
            hoverable
          >
            <Text strong>Select Language:</Text>
            <Select
              defaultValue="en-US"
              onChange={handleLanguageChange}
              size="large"
              className="lang-select"
              style={{ width: "100%", marginBottom: 16 }}
            >
              <Option value="en-US">English</Option>
              <Option value="hi-IN">Hindi</Option>
              <Option value="es-ES">Spanish</Option>
              <Option value="fr-FR">French</Option>
            </Select>

            <Button
              block
              icon={<AudioOutlined />}
              type="primary"
              size="large"
              className="btn-speak"
              onClick={handleSpeechInput}
              style={{ marginBottom: 16 }}
            >
              Tap to Speak
            </Button>

            <Input.TextArea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              rows={4}
              placeholder="Your message will appear here..."
              className="user-textbox"
              style={{ marginBottom: 16 }}
            />

            <Button
              block
              icon={<AudioOutlined />}
              type="default"
              size="large"
              className="btn-listen"
              onClick={() => handleSpeak(userText)}
              style={{ marginBottom: 16 }}
              disabled={!userText.trim()}
            >
              Listen to Your Message
            </Button>

            <Button
              block
              icon={<SendOutlined />}
              type="primary"
              size="large"
              className="btn-send"
              onClick={handleSendMessage}
            >
              Send Message
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={10} data-aos="fade-left">
          <Card
            className="reply-card"
            title={
              <>
                <RobotOutlined /> Healthcare Response
              </>
            }
            bordered={false}
            hoverable
          >
            <Paragraph className="reply-text">
              {replyText || <Text type="secondary">Awaiting response...</Text>}
            </Paragraph>

            {replyText && (
              <>
                <Divider />
                <Button
                  block
                  icon={<AudioOutlined />}
                  type="default"
                  size="large"
                  className="speak-btn"
                  onClick={() => handleSpeak(replyText)}
                >
                  Listen Reply
                </Button>

                {isSpeaking && (
                  <div className="wave-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                )}
              </>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PatientDashboard;