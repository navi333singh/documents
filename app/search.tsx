import { Link, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import { SearchBar } from 'react-native-elements';
import Ionicons from '@expo/vector-icons/Ionicons';
import namespace from '@/app/translations/namespace.js';
import { DocumentCard } from '@/components/DocumentCard';

export default function search(
) {

    const [searchQuery, setSearchQuery] = useState('');
    const search = useRef();
    const onClickHandler = () => {
        router.navigate('/');
    };
    return (
        <SafeAreaView style={styles.container}>
            <SearchBar
                platform='ios'
                autoFocus={true}
                searchIcon={() => <Ionicons name="search" size={24} color="black" />}
                clearIcon={() => <Ionicons name="close-circle" size={24} color="gray" onPress={() => setSearchQuery('')} />}
                placeholder={namespace.t('SEARCHBAR')}
                cancelButtonTitle='Chiudi'
                placeholderTextColor='#15161a'
                onChangeText={setSearchQuery}
                containerStyle={{ backgroundColor: '#f7f7f7', marginHorizontal: 10 }}
                inputContainerStyle={{ maxHeight: 30, borderRadius: 15, backgroundColor: '#eeeff3' }}
                clean={() => console.log("pressed")}
                value={searchQuery}
                onCancel={onClickHandler}
                showCancel={true}

            />
            <View>
                <DocumentCard title={namespace.t('ID')} subtitle='18/04/2024' id='ID' />
                <DocumentCard title={namespace.t('TS')} subtitle='18/04/2024' id='TS' />
                <DocumentCard title={namespace.t('PAT')} subtitle='18/04/2024' id='PATENTE' />
                <DocumentCard title={namespace.t('PP')} subtitle='18/04/2024' id='PP' />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f7f7f7',
        flex: 1,
    },
    headerCard: {
        borderRadius: 17,
        paddingBottom: 5,
        backgroundColor: '#f7f7f7'
    },
});