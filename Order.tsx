/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type {PropsWithChildren} from 'react';
import { useSelection  } from './SelectionContext';
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

import { RadioButton, Checkbox } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import {DropdownComponent, BeanDropdown} from './Dropdown';


import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
//import { CheckBox } from '@rneui/base';

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

function Order(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  //slidable : brew temp
  const screenWidth = Dimensions.get('window').width;
  const [barPosition, setBarPosition] = useState<number>( (screenWidth-50)*0.6); //default 80 deg
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
  let temperature = Math.round((barPosition / (screenWidth-50)) * 50)+50;

  //for sugar level 
  const [sugarPosition, setsugarPosition] = useState<number>(0); 
  const sugarResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      let newPosition = gestureState.moveX;

      // Ensure the bar stays within screen bounds
      if (newPosition < 0) newPosition = 0;
      if (newPosition > screenWidth-50) newPosition = screenWidth-50; //don't know why 50

      setsugarPosition(newPosition);
    },
  });
  let percentage = Math.round((sugarPosition / (screenWidth-50)) * 100);

  //radio button: grind size 
  const [grindValue, setGrindValue] = useState('small');
  //radio button: cup size
  const [cupValue, setCupValue] = useState('small');
  //checkbox
  const [checked, setChecked] = React.useState(false);
  //foam 
  const navigation = useNavigation();
  const { selection } = useSelection(); // for foam pattern 
  //nutrient
  const [checkedNutrient, setCheckedNutrient] = useState({
    item1: false,
    item2: false,
    item3: false,
  });
  const toggleNutrient = (item) => {
    setCheckedNutrient(prevState => ({
        ...prevState,
        [item]: !prevState[item],
    }));
};
const {coffee_bean_type}= useSelection();//for bean type



  let price = 35; //base price
  if (cupValue === 'medium') price += 3;
  else if (cupValue === 'big') price += 6;
  if (selection != null) price += 10;
  for (const key in checkedNutrient) {
    if (checkedNutrient[key]) price += 1;
  }
  if ((coffee_bean_type==='1')||(coffee_bean_type==='3')) price += 5;
 

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
            <Text>Temperature: {temperature} degrees</Text>
            
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
          <Section title="Coffee bean type">
            <BeanDropdown />

          </Section>
          <Section title="Sugar">
            <View style={styles.barContainer}>
              <View style={[styles.bar, { left: sugarPosition }]} {...sugarResponder.panHandlers} />
            </View>
            <Text>Sugar level: {percentage} %</Text>
          </Section>
          
          <Section title="Nutrient">
          <View style={styles.radioContainer}>
          <View style={styles.radioGroup}>
          {/* nutrient1 */}
          <View style={styles.checkboxContainer}>
          <Checkbox
            status={checkedNutrient.item1 ? 'checked' : 'unchecked'}
            onPress={() => {
              toggleNutrient('item1');
            }
          }
           color='blue'
          />
          <Text>V1</Text>
          </View>
          {/* nutrient2 */}
          <View style={styles.checkboxContainer}>
          <Checkbox
            status={checkedNutrient.item2 ? 'checked' : 'unchecked'}
            onPress={() => {
              toggleNutrient('item2');
            }
          }
           color='blue'
          />
          <Text> V2</Text>
          </View>
          {/* nutrient3 */}
          <View style={styles.checkboxContainer}>
          <Checkbox
            status={checkedNutrient.item3 ? 'checked' : 'unchecked'}
            onPress={() => {
              toggleNutrient('item3');
            }
          }
           color='blue'
          />
          <Text> V3</Text>
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
            {/* <Section title="Foam"> */}
            <View style={styles.checkboxContainer}>
              <Text style={styles.sectionTitle}>Foam</Text>
              <Icon.Button
              onPress={() => navigation.navigate('Foam')}
              name="arrow-right"
              backgroundColor="transparent"
              color="#007BFF"
              />
            </View>
            {/* </Section> */}
          <Section title="Pick up location">
          {<DropdownComponent />}
      </Section>
        </View>
        {/* <View style={styles.checkboxContainer}> */}
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setChecked(!checked);
            }
          }
           color='blue'
          />
          <Text>{checked ? 'Share with community' : 'Share with community'}</Text>
        </View>
        <Text style={styles.sectionTitle}>Price: ${price}</Text>
        <View style={styles.buttonContainer}>
        <Button
          title="Purchase"
          onPress={() => Alert.alert('Purchased')}
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
//checkbox container
checkboxContainer: {
  //margin: 30,
  //alignItems: 'center',
  color: 'green',
  paddingTop: 0,
  paddingBottom: 0,
  flexDirection: 'row',
  alignItems: 'center',
},

//button
  buttonContainer: {
    margin: 30,
    //alignItems: 'center',
    color: 'green',
    paddingTop: 0,
    paddingBottom: 30,
  },



});

export default Order;
