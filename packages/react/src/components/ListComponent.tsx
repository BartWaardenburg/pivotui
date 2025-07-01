import React from 'react';
import type { ComponentProps } from '../types.js';

/**
 * List component for displaying lists and bullet points
 */
export const ListComponent: React.FC<ComponentProps> = ({ 
  data, 
  content, 
  className,
  style 
}) => {
  let items: string[] = data.items || [];

  /* If no structured data, parse from content */
  if (items.length === 0) {
    items = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  /* If still no items, treat as single item */
  if (items.length === 0) {
    items = [content];
  }

  return (
    <div 
      className={`pivotui-list ${className || ''}`}
      style={style}
    >
      <ul style={{ 
        margin: 0,
        paddingLeft: '1.5rem',
        listStyleType: 'disc'
      }}>
        {items.map((item, index) => (
          <li 
            key={index}
            style={{ 
              marginBottom: index < items.length - 1 ? '0.5rem' : 0,
              lineHeight: 1.6
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};