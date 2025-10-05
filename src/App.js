import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'mobx-react';
import ShiftsList from './screens/ShiftsList';
import ShiftDetails from './screens/ShiftDetails';
import stores from './stores';

const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <Provider {...stores}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="ShiftsList" component={ShiftsList} options={{ title: 'Available shifts' }} />
          <Stack.Screen name="ShiftDetails" component={ShiftDetails} options={{ title: 'Shift details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
