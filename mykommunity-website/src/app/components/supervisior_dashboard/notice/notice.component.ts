import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { Location } from '@angular/common';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { catchError, finalize, map, switchMap } from "rxjs/operators";
import { forkJoin, Observable, of } from "rxjs";
import { FileExtensionPipe } from 'src/app/file-extension.pipe';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';



@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.css']
})
export class NoticeComponent implements OnInit {


  closeResult: any;
  form:any= UntypedFormGroup;
  loading = false;

  downloadURL: Observable<string> | undefined;
  Percentage:Observable<any> | undefined ;
  showFullDescription: { [key: string]: boolean } = {};
  role=sessionStorage.getItem('role');


  constructor(
    private service:ApiService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal, 
    private _location: Location, 
    private af:AngularFireStorage,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
                                  ) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  readData3:any = [];
  getparamid:String | undefined;
  getidimg:String | undefined;

  societyId:any;
  firebase :any = null;
  path!: string;
  read:any;
  sortDirection: { [key: string]: boolean } = {};
  isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;
  filteredData: any[] = [];
  private fileTypeCache = new Map<string, string>();


  ngOnInit(): void {
    this.getAllData();
    this.updateColumnLists();
    this.form = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]],
      image:[null]
    });
   
    
  }
  columns = [
    { name: 'title', visible: true },
    { name: 'message', visible: true },
    { name: 'createdOn', visible: true }, 
    { name: 'lastUpdatedOn', visible: true }, 
    { name: 'attachment', visible: true },
    { name: 'Edit', visible: true }, 
    { name: 'Delete', visible: true } 
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
 
  
  private mapColumnToKey(columnName: string): string {
    switch (columnName) {
        case 'title': return 'title'; 
        case 'message': return 'description';
        case 'createdOn': return 'createdAt';
        case 'lastUpdatedOn': return 'updatedAt';
        case 'attachment': return 'fileType';
        case 'Edit': return 'edit';
        case 'Delete': return 'delete'; 
        default: return '';
    }
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
    
    // Log the visible columns
    console.log('Visible Columns:', visibleColumns);

    // Mappings for the specific fields
   
    const dataToExport = this.readData.map((entry: { [x: string]: any; }) => {
        const exportEntry: any = {};
        
        visibleColumns.forEach(column => {
            // Check for special fields that need mapping
            
                const key = this.mapColumnToKey(column);
                // Log the mapping process for debugging
                console.log(`Mapping column "${column}" to key "${key}" with value: ${entry[key]}`);
                exportEntry[column] = entry[key]; // Ensure entry[key] is valid
            
        });
        
        // Log the constructed export entry
        console.log('Export Entry:', exportEntry);
        return exportEntry;
    });

    // Convert data to CSV format
    const csvContent = this.convertToCSV(dataToExport);
    console.log('CSV Content:', csvContent); // Log to see what the CSV content looks like

    // Download the CSV file
    this.downloadCSV(csvContent, 'notice_log.csv');
    console.log('CSV downloaded');
}

private convertToCSV(data: any[]): string {
    if (data.length === 0) {
        return '';
    }

    // Create the CSV header
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
 

  toggleDescription(id: string) {
    this.showFullDescription[id] = !this.showFullDescription[id];
  }
   
  getAllData() {
    this.service.getNotice().subscribe((res) => {
      console.log(res, "res==>");
      this.readData = res.data;
      this.readData.sort((a: any, b: any) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      this.totalLength = this.readData.length;

      // Get MIME type for each item
      this.readData.forEach((item: { image: string; }) => {
        if (item.image) {
          this.getFileTypeofNotice(item.image, item);
        }
      });
    });
  }

  // Get the MIME type of a file stored in Firebase Storage
  getFileTypeofNotice(fileUrl: string, item: any): void {
    const fileRef = this.af.refFromURL(fileUrl);
    fileRef.getMetadata().subscribe(metadata => {
      item.mimeType = metadata.contentType || 'Unknown File Type';
      item.fileType = this.mapMimeTypeToLabel(item.mimeType);
      console.log('File type:', item.fileType);
    });
  }

  // Map MIME type to a human-readable label
  mapMimeTypeToLabel(mimeType: string): string {
    switch (mimeType) {
      case 'application/pdf':
        return 'PDF Document';
      case 'image/jpeg':
      case 'image/png':
        return 'Image File';
      case 'application/msword':
        return 'Word Document';
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        return 'Word Document';
      default:
        return 'Unknown File Type';
    }
  }
    
  back(){
    this._location.back();
  }
    
  open(content: any) {
    
     this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
       this.closeResult = `Closed with: ${result}`;

     }, (reason) => {
       this.closeResult = `Dismissed ${this.getDismiss(reason)}`;

     });
    
     
   }
 
   private getDismiss(reason: any): string {
     if (reason === ModalDismissReasons.ESC) {
    //  //location.reload();

       return 'by pressing ESC';
     } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
     // //location.reload();

       return 'by clicking on a backdrop';
     } else {
    //  //location.reload();

       return `with: ${reason}`;
     }

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
     const filePath = `notice/${n}`;
     const fileRef = this.af.ref(filePath);
     const task = this.af.upload(`notice/${n}`, file);
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
  
    onCancelClick(){
      this.getparamid = "";
      this.form.reset();
      this.firebase = null;
      this.Percentage = undefined ;
     
    }

  
   saveDetails(form:any) {
    
    const result = window.confirm('Are you sure you want to add this Notice?');
    if (result) {
      this.loading = true;

      console.log('confirmed');
       this.service.createNotice(
        {
        title:this.form.value.title,
        description:this.form.value.description,
        image:this.firebase
      }
      ).subscribe((res)=>{
         console.log(res,'res==>');
         console.log('done')
        
         this.getAllData();
         this.onCancelClick();
         this.loading = false;

       },(error) => {
        this.loading = false;

        alert(error.error.message);
        console.error('Error:', error);

        // You can show an error message to the user if needed
      });
      }else {
        this.loading = false;

        this.onCancelClick();
        console.log('Delete canceled');
      }
      }


  
    

    deleteID(us:any)
{
  const result = window.confirm('Are you sure you want to Delete this Notice?');
  if (result) {
    console.log('confirmed');
  this.service.deleteNotice({ noticeId: us}).subscribe((res)=>{
    console.log(res,'deleteres==>');
    alert("Record Deleted Successfully...");
      this.getAllData();
      this.onCancelClick();
 
  },(error) => {
    alert(error.error.message);
    console.error('Error:', error);
    // You can show an error message to the user if needed
  });
   }else {
    this.onCancelClick();
    console.log('Delete canceled');
  }
} 
onCancel(){
  this.firebase = null;
  console.log(this.firebase);
}
getFileType(url: string): Promise<string> {
  return this.http.get(url, { responseType: 'blob' }).toPromise().then(blob => {
    return blob!.type; // Returns the MIME type of the file
  });
}

async isImage2(url: string): Promise<boolean> {
  const fileType = await this.getFileType(url);
  return fileType.startsWith('image/');
}

OnEdit(us:any,form:any){
   
  this.getparamid = us.id;
  this.firebase = us.image;

  console.log(this.getparamid);

  this.form.controls['title'].setValue(us.title);
  this.form.controls['description'].setValue(us.description);
 this.form.controls['image'].setValue(us.image);


 }
 NoticeUpdate(){
   console.log(this.getparamid);
  // console.log(this.form.value,'updated');
   
  const result = window.confirm('Are you sure you want to change in this Notice?');
  if (result) {
    this.loading = true;

    console.log('confirmed');
     this.service.updateNotice(
      {
      noticeId:this.getparamid,
      title:this.form.value.title,
      description:this.form.value.description,
      image:this.firebase
    } 
      ).subscribe((res)=>{
        console.log(this.form.value);

       alert( 'Updated Successfully...');
       
         this.getAllData();
         this.onCancelClick();
         this.loading = false;

        //  //location.reload();

     },(error) => {
      alert(error.error.message);
      console.error('Error:', error);
      this.loading = false;

      // You can show an error message to the user if needed
    });
    }else {
      this.onCancelClick(); 
    console.log('Delete canceled');
    }
 }



}