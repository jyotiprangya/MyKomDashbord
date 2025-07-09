import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-visitor-details-popup',
  templateUrl: './visitor-details-popup.component.html',
  styleUrls: ['./visitor-details-popup.component.css']
})
export class VisitorDetailsPopupComponent  {

  @Input()
  message!: any[]; 

  getStatusColor(status: string): string {
    switch (status) {
      case 'PRE_APPROVED':
        return 'green';
      case 'ALLOWED_ENTRY':
        return 'rgb(195, 135, 23)';
      case 'EXITED':
        return 'darkcyan';
      case 'RECEIVED_AT_GATE':
        return 'rgb(213, 77, 100)';
        case 'APPROVED':
          return 'green';
        case 'PENDING_APPROVAL':
          return 'rgb(105, 135, 23)';
        case 'COLLECTED':
          return 'blue';
        case 'DENIED':
          return 'red';
      default:
        return '';
    }
  }
  getStatusIcon(status: string): string {
    switch (status) {
      case 'PRE_APPROVED':
        return 'verified';
      case 'ALLOWED_ENTRY':
        return 'login';
      case 'EXITED':
        return 'logout';
      case 'RECEIVED_AT_GATE':
        return 'shopping_cart';
        case 'APPROVED':
        return 'check_circle';
      case 'PENDING_APPROVAL':
        return 'alarm';
      case 'COLLECTED':
        return 'add_task';
      case 'DENIED':
        return 'error_outline';
      default:
        return '';
    }
  }

 
  constructor(public activeModal: NgbActiveModal) {}

  ngOnChanges() {
    console.log('Message received in modal:', this.message);
  }

  closePopup() {
    this.activeModal.close('Close button clicked');
  }
}
