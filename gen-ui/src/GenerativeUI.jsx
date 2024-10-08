import React, { useEffect, useState } from 'react';


export default function GenerativeUI({ message }) {


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    const form = document.getElementById('interactiveForm');
    const button = document.getElementById('dynamic-button');

    const handleFormSubmit = async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('nameInput').value;
      const emailInput = document.getElementById('emailInput').value;
      const messageInput = document.getElementById('messageInput').value;

      setFormData({
        name: nameInput,
        email: emailInput,
        message: messageInput
      });

      if (button) {
        button.style.backgroundColor = 'green';
        button.innerText = "✅"
      }

      if (nameInput && emailInput && messageInput) {
        document.getElementById('nameInput').disabled = true;
        document.getElementById('emailInput').disabled = true;
        document.getElementById('messageInput').disabled = true;
      }

      const response = await fetch('http://localhost:3000/api/bike', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: `make me a bike order summary using this data ${formData}`}),
      })

      const data = await response.json()
      console.log('Form data submitted:', { name: nameInput, email: emailInput, message: messageInput });

      console.log('Structured JSON response', data.content.function_call.arguments);

    };

    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    return () => {
      if (form) {
        form.removeEventListener('submit', handleFormSubmit);
      }
    };
  }, [formData]);


  return (
    <div key={message.id} className={`message ${message.role}`}>
      <div className="message-content">
        <div className="message-header">
          {message.role === 'ai' ? (
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
              <path d="M12 18h.01"></path>
              <path d="M17 18h.01"></path>
              <path d="M7 18h.01"></path>
              <path d="M12 13h.01"></path>
              <path d="M17 13h.01"></path>
              <path d="M7 13h.01"></path>
              <path d="M12 8h.01"></path>
              <path d="M17 8h.01"></path>
              <path d="M7 8h.01"></path>
              <rect x="3" y="3" width="18" height="18" rx="2"></rect>
            </svg>
          ) : (
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
          )}
          <span>{message.role === 'ai' || message.role === 'image' ? 'AI' : 'You'}</span>
        </div>
        {message.role === 'image' ? (
          <img src={message.content} alt="Generated by AI" />
        ) : (
          <div id="dynamic-container" dangerouslySetInnerHTML={{ __html: message.content }} />
        )}
      </div>
    </div>
  );
};