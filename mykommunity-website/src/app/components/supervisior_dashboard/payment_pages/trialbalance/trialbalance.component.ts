import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-trialbalance',
  templateUrl: './trialbalance.component.html',
  styleUrls: ['./trialbalance.component.css']
})
export class TrialbalanceComponent implements OnInit {
  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;


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
    name: ['', Validators.required],
    date: ['', Validators.required],
    dueDate: ['', Validators.required],
    namef: ['', Validators.required],
    date1: ['', Validators.required],
    dueDate1: ['', Validators.required],
    name12: ['', Validators.required],
    date12: ['', Validators.required],
    dueDate12: ['', Validators.required],
    items: this.formBuilder.array([
      this.formBuilder.group({
        name: ['', Validators.required],
        quantity: ['', Validators.required],
        namef: ['', Validators.required],
        price: ['', Validators.required]
      })
    ])
  });
   
  }
  back(){
    this._location.back();
  }
  invoice(){
    this.router.navigate(['/supervisor/paymentdashboard/vendorbooking']);
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






