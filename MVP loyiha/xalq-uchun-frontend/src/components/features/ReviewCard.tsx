"use client";

import Image from "next/image";
import { Review } from "@/types";
import { formatDate } from "@/lib/utils";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="glass-card p-5 animate-fade-in">
      <div className="flex items-start gap-3">
        {/* Client Avatar */}
        <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-100 shrink-0">
          <Image
            src={review.clientAvatar}
            alt={review.clientName}
            width={40}
            height={40}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-sm text-surface-900 truncate">
              {review.clientName}
            </h4>
            <span className="text-xs text-surface-400 shrink-0">
              {formatDate(review.createdAt)}
            </span>
          </div>

          <div className="mt-1">
            <StarRating rating={review.rating} size="sm" showNumber={false} />
          </div>

          <p className="mt-2 text-sm text-surface-600 leading-relaxed">
            {review.comment}
          </p>
        </div>
      </div>
    </div>
  );
}
