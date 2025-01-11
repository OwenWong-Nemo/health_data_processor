

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
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
  }

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

const ComponentA = () => <Text>This is Component A</Text>;
const ComponentB = () => <Text>This is Component B</Text>;
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
});

export default FoamScreen;