import React, { useState } from 'react';
import {
  UploadCloud,
  FileAudio,
  Loader2,
  Printer,
  Code,
  AlignLeft,
  LayoutList,
  Copy,
} from 'lucide-react';
import { toast } from 'sonner';

export function UploadCourtSession() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('formatted');
  const [stage, setStage] = useState('uploading');
  const [analysisTime, setAnalysisTime] = useState(0);
  const [speakerNames, setSpeakerNames] = useState({});

  /* ---------------- PRESENTABLE MERGE LOGIC (UNCHANGED) ---------------- */
  const getPresentableFormat = () => {
    if (!result) return [];

    const merged = [];
    let current = null;

    result.segments.forEach((seg) => {
      const speakerLabel =
        speakerNames[seg.speaker] || `Speaker ${seg.speaker}`;

      if (!current || current.speaker !== speakerLabel) {
        if (current) merged.push(current);
        current = {
          speaker: speakerLabel,
          text: seg.text,
        };
      } else {
        current.text += ' ' + seg.text;
      }
    });

    if (current) merged.push(current);
    return merged;
  };

  /* ---------------- COPY PRESENTABLE ---------------- */
  const copyPresentableToClipboard = () => {
    const text = getPresentableFormat()
      .map((b) => `${b.speaker}\n${b.text}\n`)
      .join('\n');

    navigator.clipboard.writeText(text);
    toast.success('Presentable format copied to clipboard');
  };

  /* ---------------- UPLOAD HANDLER ---------------- */
  const handleUpload = () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setProgress(0);
    setResult(null);
    setStage('uploading');
    setAnalysisTime(0);

    let analysisInterval = null;
    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded * 100) / e.total);
        setProgress(percent);

        if (percent === 100) {
          setTimeout(() => {
            setStage('analyzing');
            analysisInterval = setInterval(() => {
              setAnalysisTime((t) => t + 1);
            }, 1000);
          }, 600);
        }
      }
    };

    xhr.onload = () => {
      if (analysisInterval) clearInterval(analysisInterval);

      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        setResult(data);

        const map = {};
        [...new Set(data.segments.map((s) => s.speaker))].forEach(
          (s) => (map[s] = `Speaker ${s}`)
        );
        setSpeakerNames(map);

        setStage('complete');
        setTimeout(() => setLoading(false), 1500);
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

    // xhr.open('POST', 'http://13.60.9.123:8000/transcribe');
    xhr.open('POST', 'https://apps.echosurveys.com.ng/transcribe');
    xhr.send(formData);
  };

  const handlePrint = () => window.print();

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      {/* Spinner animation */}
      <style>
        {`
          @keyframes spin-fast {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .spin-fast {
            animation: spin-fast 0.6s linear infinite;
          }
        `}
      </style>

      {/* LOADING OVERLAY */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[380px] text-center space-y-4">
            <Loader2
              className={`w-10 h-10 mx-auto text-green-600 ${
                stage === 'analyzing' ? 'spin-fast' : ''
              }`}
            />

            {stage === 'uploading' && (
              <>
                <h3 className="font-semibold">Uploading File</h3>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm">{progress}%</p>
              </>
            )}

            {stage === 'analyzing' && (
              <>
                <h3 className="font-semibold">Audio Analysis in Progress</h3>
                <p className="text-3xl font-bold text-green-600">
                  {Math.floor(analysisTime / 60)}:
                  {String(analysisTime % 60).padStart(2, '0')}
                </p>
                <p className="text-xs text-gray-500">
                  Do not exit this window
                </p>
              </>
            )}

            {stage === 'complete' && (
              <>
                <h3 className="font-semibold text-green-600">
                  Analysis Complete
                </h3>
                <p className="text-sm">
                  Completed in {analysisTime}s
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div>
        <h2 className="text-2xl font-semibold">Upload Court Session</h2>
        <p className="text-gray-500">
          Upload an audio recording for transcription
        </p>
      </div>

      {/* UPLOAD */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <label className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center cursor-pointer">
          <FileAudio className="w-10 h-10 text-green-600 mb-2" />
          <span className="text-sm">
            {file ? file.name : 'Click to select an audio file'}
          </span>
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg flex justify-center gap-2"
        >
          <UploadCloud className="w-4 h-4" />
          Start Transcription
        </button>
      </div>

      {/* SPEAKER NAMING */}
      {result && (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h3 className="font-semibold">Assign Speaker Names</h3>

          {Object.keys(speakerNames).map((sp) => (
            <div key={sp} className="flex gap-3 items-center">
              <span className="w-28 text-sm">Speaker {sp}</span>
              <input
                value={speakerNames[sp]}
                onChange={(e) =>
                  setSpeakerNames({
                    ...speakerNames,
                    [sp]: e.target.value,
                  })
                }
                className="flex-1 border rounded-lg px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      )}

      {/* RESULTS */}
      {result && (
        <div className="bg-white rounded-2xl shadow p-6 space-y-4 h-[550px] shadow-lg border">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {['formatted', 'presentable', 'raw'].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    activeTab === t
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {activeTab === 'presentable' && (
                <button
                  onClick={copyPresentableToClipboard}
                  className="px-3 py-1.5 cursor-pointer rounded bg-gray-200 flex gap-1"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              )}
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded bg-gray-100 flex gap-1"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
            </div>
          </div>

          {/* FORMATTED */}
          {activeTab === 'formatted' && (
            <div className="space-y-3 h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 bg-gray-100">
              {result.segments.map((s, i) => (
                <div key={i} className="border p-3 rounded bg-gray-50">
                  <strong>{speakerNames[s.speaker]}</strong>
                  <p>{s.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* PRESENTABLE */}
          {activeTab === 'presentable' && (
            <div className="space-y-6 h-[550px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
              {getPresentableFormat().map((b, i) => (
                <div key={i}>
                  <h4 className="font-semibold text-green-800">
                    {b.speaker}
                  </h4>
                  <p className="leading-relaxed">{b.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* RAW */}
          {activeTab === 'raw' && (
            <pre className="bg-gray-900 text-green-200 p-4 rounded-lg text-sm overflow-x-auto max-h-[550px] overflow-y-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
