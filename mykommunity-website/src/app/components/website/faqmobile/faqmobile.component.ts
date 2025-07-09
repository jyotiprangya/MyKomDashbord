import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AOS from 'aos';


@Component({
  selector: 'app-faqmobile',
  templateUrl: './faqmobile.component.html',
  styleUrls: ['./faqmobile.component.css']
})
export class FaqmobileComponent implements OnInit {
 
  items = ['Item 1'];
  expandedIndex = 0;

  constructor(private router:Router) { }

  ngOnInit(): void {
    AOS.init();
  }
  

}