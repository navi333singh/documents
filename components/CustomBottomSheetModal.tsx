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
import { useSQLiteContext, type SQLiteDatabase } from 'expo-sqlite';

export type Ref = BottomSheetModal;

const CustomBottomSheetModal = forwardRef<Ref>((props, ref) => {
    const [fronteImage, setfronteImage] = useState(null);
    const [retroImage, setretroImage] = useState(null);
    const snapPoints = useMemo(() => ['35%', '45%', '65%', '80%'], []); //35 
    const [step, setStep] = useState(1);
    const snapeToIndex = (index: number) => ref?.current?.snapToIndex(index);
    const [selectDocument, setSelectDocument] = useState('null');
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
                return cardList(setStep, selectDocument, setSelectDocument);
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





    const cardList = (nextStep: any, selectDocument: any, setSelectDocument: any) => {
        return (
            <View style={styles.contentContainer}>
                <TouchableOpacity onPress={() => nextStep(2)}>
                    <View style={styles.titleContent}>
                        <Text style={[styles.title, { color: Colors['light'].tint, fontSize: 16 }]} >{namespace.t('NEXT')}</Text>
                    </View>
                </TouchableOpacity>
                <Picker
                    selectedValue={selectDocument}
                    onValueChange={(itemValue) =>
                        setSelectDocument(itemValue)
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
                    <TouchableOpacity style={styles.button3} onPress={() => nextStep(5)}>
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



    const save = async () => {
        console.log('Recognized text:');
        const fronteManipResult = await manipulateAsync(fronteImage, [], { base64: true, compress: 0, format: SaveFormat.PNG });
        const retroManipResult = await manipulateAsync(retroImage, [], { base64: true, compress: 0, format: SaveFormat.PNG });

        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS documents_base64 (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
            INSERT INTO test (value, intValue) VALUES (${selectDocument + '-1'}, ${fronteManipResult.base64});
            INSERT INTO test (value, intValue) VALUES (${selectDocument + '-2'}, ${retroManipResult.base64});
            `);


        // const result: any = await TextRecognition.recognize(fronteImage);
        // console.log('Recognized text:', result.text);
        // for (let block of result.blocks) {
        //     console.log('Block text:', block.text);
        //     console.log('Block frame:', block.frame);
        //     for (let line of block.lines) {
        //         console.log('Line text:', line.text);
        //         console.log('Line frame:', line.frame);
        //     }
        // }

        console.log('saved');
        const resp = await SecureStore.getItemAsync(selectDocument + '-1');

    }

    const pickImage = (id: number) => {
        // No permissions request is necessary for launching the image library
        ImagePicker.openPicker({
            width: 700,
            height: 450,
            cropping: true,
            freeStyleCropEnabled: true,
            loadingLabelText: 'Loading...'
        }).then(images => {
            console.log(images.path);
            id === 1 ? setfronteImage(images.path) : setretroImage(images.path);
        })
    };

    const takeImage = async (id: number) => {
        const { scannedImages, status } = await DocumentScanner.scanDocument({
            croppedImageQuality: 100,
        });
        id === 1 ? setfronteImage(scannedImages[0]) : setretroImage(scannedImages[0]);
    };


    const confirmTakeimage = async () => {
        await save();
    }


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
        </View>
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