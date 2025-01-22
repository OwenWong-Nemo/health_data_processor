// SelectionContext.tsx
//for foam pattern selection
import React, { createContext, useState, useContext } from 'react';

const SelectionContext = createContext<{ selection: any; setSelection: React.Dispatch<React.SetStateAction<any>> ; 
  coffee_bean_type: any; setBean: React.Dispatch<React.SetStateAction<any>>; 
  cupValue:any; setCupValue: React.Dispatch<React.SetStateAction<any>>; 
  checkedNutrient: any; setCheckedNutrient: React.Dispatch<React.SetStateAction<any>>;
  brew_temperature: any; setBrewTemperature: React.Dispatch<React.SetStateAction<any>>;
  serve_temperature: any; setServeTemperature: React.Dispatch<React.SetStateAction<any>>;
  sugar_level: any; setSugarLevel: React.Dispatch<React.SetStateAction<any>>;
  caffeine_level: any; setCaffeineLevel: React.Dispatch<React.SetStateAction<any>>;
  milk_level: any; setMilkLevel: React.Dispatch<React.SetStateAction<any>>;
  imgSrc: string; setImgSrc: React.Dispatch<React.SetStateAction<string>>;
 } | undefined>(undefined);

export const SelectionProvider = ({ children }) => {
  const [selection, setSelection] = useState(null); // Shared state
  const [coffee_bean_type, setBean] = useState(null); // Additional shared state
  const [cupValue, setCupValue] = useState(null); // Additional shared state
  const [brew_temperature, setBrewTemperature] = useState(80); // Additional shared state
  const [serve_temperature, setServeTemperature] = useState('hot'); // Additional shared
  const [sugar_level, setSugarLevel] = useState(0); // Additional shared state
  const [caffeine_level, setCaffeineLevel] = useState(80); // Additional shared state
  const [milk_level, setMilkLevel] = useState(15); // Additional shared state
  const [checkedNutrient, setCheckedNutrient] = useState({
    item1: false,
    item2: false,
    item3: false,
    item4: false,
  });
  const [imgSrc, setImgSrc] = useState('order');
  return (
    <SelectionContext.Provider value={{ 
      selection, setSelection, 
      coffee_bean_type, setBean, 
      cupValue, setCupValue, 
      checkedNutrient, setCheckedNutrient, 
      brew_temperature, setBrewTemperature, 
      serve_temperature, setServeTemperature,
      sugar_level, setSugarLevel, 
      caffeine_level, setCaffeineLevel, 
      milk_level, setMilkLevel, 
      imgSrc, setImgSrc}}>

      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = () => useContext(SelectionContext);