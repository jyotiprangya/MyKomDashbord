import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../../download-confirm-dialog/download-confirm-dialog.component';
@Component({
  selector: 'app-generalledger',
  templateUrl: './generalledger.component.html',
  styleUrls: ['./generalledger.component.css']
})
export class GeneralledgerComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;
  loading = false;
  closeResult: any;
  getparamid:any;

  totalLength:any;
  page:number = 1;
  map: any ={
    false: "Active",
    true: "Inactive"
  }
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
  readData:any = [];
  searchTerm: string = ''; 
  originalData: any[] = [];

  constructor(
    private service:ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
     private modalService: NgbModal,
      private _location: Location,private dialog: MatDialog) { }

  readData2:any = []; 
  



  societyId=sessionStorage.getItem('societyId');


  ngOnInit(): void {
  this.getAllData();
  this.updateColumnLists();
  // this.loadData();
  

  this.form = this.formBuilder.group({
    generalLedgerName: [null],
    subCatagory:[null],
    socityId: [this.societyId]

   
  });

}


// loadData() {
//   this.service.getGeneralLedger().subscribe((res) => {
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
      generalLedgerName?: string; 
      subCatagory?: string; 
     
    }) => 
      (us.generalLedgerName?.toLowerCase().includes(searchValue) || 
       us.subCatagory?.toLowerCase().includes(searchValue) 
     
    ));
  }
  // Update total length for pagination
  this.totalLength = this.readData2.length;
}



columns = [
  { name: 'GL Name', visible: true },
  { name: 'SubCategory', visible: true },
  { name: 'Status', visible: true },
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
  
      this.downloadCSV(csvContent, 'GeneralLedger_log.csv');
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
      case 'GL Name': return 'generalLedgerName';
      case 'SubCategory': return 'subCatagory';
      case 'Status': return 'status';
      default: return '';
    }
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
  onCancelClick(){
    this.getparamid = "";
   
    this.form.reset();
    

   
  }
  saveDetails(form:any) {
    const result = window.confirm('Are you sure you want to add this General Ledger?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
    if(this.form.valid)
    {
      console.log(this.form.value);
      this.service.createGeneralLedger(this.form.value).subscribe((res)=>{
        console.log(res,'res==>');
        this.loading = false;
        this.form.reset();
        this.getAllData();
        this.onCancelClick();
      },(error) => {
        this.loading = false;
        this.form.reset();
        this.onCancelClick();
  
        alert("error.....");
        console.error('Error:', error);
        // You can show an error message to the user if needed
      });
    }
  }else {
    this.loading = false;
    this.form.reset();
    this.onCancelClick();
    console.log('Delete canceled');
  }
  }
  
  
  
  OnEdit(us:any,form:any){
     
    this.getparamid = us.generalLedgerID;
    console.log(this.getparamid);
  
    this.form.controls['generalLedgerName'].setValue(us.generalLedgerName);
    this.form.controls['subCatagory'].setValue(us.subCatagory);
   
   }
   LedgerUpdate(){
     console.log(this.getparamid);
     console.log(this.form.value,'updated');
     const result = window.confirm('Are you sure you want to change these following details?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
     if(this.form.valid)
     {
       
       this.service.updateGeneralLedger(
        {
          generalLedgerID:this.getparamid,
          generalLedgerName:this.form.value.generalLedgerName,
          subCatagory:this.form.value.subCatagory,
          
        } 
        ).subscribe((res)=>{
         alert( 'Updated Successfully...');
         this.loading = false;
           this.getAllData();
           this.onCancelClick();
       },(error) => {
        this.loading = false;
        this.form.reset();
  
        alert(error.error.message);
        console.error('Error:', error.error.message);
        // You can show an error message to the user if needed
      });
     }
    }else {
      this.loading = false;
      this.form.reset();
      this.onCancelClick();
      console.log('Delete canceled');
    }
   }
   
   UpdateButton(us:any){
    this.getparamid = us.generalLedgerID  ;
    console.log(this.getparamid);
    console.log(us.disabled);
  
    const result = window.confirm('Are you sure you want to change Ledger status?');
      if (result) {
        console.log('confirmed');
        console.log(us.disabled);

     if((us.disabled) == false){
     console.log('confirmed');
     console.log(us.disabled);


     
      console.log(this.map[us.disabled]);
      this.service.disableGeneralLedger({generalLedgerID:this.getparamid}).subscribe((res)=>{
        // alert( 'User Approved Successfully...');
        // confirm()
  
        console.log('confirmed');
        console.log(us.rentalUnitStatus);
        (us.rentalUnitStatus); 
     this.getAllData();
    });
      } else if(((us.disabled) == true)) {
        console.log(this.map[us.disabled]);
      this.service.enableGeneralLedger({generalLedgerID:this.getparamid}).subscribe((res)=>{
        // alert( 'User Approved Successfully...');
        // confirm()
  
        console.log('confirmed');
        console.log(us.disabled);
     this.getAllData();
        console.log('Delete canceled');
      });}
    
     
  
  }
  else
  {
    console.log(this.map[us.disabled]);
  }
   }
  
  
  invoice(){
    this.router.navigate(['/supervisor/paymentdashboard/generateinvoice']);
  }

   getAllData(){
    this.service.getGeneralLedger().subscribe((res)=>{
      console.log(res,"res==>");
       this.originalData = res.data;          // ✅ Store full data
    this.readData2 = [...res.data];
     
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
}


