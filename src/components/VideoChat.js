import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const VideoChat = () => {
  const [roomName, setRoomName] = useState('');
  const [isFull, setIsFull] = useState(false);
  const [error, setError] = useState('');
  const userVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_SERVER_URL);
    console.log('Socket connected:', socket.current.id);

    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        userVideo.current.srcObject = mediaStream;
      } catch (error) {
        console.error('Error accessing the camera and microphone', error);
        setError('Access to camera and microphone is required.');
      }
    };

    getMedia();

    socket.current.on('room-created', (roomName) => {
      alert(`Room "${roomName}" created successfully.`);
    });

    socket.current.on('room-full', () => {
      setIsFull(true);
      alert('The room is full. Please try another room.');
    });

    socket.current.on('user-disconnected', () => {
      alert('A user has disconnected. You can continue chatting.');
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
      socket.current.off('room-full');
      socket.current.off('user-disconnected');
    };
  }, []);

  const handleRoomIdChange = (e) => {
    setRoomName(e.target.value);
    setError('');
  };

  const handleJoinRoom = () => {
    if (!roomName.trim()) {
      alert('Please enter a valid room name.');
      return;
    }

    console.log('Joining room:', roomName);
    socket.current.emit('join-room', roomName, socket.current.id);
  };

  return (
    <div className="video">
    <video ref={userVideo} autoPlay playsInline></video>
    <div className="controls">
      <input
        type="text"
        placeholder="Enter room name"
        value={roomName}
        onChange={handleRoomIdChange}
      />
      <button onClick={handleJoinRoom}>Join the room</button>
      {isFull && <p>The room is full</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  </div>
  );
};

export default VideoChat;
