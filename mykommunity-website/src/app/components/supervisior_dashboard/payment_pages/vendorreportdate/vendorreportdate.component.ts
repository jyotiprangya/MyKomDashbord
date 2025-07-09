import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-vendorreportdate',
  templateUrl: './vendorreportdate.component.html',
  styleUrls: ['./vendorreportdate.component.css']
})
export class VendorreportdateComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;
  closeResult: any;
  responseData: any;


  constructor(
    private service:ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
     private modalService: NgbModal,
      private _location: Location) { }

  readData2:any = []; 
  showScreen = false;

  showScreen2 = false;
  showScreen3 = false;



   

  ngOnInit(): void {
  this.getAllData();
  

  this.form = this.formBuilder.group({
    vendorId: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
   
  });
  // const params = {
  //   vendorId: this.form.value.vendorId,
  //   startDate: this.form.value.startDate,
  //   endDate: this.form.value.endDate
  // };
  // this.service.getPayment_vendor_booking_report(params).subscribe(
  //   (response) => {
  //     this.responseData = response;
  //     console.log('Response:', this.responseData);
  //   },
  //   (error) => {
  //     console.error('Error:', error);
  //   }
  // );

  }
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  back(){
    this._location.back();
  }

  

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }

  }

  onSubmit() {
    if (this.form.valid) {
      const params = this.form.value;
      this.service.getPayment_vendor_booking_report(params).subscribe(
        (response) => {
          // Store the response data in a service or shared variable
          console.log('Response:', response);
console.log(response.data[0].vendorName);
          // Navigate to the DataDisplayComponent
          
        this.router.navigate(['/supervisor/paymentdashboard/vendorreport'], {
          queryParams: {
            data: JSON.stringify(response),
            startDate: params.startDate,
            endDate: params.endDate,
            vendorName:response.data[0].vendorName
            
           
          }
         });
      },
        (error) => {
          console.error('Error:', error);
        }
      );
    }
  }
  vendorreport(){
    this.router.navigate(['/supervisor/paymentdashboard/vendorreport']);
  }

   getAllData(){
      this.service.getPayment_vendor().subscribe((res)=>{
        console.log(res,"res==>");
        this.readData2 = res.data;
    
      });
    }
    
  togglePerOne(){ 
    if (this.allSelected.selected) {  
     this.allSelected.deselect();
     //return false;
 }
   if(this.searchUserForm.controls.userType.value.length==this.readData2.length)
     this.allSelected.select();
 
 }
   toggleAllSelection() {
     if (this.allSelected.selected) {
       this.searchUserForm.controls.userType
         .patchValue([...this.readData2.map((item: { name: any; }) => item.name), 0]);
     } else {
       this.searchUserForm.controls.userType.patchValue([]);
     }
   }
}




