"use client";

import Link from "next/link";
import Image from "next/image";
import { MasterWithProfile } from "@/types";
import { getCategoryById } from "@/lib/mock/data";
import StarRating from "./StarRating";

interface MasterCardProps {
  master: MasterWithProfile;
}

export default function MasterCard({ master }: MasterCardProps) {
  const { profile } = master;
  const categoryNames = profile.categories
    .map((catId) => getCategoryById(catId))
    .filter(Boolean);

  return (
    <Link href={`/master/${master.id}`} className="block group">
      <div className="glass-card-hover p-5 h-full">
        {/* Header */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface-100 ring-2 ring-surface-100 group-hover:ring-primary-200 transition-all">
              <Image
                src={master.avatar}
                alt={master.name}
                width={56}
                height={56}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            {/* Availability Dot */}
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                profile.isAvailable ? "bg-green-500" : "bg-red-400"
              }`}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-surface-900 group-hover:text-primary-600 transition-colors truncate">
              {master.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <StarRating rating={profile.rating} size="sm" />
              <span className="text-xs text-surface-400">({profile.reviewCount})</span>
            </div>
          </div>

          {/* Experience Badge */}
          <div className="shrink-0">
            <span className="badge-success text-xs">
              {profile.experience} yil
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="mt-3 text-sm text-surface-500 line-clamp-2 leading-relaxed">
          {profile.bio}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-3">
          {categoryNames.map((cat) => (
            <span
              key={cat!.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-50 rounded-lg text-xs text-surface-600"
            >
              <span>{cat!.icon}</span>
              <span>{cat!.name}</span>
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
          <div className="flex items-center gap-1.5 text-xs text-surface-400">
            <span>📍</span>
            <span>{profile.location.district}</span>
          </div>
          <div className={`text-xs font-medium ${profile.isAvailable ? "text-green-600" : "text-red-500"}`}>
            {profile.isAvailable ? "✅ Bo'sh" : "🔴 Band"}
          </div>
        </div>
      </div>
    </Link>
  );
}
