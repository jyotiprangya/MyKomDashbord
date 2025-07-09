import { Component, OnInit } from '@angular/core';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { ApiService } from '../../../../services/api.service';
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../../download-confirm-dialog/download-confirm-dialog.component';


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(private service:ApiService,private router: Router,private fb: UntypedFormBuilder, 
    private modalService: NgbModal, private _location: Location,private dialog: MatDialog) { }
  toppings = new UntypedFormControl('');

  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  getparamid:any;
  getid:any;
  totalLength:any;
  page:number=1;
  
  readData:any = [];
  readData2:any = [];  
  closeResult: any;
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
  enabledBlocks: any[] = [];  
  disabledBlocks: any[] = [];
  searchTerm: string = ''; 
  originalData: any[] = []; 
  dateSearchTerm: string = '';

  ngOnInit(): void {
   this.getAllData();
   this.updateColumnLists();
  //  this.loadData();

  }

  AddBill(){
    this.router.navigate(['/supervisor/paymentdashboard/createBill']);
  }
  BillDetails(){
    this.router.navigate(['/supervisor/paymentdashboard/BillDetails']);
  }
  invoice(){
    this.router.navigate(['/supervisor/paymentdashboard/invoice']);
  }
  back(){
    this._location.back();
  }
  getAllData(){
    this.service.getall_dues().subscribe((res)=>{
      console.log(res,"res==>");
      this.originalData = res.data;          // ✅ Store full data
    this.readData2 = [...res.data];
     this.readData2.sort((a:any, b:any) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
     this.totalLength = (res.data).length;
  });
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
     
    });
  }

  searchByDate() {
  if (!this.dateSearchTerm) {
    // If no date is selected, show all data (but still apply text search if any)
    this.readData2 = [...this.originalData];
    if (this.searchTerm) {
      this.searchData(); // Apply text search if it exists
    }
    return;
  }

  const searchDate = new Date(this.dateSearchTerm);
  
  // Filter data based on the selected date
  this.readData2 = this.originalData.filter(item => {
    // Check both billDate and dueDate
    const billDate = new Date(item.billDate);
    const dueDate = new Date(item.dueDate);
    
    // Compare dates (ignoring time)
    const isSameBillDate = this.isSameDate(billDate, searchDate);
    const isSameDueDate = this.isSameDate(dueDate, searchDate);
    
    return isSameBillDate || isSameDueDate;
  });

 

  this.totalLength = this.readData2.length;
}

// Helper method to compare dates (ignoring time)
private isSameDate(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

  saveDetails(form:any) {
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(form.value, null, 4));
     
  }

  // loadData() {
  //   this.service.getall_dues().subscribe((res) => {
  //     console.log(res, "res==>");
      
  //     this.originalData = res.data; // Store unfiltered full dataset
  //     this.readData2 = [...this.originalData]; // Initialize table data
  //     this.totalLength = this.readData2.length;
  //   }, error => {
  //     console.error("Error fetching vendor data:", error);
  //   });
  // }
  
  searchData() {
    if (!this.searchTerm.trim()) { 
      // Restore the full dataset from originalData
      this.readData2 = [...this.originalData]; 
    } else {
      const searchValue = this.searchTerm.toLowerCase();
      this.readData2 = this.originalData.filter((us: { 
        blockName?: string; 
        floorName?: string; 
        rentalUnitName?: string; 
        chargeName?: string;
        dueAmount?: string | number; 
        billDate?: string; 
        dueDate?: string; 
        paidAmount?: string | number;
      }) => 
        ( `${us.blockName} ${us.floorName} ${us.rentalUnitName}`.toLowerCase().includes(searchValue) ||
         us.chargeName?.toLowerCase().includes(searchValue) ||
         us.dueAmount?.toString().includes(searchValue) ||
         us.billDate?.toLowerCase().includes(searchValue) ||
         us.dueDate?.toLowerCase().includes(searchValue) ||
         us.paidAmount?.toString().includes(searchValue) 
        )
      );
    }
    // Update total length for pagination
    this.totalLength = this.readData2.length;
}

  

  
  columns = [
    { name: 'Door Number', visible: true },
    { name: 'Charge Name', visible: true },
    { name: 'Total Due Amount', visible: true },
    { name: 'Charge Date', visible: true },
    { name: 'Due Date', visible: true },
    { name: 'Paid Amount', visible: true },
    { name: 'Status', visible: true },
    { name: 'Invoice / Receipt', visible: true }
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
      
          this.downloadCSV(csvContent, 'Payment_log.csv');
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
          case 'Door Number': return 'blockName';
          case 'Charge Name': return 'chargeName';
          case 'Total Due Amount': return 'dueAmount';
          case 'Charge Date': return 'billDate';
          case 'Due Date': return 'dueDate';
          case 'Paid Amount': return 'paidAmount';
          case 'Status': return 'paymentStatus';
          case 'Invoice / Receipt': return 'invoice_url';
          default: return '';
        }
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
