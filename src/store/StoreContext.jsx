import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Ported from legacy/js/app.js:1-144 (FurniroStore)

const CART_KEY = 'furniro-cart';
const FAVORITES_KEY = 'furniro-favorites';

function read(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    /* ignore - storage might be blocked */
  }
}

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => read(CART_KEY));
  const [favorites, setFavorites] = useState(() => read(FAVORITES_KEY));

  // keep other tabs in sync
  useEffect(() => {
    function onStorage(event) {
      if (event.key === CART_KEY) setCart(read(CART_KEY));
      if (event.key === FAVORITES_KEY) setFavorites(read(FAVORITES_KEY));
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const saveCart = useCallback((nextCart) => {
    write(CART_KEY, nextCart);
    setCart(nextCart);
  }, []);

  const saveFavorites = useCallback((nextFavorites) => {
    write(FAVORITES_KEY, nextFavorites);
    setFavorites(nextFavorites);
  }, []);

  const addToCart = useCallback((id, qty) => {
    id = Number(id);
    qty = Math.max(1, parseInt(qty, 10) || 1);
    setCart((prev) => {
      const next = prev.map((item) => ({ ...item }));
      const line = next.find((item) => item.id === id);
      if (line) {
        line.qty += qty;
      } else {
        next.push({ id, qty });
      }
      write(CART_KEY, next);
      return next;
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    id = Number(id);
    setCart((prev) => {
      const next = prev.filter((item) => item.id !== id);
      write(CART_KEY, next);
      return next;
    });
  }, []);

  const setCartQty = useCallback((id, qty) => {
    id = Number(id);
    qty = Math.max(1, parseInt(qty, 10) || 1);
    setCart((prev) => {
      const line = prev.find((item) => item.id === id);
      if (!line) return prev;
      const next = prev.map((item) => (item.id === id ? { ...item, qty } : item));
      write(CART_KEY, next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback((id) => {
    id = Number(id);
    let willBeFavorite = false;
    setFavorites((prev) => {
      const index = prev.indexOf(id);
      let next;
      if (index === -1) {
        next = [...prev, id];
        willBeFavorite = true;
      } else {
        next = prev.filter((favId) => favId !== id);
        willBeFavorite = false;
      }
      write(FAVORITES_KEY, next);
      return next;
    });
    return willBeFavorite;
  }, []);

  const isFavorite = useCallback((id) => favorites.indexOf(Number(id)) !== -1, [favorites]);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const favoriteCount = favorites.length;

  const value = useMemo(
    () => ({
      cart,
      favorites,
      addToCart,
      removeFromCart,
      setCartQty,
      toggleFavorite,
      isFavorite,
      cartCount,
      favoriteCount,
    }),
    [cart, favorites, addToCart, removeFromCart, setCartQty, toggleFavorite, isFavorite, cartCount, favoriteCount]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
