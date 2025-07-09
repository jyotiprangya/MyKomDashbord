import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { navbarData } from './nav-data';
import { INavbarData } from './helper';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupMessageComponent } from '../popup-message/popup-message.component';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-paymentnavbar',
  templateUrl: './paymentnavbar.component.html',
  styleUrls: ['./paymentnavbar.component.css'],
  animations:[
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity:0}),
        animate('350ms',
        style({
          opacity:1
        }))
      ]),
      transition(':leave', [
        style({opacity:1}),
        animate('350ms',
        style({
          opacity:0
        }))
      ]),

    ]),
    trigger('rotate', [
      transition(':enter', [
       animate('1000ms',
       keyframes([
        style({transform:'rotate(0deg)',offset:'0'}),
        style({transform:'rotate(2turn)',offset:'1'})

       ]))
      ])

    ])
  ]
})
export class PaymentnavbarComponent implements OnInit {

  multiple: boolean = false;
  

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();

  collapsed = false;
  screenWidth = 0;
  navData = navbarData;

@HostListener('window:resize', ['$event'])
onResize(event:any){
  this.screenWidth = window.innerWidth;
  if(this.screenWidth <= 768){
    this.collapsed= false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })

  }

}
societyName:any;
selectedLabel!: string;
constructor(private router: Router,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.societyName = sessionStorage.getItem('societyName');
    

  }
  
  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    
  }
  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth })


  }
  backtoDash(){
    this.modalService.open(PopupMessageComponent);
  }
  // selectedLabel = 'user' ; // New property to store the selected label
  handleLabelClick(label: string) {
    console.log('Label clicked:', label);
    this.selectedLabel=label;
    // You can perform any action here based on the clicked label
 }
 
  handelClick(item: INavbarData): void {

    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }

      }

    }
    item.expanded = !item.expanded;

  }
 // paymentdashboard(){
    // //  alert("This will be available from October Onwards....")
    //   this.router.navigate(['/supervisor/paymentdashboard']);

    // }
}

// })
// export class PaymentnavbarComponent implements OnInit {


//   panelOpenState = false;
//   items = ['Item 1'];
//   expandedIndex = 0;
//   sideBarOpen = true;
//   isExpanded: boolean = false;
//   isMenuOpen = true;
//   contentMargin = 240;


//   constructor(private router: Router) { }

//   ngOnInit(): void {
//   }
//   onToolbarMenuToggle() {
//     console.log('On toolbar toggled', this.isMenuOpen);
//     this.isMenuOpen = this.isMenuOpen;

//     if(!this.isMenuOpen) {
//       this.contentMargin = 70;
//     } else {
//       this.contentMargin = 240;
//     }
//   }
//   // sidenavEvents(str) {
//   //   console.log(str);
//   // }
//   rentalunitsetup(){
//     this.router.navigate(['/rentalunitsetup']);
//   }
//   payment(){
//     this.router.navigate(['/payment']);
//   }
//   invoicetemplate(){
//     this.router.navigate(['/createBill']);
//   }
//   account(){
//     this.router.navigate(['/account']);
//   } 
//   gl(){
//     this.router.navigate(['/gl']);
//   }
//   COA(){
//     this.router.navigate(['/chartoa']);
//   }
//   invoice_history(){
//     this.router.navigate(['/invoicehistory']);
//   }
//   Payment_intimation(){
//     this.router.navigate(['/paymentintimation']);
//   }
//   dues(){
//     this.router.navigate(['/dues']);
//   }
//   vendorlist(){
//     this.router.navigate(['/vendorlist']);
//   }
//   vendorbooking(){
//     this.router.navigate(['/vendorbooking']);
//   }
//   vendorreportdate(){
//     this.router.navigate(['/vendorreportdate']);
//   }
//   bankreconcilation(){
//     this.router.navigate(['/bankreconcilation']);
//   }
//   banktransfer(){
//     this.router.navigate(['/cashbanktransfer']);
//   }
//   budget(){
//     this.router.navigate(['/budget']);
//   }
//   late_fee(){
//     this.router.navigate(['/late_fee']);
//   }
//   GP(){
//     this.router.navigate(['/generalpayment']);
//   }
  // chargelist(){
  //   this.router.navigate(['/chargelist']);
  // }
//   allocatecharge(){
//     this.router.navigate(['/allocatecharge']);
//   }
//   billgeneration(){
//     this.router.navigate(['/billgeneration']);
//   }
//   trialbalance(){
//     this.router.navigate(['/trialbalance']); 
//   }
//   income_Expenditure_Report(){
//     this.router.navigate(['/income_Expenditure_Report']);
//   }
//   balance_sheet(){
//     this.router.navigate(['/balance_sheet']);
//   }
//   receipt_payment_report(){
//     this.router.navigate(['/receipt_payment_report']);
//   }
//   chargetype(){
//     this.router.navigate(['/chargetype']);
//   }
// //balance_sheet receipt_payment_report
  
// }
