import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { SlideshowItem } from './slideshow-item.interface';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss'],
})
export class SlideshowComponent implements AfterViewInit {
  @ViewChild('mediaElement') mediaElement!: ElementRef;

  mediaItems: SlideshowItem[] = [
    {
      url: 'assets/gifs/dalmation.gif',
      type: 'gif',
      backgroundColor: 'white',
    },
    {
      url: 'assets/gifs/2.gif',
      type: 'gif',
      backgroundColor: 'black',
    },
    {
      url: 'assets/gifs/3.gif',
      type: 'gif',
      backgroundColor: '#FAFAFA',
    },
    {
      url: 'assets/gifs/4.gif',
      type: 'gif',
      backgroundColor: '#FAE9D4',
      duration: 15000,
    },
    {
      url: 'assets/gifs/5.gif',
      type: 'gif',
      backgroundColor: 'black',
      duration: 15000,
    },
    {
      url: 'assets/videos/generative-1.mp4',
      type: 'video',
      backgroundColor: 'black',
      speed: 0.33,
    },
    {
      url: 'assets/videos/generative-4.mp4',
      type: 'video',
      backgroundColor: '#E6CCAF',
      speed: 0.5,
      loopCount: 2,
    },
    {
      url: 'assets/videos/generative-5.mp4',
      type: 'video',
      backgroundColor: 'black',
    },
    {
      url: 'assets/videos/generative-6.mp4',
      type: 'video',
      backgroundColor: '#070708',
      speed: 0.75,
    },
    {
      url: 'assets/videos/generative-7.mp4',
      type: 'video',
      backgroundColor: '#FDF1B8',
      speed: 0.5,
    },
    {
      url: 'assets/videos/generative-9.mp4',
      type: 'video',
      backgroundColor: '#F8F6FA',
      speed: 0.33,
    },
    {
      url: 'assets/videos/generative-10.mp4',
      type: 'video',
      backgroundColor: 'black',
      speed: 0.33,
    },
  ];

  currentIndex = 0;
  private timer: any;
  private loopsCompleted = 0;
  private defaultDuration = 25000;
  fullscreen = false;

  get currentItem(): SlideshowItem {
    return this.mediaItems[this.currentIndex];
  }

  ngAfterViewInit() {
    this.loadCurrentMedia();
  }

  loadCurrentMedia() {
    if (this.mediaElement) {
      const element = this.mediaElement.nativeElement;
      element.src = this.currentItem.url;

      this.loopsCompleted = 0;

      // Clear any existing timer
      if (this.timer) {
        clearTimeout(this.timer);
      }

      if (
        this.currentItem.type === 'video' &&
        element instanceof HTMLVideoElement
      ) {
        element.playbackRate = this.currentItem.speed || 1;
        element.volume = 0;
        element.loop = false;
        element
          .play()
          .catch((error) => console.error('Error playing video:', error));

        if (this.currentItem.loopCount) {
          element.addEventListener('ended', this.handleVideoLoop);
        } else {
          element.addEventListener('ended', this.nextMedia);
        }
      } else {
        const duration = this.currentItem.duration || this.defaultDuration;
        this.timer = setTimeout(() => this.nextMedia(), duration);
      }
    }
  }

  private handleVideoLoop = () => {
    this.loopsCompleted++;
    if (this.loopsCompleted < (this.currentItem.loopCount || 1)) {
      const element = this.mediaElement.nativeElement as HTMLVideoElement;
      element.currentTime = 0; // Reset video to start
      element
        .play()
        .catch((error) => console.error('Error replaying video:', error));
    } else {
      this.nextMedia();
    }
  };

  nextMedia() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    const element = this.mediaElement.nativeElement;
    element.removeEventListener('ended', this.handleVideoLoop);
    element.removeEventListener('ended', this.nextMedia);

    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * this.mediaItems.length);
    } while (nextIndex === this.currentIndex && this.mediaItems.length > 1);

    this.currentIndex = nextIndex;
    this.loadCurrentMedia();
  }

  @HostListener('click', ['$event'])
  onClickAnywhere(event: Event) {
    if (!(event.target as HTMLElement).closest('#fullScreenBtn')) {
      this.nextMedia();
    }
  }

  ngOnDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    const element = this.mediaElement.nativeElement;
    element.removeEventListener('ended', this.handleVideoLoop);
    element.removeEventListener('ended', this.nextMedia);
  }

  toggleFullscreen(event: Event) {
    event.stopPropagation();
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
        this.fullscreen = true;
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.fullscreen = false;
      }
    }
  }
}
