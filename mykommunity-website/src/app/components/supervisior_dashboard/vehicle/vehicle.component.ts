import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit {

  closeResult: any;
  closeResult2: any;

  form:any= UntypedFormGroup;
  form2:any= UntypedFormGroup;
  loading = false;
  searchVehicle:any = "";
  searchTerm:any = "";
  sortDirection: { [key: string]: boolean } = {};
  isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;
  filteredData: any[] = [];
  selectedIds: String[] = [];
  filteredLength: number = 0;

  role=sessionStorage.getItem('role');


  constructor(
    private service:ApiService,
    private af:AngularFireStorage,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal, 
    private _location: Location,private cdr: ChangeDetectorRef,private dialog: MatDialog,) { }

  getparamid:any;
  getid:any;
  totalLength:any;
  page:number=1;
  showScreen = false;

  readData:any = [];
  readData2:any = [];
 
  map: any ={
    0: "Approved",
    1: "NotApproved"
  }
  map3: any ={
    TWO_WHEELER: "Two Wheeler",
    FOUR_WHEELER: "Four Wheeler"
  }
   map2: any ={
    false: "Tenant",
    true: "Owner"
  }
  community_id:any;
  // getidimg: any = null;




  ngOnInit(): void {
    this.getAllData();
    this.updateColumnLists();

    this.form = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2)]],
      number: [null, [Validators.required, Validators.minLength(2)]],
      image: [null],
      type: [null, [Validators.required]]
     
    });
   
  }
  

  columns = [
    { name: 'Vehicle Image', visible: true },
    { name: 'Name', visible: true },
    { name: 'Vehicle Number', visible: true },
    { name: 'Type', visible: true },
    { name: 'Vehicle Owner', visible: true },
    { name: 'Owner Number', visible: true },
    { name: 'Block', visible: true },
    { name: 'Flat No', visible: true },
    { name: 'CreatedOn', visible: true },
    { name: 'Last Update', visible: true },
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
    const column = this.columns.find(col => col.name === columnName);
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
  
  private mapColumnToKey(columnName: string, entry: any): any {
    switch (columnName) {
      case 'Vehicle Image': return entry.image || '';  // Ensure it returns a default value if image is null
      case 'Name': return entry.name || '';  // Return default if name is null
      case 'Vehicle Number': return entry.number || '';  // Return default if number is null
      case 'Type': return entry.type || '';  // Return default if type is null
      case 'Vehicle Owner': return entry.userFirstName ? `${entry.userFirstName} ${entry.userlastName}` : '';
      case 'Owner Number': return entry.userMobileNumber || '';  // Return default if userMobileNumber is null
      case 'Block': return entry.renatlUnit.blockName || '';  // Return default if blockName is null
      case 'Flat No': return entry.renatlUnit.rentalUnitName || '';  // Return default if rentalUnitName is null
      case 'CreatedOn': return entry.createdAt || '';  // Return default if createdAt is null
      case 'Last Update': return entry.updatedAt || '';  // Return default if updatedAt is null
      case 'Edit': return entry.edit || '';  // Return default if edit is null
      case 'Delete': return entry.delete || '';  // Return default if delete is null
      default: return '';  // Return empty string for unrecognized column names
    }
  }
  
  
  exportData(): void {
    const dialogRef = this.dialog.open(DownloadConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
        if (result) {
            // Proceed with CSV download if the user confirmed
            this.downloadCSVfile();
        }
    });
    
}

downloadCSVfile(): void {
  console.log('Filtered Data:', this.readData); 

  const visibleColumns = this.columns
      .filter(col => col.visible && col.name !== 'Actions')
      .map(col => col.name);
  
  // Log the visible columns
  console.log('Visible Columns:', visibleColumns);

  // Mappings for the specific fields
 
  const dataToExport = this.readData.map((entry: { [x: string]: any; }) => {
      const exportEntry: any = {};
      
      visibleColumns.forEach(column => {
        // Pass both column and entry to mapColumnToKey
        exportEntry[column] = this.mapColumnToKey(column, entry);
    });
      
      // Log the constructed export entry
      console.log('Export Entry:', exportEntry);
      return exportEntry;
  });

  // Convert data to CSV format
  const csvContent = this.convertToCSV(dataToExport);
  console.log('CSV Content:', csvContent); // Log to see what the CSV content looks like

  // Download the CSV file
  this.downloadCSV(csvContent, 'vehicle_log.csv');
  console.log('CSV downloaded');
}

