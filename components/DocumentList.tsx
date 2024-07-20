import React, { useEffect, useRef, useState } from 'react';
import { Card, Chip } from 'react-native-paper';
import { Text, View } from '@/components/Themed';
import { ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import namespace from '@/app/translations/namespace.js'
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import CustomBottomSheetModal from '@/components/CustomBottomSheetModal';
import { Feather, Entypo } from '@expo/vector-icons';
import { SQLiteProvider, type SQLiteDatabase } from 'expo-sqlite';
import * as SecureStore from 'expo-secure-store';
import { Image } from 'expo-image';
import { DocumentCard } from './DocumentCard';

export function DocumentList() {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const handlePresentModalPress = () => bottomSheetRef.current?.present();
    const [profile, setProfile] = useState(Array<string>);
    const [available, setAvailable] = useState(Array<boolean>);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        const fetchData = () => {
            const resp = SecureStore.getItem('profile') || '["Me"]';
            return JSON.parse(resp);
        }
        setProfile(fetchData());
        checkDocuments('Me');
    }, []);

    const onlyLettersAndNumbers = (str: string): boolean => {
        return /^[A-Za-z0-9]*$/.test(str);
    }

    const addChips = async (title: string, subtitle: string) => {
        Alert.prompt(title, subtitle, [
            {
                text: 'Aggiungi',
                onPress: async value => {
                    if (value != null) {
                        if (onlyLettersAndNumbers(value)) {
                            const clearValue: string = value?.trim() || '';
                            setProfile([...profile, clearValue]);
                            await SecureStore.setItemAsync('profile', JSON.stringify([...profile, clearValue]));
                        } else {
                            addChips('Nome non valido', 'Inserisci un nome senza caratteri speciali o spazi');
                        }
                    } else {
                        addChips('Nome non valido', 'Inserisci un nome valido');
                    }
                }
            },
            {
                text: 'annulla',
                style: 'cancel',
                onPress: () => console.log('Cancel Pressed'),
            }
        ]);
    }

    const selectChips = async (index: number) => {
        //SecureStore.deleteItemAsync('profile');
        let value = profile.splice(index, 1)[0];
        setProfile([value, ...profile]);
        await SecureStore.setItemAsync('profile', JSON.stringify([value, ...profile]));
        await checkDocuments(value);
        scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    }

    const checkDocuments = async (value: string) => {
        const id = await SecureStore.getItemAsync('ID-' + value) != null;
        const ts = await SecureStore.getItemAsync('TS-' + value) != null;
        const pat = await SecureStore.getItemAsync('PAT-' + value) != null;
        const pp = await SecureStore.getItemAsync('PP-' + value) != null;
        setAvailable([id, ts, pat, pp]);
    }

    return (
        <>
            <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded} >
                {profile.length < 2 ?
                    (<View style={styles.image}>
                        <Text style={{ fontSize: 12, fontFamily: 'ManropeBold', right: 50 }}>Aggiungi una persona</Text>
                        <Image style={{
                            width: 90,
                            height: 30,
                        }}
                            source={require('../assets/images/arrow.svg')}
                        /></View>) : ''}
                <CustomBottomSheetModal ref={bottomSheetRef} user={profile[0]} />
                <View style={styles.scrollView}>
                    <ScrollView horizontal={true} onContentSizeChange={(w, h) => scrollViewRef.current?.scrollTo({ x: w, animated: true })} showsHorizontalScrollIndicator={false} ref={scrollViewRef}  >
                        <Chip disabled={false} style={[styles.chips, { backgroundColor: '#dfccfc' }]} id='0' onPress={() => console.log('Pressed')}><Text>{profile[0]}</Text></Chip>
                        {profile.map((value, index) => {
                            if (index != 0) {
                                return <Chip disabled={false} style={styles.chips} id={index.toString()} onPress={() => selectChips(index)}><Text>{value}</Text></Chip>
                            }
                        })}
                    </ScrollView>
                    {profile.length > 3 ? <View style={{
                        height: '100%',
                        width: 1,
                        backgroundColor: '#D0D0D0',
                        marginRight: 5,
                        marginLeft: 0,
                    }}></View> : ''}
                    <Chip disabled={false} style={[styles.chips, { backgroundColor: '#ECECEC' }]} onPress={() => addChips('Aggiungi persona', 'Inserisci come vuoi salvare la persona')}><Entypo name="plus" size={20} color="black" /></Chip>
                </View>
                {available[0] || available[1] || available[2] || available[3] ? (<Card style={[styles.list, { marginBottom: 0 }]} mode='contained'>
                    <DocumentCard title={namespace.t('ID')} subtitle='18/04/2024' id='ID' user={profile[0]} disable={available[0]} firstFist={false} />
                    <DocumentCard title={namespace.t('TS')} subtitle='18/04/2024' id='TS' user={profile[0]} disable={available[1]} firstFist={false} />
                    <DocumentCard title={namespace.t('PAT')} subtitle='18/04/2024' id='PATENTE' user={profile[0]} disable={available[2]} firstFist={false} />
                    <DocumentCard title={namespace.t('PP')} subtitle='18/04/2024' id='PP' user={profile[0]} disable={available[3]} firstFist={false} />
                </Card>) : ''}
                <Card style={[styles.list, { marginTop: 15 }]} mode='contained'>
                    <DocumentCard title={namespace.t('ID')} subtitle='18/04/2024' id='ID' user={profile[0]} disable={available[0]} firstFist={true} />
                    <DocumentCard title={namespace.t('TS')} subtitle='18/04/2024' id='TS' user={profile[0]} disable={available[1]} firstFist={true} />
                    <DocumentCard title={namespace.t('PAT')} subtitle='18/04/2024' id='PATENTE' user={profile[0]} disable={available[2]} firstFist={true} />
                    <DocumentCard title={namespace.t('PP')} subtitle='18/04/2024' id='PP' user={profile[0]} disable={available[3]} firstFist={true} />
                </Card>
                <View style={styles.upload}>
                    <TouchableOpacity onPress={handlePresentModalPress}>
                        <Card.Content style={styles.iconCard}>
                            <Feather name="upload" size={30} color="#6E47D5" />
                            <Text style={{ fontSize: 18, fontFamily: 'ManropeBold', marginTop: 10 }}>{namespace.t('UPLOAD_TITLE')}</Text>
                            <Text style={{ fontSize: 14, color: '#A0A0A0', fontFamily: 'ManropeRegular' }}>{namespace.t('UPLOAD_SUBTITLE')}</Text>
                        </Card.Content>
                    </TouchableOpacity>
                </View >
            </SQLiteProvider >
        </>
    );
}

async function migrateDbIfNeeded(db: SQLiteDatabase) {
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS documents_base64 ( key TEXT PRIMARY KEY NOT NULL, value TEXT);
  `);
}
const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'grey',
    },
    list: {
        height: 'auto',
        margin: 15,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        paddingVertical: 4,
    },
    upload: {
        marginTop: 10,
        height: 'auto',
        marginHorizontal: 15,
        borderRadius: 15,
        backgroundColor: '#ffffff',
        paddingVertical: 4,
    },
    iconCard: {
        margin: 15,
        alignItems: 'center',
    },
    TextName: {
        textAlign: 'left',
        width: '50%',
        opacity: 0.5,
    },
    TextOperation: {
        textAlign: 'right',
        width: '50%',
        opacity: 0.5,
    },
    separator: {
        height: 1,
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    chips: {
        backgroundColor: 'white',
        marginRight: 10,
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'none',
        marginTop: 10,
        marginHorizontal: 15
    },
    image: {
        backgroundColor: 'none',
        position: 'absolute',
        zIndex: 1,
        flex: 1,
        paddingRight: 25,
        alignSelf: 'flex-end',
    },
});
