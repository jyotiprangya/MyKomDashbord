import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-latefee',
  templateUrl: './latefee.component.html',
  styleUrls: ['./latefee.component.css']
})
export class LatefeeComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;
  closeResult: any;
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  disable = false;
  checked2 = false;
  indeterminate2 = false;
  labelPosition2: 'before' | 'after' = 'after';

  constructor(
    private service:ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
     private modalService: NgbModal,
      private _location: Location) { }

  readData2:any = []; 
  readData:any = []; 
  readData3:any = []; 
  readData4:any = []; 

  getparamid:any;

  totalLength:any;
  page:number = 1; 
  map: any ={
    false: "debit",
    true: "credit"
  }
 
  // labelPosition: '1' | '2' = '2';
  isCredit: boolean = true; // Initial value, can be true or false


   

  ngOnInit(): void {
  this.getAllData();
  this.getAllAccountData();
  this.getAllcashtransferData();
  this.getAllchequetransferData();
  
  // const stringValue = 'true'; // or 'false'

  // // Using JSON.parse()
  // const booleanValue= JSON.parse(stringValue.toLowerCase());
  
  // // Using a comparison
  // //const booleanValue = (stringValue.toLowerCase() === 'true');
  
  // console.log(booleanValue); 

  this.form = this.formBuilder.group({
    type: ['fixed', Validators.required],
    transactionDate: ['', Validators.required],
    fromAccount: [''],
    toAccount: ['', Validators.required],
    chequeDate: [''],
    chequeNumber: ['N/A'],
    description: ['', Validators.required],
    reference: ['', Validators.required],
    amount: ['', Validators.required],
    credit: [false, Validators.required],
    debit: [false, Validators.required],
    
  });
   
  }

  // updateCreditValue(value: boolean) {
  //   // this.form.patchValue({ credit: value });
  //   var creditvalue=JSON.parse(this.form.value.credit);
  //   console.log(creditvalue);
  // }

  // updateDebitValue(value: boolean) {
  //   this.form.patchValue({ debit: value });
  // }
  // onRadioButtonChange(event: any) {
  //   this.isCredit = event.target.value === 'credit';
  // }

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
    this.service.getcash_cheque_transfer().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData2 = res.data;
      this.totalLength = (res.data).length;

    });
  }
  getAllcashtransferData(){
    this.service.getcash_transfer().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData4 = res.data;
      this.totalLength = (res.data).length;

    });
  }
  getAllchequetransferData(){
    this.service.getcheque_transfer().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData3 = res.data;
      this.totalLength = (res.data).length;

    });
  }

  getAllAccountData(){
    this.service.getSocietyAccount().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
     
    });
  }

  saveDetails(form:any) {
    console.log(this.form.value);
    // console.log(JSON.parse(this.form.value.credit));
    // console.log(JSON.parse(this.form.value.debit));


    {
      console.log(this.form.value);
      this.service.createcash_cheque_transfer(this.form.value).subscribe((res)=>{
        console.log(res,'res==>');
        this.form.reset();
        this.getAllData();
      });
    }
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






