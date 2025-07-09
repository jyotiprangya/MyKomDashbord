import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { INavbarData } from './helper';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { navbarData } from './nav-data';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
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
export class SidenavComponent implements OnInit {

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
constructor(private router: Router ) { }

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
  paymentdashboard(){
    //  alert("This will be available from October Onwards....")
      this.router.navigate(['/supervisor/paymentdashboard']);

    }
}
