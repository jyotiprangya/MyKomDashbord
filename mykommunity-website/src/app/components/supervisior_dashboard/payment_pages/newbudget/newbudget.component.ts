import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-newbudget',
  templateUrl: './newbudget.component.html',
  styleUrls: ['./newbudget.component.css']
})
export class NewbudgetComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;
  loading = false;


  constructor(
    private service:ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private _location: Location
    ) { }

  readData2:any = []; 
  
  ngOnInit(): void {
  this.getAllCOAData();
  

  this.searchUserForm = this.formBuilder.group({
    userType: new UntypedFormControl('')
  });

  this.form = this.formBuilder.group({
    budgetName: ['', Validators.required],
    financialYear: ['', Validators.required],
    budgetPeriod: ['', Validators.required],
    chartOfAccountId: ['', Validators.required],
    amount: [0, Validators.required]
    
  });
   
  }
  back(){
    this._location.back();
  }
  budget(){
    this.router.navigate(['/supervisor/paymentdashboard/budget']);
  }
  

   
  getAllCOAData(){
    this.service.getChartOfAccount().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData2 = res.data;
    
    });
  }

  saveDetails(form:any) {
    console.log(this.form.value);
    const result = window.confirm('Are you sure you want to add this Budget?');
  if (result) {
    this.loading = true;

    console.log('confirmed');
     if(this.form.valid)
     {
       console.log(this.form.value);
       this.service.createsocity_budget(this.form.value).subscribe((res)=>{
         console.log(res,'res==>');
         this.loading = false;
         this.form.reset();
         this.onCancelClick();
       });
     }
    }else {
      this.loading = false;
      this.form.reset();
      this.onCancelClick();
      console.log('Delete canceled');
    }
   }
   
   onCancelClick(){
   
    this.form.reset();
    

   
  }
}




