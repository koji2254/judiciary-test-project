import React, { useState } from 'react';
import {
  UploadCloud,
  FileAudio,
  Loader2,
  Printer,
  Code,
  AlignLeft,
  LayoutList,
} from 'lucide-react';

export function UploadCourtSession() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('formatted');
  const [stage, setStage] = useState('uploading');
  const [analysisTime, setAnalysisTime] = useState(0);

  const getPresentableFormat = () => {
    if (!result) return [];

    const merged = [];
    let current = null;

    result.segments.forEach((seg) => {
      if (!current || current.speaker !== seg.speaker) {
        if (current) merged.push(current);
        current = {
          speaker: seg.speaker,
          text: seg.text,
        };
      } else {
        current.text += ' ' + seg.text;
      }
    });

    if (current) merged.push(current);
    return merged;
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setProgress(0);
    setResult(null);
    setStage('uploading');
    setAnalysisTime(0);

    let analysisInterval = null;

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress(percent);
          
          if (percent === 100) {
            setTimeout(() => {
              setStage('analyzing');
              analysisInterval = setInterval(() => {
                setAnalysisTime(prev => prev + 1);
              }, 1000);
            }, 500);
          }
        }
      };

      xhr.onload = () => {
        if (analysisInterval) clearInterval(analysisInterval);
        
        if (xhr.status === 200) {
          setStage('complete');
          setResult(JSON.parse(xhr.responseText));
          
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        } else {
          alert('Upload failed');
          setLoading(false);
        }
      };

      xhr.onerror = () => {
        if (analysisInterval) clearInterval(analysisInterval);
        alert('Upload failed');
        setLoading(false);
      };

      xhr.open('POST', 'http://13.60.9.123:8000/transcribe');
      xhr.send(formData);
      
    } catch (err) {
      if (analysisInterval) clearInterval(analysisInterval);
      console.error(err);
      alert('Upload failed');
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
    <style>
        {`
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 0.6s linear infinite;
          }
        `}
      </style>
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[400px] text-center space-y-4">
            <Loader2
            className={`w-10 h-10 mx-auto text-green-600 ${
                stage === 'analyzing' ? 'animate-spin-slow' : ''
            }`}
            />

            
            {stage === 'uploading' && (
              <>
                <h3 className="font-semibold text-lg">
                  Uploading File
                </h3>
                <p className="text-sm text-gray-500">
                  Please wait while your file uploads
                </p>

                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-green-600 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-sm font-medium">{progress}%</p>
              </>
            )}

            {stage === 'analyzing' && (
              <>
                <h3 className="font-semibold text-lg">
                  Audio Analysis in Progress
                </h3>
                <p className="text-sm text-gray-500">
                  AI is processing your recording
                </p>

                <div className="text-4xl font-bold text-green-600 tabular-nums">
                  {Math.floor(analysisTime / 60)}:{String(analysisTime % 60).padStart(2, '0')}
                </div>
                
                <p className="text-xs text-gray-400">
                  {analysisTime < 60 ? 'seconds elapsed' : 'minutes elapsed'}
                </p>
              </>
            )}

            {stage === 'complete' && (
              <>
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg text-green-600">
                  Analysis Complete!
                </h3>
                <p className="text-sm text-gray-600">
                  Completed in <span className="font-semibold">{Math.floor(analysisTime / 60)}m {analysisTime % 60}s</span>
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-semibold">Upload Court Session</h2>
        <p className="text-gray-500">
          Upload an audio recording for transcription
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-green-500 transition">
          <FileAudio className="w-10 h-10 text-green-600 mb-2" />
          <span className="text-sm text-gray-600">
            {file ? file.name : 'Click to select an audio file'}
          </span>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
        >
          <UploadCloud className="w-4 h-4" />
          Start Transcription
        </button>
      </div>

      {result && (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${
                  activeTab === 'formatted' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('formatted')}
              >
                <AlignLeft className="w-4 h-4" />
                Formatted
              </button>

              <button
                className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${
                  activeTab === 'presentable' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('presentable')}
              >
                <LayoutList className="w-4 h-4" />
                Presentable
              </button>

              <button
                className={`px-3 py-1.5 rounded text-sm flex items-center gap-1 ${
                  activeTab === 'raw' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('raw')}
              >
                <Code className="w-4 h-4" />
                Raw
              </button>
            </div>

            <button
              className="px-3 py-1.5 rounded text-sm flex items-center gap-1 bg-gray-100 hover:bg-gray-200"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>

          {activeTab === 'formatted' && (
            <div className="space-y-3">
              {result.segments.map((seg, idx) => (
                <div key={idx} className="p-3 border rounded-lg bg-gray-50">
                  <span className="font-semibold text-green-700">
                    Speaker {seg.speaker}
                  </span>
                  <p className="mt-1">{seg.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'presentable' && (
            <div className="space-y-6">
              {getPresentableFormat().map((block, idx) => (
                <div key={idx}>
                  <h4 className="font-semibold text-green-800 mb-1">
                    Speaker {block.speaker}
                  </h4>
                  <p className="text-gray-800 leading-relaxed">
                    {block.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'raw' && (
            <pre className="bg-gray-900 text-green-200 p-4 rounded-lg text-sm overflow-x-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}