private convertToCSV(data: any[]): string {
    if (data.length === 0) {
        return '';
    }

    // Create the CSV header
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
 
sortData(column: string): void {
  this.sortDirection[column] = !this.sortDirection[column]; // Toggle the sort direction for the column
  this.readData.sort((a: any, b: any) => {
    const direction = this.sortDirection[column] ? 1 : -1;
    return a[column] > b[column] ? direction : -direction;
  });
}

  
  getAllData(){

    this.service.getVehiclelist().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
     
      this.readData.sort((a:any, b:any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      this.totalLength = (res.data).length;
      console.log(this.readData);
      console.log(this.totalLength);
      
    });

  }
 
 
  
  onImageError(event: any) {
    event.target.src = 'assets/logo.jpg';
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
     // //location.reload();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
     // //location.reload();
      return 'by clicking on a backdrop';
    } else {
     // //location.reload();
      return` with: ${reason}`;
    }

  }
  onCancelClick(){
    this.getparamid = "";
    this.form.reset();
    this.firebase = null;
    this.Percentage = undefined ;
   
  }
  SelectedImage:any;
  media:any;
  firebase :any = null;
  downloadURL: Observable<string> | undefined;
  Percentage:Observable<any> | undefined ;

  upload(event:any){

   
    var file = event.target.files[0];
   
    var n = Date.now();
   // const file = event.target.files[i];
   //const filePathinlocal = ${this.basePath}/${file.name};  
   this.media = file;
   console.log(file);
   var reader = new FileReader()
   reader.readAsDataURL(event.target.files[0])
   reader.onload = (event:any)=>{
    //  this.SelectedImage = event.target.result;
   }
    const filePath =` vehicle/${n}`;
    const fileRef = this.af.ref(filePath);
    const task = this.af.upload(`vehicle/${n}`, file);
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
 
onCancel(){
  this.firebase = null;
  console.log(this.firebase);
}
  

     OnEdit(us:any){
 
      this.getparamid = us.id;
      this.firebase = us.image;

      console.log(this.getparamid);
      this.form.controls['name'].setValue(us.name);
      this.form.controls['number'].setValue(us.number);
      this.form.controls['type'].setValue(us.type);
      this.form.controls['image'].setValue(us.image);
    }
     vehicleUpdate(){
       console.log(this.getparamid);
       console.log(this.form.value,'updated');
console.log(this.form.value.isOwner  );
const result = window.confirm('Are you sure you want to change UserDetail?');
if (result) {
  this.loading = true;
  console.log('confirmed');
         this.service.updateVehicle({
          id:this.getparamid,
          name:this.form.value.name,
          number:this.form.value.number,
          image:this.firebase,
          type:this.form.value.type

                      } ).subscribe((res)=>{
           alert( 'Updated Successfully...');

          // this.form.reset();
          this.loading = false;
           this.getAllData(); 
           this.onCancelClick();
           //location.reload();
         },(error) => {
          alert(error.error.message);
          this.loading = false;
          console.error('Error:', error);
          // You can show an error message to the user if needed
        });
        }else {
          this.loading = false;
          this.form.reset();
          this.onCancelClick();
          console.log('Delete canceled');
        }
     }
     deleteID(us:any)
     {
       const result = window.confirm('Are you sure you want to Delete this Vehicle?');
       if (result) {
         console.log('confirmed');
       this.service.deleteVehicle({ vehicleId: us}).subscribe((res)=>{
         console.log(res,'deleteres==>');
         alert("Record Deleted Successfully...");
           this.getAllData();
           this.onCancelClick();
           //location.reload();
      
       },(error) => {
         alert(error.error.message);
         console.error('Error:', error);
         // You can show an error message to the user if needed
       });
        }else {
         this.form.reset();
         this.onCancelClick();
         console.log('Delete canceled');
       }
     } 

}