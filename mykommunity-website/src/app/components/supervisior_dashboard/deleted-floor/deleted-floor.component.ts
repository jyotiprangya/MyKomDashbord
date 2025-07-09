import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-deleted-floor',
  templateUrl: './deleted-floor.component.html',
  styleUrls: ['./deleted-floor.component.css']
})
export class DeletedFloorComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;
  constructor(private service:ApiService,private fb: UntypedFormBuilder, 
    private modalService: NgbModal, private _location: Location, private dialog: MatDialog,) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
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
  disabledFloors:any[]=[];

  map: any ={
    false: "Active",
    true: "Inactive"
  }
  
  ngOnInit(): void {
    this.getAllData();
    this.getAllBlockData();
    this.updateColumnLists();

    this.form = this.fb.group({
      name: [null],
      blockId: [null]
    });

  }

  
  columns = [
    { name: 'Block Name', visible: true },
    { name: 'Floor', visible: true },
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
  
      this.downloadCSV(csvContent, 'dailyhelp_log.csv');
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
      case 'Block name': return 'blockName';
      case 'Floor name': return 'name';
      case 'Delete': return 'delete';
      case 'Edit': return 'edit';
     
      default: return '';
    }
  }

  getAllData() {
    this.service.getFloor().subscribe((res) => {
      console.log(res, "res==>");
  
      // Sorting by updatedAt in descending order
      this.readData = res.data.sort((a: any, b: any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  
      // Filter only disabled floors (disabled === true)
      this.disabledFloors = this.readData.filter((floor: any) => floor.disabled === true);
  
      this.totalLength = this.disabledFloors.length; // Update total length for pagination
  
      console.log("Disabled Floors:", this.disabledFloors); // Debugging output
    });
  }
  
  getAllBlockData(){
    this.service.getBlock().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData2 = res.data;
    });
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

      return `with: ${reason}`;
    }

  }  
 

saveDetails(form:any) {
  const result = window.confirm('Are you sure you want to add this floor?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
  if(this.form.valid)
  {
    console.log(this.form.value);
    this.service.createFloor(this.form.value).subscribe((res)=>{
      console.log(res,'res==>');
      this.form.reset();
      this.loading = false;
      this.getAllData();
      this.onCancelClick();
    },(error) => {
      alert(error.error.message);
      this.loading = false;
      console.error('Error:', error);
      // You can show an error message to the user if needed
    });
  }
}else {
  this.form.reset();
  this.onCancelClick();
  this.loading = false;
  console.log('Delete canceled');
}
}


onCancelClick(){
  this.getparamid = "";
  this.form.reset();
  // this.firebase = null;
  // this.Percentage = undefined ;
 
}

OnEdit(us:any,form:any){
   
  this.getparamid = us.id;
  console.log(this.getparamid);

  this.form.controls['name'].setValue(us.name);
  this.form.controls['blockId'].setValue(us.blockId);

 }
 FloorUpdate(){
   console.log(this.getparamid);
   console.log(this.form.value,'updated');
   const result = window.confirm('Are you sure you want to change this floor details?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
   {
     
     this.service.updateFloor({id:this.getparamid,name:this.form.value.name,blockId:this.form.value.blockId} ).subscribe((res)=>{
       alert( 'Updated Successfully...');
         this.getAllData();
         this.loading = false;
         this.onCancelClick();
     },(error) => {
      alert(error.error.message);
      this.loading = false;
      console.error('Error:', error);
      // You can show an error message to the user if needed
    });
   }
  }else {
    this.form.reset();
    this.loading = false;
    this.onCancelClick();
    console.log('Delete canceled');
  }
 }


 FloorRestore(id:any){
  console.log(this.getparamid);
  const result = window.confirm('Are you sure you want to restore this Floor?');
  if (result) {
   this.loading = true;
    console.log('confirmed');
   this.service.restoreFloor(
     {id:id } 
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

 


 
 UpdateButton(us:any){
  this.getparamid = us.id  ;
  console.log(this.getparamid);
  console.log(us.disabled);

  const result = window.confirm('Are you sure you want to delete this floor?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
      console.log(us.disabled);

   if((us.disabled) == false){
   console.log('confirmed');
   console.log(us.disabled);


   
    console.log(this.map[us.disabled]);
    this.service.disableFloor({id:this.getparamid}).subscribe((res)=>{
       alert( 'floor Removed Successfully...');
      // confirm()

      console.log('confirmed');
      console.log(us.rentalUnitStatus);
      (us.rentalUnitStatus); 
   this.getAllData();
  },(error) => {
    alert(error.error.message);
    this.loading = false;
    console.error('Error:', error);
    // You can show an error message to the user if needed
  });
    } else if(((us.disabled) == true)) {
      console.log(this.map[us.disabled]);
    this.service.enableFloor({id:this.getparamid}).subscribe((res)=>{
      // alert( 'User Approved Successfully...');
      // confirm()

      console.log('confirmed');
      console.log(us.disabled);
   this.getAllData();
      console.log('Delete canceled');
    },(error) => {
      alert(error.error.message);
      this.loading = false;
      console.error('Error:', error);
      // You can show an error message to the user if needed
    });}
  
   

}
else
{
  console.log(this.map[us.disabled]);
}
 }

 
//  UpdateButton(us:any){
//   this.getparamid = us.id  ;
//   console.log(this.getparamid);
//   console.log(us.disabled);

//   const result = window.confirm('Are you sure you want to change Floor status?');
//     if (result) {
//       console.log('confirmed');
//       console.log(us.disabled);

//    if((us.disabled) == false){
//    console.log('confirmed');
//    console.log(us.disabled);


   
//     console.log(this.map[us.disabled]);
//     this.service.disableFloor({id:this.getparamid}).subscribe((res)=>{
//       // alert( 'User Approved Successfully...');
//       // confirm()

//       console.log('confirmed');
//       console.log(us.rentalUnitStatus);
//       (us.rentalUnitStatus); 
//    this.getAllData();
//   },(error) => {
//     alert(error.error.message);
//     console.error('Error:', error);
//     // You can show an error message to the user if needed
//   });
//     } else if(((us.disabled) == true)) {
//       console.log(this.map[us.disabled]);
//     this.service.enableFloor({id:this.getparamid}).subscribe((res)=>{
//       // alert( 'User Approved Successfully...');
//       // confirm()

//       console.log('confirmed');
//       console.log(us.disabled);
//    this.getAllData();
//       console.log('Delete canceled');
//     },(error) => {
//       alert(error.error.message);
//       console.error('Error:', error);
//       // You can show an error message to the user if needed
//     });}
  
   

// }
// else
// {
//   console.log(this.map[us.disabled]);
// }
//  }




}
