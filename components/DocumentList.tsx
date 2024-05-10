import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Avatar, Card, Button, IconButton } from 'react-native-paper';
import { Text, View } from '@/components/Themed';
import { StyleSheet, ScrollView } from 'react-native';
export function DocumentList({ children }: { children: React.ReactNode }
) {
    return (

        <Card style={styles.list} mode='contained'>

            {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
            {children}

        </Card>
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
