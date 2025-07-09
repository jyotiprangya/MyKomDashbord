import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-message',
  templateUrl: './popup-message.component.html',
  styleUrls: ['./popup-message.component.css']
})
export class PopupMessageComponent  {
  @Input()
  message!: string;

  constructor(public activeModal: NgbActiveModal) {}

  closePopup() {
    this.activeModal.close('Close button clicked');
  }
}
