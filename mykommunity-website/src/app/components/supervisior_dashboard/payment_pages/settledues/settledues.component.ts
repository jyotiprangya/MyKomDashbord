import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-settledues',
  templateUrl: './settledues.component.html',
  styleUrls: ['./settledues.component.css']
})
export class SettleduesComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;
id:any;

  constructor(
    private service:ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
     private modalService: NgbModal,
     private route: ActivatedRoute,
      private _location: Location) { }

  readData2:any = []; 
  readData:any = []; 
  readData3:any = []; 


  showScreen = false;

  showScreen2 = false;
  showScreen3 = false;
  totalLength:any;
  page:number=1;



   

  ngOnInit(): void {
    this.id=this.route.snapshot.params['id'];
    console.log(this.id);
    
  this.getAllAccountData();
  this.getAllrentalidData();
  
  this.form = this.formBuilder.group({
    paymentMode: [''],
    date: ['', Validators.required],
    amount: ['', Validators.required],
    accountId: ['', Validators.required],
    chequeNo: ['', Validators.required],
    description: [''],
    reference: [''],
    attachment: [''],

   
  });
   
  }
  back(){
    this._location.back();
  }
  receipt(){
    this.router.navigate(['/supervisor/paymentdashboard/receipt']);
  }
  getAllrentalidData(){
    this.service.getrental_transaction().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData3 = res.data.filter((transaction:any) => transaction.RentalTrasactionID === this.id);
      console.log(this.readData3);
      console.log(res.data[0].paymentMode);

      this.totalLength = (res.data).length;
      this.form.controls['paymentMode'].setValue(this.readData3[0].paymentMode);
      this.form.controls['date'].setValue(this.readData3[0].date);
      this.form.controls['amount'].setValue(this.readData3[0].amount);
      this.form.controls['accountId'].setValue(this.readData3[0].accountId);
      this.form.controls['description'].setValue(this.readData3[0].description);
      this.form.controls['reference'].setValue(this.readData3[0].reference);

     
    });
  }
 
  getAllAccountData(){
    this.service.getSocietyAccount().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData2 = res.data;
    
    });
  }
  getAllData(){
    this.service.getrental_transaction().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData = res.data;
    
    });
  }


  createReceipt(billingId:any,rentalUnitId:any,RentalTrasactionID:any) {
    console.log(RentalTrasactionID);
    console.log(billingId);
    console.log(rentalUnitId);


    const result = window.confirm('Are you sure you want to generate Receipt against this intimation?');
    if (result) {
      console.log('confirmed');
    {
      console.log({
        "rentalUnitId":rentalUnitId,
        "billingId":billingId,
        "RentalTrasactionID":RentalTrasactionID
      });
      this.service.createrental_transaction(
        {
          "rentalUnitId":rentalUnitId,
          "billingId":billingId,
          "RentalTrasactionID":RentalTrasactionID
        }).subscribe((res)=>{
        console.log(res,'res==>');
        alert(res.message);
        this.router.navigate(['/supervisor/paymentdashboard/payment']);

       // this.form.reset();
      },(error) => {
        alert(error.data.message);
        console.error('Error:', error);
        // You can show an error message to the user if needed
      });
    }
  }else {
   // this.form.reset();
    console.log('Delete canceled');
  }
  }
  cancelIntimation(billingId:any,RentalTrasactionID:any,rentalUnitId:any) {
    console.log(RentalTrasactionID);
    console.log(billingId);


    const result = window.confirm('Are you sure you want to cancel this intimation?');
    if (result) {
      console.log('confirmed');
    {
      console.log({
        "billingId":billingId,
        "RentalTrasactionID":RentalTrasactionID,
        "rentalUnitId":rentalUnitId

      });
      this.service.cancelIntimation(
        {
          "billingId":billingId,
          "RentalTrasactionID":RentalTrasactionID,
          "rentalUnitId":rentalUnitId
        }).subscribe((res)=>{
        console.log(res,'res==>');
        alert(res.message);
        this.router.navigate(['/supervisor/paymentdashboard/payment']);

       // this.form.reset();
      },(error) => {
        alert(error.data.message);
        console.error('Error:', error);
        // You can show an error message to the user if needed
      });
    }
  }else {
   // this.form.reset();
    console.log('Delete canceled');
  }
  }
  checkBounce(billingId:any,RentalTrasactionID:any,rentalUnitId:any) {
    console.log(RentalTrasactionID);
    console.log(billingId);


    const result = window.confirm('Are you sure you want to cancel this intimation?');
    if (result) {
      console.log('confirmed');
    {
      console.log({
        "billingId":billingId,
        "RentalTrasactionID":RentalTrasactionID,
        "rentalUnitId":rentalUnitId
      });
      this.service.checkbounce(
        {
          "billingId":billingId,
          "RentalTrasactionID":RentalTrasactionID,
          "rentalUnitId":rentalUnitId
        }).subscribe((res)=>{
        console.log(res,'res==>');
        alert(res.message);
        this.router.navigate(['/supervisor/paymentdashboard/payment']);

       // this.form.reset();
      },(error) => {
        alert(error.data.message);
        console.error('Error:', error);
        // You can show an error message to the user if needed
      });
    }
  }else {
   // this.form.reset();
    console.log('Delete canceled');
  }
  }
//   togglePerOne(){ 
//     if (this.allSelected.selected) {  
//      this.allSelected.deselect();
//      //return false;
//  }
//    if(this.searchUserForm.controls.userType.value.length==this.readData2.length)
//      this.allSelected.select();
 
//  }
//    toggleAllSelection() {
//      if (this.allSelected.selected) {
//        this.searchUserForm.controls.userType
//          .patchValue([...this.readData2.map((item: { name: any; }) => item.name), 0]);
//      } else {
//        this.searchUserForm.controls.userType.patchValue([]);
//      }
//    }
}



