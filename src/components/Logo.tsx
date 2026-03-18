import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = 'h-8' }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src="/bafitd-logo.svg"
        alt="BaFitD Logo"
        className="h-8 w-auto"
        onError={(e) => {
          // Fallback to text logo if SVG not found
          (e.currentTarget as HTMLImageElement).style.display = 'none';
        }}
      />
      <span className="font-bold text-white text-xl tracking-tight">BaFitD</span>
    </div>
  );
};

export default Logo;
