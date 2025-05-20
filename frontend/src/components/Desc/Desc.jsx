import React, { useState, useRef, useEffect } from 'react';
import { Typography, Input, Button } from 'antd';

const { TextArea } = Input;

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

export default Desc;
