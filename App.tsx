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

function HomeScreen() {
    const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Order')}>
        Place order
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
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}