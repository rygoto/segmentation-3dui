import { useRef } from 'react';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from "@tensorflow-models/coco-ssd"
import ObjectDetection from './ObjectDetection';
import XRScene from './XR';
import Babylon from './Babylon';

function App() {
  return (
    <Babylon />
  );
}
export default App;
/*
return (
  <div className="app">
    <Babylon />
  </div>
);
*/