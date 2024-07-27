import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { SlideshowItem } from './slideshow-item.interface';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.scss']
})
export class SlideshowComponent implements OnInit {
  @ViewChild('mediaElement') mediaElement!: ElementRef;

  mediaItems: SlideshowItem[] = [
    {
      url: 'assets/gifs/dalmation.gif',
      type: 'gif',
      backgroundColor: 'white',
      duration: 15000
    },
    {
      url: 'assets/gifs/2.gif',
      type: 'gif',
      backgroundColor: 'black',
      duration: 15000
    },
    {
      url: 'assets/gifs/3.gif',
      type: 'gif',
      backgroundColor: '#FAFAFA',
      duration: 15000
    },
    {
      url: 'assets/gifs/4.gif',
      type: 'gif',
      backgroundColor: '#FAE9D4',
      duration: 15000
    },
    {
      url: 'assets/gifs/5.gif',
      type: 'gif',
      backgroundColor: 'black',
      duration: 15000
    },
    {
      url: 'assets/videos/generative-1.mp4',
      type: 'video',
      backgroundColor: 'black',
      speed: .25
    },
    {
      url: 'assets/videos/generative-4.mp4',
      type: 'video',
      backgroundColor: '#E6CCAF',
      speed: 0.5
    },
    {
      url: 'assets/videos/generative-5.mp4',
      type: 'video',
      backgroundColor: 'black'
    },
    {
      url: 'assets/videos/generative-6.mp4',
      type: 'video',
      backgroundColor: '#070708',
      speed: .75
    },
    {
      url: 'assets/videos/generative-7.mp4',
      type: 'video',
      backgroundColor: '#FDF1B8',
      speed: .5
    },
    {
      url: 'assets/videos/generative-9.mp4',
      type: 'video',
      backgroundColor: '#F8F6FA',
      speed: .33
    },
    {
      url: 'assets/videos/generative-10.mp4',
      type: 'video',
      backgroundColor: 'black',
      speed: .33
    },
  ];

  currentIndex = 0;
  private timer: any;

  get currentItem(): SlideshowItem {
    return this.mediaItems[this.currentIndex];
  }

  ngOnInit() {
    this.loadCurrentMedia();
  }

  loadCurrentMedia() {
    if (this.mediaElement) {
      const element = this.mediaElement.nativeElement;
      element.src = this.currentItem.url;
      
      if (this.currentItem.type === 'video' && element instanceof HTMLVideoElement) {
        element.playbackRate = this.currentItem.speed || 1;
        element.volume = 0;
        element.play().catch(error => console.error('Error playing video:', error));
      } else if (this.currentItem.type === 'gif') {
        // Clear any existing timer
        if (this.timer) {
          clearTimeout(this.timer);
        }
        // Set a new timer for GIF duration
        this.timer = setTimeout(() => this.nextMedia(), this.currentItem.duration || 5000);
      }
    }
  }

  onMediaEnded() {
    if (this.currentItem.type === 'video') {
      this.nextMedia();
    }
    // For GIFs, we don't do anything here as they're handled by the timer
  }

  nextMedia() {
    // Clear any existing timer when changing media
    if (this.timer) {
      clearTimeout(this.timer);
    }
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * this.mediaItems.length);
    } while (nextIndex === this.currentIndex && this.mediaItems.length > 1);

    this.currentIndex = nextIndex;
    this.loadCurrentMedia();
  }

  @HostListener('click')
  onClickAnywhere() {
    this.nextMedia();
  }

  ngOnDestroy() {
    // Clear the timer when the component is destroyed
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
}
