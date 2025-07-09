import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';



@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  closeResult: any;
  form:any= UntypedFormGroup;
  form2:any= UntypedFormGroup;
  hide = true;
  selectedValue:any;
  SOCIETY_ADMIN = 'SOCIETY_ADMIN';
  SOCIETY_ADMIN_DISPLAY = 'SOCIETY_ADMIN_DISPLAY';
  searchTerm: string = '';
filteredData: any[] = [];

  constructor
  (private service:ApiService,
    private fb: UntypedFormBuilder,
     private modalService: NgbModal, 
     private _location: Location)
   { }

  totalLength:any;
  page:number=1;
 
  readData:any = [];
  readData2:any = [];
  readRole:any = [];
  readstaff:any = [];
  showCreate! : boolean;
  showUpdate! : boolean;
  getparamid:any;
  getid:any;
  map: any ={
    0: "Inactive",
    1: "Active"
  }


  ngOnInit(): void {
      // this.getAllData();
     this.getAllComData();
   this.getAllSocietyAdminData();
     

    this.form = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      role: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("^[A-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      mobileNumber: [null, [Validators.required, Validators.minLength(10)]],
      societyId: [null, [Validators.required]],
    
    });
     this.filteredData = [...this.readData];
   
  }

  
  open(content: any) {
    this.showUpdate = false;
    this.showCreate = true;
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


 saveDetails(form:any) {
   {

     console.log(this.form.value);
     this.service.createStaff({
      firstName:this.form.value.firstName,
      lastName:this.form.value.lastName,
      role:this.form.value.role,
      email:this.form.value.email.toLowerCase(),
      mobileNumber:this.form.value.mobileNumber,
      societyId:this.form.value.societyId
     }).subscribe((res)=>{
       console.log(res,'res==>');
      
       this.form.reset();
       this.getAllSocietyAdminData();
     }, (error) => {
      // Handle API errors or other issues here
      console.error("Error:", error);
     alert(error.error.message);
     //location.reload();
      // Redirect to an error page or show a relevant error message to the user
     // this.router.navigate(['/secretaryapproval']);
    });
   }
  }
  onSearch(event: any): void {
  const searchValue = event.target.value.toLowerCase().trim();
  console.log("Search Value:", searchValue);
  
  // Update the searchTerm property
  this.searchTerm = searchValue;
  
  if (!searchValue) {
    this.filteredData = [...this.readData];
    this.totalLength = this.readData.length;
  } else {
    this.filteredData = this.readData.filter((item: any) => {
      // Add null/undefined checks for each field
      const societyName = item.societyName?.toString().toLowerCase() || '';
      const societyAddress = item.societyAddress?.toString().toLowerCase() || '';
      const societyPinCode = item.societyPinCode?.toString().toLowerCase() || '';
      const cityName = item.cityName?.toString().toLowerCase() || '';
      const firstName = item.firstName?.toString().toLowerCase() || '';
      const lastName = item.lastName?.toString().toLowerCase() || '';
      const email = item.email?.toString().toLowerCase() || '';
      const mobileNumber = item.mobileNumber?.toString().toLowerCase() || '';
      const role = item.role?.toString().toLowerCase() || '';
      
      return societyName.includes(searchValue) ||
             societyAddress.includes(searchValue) ||
             societyPinCode.includes(searchValue) ||
             cityName.includes(searchValue) ||
             firstName.includes(searchValue) ||
             lastName.includes(searchValue) ||
             email.includes(searchValue) ||
             mobileNumber.includes(searchValue) ||
             role.includes(searchValue);
    });
    
    this.totalLength = this.filteredData.length;
  }
  
  // Reset to first page after search
  this.page = 1;
}


  getAllSocietyAdminData(){
    this.service.getAdminList().subscribe((res)=>{
       console.log(res, "res==>");
    this.readData = res.data;
    this.filteredData = [...this.readData]; // ✅ important!
    this.totalLength = this.filteredData.length;
    
    });
  }
  getAllComData(){
    this.service.getCommunities().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData2 = res.data;
      this.totalLength = (res.data).length;
    });
  }

 OnEdit(us:any,form:any){
 
  this.getparamid = us.id;
  console.log(this.getparamid);

  this.form.controls['first_name'].setValue(us.first_name);
  this.form.controls['last_name'].setValue(us.last_name);
  this.form.controls['email'].setValue(us.email);
  this.form.controls['password'].setValue(us.password);
  this.form.controls['phone'].setValue(us.phone);
  this.form.controls['community_id'].setValue(us.community_name);
  this.form.controls['date_joined'].setValue(us.date_joined);
  this.form.controls['is_active'].setValue(us.is_active);
 }
//  userUpdate(){
//    console.log(this.getparamid);
//    console.log(this.form.value,'updated');
//    if(this.form.valid)
//    {
     
//      this.service.updateData(this.getparamid,this.form.value ).subscribe((res)=>{
//        alert( 'Updated Successfully...');
//        this.form.reset();
//        this.getAllData(); 
//      });
//    }
//  }
 

  

  
} 



