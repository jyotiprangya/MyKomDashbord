import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  windowScrolled: any;

  constructor() { }

  ngOnInit(): void {
    AOS.init();
    window.addEventListener('scroll', () => {
      this.windowScrolled = window.pageYOffset !== 0;
    });
  }
  isFullscreen = false;
  fullscreenImage: string = '';

  openFullscreen(imageSrc: string) {
    this.fullscreenImage = imageSrc;
    this.isFullscreen = true;
  }

  closeFullscreen() {
    this.isFullscreen = false;
  }
  ReadMore:boolean = true
  readMore:boolean = true
  isReadMore:boolean = true
  Read:boolean = true
  read:boolean = true
  isRead:boolean = true

  onclick(){
    this.isReadMore = !this.isReadMore;
    // this.Visible = !this.Visible
  }
  scrollToTop(): void {
    window.scrollTo(0, 0);
  }
 
  onRead(){
    this.ReadMore = !this.ReadMore;
  }

  onReadMore(){
    this.readMore = !this.readMore;
  }
  OnreadMore(){
    this.read = !this.read;
    // this.Visible = !this.Visible
  }
  OnRead(){
    this.Read = !this.Read;
  }

  OnClick(){
    this.isRead = !this.isRead;
  }

}
