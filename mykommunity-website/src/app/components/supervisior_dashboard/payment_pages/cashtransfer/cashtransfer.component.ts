import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe, Location } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../../download-confirm-dialog/download-confirm-dialog.component';

@Component({
  selector: 'app-cashtransfer',
  templateUrl: './cashtransfer.component.html',
  styleUrls: ['./cashtransfer.component.css']
})
export class CashtransferComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;
  loading = false;
  closeResult: any;
  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;
  disable = false;
  checked2 = false;
  indeterminate2 = false;
  labelPosition2: 'before' | 'after' = 'after';
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
  enabledBlocks: any[] = [];  
  disabledBlocks: any[] = [];

  constructor(
    private service:ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
     private modalService: NgbModal,
      private _location: Location,
      private dialog:MatDialog,
    ) {

       }

  readData2:any = []; 
  readData:any = []; 
  readData3:any = []; 
  readData4:any = [];
  searchTerm: string = ''; 
  originalData: any[] = []; 

  getparamid:any;

  totalLength:any;
  page:number = 1; 
  map: any ={
    false: "debit",
    true: "credit"
  }
 
  // labelPosition: '1' | '2' = '2';
  isCredit: boolean = true; // Initial value, can be true or false


   

  ngOnInit(): void {
  this.getAllData();
  this.getAllAccountData();
  this.getAllcashtransferData();
  this.getAllchequetransferData();
  this.updateColumnLists();
  // this.loadData();
  

  this.form = this.formBuilder.group({
    type: ['', Validators.required],
    transactionDate: ['', Validators.required],
    fromAccount: [''],
    toAccount: ['', Validators.required],
    chequeDate: [new Date() ],
    chequeNumber: [''],
    description: ['', Validators.required],
    reference: ['', Validators.required],
    amount: ['', Validators.required],
    credit: [false, Validators.required],
    debit: [false, Validators.required],
    societyId:[this.societyId]
  });
   
  }

  // updateCreditValue(value: boolean) {
  //   // this.form.patchValue({ credit: value });
  //   var creditvalue=JSON.parse(this.form.value.credit);
  //   console.log(creditvalue);
  // }

  // updateDebitValue(value: boolean) {
  //   this.form.patchValue({ debit: value });
  // }
  // onRadioButtonChange(event: any) {
  //   this.isCredit = event.target.value === 'credit';
  // }

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

  // loadData() {
  //   this.service.getcash_cheque_transfer().subscribe((res) => {
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
        type?: string;
        transactionDate?: string;
        description?: string;
        reference?: string;
        chequeNumber?: string;
        chequeDate?: string; 
        fromAccount?: string;
        bankName?: string;
        accountNumber?: string | number;
        amount?: string | number;
      }) => 
        ( us.type?.toLowerCase().includes(searchValue) ||
          us.transactionDate?.toLowerCase().includes(searchValue) ||
          us.description?.toLowerCase().includes(searchValue) ||
          us.reference?.toLowerCase().includes(searchValue) ||
          us.chequeNumber?.toLowerCase().includes(searchValue) ||
          us.chequeDate?.toLowerCase().includes(searchValue) ||
          us.fromAccount?.toLowerCase().includes(searchValue) ||
          us.bankName?.toLowerCase().includes(searchValue) ||
          us.accountNumber?.toString().includes(searchValue) ||
          us.amount?.toString().includes(searchValue)
        )
      );
    }
    // Update total length for pagination
    this.totalLength = this.readData2.length;
}

  

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      this.form.reset();

      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      this.form.reset();

      return 'by clicking on a backdrop';
    } else {
      this.form.reset();

      return `with: ${reason}`;
    }

  }
  bankreconcilation(){
    this.router.navigate(['/supervisor/paymentdashboard/bankreconcilationdetails']);
  }
  onCancelClick(){
    this.getparamid = "";
   
    this.form.reset();
   
   
  }

  columns = [
    { name: 'Type', visible: true },
    { name: 'Date', visible: true },
    { name: 'Description', visible: true },
    { name: 'Reference', visible: true },
    { name: 'Cheque Number', visible: true },
    { name: 'Cheque Date', visible: true },
    { name: 'From Account', visible: true },
    { name: 'To Account', visible: true },
    { name: 'Amount', visible: true },
    { name: 'Credit/Debit', visible: true },
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
       
           this.downloadCSV(csvContent, 'Cashtrasfor_log.csv');
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
          case 'Date': return 'transactionDate';
          case 'Description': return 'description';
          case 'Reference': return 'reference';
          case 'Cheque Number': return 'chequeNumber';
          case 'Cheque Date': return 'chequeDate';
          case 'From Account': return 'fromAccount';
          case 'To Account': return 'bankName';
          case 'Amount': return 'amount';
          case 'Credit/Debit': return 'credit';
          case 'Edit': return 'edit';
          default: return '';
        }
      }
      

   getAllData(){
    this.service.getcash_cheque_transfer().subscribe((res)=>{
      console.log(res,"res==>");
      this.originalData = res.data;          // ✅ Store full data
    this.readData2 = [...res.data];
      this.totalLength = (res.data).length;

    });
  }
  getAllcashtransferData(){
    this.service.getcash_transfer().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData4 = res.data;
      //this.totalLength = (res.data).length;

    });
  }
  getAllchequetransferData(){
    this.service.getcheque_transfer().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData3 = res.data;
     // this.totalLength = (res.data).length;

    });
  }

  getAllAccountData(){
    this.service.getSocietyAccount().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
     
    });
  }

  saveDetails(form:any) {
    console.log(this.form.value);
    const result = window.confirm('Are you sure you want to add this transaction record?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
    {
      console.log(this.form.value);
      this.service.createcash_cheque_transfer(this.form.value).subscribe((res)=>{
        console.log(res,'res==>');

    alert(res.message);
      this.loading = false;
        this.form.reset();
        this.getAllData();
        this.onCancelClick();
      },(error) => {
        this.loading = false;
        alert(error.data.message);
        console.error('Error:', error);
        // You can show an error message to the user if needed
      });
    }
  }else {
    this.loading = false;
    this.form.reset();
    this.onCancelClick();
    console.log('Delete canceled');
  }
  }
 
}





