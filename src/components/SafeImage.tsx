import React, { useState } from 'react';
import { UserCheck } from 'lucide-react';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel = 'Candidate Feed',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EFF4FF] text-[#142B4D] border border-[#E2E8F0] ${className}`}
        role="img"
        aria-label={alt}
      >
        <UserCheck className="w-7 h-7 text-[#2563EB] mb-1.5" />
        <span className="text-xs font-semibold tracking-tight text-[#475569]">{fallbackLabel}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
