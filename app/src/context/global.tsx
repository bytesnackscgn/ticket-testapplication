import { createContext, useContext } from 'react';
import { CMS } from '../lib/controller/cms';

const GlobalContext = createContext<{ cms: CMS } | null>(null);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const global = {
    cms: new CMS(import.meta.env.VITE_API_URL),
  };
  return (
    <GlobalContext.Provider value={global}>{children}</GlobalContext.Provider>
  );
}

export function useGlobal() {
  return useContext(GlobalContext);
}