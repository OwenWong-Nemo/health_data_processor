// In App.js in a new project

import React, { useState } from 'react';
import { View, Text, StyleSheet,ImageBackground } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
import Order from './Order';
import FoamScreen from './Foam';
import PredictScreen from './Predict';
import { useSelection, SelectionProvider  } from './SelectionContext';
import axios from 'axios';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

function HomeScreen() {
    const navigation = useNavigation();
    const image = require('./BrewUp.png');
    const {setSelection, setCupValue, setBean, setCheckedNutrient, 
      setBrewTemperature, setServeTemperature, setSugarLevel, setCaffeineLevel} = useSelection();
    const makeOrder=(coffee_bean:string|null, foam_pattern:string|null, cup_size:string|null, nutrient:{[key: string]: boolean })=>{
        setCupValue(cup_size);
        setBean(coffee_bean);
        setSelection(foam_pattern);
        for (let key in nutrient) {
            setCheckedNutrient((prev) => {
              return { ...prev, [key]: nutrient[key] };
            });
          }
    };
     const {imgSrc, setImgSrc} = useSelection();

    // axios.get('http://10.0.2.2:8000/api/getOrder/').then(response => { //not localhost
    // setMessage(response.data.message);}).catch(error => {
    // console.log(error);});


  return (
    <ImageBackground source={image} style={{width: '100%', height: '100%'}}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* <Text>{message}</Text> */}
      <Button style={styles.button}
      onPress={() => {
        //navigation.navigate('Predict')
        makeOrder(null, null, null, {'item1': true, 'item2': true, 'item3': true, 'item4': true});
        setImgSrc('mocha');
        setServeTemperature('room');
        setSugarLevel(0);
        setCaffeineLevel(25);
        navigation.navigate('Order')
        }}>
          <Text style={styles.buttonText}> Get Prediction</Text>
      </Button>
      <Button style={styles.button} 
      onPress={() => {
        makeOrder(null, null, null, {'item1': false, 'item2': false, 'item3': false, 'item4': false});
        setBrewTemperature(80);
        setSugarLevel(0);
        setImgSrc('order');
        setServeTemperature('hot');
        navigation.navigate('Order')}}>
        <Text style={styles.buttonText}> Place Order </Text>
      </Button>
      {/* <Text style={{ color: 'white' }}>Quick Options</Text> */}
      <Button style={styles.button} 
      onPress={() => {
        makeOrder('2', null, 'small', {'item1': false, 'item2': false, 'item3': false, 'item4': false});
        navigation.navigate('Order');
      }}>
        <Text style={styles.buttonText}> Option 1 </Text>
      </Button>
      <Button style={styles.button}
      onPress={() => {
        makeOrder('1', null, 'medium', {'item1': true, 'item2': true, 'item3': true, 'item4': true});
        navigation.navigate('Order');
      }}>
       <Text style={styles.buttonText}> Option 2 </Text>
      </Button>
      <Button style={styles.button}
      onPress={() => {
        makeOrder('2', '2', 'large', {'item1': false, 'item2': false, 'item3': false, 'item4': false});
        navigation.navigate('Order');
      }}>
        <Text style={styles.buttonText}> Option 3 </Text>
      </Button>
      <Button style={styles.button}
       onPress={() => {
        makeOrder('3', '2', 'XL', {'item1': true, 'item2': true, 'item3': true, 'item4': true});
        navigation.navigate('Order');
      }}>
       <Text style={styles.buttonText}> Option 4 </Text>
      </Button>
    </View>
    </ImageBackground>
  );
}

const styles= StyleSheet.create({ button: {
  backgroundColor: '#8B4513', // Brown color
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
  marginVertical: 10, 
},
buttonText: {
  color: '#ffffff', // White text
  fontSize: 16,
  fontWeight: '600',
  textAlign: 'center',
},

})

const RootStack = createNativeStackNavigator({
    initialRouteName: 'Home',
    screenOptions: {
      headerStyle: { backgroundColor: '#4e342e' },
      headerTintColor: '#fffde7',
      headerTitleStyle: { fontWeight: 'bold' },
    },
    
    screens: {
      Home: {
        screen: HomeScreen,
        options: {
          //title: 'Overview',
        },
      },
    Order: Order,
    Foam: FoamScreen,
    Predict: PredictScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (<SelectionProvider> 
    {/* //this is for selection of foam pattern */}
  <Navigation />
  </SelectionProvider>);
}