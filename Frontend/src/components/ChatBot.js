import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function ChatBot() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  // Initial greeting message
  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        { 
          sender: 'bot', 
          text: "Hi! I'm your Attendance Assistant..."
        }
      ]);
    }
  }, [chatHistory.length]);
  
  

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async () => {
    if (!question.trim()) return;

    const userMessage = { sender: 'user', text: question };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let res;
      const queryLower = question.toLowerCase();
      
      // Determine which endpoint to use based on query content
      if (queryLower.includes('roll number')) {
        // Direct database query for specific roll number
        res = await axios.post('http://localhost:3001/api/attendance/save', { question });
      } else if (queryLower.includes('lowest attendance') || queryLower.includes('worst attendance')) {
        // Special route for attendance rankings
        res = await axios.post('http://localhost:3001/api/attendance/stats', { question });
      } else {
        // AI-powered analysis for other questions
        res = await axios.post('http://localhost:3001/api/ai', { question });
      }

      const botMessage = { sender: 'bot', text: res.data.answer };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        sender: 'bot', 
        text: 'Sorry, I encountered an error processing your request. Please try again later.' 
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  const toggleChat = () => setIsOpen(!isOpen);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  // Suggest some example questions
  const suggestedQuestions = [
    "What's the attendance for roll number 1010?",
    "Who has the lowest attendance?",
    "Give me a summary of this week's attendance",
  ];

  const askSuggestion = (suggestion) => {
    setQuestion(suggestion);
    setTimeout(() => {
      handleSubmit();
    }, 100);
  };

  return (
    <div style={styles.wrapper}>
      {isOpen ? (
        <div style={styles.chatContainer}>
          <div style={styles.chatHeader}>
            <h3 style={styles.headerTitle}>AI Attendance Bot</h3>
            <button onClick={toggleChat} style={styles.closeButton}>×</button>
          </div>
          <div style={styles.chatBox} ref={chatBoxRef}>
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.message,
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? '#daf1ff' : '#f0f0f0'
                }}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div style={{...styles.message, alignSelf: 'flex-start', backgroundColor: '#f0f0f0'}}>
                <div style={styles.typingIndicator}>
                  <span style={styles.dot}></span>
                  <span style={styles.dot}></span>
                  <span style={styles.dot}></span>
                </div>
              </div>
            )}
          </div>
          
          {/* Suggestions */}
          {chatHistory.length <= 2 && (
            <div style={styles.suggestions}>
              {suggestedQuestions.map((suggestion, index) => (
                <button 
                  key={index} 
                  style={styles.suggestionBtn}
                  onClick={() => askSuggestion(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          <div style={styles.inputBox}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about attendance..."
              style={styles.input}
              disabled={isLoading}
            />
            <button 
              onClick={handleSubmit} 
              style={{...styles.button, opacity: isLoading ? 0.7 : 1}}
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <button onClick={toggleChat} style={styles.chatBubble}>
          <span style={styles.chatIcon}>💬</span>
        </button>
      )}
    </div>
  );
}

const styles = {
  wrapper: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1000
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '350px',
    height: '500px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white'
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    cursor: 'pointer'
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'column',
    padding: '15px',
    flexGrow: 1,
    overflowY: 'auto'
  },
  message: {
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '10px',
    maxWidth: '80%'
  },
  inputBox: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #eee'
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc'
  },
  button: {
    marginLeft: '10px',
    padding: '10px 15px',
    borderRadius: '4px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  },
  chatBubble: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
    border: 'none',
    cursor: 'pointer'
  },
  chatIcon: {
    fontSize: '24px'
  },
  suggestions: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    gap: '5px',
    borderTop: '1px solid #eee'
  },
  suggestionBtn: {
    padding: '8px',
    borderRadius: '15px',
    backgroundColor: '#f0f8ff',
    color: '#007bff',
    border: '1px solid #cce5ff',
    cursor: 'pointer',
    textAlign: 'left',
    fontSize: '12px'
  },
  typingIndicator: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px'
  },
  dot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#999',
    borderRadius: '50%',
    animation: 'bounce 1.5s infinite',
    display: 'inline-block'
  }
};

export default ChatBot;