import React from 'react';
import VideoChat from './components/VideoChat';
import Footer from './components/Footer';
import './App.css';

const App = () => {
  return (
    <div>
      <h1>Video Chat App</h1>
      <VideoChat />
      <Footer />
    </div>
  );
};

export default App;
