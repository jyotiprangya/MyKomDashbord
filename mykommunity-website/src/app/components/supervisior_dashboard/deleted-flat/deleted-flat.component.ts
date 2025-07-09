import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';

@Component({
  selector: 'app-deleted-flat',
  templateUrl: './deleted-flat.component.html',
  styleUrls: ['./deleted-flat.component.css']
})
export class DeletedFlatComponent implements OnInit {

  closeResult: any;
  searchFlat:any = "";

  form:any= UntypedFormGroup;
  loading = false;
  id: any;
  selectedBlock: any = {
    id:0, block_name:''
  };
  role=sessionStorage.getItem('role');

  floor: any;
  constructor(private service:ApiService,private fb: UntypedFormBuilder, 
    private modalService: NgbModal, private _location: Location,private dialog: MatDialog,) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  readData3:any = [];
  readData4:any = [];
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
  disabledFlats:any[] = [];
  map: any ={
    false: "Active",
    true: "Inactive"
  }
  
  ngOnInit(): void {
    this.getAllData();
    this.getAllFloorData();
    this.updateColumnLists();
    this.getAllremoveData();
    

    this.form = this.fb.group({
      floorId: [null],
      type:[null],
      name: [null]
    });

  }

  columns = [
    { name: 'Type', visible: true },
    { name: 'Block Name', visible: true },
    { name: 'Floor', visible: true },
    { name: 'Flat Number/Housing Unit', visible: true },
    { name: 'Delete', visible: true },
    { name: 'Edit', visible: true }
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
  
      this.downloadCSV(csvContent, 'flat_log.csv');
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
      case 'Type': return 'type'; 
      case 'Block Name': return 'blockName'; 
      case 'Floor': return 'floorName'; 
      case 'Flat Number/Housing Unit': return 'name'; 
      case 'Delete': return 'delete';  
      case 'Edit': return 'edit';
      default: return '';
    }
  }

  
  FlatRestore(id:any){
  console.log(this.getparamid);  
  const result = window.confirm('Are you sure you want to restore this Flat?');
  if (result) {
   this.loading = true;
    console.log('confirmed');
   this.service.enableFlat(
     {id:id }   
     ).subscribe((res)=>{
     alert( 'Restore Successfully...');  
     this.loading = false;
     this.getAllremoveData();
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

  
getAllData(){
  this.service.getFlat().subscribe((res)=>{
    console.log(res,"res==>");
    this.readData = res.data;
    this.readData.sort((a:any, b:any) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    this.totalLength = (res.data).length;
  });
}

getAllremoveData(){
  this.service.getremoveFlat().subscribe((res)=>{
    console.log(res,"res==>");
    this.readData = res.data;
    this.readData.sort((a:any, b:any) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    this.totalLength = (res.data).length;
  });
}


  
  
  back(){
    this._location.back();
  }
  
  getAllFloorData(){
    this.service.getFloor().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData4 = res.data;
    
    });
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
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
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
  const result = window.confirm('Are you sure you want to add this flat/RentalUnit?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
  {
    console.log(this.form.value);
    this.service.createFlat(this.form.value).subscribe((res)=>{
      console.log(res,'res==>');
      this.form.reset();
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
    this.loading = false;
    this.onCancelClick();
  this.form.reset();
  console.log('Delete canceled');
}
}



OnEdit(us:any,form:any){
   
  this.getparamid = us.id;
  console.log(this.getparamid);

  this.form.controls['floorId'].setValue(us.floorId);
  this.form.controls['name'].setValue(us.name);
  this.form.controls['type'].setValue(us.type);


 }
 FlatUpdate(){
   console.log(this.getparamid);
   console.log(this.form.value,'updated');
   if(this.form.valid)
   {
     
     this.service.updateFlat({id:this.getparamid,name:this.form.value.name,floorId:this.form.value.floorId,type:this.form.value.type} ).subscribe((res)=>{
       alert( 'Updated Successfully...');
       this.loading = false;
         this.getAllData();
         this.onCancelClick();
     },(error) => {
      alert(error.error.message);
      console.error('Error:', error);
      // You can show an error message to the user if needed
    });
   }
 }
 
 UpdateButton(us:any){
  this.getparamid = us.id  ;
  console.log(this.getparamid);
  console.log(us.disabled);

  const result = window.confirm('Are you sure you want to delete this flat?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
      console.log(us.disabled);

   if((us.disabled) == false){
   console.log('confirmed');
   console.log(us.disabled);


   
    console.log(this.map[us.disabled]);
    this.service.enableFlat({id:this.getparamid}).subscribe((res)=>{
       alert( 'Flat Removed Successfully...');
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
    this.service.enableFlat({id:this.getparamid}).subscribe((res)=>{
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


 



}

