import { StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { Searchbar, Avatar, Card, IconButton } from 'react-native-paper';
import { Text, View } from '@/components/Themed';
import { DocumentCard } from '@/components/DocumentCard';
import { DocumentList } from '@/components/DocumentList';
import namespace from '@/app/translations/namespace.js'

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  return (

    <View style={styles.container}>
      {/* <View style={styles.searchbar}>
            <Searchbar
              placeholder={namespace.t('SEARCHBAR')}
              onChangeText={setSearchQuery}
              value={searchQuery}
              theme={theme}
            />
          </View> */}
      <View style={styles.headerCard}>
        <Card.Title
          title={namespace.t('HOME_TITLE')}
          titleStyle={{ fontFamily: 'ManropeBold', fontSize: 16, }}
          subtitle={"Navdeep Singh"}
          subtitleStyle={{ fontFamily: 'ManropeBold', fontSize: 19, }}
          left={(props) => <Avatar.Icon {...props} size={45} style={{ borderRadius: 13 }} icon="account-circle-outline" />}
        />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>{namespace.t('DOCUMENTS')}</Text>
        <DocumentList>
          <DocumentCard title={namespace.t('ID')} subtitle='18/04/2024' imgSource='ID' />
          <DocumentCard title={namespace.t('TS')} subtitle='18/04/2024' imgSource='TS' />
          <DocumentCard title={namespace.t('PAT')} subtitle='18/04/2024' imgSource='Patente' />
          <DocumentCard title={namespace.t('PP')} subtitle='18/04/2024' imgSource='passaporto' />
        </DocumentList>
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    fontSize: 20,
    paddingTop: 30,
    marginLeft: 17,
    fontFamily: 'ManropeBold',
  },
  headerCard: {
    paddingTop: 60,
    borderRadius: 17,
    paddingBottom: 5,
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
