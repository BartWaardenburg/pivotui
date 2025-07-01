import React from 'react';
import type { ComponentProps } from '../types.js';

/**
 * Text component for rendering plain text content
 * The default fallback component for any content
 */
export const TextComponent: React.FC<ComponentProps> = ({ 
  data, 
  content, 
  className,
  style 
}) => {
  const textContent = data.content || content;

  return (
    <div 
      className={`pivotui-text ${className || ''}`}
      style={style}
    >
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        {textContent}
      </p>
    </div>
  );
};