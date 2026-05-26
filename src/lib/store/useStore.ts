import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { SearchFilters, MasterWithProfile, User } from "@/types";
import { getAllMastersWithProfiles, searchMasters, categories } from "@/lib/mock/data";

// Telefon raqamni Firebase Auth email formatiga o'girish
// "+998 90 123 45 67" → "998901234567@ustam.uz"
function phoneToEmail(phone: string): string {
  return phone.replace(/\D/g, "") + "@ustam.uz";
}

interface AppState {
  // Auth
  currentUser: User | null;
  isLoggedIn: boolean;
  initAuth: () => () => void;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  register: (data: Partial<User> & { password: string }) => Promise<{ success: boolean; error?: string }>;
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

      // Firebase Auth holatini tinglaydi — ilovani yuklashda chaqiriladi
      initAuth: () =>
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const snap = await getDoc(doc(db, "users", firebaseUser.uid));
            if (snap.exists()) {
              set({ currentUser: snap.data() as User, isLoggedIn: true });
            }
          } else {
            set({ currentUser: null, isLoggedIn: false });
          }
        }),

      login: async (phone, password) => {
        try {
          const email = phoneToEmail(phone);
          const credential = await signInWithEmailAndPassword(auth, email, password);
          const snap = await getDoc(doc(db, "users", credential.user.uid));
          if (!snap.exists()) {
            return { success: false, error: "Foydalanuvchi maʼlumotlari topilmadi" };
          }
          set({ currentUser: snap.data() as User, isLoggedIn: true });
          return { success: true };
        } catch (err: unknown) {
          const code = (err as { code?: string }).code;
          if (
            code === "auth/user-not-found" ||
            code === "auth/wrong-password" ||
            code === "auth/invalid-credential"
          ) {
            return { success: false, error: "Telefon yoki parol notoʼgʼri" };
          }
          return { success: false, error: "Xatolik yuz berdi. Qayta urinib koʼring" };
        }
      },

      logout: async () => {
        await signOut(auth);
        set({ currentUser: null, isLoggedIn: false });
      },

      register: async (data) => {
        try {
          const phone = data.phone || "";
          const email = phoneToEmail(phone);
          const credential = await createUserWithEmailAndPassword(auth, email, data.password);
          const newUser: User = {
            id: credential.user.uid,
            name: data.name || "",
            phone,
            email: data.email || "",
            role: data.role || "client",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || "")}`,
            createdAt: new Date().toISOString(),
          };
          await setDoc(doc(db, "users", credential.user.uid), newUser);
          set({ currentUser: newUser, isLoggedIn: true });
          return { success: true };
        } catch (err: unknown) {
          const code = (err as { code?: string }).code;
          if (code === "auth/email-already-in-use") {
            return { success: false, error: "Bu telefon raqam allaqachon roʼyxatdan oʼтgan" };
          }
          if (code === "auth/weak-password") {
            return { success: false, error: "Parol kamida 6 ta belgidan iborat boʼлishi kerak" };
          }
          return { success: false, error: "Xatolik yuz berdi. Qayta urinib koʼring" };
        }
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
      name: "ustam-store",
      partialize: (s) => ({
        currentUser: s.currentUser,
        isLoggedIn: s.isLoggedIn,
      }),
    }
  )
);
