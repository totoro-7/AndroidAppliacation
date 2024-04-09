// src/context/FirebaseContext.js

import React, { createContext } from 'react';
import { realtimeDb } from '../firebase'; // Import Firebase configuration

export const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  return (
    <FirebaseContext.Provider value={{ realtimeDb }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);