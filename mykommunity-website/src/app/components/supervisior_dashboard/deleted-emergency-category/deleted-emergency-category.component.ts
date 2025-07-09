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
import { Router } from '@angular/router';

@Component({
  selector: 'app-deleted-emergency-category',
  templateUrl: './deleted-emergency-category.component.html',
  styleUrls: ['./deleted-emergency-category.component.css']
})
export class DeletedEmergencyCategoryComponent implements OnInit {
  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;
  selectedFile!: File;
  filteredText:any = "";
  role=sessionStorage.getItem('role');

 
  downloadURL: Observable<string> | undefined;
  Percentage:Observable<any> | undefined ;


  constructor(private service:ApiService,private fb: UntypedFormBuilder,
     private modalService: NgbModal, private _location: Location, private af:AngularFireStorage,
    private firebaseUploadService: FirebaseUploadService, 
     private sanitizer: DomSanitizer,private dialog: MatDialog, private router:Router,) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  readData3:any = [];
  getparamid:any;
  firebase :any = null;
  path!: string;
  thumbnail: any;
  myData:any;
  societyId=sessionStorage.getItem('societyId');
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
    
    this.getAllCategoryData();
    this.updateColumnLists();
    this.getRemoveAllCategoryData();

    this.form = this.fb.group({
      name: [null, [Validators.required]],
      image: [null, [Validators.required]]
    });
  }

  
  columns = [
    { name: 'Icon', visible: true },
    { name: 'Name', visible: true },
    { name: 'Edit', visible: true },
    { name: 'Delete', visible: true },
   
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
      
          this.downloadCSV(csvContent, 'Emegencycategory_log.csv');
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
          case 'Icon': return 'icon';
          case 'Name': return 'name';
         
          default: return '';
        }
      }

  getAllCategoryData(){
    this.service.getEmergencyCategory().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
//       this.myData = res.data.map((contacts:any) => contacts.image);
// console.log(this.myData)
// this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(this.myData);
for (let i = 0; i < res.data.length; i++) {
  this.readData[res.data[i]] = {
    name: res.data[i].name,
    image: res.data[i].image

  };
  console.log(res.data[i].image);

}   
    });
  }

  getRemoveAllCategoryData(){
    this.service.getRemovedEmergencyCategory().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
//       this.myData = res.data.map((contacts:any) => contacts.image);
// console.log(this.myData)
// this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(this.myData);
for (let i = 0; i < res.data.length; i++) {
  this.readData[res.data[i]] = {
    name: res.data[i].name,
    image: res.data[i].image

  };
  console.log(res.data[i].image);

}   
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
     // //location.reload();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //  //location.reload();
      return 'by clicking on a backdrop';
    } else {
    //  //location.reload();
      return `with: ${reason}`;
    }
  
  }
  onCancel(){
    this.firebase = null;
    console.log(this.firebase);
  }
  back(){
    this._location.back();
  }
  
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


// OnEdit(us:any,form:any){
     
//   this.getparamid = us.id;
//   this.firebase = us.image;

//   console.log(this.getparamid);
 
//   this.form.controls['name'].setValue(us.name);
//   this.form.controls['image'].setValue(us.image);
//  }
//  CategoryUpdate(){
//    console.log(this.getparamid);
//   //  console.log(this.form.value,'updated');
//    const result = window.confirm('Are you sure you want to change this Service Category Details?');
//   if (result) {
//     this.loading = true;
//     console.log('confirmed');
//    {
     
//      this.service.updateEmergencyCategory({localServiceId:this.getparamid,name:this.form.value.name,image:this.firebase} ).subscribe((res)=>{
//        alert( 'Updated Successfully...');
//        console.log({localServiceId:this.getparamid,name:this.form.value.name,image:this.firebase});
//          this.getAllCategoryData();
//          this.onCancelClick();
//          this.loading = false;

//       //   //location.reload();

//      },(error) => {
//       alert(error.error.message);
//      // //location.reload();
//      this.loading = false;
//       console.error('Error:', error);
//       // You can show an error message to the user if needed
//     });
//    }
//   }else {
//     this.form.reset();
//     this.onCancelClick();
//     this.loading = false;

//     console.log('Delete canceled');
//   }
//  }

//   saveDetails(form:any) {
//     const result = window.confirm('Are you sure you want to add this emergency category?');
//     if (result) {
//       this.loading = true;
//       console.log('confirmed');
//   {
//     console.log(this.form.value);
//     this.service.createEmergencyCategory({name:this.form.value.name,image:this.firebase,societyId:this.societyId
//     }).subscribe((res)=>{
//       console.log(res,'res==>');
//       alert("Data added successfully...");
//       this.loading = false;
//       this.form.reset();
//       this.getAllCategoryData();
//       this.onCancelClick();
//       //location.reload();


//     },(error) => {
//       alert(error.error.message);
//       this.loading = false;
//       console.error('Error:', error);
//       //location.reload();
  
//       // You can show an error message to the user if needed
//     });
//    }
//   }else {
//     this.loading = false;
//     this.onCancelClick();
//     console.log('Delete canceled');
//   }
//   }

 
   
CategoryRestore(id:any){
  console.log(this.getparamid);
  const result = window.confirm('Are you sure you want to restore this Emergency Category?');
  if (result) {
   this.loading = true;
    console.log('confirmed');
   this.service.restoreEmergencyCategory(
     {id:id } 
     ).subscribe((res)=>{
     alert( 'Restore Successfully...');
     this.loading = false;
        this.getRemoveAllCategoryData();
      //  this.onCancelClick();

       // //location.reload();

    },(error) => {
     alert(error.error.message);
     this.loading = false;
     console.error('Error:', error);
     // You can show an error message to the user if needed
   });
   }else {
     this.form.reset();
     this.onCancelClick();
     this.loading = false;

     console.log('Delete canceled');
   }
  
}


   
  }
  

