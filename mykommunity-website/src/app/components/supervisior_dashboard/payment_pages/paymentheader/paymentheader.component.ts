import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupMessageComponent } from '../popup-message/popup-message.component';

@Component({
  selector: 'app-paymentheader',
  templateUrl: './paymentheader.component.html',
  styleUrls: ['./paymentheader.component.css']
})
export class PaymentheaderComponent implements OnInit, OnDestroy {
  @Output() toggleSidebarForMe: EventEmitter <any> = new EventEmitter();
  isExpanded: boolean = false;
  sideBarOpen = true;
  closeResult: any;

  formData: any;
  

  constructor(private router: Router, private modalService: NgbModal, ) { }

   lastName:any;
   firstName:any;
   societyImage:any;
   societyName:any;

   //currentDate:any;
   currentDate: string = '';

   private interval: any;
  ngOnInit() {
    this.updateDateTime();
    this.interval = setInterval(() => {
      this.updateDateTime();
    }, 1000);

    this.firstName = sessionStorage.getItem('firstName');
    this.lastName = sessionStorage.getItem('lastName');
      this.societyImage = sessionStorage.getItem('societyImage');
      this.societyName = sessionStorage.getItem('societyName');


  
  }
  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
  toggleSidebar(){
    this.toggleSidebarForMe.emit();

  }
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
backtoDash(){
  this.modalService.open(PopupMessageComponent);
}
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
    // //location.reload();

      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    // //location.reload();

      return 'by clicking on a backdrop';
    } else {
    // //location.reload();

      return `with: ${reason}`;
    }

  }  
 
  private updateDateTime(): void {
    const now = new Date();
    // this.currentDate = now.toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric", timeZoneName: "short" });
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
  //now on the other component , where you want to get the user name 
//to get user crdentials from the local storage 
 
//declare one more variable on other class where you want to sh 
//public userName:string 
//this.userName:string=userCredentials.userName; 
 
home() {
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

  // Perform any additional logout operations (e.g., clearing cookies, session data, etc.)
  // ...

  // Redirect to the home page
  // window.location.href = '/home';
  this.router.navigate(['/home']);


}
}
