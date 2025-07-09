import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';
import { DownloadConfirmDialogComponent } from '../../download-confirm-dialog/download-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-paymentintimation',
  templateUrl: './paymentintimation.component.html',
  styleUrls: ['./paymentintimation.component.css']
})
export class PaymentintimationComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  invoiceForm!: UntypedFormGroup;


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
  role=sessionStorage.getItem('role');
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


   

  ngOnInit(): void {
  this.getAllData();
  this.updateColumnLists();
  // this.loadData();
  

  }
  back(){
    this._location.back();
  }
  settledues(){
    this.router.navigate(['/supervisor/paymentdashboard/settledues']);
  }

   getAllData(){
    this.service.getrental_transaction().subscribe((res)=>{
      console.log(res,"res==>");
      // this.readData2 = res.data;
       this.originalData = res.data;          // ✅ Store full data
    this.readData2 = [...res.data];
      // this.readData = res.data.filter((transaction:any) => transaction.RentalTransactionID === "a8583d27-09ee-4f99-ae52-f82f407014ba");
      // console.log(this.readData);

      this.totalLength = (res.data).length;

     
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

  //  loadData() {
  //   this.service.getrental_transaction().subscribe((res) => {
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
        date?: string;
        blockName?: string; 
        floorName?: string; 
        rentalUnitName?: string; 
        firstName?: string;
        lastName?:string;
        paymentMode?: string;
        chequeBankName?: string;
        chequeBankBranch?: string;
        chequeNo?: string | number;
        chequeDate?: string;
        amount?: string | number;
        reference?: string;
        description?: string;
        document?: string;
        status?: string;
        log?: string;
      }) => 
        ( us.date?.toLowerCase().includes(searchValue) ||
          `${us.blockName} ${us.floorName} ${us.rentalUnitName}`.toLowerCase().includes(searchValue) ||
          `${us.firstName} ${us.lastName}`.toLowerCase().includes(searchValue) ||
          us.paymentMode?.toLowerCase().includes(searchValue) ||
          us.chequeBankName?.toLowerCase().includes(searchValue) ||
          us.chequeBankBranch?.toLowerCase().includes(searchValue) ||
          us.chequeNo?.toString().includes(searchValue) ||
          us.chequeDate?.toLowerCase().includes(searchValue) ||
          us.amount?.toString().includes(searchValue) ||
          us.reference?.toLowerCase().includes(searchValue) ||
          us.description?.toLowerCase().includes(searchValue) ||
          us.status?.toLowerCase().includes(searchValue) ||
          us.log?.toLowerCase().includes(searchValue)
        )
      );
    }
    // Update total length for pagination
    this.totalLength = this.readData2.length;
}


   
   columns = [
    { name: 'Date', visible: true },
    { name: 'Door Number', visible: true },
    { name: 'Owner Name', visible: true },
    { name: 'Mode Of Payment', visible: true },
    { name: 'Bank Name', visible: true },
    { name: 'Bank branch', visible: true },
    { name: 'Cheque Number', visible: true },
    { name: 'Cheque Date', visible: true },
    { name: 'Amount', visible: true },
    { name: 'Reference', visible: true },
    { name: 'Description', visible: true },
    { name: 'Document', visible: true },
    { name: 'Status', visible: true },
    { name: 'Log', visible: true },
    { name: 'Check Details', visible: true }
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
  
      this.downloadCSV(csvContent, 'PaymentIntimation_log.csv');
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
      case 'Date': return 'date';
      case 'Door Number': return 'rentalUnitName';
      case 'Owner Name': return 'ownerName';
      case 'Mode Of Payment': return 'paymentMode';
      case 'Bank Name': return 'chequeBankName';
      case 'Bank branch': return 'chequeBankBranch';
      case 'Cheque Number': return 'chequeNo';
      case 'Cheque Date': return 'chequeDate';
      case 'Amount': return 'amount';
      case 'Reference': return 'reference';
      case 'Description': return 'description';
      case 'Document': return 'attachment';
      case 'Status': return 'paymentStatus';
      case 'Log': return 'log';
      case 'Check Details': return 'checkDetails';
      default: return '';
    }
  }
  
}



