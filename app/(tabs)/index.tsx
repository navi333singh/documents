import { StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { Searchbar } from 'react-native-paper';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';
import { DocumentCard } from '@/components/DocumentCard';
import { DocumentList } from '@/components/DocumentList';
import namespace from '@/app/translations/namespace.js'

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{namespace.t('TITLE')}</Text>
      <View style={styles.searchbar}>
        <Searchbar
          placeholder={namespace.t('SEARCHBAR')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          theme={theme}
        />
      </View>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>{namespace.t('DOCUMENTS')}</Text>
        <DocumentList>
          <DocumentCard title={namespace.t('ID')} subtitle='18/04/2024' imgSource='TS' />

          <DocumentCard title={namespace.t('TS')} subtitle='18/04/2024' imgSource='TS' />

          <DocumentCard title={namespace.t('PAT')} subtitle='18/04/2024' imgSource='Patente' />

          <DocumentCard title={namespace.t('PP')} subtitle='18/04/2024' imgSource='TS' />

        </DocumentList>
      </ScrollView>
    </View >
  );
}

const theme = {
  roundness: 2,
  colors: {
    elevation: {
      level3: "#eeeff3",
    },
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 20,
    paddingTop: 30,
    marginLeft: 10,
  },
  title: {
    marginTop: 60,
    marginLeft: 10,
    fontSize: 30,
    fontWeight: 'bold',
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
