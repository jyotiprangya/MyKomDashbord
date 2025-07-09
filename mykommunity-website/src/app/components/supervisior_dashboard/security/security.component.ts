import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';



@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;
  getuserid:any
  searchSecurity:any = "";
  sortDirection: { [key: string]: boolean } = {};
  isModalOpen = false;
hiddenColumns: any[] = [];
displayedColumns: any[] = []; 
selectedColumn: any = null; 
selectedColumnName: string | null = null;
selectedRecord: any[] = [];
isDropdownOpen = false;

columns = [
  { name: 'Profile', visible: true },
  { name: 'Guard Code', visible: true },
  { name: 'First Name', visible: true },
  { name: 'Last Name', visible: true },
  { name: 'Email_id', visible: true },
  { name: 'Mobile Number', visible: true },
  { name: 'Assign_To_Gate', visible: true },
  { name: 'Status', visible: true },
  { name: 'Edit', visible: true } 
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
  private router: Router,
  private cdr: ChangeDetectorRef) { }

  totalLength:any;
  deletedUserLength:any;

  page:number=1;
  readData:any = [];
  removedData:any = [];

  gateData:any = [];
  getparamid:any;
  getid:any;
  map: any ={
    false: "Active",
    true: "Inactived"
  }
  role=sessionStorage.getItem('role');

  ngOnInit(): void {
    this.getAllData();
    this.getRemovedSecurityData();
    this.getAllGateData();
    this.updateColumnLists();
  
  this.form = this.fb.group({
    firstName: [null, [Validators.required]],
    lastName: [null, [Validators.required]],
     email: [null, [Validators.required, Validators.pattern("^[A-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
   // email: [null, [Validators.required]],
    guardCode: [null, [Validators.required, Validators.minLength(6)]],
    mobileNumber: [null, [Validators.required, Validators.minLength(10),Validators.pattern("^[0-9]{10,}$")]],
    gateId: [null]
   
  });
 
}
shiftAssignment(){
  this.router.navigate(['/supervisor/shift-assignment-setup']);
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
  // this.firebase = null;
  // this.Percentage = undefined ;
 
}

saveDetails(form:any) {
  const result = window.confirm('Are you sure you want to add this Security Guard in your Society?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
 {
   console.log(this.form.value);
   this.service.createSecurity(this.form.value).subscribe((res)=>{
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
RemovedUser(){
  this.router.navigate(['/supervisor/removed-security']);
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

  this.downloadCSV(csvContent, 'security_log.csv');
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
    case 'Profile': return 'profileImage';
    case 'Guard Code': return 'guardCode';
    case 'First Name': return 'firstName';
    case 'Last Name': return 'lastName';
    case 'Email_id': return 'email';
    case 'Mobile Number': return 'mobileNumber';
    case 'Assign_To_Gate': return 'gateName';
    case 'Status': return 'disabled';
    case 'Edit': return 'edit';
    default: return '';
  }
}












getAllData(){
  this.service.getSecurity().subscribe((res)=>{
    console.log(res,"res==>");
    this.readData = res.data
    .filter((user: any) => !user.disabled)  // Only include non-disabled users
    .sort((a: any, b: any) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    this.totalLength = this.readData.length;
  });
}

getRemovedSecurityData(){
  this.service.getSecurity().subscribe((res)=>{
    console.log(res,"res==>");
    this.removedData = res.data
    .filter((user: any) => user.disabled)  // Only include non-disabled users
    .sort((a: any, b: any) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    this.deletedUserLength = this.removedData.length;
  });
}


getAllGateData(){
  this.service.getGate().subscribe((res)=>{
    console.log(res,"res==>");
    this.gateData = res.data;
  });
}

inactiveResident(us:any){
  this.getuserid = us.id  ;
  console.log(this.getuserid);

  const result = window.confirm('Are you sure you want to Inactive Guard?');
    if (result) {
      console.log('confirmed');
   if((us.disabled) === false)
   
   {
    console.log(us.disabled);
    this.service.inactiveSecurity({userId:this.getuserid}).subscribe((res)=>{
       alert( 'Guard Inactivated Successfully...');
      // confirm()

      console.log('confirmed');
      console.log(us.disabled);
   this.getAllData();
   this.onCancelClick();
  });
    } else {
      alert( 'Guard already Inactivated...');

      console.log('Delete canceled');
    }
  
   

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

}

