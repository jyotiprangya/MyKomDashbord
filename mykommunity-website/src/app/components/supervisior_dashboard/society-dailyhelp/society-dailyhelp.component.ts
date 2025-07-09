import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from "rxjs/operators";
import { Observable } from "rxjs";
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-society-dailyhelp',
  templateUrl: './society-dailyhelp.component.html',
  styleUrls: ['./society-dailyhelp.component.css']
})
export class SocietyDailyhelpComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;
  role=sessionStorage.getItem('role');

  map: any ={
    false: "Out",
    true: "Inside"
  }
  downloadURL: Observable<string> | undefined;
  Percentage:Observable<any> | undefined ;
  snapshot!: Observable<any>;

  constructor(
    
    private service:ApiService,
    private fb: UntypedFormBuilder, 
    private modalService: NgbModal, 
    private _location: Location,
     private router: Router,
     private af:AngularFireStorage,
     private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
  
    ) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  deletedData:any = [];

  readData2:any = [];
  readData3:any = [];
  getparamid:any;
  getStaffid:any;

  societyId:any;
  firebase :any = null;
  path!: string;
  read:any;
  getidimg:String | undefined;
  searchDailyhelp:any = "";
  sortDirection: { [key: string]: boolean } = {};
  isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;
  filteredData: any[] = [];



  ngOnInit(): void {
    this.getAllData();
    this.getDeletedStaffData();
    this.updateColumnLists();

    this.form = this.fb.group({
      name: [null, [Validators.required]],
      dailyHelpProviderCode: [null, [Validators.required, Validators.minLength(6)]],
      mobileNumber: [null],
      dailyHelpCategory: [null, [Validators.required]],
      image:[null]
    });
  }
  columns = [
    { name: 'Profile', visible: true },
    { name: 'Name', visible: true },
    { name: 'Contact Number', visible: true },
    { name: 'Service', visible: true },
    { name: 'Passcode', visible: true },
    { name: 'In/Out Status', visible: true },
    { name: 'lastUpdatedOn', visible: true },
    { name: 'Edit', visible: true },
  ];

 
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }
   
 
  cancelChanges() {
    this.hiddenColumns.forEach(column => column.selected = false);
    this.displayedColumns.forEach(column => column.selected = false);
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
         if (column === 'In/Out Status') {
          exportEntry[column] = entry[key] ? "Inside" : "Out";
        } else {
          exportEntry[column] = entry[key]; 
        }
               
                console.log(`Mapping column "${column}" to key "${key}" with value: ${entry[key]}`);
                exportEntry[column] = entry[key];
            
        });
        
        console.log('Export Entry:', exportEntry);
        return exportEntry;
    });

    const csvContent = this.convertToCSV(dataToExport);
    console.log('CSV Content:', csvContent); 

    this.downloadCSV(csvContent, 'societystaff_log.csv');
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
    case 'Profile': return 'profile';
    case 'Name': return 'name';
    case 'Contact Number': return 'mobileNumber';
    case 'Service': return 'dailyHelpCategory';
    case 'Passcode': return 'dailyHelpProviderCode';
    case 'In/Out Status': return 'isInside';
    case 'lastUpdatedOn': return 'updatedAt';
    case 'Edit': return 'edit'; 
    default: return '';
  }
}

   
  // Component file
