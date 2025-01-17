
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';
import { useSelection, SelectionProvider  } from './SelectionContext';
import axios from 'axios';

function PredictScreen() {
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
    const [message, setMessage] = useState('');


    function getOrder(){
    axios.get('http://10.0.2.2:8000/api/getOrder/').then(response => { 
    setMessage(response.data.message);
    setBean(response.data.coffee_bean);
    for (let key in response.data.nutrient) {
        setCheckedNutrient((prev) => {
          return { ...prev, [key]: response.data.nutrient[key] };
        });
      };
}).catch(error => {
    console.log(error);});}

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{message}</Text>
      <Text>Predict Screen</Text>
      <Button onPress={() => {
        getOrder();}}>
        Get Prediction
      </Button>

      <Button onPress={() => {
        //makeOrder('2', null, 'small', {'item1': false, 'item2': false, 'item3': false, 'item4': false});
        navigation.navigate('Order');
      }}>
        Order
      </Button>
    </View>
  );
}

export default PredictScreen;