import React, { useContext, useState, useEffect } from 'react';

const storeContext = React.createContext();

export function useStore() {
  return useContext(storeContext);
}

export function StoreProvider({ children }) {
  const [accessToken, setAccessToken] = useState(null);
  const [accessLevel, setAccessLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const access_token = localStorage.getItem('access_token');
    const access_level = localStorage.getItem('access_level');
    if (access_token) setAccessToken(access_token);
    if (access_level) setAccessLevel(access_level);
  }, []);

  return (
    <storeContext.Provider
      value={{
        accessToken,
        setAccessToken,
        accessLevel,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </storeContext.Provider>
  );
}
