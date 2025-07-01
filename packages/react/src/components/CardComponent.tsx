import React from 'react';
import type { ComponentProps } from '../types.js';

/**
 * Card component for displaying summary content with optional title
 */
export const CardComponent: React.FC<ComponentProps> = ({ 
  data, 
  content, 
  className,
  style 
}) => {
  const { title, content: cardContent } = data;
  const displayContent = cardContent || content;

  return (
    <div 
      className={`pivotui-card ${className || ''}`}
      style={{
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        ...style
      }}
    >
      {title && (
        <h3 style={{ 
          margin: '0 0 1rem 0',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#1a202c'
        }}>
          {title}
        </h3>
      )}
      <div style={{ 
        lineHeight: 1.6,
        color: '#4a5568'
      }}>
        {displayContent}
      </div>
    </div>
  );
};