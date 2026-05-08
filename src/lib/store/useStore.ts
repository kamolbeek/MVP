import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SearchFilters, MasterWithProfile, User } from "@/types";
import { getAllMastersWithProfiles, searchMasters, categories, masterUsers, clientUsers } from "@/lib/mock/data";

// Mock passwords (phone -> password)
const MOCK_PASSWORDS: Record<string, string> = {
  "+998901234567": "password1",
  "+998901234568": "password1",
  "+998901111111": "client123",
  "+998901111112": "client123",
};

interface AppState {
  // Auth
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (phone: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  register: (data: Partial<User> & { password: string }) => { success: boolean; error?: string };
  setCurrentUser: (user: User | null) => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: SearchFilters;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;

  // Masters
  masters: MasterWithProfile[];
  filteredMasters: MasterWithProfile[];
  loadMasters: () => void;
  applyFilters: () => void;

  // UI
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

const defaultFilters: SearchFilters = {
  category: undefined,
  location: undefined,
  rating: undefined,
  isAvailable: undefined,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Auth ────────────────────────────────────────────────────────────────
      currentUser: null,
      isLoggedIn: false,

      login: (phone, password) => {
        const allUsers = [...masterUsers, ...clientUsers];
        const user = allUsers.find((u) => u.phone === phone);
        if (!user) return { success: false, error: "Telefon raqam yoki parol noto'g'ri" };
        const correctPwd = MOCK_PASSWORDS[phone];
        if (correctPwd && correctPwd !== password) {
          return { success: false, error: "Telefon raqam yoki parol noto'g'ri" };
        }
        set({ currentUser: user, isLoggedIn: true });
        return { success: true };
      },

      logout: () => set({ currentUser: null, isLoggedIn: false }),

      register: (data) => {
        const allUsers = [...masterUsers, ...clientUsers];
        if (allUsers.find((u) => u.phone === data.phone)) {
          return { success: false, error: "Bu telefon raqam allaqachon ro'yxatdan o'tgan" };
        }
        const newUser: User = {
          id: `u-${Date.now()}`,
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          role: data.role || "client",
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
          createdAt: new Date().toISOString(),
        };
        set({ currentUser: newUser, isLoggedIn: true });
        return { success: true };
      },

      setCurrentUser: (user) => set({ currentUser: user, isLoggedIn: !!user }),

      // ── Search ──────────────────────────────────────────────────────────────
      searchQuery: "",
      setSearchQuery: (query) => { set({ searchQuery: query }); get().applyFilters(); },
      filters: defaultFilters,
      setFilters: (newFilters) => {
        set({ filters: { ...get().filters, ...newFilters } });
        get().applyFilters();
      },
      resetFilters: () => { set({ filters: defaultFilters, searchQuery: "" }); get().applyFilters(); },

      // ── Masters ─────────────────────────────────────────────────────────────
      masters: [],
      filteredMasters: [],
      loadMasters: () => {
        const all = getAllMastersWithProfiles();
        set({ masters: all, filteredMasters: all });
      },
      applyFilters: () => {
        const { filters, searchQuery } = get();
        let results = searchMasters({
          category: filters.category,
          district: filters.location,
          rating: filters.rating,
          isAvailable: filters.isAvailable,
        });
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          results = results.filter(
            (m) =>
              m.name.toLowerCase().includes(q) ||
              m.profile.bio.toLowerCase().includes(q) ||
              m.profile.categories.some((catId) => {
                const cat = categories.find((c) => c.id === catId);
                return cat?.name.toLowerCase().includes(q);
              })
          );
        }
        set({ filteredMasters: results });
      },

      // ── UI ──────────────────────────────────────────────────────────────────
      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
    }),
    {
      name: "xalq-uchun-store",
      partialize: (s) => ({ currentUser: s.currentUser, isLoggedIn: s.isLoggedIn }),
    }
  )
);
