import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useGoshiDatabase } from './goshiService';
import goshi1 from '../assets/images/images_goshi/goshi_1.gif';
import goshi2 from '../assets/images/images_goshi/goshi_2.gif';
import goshi3 from '../assets/images/images_goshi/goshi_3.gif';

const Saves = () => {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 16,
        },
        card: {
            backgroundColor: '#f9f9f9',
            padding: 16,
            marginVertical: 8,
            borderRadius: 8,
            elevation: 4,
            alignItems: 'center', // Center the content
        },
        name: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        gifContainer: {
            width: 100, // Adjust width as needed
            height: 100, // Adjust height as needed
            marginBottom: 8,
        },
        gif: {
            width: '100%',
            height: '100%',
            borderRadius: 8,
        }
    });

    type Save = {
        id: number;
        name: string;
        goshiType: number;
        goshiHealth: number;
        goshiSleep: number;
        goshiHappiness: number;
        goshiStatus: string;
    }

    const { getSaves, createSavesExamples } = useGoshiDatabase();
    const [saves, setSaves] = useState<Save[]>([]);

    useEffect(() => {
        async function fetchData() {
            const result = await getSaves();
            if (result) {
                setSaves(result as Save[]);
            }
        }

        createSavesExamples();
        fetchData();
    }, []);

    type GifMap = {
        [key: number]: any; 
    };

    const gifMap = {
        1: goshi1,
        2: goshi2,
        3: goshi3,
    };

    const renderSaveItem = ({ item }: { item: Save }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => { }}
        >
            <View style={styles.gifContainer}>
                <Image
                    source={item.goshiType === 1 && goshi1 || item.goshiType === 2 && goshi2 || item.goshiType === 3 && goshi3}
                    style={styles.gif}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.name}>{item.name}</Text>
            <Text>Type: {item.goshiType}</Text>
            <Text>Health: {item.goshiHealth}</Text>
            <Text>Sleep: {item.goshiSleep}</Text>
            <Text>Happiness: {item.goshiHappiness}</Text>
            <Text>Status: {item.goshiStatus}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={saves}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderSaveItem}
            />
        </View>
    );
}

export default Saves;
