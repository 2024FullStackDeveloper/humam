import React from 'react';

interface TruncatedSpanProps {
  text: string;
  maxLength?: number;
}

const TruncatedSpan: React.FC<TruncatedSpanProps> = ({ 
  text, 
  maxLength = 30 
}) => {
  const truncatedText = text.length > maxLength 
    ? `${text.substring(0, maxLength)}...` 
    : text;

  return (
    <span className="truncate max-w-[50ch]" title={text}>
      {truncatedText}
    </span>
  );
};

export default TruncatedSpan;