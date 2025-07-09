import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { Location } from '@angular/common';
import {HttpClient} from "@angular/common/http";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-complaint-details',
  templateUrl: './complaint-details.component.html',
  styleUrls: ['./complaint-details.component.css']
})
export class ComplaintDetailsComponent implements OnInit {

  constructor(private service:ApiService,private fb: UntypedFormBuilder,
    private route: ActivatedRoute, private modalService: NgbModal,
   private http: HttpClient,private _location: Location ) { }
    id:any;
    closeResult: any;

  comment: string = '';
  getparamid:any;
  readData:any = [];
  showImage = false;
  showcmtImage = false;
  form:any= UntypedFormGroup;
  loading = false;
  getid:any;
  role=sessionStorage.getItem('role');



  getStatusColor(status: string): string {
    switch (status) {
      case 'RESOLVED':
        return 'green';
      case 'IN_PROGRESS':
        return 'darkcyan';
      case 'ON_HOLD':
        return 'rgba(59, 59, 214, 0.684)';
      case 'RE_OPENED':
        return 'rgb(210, 56, 82)';
        case 'NEW':
        return 'rgb(190, 31, 31)';
      default:
        return '';
    }
  }
  
  getStatusIcon(status: string): string {
    switch (status) {
      case 'RESOLVED':
        return 'check_circle';
      case 'IN_PROGRESS':
        return 'schedule';
      case 'ON_HOLD':
        return 'warning';
      case 'RE_OPENED':
        return 'menu_book';
        case 'NEW':
        return 'error_outline';
      default:
        return '';
    }
  }
  ngOnInit(): void {
    this.id=this.route.snapshot.params['id'];
    console.log(this.id);
    this.getAllData();
    this.form = this.fb.group({
      status: [null, [Validators.required]],

    });
  }
  back(){
    this._location.back();
  }
  showFullImage() {
    this.showImage = true;
  }

  // Function to close the full-size image and return to the normal page
  closeFullImage() {
    this.showImage = false;
  }
  showFullcmtImage() {
    this.showcmtImage = true;
  }
  onCancelClick(){
    this.getparamid = "";
    this.form.reset();
  
    
   
  }
  // Function to close the full-size image and return to the normal page
  closeFullcmtImage() {
    this.showcmtImage = false;
  }

  getAllData(){
    this.service.getComplaintbyid(this.id).subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
      console.log(this.readData.status);
     
    });
  }

  handleInput(event: any) {
    this.comment = event.target.value;
  }
  submit() {
    if (!this.comment.trim()) {
      alert('Comment cannot be empty!');
      return;
    }
    console.log({
      complaintId: this.id,
      comment: this.comment
    });
      this.service.createComplaintcomment(
        {
          complaintId: this.id,
          comment: this.comment
        }
      ).subscribe((res)=>{
      console.log(res,'res=>');
      console.log(this.comment);

      this.comment = '';
      this.onCancelClick();
      //location.reload();

      console.log(this.comment);
      this.getAllData();

    },(error) => {
      alert(error.error.message);
      this.comment = '';
      console.error('Error:', error.error.message);
      // You can show an error message to the user if needed
    });
    
   
  }
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}

  
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    //location.reload();
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //location.reload();
    return 'by clicking on a backdrop';
  } else {
    //location.reload();
    return `with: ${reason}`;
  }

}

  saveDetails(form:any) {
    console.log(this.getid);
    const result = window.confirm('Are you sure you want to change the status?');
       if (result) {
        this.loading = true;
         console.log('confirmed');
       if(this.form.valid)
       {
         console.log(this.form.value);
         this.service.changecomplaintsts({
           status:this.form.value.status,
           "complaintId": this.getid
       }).subscribe((res)=>{
          // alert( 'Updated Successfully...');
          this.loading = false;
           this.form.reset();
           this.getAllData();
           this.onCancelClick();

           //location.reload();

         },(error) => {
           alert(error.error.message);
           console.error('Error:', error);
           this.onCancelClick();
           this.loading = false;

           //location.reload();

           // You can show an error message to the user if needed
         });
       }
     }else {
       this.form.reset();
       this.onCancelClick();
       this.loading = false;

       console.log('Delete canceled');
     }
     }
     UpdateButton(){
       console.log(this.id);

    this.getid = this.id;
   console.log(this.getid);
     }
     
}
