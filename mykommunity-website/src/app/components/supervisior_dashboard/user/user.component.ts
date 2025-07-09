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
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

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
    { name: 'Last Update', visible: false },
    { name: 'Approval Status', visible: true },
    { name: 'Active Status', visible: true },
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
    private router: Router,
    private fb: UntypedFormBuilder,private dialog: MatDialog, private modalService: NgbModal, private _location: Location,private cdr: ChangeDetectorRef) { }

  getparamid:any;
  getuserid:any
  getid:any;
  totalLength:any;
  page:number=1;
  showScreen = false;

  readData:any = [];
  readData2:any = [];
  deletedUserData:any = [];

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
    this.getAllData();
this.getDeletedUserData();
    this.getAllflatData();
    this.updateColumnLists();

    this.form = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      email: [null, [Validators.required, Validators.pattern("^[A-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      isOwner: [false],
      role:[false],
      
     
    });

   
    
    this.form2 = this.fb.group({
      firstName: [null, [Validators.required, Validators.minLength(2)]],
      lastName: [null, [Validators.required, Validators.minLength(2)]],
      mobileNumber: [null, [Validators.required]],
      rentalUnitId: [null,[Validators.required, Validators.minLength(2)]]
     
    });
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

  onRoleChange(): void {
    if (this.form.value.role === false) {
      this.form.get('role')?.setValue("OWNER"); 
    }
    else{
      this.form.get('role')?.setValue("RESIDENT"); 

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



 
  getAllData(){

    this.service.getUserlist().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data
      .filter((user: any) => !user.disabled)  // Only include non-disabled users
      .sort((a: any, b: any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      this.updateFilteredData(); // Update filtered data initially
      this.totalLength = (res.data).length;
      console.log(this.readData);
      console.log(this.totalLength);
      
    });

  }


  getDeletedUserData(){

    this.service.getUserlist().subscribe((res)=>{
      console.log(res,"res==>");
      this.deletedUserData = res.data
      .filter((user: any) => user.disabled)  // Only include non-disabled users
      .sort((a: any, b: any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      this.deletedUserData.sort((a:any, b:any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      this.updateFilteredData(); // Update filtered data initially
     
      
    });

  }
  // exportData(): void {
  //   const visibleColumns = this.columns.filter(col => col.visible && col.name !== 'Actions').map(col => col.name);
  //   const dataToExport = this.filteredData.map(entry => {
  //     const exportEntry: any = {};
  //     visibleColumns.forEach(column => {
  //       exportEntry[column] = entry[this.mapColumnToKey(column)];
  //     });
  //     return exportEntry;
  //   });

  //   const csvContent = this.convertToCSV(dataToExport);
  //   this.downloadCSV(csvContent, 'user_log.csv');
  // }
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
    this.updateSelectedIds(); // Update selectedIds based on filteredData
  }

  updateSelectedIds() {
    this.selectedIds = this.selectedIds.filter(id => this.filteredData.some(us => us.userId === id));
  }

  onSelect(event: any, id: String) {
    if (event.target.checked) {
      if (!this.selectedIds.includes(id)) {
        this.selectedIds.push(id);
      }
    } else {
      this.selectedIds = this.selectedIds.filter((selectedId) => selectedId !== id);
    }
  }

  selectAll(event: any) {
    if (event.target.checked) {
      this.selectedIds = this.filteredData.map((us) => us.userId);
    } else {
      this.selectedIds = [];
    }
  }

  isSelectAllChecked(): boolean {
    return this.filteredData.every((us) => this.selectedIds.includes(us.userId));
  }


  // onSelect(event: any, id: String) {
  //   if (event.target.checked) {
  //     this.selectedIds.push(id);
  //   } else {
  //     this.selectedIds = this.selectedIds.filter((selectedId) => selectedId !== id);
  //   }
  // }

  // selectAll(event: any) {
  //   if (event.target.checked) {
  //     this.selectedIds = this.readData.map((us: { userId: any; }) => us.userId);
  //   } else {
  //     this.selectedIds = [];
  //   }
  // }

  RemovedUser(){
    this.router.navigate(['/supervisor/removed-user']);
  }
  
  getAllflatData(){
    this.service.getFlat().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData2 = res.data;
      this.readData2.sort((a:any, b:any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
     // this.totalLength = (res.data).length;
    });
  }
  
  onCancelClick(){
    this.getparamid = "";
    this.getuserid = "";
    this.form.reset();
    this.form2.reset();
    this.selectedIds= [];

    // this.firebase = null;
    // this.Percentage = undefined ;
   
  }
  onImageError(event: any) {
    event.target.src = 'assets/logo.jpg';
  }
  
  back(){
    this._location.back();
  }
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
  }
  open2(content2: any) {
    this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult2 = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason2(reason)}`;

    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
     // //location.reload();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
     // //location.reload();
      return 'by clicking on a backdrop';
    } else {
     // //location.reload();
      return `with: ${reason}`;
    }

  }
  private getDismissReason2(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      // location.reload();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      // location.reload();
      return 'by clicking on a backdrop';
    } else {
      // location.reload();
      return `with reason: ${reason}`;
    }
  }
  

  saveDetails(form:any) {
    console.log(this.form2.value);
    const result = window.confirm('Are you sure you want to add the Resident in your Society?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
    
       this.service.addResident(this.form2.value).subscribe((res)=>{
         console.log(res,'res==>');
         console.log('done')
         this.loading = false;
        
         this.getAllData();
         this.onCancelClick();

       },(error) => {
        this.loading = false;
        alert(error.error.message);
        console.error('Error:', error);
        // You can show an error message to the user if needed
      });
      }else {
        this.form.reset();
        this.loading = false;
        this.onCancelClick();

        console.log('Delete canceled');
      }
      }

      bulkEditforOwner() {
       // console.log(this.form2.value);
        const result = window.confirm('Are you sure you want to Change type of selected residents?');
        if (result) {
          this.loading = true;
          console.log('confirmed');
        
           this.service.updateResidentType(
            {
              "userIds":this.selectedIds,
              "isOwner":true
            }
          ).subscribe((res)=>{
             console.log(res,'res==>');
             console.log(this.selectedIds);
             alert( 'User Type Changed Successfully...');
             this.loading = false;
             this.getAllData();
             this.onCancelClick();
    
           },(error) => {
            alert(error.error.message);
            this.loading = false;
            console.error('Error:', error);
            // You can show an error message to the user if needed
          });
          }else {
            this.form.reset();
            this.onCancelClick();
            this.loading = false;
    
            console.log('Delete canceled');
          }
          }
    
          bulkEditforTenant() {
            // console.log(this.form2.value);
             const result = window.confirm('Are you sure you want to Change type of selected Resident?');
             if (result) {
               console.log('confirmed');
             
                this.service.updateResidentType(
                 {
                   "userIds":this.selectedIds,
                   "isOwner":false
                 }
               ).subscribe((res)=>{
                  console.log(res,'res==>');
                  console.log(this.selectedIds);
                  alert( 'User Type Changed Successfully...');
                  this.getAllData();
                  this.onCancelClick();
         
                },(error) => {
                 alert(error.error.message);
                 console.error('Error:', error);
                 // You can show an error message to the user if needed
               });
               }else {
                 this.form.reset();
                 this.onCancelClick();
         
                 console.log('Delete canceled');
               }
               }
         
     
  
 UpdateButton(us:any){
  this.getparamid = us.userRoleId  ;
  console.log(this.getparamid);
  console.log(us.rentalUnitStatus);

  const result = window.confirm('Are you sure you want to approve?');
    if (result) {
      console.log('confirmed');
   if((us.rentalUnitStatus) === 'PENDING')
   
   {
    console.log(this.map[us.rentalUnitStatus]);
    this.service.pendingApproval({userRoleId:this.getparamid}).subscribe((res)=>{
      // alert( 'User Approved Successfully...');
      // confirm()

      console.log('confirmed');
      console.log(us.rentalUnitStatus);
      (us.rentalUnitStatus); 
   this.getAllData();
   this.onCancelClick();

  });
    } else {
      alert( 'User already Approved...');
      this.onCancelClick();

      console.log('Delete canceled');
    }
  
   

}
else
{
  console.log(this.map[us.rentalUnitStatus]);
}
 }

 inactiveResident(us:any){
  this.getuserid = us.userId  ;
  console.log(this.getuserid);

  const result = window.confirm('Are you sure you want to remove this Resident?');
    if (result) {
      console.log('confirmed');
   if((us.disabled) === false)
   
   {
    console.log(us.disabled);
    this.service.inactiveUser({userId:this.getuserid}).subscribe((res)=>{
       alert( 'User Removed Successfully...');
      // confirm()

      console.log('confirmed');
      console.log(us.disabled);
   this.getAllData();
   this.onCancelClick();
  });
    } else {
      alert( 'User already Removed...');

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
      if (this.form.value.role === false) {
        this.form.get('role')?.setValue("OWNER"); 
      }
      else{
        this.form.get('role')?.setValue("RESIDENT"); 
      
      }
      this.getparamid = us.userId;
      console.log(this.getparamid);
      this.form.controls['firstName'].setValue(us.firstName);
      this.form.controls['lastName'].setValue(us.lastName);
      this.form.controls['email'].setValue(us.email);
      this.form.controls['isOwner'].setValue(us.isOwner);
console.log(this.form.value.role);
     }
     userUpdate(){
       console.log(this.getparamid);
       console.log(this.form.value,'updated');
console.log(this.form.value.isOwner  );
if (this.form.value.role === false) {
  this.form.get('role')?.setValue("OWNER"); 
}
else{
  this.form.get('role')?.setValue("RESIDENT"); 

}
console.log(this.form.value.role);
const result = window.confirm('Are you sure you want to change UserDetail?');
if (result) {
  console.log('confirmed');
         this.service.updateResidentDetail({
          userId:this.getparamid,
          firstName:this.form.value.firstName,
          lastName:this.form.value.lastName,
          email:this.form.value.email,
          isOwner:this.form.value.isOwner,
          role:this.form.value.role


                      } ).subscribe((res)=>{
           alert( 'Updated Successfully...');
console.log(this.form.value);
          // this.form.reset();
           this.getAllData(); 
           this.onCancelClick();
         //  //location.reload();
         },(error) => {
          alert(error.error.message);
          console.error('Error:', error);
          // You can show an error message to the user if needed
        });
        }else {
          this.onCancelClick();
          this.form.reset();
          console.log('Delete canceled');
        }
     }
  

}