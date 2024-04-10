// Chat.js

import React, { useState, useEffect } from 'react';
import './Chat.css'; // You can style your chat component here

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Fetch messages from backend when component mounts
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    // Fetch messages from backend API
    try {
      const response = await fetch('http://localhost:8000/getMessages');
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    // Send message to backend API
    try {
      await fetch('http://localhost:5000/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });
      setInput('');
      fetchMessages(); // Fetch updated messages after sending a new one
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default Chat;
