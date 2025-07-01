import React from 'react';
import type { ComponentProps } from '../types.js';

/**
 * Table component for displaying structured tabular data
 */
export const TableComponent: React.FC<ComponentProps> = ({ 
  data, 
  content, 
  className,
  style 
}) => {
  const { columns = [], rows = [] } = data;

  /* If no structured data, parse from content */
  if (columns.length === 0 && rows.length === 0) {
    return (
      <div 
        className={`pivotui-table ${className || ''}`}
        style={style}
      >
        <div style={{ 
          padding: '1rem',
          border: '1px solid #e1e5e9',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <p style={{ margin: 0, fontStyle: 'italic' }}>
            Table data not structured. Raw content:
          </p>
          <pre style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap'
          }}>
            {content}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`pivotui-table ${className || ''}`}
      style={style}
    >
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        border: '1px solid #e1e5e9'
      }}>
        {columns.length > 0 && (
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              {columns.map((column: string, index: number) => (
                <th 
                  key={index}
                  style={{ 
                    padding: '0.75rem',
                    textAlign: 'left',
                    borderBottom: '1px solid #e1e5e9',
                    fontWeight: 600
                  }}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row: any[], rowIndex: number) => (
            <tr 
              key={rowIndex}
              style={{ 
                borderBottom: rowIndex < rows.length - 1 ? '1px solid #e1e5e9' : 'none'
              }}
            >
              {row.map((cell: any, cellIndex: number) => (
                <td 
                  key={cellIndex}
                  style={{ 
                    padding: '0.75rem',
                    verticalAlign: 'top'
                  }}
                >
                  {String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};