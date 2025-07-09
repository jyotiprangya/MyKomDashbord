import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-success-message',
  templateUrl: './success-message.component.html',
  styleUrls: ['./success-message.component.css']
})
export class SuccessMessageComponent {
  @Input()
  message!: string;

  constructor(public activeModal: NgbActiveModal) {}

  closePopup() {
    this.activeModal.close('Close button clicked');
  }
}
