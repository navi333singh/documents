import { View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { forwardRef, useMemo, useCallback, useState } from 'react';
import { BottomSheetModal, BottomSheetBackdrop, useBottomSheetModal, } from '@gorhom/bottom-sheet';
import namespace from '@/app/translations/namespace.js';
import { Text } from 'react-native-paper';
import Colors from '@/constants/Colors';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import TextRecognition from '@react-native-ml-kit/text-recognition';
export type Ref = BottomSheetModal;

const CustomBottomSheetModal = forwardRef<Ref>((props, ref) => {
    const [image, setImage] = useState();
    const snapPoints = useMemo(() => ['35%', '45%', '80%'], []);
    const [step, setStep] = useState(1);
    const snapeToIndex = (index: number) => ref?.current?.snapToIndex(index);
    const [selectDocument, setSelectDocument] = useState();

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
            case 2:
                return require('../assets/images/logoCard/patente_logo.png');
            case 3:
                return require('../assets/images/logoCard/passaporto.png');
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

    const secondStep = (nextStep: any, snapeToIndex: any, selectDocument: any) => {
        snapeToIndex(1);
        return (
            <View style={styles.contentContainerSecondStep}>
                <View style={{ alignItems: 'center', marginHorizontal: 15 }}>
                    <Text style={[styles.title, { fontSize: 24, textAlign: 'center' }]} >{namespace.t('SECOND_STEP_TITLE')}</Text>
                    <Text style={[styles.subtitle, { textAlign: 'center' }]} >{namespace.t('SECOND_STEP_SUBTITLE')}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-end', maxHeight: '37%' }}>
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.text}>{namespace.t('SECOND_STEP_BUTTON_1')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button2}>
                        <Text style={[styles.text, { color: Colors['light'].tint, }]}>{namespace.t('SECOND_STEP_BUTTON_2')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button3} onPress={() => pickImage(selectDocument)}>
                        <Text style={[styles.text, { color: Colors['light'].tint, }]}>{namespace.t('SECOND_STEP_BUTTON_3')}</Text>
                    </TouchableOpacity>
                </View>
            </View >
        );
    }

    const save = (key: any, value: any) => {
        SecureStore.setItem(key, value);
        console.log('saved');
        const resp = SecureStore.getItem('ID');
        console.log(resp);
    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            console.log(image);
            const result: any = await TextRecognition.recognize(result.assets[0].uri);
            console.log('Recognized text:', result.text);

            for (let block of result.blocks) {
                console.log('Block text:', block.text);
                console.log('Block frame:', block.frame);

                for (let line of block.lines) {
                    console.log('Line text:', line.text);
                    console.log('Line frame:', line.frame);
                }


            }
        }
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
});


export default CustomBottomSheetModal;