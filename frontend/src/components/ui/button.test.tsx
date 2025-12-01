import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders children and responds to click', () => {
    const handle = jest.fn();
    render(React.createElement(Button, { onClick: handle }, 'Click Me'));
    const btn = screen.getByRole('button', { name: /click me/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(handle).toHaveBeenCalled();
  });

  it('supports asChild prop rendering', () => {
    // asChild renders a Slot; ensure it still renders text
    render(
      React.createElement(
        Button,
        { asChild: true },
        React.createElement('span', null, 'Inner')
      )
    );
    expect(screen.getByText('Inner')).toBeInTheDocument();
  });
});
