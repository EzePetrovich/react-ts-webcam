import React from 'react';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-converter';
import '@tensorflow/tfjs-backend-webgl';
import * as bodyPix from '@tensorflow-models/body-pix';
import Webcam from 'react-webcam';
import './App.css';

function App() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const webcamRef = React.useRef<Webcam>(null);
  // Manage the state of bodypixnet with useState
  const [bodypixnet, setBodypixnet] = React.useState<bodyPix.BodyPix>();

  // Run only when the page is first loaded
  React.useEffect(() => {
    bodyPix.load().then((net: bodyPix.BodyPix) => {
      setBodypixnet(net);
    });
  }, []);

  const drawimage = async (webcam: HTMLVideoElement) => {
    const segmentation = await bodypixnet?.segmentPerson(webcam);
    console.log(segmentation);
  };

  const clickHandler = async () => {
    if (!webcamRef.current) return null;
    const webcam = webcamRef.current.video as HTMLVideoElement;
    const canvas = canvasRef.current!;
    webcam.width = canvas.width = webcam.videoWidth;
    webcam.height = canvas.height = webcam.videoHeight;
    const context = canvas.getContext('2d')!;
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (bodypixnet) {
      drawimage(webcam);
    }
  };
  return (
    <div>
      <div>
        <Webcam audio={false} ref={webcamRef} />
        <canvas ref={canvasRef} />
      </div>
      <div>
        <button onClick={clickHandler}>Button</button>
      </div>
    </div>
  );
}

export default App;
