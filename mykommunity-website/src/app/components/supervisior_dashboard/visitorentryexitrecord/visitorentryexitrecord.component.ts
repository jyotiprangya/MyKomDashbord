import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, Location } from '@angular/common';
import { VisitorDetailsPopupComponent } from '../visitor-details-popup/visitor-details-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';

@Component({
  selector: 'app-visitorentryexitrecord',
  templateUrl: './visitorentryexitrecord.component.html',
  styleUrls: ['./visitorentryexitrecord.component.css']
})
export class VisitorentryexitrecordComponent implements OnInit {

  closeResult: any;
  form:any= UntypedFormGroup;
  constructor(private service:ApiService,private cdr: ChangeDetectorRef,private datePipe: DatePipe,
    private fb: UntypedFormBuilder, 
    private modalService: NgbModal,
     private _location: Location,
     private dialog: MatDialog,) { }
  us: any; 
  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  getparamid:any;
  showImage = false;
  showparcelImage = false;
  searchActivity:any = "";
  searchTerm:any = "";
  sortDirection: { [key: string]: boolean } = {};
  isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;
  filteredData: any[] = [];

  societyId=sessionStorage.getItem('societyId');
  map: any ={
    true: "Inactive",
    false: "Active"
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'PRE_APPROVED':
        return 'green';
      case 'ALLOWED_ENTRY':
        return 'rgb(195, 135, 23)';
      case 'EXITED':
        return 'darkcyan';
      case 'RECEIVED_AT_GATE':
        return 'rgb(213, 77, 100)';
        case 'APPROVED':
          return 'green';
        case 'PENDING_APPROVAL':
          return 'rgb(105, 135, 23)';
        case 'COLLECTED':
          return 'blue';
        case 'DENIED':
          return 'red';
      default:
        return '';
    }
  }
  getStatusIcon(status: string): string {
    switch (status) {
      case 'PRE_APPROVED':
        return 'verified';
      case 'ALLOWED_ENTRY':
        return 'login';
      case 'EXITED':
        return 'logout';
      case 'RECEIVED_AT_GATE':
        return 'shopping_cart';
        case 'APPROVED':
        return 'check_circle';
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

  getCompanyImage(vendorName:String) {
    switch (vendorName.toString().toLowerCase().trim()) {
      case 'uber':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A27%3A42.884011?alt=media&token=d7f23b8a-1a35-46fc-9eb2-5488d6c443a7";
      case 'cab':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A04%3A52.731561?alt=media&token=9b95e959-5717-4a1f-a3f6-83918e0c015d";
      case 'ola':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2013%3A58%3A17.824692?alt=media&token=070b141a-ff07-4056-875c-2d2b257d13be";
      case 'meru':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A31%3A57.002017?alt=media&token=6f2d6e97-46d1-4ece-8716-6badea719a5a";
      case 'zoomcar':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A33%3A38.501165?alt=media&token=a6af98b5-27f0-4eae-9191-549c50d52816";
      case 'rapido':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A35%3A25.898231?alt=media&token=0a764901-6c81-48fa-ac8f-b82ef1ca623c";
      case 'dtdc':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A37%3A09.564215?alt=media&token=97f64fe3-fbba-4b31-b781-2186dae81838";
      case 'meesho':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A38%3A38.866630?alt=media&token=10c21bf4-4db7-4c13-8b49-d16b4a20255e";
      case 'flipkart':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2013%3A35%3A03.900843?alt=media&token=e6701133-7096-4509-91c3-9d5e46001947";
      case 'amazon':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2016%3A49%3A53.876555?alt=media&token=b647d315-71df-4d7d-ae23-6955aa67dd82";
      case 'myntra':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A41%3A20.472562?alt=media&token=15cf3916-c993-40e7-820e-35fd20ed752a";
      case 'shopsy':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A42%3A50.488638?alt=media&token=56bb2707-1c35-4857-afa9-770e47b51ca7";
      case 'myglamm':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A44%3A25.208776?alt=media&token=3d3f9dce-4f00-4135-bf31-df3429434ae4";
      case 'shopclues':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A46%3A01.875785?alt=media&token=36d179b9-560b-457d-949b-12cdd7da5e8e";
      case 'limeroad':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A47%3A35.553617?alt=media&token=60343337-f977-4006-ab86-ffc3a1518eed";
      case 'ajio':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A49%3A10.934708?alt=media&token=bcdb911f-f759-498a-a784-015d1b33b6a7";
      case 'nykaa':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A50%3A31.467179?alt=media&token=9b2045a7-e8d6-45fe-af64-3d9a8765703c";
      case 'lenskart':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A53%3A47.200220?alt=media&token=66d7319b-e357-49ac-8547-01684350e196";
      case 'delivery':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A51%3A58.097725?alt=media&token=bad600b3-179b-4dae-bd73-add0ddf8fae9";
      case 'purplle':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A55%3A33.590466?alt=media&token=53693a31-1996-438a-9def-7a97e42b37cd";
      case 'big basket':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A57%3A10.396272?alt=media&token=0e9265a1-36e3-4204-acb4-9e648ad63ae4";
      case 'swiggy':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A58%3A27.085955?alt=media&token=b869170a-d251-4fa9-9ea5-0b432340fe30";
      case 'zomato':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2014%3A59%3A23.734105?alt=media&token=7811e7f2-3ac7-4139-9cd2-b05de1846df3";
           case 'blue dart':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A00%3A33.511471?alt=media&token=d298a3ee-6184-4502-8534-88e1e6989081";
      case 'medplus':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A02%3A16.852713?alt=media&token=a1ce79e0-09d3-4840-91b8-06d4f33f375e";
      case 'tata1mg':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A03%3A25.509573?alt=media&token=f87ae0d4-e093-422d-b636-47667354a692";
      case 'shadowfox':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A04%3A38.045010?alt=media&token=a5b1d75f-9baa-4dff-bf6c-60ead42a5317";
      case 'hp gas':
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A05%3A49.396379?alt=media&token=6bb62db9-4807-41d0-9e8a-577de6fee1bf";
      case "domino's":
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A06%3A57.420441?alt=media&token=e2b34450-5856-412c-9aec-caa251dffb16";
       case "flower aura":
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A08%3A21.719563?alt=media&token=1e4e4f87-23bb-4229-bc15-85fe029e3754";
       case "tirupati courier":
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A09%3A57.088073?alt=media&token=79b8014d-dd23-4005-8524-414e061d12f6";
      case "samsung":
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A17%3A14.322878?alt=media&token=7a4f3e9d-b275-4660-84d0-5599f48f1dc4";
      case "godrej":
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A12%3A08.784607?alt=media&token=44b93ceb-5146-414d-936a-6041bb63d3e1";
       case "kfc":
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A14%3A08.826064?alt=media&token=8449852c-d7e7-49b1-bf9a-75bf9cfbb098";
       case "indane gas":
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A14%3A14.959175?alt=media&token=dcee0f88-7e88-4585-86b2-a10fc28dcc38";
      case "bharat gas":
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A15%3A08.819510?alt=media&token=22a2647a-ee26-4b09-bbb2-669e6f1a8314";
      case "ecom express":
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A16%3A11.924499?alt=media&token=62cd35b3-0c4c-466b-a7c4-d941823e0b10";
      case "havells":
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A17%3A43.421780?alt=media&token=0f81754f-dee7-4bf1-bbb9-f8aa903007e1";
      case "urban company":
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A19%3A08.087847?alt=media&token=b126a5a6-0247-4d39-8841-4a9b29978eb1";
        case 'jio':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A28%3A45.943681?alt=media&token=f7c85b97-fd40-43eb-860f-0e471a1783d9";
        case 'sbi':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A36%3A33.573925?alt=media&token=d783c4bd-5a19-4330-b5fe-d6441548d0a7";
  case 'shadowfox':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A32%3A55.796995?alt=media&token=296743ec-d346-4de2-8035-d9f3540f35a2";
   case 'hdfc':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A38%3A03.907213?alt=media&token=a6a42c2f-31e4-42da-a3e7-8c038712b432";
   case 'bajaj':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A39%3A25.433930?alt=media&token=db5e742d-f5b1-4a5a-b4b9-54d98521dee4";
   case 'aquaguard':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A40%3A54.867552?alt=media&token=aa1bebca-c648-42a9-bb97-50fafd96069f";
    case 'kotak':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A44%3A06.562172?alt=media&token=6513ffc5-970b-4f95-bb07-b3dbbc941699";
   case 'mahindra':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A45%3A12.440361?alt=media&token=2df5b34b-3fde-408b-864d-be3bc5c02734";
   case 'axis':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A47%3A21.388690?alt=media&token=55e8805a-af28-4952-8df4-24efce509fb2";
   case 'honda':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A48%3A45.989826?alt=media&token=90df6786-960a-4e2d-96b2-bb8777cb9c00";
   case 'kent':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A49%3A47.401702?alt=media&token=3eb6f854-3d90-4504-96ef-a517a640809c";
  case 'lg':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A52%3A33.416508?alt=media&token=f1afc0bc-8b4a-44e9-abd9-0906dae11643";
  case 'bank':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A51%3A10.582881?alt=media&token=8a4af9d3-7339-4560-ac56-3acaee22b1a9";
  case 'interior design':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A53%3A39.658681?alt=media&token=05addd5e-8233-4de8-a7ed-b1cf59165a75";
  case 'internet repair':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A54%3A52.136900?alt=media&token=d4ee2032-f769-4052-876b-d1139ec61388";
  case 'carpenter':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A56%3A29.704601?alt=media&token=e274d349-7dc3-4049-9f9e-808e755ed977";
  case 'plumber':
          return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2017%3A58%3A00.119004?alt=media&token=b4a6e8ca-fd51-4bf5-b518-f7f5da680ba8";
      default:
        return "https://firebasestorage.googleapis.com/v0/b/mykommunity-e1f4e.appspot.com/o/visitor_vendor%2F2024-10-28%2015%3A21%3A46.421052?alt=media&token=90483df3-40bc-40cb-a67b-040a34ab4028";
    
      // return "https://png.pngtree.com/png-vector/20190614/ourlarge/pngtree-returningvisitorreturning-visitordigital--business-flat-li-png-image_1480968.jpg";
      // return "https://w7.pngwing.com/pngs/221/409/png-transparent-computer-icons-visitor-management-visitor-pattern-computer-software-id-card-miscellaneous-text-service-thumbnail.png";
    }
  }
  
  
  minEndDate: Date = new Date();
 
  
  ngOnInit(): void {
  this.getAllData();
  this.updateColumnLists();
  this.form = this.fb.group({
    startDate: [null, Validators.required],
    endDate: [{ value: null, disabled: true }, Validators.required], // Initially disabled
  });
  this.form.get('startDate')?.valueChanges.subscribe((startDate: Date) => {
    if (startDate) {
      this.minEndDate = startDate; // Set minEndDate to the selected startDate
      this.form.get('endDate')?.enable(); // Enable endDate field
    } else {
      this.minEndDate = new Date(); // Reset minEndDate if no start date
      this.form.get('endDate')?.disable(); // Disable endDate if no start date
      this.form.get('endDate')?.setValue(null); // Reset endDate value
    }
  });
  
}

dateFilter = (date: Date | null): boolean => {
  return date ? date >= this.minEndDate : true;
};

columns = [
  { name: 'Visitor Image', visible: true },
  { name: 'Type', visible: true },
  { name: 'Housing Unit', visible: true },
  { name: 'Vendor Name', visible: true },
  { name: 'Visitor Name', visible: true },
  { name: 'Vehicle Number', visible: true },
  { name: 'Visitor Mobile No.', visible: true },
  { name: 'Entry Time', visible: true },
  { name: 'Exit Time', visible: true },
  { name: 'Details', visible: true }
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

  const dataToExport = this.readData.map((entry: { [key: string]: any }) => {
      const exportEntry: any = {};
      
      visibleColumns.forEach(column => {
          const key = this.mapColumnToKey(column);

          if (column === 'Housing Unit') {
            // Check if Housing Unit data is an array and join with commas
            if (Array.isArray(entry[key])) {
                exportEntry[column] = entry[key].length > 0 ? entry[key].join(', ') : 'No Units'; // Handle empty arrays
            } else {
                exportEntry[column] = entry[key] || 'No Units'; // Handle empty or missing values
            }
        } else {
            exportEntry[column] = entry[key] !== undefined ? entry[key] : ''; // Handle undefined values for other columns
        }


          console.log(`Mapping column "${column}" to key "${key}" with value: ${entry[key]}`);
      });
      
      console.log('Export Entry:', exportEntry);
      return exportEntry;
  });

  const csvContent = this.convertToCSV(dataToExport);
  console.log('CSV Content:', csvContent);

  this.downloadCSV(csvContent, 'visitorrecord_log.csv');
  console.log('CSV downloaded');
}

private convertToCSV(data: any[]): string {
  if (data.length === 0) {
      return '';
  }
  const header = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).map(value => `"${value}"`).join(',')).join('\n'); // Wrap values in quotes
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
    case 'Visitor Image': return 'visitorImage';
    case 'Type': return 'type'; 
    case 'Housing Unit': return 'rentalUnits'; 
    case 'Vendor Name': return 'vendorName'; 
    case 'Visitor Name': return 'visitorName'; 
    case 'Vehicle Number': return 'vehicleNumber'; 
    case 'Visitor Mobile No.': return 'mobileNumber'; 
    case 'Entry Time': return 'inTime'; 
    case 'Exit Time': return 'outTime'; 
    case 'Details': return 'details'; 
    default: return '';
  }
}

