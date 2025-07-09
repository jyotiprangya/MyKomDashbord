import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-vendorreport',
  templateUrl: './vendorreport.component.html',
  styleUrls: ['./vendorreport.component.css']
})
export class VendorreportComponent implements OnInit {

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
      private _location: Location,
      private route: ActivatedRoute) { }

  readData2:any = []; 
  showScreen = false;

  showScreen2 = false;
  showScreen3 = false;
  responseData: any;
  data: any;
  startDate!: string;
  endDate!: string;
  vendorName:any;


   

  ngOnInit(): void {
  this.getAllData();
  this.route.queryParams.subscribe((params) => {
    if (params['data']) {
      this.data = JSON.parse(params['data']);
    
    }
    this.startDate = params['startDate'];
    this.endDate = params['endDate'];
    this.vendorName = params['vendorName'];
  });
console.log(this.data);
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
  bankreconcilation(){
    this.router.navigate(['/supervisor/paymentdashboard/bankreconcilationdetails']);
  }

   getAllData(){
    this.service.getFlat().subscribe((res)=>{
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





