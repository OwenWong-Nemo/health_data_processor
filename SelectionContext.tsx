// SelectionContext.tsx
//for foam pattern selection
import React, { createContext, useState, useContext } from 'react';

const SelectionContext = createContext<{ selection: any; setSelection: React.Dispatch<React.SetStateAction<any>> } | undefined>(undefined);

export const SelectionProvider = ({ children }) => {
  const [selection, setSelection] = useState(null); // Shared state
  return (
    <SelectionContext.Provider value={{ selection, setSelection }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext);