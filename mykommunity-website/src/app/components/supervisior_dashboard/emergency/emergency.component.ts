import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { FirebaseUploadService } from 'src/app/services/firebase-upload.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';


@Component({
  selector: 'app-emergency',
  templateUrl: './emergency.component.html',
  styleUrls: ['./emergency.component.css']
})
export class EmergencyComponent implements OnInit {

  selectedFile!: File;
 
  downloadURL: Observable<string> | undefined;
  Percentage:Observable<any> | undefined ;


  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;
  getidimg:String | undefined;
  role=sessionStorage.getItem('role');

  constructor(
    private service:ApiService,
    private fb: UntypedFormBuilder, 
    private modalService: NgbModal, 
    private _location: Location,
    private af:AngularFireStorage,
    private firebaseUploadService: FirebaseUploadService,
    private sanitizer: DomSanitizer,
    private dialog:MatDialog,
    ) { }

    firebase :any = null;
    totalLength:any;
  page:number = 1;
  readData2:any = [];
  readData:any = [];
  read:any = [[]];

  getparamid:any;
  societyId:any;
  path!: string;
  image!:any;
  getimageUrl:any;
  sortDirection: { [key: string]: boolean } = {};
  isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;
  filteredData: any[] = [];

  ngOnInit(): void {
    this.getAllData();
    this.getEmergencyCategoryData();
    this.updateColumnLists();

    this.form = this.fb.group({
      name: [null, [Validators.required]],
      mobileNumber: [null, [Validators.required, Validators.minLength(3)]],
      emergencyContactCategoryId: [null, [Validators.required]],
      image: [null, [Validators.required]]
    });

  }

  columns = [
    { name: 'Image', visible: true },
    { name: 'Name', visible: true },
    { name: 'Contact Number', visible: true },
    { name: 'Emergency Type', visible: true },
    { name: 'Edit', visible: true },
    { name: 'Delete', visible: true }
  ];
     
         
       
        toggleModal() {
          this.isModalOpen = !this.isModalOpen;
        }
         
       
        cancelChanges() {
          this.hiddenColumns.forEach(column => column.selected = false);
          this.displayedColumns.forEach(column => column.selected = false);
          this.toggleModal();
        }
        
       
      
        updateColumnLists() {
          this.hiddenColumns = this.columns.filter(column => !column.visible);
          this.displayedColumns = this.columns.filter(column => column.visible);
        }
      
      
      
      
        addColumn() {
          const selectedColumns = this.hiddenColumns.filter(column => column.selected);
          selectedColumns.forEach(column => {
            column.visible = true;
            this.displayedColumns.push({ ...column, selected: false });
          });
          this.hiddenColumns = this.hiddenColumns.filter(column => !column.selected);
        }
        
        removeColumn() {
          const selectedColumns = this.displayedColumns.filter(column => column.selected);
          selectedColumns.forEach(column => {
            column.visible = false;
            this.hiddenColumns.push({ ...column, selected: false });
          });
          this.displayedColumns = this.displayedColumns.filter(column => !column.selected);
        }
        
        isColumnVisible(columnName: string): boolean {
          const column = this.displayedColumns.find(col => col.name === columnName);
          return column ? column.visible : false;
        }
        toggleDropdown(): void {
          this.isDropdownOpen = !this.isDropdownOpen;
        }
        applyColumnSelection() {
          this.updateColumnLists();
          this.toggleModal();
          this.columns = [...this.displayedColumns]; 
        }
      
        sortData(column: string): void {
          this.sortDirection[column] = !this.sortDirection[column]; // Toggle the sort direction for the column
          this.readData.sort((a: any, b: any) => {
            const direction = this.sortDirection[column] ? 1 : -1;
            return a[column] > b[column] ? direction : -direction;
          });
        }
       
