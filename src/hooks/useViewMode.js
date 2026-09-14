import { useState } from 'react';

// Remembers a page's card/list view choice in localStorage, keyed per page --
// so switching to "list" on Products doesn't affect Stock's own preference.
export default function useViewMode(storageKey, defaultValue = 'card') {
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || defaultValue;
    } catch {
      return defaultValue;
    }
  });

  function changeView(next) {
    setView(next);
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // private browsing / storage disabled -- the toggle still works for this session
    }
  }

  return [view, changeView];
}
