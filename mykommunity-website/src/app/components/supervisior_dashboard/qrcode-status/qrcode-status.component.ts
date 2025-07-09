import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-qrcode-status',
  templateUrl: './qrcode-status.component.html',
  styleUrls: ['./qrcode-status.component.css']
})
export class QrcodeStatusComponent {
  @ViewChild('printSection', { static: false }) printSection!: ElementRef;

  closeResult: any;
  form: any = FormGroup;
  totalLength: any;
  page: number = 1;
  readData: any = [];
  getparamid: any;
  role = sessionStorage.getItem('role');
  selectedQRCode: any;

  constructor(
    private service: ApiService,
   
    private _location: Location
  ) {}
   
  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.service.getQRScanCodeRecord().subscribe((res: { data: string | any[]; }) => {
      this.readData = res.data;
      this.readData.sort((a: any, b: any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      this.totalLength = res.data.length;
    });
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'SCANNED':
        return 'verified';
      case 'CREATED':
        return 'add_circle';
      case 'UPDATED':
        return 'update';
        case 'DAILY_HELP_PROVIDER_CREATED':
        return 'add_circle';
     
      default:
        return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      
      case 'SCANNED':
        return 'green';
      case 'CREATED':
        return 'darkcyan';
      case 'UPDATED':
        return 'rgb(213, 77, 100)';
      default:
        return '';
    }
  }


  back() {
    this._location.back();
  }
}

