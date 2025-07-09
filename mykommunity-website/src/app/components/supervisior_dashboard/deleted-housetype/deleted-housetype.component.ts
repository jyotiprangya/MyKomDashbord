import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deleted-housetype',
  templateUrl: './deleted-housetype.component.html',
  styleUrls: ['./deleted-housetype.component.css']
})
export class DeletedHousetypeComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;
  constructor(private service:ApiService,private fb: UntypedFormBuilder, private modalService: NgbModal,
     private _location: Location,private dialog: MatDialog,private router:Router) { }

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
  disabledHouseTypes: any[] = [];
  map: any ={
    true: "Inactive",
    false: "Active"
  }
  role=sessionStorage.getItem('role');

  ngOnInit(): void {
   this.getAllData();
   this.getAllFlatData();
   this.updateColumnLists();

  this.form = this.fb.group({
    houseType:['']
  });

}



columns = [
  { name: 'House Type', visible: true },
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
    
        this.downloadCSV(csvContent, 'Housetype_log.csv');
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
        case 'House Type': return 'houseType';
     
        case 'Edit': return 'edit';
        case 'Delete': return 'delete';
       
        default: return '';
      }
    }
    getAllData() {
      this.service.getHouseType().subscribe((res) => {
        console.log(res, "res==>");
        this.readData = res.data;
    
        // Filter only disabled house types where disabled is true
        this.disabledHouseTypes = this.readData.filter((house: any) => house.disabled === true);
    
        this.totalLength = this.disabledHouseTypes.length; // Update total length for pagination
    
        console.log("Disabled House Types:", this.disabledHouseTypes); // Debugging output
      });
    }
    
    


getAllFlatData(){
  this.service.getFlat().subscribe((res)=>{
    console.log(res,"res==>");
    this.readData2 = res.data;
  
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


private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
   ////location.reload();

    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
   ////location.reload();

    return 'by clicking on a backdrop';
  } else {
   ////location.reload();

    return `with: ${reason}`;
  }

}  
onCancelClick(){
  this.getparamid = "";
  this.form.reset();
  // this.firebase = null;
  // this.Percentage = undefined ;
 
}



       
 HousetypeRestore(us:any){
  console.log(this.getparamid);
  const result = window.confirm('Are you sure you want to restore this Housetype?');
  if (result) {
   this.loading = true;
    console.log('confirmed');
   this.service.restoreHouseType(
     {houseTypeId: us.houseTypeId  } 
     ).subscribe((res)=>{
     alert( 'Restore Successfully...');
     this.loading = false;
        this.getAllData();
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