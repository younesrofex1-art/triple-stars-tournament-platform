import React from 'react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="w-screen h-screen overflow-hidden bg-background text-gray-200 selection:bg-brand-dark selection:text-white">
      {children}
    </div>
  );
};
