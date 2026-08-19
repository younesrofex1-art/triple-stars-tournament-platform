import React from 'react';

export const TeslaBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 bg-[#060709] overflow-hidden">
      {/* Precision Hairline Grid */}
      <div 
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #FFFFFF 1px, transparent 1px),
            linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Subtle Architectural Ambient Vignette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-white/[0.015] rounded-full blur-[140px]" />
      <div className="absolute bottom-0 right-1/4 w-[800px] h-[400px] bg-brand-orange/[0.025] rounded-full blur-[160px]" />
    </div>
  );
};
