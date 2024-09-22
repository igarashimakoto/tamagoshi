import { useEffect, useState } from "react";
import { Modal, Text, View, StyleSheet, TextInput, Image, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useGoshiDatabase } from "@/app/goshiService";
import PixelButton from '@/components/tamagoshi/pixelButton';
import goshi1 from '@/assets/images/images_goshi/goshi_1.gif';
import goshi2 from '@/assets/images/images_goshi/goshi_2.gif';
import goshi3 from '@/assets/images/images_goshi/goshi_3.gif';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

type newSaveFormProps = {
  visible: boolean;
  onClose: () => void;
};

const NewSaveForm = ({ visible, onClose }: newSaveFormProps) => {
  const [name, setName] = useState<string>("");
  const [goshiType, setGoshiType] = useState<number>(1);
  const { createSave } = useGoshiDatabase();

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const handleNewSave = async () => {

    if (!name) {
      Alert.alert(
        'Nome Faltando',
        'Por favor coloque um nome.',
        [{ text: 'OK', style: 'cancel' }]
    );
    } else {

      console.log(name, goshiType)
      await createSave({ name, goshiType, goshiHealth: 100, goshiSleep: 100, goshiHappiness: 100, goshiStatus: "Very Good" });
      setName('');
      setGoshiType(1);
      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      onDismiss={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Novo Save</Text>
          <TextInput
            onChangeText={setName}
            value={name}
            style={styles.input}
            placeholder="Nome"
            maxLength={8}
          />

          <Picker
            selectedValue={goshiType}
            onValueChange={(itemValue) => setGoshiType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Sakura" value={1} />
            <Picker.Item label="Roboto" value={2} />
            <Picker.Item label="Tori" value={3} />
          </Picker>

          {/* Exibe o gif correspondente ao tipo selecionado */}
          <Image
            source={goshiType === 1 && goshi1 || goshiType === 2 && goshi2 || goshiType === 3 && goshi3}
            style={styles.gif}
            resizeMode="contain"
          />

          <PixelButton title="Novo Save" onPress={handleNewSave} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({

  centeredView: {
    flex: 1,
    justifyContent: "center",

  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    gap: 16,
  },
  input: {
    width: 300,
    height: 48,
    borderRadius: 8,
    borderColor: "#bdbdbd",
    borderWidth: 1,
    padding: 8,
  },
  picker: {
    width: 300,
    height: 48,
    borderRadius: 8,
    borderColor: "#bdbdbd",
    borderWidth: 1,
    padding: 8,
  },
  gif: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    color: "#000",
  },
});

export default NewSaveForm;
