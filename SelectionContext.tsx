// SelectionContext.tsx
//for foam pattern selection
import React, { createContext, useState, useContext } from 'react';

const SelectionContext = createContext<{ selection: any; setSelection: React.Dispatch<React.SetStateAction<any>> ; 
  coffee_bean_type: any; setBean: React.Dispatch<React.SetStateAction<any>>; 
  cupValue:any; setCupValue: React.Dispatch<React.SetStateAction<any>>; 
  checkedNutrient: any; setCheckedNutrient: React.Dispatch<React.SetStateAction<any>>;
 } | undefined>(undefined);

export const SelectionProvider = ({ children }) => {
  const [selection, setSelection] = useState(null); // Shared state
  const [coffee_bean_type, setBean] = useState(null); // Additional shared state
  const [cupValue, setCupValue] = useState(null); // Additional shared state
  const [checkedNutrient, setCheckedNutrient] = useState({
    item1: false,
    item2: false,
    item3: false,
    item4: false,
  });
  return (
    <SelectionContext.Provider value={{ 
      selection, setSelection, 
      coffee_bean_type, setBean, 
      cupValue, setCupValue, 
      checkedNutrient, setCheckedNutrient}}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext);