import React, { useState, useRef, useEffect } from 'react';

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! 👋 I'm your Manzil AI Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🎤 Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
  
    recognition.lang = "hi-IN";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setInputValue(text);
    };

    recognitionRef.current = recognition;
  }, []);

  // Start Mic
  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    } else {
      alert("Voice not supported in this browser");
    }
  };

  // 🔊 Text to Speech
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.lang = "hi-IN"; // 👈 Hindi voice
    speechSynthesis.speak(utterance);
  };


  // Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;

    const userMessage = {
      id: Date.now(),
      text: userText,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        body: JSON.stringify({ message: userText })
      });

      const data = await response.json();

      const botReply = data.success
        ? data.reply
        : "Sorry, something went wrong.";

      const botMessage = {
        id: Date.now() + 1,
        text: botReply,
        sender: 'bot'
      };

      setMessages(prev => [...prev, botMessage]);

      // 🔊 Speak bot reply
      speak(botReply);

    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: Date.now() + 2,
        text: "Network error. Please try again.",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Clear Chat
  const handleClearChat = () => {
    setMessages([
      { id: 1, text: "Hello! 👋 I'm your Manzil AI Assistant. How can I help you today?", sender: 'bot' }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col mb-4">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between rounded-t-2xl">
            <div className="flex gap-2 items-center">
              <span>🤖</span>
              <div>
                <h3 className="font-bold">Manzil</h3>
                <p className="text-xs">AI Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-lg max-w-xs ${
                  msg.sender === 'user'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && <p className="text-sm">Typing...</p>}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input */}
          <div className="p-3 border-t flex gap-2">

            <button onClick={handleClearChat}>🗑️</button>

            <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={listening ? "Listening..." : "Type message"}
                className="flex-1 border px-3 py-2 rounded-lg"
              />

              {/* 🎤 MIC */}
              <button
                type="button"
                onClick={startListening}
                className={`px-3 rounded ${
                  listening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200'
                }`}
              >
                🎤
              </button>

              {/* SEND */}
              <button type="submit" className="bg-indigo-500 text-white px-3 rounded">
                ➤
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 text-white rounded-full text-xl"
      >
        {isOpen ? '✕' : '💬'}
      </button>
    </div>
  );
}