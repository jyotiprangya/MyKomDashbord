import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../../download-confirm-dialog/download-confirm-dialog.component';

@Component({
  selector: 'app-generalpayment',
  templateUrl: './generalpayment.component.html',
  styleUrls: ['./generalpayment.component.css']
})
export class GeneralpaymentComponent implements OnInit {

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
      private af:AngularFireStorage,
      private dialog: MatDialog,
      ) { }

  readData2:any = []; 
  readData:any = []; 
  readData3:any = []; 
  readData4:any = []; 

  showScreen = false;

  showScreen2 = false;
  showScreen3 = false;
  totalLength:any;
  page:number = 1; 

  getparamid:any;
  firebase! :any;
  path!: string;
  downloadURL: Observable<string> | undefined;


  ngOnInit(): void {
  this.getAllData();
  this.getAllCOAData();
  this.getAllAccountData();
  this.updateColumnLists();
  // this.loadData();
  

  this.form = this.formBuilder.group({
    paymentName: ['', Validators.required],
    date: ['', Validators.required],
    accountId: ['', Validators.required],
    amount: ['', Validators.required],
    description: [''],
    chequeNo: [''],
    reference: [''],
    chequeDate: [new Date()],
    paymentMode: ['', Validators.required],
    chartOfAccountId:['',Validators.required],
    attachment:['']
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

  
  // loadData() {
  //   this.service.getgeneral_payment().subscribe((res) => {
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
        date?: string;
        paymentName?: string; 
        chartOfAccountName?: string; 
        description?: string; 
        paymentMode?: string;
      }) => 
        (us.date?.toLowerCase().includes(searchValue) ||
         us.paymentName?.toLowerCase().includes(searchValue) ||
         us.chartOfAccountName?.toLowerCase().includes(searchValue) ||
         us.description?.toLowerCase().includes(searchValue) ||
         us.paymentMode?.toLowerCase().includes(searchValue))
      );
    }
    // Update total length for pagination
    this.totalLength = this.readData2.length;
  }
  
  

  columns = [
    { name: 'Date', visible: true },
    { name: 'Name', visible: true },
    { name: 'Department', visible: true },
    { name: 'Description', visible: true },
    { name: 'Payment Mode', visible: true },
    { name: 'Reference', visible: true },
    { name: 'Cheque Number', visible: true },
    { name: 'Cheque Date', visible: true },
    { name: 'Paying Account', visible: true },
    { name: 'Amount', visible: true },
    { name: 'Edit', visible: true },
    { name: 'Select All', visible: true }
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
       
           this.downloadCSV(csvContent, 'Generalpayment_log.csv');
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
          case 'Date': return 'date';
          case 'Name': return 'paymentName';
          case 'Department': return 'chartOfAccountName';
          case 'Description': return 'description';
          case 'Payment Mode': return 'paymentMode';
          case 'Reference': return 'reference';
          case 'Cheque Number': return 'chequeNo';
          case 'Cheque Date': return 'chequeDate';
          case 'Paying Account': return 'bankName';
          case 'Amount': return 'amount';
          case 'Edit': return 'edit';
          case 'Select All': return 'selectAll';
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
  invoice(){
    this.router.navigate(['/supervisor/paymentdashboard/generateinvoice']);
  }

   getAllData(){
    this.service.getgeneral_payment().subscribe((res)=>{
      console.log(res,"res==>");
       this.originalData = res.data;          // ✅ Store full data
    this.readData2 = [...res.data];
      this.totalLength = (res.data).length;

     
    });
  }
  getAllAccountData(){
    this.service.getSocietyAccount().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
     
    });
  }
  getAllCOAData(){
    this.service.getChartOfAccount().subscribe((res)=>{
      console.log(res,"res==>");
     this.readData3 = res.data;
    
    });
  }
  SelectedImage:any;
   media:any;

  upload(event:any){
 
    
    var file = event.target.files[0];
   
    var n = Date.now();
   // const file = event.target.files[i];
   //const filePathinlocal = `${this.basePath}/${file.name}`;  
   this.media = file;
   console.log(file);
   var reader = new FileReader()
   reader.readAsDataURL(event.target.files[0])
   reader.onload = (event:any)=>{
     this.SelectedImage = event.target.result;
   }
    const filePath = `Local_Service/${n}`;
    const fileRef = this.af.ref(filePath);
    const task = this.af.upload(`Local_Service/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.firebase = url;
            }
            console.log(this.firebase);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          url;
          console.log(url);
        //  console.log(this.firebase);
        }
      });
 
 
 
   }
 

  saveDetails(form:any) {

    const result = window.confirm('Are you sure you want to add this?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
    if(this.form.valid)
    {
      console.log(this.form.value);
      this.form.value.attachment = this.firebase ;
 console.log(this.form.value.attachment);
 console.log(this.firebase);
      this.service.creategeneral_payment(
        this.form.value
        ).subscribe((res)=>{
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
  OnEdit(us:any,form:any){
   
    this.getparamid = us.paymentId;
    console.log(this.getparamid);
  
    this.form.controls['paymentName'].setValue(us.paymentName);
    this.form.controls['paymentMode'].setValue(us.paymentMode);
    this.form.controls['date'].setValue(us.date);
    this.form.controls['accountId'].setValue(us.accountId);
    this.form.controls['amount'].setValue(us.amount);
    this.form.controls['description'].setValue(us.description);
    this.form.controls['chequeNo'].setValue(us.chequeNo);
    this.form.controls['reference'].setValue(us.reference);
    this.form.controls['chequeDate'].setValue(us.chequeDate);
    this.form.controls['chartOfAccountId'].setValue(us.chartOfAccountId);
    this.form.controls['attachment'].setValue(us.attachment);

  
   }
   UpdateGP(){
     console.log(this.getparamid);
     console.log(this.form.value,'updated');
     const result = window.confirm('Are you sure you want to change these following details?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
     {
       
       this.service.updategeneral_payment(
        {
          paymentId:this.getparamid,
          paymentName:this.form.value.paymentName,
          paymentMode:this.form.value.paymentMode,
          date:this.form.value.date,
          accountId:this.form.value.accountId,
          amount:this.form.value.amount,
          description:this.form.value.description,
          chequeNo:this.form.value.chequeNo,
          reference:this.form.value.reference,
          chequeDate:this.form.value.chequeDate,
          chartOfAccountId:this.form.value.chartOfAccountId,
          attachment:this.firebase,

        } 
        ).subscribe((res)=>{
          console.log(res,'res==>');
  
         alert( 'Updated Successfully...');
         this.loading = false;
           this.getAllData();
       },(error) => {
        this.loading = false;
        this.form.reset();
  
        alert(error.error.message);
        console.error('Error:', error.error.message);
        // You can show an error message to the user if needed
      });
     }
    }else {
      this.form.reset();
      this.loading = false;
      console.log('Delete canceled');
    }
   }
  


//   togglePerOne(){ 
//     if (this.allSelected.selected) {  
//      this.allSelected.deselect();
//      //return false;
//  }
//    if(this.searchUserForm.controls.userType.value.length==this.readData2.length)
//      this.allSelected.select();
 
//  }
//    toggleAllSelection() {
//      if (this.allSelected.selected) {
//        this.searchUserForm.controls.userType
//          .patchValue([...this.readData2.map((item: { name: any; }) => item.name), 0]);
//      } else {
//        this.searchUserForm.controls.userType.patchValue([]);
//      }
//    }
}


