import React, { useState, useRef, useEffect } from 'react';
import Split from 'react-split';
import { Typography, Input, Button } from 'antd';

const { TextArea } = Input;

// Chat message bubble
const ChatMessage = ({ text, sender }) => {
  const handleListen = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: sender === 'me' ? 'flex-end' : 'flex-start',
        padding: '6px 12px',
        position: 'relative',
      }}
    >
      <div
        style={{
          backgroundColor: sender === 'me' ? '#1890ff' : '#f0f0f0',
          color: sender === 'me' ? 'white' : 'black',
          padding: '8px 12px',
          borderRadius: '15px',
          maxWidth: '70%',
          wordBreak: 'break-word',
          position: 'relative',
        }}
      >
        <Typography.Text>{text}</Typography.Text>
        <span
          role="img"
          aria-label="listen"
          onClick={handleListen}
          style={{
            cursor: 'pointer',
            marginLeft: 8,
            fontSize: 16,
            color: sender === 'me' ? '#e6f7ff' : '#555',
          }}
        >
          🔊
        </span>
      </div>
    </div>
  );
};

// Left panel component with speech features
const Desc = ({ text, onSendMessage }) => {
  const [voiceText, setVoiceText] = useState('');
  const [recognizing, setRecognizing] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }
        setVoiceText((prev) => prev + finalTranscript);
      };

      recognition.onend = () => {
        setRecognizing(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !recognizing) {
      recognitionRef.current.start();
      setRecognizing(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && recognizing) {
      recognitionRef.current.stop();
      setRecognizing(false);
    }
  };

  const handleSpeak = () => {
    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleChange = (e) => {
    setVoiceText(e.target.value);
  };

  const handleSend = () => {
    if (voiceText.trim()) {
      onSendMessage(voiceText);
      setVoiceText('');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography.Title level={5} type="secondary">{text}</Typography.Title>

      <TextArea
        rows={6}
        value={voiceText}
        onChange={handleChange}
        placeholder="Speak or type your message here"
        style={{ marginBottom: '10px' }}
      />

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button icon={<span role="img" aria-label="mic">🎤</span>} onClick={startListening}>
          Start
        </Button>
        <Button icon={<span role="img" aria-label="stop">🛑</span>} onClick={stopListening}>
          Stop
        </Button>
        <Button icon={<span role="img" aria-label="speak">🔊</span>} onClick={handleSpeak}>
          Speak
        </Button>
        <Button type="primary" onClick={handleSend}>
          Send
        </Button>
      </div>
    </div>
  );
};

const TestOnePage = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you?', sender: 'other' },
    { text: 'Hi! I wanted to check the status.', sender: 'me' },
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  const sendMessage = () => {
    if (input.trim() === '') return;
    setMessages((prev) => [...prev, { text: input, sender: 'me' }]);
    setInput('');
  };

  const handleVoiceSend = (text) => {
    setMessages((prev) => [...prev, { text, sender: 'me' }]);
  };

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  return (
    <div style={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <Split
        sizes={[40, 60]}
        minSize={100}
        gutterSize={10}
        direction="horizontal"
        style={{ display: 'flex', height: '100%' }}
      >
        {/* Left Panel with voice input */}
        <div style={{ overflow: 'hidden', height: '100%' }}>
          <Desc text="Voice Assistant" onSendMessage={handleVoiceSend} />
        </div>

        {/* Right Chat Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff' }}>
          {/* Header */}
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 10,
              backgroundColor: '#ffffff',
              padding: '12px 16px',
              borderBottom: '1px solid #ddd',
            }}
          >
            <Typography.Title level={4} style={{ margin: 0 }}>
              Chat Panel
            </Typography.Title>
          </div>

          {/* Chat messages */}
          <div
            ref={chatRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
              backgroundColor: '#fafafa',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            className="hide-scrollbar"
          >
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} text={msg.text} sender={msg.sender} />
            ))}
          </div>

          {/* Manual Input */}
          <div style={{ padding: '10px', display: 'flex', borderTop: '1px solid #ddd' }}>
            <TextArea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onPressEnter={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              placeholder="Type a message"
              style={{ marginRight: 8, resize: 'none' }}
            />
            <Button type="primary" onClick={sendMessage}>Send</Button>
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
