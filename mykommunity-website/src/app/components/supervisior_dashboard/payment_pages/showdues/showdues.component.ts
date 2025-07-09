import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';

@Component({
  selector: 'app-showdues',
  templateUrl: './showdues.component.html',
  styleUrls: ['./showdues.component.css']
})
export class ShowduesComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;
  closeResult: any;

  constructor(
    private service:ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
     private modalService: NgbModal,
     private route: ActivatedRoute,
      private _location: Location) { }

  readData2:any ;
  readData:any ; 
  id:any;
  societyId=sessionStorage.getItem('societyId');


  ngOnInit(): void {
    this.id=this.route.snapshot.params['id'];
    console.log(this.id);
  this.getAllData();
  this.getAllChargesData();
  

  this.form = this.formBuilder.group({
    socityId: [this.societyId],
    rentalUnitId: [this.id],
    amount: ['', Validators.required],
    reference:['Settle Dues'],
    date: [Date.now()],
    paymentMode:['Cash']
    
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

  saveDetails(form:any) {
    console.log(this.form.value);
    const currentDate = new Date().toLocaleDateString();;

    console.log(currentDate);
    const result = window.confirm('Are you sure you want to add Settle this Rental Dues?');
  if (result) {
    console.log('confirmed');
    // if(this.form.valid)
     {
      // console.log(this.form.value);
       this.service.createrental_transaction(
        {
          
          socityId:this.societyId,
          rentalUnitId:this.id,
          amount:this.form.value.amount,
          reference:"Settle Dues",
          date:currentDate,
          paymentMode:"cash"

        }
        
        ).subscribe((res)=>{
          console.log( {
          
            socityId:this.societyId,
            rentalUnitId:this.id,
            amount:this.form.value.amount,
            reference:"Settle Dues",
            date:Date.now(),
            paymentMode:"cash"
  
          });
         console.log(res,'res==>');
         this.form.reset();
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  receipt(){
    this.router.navigate(['/supervisor/paymentdashboard/receipt']);
  }

   getAllData(){
    this.service.get_show_dues(this.id).subscribe((res)=>{
      console.log(res,"res==>");
      this.readData2 = res.data;
      console.log(this.readData2.credit);
     
    });
  }
  getAllChargesData(){
    this.service.get_specific_dues(this.id).subscribe((res)=>{
      console.log(res,"res==>");
     this.readData = res.data;
    // this.totalLength = (res.data).length;
  });
  }
}



