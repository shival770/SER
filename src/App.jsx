import React, { useState } from 'react';
import Upload from './assets/components/Upload';
import AudioRecord from './assets/components/audioRecord'

function App() {
  const [view, setView] = useState('record'); // 'record' for audio recording, 'upload' for file upload

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-7xl font-bold mb-10 text-center">Speech Emotion Recognition</h1>

      {/* Toggle buttons to switch between Upload and Record */}
      <div className="mb-10 space-x-6">
        <button
          onClick={() => setView('upload')}
          className={`px-6 py-2 rounded-lg text-lg font-bold shadow-md ${
            view === 'upload' ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          Upload Audio
        </button>
        <button
          onClick={() => setView('record')}
          className={`px-6 py-2 rounded-lg text-lg font-bold shadow-md ${
            view === 'record' ? 'bg-blue-600' : 'bg-gray-600'
          }`}
        >
          Record Audio
        </button>
      </div>

      {/* Conditional Rendering of either Upload or AudioRecord component */}
      {view === 'upload' ? <Upload /> : <AudioRecord />}
    </div>
  );
}

export default App;
