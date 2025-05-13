import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage } from '../store/slices/messageSlice';

const useMessages = () => {
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.message);

  const loadMessages = () => {
    dispatch(fetchMessages());
  };

  const sendNewMessage = (messageData) => {
    dispatch(sendMessage(messageData));
  };

  return { messages, loading, error, loadMessages, sendNewMessage };
};

export default useMessages;