import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators, UntypedFormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, finalize } from 'rxjs';

@Component({
  selector: 'app-addvendorbooking',
  templateUrl: './addvendorbooking.component.html',
  styleUrls: ['./addvendorbooking.component.css']
})
export class AddvendorbookingComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;
  loading = false;
  message: any;


  constructor(
    private service:ApiService,
    private router: Router,
    private fb: UntypedFormBuilder,
     private modalService: NgbModal,
      private _location: Location,
      private af:AngularFireStorage
      ) { }

  readData2:any = []; 
  readData3:any = []; 

  showScreen = false;

  showScreen2 = false;
  showScreen3 = false;

  quizForm!: UntypedFormGroup;
  questions!: UntypedFormArray;

  items: any[] = [];
  downloadURL: Observable<string> | undefined;

   

  ngOnInit(): void {
  this.getAllData();
  this.getAllvendorList();
  this.getAllAccountData();
  
  // this.quizForm = this.formBuilder.group({
  //   questions: this.formBuilder.array([]),
  //   questions2: this.formBuilder.array([]),
  // });
  // this.searchUserForm = this.formBuilder.group({
  //   userType: new FormControl('')
  // });

  this.form = this.fb.group({
    vendorId: ['', Validators.required],
    invoiceNumber: ['', Validators.required],
    billDate: ['', Validators.required],
    expensionCreationDate: ['', Validators.required],
    dueDate: ['', Validators.required],
    image:[''],
    accountId:[''],
    description:[''],
    invoiceAmount:[''],
    advancePaid:[''],
    tds: [''],
    itemDetails: this.fb.array([
    //  this.fb.group({
    //   itemName: [''],
    //   quantity: [''],
    //   rate: [''],
    //   purchaseAccount: [''],
    //   description: [''],
    //   deduction: [''],
    //   reasonOfDeduction: [''],
    //   cgst: [''],
    //   sgst: [''],
    //   igst: [''],
    //   hsn: [''],
    //   tds: [''],
    //   images: ['']
    // })
    ])
  });

   
   
  }
  back(){
    this._location.back();
  }
  invoice(){
    this.router.navigate(['/supervisor/paymentdashboard/vendorbooking']);
  }

  users: any[] = [];

addUser(){
    this.items.push({});//push empty object of type user
}
getAllvendorList(){
  this.service.getPayment_vendor().subscribe((res)=>{
    console.log(res,"res==>");
    this.readData2 = res.data;

  });
}

removeUser(index: number) {
  this.itemDetails.removeAt(index);
}
  createItem(): UntypedFormGroup {
    return this.fb.group({
      ques: '',
    });
  }
  genField() {
    this.message = true;
    this.questions = this.quizForm.get('questions') as UntypedFormArray;
    this.questions.push(this.createItem());
  }
  get itemDetails(): UntypedFormArray {
    return this.form.get('itemDetails') as UntypedFormArray;
  }
  
  addItemDetail() {
   
    this.itemDetails.push(this.newQuantity());
  }
  newQuantity(): UntypedFormGroup {  
    return this.fb.group({
      itemName: [''],
      quantity: [''],
      rate: [''],
      itemDescription: [''],
      deduction: [''],
      reasonOfDeduction: [''],
      cgst: [''],
      sgst: [''],
      igst: [''],
      hsn: [''],
          });
  }  
     
  // addQuantity() {  
  //   this.quantities().push(this.newQuantity());  
  // } 
  removeItemDetail(index: number) {
    this.itemDetails.removeAt(index);
  }
  
  

   getAllData(){
    this.service.getFlat().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData2 = res.data;
     
    });
  }

  getAllAccountData(){
    this.service.getSocietyAccount().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData3 = res.data;

    });
  }
  saveDetails(form:any) {
 console.log(this.form.value);
  this.form.value.image = this.firebase ;
 console.log(this.form.value.image);
 console.log(this.firebase);
 const result = window.confirm('Are you sure you want to add this vendor Expense Record?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
    if(this.form.valid)
    {
      console.log(this.form.value);
      this.service.createPayment_vendor_booking(this.form.value).subscribe((res)=>{
        console.log(res,'res==>');
        this.loading = false;
        this.form.reset();
        this.getAllData();
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

   SelectedImage:any;
   media:any;
   firebase! :any;

 
   upload(event:any){
 
    
     var file = event.target.files[0];
    
     var n = Date.now();
    // const file = event.target.files[i];
    //const filePathinlocal = `${this.basePath}/${file.name}`;  
    this.media = file;
    console.log(file);
    var reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])
    reader.onload = (event:any)=>{
      this.SelectedImage = event.target.result;
    }
     const filePath = `Local_Service/${n}`;
     const fileRef = this.af.ref(filePath);
     const task = this.af.upload(`Local_Service/${n}`, file);
     task
       .snapshotChanges()
       .pipe(
         finalize(() => {
           this.downloadURL = fileRef.getDownloadURL();
           this.downloadURL.subscribe(url => {
             if (url) {
               this.firebase = url;
             }
             console.log(this.firebase);
           });
         })
       )
       .subscribe(url => {
         if (url) {
           url;
           console.log(url);
         //  console.log(this.firebase);
         }
       });
  
  
  
    }
  
    onCancelClick(){
     
      this.form.reset();
     
     
    }

}



