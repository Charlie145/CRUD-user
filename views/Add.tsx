import {
  View,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import CONAPI from "../connectAPI/connectAPI";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/Navigations";
import { Picker } from "@react-native-picker/picker";
import { Icon, Button } from "react-native-elements";

type Props = NativeStackScreenProps<RootStackParamList, "UserAdd">;

export default function UserAdd({ navigation, route }: Props) {
  const userId = route.params?.user;

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [gender, setGender] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
const [edit, setEdit] = useState(!userId);

  const imgDefaultAdd = require("../assets/addDefault.png");
console.log(userId);
  useEffect(() => {
    if (userId) {
      setLoading(true);
      CONAPI.get(`/user/${userId}`)
        .then((res) => ChangeForm(res.data))
        .catch(() => Alert.alert("Error al cargar usuario"))
        .finally(() => setLoading(false));
    }
  }, []);

  const ChangeForm = (userData: any) => {

    const userName = userData.firstName + " " + userData.lastName;
    navigation.setOptions({title : userName});
    navigation.setOptions({headerRight: () => {
              return (
              <Button title=""
                 onPress={() => setEdit(true)}
                 buttonStyle={{borderRadius:20}}
                icon={<Icon name="edit" color="white" type="material" ></Icon>}/>)
            }})
    setFirstName(userData.firstName || "");
    setLastName(userData.lastName || "");
    setEmail(userData.email || "");
    setTitle(userData.title || "");
    setGender(userData.gender || "");
    setImageUri(userData.picture || null);
  };

  const selectImg = async () => {
    if (edit && userId) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    const data = {
      firstName,
      lastName,
      email,
      title,
      gender,
      picture: imageUri,
    };

    if (userId) {
      const id = userId;
      CONAPI.put(`/user/${id}`, data)
        .then(() => {
          Alert.alert("Usuario actualizado");
          navigation.navigate("Home", { refresh: true });
        })
        .catch(() => Alert.alert("Error al actualizar"));
    } else {
      CONAPI.post("/user/create", data)
        .then(() => {
          Alert.alert("Usuario agregado");
          navigation.navigate("Home", { refresh: true });
        })
        .catch(() => Alert.alert("Error al agregar"));
    }
  };


  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity onPress={selectImg} style={{ alignItems: "center" }}>
        <Image
          source={imageUri ? { uri: imageUri } : imgDefaultAdd}
          style={{ width: 80, height: 80, borderRadius: 40 }}
        />
      </TouchableOpacity>

      <TextInput
        placeholder="Nombre"
        onChangeText={setFirstName}
        value={firstName}
        style={{ borderBottomWidth: 2 }}
        editable={edit}
      />
      <TextInput
        placeholder="Apellido"
        onChangeText={setLastName}
        value={lastName}
        style={{ borderBottomWidth: 2, marginTop: 20, marginBottom: 20 }}
        editable={edit}
      />
      
      <TextInput
        placeholder="Correo electrónico"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderBottomWidth: 2, marginTop: 20, marginBottom: 20 }}
        editable={edit}
      />
      <Picker
        selectedValue={title}
        onValueChange={(itemValue) => setTitle(itemValue)}
        style={{ marginVertical: 10 }}
        enabled={edit}
      >
        <Picker.Item label="Selecciona un Título" value="" />
        <Picker.Item label="mr" value="mr" />
        <Picker.Item label="ms" value="ms" />
        <Picker.Item label="mrs" value="mrs" />
        <Picker.Item label="miss" value="miss" />
        <Picker.Item label="dr" value="dr" />
      </Picker>
      <Picker
        selectedValue={gender}
        onValueChange={(itemValue) => setGender(itemValue)}
        style={{ marginVertical: 10 }}
        enabled={edit}
      >
        <Picker.Item label="Selecciona un Género" value="" />
        <Picker.Item label="Masculino" value="male" />
        <Picker.Item label="Femenino" value="female" />
        <Picker.Item label="Otro" value="other" />
      </Picker>
      {edit && (
        <Button
          title={userId ? "Actualizar" : "Agregar"}
          onPress={handleSubmit}
        />
      )}
    </View>
  );
}
