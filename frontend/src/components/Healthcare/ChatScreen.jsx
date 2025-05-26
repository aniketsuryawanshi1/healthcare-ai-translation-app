// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchMessages, sendMessage } from "../../store/slices/messageSlice";
// import {useWebSocket, useLanguages,} from "../../hooks/Healthcare/index";


// const ChatScreen = ({ roomName, userRole, patientId }) => {
//   const [input, setInput] = useState('');
//   const [selectedLanguage, setSelectedLanguage] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const dispatch = useDispatch();
//   const { messages, loading, error } = useSelector((state) => state.messages);
//   const { languages, loading: languageLoading, error: languageError } = useLanguages();
//   const { sendMessage: sendWebSocketMessage } = useWebSocket(roomName);

//   // Fetch messages on component mount
//   useEffect(() => {
//     dispatch(fetchMessages(patientId));
//   }, [dispatch, patientId]);

//   // Handle sending a message
//   const handleSendMessage = () => {
//     if (input.trim()) {
//       const messageData = { patientId, text: input, language: selectedLanguage };
//       dispatch(sendMessage(messageData));
//       sendWebSocketMessage(messageData); // Send message via WebSocket
//       setInput('');
//     }
//   };

//   // Speech-to-Text (STT) functionality
//   const handleStartRecording = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//       alert('Speech recognition is not supported in this browser.');
//       return;
//     }

//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = selectedLanguage || 'en-US';
//     recognition.interimResults = false;

//     recognition.onstart = () => setIsRecording(true);
//     recognition.onend = () => setIsRecording(false);
//     recognition.onerror = (event) => console.error('Speech recognition error:', event);

//     recognition.onresult = (event) => {
//       const transcript = event.results[0][0].transcript;
//       setInput(transcript);
//     };

//     recognition.start();
//   };

//   // Text-to-Speech (TTS) functionality
//   const handleListenMessage = (message) => {
//     const utterance = new SpeechSynthesisUtterance(message);
//     utterance.lang = selectedLanguage || 'en-US';
//     window.speechSynthesis.speak(utterance);
//   };

//   return (
//     <div style={{ padding: '20px' }}>
//       <h2>{userRole === 'doctor' ? 'Doctor Chat' : 'Patient Chat'}</h2>

//       {/* Language Selection Dropdown */}
//       <div style={{ marginBottom: '20px' }}>
//         <label htmlFor="language-select">Select Language: </label>
//         <select
//           id="language-select"
//           value={selectedLanguage}
//           onChange={(e) => setSelectedLanguage(e.target.value)}
//           disabled={languageLoading}
//         >
//           <option value="">Select a language</option>
//           {languages.map((lang) => (
//             <option key={lang.language_code} value={lang.language_code}>
//               {lang.language_name}
//             </option>
//           ))}
//         </select>
//         {languageError && <p style={{ color: 'red' }}>Error loading languages: {languageError}</p>}
//       </div>

//       {/* Message List */}
//       <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'scroll' }}>
//         {loading && <p>Loading messages...</p>}
//         {error && <p>Error: {error}</p>}
//         {messages.map((msg) => (
//           <div key={msg.id} style={{ marginBottom: '10px' }}>
//             <strong>{msg.sender === 'doctor' ? 'Doctor' : 'Patient'}:</strong> {msg.text}
//             <button onClick={() => handleListenMessage(msg.text)} style={{ marginLeft: '10px' }}>
//               🔊 Listen
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Input Box */}
//       <div style={{ marginTop: '20px' }}>
//         <textarea
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Type your message or use the microphone"
//           rows="3"
//           style={{ width: '100%', padding: '10px' }}
//         />
//         <div style={{ marginTop: '10px' }}>
//           <button onClick={handleSendMessage} style={{ marginRight: '10px' }}>
//             Send
//           </button>
//           <button onClick={handleStartRecording} disabled={isRecording}>
//             {isRecording ? 'Recording...' : '🎤 Speak'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatScreen;

import React from 'react'

const ChatScreen = () => {
  return (
    <div>ChatScreen</div>
  )
}

export default ChatScreen