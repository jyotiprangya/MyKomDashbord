import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-eintercom',
  templateUrl: './eintercom.component.html',
  styleUrls: ['./eintercom.component.css']
})
export class EintercomComponent implements OnInit {

  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;

  constructor() { }

  ngOnInit(): void {
    AOS.init();
  }

}
