import React from 'react';
import ChatScreen from './ChatScreen';

const PatientScreen = () => {
  const roomName = 'patient-room'; // Unique room name for the patient
  const userRole = 'patient';
  const patientId = 1; // Replace with dynamic patient ID from login or context

  return <ChatScreen roomName={roomName} userRole={userRole} patientId={patientId} />;
};

export default PatientScreen;