import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addMessage } from '../../store/slices/messageSlice';

const useWebSocket = (roomName) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);

  useEffect(() => {
    // Establish WebSocket connection
    socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);

    // Handle incoming messages
    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch(addMessage(data));
    };

    // Cleanup WebSocket connection
    return () => {
      socketRef.current.close();
    };
  }, [roomName, dispatch]);

  // Function to send a message
  const sendMessage = (message) => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return { sendMessage };
};

export default useWebSocket;