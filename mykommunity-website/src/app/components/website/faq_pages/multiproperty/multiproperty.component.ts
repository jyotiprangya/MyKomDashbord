import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';


@Component({
  selector: 'app-multiproperty',
  templateUrl: './multiproperty.component.html',
  styleUrls: ['./multiproperty.component.css']
})
export class MultipropertyComponent implements OnInit {

  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;

  constructor() { }

  ngOnInit(): void {
    AOS.init();
  }

}
