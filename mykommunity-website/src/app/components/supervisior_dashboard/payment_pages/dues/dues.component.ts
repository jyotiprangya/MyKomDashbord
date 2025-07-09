import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dues',
  templateUrl: './dues.component.html',
  styleUrls: ['./dues.component.css']
})
export class DuesComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;
  closeResult: any;



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
  

  this.searchUserForm = this.formBuilder.group({
    userType: new UntypedFormControl('')
  });

  this.form = this.formBuilder.group({
    rentalUnitId: ['', Validators.required],
   
  });
   
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

  invoice(){
    //this.router.navigate(['/invoice']);//invoicetemp
    this.router.navigate(['/supervisor/paymentdashboard/invoicetemp']);//invoicetemp

  }
  showdues(){
    //this.router.navigate(['/invoice']);//invoicetemp
   // this.router.navigate(['/showdues']);//invoicetemp
   const selectedId = this.form.value.rentalUnitId;

   // Navigate to the "show-dues" route with the selected ID as a parameter
   this.router.navigate(['dues', selectedId]);
  }
  

   getAllData(){
    this.service.getFlat().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData2 = res.data;
     
    });
  }
  // getAllRentalData(){
  //   this.service.getFlat().subscribe((res)=>{
  //     console.log(res,"res==>");
  //     this.readData2 = res.data;
     
  //   });
  // }
 
}
