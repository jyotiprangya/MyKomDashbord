import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';

@Component({
  selector: 'app-advertisement',
  templateUrl: './advertisement.component.html',
  styleUrls: ['./advertisement.component.css']
})
export class AdvertisementComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  constructor(private service:ApiService,private fb: UntypedFormBuilder, private modalService: NgbModal, private _location: Location) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  getparamid:any;
  getadid:any;

  // societyId=sessionStorage.getItem('societyId');

  
  ngOnInit(): void {
    this.getAllAds();
    this.getAllSocietyData();

    this.form = this.fb.group({
      imageUrl: [null, [Validators.required]],
      redirectUrl: [null, [Validators.required]],
      name: [null, [Validators.required]],
      societyId: [null, [Validators.required]],

    });

  }

  getAllAds(){
    this.service.getAds().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
      this.totalLength = (res.data).length;

    });
  }

  getAllSocietyData(){
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
 
  {
    console.log(this.form.value);
    this.service.createAd(this.form.value).subscribe((res)=>{
      console.log(res,'res==>');
      this.form.reset();
      this.getAllAds();
    });
  }
}


OnEdit(us:any,form:any){
   
  this.getparamid = us.id;
  console.log(this.getparamid);

  this.form.controls['name'].setValue(us.name);
  this.form.controls['imageUrl'].setValue(us.imageUrl);
  this.form.controls['redirectUrl'].setValue(us.redirectUrl);
  this.form.controls['societyId'].setValue(us.societyId);

 }
 adsUpdate(){
   console.log(this.getparamid);
   //console.log(this.societyId);
   console.log({advertisementId:this.getparamid,name:this.form.value.name});

   const result = window.confirm('Are you sure you want to change Ads details?');
   if (result) {
     console.log('confirmed');
   {

     this.service.updateAd({advertisementId:this.getparamid,name:this.form.value.name,redirectUrl:this.form.value.redirectUrl,imageUrl:this.form.value.imageUrl} ).subscribe((res)=>{
       confirm( 'Updated Successfully...');
      // //location.reload();
//console.log({id:this.getparamid,name:this.form.value.name,stateId:this.form.vaue.stateId});
         this.getAllAds();
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

 deleteAds(us:any)
  {
    console.log(us.id);
this.getadid = us.id;
    this.service.deleteAd(
      {advertisementId:this.getadid}
    ).subscribe((res)=>{
      console.log(res,'deleteres==>');
      alert("Record Deleted...");
        this.getAllAds();
    },(error) => {
      alert(error.error.message);
      console.error('Error:', error);
      // You can show an error message to the user if needed
    });
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

