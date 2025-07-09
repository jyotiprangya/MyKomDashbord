import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { FirebaseUploadService } from 'src/app/services/firebase-upload.service';


@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {


  selectedFile!: File;
 
  downloadURL: Observable<string> | undefined;

  closeResult: any;
  form:any= UntypedFormGroup;
  constructor(
    private service:ApiService,
    private fb: UntypedFormBuilder, 
    private modalService: NgbModal, 
    private _location: Location,
    private af:AngularFireStorage,
    private firebaseUploadService: FirebaseUploadService
    ) { }

    firebase :any =[];
    barStatus = false;
imageUploads = [];
  totalLength:any;
  page:number=1;
  readData:any = [];
  readData2:any =[];
  getparamid:any;
  path!: string;
  image!:any;
  map: any ={
    true: "Inactive",
    false: "Active"
  }
  searchTerm: string = '';
filteredData: any[] = [];

  ref: AngularFireStorageReference | undefined;
  task: AngularFireUploadTask | undefined;

  ngOnInit(): void {
    this.getAllComData();
    this.getCityData();

 
    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.maxLength(30)]],
      cityId: [null, [Validators.required]],
      pinCode: [null, [Validators.required]],
      builderName: [null, [Validators.required]],
      address: [null, [Validators.required]],
      images: [''],
      pan:['', [Validators.required]],
      gst:['']
     
    });

      this.filteredData = [...this.readData];

  }

 getAllComData() {
  this.service.getCommunities().subscribe((res) => {
    console.log(res, "res==>");
    this.readData = res.data;
    this.filteredData = [...this.readData]; // ✅ important!
    this.totalLength = this.filteredData.length;
  });
}

  
  getCityData(){
    this.service.getCities().subscribe((res)=>{
      console.log(res,"res==>");
    this.readData2 = res.data;
    });
  }
  back(){
    this._location.back();
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
       return 'by pressing ESC';
     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
       return 'by clicking on a backdrop';
     } else {
       return `with: ${reason}`;
     }

   }

   images: any[] = [];

   upload(event: any) {
     const files = event.target.files;
     var n = Date.now();

     for (let i = 0; i < files.length; i++) {
       const file = files[i];
          const filePath = `Community/${n}`;

       const storageRef = this.af.ref(filePath);
       const uploadTask = storageRef.put(file);
 
       uploadTask.then((snapshot: { ref: { getDownloadURL: () => Promise<any>; }; }) => {
         snapshot.ref.getDownloadURL().then(downloadURL => {
           this.images.push(downloadURL);
           console.log(downloadURL);
           console.log(this.images);
         });
       });
     }
   }

//    images:any;
//    upload(event:any){
 
//     for (var i = 0; i < event.target.files.length; i++) {
//       var file = event.target.files[i];
//     }
//     var n = Date.now();
//    // const file = event.target.files[i];
//     const filePath = `Community/${n}`;
//     const fileRef = this.af.ref(filePath);
//     const task = this.af.upload(`Community/${n}`, file);
//     task
//       .snapshotChanges()
//       .pipe(
//         finalize(() => {
//           this.downloadURL = fileRef.getDownloadURL();
//           this.downloadURL.subscribe(url => {
//             if (url) {
//               this.firebase = url;
//             }
//             console.log(this.firebase);
//           });
//         })
//       )
//       .subscribe(url => {
//         if (url) {
//           url;
//           console.log(url);
//         //  console.log(this.firebase);
//         }
//       });



// //   this.barStatus = true;
// // this.firebaseUploadService.storeImage(event.target.files[0]).then(
// //     (res: any) => {
// //         if (res) {
// //             console.log(res);
// //             this.imageUploads.unshift();
// //             this.barStatus = false;
// //     }
// // },
// // (error: any) => {
// //     this.barStatus = false;
// // }
// // );
//    }


onSearch(event: any): void {
  const searchValue = event.target.value.toLowerCase().trim();
  
  if (!searchValue) {
    this.filteredData = [...this.readData];
    this.totalLength = this.readData.length;
  } else {
    this.filteredData = this.readData.filter((item: any) => 
      item.name?.toLowerCase().includes(searchValue) ||
      item.cityName?.toLowerCase().includes(searchValue) ||
      item.stateName?.toLowerCase().includes(searchValue) ||
      item.builderName?.toLowerCase().includes(searchValue) ||
      item.pinCode?.toString().includes(searchValue) ||
      item.panId?.toLowerCase().includes(searchValue) ||
      item.gst?.toLowerCase().includes(searchValue) ||
      item.address?.toLowerCase().includes(searchValue)
    );
    this.totalLength = this.filteredData.length;
  }
  
  // Reset to first page when searching
  this.page = 1;
}

// Make sure to update filteredData whenever readData changes
updateData() {
  // Your existing data update logic
  this.filteredData = [...this.readData];
  this.totalLength = this.readData.length;
}
  
uploadImage(){
  console.log(this.path);
  
  this.af.upload("/Community/files"+Math.random()+this.path,this.path);

}

saveDetails() {
  console.log(this.images);
console.log(+(this.form.value.pinCode));
var photos = this.images;
console.log(photos);
     this.service.createSociety({name:this.form.value.name,cityId:this.form.value.cityId,
      builderName:this.form.value.builderName,address:this.form.value.address,
      pinCode:+(this.form.value.pinCode),images:photos,pan:this.form.value.pan,gst:this.form.value.gst}).subscribe((res)=>{ 
       console.log(res,'res==>');
       //console.log(this.images);
      // this.af.upload("/Community/files"+Math.random()+this.images,this.images);
       this.form.reset();
       this.getAllComData();
     });
    
   
 }

 

 OnEdit(us:any,form:any){
   
  this.getparamid = us.id;
  console.log(this.getparamid);

  this.form.controls['name'].setValue(us.name);
  this.form.controls['name'].setValue(us.name);

 }
 societyUpdate(){
  //this.societyId= localStorage.getItem('societyId');

   console.log(this.getparamid);
   //console.log(this.societyId);
   const result = window.confirm('Are you sure you want to change Society details?');
   if (result) {
     console.log('confirmed');
   {
     this.service.updateSociety({id:this.getparamid,name:this.form.value.name,} ).subscribe((res)=>{
       confirm( 'Updated Successfully...');
       //location.reload();

      //   this.getAllData();
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
 

  //  CommunityUpdate(){
  //    console.log(this.getparamid);
  //    console.log(this.form.value,'updated');
  //    if(this.form.valid)
  //    {
       
  //      this.service.updateCommunity(this.getparamid,this.form.value ).subscribe((res)=>{
  //        alert( 'Updated Successfully...');
  //        this.form.reset();
  //          this.getAllComData();
  //      });
  //    }
  //  }
   




}
