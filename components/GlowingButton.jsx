import React from 'react';

const GlowingButton = ({
  onClick,
  children,
  variant = 'cyan',
  className = '',
}) => {
  const baseClasses = "px-6 py-3 font-bold rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none";
  const variantClasses = variant === 'cyan' 
    ? "bg-accent-cyan/10 text-accent-cyan border border-accent-cyan hover:bg-accent-cyan hover:text-dark-bg hover:shadow-glow-cyan"
    : "bg-accent-purple/10 text-accent-purple border border-accent-purple hover:bg-accent-purple hover:text-dark-bg hover:shadow-glow-purple";

  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </button>
  );
};

export default GlowingButton;