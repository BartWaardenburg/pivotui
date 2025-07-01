import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TextComponent } from '../components/TextComponent.js';

describe('TextComponent', () => {
  it('should render text content', () => {
    const props = {
      data: { content: 'Test content' },
      content: 'Test content'
    };

    render(<TextComponent {...props} />);
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should use fallback content when data.content is not available', () => {
    const props = {
      data: {},
      content: 'Fallback content'
    };

    render(<TextComponent {...props} />);
    
    expect(screen.getByText('Fallback content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    const props = {
      data: { content: 'Test' },
      content: 'Test',
      className: 'custom-class'
    };

    const { container } = render(<TextComponent {...props} />);
    
    expect(container.firstChild).toHaveClass('pivotui-text', 'custom-class');
  });
});