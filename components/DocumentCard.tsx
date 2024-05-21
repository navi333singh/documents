import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Avatar, Card, Button, IconButton } from 'react-native-paper';
import { images } from '../constants/Image';

export function DocumentCard(
    props: { title?: string; subtitle?: string; imgSource: string; }
) {

    return (
        <Link href="/modal" asChild>
            <Card style={styles.card} mode='contained' >
                <Card.Title
                    title={props.title || "deafult"}
                    titleStyle={styles.title}
                    subtitle={props.subtitle || "deafult"}
                    subtitleStyle={styles.subtitle}
                    left={() => <Avatar.Image style={styles.icon} size={48} source={images(props.imgSource)} />}
                    right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => { }} />}
                />
            </Card>
        </Link>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 4,
        backgroundColor: '#ffffff',
        borderRadius: 30,
    },
    icon: {
        backgroundColor: '#FFFFFF',
    },
    subtitle: {
        fontFamily: 'ManropeRegular',
        color: '#737d88',
    },
    title: {
        fontFamily: 'ManropeBold',

    },
});