import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../../download-confirm-dialog/download-confirm-dialog.component';

@Component({
  selector: 'app-vendorlist',
  templateUrl: './vendorlist.component.html',
  styleUrls: ['./vendorlist.component.css']
})
export class VendorlistComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;
  loading = false;
  closeResult: any;
  map: any ={
    false: "Active",
    true: "Inactive"
  }
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
  searchTerm: string = ''; 
  originalData: any[] = [];
  

  constructor(
    private service:ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
     private modalService: NgbModal,
      private _location: Location,
    private dialog:MatDialog) { }

      readData:any = []; 
      readData2:any = [];
      getparamid:any;
    
      totalLength:any;
      page:number = 1; 


   

  ngOnInit(): void {
  this.getAllData();
  this.getAllgeneralLedgerData();
  this.updateColumnLists();
  // this.loadData();

  


  this.form = this.formBuilder.group({
    vendorName: [null],
    pan:[null],
    mobile: [null],
    email:[null], 
    bankAccount: [null],
    gstNumber:[null], 
    accountBranch: [null],
    ifscCode:[null], 
    address: [null],
    department:[null],
    socityId:[this.societyId]
  });
   
  }
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.form.reset();

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.form.reset();

    });
  }
  back(){
    this._location.back();
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

  
  columns = [
    { name: 'Name', visible: true },
    { name: 'Pan Card Number', visible: true },
    { name: 'Phone Number', visible: true },
    { name: 'Email', visible: true },
    { name: 'Bank Account', visible: true },
    { name: 'GST Number', visible: true },
    { name: 'Account Branch', visible: true },
    { name: 'IFSC Code', visible: true },
    { name: 'Address', visible: true },
    { name: 'Department(COA)', visible: true },
    { name: 'Active Status', visible: true },
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
       
           this.downloadCSV(csvContent, 'VendorList_log.csv');
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
          case 'Name': return 'vendorName';
          case 'Pan Card Number': return 'pan';
          case 'Phone Number': return 'mobile';
          case 'Email': return 'email';
          case 'Bank Account': return 'bankAccount';
          case 'GST Number': return 'gstNumber';
          case 'Account Branch': return 'accountBranch';
          case 'IFSC Code': return 'ifscCode';
          case 'Address': return 'address';
          case 'Department(COA)': return 'department';
          case 'Active Status': return 'disabled'; // Assuming 'disabled' maps to active status
          case 'Edit': return 'edit';
          case 'Delete': return 'delete';
          default: return '';
        }
      }
      
  saveDetails(form:any) {
    const result = window.confirm('Are you sure you want to add this Vendor?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
    if(this.form.valid)
    {
      console.log(this.form.value);
      this.service.createPayment_vendor(this.form.value).subscribe((res)=>{
        console.log(res,'res==>');
        this.loading = false;
        this.form.reset();
        this.getAllData();
      });
    }
  }else {
    this.loading = false;
    this.form.reset();
    console.log('Delete canceled');
  }
  }

  // loadData() {
  //   this.service.getPayment_vendor().subscribe((res) => {
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
        vendorName?: string; 
        mobile?: string | number; 
        pan?: string; 
        email?: string; 
        bankAccount?: string; 
        gstNumber?: string; 
        accountBranch?: string; 
        ifscCode?: string; 
        address?: string; 
        department?: string;
      }) => 
        (us.vendorName?.toLowerCase().includes(searchValue) || 
         us.mobile?.toString().includes(searchValue) ||
         us.pan?.toLowerCase().includes(searchValue) ||
         us.email?.toLowerCase().includes(searchValue) ||
         us.bankAccount?.toLowerCase().includes(searchValue) ||
         us.gstNumber?.toLowerCase().includes(searchValue) ||
         us.accountBranch?.toLowerCase().includes(searchValue) ||
         us.ifscCode?.toLowerCase().includes(searchValue) ||
         us.address?.toLowerCase().includes(searchValue) ||
         us.department?.toLowerCase().includes(searchValue))
      );
    }
    // Update total length for pagination
    this.totalLength = this.readData2.length;
  }
  
  
  
  
  
  
  
  OnEdit(us:any,form:any){
     
    this.getparamid = us.id;
    console.log(this.getparamid);
  
    this.form.controls['vendorName'].setValue(us.vendorName);
    this.form.controls['pan'].setValue(us.pan);
    this.form.controls['mobile'].setValue(us.mobile);
    this.form.controls['email'].setValue(us.email); 
    this.form.controls['bankAccount'].setValue(us.bankAccount);
    this.form.controls['gstNumber'].setValue(us.gstNumber);
     this.form.controls['accountBranch'].setValue(us.accountBranch);
     this.form.controls['ifscCode'].setValue(us.ifscCode);
     this.form.controls['department'].setValue(us.department);
    this.form.controls['address'].setValue(us.address);
   
   }
   payment_vendorUpdate(){
     console.log(this.getparamid);
     console.log(this.form.value,'updated');
     const result = window.confirm('Are you sure you want to change these Vendor details?');
  if (result) {
    this.loading = true;
    console.log('confirmed');
     if(this.form.valid)
     {
       
       this.service.updatePayment_vendor(
        {
          id:this.getparamid,
          vendorName:this.form.value.vendorName,
          pan:this.form.value.pan,
          mobile:this.form.value.mobile,
          email:this.form.value.email,
          bankAccount:this.form.value.bankAccount,
          gstNumber:this.form.value.gstNumber,
          accountBranch:this.form.value.accountBranch,
          ifscCode:this.form.value.ifscCode, 
          department:this.form.value.department,
          address:this.form.value.address,
          
        } 
        ).subscribe((res)=>{
         alert( 'Updated Successfully...');
         this.loading = false;
           this.getAllData();
       });
     }
    }else {
      this.loading = false;
      this.form.reset();
      console.log('Delete canceled');
    }
   }
  
  invoice(){
    this.router.navigate(['/supervisor/paymentdashboard/generateinvoice']);
  }

  getAllData(){
    this.service.getPayment_vendor().subscribe((res)=>{
      console.log(res,"res==>");
        this.originalData = res.data;          // ✅ Store full data
    this.readData2 = [...res.data];
      this.totalLength = (res.data).length;

     
    });
  }
  getAllgeneralLedgerData(){
    this.service.getGeneralLedger().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
     
    });
  }

  UpdateButton(us:any){
    this.getparamid = us.id  ;
    console.log(this.getparamid);
    console.log(us.disabled);
  
    const result = window.confirm('Are you sure you want to change Vendor status?');
      if (result) {
        console.log('confirmed');
        console.log(us.disabled);

     if((us.disabled) == false){
     console.log('confirmed');
     console.log(us.disabled);


     
      console.log(this.map[us.disabled]);
      this.service.disablePayment_vendor({id:this.getparamid}).subscribe((res)=>{
        // alert( 'User Approved Successfully...');
        // confirm()
  
        console.log('confirmed');
     this.getAllData();
    });
      } else if(((us.disabled) == true)) {
        console.log(this.map[us.disabled]);
      this.service.enablePayment_vendor({id:this.getparamid}).subscribe((res)=>{
       
        console.log(us.disabled);
     this.getAllData();
        console.log('Delete canceled');
      });}
    
     
  
  }
  else
  {
    console.log(this.map[us.disabled]);
  }
   }
  
  togglePerOne(){ 
    if (this.allSelected.selected) {  
     this.allSelected.deselect();
     //return false;
 }
   if(this.searchUserForm.controls.userType.value.length==this.readData2.length)
     this.allSelected.select();
 
 }
   toggleAllSelection() {
     if (this.allSelected.selected) {
       this.searchUserForm.controls.userType
         .patchValue([...this.readData2.map((item: { name: any; }) => item.name), 0]);
     } else {
       this.searchUserForm.controls.userType.patchValue([]);
     }
   }
}



