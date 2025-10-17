
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth = false, ...props }) => {
  const baseClasses = "font-bold py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const variantClasses = {
    primary: "bg-cyan-500 text-white hover:bg-cyan-600 focus:ring-cyan-500 disabled:bg-cyan-800 disabled:text-gray-400 disabled:cursor-not-allowed",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed"
  };
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${widthClass}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
