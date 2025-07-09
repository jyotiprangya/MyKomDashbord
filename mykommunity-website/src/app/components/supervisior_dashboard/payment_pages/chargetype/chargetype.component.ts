import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-chargetype',
  templateUrl: './chargetype.component.html',
  styleUrls: ['./chargetype.component.css']
})
export class ChargetypeComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;
  constructor(private service:ApiService,private fb: UntypedFormBuilder, private modalService: NgbModal, private _location: Location) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  getparamid:any;
  societyId=sessionStorage.getItem('societyId');
  map: any ={
    true: "Inactive",
    false: "Active"
  }

  ngOnInit(): void {
   this.getAllData();
   this.getAllComData();

  this.form = this.fb.group({
    type: [null]
  });

}

getAllData(){
  
  this.service.getChargeType().subscribe((res)=>{
    console.log(res,"res==>");
    this.readData = res.data;
    this.totalLength = (res.data).length;
  });
}
getAllComData(){
  this.service.getCommunities().subscribe((res)=>{
    console.log(res,"res==>");
    this.readData2 = res.data;
  
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
  //this.societyId= sessionStorage.getItem('societyId');

  console.log(this.form.value);
  this.service.createChargeType({type:this.form.value.type,societyId:this.societyId}).subscribe((res)=>{
    console.log(res,'res==>');
    this.loading = false;
    this.form.reset();
    this.getAllData();
  });
 }
}


OnEdit(us:any,form:any){
   
  this.getparamid = us.id;
  console.log(this.getparamid);

  this.form.controls['name'].setValue(us.name);
 }
 BlockUpdate(){
  //this.societyId= sessionStorage.getItem('societyId');

   console.log(this.getparamid);
   console.log(this.societyId);

   if(this.form.valid)
   {
    
     
     this.service.updateBlock({id:this.getparamid,name:this.form.value.name,societyId:this.societyId} ).subscribe((res)=>{
       confirm( 'Updated Successfully...');
       this.loading = false;
         this.getAllData();
     });
   }
 }
 




}
