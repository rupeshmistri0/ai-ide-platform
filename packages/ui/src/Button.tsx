import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  const style = variant === 'primary' 
    ? 'background: #0070f3; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;'
    : 'background: #eaeaea; color: black; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;';
  return <button style={{ cssText: style }} {...props}>{children}</button>;
};
