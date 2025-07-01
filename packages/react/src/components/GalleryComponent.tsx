import React from 'react';
import type { ComponentProps } from '../types.js';

export const GalleryComponent: React.FC<ComponentProps> = ({ 
  data, 
  content, 
  className,
  style 
}) => {
  return (
    <div 
      className={`pivotui-gallery ${className || ''}`}
      style={style}
    >
      <div style={{ 
        padding: '1rem',
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa'
      }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>🖼️ Gallery</h4>
        <p style={{ margin: 0 }}>{content}</p>
      </div>
    </div>
  );
};