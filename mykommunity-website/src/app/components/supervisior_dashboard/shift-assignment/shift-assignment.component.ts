import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-shift-assignment',
  templateUrl: './shift-assignment.component.html',
  styleUrls: ['./shift-assignment.component.css']
})
export class ShiftAssignmentComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;
  getuserid:any
  searchShift:any = "";
  sortDirection: { [key: string]: boolean } = {};
  isModalOpen = false;
hiddenColumns: any[] = [];
displayedColumns: any[] = []; 
selectedColumn: any = null; 
selectedColumnName: string | null = null;
selectedRecord: any[] = [];
isDropdownOpen = false;
minDate: string = new Date().toISOString().split('T')[0]; // Today's date


columns = [
  { name: 'Guard Name', visible: true },
  { name: 'Shift Name', visible: true },
  { name: 'Assigned Date', visible: true },
  { name: 'Gate Name', visible: true },
  { name: 'Check-In Time', visible: true },
  { name: 'Check-Out Time', visible: true },
  { name: 'Check-In Photo', visible: false },
  { name: 'Check-Out Photo', visible: false },
  { name: 'Edit', visible: true },
  { name: 'Delete', visible: true },
  { name: 'Attendance', visible: true },

];


selectColumn(columnName: string) {
  const column = this.columns.find(col => col.name === columnName);
  if (column) {
    column.visible = !column.visible; // Toggle visibility
  }
}

