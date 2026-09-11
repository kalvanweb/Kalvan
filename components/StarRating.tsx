export default function StarRating({
  rating,
  reviewCount,
  size = 14,
}: {
  rating: number;
  reviewCount?: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(rating);
          return (
            <svg
              key={i}
              width={size}
              height={size}
              viewBox="0 0 20 20"
              fill={filled ? "#6B6B4D" : "none"}
              stroke="#6B6B4D"
              strokeWidth="1"
            >
              <path d="M10 1.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9L10 15l-5.2 2.8 1-5.9-4.3-4.2 5.9-.8L10 1.5Z" />
            </svg>
          );
        })}
      </div>
      <span className="sr-only">{rating} out of 5 stars</span>
      {reviewCount !== undefined && (
        <span className="text-xs text-charcoal/50">({reviewCount})</span>
      )}
    </div>
  );
}
