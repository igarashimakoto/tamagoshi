import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import goshi1 from '../assets/images/images_goshi/goshi_1.gif';
import goshi2 from '../assets/images/images_goshi/goshi_2.gif';
import goshi3 from '../assets/images/images_goshi/goshi_3.gif';
import PixelButton from '../components/tamagoshi/pixelButton';
import { useGoshiDatabase } from './goshiService';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const Game = () => {
    const { id, name, goshiType, goshiHealth, goshiSleep, goshiHappiness, goshiStatus } = useLocalSearchParams();
    const router = useRouter();
    const { updateSave } = useGoshiDatabase();
    const navigation = useNavigation();

    const goshiid = Number(id);

    //QUANTOS PONTOS DIMINUIR DE CADA STATUS A CADA TICK
    const decreaseAmount = 5;

    //DE QUANTO EM QUANTO TEMPO DIMINUIR OS STATS (MILISEGUNDOS)
    const decreaseTimer = 3000;

    const [health, setHealth] = useState(Number(goshiHealth));
    const [sleep, setSleep] = useState(Number(goshiSleep));
    const [happiness, setHappiness] = useState(Number(goshiHappiness));
    const [status, setStatus] = useState(Array.isArray(goshiStatus) ? goshiStatus[0] : goshiStatus);
    const [pauseTimer, setPauseTimer] = useState(false);

    useEffect(() => {


        const interval = setInterval(() => {

            if (health > 0) {
                setHealth(prev => Math.max(prev - decreaseAmount, 0));
                if (health < 0) {
                    setHealth(0);
                }
            }
            if (sleep > 0) {
                setSleep(prev => Math.max(prev - decreaseAmount, 0));
                if (sleep < 0) {
                    setSleep(0);
                }
            }
            if (happiness > 0) {
                setHappiness(prev => Math.max(prev - decreaseAmount, 0));
                if (happiness < 0) {
                    setHappiness(0);
                }
            }
        }, decreaseTimer);

        return () => clearInterval(interval);

    }, []);

    useEffect(() => {
        updateGoshiStatus();
    }, [health, sleep, happiness]);

    const updateStatusValue = (setter: React.Dispatch<React.SetStateAction<number>>, currentValue: number) => {
        setter(prev => {
            const newValue = prev + 20 > 100 ? 100 : prev + 20;
            return newValue;
        });
    };

    useFocusEffect(
        React.useCallback(() => {
            const onBeforeRemove = async () => {

                await updateSave({ goshiid, health, sleep, happiness, status });

                router.push({ pathname: '/', params: {} });
            };

            const unsubscribe = navigation.addListener('beforeRemove', onBeforeRemove);

            return () => {
                unsubscribe();
                setPauseTimer(false);
            };
        }, [navigation, health, sleep, happiness, status, updateSave, goshiid])
    );

    const updateGoshiStatus = () => {
        const sum = health + sleep + happiness;
        switch (true) {
            case sum === 0:
                setStatus("Dead");
                handleGoshiDeath();
                break;
            case sum <= 50:
                setStatus("Critical");
                break;
            case sum <= 100:
                setStatus("Suffering");
                break;
            case sum <= 150:
                setStatus("Sad");
                break;
            case sum <= 200:
                setStatus("Ok");
                break;
            case sum <= 250:
                setStatus("Good");
                break;
            default:
                setStatus("Very Good");
        }
    };

    // const updateGoshiStatus = () => {
    //     const sum = health + sleep + happiness;
    //     if (sum === 0) {

    //         console.log('passou pela morte');

    //         setStatus("Dead");
    //         handleGoshiDeath();
    //     }
    //     else if (sum <= 50) setStatus("Critical");
    //     else if (sum <= 100) setStatus("Suffering");
    //     else if (sum <= 150) setStatus("Sad");
    //     else if (sum <= 200) setStatus("Ok");
    //     else if (sum <= 250) setStatus("Good");
    //     else setStatus("Very Good");
    // };

    const handleGoshiDeath = async () => {

        Alert.alert(
            "Seu tamagoshi morreu!",
            `${name} não sobreviveu `,
            [
                {
                    text: "OK",
                    onPress: async () => {

                        await updateSave({ goshiid, health, sleep, happiness, status: 'Morto' });

                        router.push({ pathname: '/', params: {} });

                    }
                }
            ],
            { cancelable: false }
        );
    };

    const goshiTypeNumber = Number(goshiType);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.header_text}>{name} Is {status}</Text>
            </View>

            <View style={styles.gifContainer}>
                <Image
                    source={goshiTypeNumber === 1 ? goshi1 : goshiTypeNumber === 2 ? goshi2 : goshi3}
                    style={styles.gif}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.stats_window}>
                <View style={styles.stats}>
                    <View style={styles.container_stats}>
                        <Text style={styles.stats_text}>Health: {health}</Text>
                    </View>
                    <View style={styles.container_button}>
                        <PixelButton title="Alimentar" onPress={() => updateStatusValue(setHealth, health)} />
                    </View>
                </View>

                <View style={styles.stats}>
                    <View style={styles.container_stats}>
                        <Text style={styles.stats_text}>Sleep: {sleep}</Text>
                    </View>
                    <View style={styles.container_button}>
                        <PixelButton title="Dormir" onPress={() => updateStatusValue(setSleep, sleep)} />
                    </View>
                </View>

                <View style={styles.stats}>
                    <View style={styles.container_stats}>
                        <Text style={styles.stats_text}>Happy: {happiness}</Text>
                    </View>
                    <View style={styles.container_button}>
                        <PixelButton title="Brincar" onPress={() => updateStatusValue(setHappiness, happiness)} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
        backgroundColor: '#ccc',
    },
    header: {
        fontSize: 24,
        width: '100%',
        height: 50,
        fontWeight: 'bold',
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#000',
        backgroundColor: '#ffe347',
        paddingHorizontal: 8,
        borderRadius: 2,
    },
    header_text: {
        fontSize: 16,
        fontFamily: 'PressStart2P_400Regular',
    },
    stats_window: {
        alignItems: 'flex-start',
        width: '100%',
        height: 300,
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#000',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 4,
    },
    gifContainer: {
        width: '100%',
        height: 410,
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#000',
        backgroundColor: 'white',
        padding: 4,
    },
    gif: {
        width: '100%',
        height: '100%',
    },
    stats: {
        marginVertical: 8,
        alignItems: 'center',
        fontFamily: 'PressStart2P_400Regular',
        flexDirection: 'row',
    },
    stats_text: {
        fontFamily: 'PressStart2P_400Regular',
        fontSize: 14,
        marginRight: 10,
        marginLeft: 10,
    },
    container_stats: {
        flex: 1,
        alignItems: 'flex-start',
        marginLeft: 10,
    },
    container_button: {
        flex: 1,
        alignItems: 'flex-end',
        marginRight: 25,
    },
});

export default Game;
