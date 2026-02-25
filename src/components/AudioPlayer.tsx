import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, SkipBack, SkipForward, X, Heart, ChevronDown, Rewind, FastForward } from "lucide-react";
import { Track } from "@/data/mockData";

interface AudioPlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onEnded: () => void;
  podcasts: Track[];
  onTrackChange: (track: Track) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ 
  currentTrack, isPlaying, onPlayPause, onEnded, 
  podcasts, onTrackChange, isFavorite, onToggleFavorite 
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);

  const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current && !isSeeking) {
      const cur = audioRef.current.currentTime;
      const dur = audioRef.current.duration;
      setCurrentTime(cur);
      if (dur) {
        setDuration(dur);
        setProgress((cur / dur) * 100);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const seekTo = useCallback((percent: number) => {
    if (audioRef.current && duration) {
      const time = (percent / 100) * duration;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      setProgress(percent);
    }
  }, [duration]);

  const handleSeekBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    seekTo(Math.max(0, Math.min(100, percent)));
  };

  const handleSeekBarTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0];
    const percent = ((touch.clientX - rect.left) / rect.width) * 100;
    seekTo(Math.max(0, Math.min(100, percent)));
  };

  const skipSeconds = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(audioRef.current.duration, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const cyclePlaybackRate = () => {
    const currentIndex = playbackRates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % playbackRates.length;
    setPlaybackRate(playbackRates[nextIndex]);
  };

  const goToPreviousTrack = () => {
    if (!currentTrack) return;
    // If more than 3 seconds in, restart current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      return;
    }
    const currentIndex = podcasts.findIndex(p => p.id === currentTrack.id);
    if (currentIndex > 0) {
      onTrackChange(podcasts[currentIndex - 1]);
    }
  };

  const goToNextTrack = () => {
    if (!currentTrack) return;
    const currentIndex = podcasts.findIndex(p => p.id === currentTrack.id);
    if (currentIndex < podcasts.length - 1) {
      onTrackChange(podcasts[currentIndex + 1]);
    }
  };

  return (
    <>
      <audio 
        ref={audioRef}
        src={currentTrack?.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onEnded}
      />
      <AnimatePresence>
        {currentTrack && !expanded && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-4 right-4 z-40 bg-zinc-900 border border-white/10 rounded-2xl p-3 shadow-2xl flex items-center gap-4 text-white cursor-pointer"
            onClick={() => setExpanded(true)}
          >
            <div className="size-12 rounded-lg overflow-hidden shrink-0">
              <img src={currentTrack.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold truncate">{currentTrack.title}</h4>
              <p className="text-xs text-zinc-400 truncate">{currentTrack.episode}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
                className={`p-1.5 rounded-full transition-all ${isFavorite ? 'text-primary' : 'text-zinc-500'}`}
              >
                <Heart className={`size-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onPlayPause(); }}
                className="size-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
              </button>
            </div>
            
            {/* Mini Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800 rounded-t-2xl overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Full-Screen Player */}
      <AnimatePresence>
        {currentTrack && expanded && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-gradient-to-b from-zinc-900 via-[#121212] to-black flex flex-col text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-[calc(1rem+env(safe-area-inset-top))] pb-4">
              <button onClick={() => setExpanded(false)} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors">
                <ChevronDown className="size-6" />
              </button>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">En cours de lecture</p>
              <button
                onClick={onToggleFavorite}
                className={`p-2 -mr-2 rounded-full transition-all ${isFavorite ? 'text-primary' : 'text-zinc-400 hover:text-white'}`}
              >
                <Heart className={`size-6 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Album Art */}
            <div className="flex-1 flex items-center justify-center px-10">
              <motion.div 
                className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-primary/10"
                animate={{ scale: isPlaying ? 1 : 0.95 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <img src={currentTrack.image} alt={currentTrack.title} className="w-full h-full object-cover" />
              </motion.div>
            </div>

            {/* Track Info */}
            <div className="px-8 mt-6">
              <h2 className="text-xl font-bold tracking-tight">{currentTrack.title}</h2>
              <p className="text-sm text-zinc-400 mt-1">{currentTrack.episode} • {currentTrack.duration}</p>
              {currentTrack.description && (
                <p className="text-xs text-zinc-500 mt-2 line-clamp-2">{currentTrack.description}</p>
              )}
            </div>

            {/* Seek Bar */}
            <div className="px-8 mt-6">
              <div 
                className="relative w-full h-2 bg-zinc-800 rounded-full cursor-pointer group"
                onClick={handleSeekBarClick}
                onTouchMove={handleSeekBarTouch}
                onTouchStart={() => setIsSeeking(true)}
                onTouchEnd={() => setIsSeeking(false)}
              >
                <div 
                  className="h-full bg-primary rounded-full relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 size-4 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-zinc-500 font-medium">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(duration - currentTime)}</span>
              </div>
            </div>

            {/* Player Controls */}
            <div className="flex items-center justify-center gap-6 mt-4 px-8">
              {/* -15s */}
              <button 
                onClick={() => skipSeconds(-15)} 
                className="relative p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Reculer de 15 secondes"
              >
                <Rewind className="size-6" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold">15</span>
              </button>

              {/* Previous */}
              <button onClick={goToPreviousTrack} className="p-2 text-white hover:text-primary transition-colors">
                <SkipBack className="size-7 fill-current" />
              </button>

              {/* Play/Pause */}
              <button 
                onClick={onPlayPause}
                className="size-16 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform shadow-lg"
              >
                {isPlaying ? <Pause className="size-7 fill-current" /> : <Play className="size-7 fill-current ml-1" />}
              </button>

              {/* Next */}
              <button onClick={goToNextTrack} className="p-2 text-white hover:text-primary transition-colors">
                <SkipForward className="size-7 fill-current" />
              </button>

              {/* +30s */}
              <button 
                onClick={() => skipSeconds(30)} 
                className="relative p-2 text-zinc-400 hover:text-white transition-colors"
                aria-label="Avancer de 30 secondes"
              >
                <FastForward className="size-6" />
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-bold">30</span>
              </button>
            </div>

            {/* Bottom Controls: Speed + Volume */}
            <div className="flex items-center justify-between px-8 mt-6 mb-[calc(2rem+env(safe-area-inset-bottom))]">
              {/* Playback Speed */}
              <button 
                onClick={cyclePlaybackRate}
                className="px-4 py-2 rounded-full bg-zinc-800 border border-white/10 text-sm font-bold hover:bg-zinc-700 transition-colors min-w-[4rem]"
              >
                x{playbackRate}
              </button>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setVolume(v => v > 0 ? 0 : 1)}
                  className="text-zinc-400 hover:text-white transition-colors"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                    {volume === 0 ? (
                      <>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                        <line x1="23" y1="9" x2="17" y2="15" />
                        <line x1="17" y1="9" x2="23" y2="15" />
                      </>
                    ) : (
                      <>
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" />
                        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                        {volume > 0.5 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
                      </>
                    )}
                  </svg>
                </button>
                <div className="w-24 relative">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-zinc-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
