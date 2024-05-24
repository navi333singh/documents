import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, router } from 'expo-router';
import { Platform, StyleSheet, Image, DimensionValue } from 'react-native';
import { Card } from 'react-native-paper';
import { Text, View } from '@/components/Themed';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import GestureFlipView from 'react-native-gesture-flip-card';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import { Pressable } from 'react-native';
import { Button } from 'react-native-paper';
import { useRef, useEffect, useState } from 'react';
import namespace from '@/app/translations/namespace.js'

export default function ModalScreen() {
  const [data, setData] = useState(Object);

  useEffect(() => {
    const fetchData = () => {
      const resp = SecureStore.getItem('ID') || '';
      return JSON.parse(resp);
    }
    let getData = fetchData();
    let upperCased: any = {};
    for (var key in getData) {
      upperCased[key] = getData[key].toUpperCase();
    }
    setData(upperCased);
  }, [setData]);

  const params = useLocalSearchParams<{ type?: string, }>();
  let flipCard = useRef();

  let cardInfo = {
    numeroCarta: data.card_number,
    comune: data.municipality,
    cognome: data.cognome,
    nome: data.nome,
    luogoEdata: data.place_of_birth + "  " + data.date_of_birth,
    sesso: data.sex,
    statura: data.height,
    cittadinanza: data.nationality,
    emissione: data.issuing_date,
    scadenza: data.expiry_date,
    codiceCarta: data.right_bottom_code,
    codiceFiscale: "SNGNDP00M25Z222Q",
    indirizzo: "VIA DONATI, N. 49 CASIRATE D'ADDA",
    estremi: "37 p2 sB-2023 015059"
  };

  switch (params.type) {
    case 'ID':
      return renderIdCard(cardInfo);
    case 'TS':
      return renderTScard(cardInfo);
    default:
      return renderIdCard(cardInfo);
  }


  function renderIdCard(cardInfo: any) {
    let flipSide = true;
    return (
      <View style={styles.container}>
        <GestureFlipView ref={(ref: any) => (flipCard.current = ref)} width={360} height={270}>
          <Card mode='elevated'>
            <Image
              style={styles.logo}
              source={require('../assets/images/model/ID_FRONTE.png')}
            />
            <Text style={{ fontSize: 14, fontFamily: 'TiliBold', position: 'absolute', top: 10, left: 267 }}>
              {cardInfo.numeroCarta}
            </Text>
            {renderTextID(cardInfo.comune, 59, 66)}
            {renderTextID(cardInfo.cognome, 84, 137)}
            {renderTextID(cardInfo.nome, 100, 137)}
            {renderTextID(cardInfo.luogoEdata, 124.5, 137)}
            {renderTextID(cardInfo.sesso, 149, 137)}
            {renderTextID(cardInfo.statura, 149, 183)}
            {renderTextID(cardInfo.cittadinanza, 149, 232)}
            {renderTextID(cardInfo.emissione, 165, 136)}
            {renderTextID(cardInfo.scadenza, 165, 232)}
            <Text style={{ fontSize: 18, fontFamily: 'TiliBold', position: 'absolute', top: 175, left: 290 }}>
              {cardInfo.codiceCarta}
            </Text>
          </Card>
          <Card>
            <Image
              style={styles.logo}
              source={require('../assets/images/model/ID_RETRO.png')}
            />
            {renderTextID(cardInfo.codiceFiscale, 60, 21)}
            {renderTextID(cardInfo.indirizzo, 82, 21)}
            {renderTextID(cardInfo.estremi, 50, 183)}
            <Barcode
              format="CODE39"
              value={cardInfo.codiceFiscale}
              style={{ position: 'absolute', top: 114, left: 40 }}
              textStyle={{ color: '#000' }}
              height={40}
              maxWidth={285}
            />
          </Card>
        </GestureFlipView>
        <Button icon="cached" textColor='black' style={styles.button} mode="outlined" onPress={() => {
          if (flipSide) {
            flipSide = false;
            flipCard.current.flipLeft();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          else {
            flipSide = true;
            flipCard.current.flipRight();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }}>{namespace.t('ROTATE')}
        </Button>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View >
    );
  }

  function renderTScard(cardInfo: any) {
    let flipSide = true;
    return (
      <View style={styles.container}>
        <GestureFlipView ref={(ref: any) => (flipCard.current = ref)} width={360} height={270}>
          <Card>
            <Image
              style={styles.logo}
              source={require('../assets/images/model/TS_FRONTE.png')}
            />
          </Card>
          <Card  >
            <Image
              style={styles.logo}
              source={require('../assets/images/model/TS_RETRO.png')}
            />
            {renderTextTS(cardInfo.codiceFiscale, 178, 18)}
            {renderTextTS(cardInfo.nome, 154.5, 18)}
            {renderTextTS(cardInfo.cognome, 131.5, 18)}
            <Barcode
              format="CODE39"
              value={cardInfo.codiceFiscale}
              style={{ position: 'absolute', top: 80, left: 75 }}
              textStyle={{ color: '#000' }}
              height={40}
              maxWidth={210}
            />
          </Card>
        </GestureFlipView>
        <Button icon="cached" textColor='black' style={styles.button} mode="outlined" onPress={() => {
          if (flipSide) {
            flipSide = false;
            flipCard.current.flipLeft();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          else {
            flipSide = true;
            flipCard.current.flipRight();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
        }}>{namespace.t('ROTATE')}
        </Button>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    );
  }


  function renderTextID(cardInfo: String, top: DimensionValue, left: DimensionValue) {
    return (
      <Text
        style={{ fontSize: 10, fontFamily: 'TiliBold', position: 'absolute', top: top, left: left }}>
        {cardInfo}
      </Text>
    );
  }

  function renderTextTS(cardInfo: String, top: DimensionValue, left: DimensionValue) {
    return (
      <Text
        style={{ fontSize: 12, fontFamily: 'TiliBold', position: 'absolute', top: top, left: left }}>
        {cardInfo}
      </Text>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: 60,
  },
  logo: {
    width: 360,
    height: 230,
  },
  button: {
    width: 80,
    height: 40,
    opacity: 0.7,
  },
});