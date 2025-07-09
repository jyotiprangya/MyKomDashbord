import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';

@Component({
  selector: 'app-iniq',
  templateUrl: './iniq.component.html',
  styleUrls: ['./iniq.component.css']
})
export class IniqComponent implements OnInit {
  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;

  constructor(private router:Router) { }

  ngOnInit(): void {
    AOS.init();
  }
  privacy_policy() {
    this.router.navigate(['/privacy_policy'])
    const scrollToOptions: ScrollToOptions = { top: 0, behavior: 'smooth' };
    window.scrollTo(scrollToOptions);
  }
}
