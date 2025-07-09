import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})
export class CityComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  constructor(private service:ApiService,private fb: UntypedFormBuilder, private modalService: NgbModal, private _location: Location) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  stateData:any = [];
  getparamid:any;
  
  ngOnInit(): void {
    this.getAllCityData();
    this.getAllStateData();

    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      stateId: [null, [Validators.required]]

    });

  }

  getAllStateData(){
    this.service.getState().subscribe((res)=>{
      console.log(res,"res==>");
      this.stateData = res.data;
    
    });
  }

  getAllCityData(){
    this.service.getCities().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
      this.totalLength = (res.data).length;
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
 

saveDetails(form:any) {
 
  if(this.form.valid)
  {
    console.log(this.form.value);
    this.service.createCity(this.form.value).subscribe((res)=>{
      console.log(res,'res==>');
      this.form.reset();
      this.getAllCityData();
    });
  }
}


OnEdit(us:any,form:any){
   
  this.getparamid = us.id;
  console.log(this.getparamid);

  this.form.controls['name'].setValue(us.city);
  this.form.controls['stateId'].setValue(us.stateId);

 }
 cityUpdate(){
  //this.societyId= localStorage.getItem('societyId');
console.log(this.form.value.stateId);
   console.log(this.getparamid);
   //console.log(this.societyId);
   console.log({id:this.getparamid,name:this.form.value.name,stateId:this.form.value.stateId});

   const result = window.confirm('Are you sure you want to change City details?');
   if (result) {
     console.log('confirmed');
   {

     this.service.updateCity({id:this.getparamid,name:this.form.value.name,stateId:this.form.value.stateId} ).subscribe((res)=>{
       confirm( 'Updated Successfully...');
      // //location.reload();
//console.log({id:this.getparamid,name:this.form.value.name,stateId:this.form.vaue.stateId});
         this.getAllCityData();
     },(error) => {
      alert(error.error.message);
      console.error('Error:', error);
      // You can show an error message to the user if needed
    });
   }
  }else {
    this.form.reset();
    console.log('Delete canceled');
  }
 }
 
//  CityUpdate(){
//    console.log(this.getparamid);
//    console.log(this.form.value,'updated');
//    if(this.form.valid)
//    {
     
//      this.service.updateCity(this.getparamid,this.form.value ).subscribe((res)=>{
//        alert( 'Updated Successfully...');
       
//          this.getAllCityData();
//      });
//    }
//  }
 



}

