import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaExpand, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface Video {
    id: number;
    title: string;
    description: string;
    file: string;
    thumbnail: string;
}

const pageVariants = {
    initial: { opacity: 0, scale: 0.98 },
    in: { opacity: 1, scale: 1 },
    out: { opacity: 0, scale: 0.98 },
};

const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const EfsaneVideolarPage: React.FC = () => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState('00:00');
    const [currentTime, setCurrentTime] = useState('00:00');

    const videoRef = useRef<HTMLVideoElement>(null);
    const playerContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetch('/videos.json')
            .then(res => res.json())
            .then(data => {
                setVideos(data);
                if (data.length > 0) {
                    setCurrentVideo(data[0]);
                }
            })
            .catch(err => console.error("Video listesi yüklenemedi:", err));
    }, []);
    
    const selectVideo = useCallback((video: Video) => {
        if(video.id !== currentVideo?.id) {
            setCurrentVideo(video);
            setIsPlaying(false);
        }
    }, [currentVideo]);

    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        
        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    }, [isPlaying]);
    
    const handleProgressUpdate = () => {
        const video = videoRef.current;
        if(!video || !video.duration) return;
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(formatTime(video.currentTime));
    };
    
    const handleVideoMetadata = () => {
        if (videoRef.current) setDuration(formatTime(videoRef.current.duration));
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (videoRef.current) videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !isMuted;
        setIsMuted(!isMuted);
    };
    
    const toggleFullscreen = () => {
        const container = playerContainerRef.current;
        if(container){
            if (!document.fullscreenElement) {
                container.requestFullscreen().catch(err => console.log(err));
            } else {
                document.exitFullscreen();
            }
        }
    };
    
    const handleProgressScrub = (e: React.MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        if (!video) return;
        const scrubTime = (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * video.duration;
        video.currentTime = scrubTime;
    };
    
    // Auto-play next video
    const playNext = useCallback(() => {
        if(!currentVideo) return;
        const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
        const nextIndex = (currentIndex + 1) % videos.length;
        setCurrentVideo(videos[nextIndex]);
        setIsPlaying(true);
    }, [currentVideo, videos]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        
        // Auto play after selecting a new video source
        if(isPlaying) video.play();

    }, [currentVideo, isPlaying])

    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ type: 'tween', duration: 0.5 }}
            className="container mx-auto px-4 py-12"
        >
            <div className="text-center mb-12">
                <h1 className="text-5xl font-orbitron font-bold text-light-gray tracking-tighter">
                    EFSANE VİDEO KAYITLARI
                </h1>
                <p className="text-lg text-metallic-gray mt-2">Siber-hafızanın hareketli arşivleri.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Video Player */}
                <div ref={playerContainerRef} className="lg:col-span-2 bg-black rounded-lg overflow-hidden group relative">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain"
                        src={currentVideo?.file}
                        poster={currentVideo?.thumbnail}
                        onTimeUpdate={handleProgressUpdate}
                        onLoadedMetadata={handleVideoMetadata}
                        onEnded={playNext}
                        onClick={togglePlay}
                    ></video>
                    
                    {/* Custom Controls Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                        {/* Top controls (placeholder) */}
                        <div></div>
                        {/* Center play button (shows only when paused) */}
                        {!isPlaying && currentVideo && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button onClick={togglePlay} className="p-4 bg-cyber-purple/50 rounded-full text-light-gray text-5xl hover:bg-cyber-purple transition-all duration-300">
                                    <FaPlay className="ml-1" />
                                </button>
                            </div>
                        )}
                        {/* Bottom controls */}
                        <div className="flex flex-col space-y-2">
                             <div className="w-full h-1 bg-metallic-gray/50 rounded-full cursor-pointer" onClick={handleProgressScrub}>
                                <div className="h-full bg-cyber-purple rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="flex items-center justify-between text-light-gray">
                                <div className="flex items-center space-x-4">
                                    <button onClick={togglePlay}>
                                        {isPlaying ? <FaPause /> : <FaPlay />}
                                    </button>
                                    <button onClick={toggleMute}>
                                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                                    </button>
                                     <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.05"
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        className="w-24 h-1 bg-metallic-gray/30 rounded-lg appearance-none cursor-pointer range-sm accent-cyber-purple"
                                    />
                                    <span className="font-mono text-sm">{currentTime} / {duration}</span>
                                </div>
                                <button onClick={toggleFullscreen}><FaExpand /></button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Playlist */}
                <div className="lg:col-span-1 bg-dark-anthracite/50 border border-metallic-gray/20 rounded-lg p-4 h-[75vh] overflow-y-auto">
                    <h2 className="font-orbitron text-xl text-cyber-purple mb-4">Kayıt Arşivi</h2>
                    <ul className="space-y-4">
                        {videos.map(video => (
                            <li
                                key={video.id}
                                onClick={() => selectVideo(video)}
                                className={`flex items-start space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-300 ${
                                    currentVideo?.id === video.id 
                                        ? 'bg-cyber-purple/20' 
                                        : 'hover:bg-metallic-gray/20'
                                }`}
                            >
                                <img src={video.thumbnail} alt={video.title} className="w-24 h-14 object-cover rounded-md flex-shrink-0" />
                                <div className="flex-grow">
                                    <h3 className={`font-bold text-sm ${currentVideo?.id === video.id ? 'text-cyber-purple' : 'text-light-gray'}`}>{video.title}</h3>
                                    <p className="text-xs text-metallic-gray">{video.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export default EfsaneVideolarPage;