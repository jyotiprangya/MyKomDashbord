import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { DownloadConfirmDialogComponent } from '../../download-confirm-dialog/download-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-chartofaccnt',
  templateUrl: './chartofaccnt.component.html',
  styleUrls: ['./chartofaccnt.component.css']
})
export class ChartofaccntComponent implements OnInit {

  constructor(
    private service:ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
     private modalService: NgbModal,
      private _location: Location,private dialog: MatDialog,) { }
  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;
  readData:any = []; 
  readData2:any = [];
  getparamid:any;
  filteredData:any =[];
  totalLength:any;
  page:number = 1; 
  role=sessionStorage.getItem('role');
  sortDirection: { [key: string]: boolean } = {};
  isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;
 
  enabledBlocks: any[] = [];  
  disabledBlocks: any[] = [];
  searchTerm: string = ''; 
  originalData: any[] = []; 


  ngOnInit(): void {

    this.getAllData();
    this.getAllgeneralLedgerData();
    this.updateColumnLists();
    // this.loadData();


    this.form = this.formBuilder.group({
      accountName: [null, [Validators.required]],
      generalLedgerID: [null, [Validators.required]]

    });
  }

  back(){
    this._location.back();
  }
  onCancelClick(){
    this.getparamid = "";
   
    this.form.reset();
    

   
  }

  getAllData(){
    this.service.getChartOfAccount().subscribe((res)=>{
      console.log(res,"res==>");
     this.originalData = res.data;          // ✅ Store full data
    this.readData2 = [...res.data];
      this.totalLength = (res.data).length;

     
    });
  }
  getAllgeneralLedgerData(){
    this.service.getGeneralLedger().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
      this.filteredData = res.data.filter((item: { disabled: boolean; }) => item.disabled === false);

     
    });
  }
  open(content: any) {

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  
  // loadData() {
  //   this.service.getChartOfAccount().subscribe((res) => {
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
        accountName?: string; 
        createdAt?: string | number; 
        generalLedgerName?: string; 
        subCatagory?: string; 
       
      }) => 
        (us.accountName?.toLowerCase().includes(searchValue) || 
         us.createdAt?.toString().includes(searchValue) ||
         us.generalLedgerName?.toLowerCase().includes(searchValue) ||
         us.subCatagory?.toLowerCase().includes(searchValue) 
)
      );
    }
    // Update total length for pagination
    this.totalLength = this.readData2.length;
  }
  


  
  columns = [
    { name: 'Name', visible: true },
    { name: 'General Ledger', visible: true },
    { name: 'Sub Category', visible: true },
    { name: 'Created Date', visible: true },
    { name: 'Edit', visible: true },
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
    
        this.downloadCSV(csvContent, 'Account_log.csv');
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
        case 'Name': return 'accountName';
        case 'General Ledger': return 'generalLedgerName';
        case 'Sub Category': return 'subCatagory';
        case 'Created Date': return 'createdAt';
        default: return '';
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
saveDetails(form:any) {
  const result = window.confirm('Are you sure you want to add this chart Of Account to your Society?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
  if(this.form.valid)
  {
    console.log(this.form.value);
    this.service.createChartOfAccount(this.form.value).subscribe((res)=>{
      console.log(res,'res==>');
      this.loading = false;
      this.form.reset();
      this.getAllData();
      this.onCancelClick();
    });
  }
}else {
  this.loading = false;
  this.form.reset();
  console.log('Delete canceled');
}
}



OnEdit(us:any,form:any){
   
  this.getparamid = us.chartOfAccountId;
  console.log(this.getparamid);

  this.form.controls['generalLedgerID'].setValue(us.generalLedgerID);
  this.form.controls['accountName'].setValue(us.accountName);
 
 }
 COAUpdate(){
   console.log(this.getparamid);
   console.log(this.form.value,'updated');
   const result = window.confirm('Are you sure you want to change these chart of account details?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
   if(this.form.valid)
   {
     
     this.service.updateChartOfAccount(
      {
        chartOfAccountId:this.getparamid,
        generalLedgerID:this.form.value.generalLedgerID,
        accountName:this.form.value.accountName,
        
      } 
      ).subscribe((res)=>{
       alert( 'Updated Successfully...');
       this.loading = false;
         this.getAllData();
         this.onCancelClick();
     });
   }
  }else {
    this.loading = false;
    this.form.reset();
    this.onCancelClick();
    console.log('Delete canceled');
  }
 }

}
