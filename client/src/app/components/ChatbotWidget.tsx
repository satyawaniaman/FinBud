import React, { useState } from 'react';

const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Responsive width/height
  const width = typeof window !== "undefined" && window.innerWidth < 500 ? "95vw" : 400;
  const height = typeof window !== "undefined" && window.innerWidth < 700 ? "60vh" : 600;

  return (
    <>
      {/* Chat Icon */}
      {!open && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            cursor: 'pointer',
            background: '#fff',
            borderRadius: '50%',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            width: 56,
            height: 56,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setOpen(true)}
          title="Open Chatbot"
        >
          <span role="img" aria-label="chat" style={{ fontSize: 32 }}>💬</span>
        </div>
      )}

      {/* Chatbot Iframe */}
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 90,
            right: 24,
            width,
            height,
            zIndex: 1001,
            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
            borderRadius: 12,
            overflow: 'hidden',
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Close Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            background: '#f5f5f5',
            padding: '4px 8px',
            borderBottom: '1px solid #eee',
          }}>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 20,
                cursor: 'pointer',
              }}
              aria-label="Close Chatbot"
            >✖️</button>
          </div>
          {/* Iframe */}
          <div style={{ flex: 1, position: 'relative' }}>
            {loading && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.7)', zIndex: 2
              }}>
                <span>Loading...</span>
              </div>
            )}
            <iframe
              src="http://localhost:8501"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
              title="Financial Advisor Chatbot"
              onLoad={() => setLoading(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;