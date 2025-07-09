import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-budgetdetails',
  templateUrl: './budgetdetails.component.html',
  styleUrls: ['./budgetdetails.component.css']
})
export class BudgetdetailsComponent implements OnInit {

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

  // selectFinancialYear(year: string) {
  //   // Handle the selected financial year
  //   console.log('Selected Financial Year:', year);
  //   // You can perform any additional logic or actions here
  // }

  selectedYear: string = '2021-2022';

  selectFinancialYear(year: string) {
    this.selectedYear = year;
  }
  selectedPeriod: string = 'Annual';

  selectBudgetPeriod(period: string) {
    this.selectedPeriod = period;
  }
  back(){
    this._location.back();
  }
  budgetreport(){
    this.router.navigate(['/supervisor/paymentdashboard/budgetreport']);
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





