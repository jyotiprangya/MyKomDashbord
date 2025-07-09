import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-society-details',
  templateUrl: './society-details.component.html',
  styleUrls: ['./society-details.component.css']
})
export class SocietyDetailsComponent implements OnInit {
  closeResult: any;
  closeResult2: any;

  SOCIETY_ADMIN = 'SOCIETY_ADMIN';
  SOCIETY_ADMIN_DISPLAY = 'SOCIETY_ADMIN_DISPLAY';

  map: any ={
    "SOCIETY_ADMIN": "ADMIN PRIVILEGE",
    "SOCIETY_ADMIN_DISPLAY": "DISPLAY PRIVILEGE"
  }
  form:any= UntypedFormGroup;
  form2:any= UntypedFormGroup;

  constructor(private service:ApiService,private modalService: NgbModal,private fb: UntypedFormBuilder, private _location: Location) { }
  role=sessionStorage.getItem('role');

  totalLength:any;
  page:number = 1;
  readData:any = {};
  readData2:any = [];
  getparamid:any;
  showImage = false;
  showparcelImage = false;
  searchActivity:any = "";
  societyId=sessionStorage.getItem('societyId');

  filteredData:any = []; // Data to be displayed in the table
  city: string | undefined;
  state!: string;
  id!: string;
  createdAt!: string;
  updatedAt!: string;
  cityId!: string;
  name!: string;
  societyName!: string;
  pinCode!: number;
  builderName!: string;
  disabled!: boolean;
  address!: string;
  pan!: string;
  gst!: string;
  stateId!: string;
  images!: any[];

  ngOnInit(): void {
   this.getAllData();
   this.getSocietyAdminData();

   this.form = this.fb.group({
    name: [null, [Validators.required, Validators.maxLength(30)]],
    pinCode: [0, [Validators.required]],
    builderName: [null, [Validators.required]],
    address: [null, [Validators.required]],
    panId:[null],
    gst:[null]
   
  });
 this.form2 = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("^[A-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      mobileNumber: [null, [Validators.required, Validators.minLength(10)]],
      societyId: [this.societyId, [Validators.required]],
    
    });
   


}

getAllData(){
  
  this.service.getSocietyDetails().subscribe((res)=>{
    console.log(res,"res==>");
    const responseData = res.data;
    
    // Access individual properties from the response
    this.city = responseData.city;
    this.state = responseData.state;
    this.id = responseData.id;
    this.createdAt = responseData.createdAt;
    this.updatedAt = responseData.updatedAt;
    this.cityId = responseData.cityId;
    this.name = responseData.name;
    this.societyName = responseData.societyName;
    this.pinCode = responseData.pinCode;
    this.builderName = responseData.builderName;
    this.disabled = responseData.disabled;
    this.address = responseData.address;
    this.pan = responseData.pan;
    this.gst = responseData.gst;
    this.stateId = responseData.stateId;

    // Store the images array
    this.images = responseData.images;

    // If you need to work with the entire response data
   // this.readData = responseData;
    // this.totalLength = (res.data).length;
  });
}




back(){
  this._location.back();
}
open(content: any) {
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;

  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

  });
}

open2(content2: any) {
  this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult2 = `Closed with: ${result}`;

  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason2(reason)}`;

  });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
   // //location.reload();
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
   // //location.reload();
    return 'by clicking on a backdrop';
  } else {
   // //location.reload();
    return `with: ${reason}`;
  }

}
private getDismissReason2(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    ////location.reload();
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
   // //location.reload();
    return 'by clicking on a backdrop';
  } else {
   // //location.reload();
    return `with: ${reason}`;
  }

}

getSocietyAdminData(){
  this.service.getstafflist().subscribe((res)=>{
    console.log(res,"res==>");
    this.readData = res.data;
  
  });
}

onImageError(event: any) {
  event.target.src = 'assets/logo.jpg';
  
}


OnEdit(){
   
  this.getparamid = this.id;
  console.log(this.getparamid);

  this.form.controls['name'].setValue(this.societyName);
  this.form.controls['pinCode'].setValue(this.pinCode);
  this.form.controls['builderName'].setValue(this.builderName);
  this.form.controls['address'].setValue(this.address);
  this.form.controls['panId'].setValue(this.pan);
  this.form.controls['gst'].setValue(this.gst);
 }
 societyUpdate(){
  //this.societyId= localStorage.getItem('societyId');

   console.log(this.getparamid);
   //console.log(this.societyId);
   const result = window.confirm('Are you sure you want to change Society details?');
   if (result) {
     console.log('confirmed');
   { 
    console.log(  {
      id:this.getparamid,
      name:this.form.value.name,
      pinCode:this.form.value.pinCode,
      builderName:this.form.value.builderName,
      address:this.form.value.address,
      gst:this.form.value.gst,
      panId:this.form.value.panId,
    
    });
    
     this.service.updateSociety(
      {
        id:this.getparamid,
        name:this.form.value.name,
        pinCode:this.form.value.pinCode,
        builderName:this.form.value.builderName,
        address:this.form.value.address,
        gst:this.form.value.gst,
        panId:this.form.value.panId,
      
      } ).subscribe((res)=>{
       confirm( 'Updated Successfully...');
       this.getAllData();
     },(error) => {
      alert(error.error.message);
      console.error('Error:', error);
    });
   }
  }else {
    this.form.reset();
    console.log('Delete canceled');
  }
 }


 saveDetails() {
  const result = window.confirm('Are you sure you want to add Society Admin?');
   if (result) {

    console.log(this.form2.value);
    this.service.createSocietyStaff(
      {
     firstName:this.form2.value.firstName,
     lastName:this.form2.value.lastName,
     role:this.form2.value.role,
     email:this.form2.value.email.toLowerCase(),
     mobileNumber:this.form2.value.mobileNumber,
     societyId:this.form2.value.societyId
         }).subscribe((res)=>{
      console.log(res,'res==>');
      alert( 'Staff added Successfully...');
      this.getSocietyAdminData();
      this.form2.reset();
    }, (error) => {
     // Handle API errors or other issues here
     console.error("Error:", error);
    alert(error.error.message);
    
   });
  }else {
    this.form2.reset();
    console.log('Delete canceled');
  }
 }
  

}

