import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Image } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/images/model/ID_FRONTE.png')}
      />
      <Image
        style={styles.logo}
        source={require('../assets/images/retro.png')}
      />
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 70,
    paddingBottom: 1000,
    backgroundColor: '#FFFFFF'
  },

  logo: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 360,
    height: 230,
    marginBottom: 50,
    backgroundColor: '#FFFFFF'
  },
});