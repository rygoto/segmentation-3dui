import React, { useRef, useEffect, useState } from 'react';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

//テンソルをキャンバスに描画する関数
const renderToCanvas = async (ctx, a) => {
    const [height, width] = a.shape;
    const imageData = new ImageData(width, height);
    const data = await a.data();
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

const drawBBox = (ctx, bbox, name) => {
    ctx.strokeStyle = 'red'
    ctx.fillStyle = 'red'
    ctx.strokeRect(bbox[0], bbox[1], bbox[2], bbox[3])
    ctx.fillRect(bbox[0], bbox[1] - 20, bbox[2], 20)

    ctx.fillStyle = "white"
    ctx.font = 'bold 20px sans-serif'
    ctx.textAlign = "left"
    ctx.textBaseline = "top"
    ctx.fillText(name, bbox[0] + 8, bbox[1] - 20, bbox[2])
}

const startDetect = () => {
    cocoSsd.load().then(model => {
        const webcamElement = document.getElementById('webcam');
        window.requestAnimationFrame(onFrame.bind(null, model, webcamElement))
    })
}

const onFrame = async (model, webcamElement) => {
    const tensor = tf.browser.fromPixels(webcamElement)
    const predictions = await model.detect(tensor)

    const canvas = document.getElementById('canvas')
    const [height, width] = tensor.shape
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    await renderToCanvas(ctx, tensor)
    for (let i = 0; i < predictions.length; i++) {
        drawBBox(ctx, predictions[i].bbox, predictions[i].class)
    }

    setTimeout(() => {
        window.requestAnimationFrame(onFrame.bind(null, model, webcamElement))
    }, 1000)
}

const constraints = {
    audio: false,
    video: true
}
navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => {
        const video = document.querySelector('video')
        video.srcObject = stream
        startDetect()
    })
    .catch((error) => {
        const errorMsg = document.querySelector('#errorMsg')
        errorMsg.innerHTML += `<p>${error.name}</p>`
    })

function App() {
    const [model, setModel] = useState(null);
    const [detections, setDetections] = useState([]);

    useEffect(() => {
        cocoSsd.load().then(model => {
            setModel(model);
            console.log('Model loaded');
        });
    }, []);

    useEffect(() => {
        const videoElement = document.querySelector('video');
        if (model && videoElement) {
            const timer = setInterval(() => {
                model.detect(videoElement).then(predictions => {
                    console.log('Predictions: ', predictions);
                    setDetections(predictions);
                });
            }, 500);

            return () => clearInterval(timer);
        }
    }, [model]);

    return (
        <div>
            <h1>Object Detection aaaaaa</h1>
            <CameraFeed />
            <DetectionPanel detections={detections} />
        </div>
    );
}

export default App
