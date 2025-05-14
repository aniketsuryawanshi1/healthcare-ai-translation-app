import React from 'react';
import ChatScreen from './ChatScreen';

const DoctorScreen = () => {
  const roomName = 'doctor-room'; // Unique room name for the doctor
  const userRole = 'doctor';
  const patientId = 1; // Replace with dynamic patient ID from login or context

  return <ChatScreen roomName={roomName} userRole={userRole} patientId={patientId} />;
};

export default DoctorScreen;