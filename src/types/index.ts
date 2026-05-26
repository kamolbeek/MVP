// ==========================================
// Xalq Uchun - TypeScript Interfaces
// ==========================================

export type UserRole = "master" | "client";

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  region: string;
  district: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
}

export interface MasterProfile {
  id: string;
  userId: string;
  bio: string;
  categories: string[]; // category IDs
  rating: number;
  reviewCount: number;
  location: Location;
  portfolio: string[]; // image URLs
  isAvailable: boolean;
  experience: number; // years
  hourlyRate: number; // so'm/soat
  workHours: string; // e.g. "Du-Sha: 08:00-18:00"
}

export interface Review {
  id: string;
  masterId: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface SearchFilters {
  category?: string;
  location?: string;
  rating?: number;
  isAvailable?: boolean;
}

// Extended type that combines User + MasterProfile for display
export interface MasterWithProfile extends User {
  profile: MasterProfile;
}
