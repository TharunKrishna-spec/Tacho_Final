
import React from 'react';
import { PowerIcon } from './icons/PowerIcon';

interface PowerToggleProps {
  isOn: boolean;
  onToggle: (isOn: boolean) => void;
  disabled?: boolean;
}

const PowerToggle: React.FC<PowerToggleProps> = ({ isOn, onToggle, disabled = false }) => {
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      const button = e.currentTarget;
      if (button) {
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - rect.left - radius}px`;
        circle.style.top = `${e.clientY - rect.top - radius}px`;
        circle.classList.add("ripple");
        
        if(isOn) {
            circle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        }

        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) {
          ripple.remove();
        }
        button.appendChild(circle);
      }
      onToggle(!isOn);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={disabled}
      className={`ripple-container relative inline-flex items-center h-10 w-32 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark focus:ring-cyan-tech-300 ${
        isOn ? 'bg-cyan-tech-300 shadow-glow-cyan' : 'bg-gray-800'
      } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      role="switch"
      aria-checked={isOn}
    >
      <span className="sr-only">Toggle Device Power</span>
      <span
        className={`absolute left-1.5 top-1.5 h-7 w-7 rounded-full bg-background-dark flex items-center justify-center transform transition-transform duration-300 ease-in-out ${
          isOn ? 'translate-x-[5.5rem]' : 'translate-x-0'
        }`}
      >
        <PowerIcon className={`h-5 w-5 transition-colors duration-300 ${isOn ? 'text-cyan-tech-300' : 'text-gray-500'}`} />
      </span>
      <span
        className={`absolute transition-opacity duration-200 ${
          isOn ? 'opacity-0 right-8' : 'opacity-100 right-4'
        }`}
      >
        <span className="text-sm font-bold text-gray-400">OFF</span>
      </span>
      <span
        className={`absolute transition-opacity duration-200 ${
          isOn ? 'opacity-100 left-6' : 'opacity-0 left-4'
        }`}
      >
        <span className="text-sm font-bold text-black">ON</span>
      </span>
    </button>
  );
};

export default PowerToggle;