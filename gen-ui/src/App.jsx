import React, { useState, useRef, useEffect } from 'react'
import GenerativeUI from './GenerativeUI.jsx'

export default function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)


  useEffect(() => {
    const handleChatClick = (e) => {
      if (e.target.matches('.interactive-btn')) {
        console.log('Event Delegated, Interactive button clicked');
      }
    };

    document.addEventListener('click', handleChatClick);
    return () => {
      document.removeEventListener('click', handleChatClick);
    };
  }, []);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (input.trim()) {
      const userMessage = { role: 'user', content: input }
      setMessages((prev) => [...prev, userMessage])
      setInput('')

      try {
        const response = await fetch('http://localhost:3000/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        })

        const data = await response.json()


        if (data.content.includes('Image generated:')) {
          const imageUrl = data.content.split('Image generated: ')[1]
          setMessages((prev) => [...prev, { role: 'ai', content: `Image generated: ` }, { role: 'image', content: imageUrl }])
        } else {
          setMessages((prev) => [...prev, { role: 'ai', content: data.content }])
        }
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { role: 'ai', content: 'There was an error processing your request.' },
        ])
      }
    }
  }

  useEffect(scrollToBottom, [messages])

  return (
    <div className="cyber-chat">
      <div className="sidebar">
        <h2 className="sidebar-title">GenUI Demo</h2>
        <nav className="sidebar-nav">
          <button className="sidebar-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Profile
          </button>
          <button className="sidebar-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
            Settings
          </button>
        </nav>
      </div>
      <div className="chat-container">
        {messages.length === 0 && (
          <div className="centered-text" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            width: '100%'
          }}>
            <p style={{
              fontSize: '3rem',
              textAlign: 'center'
            }}><i>"<strong>vercel</strong>"</i></p>
          </div>
        )}
        <div className="messages">
          {messages.map((message, index) => (
            <GenerativeUI message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSend} className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="message-input"
          />
          <button type="submit" className="send-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span className="sr-only">Send</span>
          </button>
        </form>
      </div>
    </div>
  )
}
