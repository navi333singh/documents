import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams } from 'expo-router';
import { Platform, StyleSheet, Image, DimensionValue, TouchableOpacity, ScrollView } from 'react-native';
import { Card } from 'react-native-paper';
import { Text, View } from '@/components/Themed';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import GestureFlipView from 'react-native-gesture-flip-card';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import { useRef, useEffect, useState } from 'react';
import namespace from '@/app/translations/namespace.js'
import * as Clipboard from 'expo-clipboard';
import { Button, Snackbar } from 'react-native-paper';

export default function ModalScreen() {
  const [data, setData] = useState(Object);

  useEffect(() => {
    const fetchData = () => {
      const resp = SecureStore.getItem(params.type || 'ID') || '{}';
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
  let flipCard = useRef(GestureFlipView);
  const [visible, setVisible] = useState(false);
  const [visibleWait, setVisibleWait] = useState(true);
  const onToggleSnackBar = () => { if (visibleWait) { setVisible(!visible); setVisibleWait(false); } };
  const onDismissSnackBar = () => {
    setVisibleWait(true);
    setVisible(false);
  };



  switch (params.type) {
    case 'ID':
      return renderIdCard(data);
    case 'TS':
      return renderTScard(data);
    case 'PATENTE':
      return renderPATENTECard(data);
    default:
      return renderIdCard(data);
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
            {renderMRZ(cardInfo.mrz)}

            <Barcode
              format="CODE39"
              value={cardInfo.codiceFiscale || '0000'}
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
        <View style={styles.infoBox}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderScrollList(cardInfo.numeroCarta, 'CARD_NUMBER')}
            {renderScrollList(cardInfo.nome, 'NAME')}
            {renderScrollList(cardInfo.cognome, 'SURNAME')}
            {renderScrollList(cardInfo.luogoEdata, 'PLACE_AND_DATE')}
            {renderScrollList(cardInfo.codiceFiscale, 'CF')}
            {renderScrollList(cardInfo.codiceCarta, 'CARD_NUMBER')}
            {renderScrollList(cardInfo.emissione, 'DATA_EMISSIONE')}
            {renderScrollList(cardInfo.scadenza, 'DATA_SCADENZA')}
          </ScrollView>
        </View>

        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          style={styles.snackbar}
          duration={1000}>
          {namespace.t('COPY')}
        </Snackbar>
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

  function renderPATENTECard(cardInfo: any) {
    let flipSide = true;
    return (
      <View style={styles.container}>
        <GestureFlipView ref={(ref: any) => (flipCard.current = ref)} width={360} height={270}>
          <Card mode='elevated'>
            <Image
              style={styles.logo}
              source={require('../assets/images/model/PATENTE_FRONTE.png')}
            />


            {renderTextID(cardInfo.cognome, 32, 122)}
            {renderTextID(cardInfo.nome, 47, 122)}



          </Card>
          <Card>
            <Image
              style={styles.logo}
              source={require('../assets/images/model/ID_RETRO.png')}
            />
            {renderTextID(cardInfo.codiceFiscale, 60, 21)}
            {renderTextID(cardInfo.indirizzo, 82, 21)}
            {renderTextID(cardInfo.estremi, 50, 183)}
            <Text style={{ fontSize: 19, fontFamily: 'TiliBold', position: 'absolute', top: 160, left: 30 }}>
              {cardInfo.MRZ}
            </Text>
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

        <View style={styles.infoBox}>

          <ScrollView style={styles.scrollbar} showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={() => copyToClipboard(cardInfo.nome)}>
              <Text style={{ fontSize: 16, opacity: 0.5, fontFamily: 'ManropeRegular' }} >
                {namespace.t('NAME')}
              </Text>

              <Text style={{ fontSize: 18, marginBottom: 15, fontFamily: 'ManropeBold' }} >
                {cardInfo.nome}
              </Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 16, opacity: 0.5, fontFamily: 'ManropeRegular' }}>
              {namespace.t('SURNAME')}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 15, fontFamily: 'ManropeBold' }}>
              {cardInfo.cognome}
            </Text>
            <Text style={{ fontSize: 16, opacity: 0.5, fontFamily: 'ManropeRegular' }}>
              {namespace.t('PLACE_AND_DATE')}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 15, fontFamily: 'ManropeBold' }}>
              {cardInfo.luogoEdata}
            </Text>


            <Text style={{ fontSize: 16, opacity: 0.5, fontFamily: 'ManropeRegular' }}>
              {namespace.t('CARD_NUMBER')}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 15, fontFamily: 'ManropeBold' }}>
              {cardInfo.numeroCarta}
            </Text>

            <Text style={{ fontSize: 16, opacity: 0.5, fontFamily: 'ManropeRegular' }}>
              {namespace.t('CARD_NUMBER')}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 15, fontFamily: 'ManropeBold' }}>
              {cardInfo.sesso}
            </Text>

            <Text style={{ fontSize: 16, opacity: 0.5, fontFamily: 'ManropeRegular' }}>
              {namespace.t('CARD_NUMBER')}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 15, fontFamily: 'ManropeBold' }}>
              {cardInfo.cittadinanza}
            </Text>

            <Text style={{ fontSize: 16, opacity: 0.5, fontFamily: 'ManropeRegular' }}>
              {namespace.t('CARD_NUMBER')}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 15, fontFamily: 'ManropeBold' }}>
              {cardInfo.codiceFiscale}
            </Text>

            <Text style={{ fontSize: 16, opacity: 0.5, fontFamily: 'ManropeRegular' }}>
              {namespace.t('CARD_NUMBER')}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 15, fontFamily: 'ManropeBold' }}>
              {cardInfo.codiceCarta}
            </Text>
          </ScrollView>
        </View>



        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
        <Snackbar
          visible={visible}
          onDismiss={onDismissSnackBar}
          style={styles.snackbar}
          duration={1000}>
          Copied!
        </Snackbar>
      </View >
    );
  }

  async function copyToClipboard(id: string) {
    await Clipboard.setStringAsync(id);
    onToggleSnackBar();
  };

  function renderTextID(cardInfo: string, top: DimensionValue, left: DimensionValue) {
    return (
      <Text
        style={{ fontSize: 10, fontFamily: 'TiliBold', position: 'absolute', top: top, left: left }}>
        {cardInfo}
      </Text>
    );
  }

  function renderTextTS(cardInfo: string, top: DimensionValue, left: DimensionValue) {
    return (
      <Text
        style={{ fontSize: 12, fontFamily: 'TiliBold', position: 'absolute', top: top, left: left }}>
        {cardInfo}
      </Text>
    );
  }

  function renderMRZ(cardInfo: String) {
    console.log(cardInfo);

    return (
      <Text style={{ fontSize: 18, fontFamily: 'ManropeBold', position: 'absolute', top: 160, left: 30 }}>
        {cardInfo}
      </Text>
    );
  }

  function renderScrollList(cardInfo: string, type: string) {
    return (
      <TouchableOpacity onPress={() => copyToClipboard(cardInfo)}>
        <Text style={{ fontSize: 16, opacity: 0.5, fontFamily: 'ManropeRegular' }} >
          {namespace.t(type)}
        </Text>
        <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'ManropeBold' }} >
          {cardInfo}
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  snackbar: {
    borderRadius: 30,
    width: 90,
    alignSelf: 'center'
  },
  infoBox: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
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