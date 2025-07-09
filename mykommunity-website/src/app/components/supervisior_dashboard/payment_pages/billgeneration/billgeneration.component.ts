import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-billgeneration',
  templateUrl: './billgeneration.component.html',
  styleUrls: ['./billgeneration.component.css']
})
export class BillgenerationComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  id: any;
  invoice:any;
  selectedBlock: any = {
    id:0, block_name:''
  };
  floor: any;
  constructor(
    private service:ApiService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute, 
    private modalService: NgbModal,
     private _location: Location) { 
   
  }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  readData3:any = [];
  readData4:any = [];
  generateData:any = []; 

  getparamid:any;
  societyId=sessionStorage.getItem('societyId');

  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.generateData = JSON.parse(params['generateData']);
      console.log(this.generateData);

      // Use the generateData in the second page as needed
    });
    this.getAllData();
    this.getAllFloorData();


    // this.form = this.fb.group({
    //   societyId: [this.generateData[0].societyId],
    //   rentalUnitId:[this.generateData[0].rentalUnitId],
    //   blockName: [this.generateData[0].blockName],
    //   floorName:[this.generateData[0].floorName],
    //   rentalUnitName: [this.generateData[0].rentalUnitName],
    //   area:[this.generateData[0].area],
    //   invoicePeriod: [""],
    //   invoiceDate:[this.generateData[0].billDate],
    //   dueDate:[this.generateData[0].dueDate],
    //   chargeName: [this.generateData[0].chargeName],
    //   amount:[this.generateData[0].amount]
    // });

  }

  getAllData(){
    this.service.getFlat().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
      this.totalLength = (res.data).length;
    });
  }
  
  back(){
    this._location.back();
  }
  
  getAllFloorData(){
    this.service.getFloor().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData4 = res.data;
    
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
 

// saveDetails() {
 
 
//      console.log("this.form.value");
//     this.service.generate_invoice(
      
//       {
//         societyId: this.generateData[0].societyId,
//       rentalUnitId:this.generateData[0].rentalUnitId,
//       blockName: this.generateData[0].blockName,
//       floorName:this.generateData[0].floorName,
//       rentalUnitName: this.generateData[0].rentalUnitName,
//       area:this.generateData[0].area,
//       invoicePeriod: "",
//       invoiceDate:this.generateData[0].billDate,
//       dueDate:this.generateData[0].dueDate,
//       chargeName: this.generateData[0].chargeName,
//       amount:this.generateData[0].amount
//       }).subscribe((res)=>{
//       console.log("res");
//       console.log(res,'res==>invoice');
//       this.invoice = res.invoice_url;
//       console.log(res.invoice_url);
//       console.log(this.invoice);
//       // this.getAllData();
//     });
//  // }
// }



OnEdit(us:any,form:any){
   
  this.getparamid = us.id;
  console.log(this.getparamid);

  this.form.controls['floorId'].setValue(us.floor_id);
  this.form.controls['name'].setValue(us.name);

 }
 FlatUpdate(){
   console.log(this.getparamid);
   console.log(this.form.value,'updated');
   if(this.form.valid)
   {
     
     this.service.updateFlat({id:this.getparamid,name:this.form.value.name,floorId:this.form.value.floorId,type:this.form.value.type} ).subscribe((res)=>{
       alert( 'Updated Successfully...');
         this.getAllData();
     });
   }
 }
 



}





