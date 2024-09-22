import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Accelerometer, AccelerometerMeasurement } from "expo-sensors";
import React, { useEffect, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, View, Alert } from "react-native";
import { useGoshiDatabase } from './goshiService';
import goshi1 from '../assets/images/images_goshi/goshi_1.gif';
import goshi2 from '../assets/images/images_goshi/goshi_2.gif';
import goshi3 from '../assets/images/images_goshi/goshi_3.gif';
import PixelButton from '../components/tamagoshi/pixelButton';
import background from '../assets/images/images_goshi/background.png';
import {Save} from "@/tipes/tipes";
import { useNavigation } from '@react-navigation/native';

const stepsMiniGame = () => {
    const [stepsCount, setStepsCount] = useState<number>(0);
    const [stepsGoal, setStepsGoal] = useState<number>(0);
    const [miniGameStarted, setMiniGameStarted] = useState<Boolean>(false); 
    const [subscription, setSubscription] = useState<any>(null);
    const [lastUpdateTime, setLastUpdateTime] = useState<number>(0); 

    const router = useRouter();
    const {updateHappiness, getSingleSave } = useGoshiDatabase();
    const { id, happiness, goshiType } = useLocalSearchParams();
    const navigation = useNavigation();
    


    const goshiid = Number(id);
    const gif = Number(goshiType);
    const currentHappiness = Number(happiness);

    useEffect(() => {
 
        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, [subscription]);

    useEffect(() => {

        checkWinCondition();
    }, [stepsCount]);

    useFocusEffect(
        React.useCallback(() => {
 
            const unsubscribe = navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
            });

        }, [navigation])
    );

    const startMiniGame = () => {

        //QTD MÍNIMA DE PASSOS
        const min = 2;

        //QTD MÁXIMA DE PASSOS
        const max = 10; 
        const steps = Math.floor(Math.random() * (max - min + 1)) + min;

        console.log(`Meta de passos: ${steps}`);
        
        setStepsGoal(steps);
        setStepsCount(0);
        setMiniGameStarted(true); 
        setLastUpdateTime(0); 
        subscribeAccelerometer();
    }

    const subscribeAccelerometer = () => {
        const accelSubscription = Accelerometer.addListener((data: AccelerometerMeasurement) => {
            const currentTime = Date.now();

            if (currentTime - lastUpdateTime < 400) { 
                return;
            }

            const { x, y, z } = data;

            const movementMagnitude = Math.sqrt(x * x + y * y + z * z);

            if (movementMagnitude > 3) { 
                setStepsCount((prev) => prev + 1); 
                setLastUpdateTime(currentTime); 
            }
        });
        setSubscription(accelSubscription);
    };

    const checkWinCondition = () => {
        console.log(`Objetivo: ${stepsGoal}, Passos: ${stepsCount}`);
        if (stepsGoal > 0 && stepsGoal === stepsCount) {
            Alert.alert(
                "Parabéns!",
                "Quantidade de passos atingida.",
                [{ text: "OK", onPress: handleEndGame }],
                { cancelable: false }
            );
        }
    };

    const handleEndGame = async () => {

        try {
        
            const newHappiness = Math.min(currentHappiness + 30, 100);

            console.log('valores do minigame', goshiid,newHappiness);
    
            await updateHappiness({ goshiid, happiness: newHappiness });
    
            if (subscription) {
                subscription.remove();
                setSubscription(null);
            }
    
            setMiniGameStarted(false); 
            handleGoBack();
        }catch(err){
            console.log(err);
            alert("erro ao encerrar o jogo");
         }
    }

   const handleGoBack = async () => {
        try {

            const save: Save | undefined = await getSingleSave({ goshiid });

            console.log('saindo do jogo', save);
    
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
        <ImageBackground source={background} style={styles.container}>
            <Image source={gif === 1 ? goshi1 : gif === 2 ? goshi2 : goshi3} style={styles.goshiImage} />
            <View style={styles.menu}>

                <Text style={styles.counterText}>Passos: {stepsCount}/{stepsGoal}</Text>
                {!miniGameStarted && <PixelButton title="Start Game" onPress={startMiniGame}/>}
                <PixelButton title="Back" onPress={handleGoBack} />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goshiImage: {
        width: 100,
        height: 100,
        position: 'absolute',
        top: '60%',
    },
    menu: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    counterText: {
        fontSize: 18,
        color: 'white',
    },
});

export default stepsMiniGame;
