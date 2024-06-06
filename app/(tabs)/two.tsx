import { useState } from 'react';
import { Button, Image, View, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getTextFromImage } from './openAI';
import DocumentScanner from 'react-native-document-scanner-plugin';
import * as SecureStore from 'expo-secure-store';

export default function ImagePickerExample() {
  const [image, setImage] = useState();
  const [testo, setTesto] = useState("loading");
  const [scannedImage, setScannedImage] = useState();

  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument()

    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0])
    }
  }

  function save(key: any, value: any) {
    SecureStore.setItem(key, value);
    console.log('saved');
    const resp = SecureStore.getItem('ID');
    console.log(resp);
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result: any = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      scanDocument();
      //   getTextFromImage(result.assets[0].base64, result.assets[0].mimeType).then(res => {
      //     console.log(JSON.stringify(res));
      //     save('ID', JSON.stringify(res));
      //     setTesto("DONE");
      //   });
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={scanDocument} />
      {<Image source={{ uri: scannedImage }} style={styles.image} />}
      <Text>{testo}</Text>

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
});
