export interface SlideshowItem {
    type: 'video' | 'gif';
    url: string;
    backgroundColor: string;
    duration?: number; // Duration in milliseconds, optional for videos
    speed?: number; // Playback speed for videos, default is 1
    loopCount?: number;
  }