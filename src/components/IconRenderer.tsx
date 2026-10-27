import React from 'react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  name,
  className = 'w-6 h-6',
  size,
}) => {
  // Map or fallback to MessageSquare
  const IconComponent = (Icons as Record<string, any>)[name] || Icons.MessageSquare;
  return <IconComponent className={className} size={size} aria-hidden="true" />;
};
