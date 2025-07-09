import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-invoicegrp',
  templateUrl: './invoicegrp.component.html',
  styleUrls: ['./invoicegrp.component.css']
})
export class InvoicegrpComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  invoiceForm!: UntypedFormGroup;
  id:any;
  billdate:any;
   originalArray:any;
 uniqueSortedArray = [];
 totalLength:any;
  page:number=1;


  constructor(
    private service:ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
     private modalService: NgbModal,
     private route: ActivatedRoute,
      private _location: Location) { }

  readData2:any = []; 
  readData:any = []; 

  showScreen = false;
  showScreen2 = false;
  showScreen3 = false;


  ngOnInit(): void {
    this.id=this.route.snapshot.params['id'];
    console.log(this.id);
  this.getAllData();
  
  }

  back(){
    this._location.back();
  }
 

    getAllData(){
      this.service.getinvoice_grp_details(this.id).subscribe((res)=>{
        console.log(res,"res==>");
        this.readData2 = res.data;
        this.readData = res.data[0];
       console.log(this.readData);
       this.totalLength = (res.data).length;

       
      });
    }
   
//   togglePerOne(){ 
//     if (this.allSelected.selected) {  
//      this.allSelected.deselect();
//      //return false;
//  }
//    if(this.searchUserForm.controls.userType.value.length==this.readData2.length)
//      this.allSelected.select();
 
//  }
//    toggleAllSelection() {
//      if (this.allSelected.selected) {
//        this.searchUserForm.controls.userType
//          .patchValue([...this.readData2.map((item: { name: any; }) => item.name), 0]);
//      } else {
//        this.searchUserForm.controls.userType.patchValue([]);
//      }
//    }
}


