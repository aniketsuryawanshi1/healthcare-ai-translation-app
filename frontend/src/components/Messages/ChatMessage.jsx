import React from 'react';
import { Typography } from 'antd';

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

export default ChatMessage;
