import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-deleted-shift',
  templateUrl: './deleted-shift.component.html',
  styleUrls: ['./deleted-shift.component.css']
})
export class DeletedShiftComponent implements OnInit {

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
endTime: string = ''; // Model for the input
startTime: string = ''; // Model for the input


columns = [
  { name: 'Shift Name', visible: true },
  { name: 'Start Time', visible: true },
  { name: 'End Time', visible: true },
  { name: 'Frequency', visible: true },
  { name: 'Created On', visible: true },
  { name: 'Updated At', visible: true },
  // { name: 'Status', visible: true },
  { name: 'Delete', visible: true },

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
  private cdr: ChangeDetectorRef,
  private router: Router,
) { }

  totalLength:any;
  page:number=1;
  readData:any = [];
  getparamid:any;
  getid:any;
  map: any ={
    false: "Active",
    true: "Inactived"
  }
  shifts: any[] = [];  

  shift = {
    name: '',
    startTime: '',
    endTime: '',
    frequency: '',
  };
  role=sessionStorage.getItem('role');
  @ViewChild('shiftForm')
  shiftForm!: TemplateRef<any>;

  ngOnInit(): void {
    this.getAllData();
    this.updateColumnLists();
  
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
      endTime:[null, [Validators.required]],
      frequency:[null, [Validators.required]],
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
onTimeChange() {
  // Ensure the time remains in HH:mm:ss format
  if (this.endTime) {
    const [hours, minutes] = this.endTime.split(':');
    this.endTime = `${hours}:${minutes}:00`; // Append seconds as '00'
  }
}
onStartTimeChange() {
  // Ensure the time remains in HH:mm:ss format
  if (this.startTime) {
    const [hours, minutes] = this.startTime.split(':');
    this.startTime = `${hours}:${minutes}:00`; // Append seconds as '00'
  }
}

openShiftForm(): void {
  const dialogRef = this.dialog.open(this.shiftForm, {
    width: '400px',
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.shifts.push(result); 
      console.log('New Shift:', result);
     // this.createShift(result); 
    }
  });
}

onSubmit(): void {

  const isValidTimeFormat = (time: string) => /^([01]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])$/.test(time);

  if (!isValidTimeFormat(this.shift.startTime) || !isValidTimeFormat(this.shift.endTime)) {
    console.error('Invalid time format. Please use HH:mm:ss');
    return;
  }

  console.log('Shift data:', this.shift);
}

onCancel(): void {
  this.dialog.closeAll(); 
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
  
}

saveDetails(form:any) {
  this.form.value.startTime = this.startTime;
  this.form.value.endTime = this.endTime;

  const result = window.confirm('Are you sure you want to add this Shift Details?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
    console.log(this.form.value);

 {
   console.log(this.form.value);
   this.service.createShift(this.form.value).subscribe((res)=>{
     console.log(res,'res==>');
     this.form.reset();
     this.getAllData();
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
      .filter(col => col.visible && col.name !== 'Actions')
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

  this.downloadCSV(csvContent, 'shift_list.csv');
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
      case 'Shift Name': return 'name';
      case 'Start Time': return 'startTime';
      case 'End Time': return 'endTime';
      case 'Frequency': return 'frequency';
      case 'Created On': return 'createdAt';
      case 'Updated At': return 'updatedAt';
      case 'Status': return 'disabled';
    
      default: return '';
  }
}


getAllData() {
  this.service.getSecurityShifts().subscribe((res) => {
    this.readData = res.data.filter((shift: any) => shift.disabled === true);
    this.totalLength = this.readData.length;

    this.cdr.detectChanges(); // Force view update
  });
}



inactiveShift(us:any){
  this.getuserid = us.id  ;
  console.log(this.getuserid);

  const result = window.confirm('Are you sure you want to change Shift status?');
    if (result) {
      console.log('confirmed');
   
    console.log(us.disabled);
    this.service.inactiveShift({shiftId:this.getuserid}).subscribe((res)=>{
       alert(`${res.message}`);
      
   this.getAllData();
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
  console.log(us.disabled);
}
 }




OnEdit(us:any){

this.getparamid = us.id;
console.log(this.getparamid);

this.form.controls['firstName'].setValue(us.firstName);
this.form.controls['lastName'].setValue(us.lastName);
this.form.controls['email'].setValue(us.email);
this.form.controls['guardCode'].setValue(us.guardCode);
this.form.controls['mobileNumber'].setValue(us.mobileNumber);
this.form.controls['gateId'].setValue(us.gateId);


}
SecurityUpdate(){
 console.log(this.getparamid);
 console.log(this.form.value,'updated');
 const result = window.confirm('Are you sure you want to update Guard details?');
 if (result) {
   this.loading = true;
   console.log('confirmed');
{
  console.log(this.form.value);
  this.service.updateSecurity(
    {
      securityId:this.getparamid,
      firstName:this.form.value.firstName,
     lastName:this.form.value.lastName,
     email:this.form.value.email 
    }).subscribe((res)=>{
    console.log(res,'res==>');
    this.form.reset();
    this.getAllData();
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


ShiftRestore(id:any){
  console.log("Shift ID to remove:", id);

  const result = window.confirm('Are you sure you want to restore this shift?');
  if (result) {
    this.loading = true;
    console.log('Confirmed deletion');

    // Ensure payload matches API expectations
    const payload = { shiftId: id }; // API expects shiftId, not id

    this.service.restoreShift(payload).subscribe(
      (res) => {
        console.log("API Response:", res);
        alert('Restore Successfully...');
        this.loading = false;
        this.getAllData(); // Refresh data after deletion
      },
      (error) => {
        console.error("API Error Response:", error);
        alert(`Error: ${error.status} - ${error.error.message}`);
        this.loading = false;
      }
    );
  } else {
    this.form.reset();
    this.onCancelClick();
    this.loading = false;
    console.log('Delete canceled');
  }
}


}
