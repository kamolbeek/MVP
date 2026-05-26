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

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface NotificationSettings {
  newMessages: boolean;
  masterReplies: boolean;
  newOrders: boolean;
}

interface AppState {
  // Auth
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (phone: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  register: (data: Partial<User> & { password: string }) => { success: boolean; error?: string };
  setCurrentUser: (user: User | null) => void;
  updateProfile: (data: { name?: string; bio?: string; experience?: number; avatar?: string }) => void;
  changePassword: (oldPwd: string, newPwd: string) => { success: boolean; error?: string };
  deleteAccount: () => void;
  forgotPassword: (phone: string) => { success: boolean; message: string };

  // Saved masters
  savedMasterIds: string[];
  toggleSavedMaster: (masterId: string) => void;
  removeSavedMaster: (masterId: string) => void;

  // Notifications
  notifications: Notification[];
  notificationSettings: NotificationSettings;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  toggleNotificationSetting: (key: keyof NotificationSettings) => void;

  // Reviews
  addReview: (masterId: string, rating: number, comment: string) => { success: boolean; error?: string };
  userReviews: Array<{ id: string; masterId: string; rating: number; comment: string; createdAt: string }>;

  // Portfolio (for masters)
  portfolioItems: Array<{ id: string; title: string; description: string; color: string }>;
  addPortfolioItem: (title: string, description: string) => void;
  removePortfolioItem: (id: string) => void;

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

const PORTFOLIO_COLORS = [
  "from-blue-400 to-cyan-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-orange-400 to-amber-500",
  "from-rose-400 to-pink-500",
  "from-slate-400 to-slate-600",
  "from-indigo-400 to-blue-500",
  "from-lime-400 to-green-500",
];

const defaultNotifications: Notification[] = [
  { id: "n-1", title: "Yangi sharh", message: "Aziza sizga 5 yulduzli baho berdi", time: "2 soat oldin", read: false },
  { id: "n-2", title: "Yangi so'rov", message: "Bekzod santexnik xizmatini so'ramoqda", time: "5 soat oldin", read: false },
  { id: "n-3", title: "Tizim yangilandi", message: "USTAM platformasi yangilandi", time: "1 kun oldin", read: true },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ── Auth ────────────────────────────────────────────────────────────────
      currentUser: null,
      isLoggedIn: false,

      login: (phone, password) => {
        const allUsers = [...masterUsers, ...clientUsers];
        const user = allUsers.find((u) => u.phone === phone);
        if (!user) {
          // Also check dynamically registered users via stored password
          const storedPwd = MOCK_PASSWORDS[phone];
          if (!storedPwd || storedPwd !== password) {
            return { success: false, error: "Telefon raqam yoki parol noto'g'ri" };
          }
          return { success: false, error: "Telefon raqam yoki parol noto'g'ri" };
        }
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
        // Save password so the user can log in later
        if (data.password && data.phone) {
          MOCK_PASSWORDS[data.phone] = data.password;
        }
        set({ currentUser: newUser, isLoggedIn: true });
        return { success: true };
      },

      setCurrentUser: (user) => set({ currentUser: user, isLoggedIn: !!user }),

      updateProfile: (data) => {
        const { currentUser } = get();
        if (!currentUser) return;
        const updated = { ...currentUser };
        if (data.name) updated.name = data.name;
        if (data.avatar) updated.avatar = data.avatar;
        set({ currentUser: updated });
      },

      changePassword: (oldPwd, newPwd) => {
        const { currentUser } = get();
        if (!currentUser) return { success: false, error: "Tizimga kirmagansiz" };
        const storedPwd = MOCK_PASSWORDS[currentUser.phone];
        if (storedPwd && storedPwd !== oldPwd) {
          return { success: false, error: "Joriy parol noto'g'ri" };
        }
        MOCK_PASSWORDS[currentUser.phone] = newPwd;
        return { success: true };
      },

      deleteAccount: () => {
        const { currentUser } = get();
        if (currentUser) {
          delete MOCK_PASSWORDS[currentUser.phone];
        }
        set({ currentUser: null, isLoggedIn: false, savedMasterIds: [], userReviews: [], portfolioItems: [] });
      },

      forgotPassword: (phone) => {
        const allUsers = [...masterUsers, ...clientUsers];
        const user = allUsers.find((u) => u.phone === phone);
        if (!user) {
          return { success: false, message: "Bu telefon raqam tizimda topilmadi" };
        }
        // In a real app, this would send an SMS. For mock, just reset to default
        MOCK_PASSWORDS[phone] = "123456";
        return { success: true, message: "Yangi parol: 123456. SMS orqali yuborildi (demo rejim)" };
      },

      // ── Saved Masters ──────────────────────────────────────────────────────
      savedMasterIds: [],
      toggleSavedMaster: (masterId) => {
        const { savedMasterIds } = get();
        if (savedMasterIds.includes(masterId)) {
          set({ savedMasterIds: savedMasterIds.filter((id) => id !== masterId) });
        } else {
          set({ savedMasterIds: [...savedMasterIds, masterId] });
        }
      },
      removeSavedMaster: (masterId) => {
        set({ savedMasterIds: get().savedMasterIds.filter((id) => id !== masterId) });
      },

      // ── Notifications ──────────────────────────────────────────────────────
      notifications: defaultNotifications,
      notificationSettings: { newMessages: true, masterReplies: true, newOrders: true },

      markNotificationRead: (id) => {
        set({
          notifications: get().notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        });
      },

      markAllNotificationsRead: () => {
        set({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
        });
      },

      toggleNotificationSetting: (key) => {
        const settings = get().notificationSettings;
        set({
          notificationSettings: { ...settings, [key]: !settings[key] },
        });
      },

      // ── Reviews ────────────────────────────────────────────────────────────
      userReviews: [],
      addReview: (masterId, rating, comment) => {
        const { currentUser, userReviews } = get();
        if (!currentUser) return { success: false, error: "Avval tizimga kiring" };
        if (!comment.trim()) return { success: false, error: "Sharh yozing" };
        const newReview = {
          id: `ur-${Date.now()}`,
          masterId,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        };
        set({ userReviews: [...userReviews, newReview] });
        return { success: true };
      },

      // ── Portfolio ──────────────────────────────────────────────────────────
      portfolioItems: [],
      addPortfolioItem: (title, description) => {
        const { portfolioItems } = get();
        const newItem = {
          id: `p-${Date.now()}`,
          title,
          description,
          color: PORTFOLIO_COLORS[portfolioItems.length % PORTFOLIO_COLORS.length],
        };
        set({ portfolioItems: [...portfolioItems, newItem] });
      },
      removePortfolioItem: (id) => {
        set({ portfolioItems: get().portfolioItems.filter((p) => p.id !== id) });
      },

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
      name: "ustam-store",
      partialize: (s) => ({
        currentUser: s.currentUser,
        isLoggedIn: s.isLoggedIn,
        savedMasterIds: s.savedMasterIds,
        notificationSettings: s.notificationSettings,
        userReviews: s.userReviews,
        portfolioItems: s.portfolioItems,
      }),
    }
  )
);
