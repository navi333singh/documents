import { useState } from "react";
import { Button, Image, View, StyleSheet, Text } from "react-native";
import ImagePicker from "react-native-image-crop-picker";
import { getTextFromImage } from "./openAI";
import DocumentScanner from "react-native-document-scanner-plugin";
import * as SecureStore from "expo-secure-store";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import {
  SQLiteProvider,
  useSQLiteContext,
  type SQLiteDatabase,
} from "expo-sqlite";
import React from "react";
export default function ImagePickerExample() {
  const [image, setImage] = useState();
  const [testo, setTesto] = useState("loading");
  const [scannedImage, setScannedImage] = useState();

  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument({
      croppedImageQuality: 90,
      maxNumDocuments: 2,
    });

    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0]);
    }
  };

  function save(key: any, value: any) {
    SecureStore.setItem(key, value);
    console.log("saved");
    const resp = SecureStore.getItem("ID");
    console.log(resp);
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    // ImagePicker.openPicker({
    //   width: 700,
    //   height: 450,
    //   cropping: true,
    //   freeStyleCropEnabled: true,
    //   loadingLabelText: 'Loading...'
    // }).then(images => {
    //   setScannedImage(images.path);
    // })
    console.log("starting");
    const db = useSQLiteContext();
    const firstRow = await db.getAllAsync("SELECT * FROM documents_base64");
    console.log(firstRow);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Coming soon ...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 20,
    fontWeight: "600",
  },
});
