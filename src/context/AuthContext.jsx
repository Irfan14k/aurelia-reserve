import { createContext, useCallback, useContext, useState } from "react";

import { useAuth } from "../hooks/useAuth";

/**
 * Members context — one auth session for the whole experience, so the
 * navigation, the portal modal and the enquiry form all agree about who is
 * signed in. Also owns the portal's open/closed state, which Navigation and
 * the FloatDock both need. Mounted once in App.jsx.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useAuth();
  const [portalOpen, setPortalOpen] = useState(false);

  const openPortal = useCallback(() => setPortalOpen(true), []);
  const closePortal = useCallback(() => setPortalOpen(false), []);

  return (
    <AuthContext.Provider
      value={{ ...auth, portalOpen, openPortal, closePortal }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useMembers() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useMembers must be used inside <AuthProvider>.");
  return ctx;
}
