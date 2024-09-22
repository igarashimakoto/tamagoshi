import React from 'react';
import { SimpleLineIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import PixelButton from '@/components/tamagoshi/pixelButton';
import { Save } from '@/tipes/tipes';
import { useGoshiDatabase } from './goshiService';
import { useNavigation } from '@react-navigation/native';

const Index = () => {

    const router = useRouter();

    const { id, happiness, goshiType } = useLocalSearchParams();
    const { updateHappiness, getSingleSave } = useGoshiDatabase();

    const goshiid = Number(id);
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
 
            const unsubscribe = navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
            });

        }, [navigation])
    );

    const handleGoBack = async () => {
        try {

            const save: Save | undefined = await getSingleSave({ goshiid });

            console.log('saindo do nav', save);

            if (save) {
                router.push({
                    pathname: '/game',
                    params: {
                        id: save.id,
                        name: save.name,
                        goshiType: save.goshiType,
                        goshiHealth: save.goshiHealth,
                        goshiSleep: save.goshiSleep,
                        goshiHappiness: save.goshiHappiness,
                        goshiStatus: save.goshiStatus
                    }
                });
            } else {
                console.error("Save não encontrado.");
            }
        } catch (err) {
            console.log("Erro ao buscar o save:", err);
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.cotainerButtons}>

                <PixelButton title='Jan Ken Pon!'
                    onPress={() => { router.push({ pathname: "/jKPMiniGame", params: { id: id, happiness: happiness } }); }} />

                <PixelButton title='Walk with Goshi'
                    onPress={() => { router.push({ pathname: "/stepsMiniGame", params: { id: id, happiness: happiness, goshiType: goshiType } }); }} />

                <View style={styles.backButton}>
                    <PixelButton title="Back" onPress={handleGoBack} />
                </View>

            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: "white",
        height: "100%",
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center'
    },

    cotainerButtons: {

        justifyContent: 'center', 
        alignItems: 'center', 
        width: '95%',
        height: 300,
        borderWidth: 4,
        borderColor: '#000',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 4,

    },

    backButton :{

        width: '50%',
        alignItems:'center',
        justifyContent: 'center',
        paddingTop: 30

    },

    games: {
        width: '100%',
        height: 300,
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#000',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 4,
    },

    button: {
        marginRight: 10,
    },

    texts: {
        fontSize: 18,
    },
});

export default Index;