

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  TextInput,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  PanResponder,
  Dimensions, Button, Alert, Image
} from 'react-native';
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { RadioButton } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';

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
            color="#007BFF" />
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
            color="#007BFF" />
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
            color="#007BFF" />
          <Text style={styles.radioLabel}>
            Preset
          </Text>
        </View>

      </View>
    </View><View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* <Text>Foam Screen</Text> */}
        {renderComponent()}
      </View>
      </ScrollView>
      </SafeAreaView>
  );
}

const ComponentA = () => <Button title="Gallary" onPress={async () => {
  uploadFileOnPressHandler();
}} />;
const ComponentB = () => {
  const [text, onChangeText] = React.useState('');
  return (<TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder='What should the foam be?'
        />)

}
const ComponentC = () => <Text>This is Component C</Text>;

const styles =StyleSheet.create({
  radioContainer: {
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
    backgroundColor: 'white',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
});

export default FoamScreen;