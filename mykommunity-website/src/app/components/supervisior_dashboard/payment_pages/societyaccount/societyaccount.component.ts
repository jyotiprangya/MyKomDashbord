import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators, UntypedFormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../../download-confirm-dialog/download-confirm-dialog.component';

@Component({
  selector: 'app-societyaccount',
  templateUrl: './societyaccount.component.html',
  styleUrls: ['./societyaccount.component.css']
})
export class SocietyaccountComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;
  loading = false;
  closeResult: any;
  getparamid: any;
  accountNumber: any;
  readData: any = [];
  totalLength: any;
  page: number = 1;
  map: any = {
    false: "Active",
    true: "Inactive"
  }

  role = sessionStorage.getItem('role');
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
    private service: ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private modalService: NgbModal,
    private _location: Location,
    private dialog: MatDialog,
  ) { }

  productForm!: UntypedFormGroup;
  societyId = sessionStorage.getItem('societyId');

  ngOnInit(): void {
    this.initializeComponent();
  }

  // Initialize component with all necessary data loading
  initializeComponent(): void {
    this.getAllData();
    this.updateColumnLists();
    // this.loadData();

    this.form = this.formBuilder.group({
      bankName: [null],
      accountNumber: [null],
      ifscCode: [null],
      accountHolderName: [null],
      credit: [0],
      debit: [0],
      socityId: [this.societyId],
      email: [null],
      mobile: [null],
    });
  }

  // Comprehensive reload function
  reloadData(): void {
    this.loading = true;
    console.log('Reloading data...');
    
    // Reset form and states
    this.form.reset();
    this.form.patchValue({
      credit: 0,
      debit: 0,
      socityId: this.societyId
    });
    
    this.getparamid = null;
    this.accountNumber = null;
    
    // Reload all data
    this.getAllData();
    this.loadData();
    
    // Reset search
    this.searchTerm = '';
    
    // Reset pagination
    this.page = 1;
    
    this.loading = false;
    console.log('Data reloaded successfully');
  }

  // Enhanced getAllData with reload callback
  getAllData(): void {
    this.service.getSocietyAccount().subscribe((res) => {
      console.log(res, "res==>");
       this.originalData = res.data;          // ✅ Store full data
    this.readData = [...res.data];
      
      this.originalData = [...res.data]; // Update original data for search
      this.totalLength = (res.data).length;
    }, (error) => {
      console.error("Error fetching society account data:", error);
      alert("Error loading data. Please try again.");
    });
  }

  // Enhanced loadData with better error handling
  loadData(): void {
    this.service.getSocietyAccount().subscribe((res) => {
      console.log(res, "res==>");
      this.originalData = res.data;
      this.readData = [...this.originalData];
      this.totalLength = this.readData.length;
    }, error => {
      console.error("Error fetching vendor data:", error);
      alert("Error loading data. Please try again.");
    });
  }

  // Enhanced saveDetails with reload
  saveDetails(form: any): void {
    const result = window.confirm('Are you sure you want to add this Account?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
      
      if (this.form.valid) {
        console.log(this.form.value);
        this.service.createSocietyAccount(this.form.value).subscribe((res) => {
          console.log(res, 'res==>');
          this.loading = false;
          alert("Account added Successfully...");
          
          // Reload data after successful creation
          this.reloadData();
          this.onCancelClick();
          
        }, (error) => {
          this.loading = false;
          this.form.reset();
          alert(error.error.message);
          console.error('Error:', error.error.message);
        });
      }
    } else {
      this.loading = false;
      this.form.reset();
      this.onCancelClick();
      console.log('Add canceled');
    }
  }

  // Enhanced AddStakeHolder with reload
  AddStakeHolder(accountId: any, socityId: any): void {
    const result = window.confirm('Are you sure you want to add?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
      
      this.service.createStakeHolder({
        "accountId": accountId,
        "SocietyId": socityId
      }).subscribe((res) => {
        console.log(res, 'res==>');
        this.loading = false;
        alert("StakeHolder added Successfully...");
        
        // Reload data after successful creation
        this.reloadData();
        this.onCancelClick();
        
      }, (error) => {
        this.loading = false;
        alert(error.error.message);
        console.error('Error:', error.error.message);
      });
    } else {
      this.loading = false;
      this.form.reset();
      this.onCancelClick();
      console.log('Add canceled');
    }
  }

  // Enhanced AddAccountDetailToRazorpay with reload
  AddAccountDetailToRazorpay(accountId: any, socityId: any): void {
    const result = window.confirm('Are you sure you want to add?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
      
      this.service.addAccntDetailsToRazorpay({
        "accountId": accountId,
        "SocietyId": socityId
      }).subscribe((res) => {
        console.log(res, 'res==>');
        this.loading = false;
        alert("Account added To RazorPay Successfully...");
        
        // Reload data after successful operation
        this.reloadData();
        this.onCancelClick();
        
      }, (error) => {
        this.loading = false;
        alert(error.error.message);
        console.error('Error:', error.error.message);
      });
    } else {
      this.loading = false;
      this.onCancelClick();
      console.log('Add canceled');
    }
  }

  // Enhanced UpdateButton with reload
  UpdateButton(us: any): void {
    this.getparamid = us.id;
    this.accountNumber = us.accountNumber;
    console.log(this.getparamid);
    console.log(us.disabled);

    const result = window.confirm('Are you sure you want to change Account status?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
      console.log(us.disabled);

      if ((us.disabled) == false) {
        console.log('confirmed');
        console.log(us.disabled);

        this.service.disableSocietyAccount({ accountNumber: this.accountNumber }).subscribe((res) => {
          console.log('confirmed');
          console.log(us.rentalUnitStatus);
          this.loading = false;
          alert("Updated Successfully...");
          
          // Reload data after successful update
          this.reloadData();
          this.onCancelClick();

        }, (error) => {
          this.loading = false;
          this.form.reset();
          alert(error.error.message);
          console.error('Error:', error.error.message);
        });
      } else if (((us.disabled) == true)) {
        console.log(this.map[us.disabled]);
        this.service.enableSocietyAccount({ accountNumber: this.accountNumber }).subscribe((res) => {
          console.log('confirmed');
          console.log(us.disabled);
          this.loading = false;
          alert("Updated Successfully...");
          
          // Reload data after successful update
          this.reloadData();
          this.onCancelClick();

        }, (error) => {
          this.loading = false;
          alert(error.error.message);
          console.error('Error:', error.error.message);
        });
      }
    } else {
      this.onCancelClick();
      console.log(this.map[us.disable]);
    }
  }

  // Enhanced AccountUpdate with reload
  AccountUpdate(): void {
    console.log(this.getparamid);
    console.log(this.form.value, 'updated');
    const result = window.confirm('Are you sure you want to change these details in your Society Account?');
    
    if (result) {
      this.loading = true;
      console.log('confirmed');

      this.service.updateSocietyAccount({
        accountId: this.getparamid,
        bankName: this.form.value.bankName,
        accountNumber: this.form.value.accountNumber,
        ifscCode: this.form.value.ifscCode,
        debit: this.form.value.debit,
        credit: this.form.value.credit,
        accountHolderName: this.form.value.accountHolderName,
        socityId: this.societyId
      }).subscribe((res) => {
        this.loading = false;
        alert("Updated Successfully...");
        
        // Reload data after successful update
        this.reloadData();
        this.onCancelClick();

      }, (error) => {
        this.loading = false;
        this.form.reset();
        alert(error);
        console.error('Error:', error);
      });
    } else {
      this.form.reset();
      console.log('Update canceled');
    }
  }

  // Manual refresh button function (can be called from template)
  refreshData(): void {
    console.log('Manual refresh triggered');
    this.reloadData();
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.form.reset();
    }, (reason) => {
      this.form.reset();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  back() {
    this._location.back();
  }

  searchData() {
    if (!this.searchTerm.trim()) {
      this.readData = [...this.originalData];
    } else {
      const searchValue = this.searchTerm.toLowerCase();
      this.readData = this.originalData.filter((us: {
        bankName?: string;
        accountNumber?: string | number;
        ifscCode?: string;
        accountHolderName?: string;
        credit?: string | number;
        debit?: string | number;
      }) =>
        (us.bankName?.toLowerCase().includes(searchValue) ||
          us.accountNumber?.toString().includes(searchValue) ||
          us.ifscCode?.toLowerCase().includes(searchValue) ||
          us.accountHolderName?.toLowerCase().includes(searchValue) ||
          us.credit?.toString().includes(searchValue) ||
          us.debit?.toString().includes(searchValue)
        )
      );
    }
    this.totalLength = this.readData.length;
  }

  columns = [
    { name: 'Bank Name', visible: true },
    { name: 'Account Number', visible: true },
    { name: 'IFSC Code', visible: true },
    { name: 'Account holder Name', visible: true },
    { name: 'Credit Balance', visible: true },
    { name: 'Debit Balance', visible: true },
    { name: 'Active Status', visible: true },
    { name: 'Add StakeHolder', visible: true },
    { name: 'Product', visible: true },
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
    this.sortDirection[column] = !this.sortDirection[column];
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

    this.downloadCSV(csvContent, 'account_log.csv');
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
      case 'Bank Name': return 'bankName';
      case 'Account Number': return 'accountNumber';
      case 'IFSC Code': return 'ifscCode';
      case 'Account holder Name': return 'accountHolderName';
      case 'Credit Balance': return 'credit';
      case 'Debit Balance': return 'debit';
      case 'Active Status': return 'disabled';
      case 'Add StakeHolder': return 'stakeHolderId';
      case 'Product': return 'accountId';
      default: return '';
    }
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

  onCancelClick() {
    this.getparamid = "";
    this.form.reset();
    this.form.patchValue({
      credit: 0,
      debit: 0,
      socityId: this.societyId
    });
  }

  invoice() {
    this.router.navigate(['/supervisor/paymentdashboard/generateinvoice']);
  }

  OnEdit(us: any, form: any) {
    this.getparamid = us.accountId;
    console.log(this.getparamid);

    this.form.controls['bankName'].setValue(us.bankName);
    this.form.controls['accountNumber'].setValue(us.accountNumber);
    this.form.controls['ifscCode'].setValue(us.ifscCode);
    this.form.controls['accountHolderName'].setValue(us.accountHolderName);
    this.form.controls['credit'].setValue(us.credit);
    this.form.controls['debit'].setValue(us.debit);
  }

  quantities(): UntypedFormArray {
    return this.productForm.get("quantities") as UntypedFormArray
  }

  newQuantity(): UntypedFormGroup {
    return this.formBuilder.group({
      qty: '',
      price: '',
    })
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }

  onSubmit() {
    console.log(this.productForm.value);
  }
}