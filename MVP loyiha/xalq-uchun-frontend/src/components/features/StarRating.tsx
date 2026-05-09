"use client";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
}

export default function StarRating({ rating, size = "md", showNumber = true }: StarRatingProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex items-center gap-1.5">
      <div className={`flex gap-0.5 ${sizeClasses[size]}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`transition-all duration-200 ${
              star <= Math.round(rating) ? "star-filled" : "star-empty"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      {showNumber && (
        <span className="text-sm font-semibold text-surface-700">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
