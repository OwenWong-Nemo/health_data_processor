

import React, { useState } from 'react';
import { useSelection, SelectionProvider  } from './SelectionContext';
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Dimensions, Button, Alert, Image
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { RadioButton } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';

import DropdownFoam from './Dropdown_foam';

const uploadFileOnPressHandler = async () => {
  try {
    const pickedFile = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.allFiles],
    });
    console.log('pickedFile', pickedFile);
    
    // You can add any frontend effects here without reading the file
    // For example, you might want to show a success message or update the UI
    //Alert(`File picked: ${pickedFile.name}`);
    
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('User cancelled the picker', err);
    } else {
      console.log('Error picking file', err);
      throw err;
    }
  }
};

function FoamScreen() {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
   const [option, setOption] = useState('upload');

   const renderComponent = () => {
    switch (option) {
      case 'upload':
        return <ComponentA />;
      case 'prompt':
        return <ComponentB />;
      case 'preset':
        return <ComponentC />;
      default:
        return null;
    }
  };
  //display foam pattern selection
  const { selection, setSelection } = useSelection();
  const renderPattern = () => {
    if (selection === '1'){
      return (
        <Image
          style={{
            width: 200,
            height: 200,
          }}
          source={require('./foam_img/cat.jpg')}
        />
      );
    }
    else if (selection === '2'){
      return (
        <Image
          style={{
            width: 200,
            height: 200,
          }}
          source={require('./foam_img/bear.jpg')}
        />
      );
    }
    else if (selection === '3'){
      return (
        <Image
          style={{
            width: 200,
            height: 200,
          }}
          source={require('./foam_img/panda.jpg')}
        />
      );
    }
    else {
      return (
        <Image
          style={{
            width: 200,
            height: 200,
          }}
          source={require('./foam_img/none.png')}
        />
      );
    }
  };



  return (

    <SafeAreaView style={backgroundStyle}>
      <ScrollView>
        <View style={styles.radioContainer}>
      <View style={styles.radioGroup}>
        <View style={styles.radioButton}>
          <RadioButton.Android
            value="upload"
            status={option === 'upload' ?
              'checked' : 'unchecked'}
            onPress={() => setOption('upload')}
            color="#795548" />
          <Text style={styles.radioLabel}>
            Upload
          </Text>
        </View>

        <View style={styles.radioButton}>
          <RadioButton.Android
            value="prompt"
            status={option === 'prompt' ?
              'checked' : 'unchecked'}
            onPress={() => setOption('prompt')}
            color="#795548" />
          <Text style={styles.radioLabel}>
            Prompt
          </Text>
        </View>

        <View style={styles.radioButton}>
          <RadioButton.Android
            value="preset"
            status={option === 'preset' ?
              'checked' : 'unchecked'}
            onPress={() => setOption('preset')}
            color="#795548" />
          <Text style={styles.radioLabel}>
            Preset
          </Text>
        </View>

      </View>
    </View><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* <Text>Foam Screen</Text> */}
        {renderComponent()}
        {renderPattern()}
      </View>
      <TouchableOpacity style={styles.button}
onPress={() => {
  setSelection(null);
}}>
<Text style={styles.buttonText}>Clear </Text>
</TouchableOpacity> 
      </ScrollView>
      </SafeAreaView>
      
  );
}

const ComponentA = () => <TouchableOpacity style={styles.button}
onPress={async () => {
  uploadFileOnPressHandler();
}}>
<Text style={styles.buttonText}>Upload from device</Text>
</TouchableOpacity>; 


const ComponentB = () => {
  const [text, onChangeText] = React.useState('');
  return (<View style={{ width: '85%',
    alignContent: 'center',
   }}><TextInput
    style={styles.input}
    onChangeText={onChangeText}
    value={text}
    placeholder="What should the foam be?" />
    <TouchableOpacity style={styles.button}>
<Text style={styles.buttonText}>Generate </Text>
</TouchableOpacity> 
       </View>
      
      )

}
const ComponentC = () =>{ 
return (
<DropdownFoam/>
)

}

const styles = StyleSheet.create({
  radioContainer: {
    margin: 10,
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 0,
    borderRadius: 8,
    //backgroundColor: 'white',
    //padding: 16,
    
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
},
input: {
  height: 40,
  width: '75%',
  margin: 12,
  borderWidth: 1,
  padding: 10,
},
button: {
  paddingVertical: 12,
  paddingHorizontal: 20,
  margin: 20,
  borderWidth: 2,
  borderColor: '#4e342e',
  borderRadius: 25, // Makes the button rounded
  //backgroundColor: '#007BFF',
},
buttonText: {
  color: '#795548',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},
});

export default FoamScreen;