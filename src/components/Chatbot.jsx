import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, AlertCircle } from "lucide-react";
import { API_URL } from "../config";
import "./Chatbot.css";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      content: "Hello! I am Aura, your virtual wellness assistant. How can I help you relax or plan your visit to Aura Spa & Salon today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input.trim();
    if (!text) return;

    if (!textToSend) {
      setInput("");
    }

    // Append user message
    const updatedMessages = [...messages, { role: "user", content: text }];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const history = updatedMessages.slice(0, -1).map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history,
        }),
      });

      if (!res.ok) {
        throw new Error("Server error responding to message");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "model", content: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "I'm having trouble connecting to my relaxation database right now. Please try again or head over to our contact form to drop us a message!",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (suggestionText) => {
    handleSend(suggestionText);
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Toggle Button */}
      <button
        className={`chatbot-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && <span className="chatbot-tooltip">Chat with Aura AI</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <Sparkles size={16} className="sparkle-icon" />
              </div>
              <div>
                <h4>Aura AI Assistant</h4>
                <div className="chatbot-status">
                  <span className="status-dot"></span>
                  <span>Serenity Guide • Online</span>
                </div>
              </div>
            </div>
            <button
              className="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbot-message-row ${msg.role === "user" ? "user-row" : "bot-row"}`}
              >
                {msg.role === "model" && (
                  <div className="message-avatar">A</div>
                )}
                <div
                  className={`chatbot-message-bubble ${
                    msg.role === "user"
                      ? "user-bubble"
                      : msg.isError
                      ? "error-bubble"
                      : "bot-bubble"
                  }`}
                >
                  {msg.isError && <AlertCircle size={14} className="err-icon" />}
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message-row bot-row">
                <div className="message-avatar">A</div>
                <div className="chatbot-message-bubble bot-bubble typing-bubble">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Panel */}
          <div className="chatbot-suggestions">
            <button
              onClick={() => handleSuggestion("What treatments and prices do you offer?")}
              disabled={isLoading}
            >
              🌸 Services & Pricing
            </button>
            <button
              onClick={() => handleSuggestion("How do I book an appointment?")}
              disabled={isLoading}
            >
              📅 How to Book
            </button>
            <button
              onClick={() => handleSuggestion("Where are your salons located and what are the timings?")}
              disabled={isLoading}
            >
              📍 Locations & Hours
            </button>
            <button
              onClick={() => handleSuggestion("What is your cancellation and refund policy?")}
              disabled={isLoading}
            >
              📝 Cancellation Policy
            </button>
          </div>

          {/* Input Form */}
          <div className="chatbot-input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask Aura anything..."
              disabled={isLoading}
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="chatbot-send-btn"
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
