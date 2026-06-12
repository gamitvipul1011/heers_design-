import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeLocalStorage } from '../utils/safeStorage';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
    image: string;
    colorImage?: string;
    isCustom?: boolean;
    customDetails?: {
      garment: string;
      fabric: string;
      color: string;
      size: string;
      description: string;
      referenceImage?: string;
    };
  }[];
  shipping: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'card' | 'upi' | 'cod';
  total: number;
  status: 'placed' | 'confirmed' | 'in_production' | 'shipped' | 'delivered';
  createdAt: string; // Changed to string for JSON serialization
}

interface AuthState {
  // User Auth
  user: User | null;
  isLoggedIn: boolean;
  registeredUsers: { [email: string]: { password: string; user: User } };
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  
  // Admin Auth
  admin: { email: string } | null;
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, password: string) => boolean;
  verifyAdminOtp: (otp: string) => boolean;
  adminPendingOtp: boolean;
  adminLogout: () => void;
  
  // Orders
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => string;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getUserOrders: () => Order[];
  
  // Login Modal
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const ADMIN_CREDENTIALS = {
  email: 'admin@heers.com',
  password: 'admin123',
  otp: '246810'
};

// Default demo user
const DEFAULT_USERS: { [email: string]: { password: string; user: User } } = {
  'user@heers.com': {
    password: 'password',
    user: { id: 'u1', name: 'Priya Sharma', email: 'user@heers.com', phone: '9876543210' }
  }
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      // User Auth
      user: null,
      isLoggedIn: false,
      registeredUsers: DEFAULT_USERS,
      
      login: (email, password) => {
        const { registeredUsers } = get();
        const userData = registeredUsers[email.toLowerCase()];
        if (userData && userData.password === password) {
          set({ user: userData.user, isLoggedIn: true, showLoginModal: false });
          return true;
        }
        return false;
      },
      
      register: (name, email, password) => {
        const emailLower = email.toLowerCase();
        const { registeredUsers } = get();
        if (registeredUsers[emailLower]) return false;
        
        const newUser: User = {
          id: `u${Date.now()}`,
          name,
          email: emailLower,
        };
        set({ 
          registeredUsers: { ...registeredUsers, [emailLower]: { password, user: newUser } },
          user: newUser, 
          isLoggedIn: true, 
          showLoginModal: false 
        });
        return true;
      },
      
      logout: () => {
        set({ user: null, isLoggedIn: false });
      },
      
      // Admin Auth
      admin: null,
      isAdminLoggedIn: false,
      adminPendingOtp: false,
      
      adminLogin: (email, password) => {
        if (email.toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
          set({ adminPendingOtp: true });
          return true;
        }
        return false;
      },
      
      verifyAdminOtp: (otp) => {
        if (otp === ADMIN_CREDENTIALS.otp) {
          set({ 
            admin: { email: ADMIN_CREDENTIALS.email }, 
            isAdminLoggedIn: true, 
            adminPendingOtp: false 
          });
          return true;
        }
        return false;
      },
      
      adminLogout: () => {
        set({ admin: null, isAdminLoggedIn: false, adminPendingOtp: false });
      },
      
      // Orders
      orders: [],
      
      addOrder: (orderData) => {
        const orderId = `HD${Date.now().toString(36).toUpperCase()}`;
        const order: Order = {
          ...orderData,
          id: orderId,
          status: 'placed',
          createdAt: new Date().toISOString(), // Store as ISO string for JSON
        };
        set({ orders: [...get().orders, order] });
        return orderId;
      },
      
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((o) =>
            o.id === orderId ? { ...o, status } : o
          ),
        });
      },
      
      getUserOrders: () => {
        const { user, orders } = get();
        if (!user) return [];
        return orders.filter((o) => o.userId === user.id);
      },
      
      // Login Modal
      showLoginModal: false,
      setShowLoginModal: (show) => set({ showLoginModal: show }),
    }),
    {
      name: 'heers-auth-storage',
      storage: createJSONStorage(() => safeLocalStorage),
      // Persist these fields
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        registeredUsers: state.registeredUsers,
        orders: state.orders,
        admin: state.admin,
        isAdminLoggedIn: state.isAdminLoggedIn,
      }),
    }
  )
);
