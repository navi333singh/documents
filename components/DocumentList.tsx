import React, { useRef, useState } from 'react';
import { Card } from 'react-native-paper';
import { Text, View } from '@/components/Themed';
import { StyleSheet, TouchableOpacity } from 'react-native';
import namespace from '@/app/translations/namespace.js'
import { BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import CustomBottomSheetModal from '@/components/CustomBottomSheetModal';
import { Feather } from '@expo/vector-icons';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';
export function DocumentList({ children }: { children: React.ReactNode }
) {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const handlePresentModalPress = () => bottomSheetRef.current?.present();
    return (
        <>
            <SQLiteProvider databaseName="test.db" onInit={migrateDbIfNeeded} >
                <CustomBottomSheetModal ref={bottomSheetRef} />
                <Card style={styles.list} mode='contained'>
                    {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
                    {children}
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
            </SQLiteProvider>
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
});