getAllData(){
  
  this.service.getVisitorEntryExitRecord().subscribe((res)=>{
    console.log(res,"res==>");
    this.readData = res.data;
    this.readData.sort((a:any, b:any) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    this.totalLength = (res.data).length;
  });
}
getAllfilteredData(){
  let startDate = this.form.value.startDate;
  let endDate= this.form.value.endDate;
  const date = new Date('Thu Aug 01 2024 00:00:00 GMT+0530');
  const formattedStartDate = startDate.toISOString().split('T')[0];
  const formattedEndDate = endDate.toISOString().split('T')[0];
console.log(formattedStartDate);
console.log(formattedEndDate); // Output: 2024-07-31
    this.service.getVisitorEntryExitRecordwithFilter(formattedStartDate,formattedEndDate).subscribe((res)=>{
    console.log(res,"res==>");
    this.readData = res.data;
    this.readData.sort((a:any, b:any) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    this.totalLength = (res.data).length;
  });
}

// open(us: any, content: any) {
//   if (us && us.record) {
//     this.us = us;
//     this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
//       (result) => {
//         this.closeResult = Closed with: ${result};
//       },
//       (reason) => {
//         this.closeResult = Dismissed ${this.getDismissReason(reason)};
//       }
//     );
//   } else {
//     console.error("us or us.record is undefined", us);
//     // Handle the case where us or us.record is not available
//   }
// }

detailsClick(us:any){

const modalRef = this.modalService.open(VisitorDetailsPopupComponent);
modalRef.componentInstance.message = us.record;
console.log(modalRef.componentInstance.message);
}



back(){
  this._location.back();
}




}