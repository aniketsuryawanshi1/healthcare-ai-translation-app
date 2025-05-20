import { useEffect, useRef } from 'react';

const useChatWebSocket = (roomName, onMessage) => {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new window.WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (onMessage) onMessage(data);
    };
    return () => ws.current && ws.current.close();
  }, [roomName, onMessage]);

  const send = (data) => {
    if (ws.current && ws.current.readyState === 1) {
      ws.current.send(JSON.stringify(data));
    }
  };

  return {send};
};

export default useChatWebSocket;