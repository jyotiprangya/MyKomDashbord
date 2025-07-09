import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';


@Component({
  selector: 'app-paymentfaq',
  templateUrl: './paymentfaq.component.html',
  styleUrls: ['./paymentfaq.component.css']
})
export class PaymentfaqComponent implements OnInit {

  items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
  expandedIndex = 0;

  constructor() { }

  ngOnInit(): void {
    AOS.init();
  }

}

