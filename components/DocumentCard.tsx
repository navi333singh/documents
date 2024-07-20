import { Link } from 'expo-router';
import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Avatar, Card, IconButton } from 'react-native-paper';
import { images } from '../constants/Image';
import { View } from './Themed';
import namespace from '@/app/translations/namespace.js'

export function DocumentCard(
    props: { title?: string; subtitle?: string; id: string; user: string; disable: boolean, firstFist: boolean }
) {
    return (
        <>
            {
                !props.firstFist && props.disable ? (<Link href={{ pathname: "/modal", params: { type: props.id, user: props.user } }} asChild>
                    <Card style={styles.card} mode='contained'>
                        <Card.Title
                            title={props.title || "deafult"}
                            titleStyle={styles.title}
                            subtitle={props.subtitle || "deafult"}
                            subtitleStyle={styles.subtitle}
                            left={() => <Avatar.Image style={styles.icon} size={48} source={images(props.id)} />}
                            right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => { }} />}
                        />
                    </Card>
                </Link>) : ''
            }
            {
                props.firstFist && !props.disable ? (<Card style={styles.card} mode='contained' disabled={true}>
                    <View style={{
                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1, opacity: 0.7, backgroundColor: '#E3E3E3', margin: 4,
                        borderRadius: 10,
                    }}>
                        <Card.Content style={styles.iconCard}>
                            <Text style={{ fontSize: 15, fontFamily: 'ManropeBold', marginBottom: 10, }}>{namespace.t('NOT_AVAILABLE')}</Text>
                        </Card.Content>
                    </View>
                    <Card.Title style={styles.notAvailable}
                        title={""}
                        left={() => <Avatar.Image style={styles.icon} size={48} source={images(props.id)} />}
                        right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => { }} />}
                    />
                </Card >) : ''
            }
        </>
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
    notAvailable: {
        margin: 4,
        backgroundColor: '#ffffff',
        borderRadius: 30,
        opacity: 1
    },
    iconCard: {
        alignItems: 'center',
    },
});