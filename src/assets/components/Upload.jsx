import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import axios from 'axios'; // For making POST requests
import app from '../../../firebase.js'; // Assuming you have Firebase initialized

function Upload() {
    const [audio, setAudio] = useState(undefined);
    const [audioPer, setAudioPer] = useState(0);
    const [inputs, setInputs] = useState({});
    const [result, setResult] = useState(''); // Store backend response

    useEffect(() => {
        if (audio) {
            uploadFile(audio, 'audioUrl');
        }
    }, [audio]);

    const uploadFile = (file, fileType) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, 'audio/' + fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setAudioPer(Math.round(progress));
            },
            (error) => {
                console.error(error);
            },
            () => {
                // Get the download URL after upload completes
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setInputs((prev) => ({
                        ...prev,
                        [fileType]: downloadURL,
                    }));
                    console.log('DownloadURL - ', downloadURL);

                    // Make POST request to backend with downloadURL
                    sendToBackend(downloadURL);
                });
            }
        );
    };

    // Function to send the audio URL to the backend
    const sendToBackend = async (audioUrl) => {
        try {
            const response = await axios.post('http://your-backend-url.com/process-audio', {
                audioUrl: audioUrl,
            });
            setResult(response.data); // Display the result from the backend
        } catch (error) {
            console.error('Error sending audio to backend:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg text-black">
            <h2 className="text-2xl font-bold mb-6">Upload Audio</h2>
            <form>
                <label className="block mb-2 text-lg font-semibold">Audio File</label>
                <input 
                    onChange={(e) => setAudio(e.target.files[0])}
                    type="file"
                    accept="audio/*"
                    className="mb-4"
                />
                <button 
                    type="button"
                    className="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg shadow-md"
                    onClick={() => audio && uploadFile(audio, 'audioUrl')}
                >
                    Upload
                </button>
            </form>

            {/* Upload progress */}
            {audioPer > 0 && <p className="mt-4 text-sm text-gray-500">Upload Progress: {audioPer}%</p>}

            {/* Display result from backend */}
            {result && (
                <div className="mt-6">
                    <h3 className="text-lg font-bold">Backend Result:</h3>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
}

export default Upload;
