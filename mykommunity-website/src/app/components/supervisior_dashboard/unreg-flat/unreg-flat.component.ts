import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unreg-flat',
  templateUrl: './unreg-flat.component.html',
  styleUrls: ['./unreg-flat.component.css']
})
export class UnregFlatComponent {

  closeResult: any;
  searchFlat:any = "";

 
  constructor(private service:ApiService, private router: Router,private fb: UntypedFormBuilder, private modalService: NgbModal, private _location: Location) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  map: any ={
    false: "Active",
    true: "Inactive"
  }
 
  
  ngOnInit(): void {
    this.getAllData();
    

  }
  flat(){
    this.router.navigate(['/supervisor/flat']);
  }

  getAllData(){
    this.service.getunregRU().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
     
      this.totalLength = (res.data).length;
    });
  }
  
  back(){
    this._location.back();
  }
  
 
 }



