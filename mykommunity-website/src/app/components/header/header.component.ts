import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Input() selectedLabel = '';
  @Output() toggleSidebarForMe = new EventEmitter<void>();

  isExpanded: boolean = false;
  sideBarOpen = false;
  formData: any;

  firstName: string = '';
  lastName: string = '';
  societyImage: string | null = null; 
  societyName: string = '';
  currentDate: string = '';

  private interval: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.updateDateTime();
    this.interval = setInterval(() => {
      this.updateDateTime();
    }, 60000); // Update time once every minute

    this.firstName = sessionStorage.getItem('firstName') || 'Default First Name';
    this.lastName = sessionStorage.getItem('lastName') || 'Default Last Name';
    this.societyImage = sessionStorage.getItem('societyImage') || null;
    this.societyName = sessionStorage.getItem('societyName') || 'Default Society';
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  get imageUrl(): string {
    if (this.societyImage && typeof this.societyImage === 'string') {
      try {
        new URL(this.societyImage); // Check if it's a valid URL
        return this.societyImage;  // Return the valid URL
      } catch (e) {
        return 'assets/logo.jpg'; // Fallback if it's not a valid URL
      }
    } else {
      return 'assets/logo.jpg';  // Fallback if societyImage is null or not a valid string
    }
  }
  

  toggleSidebar(): void {
    this.toggleSidebarForMe.emit();
  }

  private updateDateTime(): void {
    const now = new Date();
    this.currentDate = now.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    });
  }

  home(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('societyId');
    sessionStorage.removeItem('firstName');
    sessionStorage.removeItem('lastName');

    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }

    // Perform any additional logout operations
    this.router.navigate(['/home']);
  }
}
