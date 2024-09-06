import React, { useRef, useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { FaMicrophone } from 'react-icons/fa'; // Import microphone icon
import axios from 'axios'; // For making POST request

function AudioRecord() {
  const audioChunk = useRef([]);
  const [recording, setRecording] = useState(false); // Track recording status
  const [audio, setAudio] = useState(undefined);
  const [audioPer, setAudioPer] = useState(0);
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState(''); // State to store backend response
  const mediaRecorderRef = useRef(null);

  useEffect(() => {
    if (audio) {
      uploadFile(audio, 'audioUrl');
    }
  }, [audio]);

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunk.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunk.current, { type: 'audio/wav' });
        setAudio(audioBlob);
        audioChunk.current = [];
        setRecording(false); // Stop glowing effect
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setRecording(true); // Start glowing effect
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRec = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const uploadFile = (file, fileType) => {
    const storage = getStorage();
    const fileName = new Date().getTime() + '.wav';
    const storageRef = ref(storage, 'audio/' + fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setAudioPer(Math.round(progress));
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => ({
            ...prev,
            [fileType]: downloadURL,
          }));

          // Make POST request to the backend with the downloadURL
          sendToBackend(downloadURL);
        });
      }
    );
  };

  // Function to send the URL to the backend
  const sendToBackend = async (audioUrl) => {
    try {
      const response = await axios.post('http://your-backend-url.com/process-audio', {
        audioUrl: audioUrl,
      });
      setResult(response.data); // Assuming backend returns a result
    } catch (error) {
      console.error('Error sending audio to backend:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg text-black">
      <h2 className="text-2xl font-bold mb-6">Record Audio</h2>

      {/* Microphone Indicator with Glowing Effect */}
      <div className="flex items-center justify-center mb-6">
        {recording && (
          <FaMicrophone className="text-5xl text-red-500 animate-pulse" />
        )}
      </div>

      {/* Buttons to Start and Stop Recording */}
      <div className="space-x-4 mb-6">
        <button
          onClick={startRec}
          className="px-6 py-2 bg-green-500 text-white font-bold rounded-lg shadow-md"
        >
          Start Recording
        </button>
        <button
          onClick={stopRec}
          className="px-6 py-2 bg-red-500 text-white font-bold rounded-lg shadow-md"
        >
          Stop Recording
        </button>
      </div>

      {/* Display Recorded Audio */}
      {audio && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Recorded Audio:</h3>
          <audio controls src={URL.createObjectURL(audio)} className="mt-2"></audio>
        </div>
      )}

      {/* Upload Progress */}
      {audioPer > 0 && <p className="text-sm text-gray-500">Upload Progress: {audioPer}%</p>}

      {/* Display Result from Backend */}
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-bold">Backend Result:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}

export default AudioRecord;
