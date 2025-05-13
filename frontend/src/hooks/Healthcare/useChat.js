import { useDispatch, useSelector } from 'react-redux';
import { connectToRoom, disconnectFromRoom, addMessage, clearMessages } from '../store/slices/chatSlice';

const useChat = () => {
  const dispatch = useDispatch();
  const { messages, roomName, isConnected } = useSelector((state) => state.chat);

  const joinRoom = (room) => {
    dispatch(connectToRoom(room));
  };

  const leaveRoom = () => {
    dispatch(disconnectFromRoom());
  };

  const addNewMessage = (message) => {
    dispatch(addMessage(message));
  };

  const clearChatMessages = () => {
    dispatch(clearMessages());
  };

  return { messages, roomName, isConnected, joinRoom, leaveRoom, addNewMessage, clearChatMessages };
};

export default useChat;