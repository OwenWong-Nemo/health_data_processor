import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useSelection } from './SelectionContext';


  const data = [
    { label: 'Cat', value: '1' },
      { label: 'Bear', value: '2' },
      { label: 'Panda', value: '3' },
  ];

  const DropdownFoam = () => {
    //const [value, setValue] = useState<string | null>(null);
    const { selection, setSelection } = useSelection(); // Access and update shared state
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
      if (selection || isFocus) {
        return (
          <Text style={[styles.label, isFocus && { color: 'blue' }]}>
            Pattern
          </Text>
        );
      }
      return null;
    };
    

    return (
      <View style={styles.dropdownContainer}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={200}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select pattern' : '...'}
          searchPlaceholder="Search..."
          value={selection}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelection(item.value);
            setIsFocus(false);
          }}
        />
      </View>
    );
  };

//export { DropdownComponent, Checkbox }
 export default DropdownFoam;

const styles = StyleSheet.create({
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
  },
  resultContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },

  dropdownContainer: {
    backgroundColor: 'white',
    padding: 16,
    width: '100%',
    height: 100,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

/*
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      padding: 16,
      width: '100%',
      height: 100,
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  })
  ;
*/