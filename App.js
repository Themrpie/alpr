import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { cameraWithTensors } from '@tensorflow/tfjs-react-native';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from "@tensorflow/tfjs";


const initialiseTensorflow = async () => {
  await tf.ready();
  tf.getBackend();
}

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [net, setNet] = useState(mobilenet.MobileNet);

  const TensorCamera = cameraWithTensors(Camera);

  useEffect(() => {
    // warning come from here you have to take a look why?
    // warning come from here bcz this things belong to expo-camera now you are using oh stuere!nsorflow so what to do next you better know yes for sure. But how comes that you can see the button? Do we need safeareaview?
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      // initialise Tensorflow
      await initialiseTensorflow();
      // load the model
      setNet(await mobilenet.load());
    })();
  }, []);

  if(!net){
    return <Text>Model not loaded</Text>;
  }
  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted. Please change this in settings.</Text>
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sharePic = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64 }} />
        <Button title="Share" onPress={sharePic} />
        {hasMediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }
  //ADD autorender={true} TO 
  return (
    //Replace here with TensorCamera code
    <SafeAreaView style={styles.container}>
    <TensorCamera style={styles.preview} ref={cameraRef} autorender={true} onReady={() => {}} /> 
    <Button title="Consultar patente" onPress={takePic} />
  </SafeAreaView>//again no button :S are you sure we are using the same Button?
  ); 
} 
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start'
  },
  preview: {
    alignSelf: 'stretch',
    flex: 0.9
  }
});