import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.css']
})
export class QrcodeComponent {
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
    private fb: FormBuilder,
    private modalService: NgbModal,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.getAllData();
  }

  getAllData() {
    this.service.getQRCodeRecord().subscribe((res) => {
      this.readData = res.data;
      this.readData.sort((a: any, b: any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      this.totalLength = res.data.length;
    });
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

  printRow(qrCodeData: any) {
    this.selectedQRCode = qrCodeData;
    setTimeout(() => {
      const printContents = this.printSection.nativeElement.innerHTML;
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print QRCode Details</title></head><body>');
        printWindow.document.write(printContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      }
    }, 100);
  }

  addQRCode() {
    if (window.confirm('Are you sure you want to add a New QRCode?')) {
      this.service.createQRCode({}).subscribe(
        (res) => {
          alert('QRCode Generated Successfully...');
          this.getAllData();
        },
        (error) => {
          alert('Error while generating QRCode');
          console.error('Error:', error);
        }
      );
    }
  }

  back() {
    this._location.back();
  }
}
