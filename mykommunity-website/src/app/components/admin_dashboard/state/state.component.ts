import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { useAnimation } from '@angular/animations';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
  closeResult: any;
  form:any= UntypedFormGroup;
  constructor(private service:ApiService,private fb: UntypedFormBuilder, private modalService: NgbModal, private _location: Location) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  getparamid:any;
  map: any ={
    true: "Inactive",
    false: "Active"
  }
  
  ngOnInit(): void {
    this.getAllStateData();

    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
    });

  }

  getAllStateData(){
    this.service.getState().subscribe((res)=>{
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

  UpdateButton(us:any){
    this.getparamid = us.id;
    console.log(this.getparamid);
    
     if(this.map[us.disabled] === 'Active')
     
     {
      console.log(this.map[us.disabled]);
      this.service.enableState(this.getparamid).subscribe((res)=>{
        console.log(res,'res==>');
        alert( 'Updated Successfully...');
  
    
     console.log(this.map[us.disabled]);
     this.map[us.disabled]; 
     this.getAllStateData();
     
    
      });
  
  }
  else
  {
    console.log(this.map[us.disabled]);
   this.service.enableState(this.getparamid).subscribe((res)=>{
    console.log(res,'res==>');
     alert( 'Updated Successfully...');
  
  console.log(this.map[us.disabled]); 
  this.getAllStateData();
  
   });
  
  }
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
    this.service.createState(this.form.value).subscribe((res)=>{
      console.log(res,'res==>');
      this.form.reset();
      this.getAllStateData();
    });
  }
}



OnEdit(us:any,form:any){
   
  this.getparamid = us.id;
  console.log(this.getparamid);

  this.form.controls['name'].setValue(us.name);
 
 }


 
 StateUpdate(){
   console.log(this.getparamid);
   console.log(this.form.value,'updated');
   if(this.form.valid)
   {
    
     this.service.updateState({name:this.form.value.name, id:this.getparamid} ).subscribe((res)=>{
       alert( 'Updated Successfully...');
       
         this.getAllStateData();
     });
   }
 }
 //{name: from line 124,id: line 121}



}