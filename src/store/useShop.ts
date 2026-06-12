import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { products as defaultProducts, type Product } from '../data/products';
import { defaultCategories, type Category } from '../data/categories';
import { safeLocalStorage } from '../utils/safeStorage';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedColorImage?: string;
  selectedSize: string;
}

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'info' | 'error';
}

type Page = 'home' | 'shop' | 'product' | 'wishlist' | 'checkout' | 'customizer' | 'orders' | 'admin' | 'admin-login';

interface ShopState {
  // Navigation
  page: Page;
  selectedProductId: number | null;
  setPage: (page: Page, productId?: number) => void;

  // Products (global — shared between admin & user)
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;

  // Categories (global — shared between admin & user)
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  cartOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;

  // Wishlist
  wishlist: number[];
  toggleWishlist: (productId: number) => void;

  // Toasts (not persisted)
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: number) => void;
}

let toastId = 0;

export const useShop = create<ShopState>()(
  persist(
    (set, get) => ({
      // Navigation
      page: 'home',
      selectedProductId: null,
      setPage: (page, productId) => {
        set({ page, selectedProductId: productId ?? null });
        try { window.scrollTo({ top: 0 }); } catch (_) { /* ignore */ }
      },

      // Products
      products: defaultProducts,
      addProduct: (product) => {
        set({ products: [...get().products, { ...product, id: Date.now() }] });
      },
      updateProduct: (product) => {
        set({ products: get().products.map((p) => (p.id === product.id ? product : p)) });
      },
      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },

      // Categories
      categories: defaultCategories,
      addCategory: (category) => {
        const newCat = { ...category, id: category.slug || `cat-${Date.now()}` };
        set({ categories: [...get().categories, newCat] });
      },
      updateCategory: (category) => {
        set({ categories: get().categories.map((c) => (c.id === category.id ? category : c)) });
      },
      deleteCategory: (id) => {
        set({ categories: get().categories.filter((c) => c.id !== id) });
      },

      // Cart
      cart: [],
      cartOpen: false,
      addToCart: (item) => {
        const { cart } = get();
        const existing = cart.find(
          (c) => c.product.id === item.product.id && c.selectedColor === item.selectedColor && c.selectedSize === item.selectedSize
        );
        if (existing) {
          set({
            cart: cart.map((c) =>
              c.product.id === item.product.id && c.selectedColor === item.selectedColor && c.selectedSize === item.selectedSize
                ? { ...c, quantity: c.quantity + item.quantity }
                : c
            ),
          });
        } else {
          set({ cart: [...cart, item] });
        }
        get().addToast(`${item.product.name} added to bag`, 'success');
      },
      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((c) => c.product.id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set({
          cart: get().cart.map((c) =>
            c.product.id === productId ? { ...c, quantity } : c
          ),
        });
      },
      toggleCart: () => set({ cartOpen: !get().cartOpen }),
      clearCart: () => set({ cart: [] }),

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) => {
        const { wishlist } = get();
        if (wishlist.includes(productId)) {
          set({ wishlist: wishlist.filter((id) => id !== productId) });
          get().addToast('Removed from wishlist', 'info');
        } else {
          set({ wishlist: [...wishlist, productId] });
          get().addToast('Added to wishlist ♥', 'success');
        }
      },

      // Toasts
      toasts: [],
      addToast: (message, type = 'success') => {
        const id = ++toastId;
        set({ toasts: [...get().toasts, { id, message, type }] });
        setTimeout(() => get().removeToast(id), 3500);
      },
      removeToast: (id) => {
        set({ toasts: get().toasts.filter((t) => t.id !== id) });
      },
    }),
    {
      name: 'heers-shop-storage',
      storage: createJSONStorage(() => safeLocalStorage),
      // Only persist these fields (not page, toasts, cartOpen)
      partialize: (state) => ({
        products: state.products,
        categories: state.categories,
        cart: state.cart,
        wishlist: state.wishlist,
      }),
    }
  )
);
