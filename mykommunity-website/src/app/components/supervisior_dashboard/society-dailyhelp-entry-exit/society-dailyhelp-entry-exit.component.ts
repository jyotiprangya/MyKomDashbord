import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';

@Component({
  selector: 'app-society-dailyhelp-entry-exit',
  templateUrl: './society-dailyhelp-entry-exit.component.html',
  styleUrls: ['./society-dailyhelp-entry-exit.component.css']
})
export class SocietyDailyhelpEntryExitComponent implements OnInit {


  closeResult: any;
  form:any= UntypedFormGroup;
  constructor(private service:ApiService,private fb: UntypedFormBuilder,
     private modalService: NgbModal, private _location: Location, private cdr: ChangeDetectorRef,
     private dialog: MatDialog,) { }
  role=sessionStorage.getItem('role');

  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  getparamid:any;
  showImage = false;
  showparcelImage = false;
  searchActivity:any = "";
  sortDirection: { [key: string]: boolean } = {};
  isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;
  filteredData: any[] = [];
  selectedDate: Date | null = null;

  societyId=sessionStorage.getItem('societyId');
  map: any ={
    true: "Inactive",
    false: "Active"
  }
  getStatusColor(status: string): string {
    switch (status) {
      
      case 'ENTRY':
        return 'green';
      case 'EXIT':
        return 'darkcyan';
      case 'DAILY_HELP_PROVIDER_UPDATED':
        return 'rgb(213, 77, 100)';
        case 'DAILY_HELP_PROVIDER_CREATED':
          return 'green';
        
      default:
        return '';
    }
  }

  
  
  
  getStatusIcon(status: string): string {
    switch (status) {
      case 'PRE_APPROVED':
        return 'verified';
      case 'ENTRY':
        return 'login';
      case 'EXIT':
        return 'logout';
      case 'DAILY_HELP_PROVIDER_UPDATED':
        return 'edit';
        case 'DAILY_HELP_PROVIDER_CREATED':
        return 'add_circle';
      case 'PENDING_APPROVAL':
        return 'alarm';
      case 'COLLECTED':
        return 'add_task';
      case 'DENIED':
        return 'error_outline';
      default:
        return '';
    }
  }
  ngOnInit(): void {
   this.getAllData();
   this.updateColumnLists();
  this.form = this.fb.group({
    name: [null]
  });

}

columns = [
  { name: 'Profile', visible: true },
  { name: 'Name', visible: true },
  { name: 'Mobile Number', visible: true },
  { name: 'Service Category', visible: true },
  { name: 'Entry Time', visible: true },
  { name: 'Entry Photo', visible: true },
  { name: 'Exit Time', visible: true },
  { name: 'Exit Photo', visible: true }
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

private mapColumnToKey(columnName: string): string {
  switch (columnName) {
    case 'Profile': return 'image';
    case 'Name': return 'dailyHelpName';
    case 'Mobile Number': return 'mobileNumber';
    case 'Service Category': return 'dailyHelpCategory';
    case 'Entry Time': return 'inTime';
    case 'Entry Photo': return 'inTimeImage';
    case 'Exit Time': return 'outTime';
    case 'Exit Photo': return 'outTimeImage';
    default: return '';
  }
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

    const dataToExport: any[] = [];

    // Iterate through each entry
    this.readData.forEach((entry: { [x: string]: any; records: any[]; }) => {
        // Iterate through each record and create a row for each
        entry.records.forEach((record) => {
            const exportEntry: any = {}; // Start with an empty export entry
            
            // Map visible fields
            visibleColumns.forEach(column => {
                const key = this.mapColumnToKey(column);
                
                if (key === 'inTime') {
                    exportEntry['Entry Time'] = record.inTime;  // Add inTime
                } else if (key === 'outTime') {
                    exportEntry['Exit Time'] = record.outTime; 
                }
                    else  if (key === 'inTimeImage') {
                      exportEntry['Entry Photo'] = record.inTimeImage;  // Add inTime
                  } else if (key === 'outTimeImage') {
                      exportEntry['Exit Photo'] = record.outTimeImage;  // Add outTime
                } else if (key) {
                    console.log(`Mapping column "${column}" to key "${key}" with value: ${entry[key]}`);
                    exportEntry[column] = entry[key]; // Add other visible columns
                }
            });

            console.log('Export Entry:', exportEntry);
            dataToExport.push(exportEntry); // Push the entry to dataToExport
        });
    });

    const csvContent = this.convertToCSV(dataToExport);
    console.log('CSV Content:', csvContent);

    this.downloadCSV(csvContent, 'dailyHelpEntryExit_log.csv');
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


filterByDate(): void {
  if (this.selectedDate) {
    const selectedDateStr = new Date(this.selectedDate).toDateString();

    this.filteredData = this.readData.filter((record: any) => {
      const entryDateStr = new Date(record.inTime).toDateString();
      return entryDateStr === selectedDateStr;
    });

    this.totalLength = this.filteredData.length;
  } else {
    // If no date selected, show all 30-day data
    this.filteredData = [...this.readData];
    this.totalLength = this.filteredData.length;
  }
}



getAllData() {
  this.service.getSocietyDailyHelpProviderEntryExitRecord().subscribe((res) => {
    console.log(res, "res==>");

    const today = new Date();
    const past30Days = new Date();
    past30Days.setDate(today.getDate() - 30);

    const allRecentRecords = res.data.flatMap((us: any) => {
      return us.records
        .filter((record: any) => {
          const recordDate = new Date(record.inTime);
          return recordDate >= past30Days && recordDate <= today;
        })
        .map((record: any) => ({
          ...record,
          dailyHelpName: us.dailyHelpName,
          mobileNumber: us.mobileNumber,
          dailyHelpCategory: us.dailyHelpCategory,
          image: us.image
        }));
    });

    // Sort records by inTime descending (recent first)
    this.readData = allRecentRecords.sort((a: any, b: any) =>
      new Date(b.inTime).getTime() - new Date(a.inTime).getTime()
    );

    // Initialize filteredData with all 30-day data
    this.filteredData = [...this.readData];

    this.totalLength = this.filteredData.length;
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
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }

}


}