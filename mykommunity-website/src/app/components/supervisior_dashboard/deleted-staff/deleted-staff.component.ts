import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';


@Component({
  selector: 'app-deleted-staff',
  templateUrl: './deleted-staff.component.html',
  styleUrls: ['./deleted-staff.component.css']
})
export class DeletedStaffComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;
  role=sessionStorage.getItem('role');

  map: any ={
    false: "Out",
    true: "Inside"
  }
  downloadURL: Observable<string> | undefined;
  Percentage:Observable<any> | undefined ;
  snapshot!: Observable<any>;

  constructor(
    
    private service:ApiService,
    private fb: UntypedFormBuilder, 
    private _location: Location,
     private dialog: MatDialog,
  
    ) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  deletedData:any = [];

  readData2:any = [];
  readData3:any = [];
  getparamid:any;
  getStaffid:any;

  societyId:any;
  firebase :any = null;
  path!: string;
  read:any;
  getidimg:String | undefined;
  searchDailyhelp:any = "";
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
    // this.getAllData();
    this.getDeletedStaffData();
    this.updateColumnLists();

    this.form = this.fb.group({
      name: [null, [Validators.required]],
      dailyHelpProviderCode: [null, [Validators.required, Validators.minLength(6)]],
      mobileNumber: [null],
      dailyHelpCategory: [null, [Validators.required]],
      image:[null]
    });
  }
  columns = [
    { name: 'Profile', visible: true },
    { name: 'Name', visible: true },
    { name: 'Contact Number', visible: true },
    { name: 'Service', visible: true },
    { name: 'Passcode', visible: true },
    { name: 'In/Out Status', visible: true },
    { name: 'deletedOn', visible: true },
  ];

 
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
   
 
  cancelChanges() {
    this.hiddenColumns.forEach(column => column.selected = false);
    this.displayedColumns.forEach(column => column.selected = false);
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
         if (column === 'In/Out Status') {
          exportEntry[column] = entry[key] ? "Inside" : "Out";
        } else {
          exportEntry[column] = entry[key]; 
        }
               
                console.log(`Mapping column "${column}" to key "${key}" with value: ${entry[key]}`);
                exportEntry[column] = entry[key];
            
        });
        
        console.log('Export Entry:', exportEntry);
        return exportEntry;
    });

    const csvContent = this.convertToCSV(dataToExport);
    console.log('CSV Content:', csvContent); 

    this.downloadCSV(csvContent, 'removed_societystaff_log.csv');
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
    if (link.download !== undefined) {
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
    case 'Profile': return 'profile';
    case 'Name': return 'name';
    case 'Contact Number': return 'mobileNumber';
    case 'Service': return 'dailyHelpCategory';
    case 'Passcode': return 'dailyHelpProviderCode';
    case 'In/Out Status': return 'isInside';
    case 'deletedOn': return 'updatedAt';
    default: return '';
  }
}

   
  // getAllData(){
  //   this.service.getSocietydailyHelpProvider().subscribe((res)=>{
  //     console.log(res,"res==>");
  //     this.readData = res.data;
  //     this.totalLength = (res.data).length;
  //   });
  // }

  getDeletedStaffData(){
    this.service.getRemovedSocietydailyHelpProvider().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
    });
  }
  
  back(){
    this._location.back();
  }

  onCancelClick(){
    this.getparamid = "";
    this.form.reset();
    this.firebase = null;
    this.Percentage = undefined ;
   
  }
  
  restoreStaff(us:any){
    this.getStaffid = us.id  ;
    console.log(this.getStaffid);
 // console.log(us.disabled);
    const result = window.confirm('Are you sure you want to restore this staff?');
      if (result) {
        console.log('confirmed');
     
      console.log(us.disabled);
      this.service.restoreSocietyDailyHelpProvider({id:this.getStaffid}).subscribe(()=>{
         alert( 'Staff Restored Successfully...');
        // confirm()
  
        console.log('confirmed');
       // console.log(us.disabled);
     this.onCancelClick();
     this.getDeletedStaffData();
    });
   } else
  {
    this.onCancelClick();
   // console.log(us.disabled);
  }

   }

   
  
  
  
  
  
  }
