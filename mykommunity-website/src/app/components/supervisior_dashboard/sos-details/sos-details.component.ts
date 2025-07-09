import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ApiService } from 'src/app/services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';


@Component({
  selector: 'app-sos-details',
  templateUrl: './sos-details.component.html',
  styleUrls: ['./sos-details.component.css']
})
export class SosDetailsComponent implements OnInit {

  closeResult: any;

  constructor(
    private service:ApiService,
    private modalService: NgbModal, 
    private _location: Location, private cdr: ChangeDetectorRef,
    private dialog: MatDialog,) { }

  totalLength:any;
  page:number = 1;
  searchText: string = '';
  filterDate: string = '';
  readData: any[] = [];
  filteredData: any[] = [];  
  getparamid:any;
  sortDirection: { [key: string]: boolean } = {};
  isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'RESOLVED':
        return 'green';
      case 'ACKNOWLEDGED':
        return 'rgb(195, 135, 23)';
      case 'CREATED':
        return 'darkcyan';
      default:
        return '';
    }
  }
 
  getStatusIcon(status: string): string {
    switch (status) {
      case 'RESOLVED':
        return 'verified';
      case 'CREATED':
        return 'campaign';
      case 'ACKNOWLEDGED':
        return 'notifications_active';
      default:
        return '';
    }
  }
//verified

  ngOnInit(): void {
    this.getAllData();
    this.updateColumnLists();
    
  }

  columns = [
    { name: 'SOS Image', visible: true },
    { name: 'SOS', visible: true },
    { name: 'Housing Unit', visible: true },
    { name: 'Raised By', visible: true },
    { name: 'Resident Mobile', visible: true },
    { name: 'Raised Time', visible: true },
    { name: 'Acknowledged At', visible: true },
    { name: 'Resolved At', visible: true },
    { name: 'Status', visible: true }
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
    this.filteredData.sort((a: any, b: any) => {
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
  console.log('Filtered Data:', this.filteredData); 

  const visibleColumns = this.columns
      .filter(col => col.visible && col.name !== 'Actions')
      .map(col => col.name);

  console.log('Visible Columns:', visibleColumns);

  const dataToExport = this.filteredData.map((entry: { [x: string]: any; }) => {
      const exportEntry: any = {};
      
      visibleColumns.forEach(column => { 
          const key = this.mapColumnToKey(column);
       
          if (key === 'userFlatInfo' && entry[key]) {
              exportEntry[column] = entry[key].rentalUnitName || '';
          } else {
              exportEntry[column] = entry[key] ?? ''; 
          }
          
          console.log(`Mapping column "${column}" to key "${key}" with value: ${exportEntry[column]}`);
      });

      console.log('Export Entry:', exportEntry);
      return exportEntry;
  });

  const csvContent = this.convertToCSV(dataToExport);
  console.log('CSV Content:', csvContent); 

  this.downloadCSV(csvContent, 'sosdetails_log.csv');
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


private mapColumnToKey(columnName: string): string {
  switch (columnName) {
    case 'SOS Image': return 'sosImage';
    case 'SOS': return 'sosName';
    case 'Housing Unit': return 'userFlatInfo';
    case 'Raised By': return 'firstName';
    case 'Resident Mobile': return 'mobileNumber';
    case 'Raised Time': return 'createdAt';
    case 'Acknowledged At': return 'acknowledgedAt';
    case 'Resolved At': return 'resolvedAt';
    case 'Status': return 'status';
    default: return '';
  }
}


   
  getAllData(){
    this.service.getSosDetails().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
      this.filteredData = this.readData; // Initialize with all data
    this.totalLength = this.filteredData.length; 
   //   this.totalLength = (res.data).length;
    });
  }

    
  back(){
    this._location.back();
  }
  applyFilters(): void {
    this.filteredData = this.readData.filter(item => {
      const matchesFirstName = item.firstName?.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesLastName = item.lastName?.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesSosName = item.sosName.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesMobileNumber = item.mobileNumber?.includes(this.searchText);
      const matchesRentalUnitName = item.userFlatInfo?.rentalUnitName?.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesDate = this.filterDate ? 
      [item.createdAt, item.acknowledgedAt, item.resolvedAt]
        .some(date => new Date(date).toDateString() === new Date(this.filterDate).toDateString()) 
      : true;
      return (matchesFirstName || matchesLastName || matchesSosName || matchesMobileNumber || matchesRentalUnitName) && matchesDate;
    });
    this.totalLength = this.filteredData.length;
  }
  
    
  open(content: any) {
    
     this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
       this.closeResult =` Closed with: ${result}`;
     }, (reason) => {
       this.closeResult = `Dismissed ${this.getDismiss(reason)}`;
       this.getAllData();

     });
    
     
   }
 
   private getDismiss(reason: any): string {
     if (reason === ModalDismissReasons.ESC) {
       return 'by pressing ESC';
     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
       return 'by clicking on a backdrop';
     } else {
       return `with: ${reason};`
     }

   }
      
     

}