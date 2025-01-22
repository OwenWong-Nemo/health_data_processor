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
    <View style={[styles.sectionContainer, 
      { backgroundColor: isDarkMode ? '#5D4037' : '#EEE9E8' }
    ]}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? '#FFEBEE' : '#4e342e',
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ?'#FFEBEE' : '#4E342E',
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
  //image
  // Import the local image
  const imageSource = require('./order.png');

  // Get the local image dimensions
  const image = Image.resolveAssetSource(imageSource);
  const aspectRatio = image.width / image.height;

  //slidable : brew temp
  const {brew_temperature, setBrewTemperature} = useSelection();
  const screenWidth = Dimensions.get('window').width;
  const [barPosition, setBarPosition] = useState<number>( (screenWidth-70)*((brew_temperature-50)/50)); //default 80 deg
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      let newPosition = gestureState.moveX;

      // Ensure the bar stays within screen bounds
      if (newPosition < 0) newPosition = 0;
      if (newPosition > screenWidth-70) newPosition = screenWidth-70; //don't know why 50

      setBarPosition(newPosition);
      setBrewTemperature(Math.round((newPosition / (screenWidth-70)) * 50)+50);
    },
  });
 

  //for sugar level 
  const {sugar_level, setSugarLevel} = useSelection();
  const [sugarPosition, setsugarPosition] = useState<number>(sugar_level/100*(screenWidth-50)); 
  const sugarResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      let newPosition = gestureState.moveX;

      // Ensure the bar stays within screen bounds
      if (newPosition < 0) newPosition = 0;
      if (newPosition > screenWidth-70) newPosition = screenWidth-70; //don't know why 50
      setsugarPosition(newPosition);
      setSugarLevel(Math.round((newPosition)/(screenWidth-70)*100));
    },
  });

  //caffeine level
  const {caffeine_level, setCaffeineLevel} = useSelection();
  const [caffeinePosition, setcaffeinePosition] = useState<number>(caffeine_level/100*(screenWidth-70)); 
  const caffeineResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      let newPosition = gestureState.moveX;

      // Ensure the bar stays within screen bounds
      if (newPosition < 0) newPosition = 0;
      if (newPosition > screenWidth-70) newPosition = screenWidth-70; //don't know why 50
      setcaffeinePosition(newPosition);
      setCaffeineLevel(Math.round((newPosition)/(screenWidth-70)*100));
    },
  });

  //milk level
  const {milk_level, setMilkLevel} = useSelection();
  const [milkPosition, setmilkPosition] = useState<number>(milk_level/100*(screenWidth-70));
  const milkResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      let newPosition = gestureState.moveX;

      // Ensure the bar stays within screen bounds
      if (newPosition < 0) newPosition = 0;
      if (newPosition > screenWidth-70) newPosition = screenWidth-70; //don't know why 50
      setmilkPosition(newPosition);
      setMilkLevel(Math.round((newPosition)/(screenWidth-70)*100));
    },
  });
  
  
  //radio button: serve temp
  const [serveTemp, setserveTemp] = useState('hot');
  const {cupValue, setCupValue} = useSelection();
  //checkbox
  const [checked, setChecked] = React.useState(false);
  //foam 
  const navigation = useNavigation();
  const { selection } = useSelection(); // for foam pattern 
  //nutrient
  // const [checkedNutrient, setCheckedNutrient] = useState({
  //   item1: false,
  //   item2: false,
  //   item3: false,
  //   item4: false,
  // });
  const {checkedNutrient, setCheckedNutrient} = useSelection();
  const toggleNutrient = (item) => {
    setCheckedNutrient(prevState => ({
        ...prevState,
        [item]: !prevState[item],
    }));
};
const {coffee_bean_type}= useSelection();//for bean type


  let price = 29; //base price
  if (cupValue === 'medium') price += 3;
  else if (cupValue === 'large') price += 6;
  else if (cupValue === 'XL') price += 9;
  if (selection != null) price += 10;
  for (const key in checkedNutrient) {
    if (checkedNutrient[key]) price += 1;
  }
  if (coffee_bean_type==='1') price += 3;
  else if (coffee_bean_type==='3') price += 7;
 

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Image source={require('./order.png')}
        resizeMode="contain"
        style={{ width: screenWidth, // Fit the width of the screen
          height: screenWidth / aspectRatio }}  />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Brew temperature">
            <View style={styles.barContainer}>
              <View style={[styles.bar, { left: barPosition }]} {...panResponder.panHandlers} />
            </View>
            <Text>Temperature: {brew_temperature} degrees</Text>
            
          </Section>

          <Section title="Serve temperature">
            <View style={styles.radioContainer}>
            <View style={styles.radioGroup}>
                <View style={styles.radioButton}>
                    <RadioButton.Android
                        value="hot"
                        status={serveTemp === 'hot' ? 
                                'checked' : 'unchecked'}
                        onPress={() => setserveTemp('hot')}
                        color="#795548"
                    />
                    <Text style={styles.radioLabel}>
                        Hot
                    </Text>
                </View>

                <View style={styles.radioButton}>
                    <RadioButton.Android
                        value="room"
                        status={serveTemp === 'room' ? 
                                'checked' : 'unchecked'}
                        onPress={() => setserveTemp('room')}
                        color="#795548"
                    />
                    <Text style={styles.radioLabel}>
                        Room temp
                    </Text>
                </View>

                <View style={styles.radioButton}>
                    <RadioButton.Android
                        value="cold"
                        status={serveTemp === 'cold' ? 
                                 'checked' : 'unchecked'}
                        onPress={() => setserveTemp('cold')}
                        color="#795548"
                    />
                    <Text style={styles.radioLabel}>
                        Cold
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
            <Text>Sugar level: {sugar_level} %</Text>
          </Section>

          <Section title="Milk">
            <View style={styles.barContainer}>
              <View style={[styles.bar, { left: milkPosition }]} {...milkResponder.panHandlers} />
            </View>
            <Text>Milk level: {milk_level} %</Text>
          </Section>
          

          <Section title="Caffeine">
            <View style={styles.barContainer}>
              <View style={[styles.bar, { left: caffeinePosition }]} {...caffeineResponder.panHandlers} />
            </View>
            <Text>Caffeine level: {caffeine_level} %</Text>
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
           color='#795548'
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
           color='#795548'
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
           color='#795548'
          />
          <Text> V3</Text>
          </View>

          <View style={styles.checkboxContainer}>
          <Checkbox
            status={checkedNutrient.item4 ? 'checked' : 'unchecked'}
            onPress={() => {
              toggleNutrient('item4');
            }
          }
           color='#795548'
          />
          <Text>V4</Text>
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
                        color="#795548"
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
                        color="#795548"
                    />
                    <Text style={styles.radioLabel}>
                        Medium
                    </Text>
                </View>

                <View style={styles.radioButton}>
                    <RadioButton.Android
                        value="large"
                        status={cupValue === 'large' ? 
                                'checked' : 'unchecked'}
                        onPress={() => setCupValue('large')}
                        color="#795548"
                    />
                    <Text style={styles.radioLabel}>
                        Large
                    </Text>
                </View>
                <View style={styles.radioButton}>
                    <RadioButton.Android
                        value="XL"
                        status={cupValue === 'XL' ? 
                                'checked' : 'unchecked'}
                        onPress={() => setCupValue('XL')}
                        color="#795548"
                    />
                    <Text style={styles.radioLabel}>
                        XL
                    </Text>
                </View>

            </View>
        </View>
          </Section>
            {/* <Section title="Foam"> */}
            <View style={styles.foamContainer}>
              <Text style={[styles.sectionTitle, 
                {color: isDarkMode ? '#FFEBEE' : '#4E342E' }
              ]}>Foam
              </Text>
              <Icon.Button
              onPress={() => navigation.navigate('Foam')}
              name="arrow-right"
              backgroundColor="#eee9e8"
              underlayColor="#eee9e8" // Background color when button is pressed
              color="#795548"
              style={{
                width: 40, // Set width
                height: 40, // Set height (equal to width for a circle)
                borderRadius: 20, // Half of the width/height for a perfect circle
                justifyContent: 'center', // Center the content horizontally
                alignItems: 'center', // Center the content vertically
                paddingHorizontal: 0, // Remove extra horizontal padding
                backgroundColor:"#d7ccc8"
              }}
              iconStyle={{
                marginRight: 0, // Remove default icon margin
              }}
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
          color="#795548"
        />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    //marginTop: 32,
    //paddingHorizontal: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#EEE9E8',
    
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
    backgroundColor: '#795548',
    borderRadius: 10,
    //padding: 20,
  },
  bar: {
    position: 'absolute',
    top: '50%',
    width: 20,
    height: 20,
    backgroundColor: '#fffde7',
    borderRadius: 10,
    transform: [{ translateY: -10 }], // Center the bar vertically
  },
//radio button
  radioContainer: {
    flex: 1,
    //backgroundColor: '#FFEBEE',
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
    padding: 0,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    //backgroundColor:'#fffde7'
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
  backgroundColor: '#EEE9E8',
  paddingTop: 0,
  paddingBottom: 0,
  flexDirection: 'row',
  alignItems: 'center',
},

foamContainer:{
  flexDirection: 'row',
  paddingLeft: 25,
  backgroundColor: '#EEE9E8',
  alignItems: 'center',
  gap:250
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
