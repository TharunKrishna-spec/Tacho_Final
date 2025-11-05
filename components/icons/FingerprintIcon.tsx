import React from 'react';

export const FingerprintIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 12c-2 0-4.5 1-4.5 3.5V20h9v-4.5c0-2.5-2.5-3.5-4.5-3.5z"></path>
    <path d="M12 3a9 9 0 0 0-9 9c0 1.5.5 3 1.4 4.2"></path>
    <path d="M12 21a9 9 0 0 0 9-9c0-1.5-.5-3-1.4-4.2"></path>
    <path d="M12 3a5 5 0 0 1 5 5"></path>
    <path d="M12 21a5 5 0 0 1-5-5"></path>
  </svg>
);
