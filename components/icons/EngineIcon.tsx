
import React from 'react';

export const EngineIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
    <path d="M12 20V10" />
    <path d="M12 10V4" />
    <path d="M12 10H8" />
    <path d="M12 10h4" />
    <path d="M12 10c-2.5 0-2.5 5-5 5" />
    <path d="M12 10c2.5 0 2.5 5 5 5" />

    <path d="M17 15h2" />
    <path d="M5 15H3" />

    <path d="M19 12h2" />
    <path d="M3 12h2" />

    <path d="M7 10V8" />
    <path d="M17 10V8" />

    <path d="M7 18H5" />
    <path d="M19 18h-2" />
  </svg>
);
