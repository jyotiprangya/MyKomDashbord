import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-localservice-details',
  templateUrl: './localservice-details.component.html',
  styleUrls: ['./localservice-details.component.css']
})
export class LocalserviceDetailsComponent implements OnInit {
  

  SOCIETY_ADMIN = 'SOCIETY_ADMIN';
  SOCIETY_ADMIN_DISPLAY = 'SOCIETY_ADMIN_DISPLAY';


  
  constructor(private service:ApiService,private route: ActivatedRoute,private modalService: NgbModal,private fb: UntypedFormBuilder, private _location: Location) { }
  role=sessionStorage.getItem('role');

 
  societyId=sessionStorage.getItem('societyId');

  category!: string;
  households: any[] = [];
  id!: string;
  image!: string;
  localServiceProviderCode!: string;
  mobileNumber!: string;
  name!: string;
  punctuality!: number;
  quality!: number;
  behaviour!: number;
  averageRating!: number;
  
  ngOnInit(): void {
    this.id=this.route.snapshot.params['id'];
    console.log(this.id);
   this.getAllData();


}

getAllData(){
  
  this.service.getLocalServiceProviderbyid(this.id).subscribe((res)=>{
    console.log(res,"res==>");
    const responseData = res.data;
    this.category = responseData.category;
    this.households = responseData.households;
    this.id = responseData.id;
    this.image = responseData.image;
    this.localServiceProviderCode = responseData.localServiceProviderCode;
    this.mobileNumber = responseData.mobileNumber;
    this.name = responseData.name;

    const ratingsObject = responseData.ratingsObject;
    this.punctuality = ratingsObject.PUNCTUALITY;
    this.quality = ratingsObject.QUALITY;
    this.behaviour = ratingsObject.BEHAVIOUR;
    this.averageRating = ratingsObject.AVERAGE;
  });
}




back(){
  this._location.back();
}





}


