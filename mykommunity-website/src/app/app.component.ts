import { Component, HostBinding, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { 
  title = 'kommunity';
  isFixedNavbar:any;
  @HostBinding('class.navbar-opened') navbarOpened = false;

  constructor(private router:Router){ }
    ngOnInit(): void {
    }
   home() {
     this.router.navigate(['/home'])
     const scrollToOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollToOptions);
   }
   about() {
    this.router.navigate(['/about'])
    const scrollToOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollToOptions);
  }
  features() {
    this.router.navigate(['/features'])
    const scrollToOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollToOptions);
  }
  contact() {
    this.router.navigate(['/contact'])
    const scrollToOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollToOptions);
  }
  login() {
    this.router.navigate(['/login'])
    const scrollToOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollToOptions);
  }
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if(offset > 10) {
      this.isFixedNavbar = true;
    } else {
      this.isFixedNavbar = false;
    }
  }

  toggleNavbar() {
    this.navbarOpened = !this.navbarOpened;
  }
  
}
