"use client";

import Link from "next/link";
import { Category } from "@/types";

interface CategoryCardProps {
  category: Category;
  count?: number;
}

export default function CategoryCard({ category, count }: CategoryCardProps) {
  return (
    <Link href={`/search?category=${category.id}`} className="block group">
      <div className="glass-card-hover p-5 text-center">
        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
          {category.icon}
        </div>
        <h3 className="font-semibold text-surface-800 group-hover:text-primary-600 transition-colors">
          {category.name}
        </h3>
        {count !== undefined && (
          <p className="text-xs text-surface-400 mt-1">{count} ta usta</p>
        )}
      </div>
    </Link>
  );
}
