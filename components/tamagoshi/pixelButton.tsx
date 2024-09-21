import { Pressable, StyleSheet, Text } from "react-native";
import { useEffect } from "react";



const PixelButton = ({ title, onPress }: { title: string, onPress: () => void }) => {

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed ? styles.buttonPressed : null,
      ]}
      onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#f4d03f',
    borderColor: '#000',
    borderWidth: 3,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 0,
    marginVertical: 10,
    transform: [{ scale: 1 }],
  },
  buttonPressed: {
    backgroundColor: '#d4ac0d',
    transform: [{ scale: 0.95 }],
  },
  buttonText: {
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
});

export default PixelButton;
