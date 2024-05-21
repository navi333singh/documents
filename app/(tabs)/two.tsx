import { CameraView, useCameraPermissions} from 'expo-camera';
import {useRef, useState} from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  let cameraRef = useRef();
  const [photo, setPhoto] = useState();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    console.log(newPhoto);
  };

  return (
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={'back'} ref={cameraRef}>
            <View style={styles.card} >
            </View>
          <TouchableOpacity  onPress={takePic}>
            <Text style={styles.text}>Flip Camera </Text>
          </TouchableOpacity>
        </CameraView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },

  card: {
    borderStyle: "solid",
    borderWidth: 2,
    margin: 12,
    height: 240,
    width: 360,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:'auto',
    marginRight:'auto',
    marginTop: 300,
    borderColor: 'white',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
