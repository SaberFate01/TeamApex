import React, { createContext, useContext, useState } from 'react';

// Create Context
export const UserContext = createContext();

// Create Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user data here

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};