// SelectionContext.tsx
//for foam pattern selection
import React, { createContext, useState, useContext } from 'react';

const SelectionContext = createContext<{ selection: any; setSelection: React.Dispatch<React.SetStateAction<any>> ; 
  coffee_bean_type: any; setBean: React.Dispatch<React.SetStateAction<any>> } | undefined>(undefined);

export const SelectionProvider = ({ children }) => {
  const [selection, setSelection] = useState(null); // Shared state
  const [coffee_bean_type, setBean] = useState(null); // Additional shared state
  return (
    <SelectionContext.Provider value={{ selection, setSelection, coffee_bean_type, setBean }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext);