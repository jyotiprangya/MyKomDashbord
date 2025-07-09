import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-deleted-user',
  templateUrl: './deleted-user.component.html',
  styleUrls: ['./deleted-user.component.css']
})
export class DeletedUserComponent implements OnInit {

  closeResult: any;
  closeResult2: any;
  // displayedColumns: string[] = ['select', 'profileImage', 'name', 'email', 'mobile', 'occupancy', 'flatNo', 'type', 'approvalStatus', 'activeStatus', 'edit'];

  form:any= UntypedFormGroup;
  form2:any= UntypedFormGroup;
  form3:any= UntypedFormGroup;
  selectedIds: String[] = [];
  filteredData: any[] = [];
    filteredPaginatedData: any[] = [];
    filteredLength: number = 0;

  loading = false;
  searchTerm:any = "";
  sortDirection: { [key: string]: boolean } = {};
    isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;

  columns = [
    { name: 'Profile Image', visible: true },
    { name: 'Name', visible: true },
    { name: 'Email', visible: true },
    { name: 'Mobile', visible: true },
    { name: 'Occupancy', visible: false },
    { name: 'Flat No', visible: true },
    { name: 'Type', visible: true },
    { name: 'Deleted On', visible: true },
    
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
     private _location: Location,
     private cdr: ChangeDetectorRef) { }

  getparamid:any;
  getuserid:any
  getid:any;
  totalLength:any;
  page:number=1;
  showScreen = false;

  readData:any = [];
  readData2:any = [];

  map: any ={
    false: "Active",
    true: "Inactived"
  }
  mapApproval: any ={
    "APPROVED": "Approved",
    "PENDING": "click to approve"
  }
   map2: any ={
    false: "Tenant",
    true: "Owner"
  }
  community_id:any;

  role=sessionStorage.getItem('role');



  ngOnInit(): void {
this.getDeletedUserData();
this.updateColumnLists();    

   
    
    
  }
  filterAndPaginateData() {
    // Step 1: Filter data based on the search term
    this.filteredData = this.readData.filter((us: { rentalUnitStatus: string; email: string; firstName: string; blockName: string; lastName: string; rentalUnitName: string; role: string; mobileNumber: string | any[]; }) =>
      us.rentalUnitStatus.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      us.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      us.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      us.blockName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      us.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      us.rentalUnitName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      us.role.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      us.mobileNumber.includes(this.searchTerm)
    );

    // Step 2: Paginate the filtered data
    const startIndex = (this.page - 1) * 10;
    const endIndex = this.page * 10;
    this.filteredPaginatedData = this.filteredData.slice(startIndex, endIndex);
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
  this.filteredData.sort((a: any, b: any) => {
    const direction = this.sortDirection[column] ? 1 : -1;
    return a[column] > b[column] ? direction : -direction;
  });
}
  
  
 


  moveColumn(direction: 'up' | 'down') {
    const index = this.columns.findIndex(column => column === this.selectedColumn);
    
    if (direction === 'up' && index > 0) {
      [this.columns[index - 1], this.columns[index]] = [this.columns[index], this.columns[index - 1]];
    } else if (direction === 'down' && index < this.columns.length - 1) {
      [this.columns[index + 1], this.columns[index]] = [this.columns[index], this.columns[index + 1]];
    }
    
    this.updateColumnLists();
  }  



 


  getDeletedUserData(){

    this.service.getUserlist().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data
      .filter((user: any) => user.disabled)  // Only include non-disabled users
      .sort((a: any, b: any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      this.readData.sort((a:any, b:any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      console.log(this.readData.length);
      this.updateFilteredData(); // Update filtered data initially
     
      
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
        const key = this.mapColumnToKey(column, entry); // Pass 'entry' as the second argument
        let value = key;
  
        if (key === 'isOwner') {
          value = this.map[value];
        }
  
        console.log(`Mapping column "${column}" to key "${key}" with value: ${value}`);
        exportEntry[column] = value;
      });
  
      console.log('Export Entry:', exportEntry);
      return exportEntry;
    });
  
    const csvContent = this.convertToCSV(dataToExport);
    console.log('CSV Content:', csvContent);
  
    this.downloadCSV(csvContent, 'deletedUser_log.csv');
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



  private mapColumnToKey(columnName: string, entry: any): any {
    switch (columnName) {
      case 'Profile Image': 
        return entry.profile;
      case 'Name': 
        // Combine firstName and lastName for 'Name' if both are present
        return `${entry.firstName || ''} ${entry.lastName || ''}`.trim();
      case 'Email': 
        return entry.email;
      case 'Mobile': 
        return entry.mobileNumber;
      case 'Block': 
        return entry.blockName;
      case 'Flat No': 
        return entry.rentalUnitName;
      case 'createdOn': 
        return entry.createdAt;
      case 'Deleted On': 
        return entry.updatedAt;
      case 'Owner/Tenant': 
        return entry.isOwner;
      default: 
        return '';
    }
  }


  updateFilteredData() {
    if (this.searchTerm) {
      this.filteredData = this.readData.filter((us: { firstName: string; lastName: string; email: string; mobileNumber: string; rentalUnitName: string; }) => {
        const term = this.searchTerm.toLowerCase();
        return (
          (us.firstName && us.firstName.toLowerCase().includes(term)) ||
          (us.lastName && us.lastName.toLowerCase().includes(term)) ||
          (us.email && us.email.toLowerCase().includes(term)) ||
          (us.mobileNumber && us.mobileNumber.toLowerCase().includes(term)) ||
          (us.rentalUnitName && us.rentalUnitName.toLowerCase().includes(term))
        );
      });
    } else {
      this.filteredData = [...this.readData];
    }
    this.filteredLength = this.filteredData.length;
  //  this.updateSelectedIds(); // Update selectedIds based on filteredData
  }

   onImageError(event: any) {
    event.target.src = 'assets/logo.jpg';
  }
  
  back(){
    this._location.back();
  }
  

}