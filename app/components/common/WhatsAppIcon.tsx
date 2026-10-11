"use client";

import React from 'react';

interface WhatsAppIconProps {
  className?: string;
  size?: number;
}

export const WhatsAppIcon: React.FC<WhatsAppIconProps> = ({ 
  className = "w-5 h-5",
  size
}) => {
  const style = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <svg
      viewBox="0 0 24 24"
      className={`shrink-0 inline-block align-middle ${className}`}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="WhatsApp"
      role="img"
    >
      {/* Official WhatsApp Green Speech Bubble with Tail */}
      <path
        fill="#25D366"
        d="M12 2a9.97 9.97 0 0 0-8.52 15.17L2 22l4.97-1.44A9.97 9.97 0 1 0 12 2z"
      />
      {/* Official White Telephone Handset */}
      <path
        fill="#FFFFFF"
        d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.2-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.06 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z"
      />
    </svg>
  );
};

export default WhatsAppIcon;
