import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { useGoshiDatabase } from './goshiService';
import goshi1 from '../assets/images/images_goshi/goshi_1.gif';
import goshi2 from '../assets/images/images_goshi/goshi_2.gif';
import goshi3 from '../assets/images/images_goshi/goshi_3.gif';
import goshiDead from '../assets/images/images_goshi/goshi_dead.png';
import { useFocusEffect, useRouter } from 'expo-router';
import NewSaveForm from '@/components/tamagoshi/newSave';
import { useNavigation } from '@react-navigation/native';

const Saves = () => {

    const router = useRouter();
    const navigation = useNavigation();

    useEffect(() => {
        async function fetchData() {
            const result = await getSaves();
            if (result) {
                setSaves(result as Save[]);
            }
        }

        //feito só para teste
        //createSavesExamples();
        fetchData();
    }, []);
    
    useFocusEffect(
        React.useCallback(() => {
 
            const unsubscribe = navigation.addListener('beforeRemove', (e) => {
                e.preventDefault();
            });

        }, [navigation])
    );

    const { getSaves, createSavesExamples, deleteSave } = useGoshiDatabase();
    const [saves, setSaves] = useState<Save[]>([]);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    type Save = {
        id: number;
        name: string;
        goshiType: number;
        goshiHealth: number;
        goshiSleep: number;
        goshiHappiness: number;
        goshiStatus: string;
    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
        },
        card: {
            backgroundColor: '#f9f9f9',
            padding: 16,
            marginVertical: 8,
            elevation: 4,
            alignItems: 'center',
            flexDirection: 'column',
            borderWidth: 4,
            borderColor: '#000',
            paddingHorizontal: 8,
            borderRadius: 2,
        },
        card_info: {
            alignItems: 'center',
        },
        name: {
            fontSize: 14,
            fontFamily: 'PressStart2P_400Regular',
        },
        list_text: {
            fontSize: 10,
            fontFamily: 'PressStart2P_400Regular',
        },

        gifContainer: {
            width: 100,
            height: 100,
            marginBottom: 8,
        },
        gif: {
            width: '100%',
            height: '100%',
            borderRadius: 8,
        },

        new_save: {
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            borderWidth: 4,
            borderColor: '#000',
            backgroundColor: '#ccc',
            paddingHorizontal: 8,
            borderRadius: 2,
        },
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
        deleteButton: {
            backgroundColor: '#ff4d4d',
            borderColor: '#000',
            borderWidth: 2,
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginTop: 10,
        },
        deleteButtonText: {
            fontFamily: 'PressStart2P_400Regular',
            fontSize: 10,
            color: '#fff',
            textAlign: 'center',
        },
    });

    const updateSavesList = async () => {
        const result = await getSaves();
        if (result) {
            setSaves(result as Save[]);
        }
    };

    const handleDelete = (id: number) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Você tem certeza que deseja excluir este Save?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    onPress: async () => {
                        await deleteSave({ id });
                        updateSavesList();
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: false }
        );
    };

    const renderSaveItem = ({ item }: { item: Save }) => (
        <View style={styles.card}>
            <TouchableOpacity style={styles.card_info}
                onPress={() => {

                    if (item.goshiStatus === 'Dead') {

                        Alert.alert(
                            'Goshi Morto',
                            'Este save não pode ser aberto.',
                            [{ text: 'OK', style: 'cancel' }]
                        );
                    } else {

                        router.push({
                            pathname: '/game',
                            params: {
                                id: item.id,
                                name: item.name,
                                goshiType: item.goshiType,
                                goshiHealth: item.goshiHealth,
                                goshiSleep: item.goshiSleep,
                                goshiHappiness: item.goshiHappiness,
                                goshiStatus: item.goshiStatus
                            }
                        });
                    }
                }}
            >
                <View style={styles.gifContainer}>
                    <Image
                        source={item.goshiStatus === 'Dead' && goshiDead || item.goshiType === 1 && goshi1 || item.goshiType === 2 && goshi2 || item.goshiType === 3 && goshi3}
                        style={styles.gif}
                        resizeMode="contain"
                    />
                </View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.list_text}>Health: {item.goshiHealth}</Text>
                <Text style={styles.list_text}>Sleep: {item.goshiSleep}</Text>
                <Text style={styles.list_text}>Happiness: {item.goshiHappiness}</Text>
                <Text style={styles.list_text}>Status: {item.goshiStatus}</Text>
            </TouchableOpacity>
            <Pressable
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}
            >
                <Text style={styles.deleteButtonText}>Excluir</Text>
            </Pressable>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={saves}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSaveItem}
            />
            <View style={styles.new_save}>
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed ? styles.buttonPressed : null,
                    ]}
                    onPress={() => { setDialogOpen(true) }}>
                    <Text style={styles.buttonText}>Novo</Text>
                </Pressable>
                <NewSaveForm
                    visible={dialogOpen}
                    onClose={() => { setDialogOpen(false); updateSavesList(); }}
                />
            </View>
        </View>
    );
}

export default Saves;
