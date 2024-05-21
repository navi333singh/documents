import React from 'react';
import { Card, IconButton } from 'react-native-paper';
import { Text, View } from '@/components/Themed';
import { StyleSheet } from 'react-native';
import namespace from '@/app/translations/namespace.js'

export function DocumentList({ children }: { children: React.ReactNode }
) {
    return (
        <>
            <Card style={styles.list} mode='contained'>
                {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
                {children}
            </Card>
            <View style={styles.upload}>
                <Card.Content style={styles.iconCard}>
                    <IconButton
                        icon="file-upload-outline"
                        iconColor={'#6E47D5'}
                        mode='contained'
                        size={40}
                        onPress={() => console.log('Pressed')}
                    />
                    <Text style={{ fontSize: 18, fontFamily: 'ManropeBold' }}>{namespace.t('UPLOAD_TITLE')}</Text>
                    <Text style={{ fontSize: 14, color: '#A0A0A0', fontFamily: 'ManropeRegular' }}>{namespace.t('UPLOAD_SUBTITLE')}</Text>
                </Card.Content>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
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
