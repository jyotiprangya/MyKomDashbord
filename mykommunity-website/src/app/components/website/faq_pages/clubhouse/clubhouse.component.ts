import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';


@Component({
  selector: 'app-clubhouse',
  templateUrl: './clubhouse.component.html',
  styleUrls: ['./clubhouse.component.css']
})
export class ClubhouseComponent implements OnInit {

  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;

  constructor() { }

  ngOnInit(): void {
    AOS.init();
  }

}

