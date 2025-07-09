import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-secretaryapproval',
  templateUrl: './secretaryapproval.component.html',
  styleUrls: ['./secretaryapproval.component.css']
})
export class SecretaryapprovalComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  id: any;
  selectedBlock: any = {
    id:0, block_name:''
  };
  floor: any;
  constructor(private service:ApiService,private fb: UntypedFormBuilder, private modalService: NgbModal, private _location: Location) { }
  getparamid:any;

  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  readData3:any = [];
  readData4:any = [];
  societyId=sessionStorage.getItem('societyId');

  
  ngOnInit(): void {
    this.getAllflatData();
    this.getAllData();
    this.getAllhousetypeData();
    

    this.form = this.fb.group({
      flatId: [null],
      area:[null],
      credit: [''],
      debit: [''],
      houseTypeId: [null]

    });

  }

  get debitControl() {
    return this.form.get('debit');
  }

  get creditControl() {
    return this.form.get('credit');
  }

  getAllflatData(){
    this.service.getFlat().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
    });
  }
  
  back(){
    this._location.back();
  }
  
  getAllhousetypeData(){
    this.service.getHouseType().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData4 = res.data;


    
    });
  }
  getAllData(){
    this.service.getrentalunitsetup().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData2 = res.data;
     this.totalLength = (res.data).length;

    
    });
  }
 
  // onSelect(event:any){
  //   console.log(event);
  //   this.service.getFloorById(event.target.value).subscribe((res)=>{
     
  //   this.readData4 = res.data;
    
  //   });
  
  // }

  
  
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
  const result = window.confirm('Are you sure you want to add this?');
  if (result) {
    console.log('confirmed');
  if(this.form.valid)
  {
    console.log(this.form.value);
    this.service.createRentalunitsetup(this.form.value).subscribe((res)=>{
      console.log(res,'res==>');
      this.form.reset();
      this.getAllData();
    });
  }
}else {
  this.form.reset();
  console.log('Delete canceled');
}
}



OnEdit(us:any,form:any){
   
  this.getparamid = us.rentalSetupId;
  console.log(this.getparamid);

  this.form.controls['flatId'].setValue(us.flatId);
  this.form.controls['area'].setValue(us.area);
  this.form.controls['debit'].setValue(us.debit);
  this.form.controls['credit'].setValue(us.credit);
  this.form.controls['houseTypeId'].setValue(us.houseType);

 }
 RentalsetupUpdate(){
   console.log(this.getparamid);
   console.log(this.form.value,'updated');
   const result = window.confirm('Are you sure you want to change these following details?');
  if (result) {
    console.log('confirmed');
   if(this.form.valid)
   {
     
     this.service.updateRentalunitsetup(
      {
        rentalSetupId:this.getparamid,
        flatId:this.form.value.flatId,
        area:this.form.value.area,
        debit:this.form.value.debit,
        credit:this.form.value.credit,
        houseTypeId:this.form.value.houseTypeId
      } 
      ).subscribe((res)=>{
        console.log(res,'res==>');

       alert( 'Updated Successfully...');
         this.getAllData();
     });
   }
  }else {
    this.form.reset();
    console.log('Delete canceled');
  }
 }
 



}




