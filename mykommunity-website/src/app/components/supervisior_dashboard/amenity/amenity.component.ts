import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { AngularFireStorage, AngularFireUploadTask} from '@angular/fire/compat/storage';

//  import { Database } from '@angular/fire/database';

import { map, finalize, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { FirebaseUploadService } from 'src/app/services/firebase-upload.service';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-amenity',
  templateUrl: './amenity.component.html',
  styleUrls: ['./amenity.component.css']
})
export class AmenityComponent implements OnInit {
  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false
  downloadURL: Observable<string> | undefined;
    Percentage:Observable<any> | undefined ;
   // uploadPercent!: Observable<number>;
   searchTerm:any = "";

  snapshot!: Observable<any>;
  // private _firestore: any;

  role=sessionStorage.getItem('role');


  constructor(
    private service:ApiService,
    private fb: UntypedFormBuilder, 
    private modalService: NgbModal, 
    private _location: Location,
    private af:AngularFireStorage,
    private dialog: MatDialog,
    private router:Router,
   // private db: AngularFirestore
    ) { }

    firebase :any =[];
  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  getparamid:any;
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
  activeAmenities: any[] = [];
  map: any ={
    true: "Inactive",
    false: "Active"
  }

  ngOnInit(): void {
   this.getAllData();
   this.updateColumnLists();
   //this.getAllComData();

  this.form = this.fb.group({
    name: [null, [Validators.required]],
    type: [null, [Validators.required]],
    pricePerSlot: [0, [Validators.required]],
    maxCapacity: [1, [Validators.required]],
    advanceBookingLimitInDays:[0, [Validators.required]]
  });

}



columns = [
  { name: 'Amenity Name', visible: true },
  { name: 'Amenity Type', visible: true },
  { name: 'Price per Slot', visible: true },
  { name: 'Max Capacity', visible: true },
  { name: 'Advance Booking Limit', visible: true },
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
    
        this.downloadCSV(csvContent, 'Amenity_log.csv');
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
        case 'Amenity Name': return 'name';
        case 'Amenity Type': return 'type';
        case 'Price per Slot': return 'pricePerSlot';
        case 'Max Capacity': return 'maxCapacity';
        case 'Advance Booking Limit ': return 'advanceBookingLimitInDays';
        case 'Edit': return 'edit';
        case 'Delete': return 'delete';
        default: return '';
      }
    }
  


    getAllData() {
      this.service.getAmenity().subscribe((res) => {
        console.log(res, "res==>");
        this.readData = res.data;
    
        // Filter only active amenities where isActive is true
        this.activeAmenities = this.readData.filter((amenity: any) => amenity.isActive === true);
    
        // Sort the active data based on updatedAt timestamp
        this.activeAmenities.sort((a: any, b: any) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
    
        this.totalLength = this.activeAmenities.length; // Update total length for pagination
    
        console.log("Active Amenities:", this.activeAmenities); // Debugging output
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
images:any;
SelectedImage:any;
  media:any;
  task:AngularFireUploadTask | undefined;
  file: File[] = [];
upload(event:any){


  for (var i = 0; i < (event.target.files).length; i++) {
   var file = event.target.files[i];
    // this.file.push((event.target.files).item(i));
  }   
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
 const filePath = `amenity/${n}`;
 const fileRef = this.af.ref(filePath);
  this.task = this.af.upload(`amenity/${n}`,file);
 this.Percentage = this.task.percentageChanges();
 this.task.snapshotChanges()
   .pipe(
    tap(console.log),
     finalize(() => {
       this.downloadURL =  fileRef.getDownloadURL();
      
      //  this.item$ = collectionData(collection);

        // this.db.collection('file').add({downloadURL:this.downloadURL,filePath})
      //  this.db.list(downloadURL:this.downloadURL, )
       this.downloadURL.subscribe(url => {
         if (url) {
           this.firebase = url;
         }
         console.log(this.firebase);
         console.log(this.Percentage);
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
  
  //  isActive(snapshot:any){
  //   return this.snapshot.state === 'running' 
  //   && this.snapshot.bytesTransferred < this.snapshot.totalBytes;
    
  //  }

  }
 

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    ////location.reload();
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
   // //location.reload();
    return 'by clicking on a backdrop';
  } else {
   // //location.reload();
    return `with: ${reason}`;
  }

}
RemovedAmenityList(){
  this.router.navigate(['/supervisor/removed-amenity']);
}

saveDetails(form:any) {
  const result = window.confirm('Are you sure you want to add this Amenity?');
  if (result) {
    this.loading=true;
    console.log('confirmed');
{
  //this.societyId= sessionStorage.getItem('societyId');

  console.log(this.form.value);
  this.service.createAmenity(
    {
      name:this.form.value.name,
      pricePerSlot:this.form.value.pricePerSlot,
      type:this.form.value.type,
      maxCapacity: this.form.value.maxCapacity,
      advanceBookingLimitInDays:this.form.value.advanceBookingLimitInDays
    }).subscribe((res)=>{
    console.log(res,'res==>');
   this.form.reset();
 this.loading = false;
    this.getAllData();
    location.reload();

  },(error) => {
    this.loading = false;
    alert(error.error.message);
    console.error('Error:', error);
    // You can show an error message to the user if needed
  });
 }
}else {
  this.loading = false;
  this.form.reset();
  console.log('Delete canceled');
}
}


OnEdit(us:any,form:any){
   
  this.getparamid = us.id;
  console.log(this.getparamid);

  this.form.controls['name'].setValue(us.name);
  this.form.controls['pricePerSlot'].setValue(us.pricePerSlot);
  this.form.controls['type'].setValue(us.type);
  this.form.controls['maxCapacity'].setValue(us.maxCapacity);
  this.form.controls['advanceBookingLimitInDays'].setValue(us.advanceBookingLimitInDays);


 }
 AmenityUpdate(){
  //this.societyId= sessionStorage.getItem('societyId');

   console.log(this.getparamid);
   console.log(this.societyId);
   const result = window.confirm('Are you sure you want to edit this Amenity Details?');
   if (result) {
    this.loading = true;
     console.log('confirmed');
 {
   
    
     
     this.service.updateAmenity(
      {amenityId:this.getparamid,
        name:this.form.value.name,
        pricePerSlot:this.form.value.pricePerSlot,
        maxCapacity:this.form.value.maxCapacity,
        type:this.form.value.type,
        advanceBookingLimitInDays:this.form.value.advanceBookingLimitInDays

      
      } ).subscribe((res)=>{
       confirm( 'Updated Successfully...');
       this.loading = false;
         this.getAllData();
         this.form.reset();
         console.log(res);
         location.reload();

     },(error) => {
      this.loading = false;
      alert(error.error.message);
      console.error('Error:', error);
    });
    }
  }else {
    this.loading = false;
    this.form.reset();
    console.log('Delete canceled');
  }
 }


 AmenityRemove(amenityId: any) {
  console.log('Selected Amenity ID:', amenityId);
  const result = window.confirm('Are you sure you want to remove this Amenity?');
  
  if (result) {
    this.loading = true;
   

    this.service.removeAmenity({ amenityId: amenityId }).subscribe(
      (res) => {
        alert('Remove Successfully...');
        this.loading = false;
        this.getAllData(); // Refresh the data
      },
      (error) => {
        alert(error.error.message || 'Error occurred while deleting.');
        this.loading = false;
        console.error('Error:', error);
      }
    );
  } else {
    console.log('Delete canceled');
    this.loading = false;
  }
}

}