        exportData(): void {
          const dialogRef = this.dialog.open(DownloadConfirmDialogComponent);
      
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.downloadCSVfile();
            }
          });
        }
      
        downloadCSVfile(): void {
          console.log('Filtered Data:', this.readData);
          const visibleColumns = this.columns
            .filter(col => col.visible && col.name !== 'Actions')
            .map(col => col.name);
          console.log('Visible Columns:', visibleColumns);
      
          const dataToExport = this.readData.map((entry: { [x: string]: any; }) => {
            const exportEntry: any = {};
      
            visibleColumns.forEach(column => {
              const key = this.mapColumnToKey(column);
              // let value = key;
              // if (key === 'isInside') {
              //   value = this.map[value];
              // }
              
              if (column === 'In/Out Status') {
                exportEntry[column] = entry[key] ? "Inside" : "Out";
              } else {
                exportEntry[column] = entry[key]; 
              }
      
              console.log(`Mapping column "${column}" to key "${key}" with value: ${exportEntry[column]}`);
            });
      
            console.log('Export Entry:', exportEntry);
            return exportEntry;
          });
          const csvContent = this.convertToCSV(dataToExport);
          console.log('CSV Content:', csvContent); 
      
          this.downloadCSV(csvContent, 'emergencydial_log.csv');
          console.log('CSV downloaded');
        }
      
      private convertToCSV(data: any[]): string {
          if (data.length === 0) {
              return '';
          }
      
          const header = Object.keys(data[0]).join(',');
          const rows = data.map(row => Object.values(row).join(',')).join('\n');
          return `${header}\n${rows}`;
      }
      
      private downloadCSV(csvContent: string, filename: string): void {
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          if (link.download !== undefined) { // Feature detection
              const url = URL.createObjectURL(blob);
              link.setAttribute('href', url);
              link.setAttribute('download', filename);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          }
      }
      
      private mapColumnToKey(columnName: string): string {
        switch (columnName) {
          case 'Visitor Image': return 'visitorImage';
          case 'Visitor Name': return 'name';
          case 'Contact Number': return 'mobileNumber';
          case 'Emergency Type': return 'categoryName';
          default: return '';
        }
      }
      

  name = 'Test display image';
  thumbnail: any;
  myData:any;
  contacts:any =[];
  data:any=[];
  events:any;
  getAllData(){
    this.service.getEmergencyContact().subscribe((res)=>{
      console.log(res,"res==>");
     
      this.readData = res.data;
      console.log(res.data);
      this.totalLength = (res.data).length;
      
    });
  }
  showImage(us:any){

    this.getimageUrl = us.categoryImage;
    console.log(this.getimageUrl);
    this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(this.getimageUrl);

  }
  getEmergencyCategoryData(){
    this.service.getEmergencyCategory().subscribe((res)=>{
      console.log(res,"res==>");
    this.readData2 = res.data;
    });
  }
  onCancel(){
    this.firebase = null;
    console.log(this.firebase);
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
  images:any;
  SelectedImage:any;
  media:any;


  upload(event:any){

     var file = event.target.files[0];
   
   var n = Date.now();
  // const file = event.target.files[i];
  //const filePathinlocal = `${this.basePath}/${file.name}`;  
  this.media = file;
  console.log(file);
  var reader = new FileReader()
  reader.readAsDataURL(event.target.files[0])
  reader.onload = (event:any)=>{
    this.SelectedImage = event.target.result;

  }
   const filePath = `EmergencyContacts/${n}`;
   const fileRef = this.af.ref(filePath);
   const task = this.af.upload(`EmergencyContacts/${n}`, file);
   this.Percentage = task.percentageChanges();

   task
     .snapshotChanges()
     .pipe(
       finalize(() => {
         this.downloadURL = fileRef.getDownloadURL();
         this.downloadURL.subscribe(url => {
           if (url) {
             this.firebase = url;
           }
           console.log(this.firebase);
         });
       })
     )
     .subscribe(url => {
       if (url) {
         url;
         console.log(url);
       //  console.log(this.firebase);
       }
     });

   

//   this.barStatus = true;
// this.firebaseUploadService.storeImage(event.target.files[0]).then(
//     (res: any) => {
//         if (res) {
//             console.log(res);
//             this.imageUploads.unshift();
//             this.barStatus = false;
//     }
// },
// (error: any) => {
//     this.barStatus = false;
// }
// );
  }
  onCancelClick(){
    this.getparamid = "";
    this.form.reset();
    this.firebase = null;
    this.Percentage = undefined ;
   
  }
uploadImage(){
 console.log(this.path);
 
 this.af.upload("/Community/files"+Math.random()+this.path,this.path);

}
selectImage(event:any) {
  if (event.target.files.length > 0) {
    const file = event.target.files[0];
    this.media = file;
    console.log(file);
    var reader = new FileReader()
    reader.readAsDataURL(event.target.files[0])
    reader.onload = (event:any)=>{
      this.SelectedImage = event.target.result;
    }
  }
}



saveDetails(form:any) {
  const result = window.confirm('Are you sure you want to add this Emergency Contact for your society?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
  {
    this.societyId= sessionStorage.getItem('societyId');
    console.log(this.form.value);
    this.service.createEmergencyContact({name:this.form.value.name,image:this.firebase,mobileNumber:this.form.value.mobileNumber,
      emergencyContactCategoryId:this.form.value.emergencyContactCategoryId,societyId:this.societyId})
      .subscribe((res)=>{
      console.log(res,'res==>');
      console.log({name:this.form.value.name,image:this.firebase,mobileNumber:this.form.value.mobileNumber,
        emergencyContactCategoryId:this.form.value.emergencyContactCategoryId,societyId:this.societyId});
      this.form.reset();
      this.getAllData();
      this.loading = false;
      this.onCancelClick();
    },(error) => {
      alert(error.error.message);
      this.loading = false;
      console.error('Error:', error);
      //location.reload();
  
      // You can show an error message to the user if needed
    });
  }
}else {
  this.loading = false;
  this.onCancelClick();
  console.log('Delete canceled');
}
}



OnEdit(us:any,image:any){
   
  this.getparamid = image.id;
this.firebase = image.image;

  console.log(this.getparamid);

  this.form.controls['name'].setValue(image.name);
  this.form.controls['mobileNumber'].setValue(image.mobileNumber);
  this.form.controls['emergencyContactCategoryId'].setValue(us.id);
  this.form.controls['image'].setValue(image.image);
  
 }
 DialUpdate(){
   console.log(this.getparamid);
   const result = window.confirm('Are you sure you want to change this emergency contact details?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
   {
     
     this.service.updateEmergencyContact({emergencyContactId:this.getparamid,name:this.form.value.name,mobileNumber:this.form.value.mobileNumber,
      emergencyContactCategoryId:this.form.value.emergencyContactCategoryId,image: this.firebase }).subscribe((res)=>{
        console.log(this.form.value,'updated');

       alert( 'Updated Successfully...');
       //location.reload();
        this.loading = false;
         this.getAllData();
         this.onCancelClick();
     },(error) => {
      alert(error.error.message);
      this.loading = false;
      console.error('Error:', error);

console.log({emergencyContactId:this.getparamid,name:this.form.value.name,mobileNumber:this.form.value.mobileNumber,
  emergencyContactCategoryId:this.form.value.emergencyContactCategoryId,image: this.firebase });  
      // You can show an error message to the user if needed
    });
   }
  }else {
    this.loading = false;
    this.onCancelClick();
    console.log('Delete canceled');
  }
 }
 deleteID(us:any){
 const result = window.confirm('Are you sure you want to delete this emergency contact?');
    if (result) {
      console.log('confirmed');
 {
 this.getparamid = us;

  this.service.deleteEmergencyContact({emergencyContactId:this.getparamid}).subscribe((res)=>{
    console.log(res,'deleteres==>');
    alert("Record Deleted...");
      this.getAllData();
    //  //location.reload();
    this.onCancelClick();
 
  },(error) => {
    alert(error.error.message);
    console.error('Error:', error);
    //location.reload();

    // You can show an error message to the user if needed
  });

}
}else {
  this.onCancelClick();
  this.form.reset();
  console.log('Delete canceled');
}
}
}
