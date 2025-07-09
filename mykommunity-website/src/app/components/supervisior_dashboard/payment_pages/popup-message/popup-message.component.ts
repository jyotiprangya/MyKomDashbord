import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.css']
})
export class PopupMessageComponent {

  constructor(public activeModal: NgbActiveModal,private router: Router) {}

  closePopup() {
    this.activeModal.close('Close button clicked');
  }
  onYesClick(){
    this.router.navigate(['/supervisor/dashboard']);
  }
}
