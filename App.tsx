// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
import Order from './Order';
import FoamScreen from './Foam';
import { useSelection, SelectionProvider  } from './SelectionContext';

function HomeScreen() {
    const navigation = useNavigation();
    const {setSelection, setCupValue, setBean, setCheckedNutrient} = useSelection();
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
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => {
        makeOrder(null, null, null, {'item1': false, 'item2': false, 'item3': false, 'item4': false});
        navigation.navigate('Order')}}>
        Place order
      </Button>
      <Text>Quick Options</Text>
      <Button onPress={() => {
        makeOrder('2', null, 'small', {'item1': false, 'item2': false, 'item3': false, 'item4': false});
        navigation.navigate('Order');
      }}>
        Order1
      </Button>
      <Button onPress={() => {
        makeOrder('1', null, 'medium', {'item1': true, 'item2': true, 'item3': true, 'item4': true});
        navigation.navigate('Order');
      }}>
        Order2
      </Button>
      <Button onPress={() => {
        makeOrder('2', '2', 'large', {'item1': false, 'item2': false, 'item3': false, 'item4': false});
        navigation.navigate('Order');
      }}>
        Order3
      </Button>
      <Button onPress={() => {
        makeOrder('3', '2', 'XL', {'item1': true, 'item2': true, 'item3': true, 'item4': true});
        navigation.navigate('Order');
      }}>
        Order4
      </Button>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
    initialRouteName: 'Home',
    screenOptions: {
      //headerStyle: { backgroundColor: 'tomato' },
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
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return (<SelectionProvider> 
    {/* //this is for selection of foam pattern */}
  <Navigation />
  </SelectionProvider>);
}