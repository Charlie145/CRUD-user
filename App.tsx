import React from "react";
import {NavigationContainer} from  '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack"; 


import Home from './views/Home';
import UserAdd from './views/Add';
import {Button, Icon } from "react-native-elements";
import { RootStackParamList } from "./types/Navigations";



const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} 
         options={({ navigation }) => ({
            title: "Users",
            headerRight: () => {
              return (
              <Button title="Agregar"
                 onPress={() => navigation.navigate('UserAdd')}
                 buttonStyle={{borderRadius:20}}
                icon={<Icon name="add" color="white" type="material" ></Icon>}/>)
            }
          })}/>
          <Stack.Screen name="UserAdd" component={UserAdd} 
          options={{title: "Add Users"}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}