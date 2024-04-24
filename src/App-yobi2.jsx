import React, { useRef, useEffect, useState } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';  // TensorFlow Core API

const App = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await cocoSsd.load();
      setModel(loadedModel);
    };
    loadModel();

    const getUserMedia = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    };

    getUserMedia().catch(console.error);

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const renderToCanvas = async (tensor) => {
      const ctx = canvasRef.current.getContext('2d');
      const [height, width] = tensor.shape;
      const imageData = new ImageData(width, height);
      const data = await tensor.data();
      for (let i = 0; i < height * width; i++) {
        const j = i * 4;
        const k = i * 3;
        imageData.data[j + 0] = data[k + 0];
        imageData.data[j + 1] = data[k + 1];
        imageData.data[j + 2] = data[k + 2];
        imageData.data[j + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const onFrame = async () => {
      if (videoRef.current && model) {
        const tensor = tf.browser.fromPixels(videoRef.current);
        const predictions = await model.detect(tensor);
        const ctx = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        await renderToCanvas(tensor);
        predictions.forEach(prediction => {
          drawBBox(ctx, prediction.bbox, prediction.class);
        });
      }
      requestAnimationFrame(onFrame);
    };

    requestAnimationFrame(onFrame);
  }, [model]);

  return (
    <div>
      <video ref={videoRef} autoPlay muted style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ width: '100%' }} />
    </div>
  );
};

export default App;
