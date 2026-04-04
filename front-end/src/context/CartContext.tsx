import { createContext, useContext, useState } from 'react';
import type { Book } from '../types/Book';

// 1. Define what a cart item looks like
export interface CartItem {
  book: Book;
  quantity: number;
}

// 2. Define what the context exposes to the rest of the app
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
  cartCount: number;
}

// 3. Create the context
const CartContext = createContext<CartContextType | null>(null);

// 4. Create the provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (book: Book) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.book.bookId === book.bookId);
      if (existing) {
        return prev.map((item) =>
          item.book.bookId === book.bookId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId: number) => {
    setCartItems((prev) => prev.filter((item) => item.book.bookId !== bookId));
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

// 5. Create a custom hook for easy access
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}