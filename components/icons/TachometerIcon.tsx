import React from 'react';

export const TachometerIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <filter id="icon-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <style>
                {`
                    @keyframes pulse {
                        0%, 100% {
                            filter: url(#icon-glow) drop-shadow(0 0 5px currentColor);
                            opacity: 0.8;
                        }
                        50% {
                            filter: url(#icon-glow) drop-shadow(0 0 15px currentColor);
                            opacity: 1;
                        }
                    }
                    .pulsing-glow {
                        animation: pulse 3s ease-in-out infinite;
                    }
                    @keyframes rotate {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .rotating-element {
                        animation: rotate 20s linear infinite;
                        transform-origin: center;
                    }
                `}
            </style>
        </defs>
        
        <g className="pulsing-glow">
            {/* Outer rotating elements */}
            <g className="rotating-element" style={{ animationDuration: '25s' }}>
                <path d="M 20 20 A 42.42 42.42 0 0 1 80 20" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
                <path d="M 80 80 A 42.42 42.42 0 0 1 20 80" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            </g>
             <g className="rotating-element" style={{ animationDirection: 'reverse', animationDuration: '30s' }}>
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2" strokeDasharray="5 10"/>
            </g>
            
            {/* Central Hexagon */}
            <polygon points="50,20 76,35 76,65 50,80 24,65 24,35" fill="none" stroke="currentColor" strokeWidth="4" />

            {/* Inner lines */}
            <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
            <line x1="24" y1="35" x2="76" y2="65" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
            <line x1="24" y1="65" x2="76" y2="35" stroke="currentColor" strokeWidth="2" opacity="0.7"/>
            
            {/* Center glow point */}
            <circle cx="50" cy="50" r="4" fill="currentColor" />
        </g>
    </svg>
);
