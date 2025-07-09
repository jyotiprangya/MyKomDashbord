import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';


@Component({
  selector: 'app-societydirectory',
  templateUrl: './societydirectory.component.html',
  styleUrls: ['./societydirectory.component.css']
})
export class SocietydirectoryComponent implements OnInit {

  constructor(private service:ApiService, private _location: Location, private cdr: ChangeDetectorRef,
    private dialog: MatDialog,) { }


  totalLength:any;
  page:number=1;
  searchTerm:any = "";
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
    false: "Tenant",
    true: "Owner"
  }
  readData:any = [];

  ngOnInit(): void {
    this.getAllData();
    this.updateColumnLists();
  }

  columns = [
    { name: 'Profile', visible: true },
    { name: 'Name', visible: true },
    { name: 'Email', visible: true },
    { name: 'Mobile', visible: true },
    { name: 'Block', visible: true },
    { name: 'Flat No', visible: true },
    { name: 'createdOn', visible: true }, 
    { name: 'lastUpdatedOn', visible: true },
    { name: 'Owner/Tenant', visible: true }
];

  back(){
    this._location.back();
  }
  onImageError(event: any) {
    event.target.src = 'assets/logo.jpg';
  }


  
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
  
    this.downloadCSV(csvContent, 'societydirectory_log.csv');
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
    if (link.download !== undefined) {
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
      case 'Profile': 
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
      case 'lastUpdatedOn': 
        return entry.updatedAt;
      case 'Owner/Tenant': 
        return entry.isOwner;
      default: 
        return '';
    }
  }
  
  
  
  getAllData() {
    this.service.getUserlist().subscribe((res) => {
      console.log(res, "res==>");
      this.readData = res.data
        .filter((user: { disabled: boolean; rentalUnitStatus: string; }) => 
          user.disabled === false && user.rentalUnitStatus === 'APPROVED'
        )
        .sort((a: any, b: any) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
      this.totalLength = this.readData.length;
    });
  }
  
}