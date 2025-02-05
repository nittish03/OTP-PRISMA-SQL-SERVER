"use client";
import React, { useState, useEffect } from 'react';
import { MessageCircleIcon, X, Send, Loader2 } from 'lucide-react';

const PollutionChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your Pollution Information Assistant. What would you like to know about pollution?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateResponse = async (query) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });
      const data = await response.json();
      setIsLoading(false);
      return data.response || "I couldn't find specific information about that pollution topic.";
    } catch (error) {
      setIsLoading(false);
      return "I'm having trouble processing your query about pollution.";
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const aiResponseText = await generateResponse(input);
    const aiMessage = { text: aiResponseText, sender: 'ai' };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-all"
        >
          <MessageCircleIcon size={24} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-white rounded-lg shadow-xl border flex flex-col">
          <div className="bg-green-500 text-white p-3 flex justify-between items-center rounded-t-lg">
            <h3 className="font-bold">Green Sphere Chatbot</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.sender === 'user' 
                  ? 'bg-green-100 text-green-800 ml-auto' 
                  : 'bg-gray-100 text-gray-800 mr-auto'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="p-2 bg-gray-100 text-gray-800 rounded-lg flex items-center">
                <Loader2 className="mr-2 animate-spin" size={20} />
                Generating response...
              </div>
            )}
          </div>

          <div className="p-3 border-t flex">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about pollution..."
              className="flex-grow p-2 border rounded-l-lg"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              onClick={handleSendMessage}
              className="bg-green-500 text-white p-2 rounded-r-lg"
              disabled={isLoading}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PollutionChatbot;