import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';


type AppColor = 'blue' | 'green' | 'purple';

interface ColorClasses {
  bg: string;
  text: string;
  hover: string;
  border: string;
}

interface App {
  title: string;
  icon: string;
  description: string;
  features: string[];
  color: AppColor;
  link: string;
}


@Component({
  selector: 'app-body',
 
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  currentIndex = 0;
  translateX = 0;
  societies = [
    { name: 'Society Name 1', image: '../../../../assets/onboardlogo.png' },
    { name: 'Society Name 2', image: '../../../../assets/onboardlogo.png' },
    { name: 'Society Name 3', image: '../../../../assets/onboardlogo.png' },
    { name: 'Society Name 4', image: '../../../../assets/onboardlogo.png' },
    
  ];
  apps: App[] = [
    {
      title: "Resident App",
      icon: "onboardlogo",
      description: "Manage your residential services and community access",
      features: [
        "Digital visitor management",
        "Amenity booking system",
        "Community announcements",
        "Maintenance requests",
        "Bill payments & tracking"
      ],
      color: 'blue',
      link: "/resident"
    },
    {
      title: "Security App",
      icon: "mklogo",
      description: "Monitor and control security operations",
      features: [
        "Visitor verification",
        "Access control management",
        "Incident reporting",
        "Guard patrol tracking",
        "Emergency alerts"
      ],
      color: 'green',
      link: "/security"
    },
    {
      title: "Supervisor App",
      icon: "admin",
      description: "Oversee and manage facility operations",
      features: [
        "Staff management",
        "Performance monitoring",
        "Resource allocation",
        "Analytics dashboard",
        "Audit logs & reports"
      ],
      color: 'purple',
      link: "/supervisor"
    }
  ];

  private readonly colorMap: Record<AppColor, ColorClasses> = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      hover: "hover:bg-blue-100",
      border: "border-blue-200"
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      hover: "hover:bg-green-100",
      border: "border-green-200"
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      hover: "hover:bg-purple-100",
      border: "border-purple-200"
    }
  };

  getColorClasses(color: AppColor): ColorClasses {
    return this.colorMap[color];
  }

  navigateToApp(link: string): void {
    this.router.navigate([link]);
  }

  nextSlide() {
    if (this.currentIndex < this.societies.length - 3) {
      this.currentIndex++;
      this.updateTranslateX();
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateTranslateX();
    }
  }

  private updateTranslateX() {
    const cardWidth = document.querySelector('.society-card')?.clientWidth || 0;
    const gap = 20; // matches the gap in CSS
    this.translateX = -(this.currentIndex * (cardWidth + gap));
  }

  constructor(private router: Router) { }

  ngOnInit(): void {
    AOS.init();
    setInterval(() => {
      if (this.currentIndex < this.societies.length - 3) {
        this.nextSlide();
      } else {
        this.currentIndex = 0;
        this.updateTranslateX();
      }
    }, 3000); 
  }
  ReadMore:boolean = true
  readMore:boolean = true
  isReadMore:boolean = true

  onclick(){
    this.isReadMore = !this.isReadMore;
    // this.Visible = !this.Visible
  }
  onRead(){
    this.ReadMore = !this.ReadMore;
  }

  onReadMore(){
    this.readMore = !this.readMore;
  }

}
