import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

//mobilenet:  {'Objeto: ' + p.className + ' Probabilidad: ' + p.probability.toFixed(2) }
//coco-ssd:  {'Objeto: ' + p.class + ' Probabilidad: ' + p.score.toFixed(2) }
export function PredictionList({ predictions = [] }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.box}/>
      {predictions.map((p, i) => (
        
        <Text style={styles.text} key={`item-${i}`}>
          {'Objeto: ' + p.class + ' Probabilidad: ' + p.score.toFixed(2) }
        </Text>
        
      ))}
      
    </View>
  );
}

const margin = 24;

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    position: "absolute",
    bottom: margin,
    left: margin,
    right: margin,
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  text: {
    paddingVertical: 2,
    fontSize: 18,
  },
  box: {
    position: 'absolute',
    height: 20,
    width: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'green',
    zIndex: 1,
  },
});
