import { StyleSheet, SafeAreaView, Animated, ScrollView } from 'react-native';
import { useRef } from 'react';
import { Link } from 'expo-router';
import { Text, View } from '@/components/Themed';
import { DocumentCard } from '@/components/DocumentCard';
import { DocumentList } from '@/components/DocumentList';
import namespace from '@/app/translations/namespace.js';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import React from 'react';
export default function HomeScreen() {
  const animState = useRef(new Animated.Value(0)).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerCard}>
        <Link href={{ pathname: "/search" }} asChild>
          <SearchBar
            platform='ios'
            searchIcon={() => <Ionicons name="search" size={24} color="black" />}
            placeholder={namespace.t('SEARCHBAR')}
            placeholderTextColor='#15161a'
            containerStyle={{ backgroundColor: '#f7f7f7', marginHorizontal: 10 }}
            inputContainerStyle={{ maxHeight: 30, borderRadius: 15, backgroundColor: '#eeeff3' }}
            disabled={true}
          />
        </Link>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>{namespace.t('DOCUMENTS')}</Text>
        <DocumentList />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 20,
    paddingTop: 15,
    marginLeft: 17,
    fontFamily: 'ManropeBold',
  },
  headerCard: {
    borderRadius: 17,
    paddingBottom: 5,
    backgroundColor: '#f7f7f7'
  },
  title: {
    marginTop: 60,
    marginLeft: 10,
    fontSize: 30,
    fontFamily: 'ManropeBold',
    marginBottom: 10,
  },
  separator: {
    marginTop: 20,
    height: 1,
    width: '100%',
  },
  separatorList: {
    marginVertical: 0,
    height: 1,
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  searchbar: {
    marginHorizontal: 15,
    borderRadius: 15,
  },
});
