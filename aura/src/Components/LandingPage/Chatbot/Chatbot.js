import React, { useState } from 'react';
import './Chatbot.css';
 // Make sure to create a corresponding CSS file if you need custom styles

const ChatbotPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = () => {
        if (input.trim()) {
            setMessages([...messages, { text: input, user: true }]);
            // You can integrate with an actual chatbot API here
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: "This is a response from the bot", user: false },
            ]);
            setInput('');
        }
    };

    return (
        <div className="chatbot-page">
            <h1>Chat with our Virtual Assistant</h1>
            <div className="chat-window">
                <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index} className={message.user ? "user-message" : "bot-message"}>
                            {message.text}
                        </div>
                    ))}
                </div>
                <div className="input-section">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>
        </div>
    );
};

export default ChatbotPage;
