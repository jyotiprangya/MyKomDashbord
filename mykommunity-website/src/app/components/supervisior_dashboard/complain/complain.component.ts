import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import Pusher from 'pusher-js';
import {HttpClient} from "@angular/common/http";
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { transform } from 'typescript';
import { ActivatedRoute, Router } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';



@Component({
  selector: 'app-complain',
  templateUrl: './complain.component.html', 
  styleUrls: ['./complain.component.css']
})
export class ComplainComponent implements OnInit {


  first_name = '';
  comment = '';
  closeResult: any;
  getparamid:any;
  getid:any;
  searchComplaint:any = "";
  sortDirection: { [key: string]: boolean } = {};
  showFullDescription: { [key: string]: boolean } = {};

  isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;
  filteredData: any[] = [];

  id:any

  form:any= UntypedFormGroup;
  loading = false;

  role=sessionStorage.getItem('role');

  constructor(private service:ApiService,
               private modalService: NgbModal,
               private fb: UntypedFormBuilder,
               private _location: Location,
               private http: HttpClient,
               private route: ActivatedRoute,
               private router: Router,
               private cdr: ChangeDetectorRef,
               private dialog: MatDialog, ) { }

 
  totalLength:any;
  page:number=1;
 
  readData:any = [];
  readData2:any = [];

  ticketNumber:any;
  complainid:any;
  showImage = false;

  columns = [
    { name: 'ticket', visible: true },
    { name: 'complaintCategory', visible: true },
    { name: 'complaintType', visible: true },
    { name: 'house', visible: true },
    { name: 'createdBy', visible: true },
    { name: 'message', visible: true },
    { name: 'createdOn', visible: true },
    { name: 'lastUpdatedOn', visible: true },
    { name: 'attachment', visible: true },
    { name: 'status', visible: true },
    { name: 'viewDetails', visible: true },
  ];



 
  map: any ={
    0: "Not Resolved",
    1: "Resolved"
  }
  
  getStatusColor(status: string): string {
    switch (status) {
      case 'RESOLVED':
        return 'green';
      case 'IN_PROGRESS':
        return 'darkcyan';
      case 'ON_HOLD':
        return 'rgba(59, 59, 214, 0.684)';
      case 'RE_OPENED':
        return 'rgb(210, 56, 82)';
        case 'NEW':
        return 'rgb(190, 31, 31)';
      default:
        return '';
    }
  }
  
  getStatusIcon(status: string): string {
    switch (status) {
      case 'RESOLVED':
        return 'check_circle';
      case 'IN_PROGRESS':
        return 'schedule';
      case 'ON_HOLD':
        return 'warning';
      case 'RE_OPENED':
        return 'menu_book';
        case 'NEW':
        return 'error_outline';
      default:
        return '';
    }
  }


  ngOnInit(): void {
    this.getAllData();
    this.updateColumnLists();
    this.form = this.fb.group({
      status: [null, [Validators.required]],

    });

    
  }


  
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

  toggleDescription(id: string) {
    this.showFullDescription[id] = !this.showFullDescription[id];
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
          // Pass both column and entry to mapColumnToKey
          exportEntry[column] = this.mapColumnToKey(column, entry);
      });
        
        // Log the constructed export entry
        console.log('Export Entry:', exportEntry);
        return exportEntry;
    });

    // Convert data to CSV format
    const csvContent = this.convertToCSV(dataToExport);
    console.log('CSV Content:', csvContent); // Log to see what the CSV content looks like

    // Download the CSV file
    this.downloadCSV(csvContent, 'complaint_log.csv');
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
private mapColumnToKey(columnName: string, entry: any): any {
  switch (columnName) {
    case 'ticket': 
      return entry.complaintId ? entry.complaintId.slice(-4) : '';
    case 'complaintCategory': 
      return entry.category;
    case 'complaintType': 
      return entry.type;
    case 'house': 
      return entry.rentalUnit ? `${entry.rentalUnit.blockName} - ${entry.rentalUnit.rentalUnitName}` : '';
    case 'createdBy': 
      return entry.userFirstName;
    case 'message': 
      return entry.message;
    case 'createdOn': 
      return entry.complaintCreatedAt;
    case 'lastUpdatedOn': 
      return entry.complaintupdatedAt;
    case 'attachment': 
      return entry.image;
    case 'status': 
      return entry.status;
    case 'viewDetails': 
      return entry.complaintId;
    default: 
      return '';
  }
}

