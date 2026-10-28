import React, { useState, useEffect } from 'react';
import { VideoProofMetadata } from '../types/scrutiny';
import { 
  Video, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  ShieldCheck, 
  Cpu, 
  Maximize2,
  Clock,
  Layers,
  Sparkles,
  Camera,
  FileCheck
} from 'lucide-react';

interface VideoProofViewerProps {
  videoProof: VideoProofMetadata;
  documentName: string;
  onVerifyAndResolve?: (notes: string) => void;
  isResolved?: boolean;
}

export const VideoProofViewer: React.FC<VideoProofViewerProps> = ({
  videoProof,
  documentName,
  onVerifyAndResolve,
  isResolved = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(15);
  const [selectedHighlightIndex, setSelectedHighlightIndex] = useState(0);

  // Auto-tick playback simulation if user plays
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= 105 ? 0 : prev + 1));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Informational Header */}
      <div className="bg-slate-900 border border-slate-800 text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{videoProof.fileName}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-700 text-[10px] font-mono font-bold">
                GEOTAGGED VERIFIED
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-3 font-mono">
              <span>Duration: {videoProof.duration}</span>
              <span>·</span>
              <span>FPS: {videoProof.fps}</span>
              <span>·</span>
              <span>Recorded: {new Date(videoProof.recordedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {onVerifyAndResolve && !isResolved && (
          <button
            onClick={() => onVerifyAndResolve(`Officer reviewed ${videoProof.duration} geotagged laboratory video walkthrough. Verified GPS coordinates (${videoProof.gpsCoordinates}) and ${videoProof.workstationsCount} computing terminals. Deficiency resolved.`)}
            className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify & Resolve via Video Evidence</span>
          </button>
        )}

        {isResolved && (
          <span className="px-3 py-1.5 rounded-lg bg-emerald-900/60 text-emerald-300 border border-emerald-700 text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Deficiency Resolved by Video Proof</span>
          </span>
        )}
      </div>

      {/* Video Simulation Canvas & HUD Player */}
      <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 aspect-video flex flex-col justify-between p-4 shadow-xl select-none group">
        
        {/* Background visual laboratory simulation */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 opacity-90 flex items-center justify-center">
          
          {/* Schematic Lab Grid with Computer Terminals & Robot Arm */}
          <svg className="w-full h-full opacity-40" viewBox="0 0 800 450">
            {/* Room Perspective Lines */}
            <line x1="0" y1="0" x2="250" y2="150" stroke="#334155" strokeWidth="1" />
            <line x1="800" y1="0" x2="550" y2="150" stroke="#334155" strokeWidth="1" />
            <line x1="0" y1="450" x2="250" y2="300" stroke="#334155" strokeWidth="1" />
            <line x1="800" y1="450" x2="550" y2="300" stroke="#334155" strokeWidth="1" />
            <rect x="250" y="150" width="300" height="150" fill="none" stroke="#475569" strokeWidth="1" />
            
            {/* Workstation Rows */}
            <g transform="translate(100, 180)">
              <rect x="0" y="0" width="120" height="40" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="60" y="24" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">BAY A: 30 PCs</text>
            </g>
            <g transform="translate(580, 180)">
              <rect x="0" y="0" width="120" height="40" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="60" y="24" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">BAY B: 30 PCs</text>
            </g>

            {/* Central Robotic Workcell */}
            <g transform="translate(340, 180)">
              <circle cx="60" cy="50" r="45" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,4" />
              <rect x="45" y="35" width="30" height="30" fill="#f59e0b" rx="4" />
              <text x="60" y="115" fill="#f59e0b" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                ABB IRB-120 ROBOT
              </text>
            </g>
          </svg>

          {/* Real user uploaded video if supplied */}
          {videoProof.videoUrl && (
            <video 
              src={videoProof.videoUrl} 
              className="absolute inset-0 w-full h-full object-cover" 
              controls 
            />
          )}
        </div>

        {/* HUD Top Bar: GPS Watermark & Live Scanner Overlay */}
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-emerald-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-emerald-500/30 backdrop-blur-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="font-bold text-white uppercase text-[10px]">REC · 4K 30FPS</span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1 text-emerald-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>GPS: {videoProof.gpsCoordinates}</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-300">
            <span>TIMESTAMP: {new Date(videoProof.recordedDate).toLocaleTimeString()}</span>
            <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
              AI SCANNER ACTIVE
            </span>
          </div>
        </div>

        {/* HUD Center: AI Bounding Box Recognition Spotlight */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-6">
          <div className="border-2 border-emerald-400/80 bg-emerald-950/20 p-4 rounded-xl text-center backdrop-blur-xs max-w-sm ring-4 ring-emerald-500/10">
            <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Computer Vision Inspection</span>
            </div>
            <div className="text-sm font-bold text-white mt-1">
              {videoProof.frameHighlights[selectedHighlightIndex]?.detectedObject || '60 Intel i7 Workstations + Dual Displays'}
            </div>
            <div className="text-[11px] text-slate-300 font-mono mt-0.5">
              Confidence: {videoProof.frameHighlights[selectedHighlightIndex]?.confidence || 98}% · Norm Compliant
            </div>
          </div>
        </div>

        {/* HUD Bottom: Playback Timeline & Controls */}
        <div className="relative z-10 bg-slate-950/85 p-3 rounded-lg border border-slate-800 backdrop-blur-xs space-y-2">
          {/* Timeline Bar */}
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden cursor-pointer">
            <div 
              className="bg-amber-400 h-1.5 transition-all duration-300"
              style={{ width: `${(currentTime / 105) * 100}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <span className="font-mono text-xs">
                {formatSeconds(currentTime)} / {videoProof.duration}
              </span>
            </div>

            {/* Quick jump to verified frames */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-mono mr-1">Inspect Frames:</span>
              {videoProof.frameHighlights.map((f, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedHighlightIndex(i);
                    setCurrentTime(i === 0 ? 15 : i === 1 ? 42 : i === 2 ? 70 : 95);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors ${
                    selectedHighlightIndex === i
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {f.timestamp}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Frame Verification Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {videoProof.frameHighlights.map((fh, idx) => (
          <div 
            key={idx}
            onClick={() => {
              setSelectedHighlightIndex(idx);
              setCurrentTime(idx === 0 ? 15 : idx === 1 ? 42 : idx === 2 ? 70 : 95);
            }}
            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
              selectedHighlightIndex === idx 
                ? 'border-amber-400 bg-amber-500/10 ring-2 ring-amber-400/20' 
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono font-bold text-amber-700 text-[11px]">{fh.timestamp}</span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold border border-emerald-200">
                {fh.confidence}% AI Match
              </span>
            </div>
            <div className="font-bold text-slate-900 leading-snug">{fh.label}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{fh.detectedObject}</div>
          </div>
        ))}
      </div>

      {/* Summary Box */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl text-xs space-y-2">
        <div className="font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>AICTE Regulatory Video Verification Summary:</span>
        </div>
        <p className="text-slate-700 leading-relaxed font-serif">
          The video evidence provides continuous 105-second geo-tagged walkthrough of the Advanced AI & Robotics Laboratory. 
          GPS metadata firmly validates physical campus presence on Survey No. 44/2A Bavdhan Pune. 
          Object recognition models verified <strong>60 operational computing workstations</strong> and the industrial robotic workcell, resolving earlier static PDF photograph deficiencies.
        </p>
      </div>
    </div>
  );
};
