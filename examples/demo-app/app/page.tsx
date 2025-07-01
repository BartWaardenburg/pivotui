'use client';

import React, { useState } from 'react';
import { PivotUIProvider, usePivotUI } from '@pivotui/react';

/* Demo chat interface component */
const ChatInterface: React.FC = () => {
  const { adaptiveRender, isReady } = usePivotUI();
  const [messages, setMessages] = useState<string[]>([
    'Here is a simple list of items:\n• First item\n• Second item\n• Third item',
    'This is a table with data:\nName | Age | City\nJohn | 25 | New York\nJane | 30 | London',
    'Show me a chart of sales data over time with categories A, B, and C',
    'This is just plain text content that should be displayed normally.',
    'Create a form with name, email, and message fields for user input'
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextMessage = () => {
    setCurrentIndex((prev) => (prev + 1) % messages.length);
  };

  const prevMessage = () => {
    setCurrentIndex((prev) => (prev - 1 + messages.length) % messages.length);
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '2rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '2rem',
        color: '#2d3748'
      }}>
        PivotUI Demo
      </h1>
      
      <div style={{ 
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f7fafc',
        borderRadius: '6px',
        border: '1px solid #e2e8f0'
      }}>
        <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>
          Status: {isReady ? '✅ Ready' : '⏳ Loading...'}
        </p>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#718096' }}>
          Message {currentIndex + 1} of {messages.length}
        </p>
      </div>

      <div style={{ 
        marginBottom: '1.5rem',
        display: 'flex',
        gap: '1rem',
        justifyContent: 'center'
      }}>
        <button 
          onClick={prevMessage}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Previous
        </button>
        <button 
          onClick={nextMessage}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4299e1',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Next →
        </button>
      </div>

      <div style={{
        padding: '1.5rem',
        border: '2px solid #e2e8f0',
        borderRadius: '8px',
        backgroundColor: '#ffffff'
      }}>
        <h3 style={{ 
          margin: '0 0 1rem 0', 
          color: '#2d3748',
          fontSize: '1.125rem'
        }}>
          AI Response (Auto-adapted UI):
        </h3>
        
        {isReady ? (
          adaptiveRender(messages[currentIndex], {
            enableAnalytics: true,
            fallback: 'text'
          })
        ) : (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            color: '#718096'
          }}>
            Loading PivotUI...
          </div>
        )}
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: '#f7fafc',
        borderRadius: '6px',
        fontSize: '0.875rem',
        color: '#4a5568'
      }}>
        <strong>How it works:</strong> PivotUI analyzes each AI response and automatically 
        selects the best UI component type (text, table, list, chart, etc.) to display 
        the content. Try clicking through the different messages to see various component 
        types in action!
      </div>
    </div>
  );
};

/* Main page component */
export default function Home() {
  return (
    <PivotUIProvider config={{ 
      developmentMode: true,
      enableAnalytics: true,
      fallbackComponent: 'text'
    }}>
      <div style={{ 
        minHeight: '100vh', 
        padding: '2rem 1rem',
        backgroundColor: '#f5f5f5'
      }}>
        <ChatInterface />
      </div>
    </PivotUIProvider>
  );
}