sortData(column: string): void {
  this.sortDirection[column] = !this.sortDirection[column]; // Toggle the sort direction for the column
  this.readData.sort((a: any, b: any) => {
    const direction = this.sortDirection[column] ? 1 : -1;
    return a[column] > b[column] ? direction : -direction;
  });
}
  back(){
    this._location.back();
  }

   
  getAllData(){
    this.service.getComplaint().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
      this.readData.sort((a:any, b:any) => {
        return new Date(b.complaintupdatedAt).getTime() - new Date(a.complaintupdatedAt).getTime();
      });
      this.totalLength = (res.data).length;
     
    });
  }

  saveDetails(form:any) {
 console.log(this.getid);
 const result = window.confirm('Are you sure you want to change the status?');
    if (result) {
      this.loading = true;
      console.log('confirmed');
    if(this.form.valid)
    {
      console.log(this.form.value);
      this.service.changecomplaintsts({
        status:this.form.value.status,
        "complaintId": this.getid
    }).subscribe((res)=>{
       // alert( 'Updated Successfully...');
       this.loading = false;
        this.form.reset();
        this.getAllData();
      },(error) => {
        this.loading = false;
        alert(error.error.message);
        console.error('Error:', error);
        // You can show an error message to the user if needed
      });
    }
  }else {
    this.loading = false;
    this.form.reset();
    console.log('Delete canceled');
  }
  }
  UpdateButton(us:any){
    console.log(us.complaintId);
 this.getid = us.complaintId;
console.log(this.getid);
  }
  
  
  
  // viewDetails(id: any): void {
  //   this.router.navigate(['complainDetails', id], { relativeTo: this.route });
  // }


  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
}

  
private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    //location.reload();
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //location.reload();
    return 'by clicking on a backdrop';
  } else {
    //location.reload();
    return `with: ${reason}`;
  }

}
handleInput(event: any) {
  this.comment = event.target.value;
}
// details(us:any){
 
//  this.getparamid = us.complaintId;

//  console.log(this.getparamid);
//  console.log(this.readData);
//     for (const uss of this.readData){
//       if (uss['complaintId'] === this.getparamid) {
//         this.readData2.push(uss);
//         console.log(this.readData2);

//       }
//     }
//     return this.readData2;

// }

  submit() {
    this.service.createComplaintcomment(
      {
        complaintId: this.getparamid,
        comment: this.comment
      }
    ).subscribe((res)=>{
      // console.log(res,'res==>');
    // this.http.post(`http://3.111.99.46:3000/api/v1/complaint/comment`, {
    //   complaintId: this.getparamid,
    //   comment: this.comment
    // }).subscribe((res) =>{
      console.log(res,'res=>');
      this.comment = ''
      console.log(this.comment);

    });
    
   
  }
  

  //  commentControler($scope:any) { 
  //   console.log(this,this.getparamid); 
  //   $scope.commentArray = [];  //Main Object hare I'm adding all Comment informations
  //   $scope.addComment = function () {  // Comment Button click Event
  //       if($scope.CommentText!=null)  
  //       {  
  //           // $scope.commentArray.push($scope.CommentText);  
  //           // $scope.CommentText = "";  

            
  //   this.http.post(`http://3.111.99.46:3000/api/v1/complaint/comment`, {
  //     complaintId: this.getparamid,
  //     comment: $scope.CommentText
  //   }).subscribe(() => this.comment = '');
  //       }  
  //   }  
   

//}  
 
}