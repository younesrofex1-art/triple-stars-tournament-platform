import React from 'react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-gray-200 selection:bg-brand-dark selection:text-white">
      {children}
    </div>
  );
};
