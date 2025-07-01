import React from 'react';
import type { ComponentProps } from '../types.js';

export const ChartComponent: React.FC<ComponentProps> = ({ 
  data, 
  content, 
  className,
  style 
}) => {
  const { type = 'bar', data: chartData = [] } = data;

  return (
    <div 
      className={`pivotui-chart ${className || ''}`}
      style={style}
    >
      <div style={{ 
        padding: '1rem',
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
        textAlign: 'center'
      }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>📊 {type.toUpperCase()} Chart</h4>
        <p style={{ margin: 0, color: '#6c757d', fontSize: '0.875rem' }}>
          Chart visualization would render here
        </p>
        {chartData.length > 0 && (
          <pre style={{ 
            marginTop: '1rem',
            fontSize: '0.75rem',
            textAlign: 'left'
          }}>
            {JSON.stringify(chartData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};