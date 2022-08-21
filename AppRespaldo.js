import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image, SafeAreaView } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useEffect, useRef, useState } from 'react';

export default function App() {
  let cameraRef = useRef();
  const [cameraPermissions, setCameraPermissions] = useState();
  const [libraryPermissions, setLibraryPermissions] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    (async() => {
      const cameraPermissions = await Camera.requestCameraPermissionsAsync();
      const MediaLibrary = await MediaLibrary.requestCameraPermissionsAsync();
      setCameraPermissions(cameraPermissions.status === "granted");
      setLibraryPermissions(libraryPermissions.status === "granted");
    })();
  }, []);
  
  if (cameraPermissions === undefined){
    return <Text variant='h4' >Pidiendo permiso a la cámara...</Text>
  }
  else if(!cameraPermissions){
    return <Text>Por favor dar permisos a la cámara en configuraciones</Text>
  }

  let takePic = async() => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };
    
    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if(photo){
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

    return(
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{uri:""+"data:image/jph;base64,"+ photo.base64}} />
        <Button title='Compartir' onPress={sharePic} />
        {libraryPermissions? <Button title='Guardar' onPress={savePhoto} />: undefined}
        <Button title='Descartar' onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera style={styles.container} ref={cameraRef} >
      <View style={styles.buttonContainer}>
        <Button title='Tomar foto' onpress={takePic} />
      </View>
      <StatusBar style="auto" />
    </Camera>
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
    alignSelf: 'flex-start',
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
});
