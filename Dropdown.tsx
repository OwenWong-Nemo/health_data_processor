import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
//import CheckBox from '@react-native-community/checkbox';

const initialState = {
  checked: false,
};
function CheckboxI() {
  const [state, setState] = React.useState(initialState);
  const [toggleButton, setToggleButton] = React.useState(false);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.checkboxWrapper}>
          <CheckBox
            value={state.checked}
            onValueChange={value => setState({ checked: value })}
          />
          <Text>Check this option</Text>
        </View>
        {/* <Button
          onPress={() => setToggleButton(prevToggleButton => !prevToggleButton)}
          title="Save"
        /> */}
      </View>
      {toggleButton && (
        <View style={styles.resultContainer}>
          {state.checked && (
            <View style={{ paddingHorizontal: 5 }}>
              <Text>Checked</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}


  const data = [
    { label: 'Admiralty', value: '1' },
      { label: 'Causeway Bay', value: '2' },
      { label: 'Kowloon Tong', value: '3' },
      { label: 'Shatin', value: '4' },
      { label: 'Tsuen Wan', value: '5' },
      { label: 'Tsim Sha Tsui', value: '6' },
      { label: 'Yau Tong', value: '7' },
  ];

  const DropdownComponent = () => {
    const [value, setValue] = useState<string | null>(null);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
      if (value || isFocus) {
        return (
          <Text style={[styles.label, isFocus && { color: 'blue' }]}>
            Station
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
          placeholder={!isFocus ? 'Select station' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
            setIsFocus(false);
          }}
        />
      </View>
    );
  };

//export { DropdownComponent, Checkbox }
 export default DropdownComponent;

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