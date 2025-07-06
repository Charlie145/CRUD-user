import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, FlatList, Alert} from 'react-native';
import { Button, Icon } from 'react-native-elements';
import CONAPI from './connectAPI/connectAPI';
import React, { useEffect, useState } from 'react';


type UserProps = {
  id: string;
  title: string;
  firstName: string;
  lastName: string;
  picture: string;
};

export default function App() {
  const [users, getUsers] = useState<UserProps[]>([]);
  const imgDefault = require("./assets/userDefault.png");
  useEffect(() => {
    CONAPI.get('/user')
      .then((res) => {
        getUsers(res.data.data);
      })
  }, []);
  
  const deleteUser = (idUser:string) => {
    Alert.alert("", "Seguro que quieres eliminar este Usuario",[{text: "No", style :"cancel"}, {text: "Sí", onPress: () => 
      CONAPI.delete(`/user/${idUser}`).then (() => {
       Alert.alert("", 'El Usuario fue elimnado');
       getUsers((prevUsers) => prevUsers.filter(user => user.id !== idUser));
      })
    }])
    
  }
  const User = ({ id, title, firstName, lastName, picture }: UserProps) => (

    <View
      style={{
        padding: 10,
        margin: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FDFDFD',
        marginBottom: 5,
        justifyContent: 'space-between',
        borderColor: '#000',
        borderStyle: "solid",
        borderWidth: 0.8,
        borderRadius: 20
      }}
    >
      <Image source={(picture) ? {uri : picture} : imgDefault} style={{ width: 80, height: 80, borderRadius: 40 }}/>
      <Text style={{ marginLeft: 10, fontSize: 16, color: '#000' }}>
        {title} {firstName} {lastName}
      </Text>
      <Button title='' 
       icon={<Icon name='delete' type="material" color="white"/>} 
       buttonStyle={{backgroundColor: 'red', borderRadius: 20}} 
       onPress={() => deleteUser(id)}></Button>
    </View>
  );

  return (
    <View style={{ flex: 1, paddingTop: 50}}>
      <Text style={{ fontSize: 20, textAlign: 'center' }}>Usuarios:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <User
            id={item.id}
            title={item.title}
            firstName={item.firstName}
            lastName={item.lastName}
            picture={item.picture}
          />
        )}
      />
    </View>
  );
}
