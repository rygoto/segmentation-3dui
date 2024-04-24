import { useRef } from 'react';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from "@tensorflow-models/coco-ssd"
import ObjectDetection from './ObjectDetection';
import XRScene from './XR';

function App() {
  return (
    <div className="app">
      <h1>画像物体検出</h1>
      <XRScene />
    </div>
  );
}
export default App;