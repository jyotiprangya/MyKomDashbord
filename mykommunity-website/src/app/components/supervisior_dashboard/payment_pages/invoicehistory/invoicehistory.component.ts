import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';
import { DownloadConfirmDialogComponent } from '../../download-confirm-dialog/download-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-invoicehistory',
  templateUrl: './invoicehistory.component.html',
  styleUrls: ['./invoicehistory.component.css']
})
export class InvoicehistoryComponent implements OnInit {

 
  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  invoiceForm!: UntypedFormGroup;
  sortDirection: { [key: string]: boolean } = {};
  isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;
  filteredData: any[] = [];
  enabledBlocks: any[] = [];  
  disabledBlocks: any[] = [];
  searchTerm: string = ''; 
  originalData: any[] = []; 


  constructor(
    private service:ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
     private modalService: NgbModal,
      private _location: Location,private dialog:MatDialog) { }

  readData2:any = []; 
  readData:any = [];
  showScreen = false;

  showScreen2 = false;
  showScreen3 = false;

  totalLength:any;
  page:number=1;
  lastName:any;
  firstName:any;
   

  ngOnInit(): void {
  this.getAllData();
  this.updateColumnLists();
  // this.loadData();
  this.firstName = sessionStorage.getItem('firstName');
  this.lastName = sessionStorage.getItem('lastName');
  
  }
  back(){
    this._location.back();
  }
  invoicegrp(){
    this.router.navigate(['/supervisor/paymentdashboard/invoicegrp']);
  }

getAllData() {
  this.service.getinvoice_grp().subscribe((res) => {
    console.log(res, "res==>");
     this.originalData = res.data;          // ✅ Store full data
    this.readData2 = [...res.data];
    
    // Simply reverse the array
    this.readData2.reverse();
    
    this.totalLength = this.readData2.length;
  });
}
  togglePerOne(){ 
    if (this.allSelected.selected) {  
     this.allSelected.deselect();
     //return false;
 }
   if(this.searchUserForm.controls.userType.value.length==this.readData2.length)
     this.allSelected.select();
 
 }
   toggleAllSelection() {
     if (this.allSelected.selected) {
       this.searchUserForm.controls.userType
         .patchValue([...this.readData2.map((item: { name: any; }) => item.name), 0]);
     } else {
       this.searchUserForm.controls.userType.patchValue([]);
     }
   }

   
  // loadData() {
  //   this.service.getinvoice_grp().subscribe((res) => {
  //     console.log(res, "res==>");
      
  //     this.originalData = res.data; // Store unfiltered full dataset
  //     this.readData2 = [...this.originalData]; // Initialize table data
  //     this.totalLength = this.readData2.length;
  //   }, error => {
  //     console.error("Error fetching vendor data:", error);
  //   });
  // }
  
  
  searchData() {
    if (!this.searchTerm.trim()) { 
      // Restore the full dataset from originalData
      this.readData2 = [...this.originalData]; 
    } else {
      const searchValue = this.searchTerm.toLowerCase();
      this.readData2 = this.originalData.filter((us: { 
        chargeName?: string;
        amount?:string;
        type?: string;
        gracePeriod?: string | number;
        fine?: string | number;
        billDate?: string;
        dueDate?: string;
      }) => 
        ( us.chargeName?.toLowerCase().includes(searchValue) ||
        us.amount?.toLowerCase().includes(searchValue) ||
          us.type?.toLowerCase().includes(searchValue) ||
          us.gracePeriod?.toString().includes(searchValue) ||
          us.fine?.toString().includes(searchValue) ||
          us.billDate?.toLowerCase().includes(searchValue) ||
          us.dueDate?.toLowerCase().includes(searchValue)
        )
      );
    }
    // Update total length for pagination
    this.totalLength = this.readData2.length;
}



   columns = [
    { name: 'Invoice Number', visible: true },
    { name: 'Charge Name', visible: true },
    { name: 'Amount', visible: true },
    { name: 'Grace Period(in days)', visible: true },
    { name: 'Fine', visible: true },
    { name: 'Charge Date', visible: true },
    { name: 'Due Date', visible: true },
    { name: 'GST', visible: true },
    { name: 'Round Off', visible: true },
    { name: 'Cancel', visible: true },
    { name: 'Send', visible: true },
    { name: 'Created By', visible: true }
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
     
         this.downloadCSV(csvContent, 'InvoiceHistory_log.csv');
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
        case 'Invoice Number': return 'billgroupId';
        case 'Charge Name': return 'chargeName';
        case 'Amount': return 'amount';
        case 'Grace Period(in days)': return 'gracePeriod';
        case 'Fine': return 'fine';
        case 'Charge Date': return 'billDate';
        case 'Due Date': return 'dueDate';
        case 'GST': return 'isGst';
        case 'Round Off': return 'isRoundOff';
        case 'Cancel': return 'cancel';
        case 'Send': return 'send';
        case 'Created By': return 'createdBy';
        default: return '';
      }
    }
    
}

