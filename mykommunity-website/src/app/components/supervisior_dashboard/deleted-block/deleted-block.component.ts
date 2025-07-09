import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';


@Component({
  selector: 'app-deleted-block',
  templateUrl: './deleted-block.component.html',
  styleUrls: ['./deleted-block.component.css']
})
export class DeletedBlockComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  loading=false;
  constructor(private service:ApiService,private fb: UntypedFormBuilder,
     private modalService: NgbModal, private _location: Location, private dialog: MatDialog,) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  disabledBlocks: any[] = [];
  getparamid:any;
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

  map: any ={
    false: "Active",
    true: "Inactive"
  }

  ngOnInit(): void {
   this.getAllData();
   this.getAllComData();
   this.updateColumnLists();

  this.form = this.fb.group({
    name: [null]
  });

}



 // Declare disabledBlocks array
 getAllData() {
  this.service.getBlock().subscribe((res) => {
    console.log(res, "res==>");
    this.readData = res.data;

    // Sort data based on updatedAt timestamp
    this.readData.sort((a: any, b: any) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    // Filter only disabled blocks
    this.disabledBlocks = this.readData.filter((block: any) => block.disabled === true);

    this.totalLength = this.disabledBlocks.length; // Update total length for pagination

    console.log("Disabled Blocks:", this.disabledBlocks); // Debugging output
  });
}


getAllComData(){
  this.service.getCommunities().subscribe((res)=>{
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
columns = [
  { name: 'Block Name', visible: true },
  { name: 'Delete', visible: true },
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

    this.downloadCSV(csvContent, 'block_log.csv');
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
    case 'Block Name': return 'name';
   
    default: return '';
  }
}



private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
 //  //location.reload();

    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  // //location.reload();

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
saveDetails(form:any) {
  const result = window.confirm('Are you sure you want to add this block?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
{
  //this.societyId= sessionStorage.getItem('societyId');

  console.log(this.form.value);
  this.service.createBlock({name:this.form.value.name,societyId:this.societyId}).subscribe((res)=>{
    console.log(res,'res==>');
    this.loading = false;
    this.form.reset();
    this.getAllData();
    this.onCancelClick();
    //location.reload();

  },(error) => {
    alert(error.error.message);
    console.error('Error:', error);
    this.loading = false;
    this.onCancelClick();
    // You can show an error message to the user if needed
  });
 }
}else {
  this.loading = false;
  this.onCancelClick();
  console.log('Delete canceled');
}
}


OnEdit(us:any,form:any){
   
  this.getparamid = us.id;
  console.log(this.getparamid);

  this.form.controls['name'].setValue(us.name);
 }
 BlockUpdate(){
  //this.societyId= sessionStorage.getItem('societyId');

   console.log(this.getparamid);
   console.log(this.societyId);
   const result = window.confirm('Are you sure you want to change block details?');
   if (result) {
    this.loading = true;
     console.log('confirmed');
   {
     this.service.updateBlock({id:this.getparamid,name:this.form.value.name,societyId:this.societyId} ).subscribe((res)=>{
       confirm( 'Updated Successfully...');
       //location.reload();
       this.loading = false;
         this.getAllData();
         this.onCancelClick();
     },(error) => {
      alert(error.error.message);
      this.loading = false;
      console.error('Error:', error);
      this.onCancelClick();
      // You can show an error message to the user if needed
    });
   }
  }else {
    this.loading = false;
    this.onCancelClick();
    console.log('Delete canceled');
  }
 }

 BlockRestore(id:any){
  console.log(this.getparamid);
  const result = window.confirm('Are you sure you want to restore this Block?');
  if (result) {
   this.loading = true;
    console.log('confirmed');
   this.service.restoreBlock(
     {id:id } 
     ).subscribe((res)=>{
     alert( 'Restored Successfully...');
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
 

 UpdateButton(us:any){
  this.getparamid = us.id  ;
  console.log(this.getparamid);
  console.log(us.disabled);

  const result = window.confirm('Are you sure you want to change Block status?');
    if (result) {
      console.log('confirmed');
      console.log(us.disabled);

   if((us.disabled) == false){
   console.log('confirmed');
   console.log(us.disabled);


   
    console.log(this.map[us.disabled]);
    this.service.disableBlock({id:this.getparamid}).subscribe((res)=>{
      // alert( 'User Approved Successfully...');
      // confirm()

      console.log('confirmed');
      console.log(us.rentalUnitStatus);
      (us.rentalUnitStatus); 
   this.getAllData();
  },(error) => {
    alert(error.error.message);
    console.error('Error:', error);
    // You can show an error message to the user if needed
  });
    } else if(((us.disabled) == true)) {
      console.log(this.map[us.disabled]);
    this.service.enableBlock({id:this.getparamid}).subscribe((res)=>{
      // alert( 'User Approved Successfully...');
      // confirm()

      console.log('confirmed');
      console.log(us.disabled);
   this.getAllData();
      console.log('Delete canceled');
    },(error) => {
      alert(error.error.message);
      console.error('Error:', error);
      // You can show an error message to the user if needed
    });}
  
   

}
else
{
  console.log(this.map[us.disabled]);
}
 }




}