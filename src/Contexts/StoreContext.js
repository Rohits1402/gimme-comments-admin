import React, { useContext, useState, useEffect } from 'react';

const storeContext = React.createContext();

export function useStore() {
  return useContext(storeContext);
}

export function StoreProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) setAccessToken(token);
  }, []);

  return (
    <storeContext.Provider
      value={{ accessToken, setAccessToken, isLoading, setIsLoading }}
    >
      {children}
    </storeContext.Provider>
  );
}
