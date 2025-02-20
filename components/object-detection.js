"use client";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
import { renderPredictions } from "@/utils/render-predictions";

const ObjectDetection = ({ isDetecting }) => {
  const [isLoading, setIsLoading] = useState(true);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const runObjectDetection = async (net) => {
    if (
      canvasRef.current &&
      webcamRef.current !== null &&
      webcamRef.current.video?.readyState === 4
    ) {
      // Set canvas dimensions to match the webcam feed
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      // Detect objects in the webcam feed
      const detectedObjects = await net.detect(webcamRef.current.video);

      // Render predictions on the canvas
      const ctx = canvasRef.current.getContext("2d");
      renderPredictions(detectedObjects, ctx);
    }
  };

  useEffect(() => {
    let detectInterval;

    const loadModel = async () => {
      try {
        const net = await cocoSSDLoad();
        setIsLoading(false);
        detectInterval = setInterval(() => runObjectDetection(net), 100); // Run detection every 100ms
      } catch (error) {
        console.error("Error loading model:", error);
        setIsLoading(false);
      }
    };

    if (isDetecting) {
      loadModel();
    }

    // Cleanup interval on unmount
    return () => clearInterval(detectInterval);
  }, [isDetecting]);

  return (
    <div className="relative">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-t-[#2563EB] border-r-[#10B981] border-b-[#1E293B] border-l-[#1E293B] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
          <Webcam
            ref={webcamRef}
            className="rounded-md w-full lg:h-[720px]"
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
