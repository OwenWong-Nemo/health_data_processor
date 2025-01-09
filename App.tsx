/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
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
//import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RadioButton } from 'react-native-paper';
//import  {DropdownComponent, CheckboxComponent}  from './Dropdown';
import DropdownComponent from './Dropdown';
//import AntDesign from '@expo/vector-icons/AntDesign'; //dependency issue

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { CheckBox } from '@rneui/base';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  //slidable : brew temp
  const [barPosition, setBarPosition] = useState<number>(0);
  const screenWidth = Dimensions.get('window').width;
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      let newPosition = gestureState.moveX;

      // Ensure the bar stays within screen bounds
      if (newPosition < 0) newPosition = 0;
      if (newPosition > screenWidth-50) newPosition = screenWidth-50; //don't know why 50

      setBarPosition(newPosition);
    },
  });
  let percentage = Math.round((barPosition / (screenWidth-50)) * 100);

  //radio button: grind size 
  const [grindValue, setGrindValue] = useState('small');
  //radio button: cup size
  const [cupValue, setCupValue] = useState('small');


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Image source={require('./order.jpg')} />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Brew temperature">
            <View style={styles.barContainer}>
              <View style={[styles.bar, { left: barPosition }]} {...panResponder.panHandlers} />
            </View>
            <Text>Temperature: {percentage}%</Text>
          </Section>
          
          <Section title="Grind size">
            <View style={styles.radioContainer}>
            <View style={styles.radioGroup}>
                <View style={styles.radioButton}>
                    <RadioButton.Android
                        value="small"
                        status={grindValue === 'small' ? 
                                'checked' : 'unchecked'}
                        onPress={() => setGrindValue('small')}
                        color="#007BFF"
                    />
                    <Text style={styles.radioLabel}>
                        Small
                    </Text>
                </View>

                <View style={styles.radioButton}>
                    <RadioButton.Android
                        value="medium"
                        status={grindValue === 'medium' ? 
                                 'checked' : 'unchecked'}
                        onPress={() => setGrindValue('medium')}
                        color="#007BFF"
                    />
                    <Text style={styles.radioLabel}>
                        Medium
                    </Text>
                </View>

                <View style={styles.radioButton}>
                    <RadioButton.Android
                        value="big"
                        status={grindValue === 'big' ? 
                                'checked' : 'unchecked'}
                        onPress={() => setGrindValue('big')}
                        color="#007BFF"
                    />
                    <Text style={styles.radioLabel}>
                        Big
                    </Text>
                </View>
            </View>
        </View>
          </Section>
          <Section title="Cup size">
            <View style={styles.radioContainer}>
            <View style={styles.radioGroup}>
                <View style={styles.radioButton}>
                    <RadioButton.Android
                        value="small"
                        status={cupValue === 'small' ? 
                                'checked' : 'unchecked'}
                        onPress={() => setCupValue('small')}
                        color="#007BFF"
                    />
                    <Text style={styles.radioLabel}>
                        Small
                    </Text>
                </View>

                <View style={styles.radioButton}>
                    <RadioButton.Android
                        value="medium"
                        status={cupValue === 'medium' ? 
                                 'checked' : 'unchecked'}
                        onPress={() => setCupValue('medium')}
                        color="#007BFF"
                    />
                    <Text style={styles.radioLabel}>
                        Medium
                    </Text>
                </View>

                <View style={styles.radioButton}>
                    <RadioButton.Android
                        value="big"
                        status={cupValue === 'big' ? 
                                'checked' : 'unchecked'}
                        onPress={() => setCupValue('big')}
                        color="#007BFF"
                    />
                    <Text style={styles.radioLabel}>
                        Big
                    </Text>
                </View>

            </View>
        </View>
          </Section>
          <Section title="Pick up location">
          {<DropdownComponent />}
      </Section>
        </View>
        <View style={styles.buttonContainer}>
        <Button
          title="Purchase"
          onPress={() => Alert.alert('Simple Button pressed')}
          color="#007BFF"
        />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  //slidable bar
  barContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    //padding: 20,
  },
  bar: {
    position: 'absolute',
    top: '50%',
    width: 20,
    height: 20,
    backgroundColor: 'blue',
    borderRadius: 10,
    transform: [{ translateY: -10 }], // Center the bar vertically
  },
//radio button
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
//button
  buttonContainer: {
    margin: 50,
    //alignItems: 'center',
    color: 'green',
    paddingTop: 0,
    paddingBottom: 30,
  },



});

export default App;
