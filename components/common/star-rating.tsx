import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  totalStars?: number;
  initialRating?: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  className?: string;
  showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  totalStars = 5,
  initialRating = 0,
  onRatingChange,
  size = 24,
  readonly = false,
  className,
  showValue = false
}) => {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleClick = (value: number) => {
    if (readonly) return;
    
    const newRating = rating === value ? 0 : value;
    setRating(newRating);
    onRatingChange?.(newRating);
  };

  const handleMouseEnter = (value: number) => {
    if (readonly) return;
    setHoveredRating(value);
  };

  const handleMouseLeave = () => {
    if (readonly) return;
    setHoveredRating(0);
  };

  const getStarFill = (starIndex: number) => {
    const currentRating = hoveredRating || rating;
    return starIndex <= currentRating;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: totalStars }, (_, index) => {
          const starValue = index + 1;
          const isFilled = getStarFill(starValue);
          
          return (
            <button
              key={index}
              type="button"
              className={cn(
                "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
                !readonly && "hover:scale-110 cursor-pointer",
                readonly && "cursor-default"
              )}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              onMouseLeave={handleMouseLeave}
              disabled={readonly}
              aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
            >
              <Star
                size={size}
                className={cn(
                  "transition-colors duration-200",
                  isFilled 
                    ? "fill-yellow-400 text-yellow-400" 
                    : "fill-none text-gray-300 hover:text-yellow-400"
                )}
              />
            </button>
          );
        })}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {rating}/{totalStars}
        </span>
      )}
    </div>
  );
};

export default StarRating;