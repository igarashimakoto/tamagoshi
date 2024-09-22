import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import goshi1 from '../assets/images/images_goshi/goshi_1.gif';
import goshi2 from '../assets/images/images_goshi/goshi_2.gif';
import goshi3 from '../assets/images/images_goshi/goshi_3.gif';
import PixelButton from '../components/tamagoshi/pixelButton';
import { useGoshiDatabase } from './goshiService';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const Game = () => {
    const { id, name, goshiType, goshiHealth, goshiSleep, goshiHappiness, goshiStatus } = useLocalSearchParams();
    const router = useRouter();
    const { updateSave } = useGoshiDatabase();
    const navigation = useNavigation();

    const goshiid = Number(id);
    const decreaseAmount = 5;
    const decreaseTimer = 2000;

    const [health, setHealth] = useState(Number(goshiHealth));
    const [sleep, setSleep] = useState(Number(goshiSleep));
    const [happiness, setHappiness] = useState(Number(goshiHappiness));
    const [status, setStatus] = useState(Array.isArray(goshiStatus) ? goshiStatus[0] : goshiStatus);
    const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);
    const [isGameActive, setIsGameActive] = useState(false);

    useEffect(() => {
        if (isGameActive) {
            updateGoshiStatus();
        }
    }, [health, sleep, happiness, isGameActive]);

    const updateGoshiStatus = () => {
        const sum = health + sleep + happiness;
        console.log("testou:", sum)
        if (sum === 0) {
            setStatus("Dead");
            handleGoshiDeath();
        } else if (sum <= 50) {
            setStatus("Critical");
        } else if (sum <= 100) {
            setStatus("Suffering");
        } else if (sum <= 150) {
            setStatus("Sad");
        } else if (sum <= 200) {
            setStatus("Ok");
        } else if (sum <= 250) {
            setStatus("Good");
        } else {
            setStatus("Very Good");
        }
    };

    const startDecreasingStats = () => {
        if (intervalId) return;
        const id = setInterval(() => {
            setHealth(prev => Math.max(prev - decreaseAmount, 0));
            setSleep(prev => Math.max(prev - decreaseAmount, 0));
            setHappiness(prev => Math.max(prev - decreaseAmount, 0));
        }, decreaseTimer);
        setIntervalId(id);
    };

    const stopDecreasingStats = () => {
        if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            setIsGameActive(true);
            startDecreasingStats();

            const unsubscribe = navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
                stopDecreasingStats();
                setIsGameActive(false);

            });

            return () => {
                stopDecreasingStats();
                setIsGameActive(false);
                unsubscribe();
            };
        }, [navigation])
    );

    const handleGoshiDeath = async () => {
        Alert.alert(
            "Seu tamagoshi morreu!",
            `${name} não sobreviveu `,
            [
                {
                    text: "OK",
                    onPress: async () => {
                        await updateSave({ goshiid, health, sleep, happiness, status: 'Dead' });
                        router.push({ pathname: '/', params: {} });
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const handleGoMiniGame = async () => {
        try {
            await updateSave({ goshiid, health, sleep, happiness, status });
            // await updateSave({ goshiid, health, sleep, happiness, status });
            // router.push({
            //     pathname: '/stepsMiniGame',
            //     params: {
            //         id: goshiid,
            //         happiness: happiness,
            //         goshiType: goshiType
            //     }
            // });

            // router.push({
            //     pathname: './JKPMiniGame',
            //     params: {
            //         id: goshiid,
            //         happiness: happiness,
            //         goshiType: goshiType
            //     }
            // });
            router.push({
                pathname: './miniGamesNav',
                params: {
                    id: goshiid,
                    happiness: happiness,
                    goshiType: goshiType
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const updateStatusValue = (setter: React.Dispatch<React.SetStateAction<number>>) => {
        setter(prev => Math.min(prev + 20, 100));
    };

    const handleBackButtonPress = async () => {

        try {
    
            await updateSave({ goshiid, health, sleep, happiness, status });
            router.push('/');
        } catch (err) {
            console.log(err);
        }
    
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.header_text}>{name} Is {status}</Text>
            </View>

            <View style={styles.gifContainer}>
                <Image
                    source={Number(goshiType) === 1 ? goshi1 : Number(goshiType) === 2 ? goshi2 : goshi3}
                    style={styles.gif}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statsWindow}>
                    <View style={styles.stats}>
                        <View style={styles.container_stats}>
                            <Text style={styles.stats_text}>Health: {health}</Text>
                        </View>
                        <View style={styles.container_button}>
                            <PixelButton title="Feed" onPress={() => updateStatusValue(setHealth)} />
                        </View>
                    </View>

                    <View style={styles.stats}>
                        <View style={styles.container_stats}>
                            <Text style={styles.stats_text}>Sleep: {sleep}</Text>
                        </View>
                        <View style={styles.container_button}>
                            <PixelButton title="Sleep" onPress={() => updateStatusValue(setSleep)} />
                        </View>
                    </View>

                    <View style={styles.stats}>
                        <View style={styles.container_stats}>
                            <Text style={styles.stats_text}>Happy: {happiness}</Text>
                        </View>
                        <View style={styles.container_button}>
                            <PixelButton title="Play" onPress={handleGoMiniGame} />
                        </View>

                    </View>
                </View>
                <View style={styles.backButton}>
                        <PixelButton title="Back" onPress={handleBackButtonPress} />
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
    statsContainer: {

        width: '100%',
        height: 300,
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#000',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 4,
    },

    statsWindow: {
        alignItems: 'flex-start',

    },
    backButton :{

        alignItems:'center',
        justifyContent: 'center',
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
