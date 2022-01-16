import React, {useState, useEffect} from 'react';
import { Text, View, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';
import { setCustomText } from 'react-native-global-props';

LogBox.ignoreLogs(['AsyncStorage']);

import Devices from './Devices';

setCustomText({
  style:{
    fontFamily: 'Ubuntu-Medium'
  }
})

export default function App() {

  const Tab = createBottomTabNavigator();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarShowLabel:false,
          tabBarIcon: ({focused, color, size}) => {
            return <Text style={{color: focused?'#2e6d75':'#104a6e'}}>{route.name}</Text>
          }
        })}>
        <Tab.Screen name="Devices" component={Devices} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
