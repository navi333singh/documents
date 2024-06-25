import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { forwardRef, useMemo, useCallback, useState } from 'react';
import { BottomSheetModal, BottomSheetBackdrop, useBottomSheetModal, } from '@gorhom/bottom-sheet';
import namespace from '@/app/translations/namespace.js';
import { Text } from 'react-native-paper';
import Colors from '@/constants/Colors';
import { Picker } from '@react-native-picker/picker';
import * as SecureStore from 'expo-secure-store';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import DocumentScanner, { ResponseType, ScanDocumentResponseStatus } from 'react-native-document-scanner-plugin';
import ImagePicker from 'react-native-image-crop-picker';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { BlurView } from 'expo-blur';
import { SQLiteProvider, useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

export type Ref = BottomSheetModal;

const CustomBottomSheetModal = forwardRef<Ref>((props, ref) => {
    const [fronteImage, setfronteImage] = useState(null);
    const [retroImage, setretroImage] = useState(null);
    const snapPoints = useMemo(() => ['35%', '45%', '65%', '80%'], []); //35 
    const [step, setStep] = useState(1);
    const snapeToIndex = (index: number) => ref?.current?.snapToIndex(index);
    const [selectDocument, setSelectDocument] = useState("ID");
    const [scannedImage, setScannedImage] = useState('null');
    const db = useSQLiteContext();

    const { dismiss } = useBottomSheetModal();
    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                onChange={setStep(1)}
            />
        ),
        []
    );


    const selectStep = () => {
        switch (step) {
            case 1:
                return cardList(setStep);
            case 2:
                snapeToIndex(1);
                return secondStep(setStep, snapeToIndex);
            case 3:
                return takeImageStep(setStep, snapeToIndex);
            case 4:
                return pickImageStep(setStep, snapeToIndex);
        }
    }

    const renderHandleComponent = useCallback(
        (props: any) => (
            <View style={{ alignItems: 'flex-end', paddingTop: 15, paddingRight: 15 }}>
                <TouchableOpacity onPress={() => dismiss()}>

                </TouchableOpacity>
            </View >
        ),
        []
    );





    const cardList = (nextStep: any) => {
        return (
            <View style={styles.contentContainer}>
                <TouchableOpacity onPress={() => nextStep(2)}>
                    <View style={styles.titleContent}>
                        <Text style={[styles.title, { color: Colors['light'].tint, fontSize: 16 }]} >{namespace.t('NEXT')}</Text>
                    </View>
                </TouchableOpacity>
                <Picker
                    selectedValue={selectDocument}
                    onValueChange={(itemValue) => {
                        setSelectDocument(itemValue)
                    }
                    }>
                    <Picker.Item label={namespace.t('ID')} value='ID' />
                    <Picker.Item label={namespace.t('TS')} value='TS' />
                    <Picker.Item label={namespace.t('PAT')} value='PAT' />
                    <Picker.Item label={namespace.t('PP')} value='PP' />
                </Picker>
            </View>
        );
    }

    const secondStep = (nextStep: any, snapeToIndex: any) => {
        snapeToIndex(1);
        return (
            <View style={styles.contentContainerSecondStep}>

                <View style={{ alignItems: 'center', marginHorizontal: 15 }}>
                    <Text style={[styles.title, { fontSize: 24, textAlign: 'center' }]} >{namespace.t('SECOND_STEP_TITLE')}</Text>
                    <Text style={[styles.subtitle, { textAlign: 'center' }]} >{namespace.t('SECOND_STEP_SUBTITLE')}</Text>
                    {/* <Image source={{ uri: scannedImage }} style={{
                        width: 250,
                        height: 150,

                    }} /> */}
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', maxHeight: '37%' }}>
                    <TouchableOpacity style={styles.button} onPress={() => nextStep(3)}>
                        <Text style={styles.text}>{namespace.t('SECOND_STEP_BUTTON_1')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button2} onPress={() => nextStep(4)}>
                        <Text style={[styles.text, { color: Colors['light'].tint, }]}>{namespace.t('SECOND_STEP_BUTTON_2')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button3} onPress={() => setup()}>
                        <Text style={[styles.text, { color: Colors['light'].tint, }]}>{namespace.t('SECOND_STEP_BUTTON_3')}</Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }

    const pickImageStep = (nextStep: any, snapeToIndex: any) => {
        snapeToIndex(2);
        return (
            <View style={styles.contentContainerSecondStep}>

                <View style={{ alignItems: 'center', marginHorizontal: 15 }}>
                    <Text style={[styles.title, { fontSize: 24, textAlign: 'center' }]} >{namespace.t('SECOND_STEP_TITLE')}</Text>
                    <Text style={[styles.subtitle, { textAlign: 'center' }]} >{namespace.t('PICK_IMAGE_TEXT')}</Text>

                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', maxHeight: '65%' }}>
                    <TouchableOpacity style={[styles.cardButton, { alignSelf: 'center' }]} onPress={() => pickImage(1)}>

                        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                            {fronteImage ? <Image source={{ uri: fronteImage }} style={{
                                width: 255,
                                height: 161,
                            }} /> : <Text style={[styles.text, { color: Colors['light'].tint }]}>{namespace.t('PICK_IMAGE_TEXT_BUTTON_FRONTE')}</Text>}
                        </BlurView>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.cardButton, { alignSelf: 'center' }]} onPress={() => pickImage(2)}>
                        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                            {retroImage ? <Image source={{ uri: retroImage }} style={{
                                width: 255,
                                height: 161,
                            }} /> : <Text style={[styles.text, { color: Colors['light'].tint }]}>{namespace.t('PICK_IMAGE_TEXT_BUTTON_RETRO')}</Text>}
                        </BlurView>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => { save() }}>
                        <Text style={[styles.text, { color: 'white' }]}>{namespace.t('PICK_IMAGE_TEXT_BUTTON_CONFIRM')}</Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }


    const takeImageStep = (nextStep: any, snapeToIndex: any) => {
        snapeToIndex(2);
        return (
            <View style={styles.contentContainerSecondStep}>

                <View style={{ alignItems: 'center', marginHorizontal: 15 }}>
                    <Text style={[styles.title, { fontSize: 24, textAlign: 'center' }]} >{namespace.t('SECOND_STEP_TITLE')}</Text>
                    <Text style={[styles.subtitle, { textAlign: 'center' }]} >{namespace.t('TAKE_STEP_SUBTITLE')}</Text>

                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', maxHeight: '65%' }}>
                    <TouchableOpacity style={[styles.cardButton, { alignSelf: 'center' }]} onPress={() => takeImage(1)}>

                        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                            {fronteImage ? <Image source={{ uri: fronteImage }} style={{
                                width: 255,
                                height: 161,
                            }} /> : <Text style={[styles.text, { color: Colors['light'].tint }]}>{namespace.t('PICK_IMAGE_TEXT_BUTTON_FRONTE')}</Text>}
                        </BlurView>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.cardButton, { alignSelf: 'center' }]} onPress={() => takeImage(2)}>
                        <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                            {retroImage ? <Image source={{ uri: retroImage }} style={{
                                width: 255,
                                height: 161,
                            }} /> : <Text style={[styles.text, { color: Colors['light'].tint }]}>{namespace.t('PICK_IMAGE_TEXT_BUTTON_RETRO')}</Text>}
                        </BlurView>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => { save() }}>
                        <Text style={[styles.text, { color: 'white' }]}>{namespace.t('PICK_IMAGE_TEXT_BUTTON_CONFIRM')}</Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }


    interface Document {
        key: string;
        value: string;
    }
    const save = async () => {
        const fronteManipResult = await manipulateAsync(fronteImage, [], { base64: true, compress: 1, format: SaveFormat.PNG });
        const retroManipResult = await manipulateAsync(retroImage, [], { base64: true, compress: 1, format: SaveFormat.PNG });
        await db.runAsync('REPLACE INTO documents_base64 (key, value) VALUES (?, ?)', selectDocument + '-1', fronteManipResult.base64);
        await db.runAsync('REPLACE INTO documents_base64 (key, value) VALUES (?, ?)', selectDocument + '-2', retroManipResult.base64);

        const result: any = await TextRecognition.recognize(fronteManipResult.uri);
        const resultRetro: any = await TextRecognition.recognize(retroManipResult.uri);
        console.log(result);
        let cardInfoID = {
            numeroCarta: '',
            comune: '',
            cognome: '',
            nome: '',
            luogoEdata: '',
            sesso: '',
            statura: '',
            cittadinanza: '',
            emissione: '',
            scadenza: '',
            codiceCarta: '',
            codiceFiscale: '',
            indirizzo: '',
            estremi: '',
        };


        for (let i = 0; i < resultRetro.blocks.length; i++) {
            if (resultRetro.blocks[i].text.includes('FISCAL CODE') || resultRetro.blocks[i].text.includes('CODE')) {

                if (resultRetro.blocks[i].lines[1] == undefined) {
                    cardInfoID.codiceFiscale = resultRetro.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                }
                else {
                    if (resultRetro.blocks[i].lines[1].text.includes('FISCAL CODE') || resultRetro.blocks[i].text.includes('CODE')) {
                        cardInfoID.codiceFiscale = resultRetro.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                    }
                    else {
                        cardInfoID.codiceFiscale = resultRetro.blocks[i].lines[1].text.replaceAll('0', 'O');
                    }
                }
            }
            else if (resultRetro.blocks[i].text.includes('INDIRI') || resultRetro.blocks[i].text.includes('RESIDENZA') || resultRetro.blocks[i].text.includes('RESIDE')) {
                if (resultRetro.blocks[i].lines[1] == undefined) {
                    cardInfoID.indirizzo = resultRetro.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                }
                else {
                    if (resultRetro.blocks[i].lines[1].text.includes('NOME') || resultRetro.blocks[i].lines[1].text.includes('NAME')) {
                        cardInfoID.indirizzo = resultRetro.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                    }
                    else {
                        cardInfoID.indirizzo = resultRetro.blocks[i].lines[1].text.replaceAll('0', 'O');
                    }
                }
            }
            else if ([...resultRetro.blocks[i].text.matchAll('/ESTREMI|NASC|ATTO|/g')].length > 0) {
                if (resultRetro.blocks[i].lines[1] == undefined) {
                    cardInfoID.estremi = resultRetro.blocks[i + 1].lines[0].text.replaceAll(',', '.');
                }
                else {
                    if ([...resultRetro.blocks[i].lines[1].text.matchAll('/ESTREMI|NASC|ATTO|/g')].length > 0) {
                        if (resultRetro.blocks[i].lines[2] == undefined) {

                            cardInfoID.estremi = resultRetro.blocks[i + 1].lines[0].text.replaceAll(',', '.');
                        }
                        else {
                            if ([...resultRetro.blocks[i].lines[2].text.matchAll('/ESTREMI|NASC|ATTO|/g')].length > 0) {
                                cardInfoID.estremi = resultRetro.blocks[i + 1].lines[0].text.replaceAll(',', '.');
                            }
                            else {
                                cardInfoID.estremi = resultRetro.blocks[i].lines[2].text.replaceAll(',', '.');
                            }
                        }
                    }
                    else {
                        cardInfoID.estremi = resultRetro.blocks[i].lines[1].text.replaceAll(',', '.');
                    }
                }
            }
        }

        var hasNumber = /\d/;
        for (let i = 0; i < result.blocks.length; i++) {
            if (result.blocks[i].text.includes('OMUNE') || result.blocks[i].text.includes('MUNICI')) {

                if (result.blocks[i].lines[1] == undefined) {
                    cardInfoID.comune = result.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                }
                else {
                    if (result.blocks[i].lines[1].text.includes('OMUNE' || 'MUNICI')) {
                        cardInfoID.comune = result.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                    }
                    else {
                        cardInfoID.comune = result.blocks[i].lines[1].text.replaceAll('0', 'O');
                    }
                }
            }
            else if (result.blocks[i].text.includes('OGNOME') || result.blocks[i].text.includes('SURNAME')) {
                cardInfoID.cognome = result.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
            }
            else if (result.blocks[i].text.includes('NOME') || result.blocks[i].text.includes('NAME')) {
                if (result.blocks[i].lines[1] == undefined) {
                    cardInfoID.nome = result.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                }
                else {
                    if (result.blocks[i].lines[1].text.includes('NOME') || result.blocks[i].lines[1].text.includes('NAME')) {
                        cardInfoID.nome = result.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                    }
                    else {
                        cardInfoID.nome = result.blocks[i].lines[1].text.replaceAll('0', 'O');
                    }
                }
            }
            else if ([...result.blocks[i].text.matchAll('/LUOGO|NASC|PLACE|BIRTH|DATE/g')].length > 0) {
                if (result.blocks[i].lines[1] == undefined) {
                    cardInfoID.luogoEdata = result.blocks[i + 1].lines[0].text.replaceAll(',', '.').substring(0, result.blocks[i + 1].lines[0].text.length - 10).replaceAll('0', 'O') + result.blocks[i + 1].lines[0].text.replaceAll(',', '.').substring(result.blocks[i + 1].lines[0].text.length - 10, result.blocks[i + 1].lines[0].text.length).replaceAll('O', '0');
                }
                else {
                    if ([...result.blocks[i].lines[1].text.matchAll('/LUOGO|NASC|PLACE|BIRTH|DATE/g')].length > 0) {
                        if (result.blocks[i].lines[2] == undefined) {

                            cardInfoID.luogoEdata = result.blocks[i + 1].lines[0].text.replaceAll(',', '.').substring(0, result.blocks[i + 1].lines[0].text.length - 10).replaceAll('0', 'O') + result.blocks[i + 1].lines[0].text.replaceAll(',', '.').substring(result.blocks[i + 1].lines[0].text.length - 10, result.blocks[i + 1].lines[0].text.length).replaceAll('O', '0');
                        }
                        else {
                            if ([...result.blocks[i].lines[2].text.matchAll('/LUOGO|NASC|PLACE|BIRTH|DATE/g')].length > 0) {
                                cardInfoID.luogoEdata = result.blocks[i + 1].lines[0].text.replaceAll(',', '.').substring(0, result.blocks[i + 1].lines[0].text.length - 10).replaceAll('0', 'O') + result.blocks[i + 1].lines[0].text.replaceAll(',', '.').substring(result.blocks[i + 1].lines[0].text.length - 10, result.blocks[i + 1].lines[0].text.length).replaceAll('O', '0');
                            }
                            else {
                                cardInfoID.luogoEdata = result.blocks[i].lines[2].text.replaceAll(',', '.').substring(0, result.blocks[i].lines[2].text.length - 10).replaceAll('0', 'O') + result.blocks[i].lines[2].text.replaceAll(',', '.').substring(result.blocks[i].lines[2].text.length - 10, result.blocks[i].lines[2].text.length).replaceAll('O', '0');
                            }
                        }
                    }
                    else {
                        cardInfoID.luogoEdata = result.blocks[i].lines[1].text.replaceAll(',', '.').substring(0, result.blocks[i].lines[1].text.length - 10).replaceAll('0', 'O') + result.blocks[i].lines[1].text.replaceAll(',', '.').substring(result.blocks[i].lines[1].text.length - 10, result.blocks[i].lines[1].text.length).replaceAll('O', '0');
                    }
                }
            }
            else if (result.blocks[i].text.includes('SESSO') || result.blocks[i].text.includes('ESSO') || result.blocks[i].text.includes('SEX')) {
                if (!result.blocks[i + 1].text.includes('SEX')) {
                    cardInfoID.sesso = result.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                }
            }
            else if (result.blocks[i].text.includes('STATURA') || result.blocks[i].text.includes('STATU')) {
                cardInfoID.statura = result.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
            }
            else if (result.blocks[i].text.includes('SSIONE') || result.blocks[i].text.includes('EMISS') || result.blocks[i].text.includes('ISSUING')) {
                if (result.blocks[i].lines[1] == undefined) {
                    cardInfoID.emissione = result.blocks[i + 1].lines[0].text.replaceAll(',', '.').replaceAll('A', '4');
                }
                else {
                    cardInfoID.emissione = result.blocks[i].lines[1].text.replaceAll(',', '.').replaceAll('A', '4');
                }
            }
            else if ([...result.blocks[i].text.matchAll('/NALITY|NATIO|LITY/g')].length > 0) {
                if (result.blocks[i].lines[1] == undefined) {
                    cardInfoID.cittadinanza = result.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                }
                else {
                    if ([...result.blocks[i].lines[1].text.matchAll('/NALITY|NATIO|LITY/g')].length > 0) {

                        if (result.blocks[i].lines[2] == undefined) {
                            cardInfoID.cittadinanza = result.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                        }
                        else {
                            if ([...result.blocks[i].lines[2].text.matchAll('/NALITY|NATIO|LITY/g')].length > 0) {
                                cardInfoID.cittadinanza = result.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                            }
                            else {
                                cardInfoID.cittadinanza = result.blocks[i].lines[2].text.replaceAll('0', 'O');
                            }
                        }
                    }
                    else {
                        cardInfoID.cittadinanza = result.blocks[i].lines[1].text.replaceAll('0', 'O');
                    }
                }
            }
            else if ([...result.blocks[i].text.matchAll('/EXPIRY|SCADENZA|XPIR/g')].length > 0) {
                if (result.blocks[i].lines[1] == undefined) {
                    cardInfoID.scadenza = result.blocks[i + 1].lines[0].text.replaceAll(',', '.').replaceAll('A', '4');
                }
                else {
                    if ([...result.blocks[i].lines[1].text.matchAll('/EXPIRY|SCADENZA|XPIR/g')].length > 0) {
                        cardInfoID.scadenza = result.blocks[i + 1].lines[0].text.replaceAll('0', 'O');
                    }
                    else {
                        cardInfoID.scadenza = result.blocks[i].lines[1].text.replaceAll(',', '.').replaceAll('A', '4');
                    }
                }
            }
            else if (result.blocks[i].text.includes('CA') && result.blocks[i].text.length == 9 && hasNumber.test(result.blocks[i].text)) {
                if (result.blocks[i].lines[1] == undefined) {
                    cardInfoID.numeroCarta = result.blocks[i].lines[0].text.replaceAll('0', 'O').substring(0, 2) + result.blocks[i].lines[0].text.replaceAll('O', '0').substring(2, 7) + result.blocks[i].lines[0].text.replaceAll('0', 'O').substring(7, 9);
                }
                else {
                    cardInfoID.numeroCarta = result.blocks[i].lines[1].text.replaceAll('0', 'O').substring(0, 2) + result.blocks[i].lines[1].text.replaceAll('O', '0').substring(2, 7) + result.blocks[i].lines[1].text.replaceAll('0', 'O').substring(7, 9);
                }
            }
            for (let y = 0; y < result.blocks[i].lines.length; y++) {
                if (result.blocks[i].lines[y].text.length === 6 && /^\d+$/.test(result.blocks[i].lines[y].text)) {
                    cardInfoID.codiceCarta = result.blocks[i].lines[y].text.replaceAll('O', '0');
                }
            }
        }
        console.log(JSON.stringify(cardInfoID));
        const resp = await SecureStore.setItemAsync(selectDocument, JSON.stringify(cardInfoID));
        console.log(selectDocument);

    }

    const pickImage = (id: number) => {
        ImagePicker.openPicker({
            width: 700,
            height: 450,
            cropping: true,
            freeStyleCropEnabled: true,
            loadingLabelText: 'Loading...'
        }).then(images => {
            id === 1 ? setfronteImage(images.path) : setretroImage(images.path);
        })
    };

    const takeImage = async (id: number) => {
        const { scannedImages } = await DocumentScanner.scanDocument({
            croppedImageQuality: 100,
        });
        id === 1 ? setfronteImage(scannedImages[0]) : setretroImage(scannedImages[0]);
    };

    return (
        <View>
            <BottomSheetModal ref={ref} index={0}
                snapPoints={snapPoints}
                backgroundStyle={styles.bottomSheetContainer}
                backdropComponent={renderBackdrop}
                enableContentPanningGesture={false}
                enableHandlePanningGesture={false}
            // handleComponent={renderHandleComponent}
            >
                {selectStep()}
            </BottomSheetModal>
        </View >
    );
});


const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
    },
    contentContainerSecondStep: {
        flex: 1,
        margin: 15,
    },
    containerHeadline: {
        fontSize: 24,
        fontWeight: '600',
        padding: 20,
    },
    bottomSheetContainer: {
        borderRadius: 20,
    },
    titleContent: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        alignContent: 'center'
    },
    title: {
        fontFamily: 'ManropeBold',
        fontSize: 16,
    },
    subtitle: {
        fontFamily: 'ManropeRegular',
        padding: 5,
        color: '#737d88',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        marginHorizontal: 15,
        borderRadius: 14,
        elevation: 3,
        backgroundColor: Colors['light'].tint,
    },
    button2: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        marginHorizontal: 15,
        borderRadius: 14,
        elevation: 3,
        backgroundColor: Colors['light'].lightTint,
    },
    button3: {
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 32,
        elevation: 3,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    cardButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 151,
        width: 255,
        marginHorizontal: 15,
        borderRadius: 14,
        elevation: 3,
        marginBottom: 20
    },
    blurContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: 151,
        width: 255,
        overflow: 'hidden',
        borderRadius: 5,

    },
});


export default CustomBottomSheetModal;