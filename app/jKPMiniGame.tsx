import React, { useState } from 'react';
import { View, Text, Image, Button, StyleSheet, Alert } from 'react-native';
import rockImage from '../assets/images/images_goshi/rock.png';
import paperImage from '../assets/images/images_goshi/paper.png';
import scissorsImage from '../assets/images/images_goshi/scissor.png';
import { useGoshiDatabase } from './goshiService';
import PixelButton from '@/components/tamagoshi/pixelButton';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Save } from '@/tipes/tipes';
import { useNavigation } from '@react-navigation/native';

//NÃO SEI POR QUE MAS DEFINIR NO ARQUIVO DE TYPES NÃO FUNCIONOU
type Choice = 'rock' | 'paper' | 'scissors';

const choices: Choice[] = ['rock', 'paper', 'scissors'];
const choiceImages: Record<Choice, any> = {
    rock: rockImage,
    paper: paperImage,
    scissors: scissorsImage,
};

const RockPaperScissors = () => {

    const [userScore, setUserScore] = useState(0);
    const [appScore, setAppScore] = useState(0);
    const [userChoice, setUserChoice] = useState<Choice | ''>('');
    const [appChoice, setAppChoice] = useState<Choice | ''>('');
    const [winner, setWinner] = useState<string>('');

    const { id, happiness, goshiType } = useLocalSearchParams();
    const { updateHappiness, getSingleSave } = useGoshiDatabase();
    const navigation = useNavigation();

    const router = useRouter();

    const goshiid = Number(id);
    const gif = Number(goshiType);
    const currentHappiness = Number(happiness);

    useFocusEffect(
        React.useCallback(() => {
 
            const unsubscribe = navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
            });

        }, [navigation])
    );

    const handleEndGame = async () => {

        try {

            const newHappiness = Math.min(currentHappiness + 30, 100);

            console.log('valores do minigame', goshiid, newHappiness);

            await updateHappiness({ goshiid, happiness: newHappiness });

            handleGoBack();

        } catch (err) {
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

    const playGame = (userSelection: Choice) => {
        const appSelection = choices[Math.floor(Math.random() * choices.length)];
        setUserChoice(userSelection);
        setAppChoice(appSelection);
    
        let newUserScore = userScore;
        let newAppScore = appScore;
    
        if (userSelection === appSelection) {
            setWinner("Empate!");
        } else if (
            (userSelection === 'rock' && appSelection === 'scissors') ||
            (userSelection === 'paper' && appSelection === 'rock') ||
            (userSelection === 'scissors' && appSelection === 'paper')
        ) {
            newUserScore += 1;
            setUserScore(newUserScore);
            setWinner("Você ganhou a rodada!");
        } else {
            newAppScore += 1;
            setAppScore(newAppScore);
            setWinner("Seu goshi ganhou a rodada!");
        }
    
        if (newUserScore === 3) {
            Alert.alert(
                "Parabéns!",
                "Você venceu o jogo!",
                [{ text: "OK", onPress: handleEndGame }],
                { cancelable: false }
            );
        } else if (newAppScore === 3) {
            Alert.alert(
                "Mais sorte na próxima!",
                "Seu goshi venceu o jogo!",
                [{ text: "OK", onPress: handleEndGame }],
                { cancelable: false }
            );
        }
    };
    



    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Jan, Ken, Pon!!!</Text>
            </View>
            <View style={styles.score}>
                <Text style={styles.headerText}>You: {userScore} | Goshi: {appScore}</Text>
            </View>
            <View style={styles.choices}>
                {userChoice && (
                    <Image source={choiceImages[userChoice]} style={styles.image} />
                )}
                {appChoice && (
                    <Image
                        source={choiceImages[appChoice]}
                        style={[styles.image, styles.appChoiceImage]}
                    />
                )}
            </View>
            <View style={styles.score}>
                <Text style={styles.headerText}>{winner}</Text>
            </View>
            <View  style={styles.buttonsContainer}>
                <View style={styles.buttons}>
                    {choices.map(choice => (
                        <PixelButton key={choice} title={choice} onPress={() => playGame(choice)} />
                    ))}
                </View>
                <View style={styles.BackButton}>
                    <PixelButton title={"Back"} onPress={handleGoBack} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    header: {
        fontSize: 24,
        width: '95%',
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

    headerText: {
        fontSize: 16,
        fontFamily: 'PressStart2P_400Regular',
    },

    score: {
        fontSize: 24,
        width: '95%',
        height: 50,
        fontWeight: 'bold',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#000',
        backgroundColor: 'white',
        paddingHorizontal: 8,
        borderRadius: 2,
    },

    scoreText: {

    },

    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    choices: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
        width: '95%',
        height: 350,
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#000',
        backgroundColor: 'white',
        padding: 20,
    },
    image: {
        width: 160,
        height: 160,
        padding: 10,
        marginHorizontal: 20,
        resizeMode: 'contain'

    },

    appChoiceImage: {
        transform: [{ scaleX: -1 }],
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '80%',
        padding: 10
    },
    BackButton: {

        marginBottom: 10
    },
    buttonsContainer: {
        width: '95%',
        height: 200,
        justifyContent: 'center',
        alignItems:'center',
        borderWidth: 4,
        borderColor: '#000',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 4,
    }
});

export default RockPaperScissors;
