import * as mobilenet from '@tensorflow-models/mobilenet';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-backend-cpu';

import { Camera } from 'expo-camera';
import React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { CustomTensorCamera } from './CustomTensorCamera';
import { LoadingView } from './LoadingView';
import { PredictionList } from './PredictionList';
import { useTensorFlowModel } from './useTensorFlow';

export function ModelView() {
  const model = useTensorFlowModel(cocoSsd);
  const [predictions, setPredictions] = React.useState([]);
  
  //console.log(frame % computeRecognitionEveryNFrames === 0);
  //WARNING:
  //console.disableYellowBox = true;
  if (!model) {
    return <LoadingView message="Cargando modelo en TensorFlow" />;
  }

  return (
    <View
      style={{ flex: 1, backgroundColor: "black", justifyContent: "center" }}
    >
      <PredictionList predictions={predictions} />
      <View style={{ borderRadius: 20, overflow: "hidden" }}>
        <ModelCamera model={model} setPredictions={setPredictions} />
      </View>
    </View>
  );
}

function ModelCamera({ model, setPredictions }) {
  const raf = React.useRef(null);
  const size = useWindowDimensions();

  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(raf.current);
    };
  }, []);
 //mobilenet: await model.classify(nextImageTensor, 1); 
 //coco-ssd: await model.detect(nextImageTensor);
  
  const onReady = React.useCallback(
    (images) => {
      
      const loop = async () => {
        let frame = 0;
        const computeRecognitionEveryNFrames = 60;
        if(frame % computeRecognitionEveryNFrames === 0){
          const nextImageTensor = images.next().value;
          const predictions = await model.detect(nextImageTensor);
          setPredictions(predictions);
          console.log(predictions);
          raf.current = requestAnimationFrame(loop); 
        }
        frame += 1;
        frame = frame % computeRecognitionEveryNFrames;
      };
      loop();
    },
    [setPredictions]
  );

  return React.useMemo(
    () => (
      <CustomTensorCamera
        width={size.width}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onReady={onReady}
        autorender
      />
    ),
    [onReady, size.width]
  );
}

const styles = StyleSheet.create({
  camera: {
    zIndex: 0,
  },
  
});