getAllData() {
  this.service.getSocietydailyHelpProvider().subscribe((res) => {
    console.log(res, "res==>");
    // Sort by updatedAt in descending order (most recent first)
    this.readData = res.data.sort((a: { updatedAt: string | number | Date; }, b: { updatedAt: string | number | Date; }) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    this.totalLength = res.data.length;
  });
}

  getDeletedStaffData(){
    this.service.getRemovedSocietydailyHelpProvider().subscribe((res)=>{
      console.log(res,"res==>");
      this.deletedData = res.data;
    });
  }
  
  back(){
    this._location.back();
  }

  onCancelClick(){
    this.getparamid = "";
    this.form.reset();
    this.firebase = null;
    this.Percentage = undefined ;
   
  }
  SelectedImage:any;
  media:any;

  upload(event:any){

   
    var file = event.target.files[0];
   
    var n = Date.now();
   // const file = event.target.files[i];
   //const filePathinlocal = ${this.basePath}/${file.name};  
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
    this.Percentage = task.percentageChanges();

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
            console.log(this.Percentage);

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
   onCancel(){
    this.firebase = null;
    console.log(this.firebase);
  }
 
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.form.reset();

    });
  }

  closeclick(){
  // location.reload();

  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
   //location.reload();

      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {

      return 'by clicking on a backdrop';
    } else {
     //location.reload();

      return `with: ${reason}`;
    }

  } 
    // }

    RemovedStaffList(){
      this.router.navigate(['/supervisor/removed-society-staff']);
    }
  
  removeStaff(us:any){
    this.getStaffid = us.id  ;
    console.log(this.getStaffid);
 // console.log(us.disabled);
    const result = window.confirm('Are you sure you want to remove this staff?');
      if (result) {
        console.log('confirmed');
     
      console.log(us.disabled);
      this.service.removeSocietyDailyHelpProvider({id:this.getStaffid}).subscribe((res)=>{
         alert( 'Staff Removed Successfully...');
        // confirm()
  
        console.log('confirmed');
       // console.log(us.disabled);
     this.getAllData();
     this.getDeletedStaffData();
     this.onCancelClick();
    });
   } else
  {
    this.onCancelClick();
   // console.log(us.disabled);
  }

   }

   
  
  saveDetails(form:any) {
    const result = window.confirm('Are you sure you want to add this Service Provider for Your society?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
  {
    this.societyId= sessionStorage.getItem('societyId');

    console.log(this.form.value);
    this.service.createSocietyDailyHelpProvider(
      {
        name:this.form.value.name,
        dailyHelpCategory:this.form.value.dailyHelpCategory,
        mobileNumber:this.form.value.mobileNumber,
        dailyHelpProviderCode:this.form.value.dailyHelpProviderCode,
        societyId:this.societyId,
        image:this.firebase
      }
        ).subscribe((res)=>{
      console.log(res,'res==>');
      this.form.reset();
      this.getAllData();
      this.loading = false;
      this.onCancelClick();

    },(error) => {
      this.loading = false;
      alert(error.error.message);
      console.error('Error:', error);
      
      // You can show an error message to the user if needed
    });
   }
  }else {
    //location.reload();
    this.onCancelClick();
    this.loading = false;

    console.log('Delete canceled');
  }
  }
 
  
  OnEdit(us:any,form:any){
     
    this.getparamid = us.id;
    this.firebase = us.image;

    console.log(this.getparamid);
  
    this.form.controls['name'].setValue(us.name);
    this.form.controls['mobileNumber'].setValue(us.mobileNumber);
    this.form.controls['dailyHelpCategory'].setValue(us.dailyHelpCategory);
    this.form.controls['dailyHelpProviderCode'].setValue(us.dailyHelpProviderCode);
    // this.form.controls['image'].setValue(us.image);

   }
   ServiceUpdate(){
     console.log(this.getparamid);
     const result = window.confirm('Are you sure you want to change this Service Provider Details?');
     if (result) {
      this.loading = true;
       console.log('confirmed');
      this.service.updateSocietyDailyHelpProvider(
        {
          dailyHelpProviderId:this.getparamid,
          name:this.form.value.name,
          image:this.firebase,
          dailyHelpCategory:this.form.value.dailyHelpCategory,
          mobileNumber:this.form.value.mobileNumber
        } 
        ).subscribe((res)=>{
        alert( 'Updated Successfully...');
           this.getAllData();
           this.loading = false;
           this.form.reset();
           this.onCancelClick();

           //location.reload();
           console.log(this.form.value,'updated');

       },(error) => {
        this.loading = false;
        alert(error.error.message);
        console.error('Error:', error);
        // You can show an error message to the user if needed
      });
      }else {
        //location.reload();
        this.onCancelClick();
        this.loading = false;

        console.log('Delete canceled');
      }
     
   }

  
  }