constructor(
  private service:ApiService,
  private fb: UntypedFormBuilder,
  private dialog: MatDialog, 
  private modalService: NgbModal, 
  private _location: Location,
  private cdr: ChangeDetectorRef) { }

  totalLength:any;
  page:number=1;
  readData:any = [];
  gateList:any = [];
  shiftList:any=[];
  guardList:any=[];
  getparamid:any = '';
  getid:any;
  map: any ={
    false: "Active",
    true: "Inactived"
  }
  selectedIds: String[] = [];

  role=sessionStorage.getItem('role');

  ngOnInit(): void {
    this.getAllGateData();
    this.getAllSecurityData();
    this.getAllShiftAssignmentData();
    this.fetchShifts();

    this.updateColumnLists();
  
    this.form = this.fb.group({
      guardId: [null, [Validators.required]],
      shiftId: [null, [Validators.required]],
      gateId:[null, [Validators.required]],
      assignedDate:[null, [Validators.required]],
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
    //location.reload();
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //location.reload();
    return 'by clicking on a backdrop';
  } else {
    //location.reload();
    return `with: ${reason}`;
  }

}
onCancelClick(){
  this.getparamid = "";
  this.form.reset();
  this.selectedIds= [];
  
}
private getFormattedISODate(date: Date): string {
  // Get the local date at midnight
  const localMidnight = new Date(date);
  localMidnight.setHours(0, 0, 0, 0); 
  const year = localMidnight.getFullYear();
  const month = (localMidnight.getMonth() + 1).toString().padStart(2, '0'); 
  const day = localMidnight.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}T00:00:00Z`;
}


saveDetails(form:any) {
  const result = window.confirm('Are you sure you want to assign?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
 {
   console.log(this.form.value);
   this.service.createAssign(
    {
      guardId:this.form.value.guardId,
      shiftId:this.form.value.shiftId,
      gateId:this.form.value.gateId,
      assignedDate:this.getFormattedISODate(new Date(this.form.value.assignedDate))
   
    }).subscribe((res)=>{
     console.log(res,'res==>');
     this.form.reset();
     this.getAllShiftAssignmentData();
     this.loading = false;
     this.onCancelClick();

     //location.reload();


   },(error) => {
    alert(error.error.message);
    this.loading = false;
    console.error('Error:', error);
    //location.reload();

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
 
 
dropColumn(event: CdkDragDrop<string[]>) {
  // Assuming columns holds your visible column identifiers
  moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
}
toggleModal() {
  this.isModalOpen = !this.isModalOpen;
}
 
selectTab(tabName: string): void {
  console.log(`Selected tab: ${tabName}`);
 
}
cancelChanges() {
  this.hiddenColumns.forEach(column => column.selected = false);
  this.displayedColumns.forEach(column => column.selected = false);
  this.toggleModal();
}

resetChanges() {
  this.hiddenColumns = this.columns.filter(column => !column.visible);
  this.displayedColumns = this.columns.filter(column => column.visible);
}

updateColumnLists() {
  this.hiddenColumns = this.columns.filter(column => !column.visible);
  this.displayedColumns = this.columns.filter(column => column.visible);
}


openRecordModal(record: any[], content: any) {
  console.log('Opening modal with record:', record);
  this.selectedRecord = Array.isArray(record) ? record : [];
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
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
      // Proceed with CSV download if the user confirmed
      this.downloadCSVfile();
    }
  });
}

downloadCSVfile(): void {
  console.log('Filtered Data:', this.readData); 

  const visibleColumns = this.columns
      .filter(col => col.visible && col.name !== 'Edit')
      .map(col => col.name);
  
 
  console.log('Visible Columns:', visibleColumns);

  const dataToExport = this.readData.map((entry: { [x: string]: any; }) => {
    const exportEntry: any = {};
    
    visibleColumns.forEach(column => {
        const key = this.mapColumnToKey(column);
        
        if (column === 'Status') {
            exportEntry[column] = this.map[entry[key]];
        } else {
           
            console.log(`Mapping column "${column}" to key "${key}" with value: ${entry[key]}`);
            exportEntry[column] = entry[key]; 
        }
    });
  
    console.log('Export Entry:', exportEntry);
    return exportEntry;
  });

  const csvContent = this.convertToCSV(dataToExport);
  console.log('CSV Content:', csvContent); 

  this.downloadCSV(csvContent, 'shiftAssignment_log.csv');
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
  if (link.download !== undefined) { // feature detection
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
      case 'Guard Name': return 'userFirstName';
      case 'Shift Name': return 'shiftname';
      case 'Assigned Date': return 'assignedDate';
      case 'Gate Name': return 'gateName';
      case 'Check-In Time': return 'checkInTime';
      case 'Check-Out Time': return 'checkOutTime';
      case 'Check-In Photo': return 'checkInImageUrl';
      case 'Check-Out Photo': return 'checkOutImageUrl';
      case 'Attendance': return 'disabled';
      case 'Edit': return '';
      default: return '';
  }
}












getAllShiftAssignmentData(){
  this.service.getShiftAssignments().subscribe((res)=>{
    console.log(res,"res==>");
    this.readData = res.data;
    this.totalLength = (res.data).length;
  });
}
getAllGateData(){
  this.service.getGate().subscribe((res)=>{
    console.log(res,"res==>");
    this.gateList = res.data;
  });
}

getAllSecurityData(): void {
  this.service.getSecurity().subscribe((res) => {
    this.guardList = res.data.filter((item: any) => !item.disabled);
 
    console.log('Filtered Active Guards:', this.guardList);
  });
}


onSelect(event: any, id: String) {
  if (event.target.checked) {
    if (!this.selectedIds.includes(id)) {
      this.selectedIds.push(id);
    }
  } else {
    this.selectedIds = this.selectedIds.filter((selectedId) => selectedId !== id);
  }
}

selectAll(event: any) {
  if (event.target.checked) {
    this.selectedIds = this.readData.map((us: { id: any; }) => us.id);
  } else {
    this.selectedIds = [];
  }
}


isSelectAllChecked(): boolean {
  return this.readData.every((us: { id: String; }) => this.selectedIds.includes(us.id));
}

fetchShifts(): void {
  this.service.getSecurityShifts().subscribe(
    (response) => {
      if (response.success && response.data) {
        this.shiftList = response.data.filter((item: any) => !item.disabled);
        // console.log('Fetched shifts:', this.shiftList);
      } 
    },
   
  );
}







 OnEdit(us:any,form:any){
   
  this.getparamid = us.id;
  

  console.log(this.getparamid);

  this.form.controls['guardId'].setValue(us.guardId);
  this.form.controls['shiftId'].setValue(us.shiftId);

 this.form.controls['gateId'].setValue(us.gateId);




 }
UpdateDetails(){
 console.log(this.getparamid);
 console.log(this.form.value,'updated');
 const result = window.confirm('Are you sure you want to update this assignment?');
 if (result) {
   this.loading = true;
   console.log('confirmed');
{
  console.log(this.form.value);
  this.service.updateAssignment({   
    assignmentId:this.getparamid,
    guardId:this.form.value.guardId,
    shiftId:this.form.value.shiftId,
    gateId:this.form.value.gateId,
  }).subscribe((res)=>{
    console.log(res,'res==>');
    this.form.reset();
    this.getAllShiftAssignmentData();
    this.loading = false;
    this.onCancelClick();

    //location.reload();


  },(error) => {
   alert(error.error.message);
   this.loading = false;
   console.error('Error:', error);
   //location.reload();

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
markPresent(us:any){
  this.getuserid = us.id  ;
  console.log(this.getuserid);

  const result = window.confirm('Are you sure you want mark Present?');
    if (result) {
      console.log('confirmed');
   
    console.log(us.disabled);
    this.service.checkinOut({assignmentId:this.getuserid,"forceUpdate": true}).subscribe((res)=>{
       alert( 'Guard Marked Present Successfully...');
      // confirm()

      console.log('confirmed');
   this.getAllShiftAssignmentData();
   this.onCancelClick();
  },(error) => {
    alert(error.error.message);
    this.loading = false;
    console.error('Error:', error);
    //location.reload();

    // You can show an error message to the user if needed
  });
   
  
   

}
else
{
  this.onCancelClick();
}
 }

 markPresentinBulk(){
 
  const result = window.confirm('Are you sure you want to mark Present to selected items?');
    if (result) {
      console.log('confirmed');
   
    this.service.checkinOutInBulk({"assignmentIds":this.selectedIds,"forceUpdate": true}).subscribe((res)=>{
       alert( 'Guard(s) Marked Present Successfully...');
      // confirm()

      console.log('confirmed');
   this.getAllShiftAssignmentData();
   this.onCancelClick();
  },(error) => {
    alert(error.error.message);
    this.loading = false;
    console.error('Error:', error);
    //location.reload();

    // You can show an error message to the user if needed
  });
   
  
   

}
else
{
  this.onCancelClick();
}
 }
}


