import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { Console } from 'console';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../../download-confirm-dialog/download-confirm-dialog.component';

@Component({
  selector: 'app-rentalunitsetup',
  templateUrl: './rentalunitsetup.component.html',
  styleUrls: ['./rentalunitsetup.component.css']
})
export class RentalunitsetupComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;
  id: any;
  selectedBlock: any = {
    id:0, block_name:''
  };
  floor: any;
  constructor(private service:ApiService,private fb: UntypedFormBuilder,
     private modalService: NgbModal, private _location: Location,private dialog: MatDialog,) { }
  getparamid:any;

  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  readData3:any = [];
  readData4:any = [];
  societyId=sessionStorage.getItem('societyId');
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
  
debitHasValue = false;
creditHasValue = false;

  
  ngOnInit(): void {
    this.getAllflatData();
    this.getAllData();
    this.getAllhousetypeData();
    this.updateColumnLists();
    // this.loadData();
    

    this.form = this.fb.group({
      flatId: [null],
      area:[null],
      credit: [0],
      debit: [0],
      houseTypeId: [null],
      securityDeposit:[0],
     // socityId: [this.societyId]
    });

    
  }


onDebitChange(event: any): void {
  const value = event.target.value;
  this.debitHasValue = value && value.trim() !== '' && value !== '0';

  if (this.debitHasValue) {
    // Clear credit and disable it
    this.form.get('credit')?.setValue('');
    this.creditHasValue = false;
    this.form.get('credit')?.disable();
  } else {
    this.form.get('credit')?.enable();
  }
}

onCreditChange(event: any): void {
  const value = event.target.value;
  this.creditHasValue = value && value.trim() !== '' && value !== '0';

  if (this.creditHasValue) {
    // Clear debit and disable it
    this.form.get('debit')?.setValue('');
    this.debitHasValue = false;
    this.form.get('debit')?.disable();
  } else {
    this.form.get('debit')?.enable();
  }
}
// Keep your existing form control getters
get debitControl() {
  return this.form.get('debit');
}

get creditControl() {
  return this.form.get('credit');
}
  

  getAllflatData(){
    this.service.getFlat().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
    });
  }
  
  back(){
    this._location.back();
  }
  
  getAllhousetypeData(){
    this.service.getHouseType().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData4 = res.data;
 });
  }
  getAllData(){
    this.service.getrentalunitsetup().subscribe((res)=>{
      console.log(res,"res==>");
      this.originalData = res.data;          // ✅ Store full data
    this.readData2 = [...res.data];
     this.totalLength = (res.data).length;

    
    });
  }

  // loadData() {
  //   this.service.getrentalunitsetup().subscribe((res) => {
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
        blockName?: string;
        floorName?: string;
        rentalUnitName?: string;
        type?: string;
        area?: string;
        houseType?: string;
        debit?: string | number;
        credit?: string | number;
        securityDeposit?: string | number;
      }) => 
        (`${us.blockName} - ${us.floorName} - ${us.rentalUnitName} - ${us.type}`.toLowerCase().includes(searchValue) ||
         us.area?.toLowerCase().includes(searchValue) ||
         us.houseType?.toLowerCase().includes(searchValue) ||
         us.debit?.toString().includes(searchValue) ||
         us.credit?.toString().includes(searchValue) ||
         us.securityDeposit?.toString().includes(searchValue)
        ));
    }
    // Update total length for pagination
    this.totalLength = this.readData2.length;
}


  columns = [
    { name: 'Door Number', visible: true },
    { name: 'Area', visible: true },
    { name: 'House-Type', visible: true },
    { name: 'Due', visible: true },
    { name: 'Advance', visible: true },
    { name: 'Security Deposit', visible: true },
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
  
      this.downloadCSV(csvContent, 'HousingUnit_log.csv');
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
      case 'Door Number': return 'rentalUnitName';
      case 'Area': return 'area';
      case 'House-Type': return 'houseType';
      case 'Due': return 'debit';
      case 'Advance': return 'credit';
      case 'Security Deposit': return 'securityDeposit';
      case 'Edit': return 'edit';
      default: return '';
    }
  }
  
 
  // onSelect(event:any){
  //   console.log(event);
  //   this.service.getFloorById(event.target.value).subscribe((res)=>{
     
  //   this.readData4 = res.data;
    
  //   });
  
  // }

  
  
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.form.reset();


    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

      this.form.reset();

    });
  }
  onCancelClick(){
    this.getparamid = "";
   
    this.form.reset();
    

   
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {

      this.form.reset();

      return 'by pressing ESC';

    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {

      this.form.reset();

      return 'by clicking on a backdrop';

    } else {

      this.form.reset();

      return `with: ${reason}`;
    }

  }
 

saveDetails(form:any) {
  const result = window.confirm('Are you sure you want to add this?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
  if(this.form.valid)
  {
    console.log(this.form.value);
    this.service.createRentalunitsetup(this.form.value).subscribe((res)=>{
      console.log(res,'res==>');
      alert( "RentalSetup added Successfully...");
      this.loading = false;
      this.form.reset();
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
  this.onCancelClick();
  this.form.reset();
  console.log('Delete canceled');
}
}



OnEdit(us:any,form:any){
   
  this.getparamid = us.rentalSetupId;
  console.log(this.getparamid);

  this.form.controls['flatId'].setValue(us.flatId);
  this.form.controls['area'].setValue(us.area);
  this.form.controls['debit'].setValue(us.debit);
  this.form.controls['credit'].setValue(us.credit);
  this.form.controls['houseTypeId'].setValue(us.houseTypeId);

 }
 RentalsetupUpdate(){
   console.log(this.getparamid);
   console.log(this.form.value,'updated');
   const result = window.confirm('Are you sure you want to change these following details?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
   if(this.form.valid)
   {
     
     this.service.updateRentalunitsetup(
      {
        rentalSetupId:this.getparamid,
        flatId:this.form.value.flatId,
        area:this.form.value.area,
        debit:this.form.value.debit,
        credit:this.form.value.credit,
        houseTypeId:this.form.value.houseTypeId,
       // socityId: this.societyId

      } 
      ).subscribe((res)=>{
        
        console.log(res,'res==>');
        alert(res.data.message);
        this.loading = false;
        this.form.reset();

       alert( 'Updated Successfully...');
         this.getAllData();
         this.onCancelClick();
     },(error) => {
      this.loading = false;
      this.form.reset();
      this.onCancelClick();
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
 



}




