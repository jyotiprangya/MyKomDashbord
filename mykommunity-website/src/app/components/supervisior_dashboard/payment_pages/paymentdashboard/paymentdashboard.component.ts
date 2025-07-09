import { Component, OnInit } from '@angular/core';
interface SideNavToggle{
  screenWidth: number;
  collapsed:boolean;
  }

@Component({
  selector: 'app-paymentdashboard',
  templateUrl: './paymentdashboard.component.html',
  styleUrls: ['./paymentdashboard.component.css']
})
export class PaymentdashboardComponent implements OnInit {

  constructor() { }
  sideBarOpen = true;
  isExpanded: boolean = false;
  ngOnInit(): void {
  }

  sideBarToggler(){
    this.sideBarOpen = !this.sideBarOpen;
  }
  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data:SideNavToggle):void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;

  }
}
