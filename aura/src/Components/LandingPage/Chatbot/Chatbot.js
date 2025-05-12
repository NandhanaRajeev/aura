import React, { useState } from 'react';
import './Chatbot.css';

const ChatbotPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSendMessage = async () => {
        if (input.trim()) {
            // User message
            const userMessage = { text: input, user: true };
            setMessages((prevMessages) => [...prevMessages, userMessage]);

            try {
                // Sending the message to the backend (not directly to Gemini)
                const response = await fetch('http://localhost:3001/api/gemini', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: input }), // Send input as the prompt
                });

                // Handle response from Gemini API
                const data = await response.json();
                const botReply = { text: data.candidates[0].content.parts[0].text, user: false }; // Adjust depending on Gemini's response structure
                setMessages((prevMessages) => [...prevMessages, botReply]);
            } catch (error) {
                // Error handling if the request fails
                setMessages((prevMessages) => [
                    ...prevMessages,
                    { text: "Failed to get a response from the bot.", user: false }
                ]);
            }

            setInput(''); // Clear the input field
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
