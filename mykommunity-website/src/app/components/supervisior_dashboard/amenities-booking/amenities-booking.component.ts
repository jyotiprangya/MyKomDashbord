import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import {HttpClient} from "@angular/common/http";
import { UntypedFormGroup, UntypedFormBuilder, Validators, UntypedFormControl } from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DownloadConfirmDialogComponent } from '../download-confirm-dialog/download-confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-amenities-booking',
  templateUrl: './amenities-booking.component.html',
  styleUrls: ['./amenities-booking.component.css'],
  encapsulation: ViewEncapsulation.None, 
  
})
export class AmenitiesBookingComponent implements OnInit {

  @ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;

  first_name = '';
  comment = '';
  closeResult: any;
  getparamid:any;
  id:any
  searchAmenity:any = "";
  form:any= UntypedFormGroup;
  loading = false;
   searchFlat:any = "";
   sortDirection: { [key: string]: boolean } = {};

  searchControl = new UntypedFormControl(); // Initialize the FormControl
  myControl = new UntypedFormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: any[];
  isModalOpen = false;
  hiddenColumns: any[] = [];
  displayedColumns: any[] = []; 
  selectedColumn: any = null; 
  selectedColumnName: string | null = null;
  selectedRecord: any[] = [];
  isDropdownOpen = false;
  filteredData: any[] = [];
  role=sessionStorage.getItem('role');
  generateData:any = []; 


  constructor(private service:ApiService,
               private _location: Location,
               private fb: UntypedFormBuilder, 
               private modalService: NgbModal, 
               private router: Router,
               private route: ActivatedRoute,
               private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private snackBar: MatSnackBar,
               ) { }

 
  totalLength:any;
  page:number=1;
 
  readData:any = [];
  flatData:any = [];

  readData2:any = [];

  filteredFlatData: any[] = [];
  searchTerm: string = '';
  showDropdown: boolean = false;
  
 
  ngOnInit(): void {
    this.getAllBookingData();
    this.getAllAmenityData();
    this.updateColumnLists();
    this.getAllFlatData();

    this.form = this.fb.group({
      amenityId: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      rentalUnitId: ['', [Validators.required]],
    });
   
  
// this.searchFlat;
  }

  // searchFlat = (value: string) => {
  //   const filterValue = value.toLowerCase();
  //   return this.flatData.filter((option: { name: string; }) => option.name.toLowerCase().includes(filterValue));
  // }

  // displayFn(option: { name: string; }): string {
  //   return option && option.name ? option.name : '';
  // }

  columns = [
    { name: 'Amenity Name', visible: true },
    { name: 'Charge Type', visible: true },
    { name: 'Price per Slot', visible: true },
    { name: 'Created By', visible: true },
    { name: 'House', visible: true },
    { name: 'Start Time', visible: true },
    { name: 'End Time', visible: true },
    { name: 'No of Slots Booked', visible: true },
    { name: 'Amount', visible: true },
    { name: 'Booking Status', visible: true },
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

  sortData(column: string): void {
    this.sortDirection[column] = !this.sortDirection[column]; // Toggle the sort direction for the column
    this.readData.sort((a: any, b: any) => {
      const direction = this.sortDirection[column] ? 1 : -1;
      return a[column] > b[column] ? direction : -direction;
    });
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
      case 'Amenity Name': return 'amenityId';
      case 'Charge Type': return 'amenityType';
      case 'Price per Slot': return 'amenityPriceperSlot';
      case 'Created By': return 'userFirstName';
      case 'House': return 'blockName-rentalUnitName';
      case 'Start Time': return 'startTime';
      case 'End Time': return 'endTime';
      case 'No of Slots Booked': return 'slotsBooked';
      case 'Amount': return 'amountPaid';
      case 'Booking Status': return 'status';
      default: return '';
    }
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

  console.log('Visible Columns:', visibleColumns);

  const dataToExport = this.readData.map((entry: { [x: string]: any; }) => {
    const exportEntry: any = {};

    visibleColumns.forEach(column => {
      const key = this.mapColumnToKey(column);
      let value = entry[key];
  
          if (column === 'Created By') {
            value = `${entry['userFirstName'] || ''} ${entry['userlastName'] || ''}`.trim();
            if (!value) value = 'Resident';
          } else if (column === 'House') {
            value = `${entry['renatlUnit'].blockName || ''} ${entry['renatlUnit'].rentalUnitName || ''}`.trim();
          } else {
            value = entry[key];
          }
                // Log the mapping process for debugging
                console.log(`Mapping column "${column}" to key "${key}" with value: ${entry[key]}`);
                exportEntry[column] = value;
              });
        
              console.log('Export Entry:', exportEntry);
              return exportEntry;
            });
        

    // Convert data to CSV format
    const csvContent = this.convertToCSV(dataToExport);
    console.log('CSV Content:', csvContent); // Log to see what the CSV content looks like

    // Download the CSV file
    this.downloadCSV(csvContent, 'amenitiesbooking_log.csv');
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
 

 
  
  back(){
    this._location.back();
  }
  createbooking(){
    this.router.navigate(['/supervisor/createbooking']);
  }
  // onFilterChange(event: Event) {
  //   this.searchFlat = (event.target as HTMLInputElement).value;
  // }
  orders=[
    { id: '1', name: 'order 1' },
    { id: '2', name: 'order 2' },
    { id: '3', name: 'order 3' },
    { id: '4', name: 'order 4' }
  ]

  selectedDay: string = '';

  selectChangeHandler (event: any) {
    this.selectedDay = event.target.value;
  }
  getAllBookingData(){
    this.service.getBooking().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
      // this.readData.sort((a:any, b:any) => {
      //   return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      // });
      this.totalLength = (res.data).length;
     
    });
  }
getflatid(){
  const selectedOption = this.flatData.find((option: { name: any; }) => option.name === this.searchFlat);
  this.searchFlat = selectedOption ? selectedOption.id : null;
console.log(selectedOption);
}
  getAllAmenityData(){
  
    this.service.getAmenity().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData2 = res.data;
      
    });
  }
  getAllFlatData(){
    this.service.getFlat().subscribe((res)=>{
      console.log(res,"res==>");
      this.flatData = res.data;
     // this.filteredOptions = this.flatData;

    });
  }
  onCancelClick(){
    this.getparamid = "";
    this.form.reset();
    // this.firebase = null;
    // this.Percentage = undefined ;
   
  }
  
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
  
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  
    });
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
  
  saveDetails(form:any) {
    
    const result = window.confirm('Are you sure you want to add this Amenity?');
    console.log(this.form.value);

    if (result) {
      this.loading = true;
      console.log('confirmed');
  {
    //this.societyId= sessionStorage.getItem('societyId');
    const startTime = this.form.value.startTime;
    const endTime = this.form.value.endTime;
    const startTimeObj = new Date(`${startTime}`);
    const endTimeObj = new Date(`${endTime}`);

    // Format Date objects to iOS-style time format
    const iosStyleStartTime = startTimeObj.toISOString();
    const iosStyleEndTime = endTimeObj.toISOString();
    console.log(iosStyleStartTime,iosStyleEndTime);

    console.log(this.form.value);
    this.service.BookAmenity(
      {
        amenityId:this.form.value.amenityId,
        startTime:iosStyleStartTime,
        endTime:iosStyleEndTime,
        rentalUnitId: this.form.value.rentalUnitId,
      }).subscribe((res)=>{
      console.log(res,'res==>');
   //   this.form.reset();
   alert(res.message);
      this.loading = false;
      this.getAllBookingData();
      this.onCancelClick();
      ////location.reload();
  
    },(error) => {
      alert(error.error.message);
      this.loading = false;
      console.error('Error:', error);
      // You can show an error message to the user if needed
    });
   }
  }else {
    this.loading = false;
    this.onCancelClick();
    console.log('Delete canceled');
  }
  }

  showSnackbar(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      horizontalPosition: 'center', // 'start', 'center', 'end', 'left', 'right'
      verticalPosition: 'top', 
      panelClass: ['custom-snackbar'],// 'top' or 'bottom'
    });
  }
  getSelectedAmenityBookingData(id?: string) {
    this.service.getBooking().subscribe((res) => {
      console.log(res, "res==>");
  
      // Filter for specific id
      this.generateData = res.data.filter((item: any) => item.id === id);
  
      console.log(this.generateData, "Filtered Data");
      if (this.generateData.length > 0) {
        const booking = this.generateData[0]; // Assuming there's only one booking for the given id

        // Current time in UTC (milliseconds)
        let currentTimeUTC = new Date().getTime(); // Already in UTC
        
        // Subtract 5 hours and 30 minutes (5.5 hours) in milliseconds
        const adjustmentMilliseconds = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
        currentTimeUTC += adjustmentMilliseconds; // Adjust current time backward
        
        // Booking endTime in UTC (milliseconds)
        const endTimeUTC = new Date(booking.endTime).getTime(); // Ensure booking.endTime is ISO 8601 or in UTC format
        
        // Calculate 1 hour before the end time in UTC
        const oneHourBeforeEndTimeUTC = endTimeUTC - 60 * 60 * 1000; // 1 hour before endTime in milliseconds (UTC)
        
        // Debug logs
        console.log("Debugging Date Values After Adjustment:");
        console.log("--------------------------------------------------");
        console.log("Adjusted Current Time (UTC):", new Date(currentTimeUTC).toISOString(), "| Milliseconds:", currentTimeUTC);
        console.log("Booking End Time (UTC):", new Date(endTimeUTC).toISOString(), "| Milliseconds:", endTimeUTC);
        console.log("1 Hour Before End Time (UTC):", new Date(oneHourBeforeEndTimeUTC).toISOString(), "| Milliseconds:", oneHourBeforeEndTimeUTC);
        console.log("--------------------------------------------------");
        
        // Logic for handling booking state
        if (booking.status === "CANCELLED") {
          this.showSnackbar('Booking already Cancelled.');
        } else if (currentTimeUTC >= oneHourBeforeEndTimeUTC && currentTimeUTC < endTimeUTC) {
          this.showSnackbar('Booking cannot be edited within 1 hour of the end time.');
        } else if (endTimeUTC > currentTimeUTC) {
          this.router.navigate(['editbooking'], {
            queryParams: { generateData: JSON.stringify(this.generateData) },
            relativeTo: this.route
          });
        } else {
          this.showSnackbar('Booking already finished.');
        }
        
      } else {
        this.showSnackbar('No booking found with the given ID.');
      }
    });
  }
  
  
  onEdit(us:any){
    this.getSelectedAmenityBookingData(us.id);
   
  }
  canCancelBooking(startTime: string): boolean {
    const currentTime = new Date().getTime();
    const bookingStartTime = new Date(startTime).getTime();
    // Check if the difference is at least 2 hours (in milliseconds)
    const difference = bookingStartTime - currentTime;
    const twoHoursInMs = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    

    return difference >= twoHoursInMs;
  }
  
  cancelBooking(us:any){
    this.getparamid = us.id  ;
    console.log(this.getparamid);
    console.log(us.status);
    if((us.status) === 'BOOKED'){

    const result = window.confirm('Are you sure you want to cancel this Booking?');
      if (result) {
        this.loading = true;
        console.log('confirmed');
        const currentTime = new Date().getTime();
        const bookingStartTime = new Date(us.startTime).getTime();
        // Check if the difference is at least 2 hours (in milliseconds)
        const difference = bookingStartTime - currentTime;
        const twoHoursInMs = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
        console.log(currentTime);
    
        console.log(bookingStartTime);
        console.log(twoHoursInMs);
        console.log(difference);
        console.log(difference >= twoHoursInMs)
    if(this.canCancelBooking(us.startTime)){
      this.service.CancelAmenityBooking({bookedAmenityId:this.getparamid}).subscribe((res)=>{
       console.log('confirmed');
        console.log(us.status);
        alert(res.message);
        this.loading = false;
        this.onCancelClick();
        this.getAllBookingData();
        ////location.reload();
    
      },(error) => {
        this.loading = false
        this.onCancelClick();
        alert(error.error.message);
        console.error('Error:', error);
        // You can show an error message to the user if needed
      });
      }
      else{
        alert("booking can only be cancelled 2 hours before the startTime");
      }
    
     
  
  }
  else {
    this.loading = false;
    console.log('Delete canceled');
  }
}
  else
  {
   alert("Booking Already Cancelled...");
  }
   }
  
  //  handleInput(event: any) {
  //   const inputValue = event.target.value;
  //   this.getAllFlatData();
  //   // Filter flatData based on the blockName
  //   this.filteredFlatData = this.flatData.filter((ft: { blockName: string | any[]; }) => ft.blockName.includes(inputValue));
  // }
  // selectedBlockName: string = '';
  // selectedId: number | null = null; 
  // selectOption(ft: any) {
  //   this.selectedBlockName = ${ft.blockName} - ${ft.floorName} - ${ft.name};
  //   this.selectedId = ft.id;
  // }
  // selectedId: any ;
  // rentalUnitIdControl = new FormControl('');

  // get datalistId(): string {
  //   return this.selectedId === 0 ? 'browsers' : '';
  // }

  // handleInput(event: any): void {
  //   const inputValue = event.target.value;
  //   const selectedFlat = this.flatData.find((ft: { blockName: { toString: () => any; }; }) => ft.blockName.toString() === inputValue);
  //   if (selectedFlat) {
  //     this.selectedId = selectedFlat.id;
  //   } else {
  //     this.selectedId = 0;
  //   }
  // }

  // getSelectedBlockName(): string {
  //   this.getAllFlatData();
  //   if (this.selectedId !== 0) {
  //     const selectedFlat = this.flatData.find((ft: { blockName: any; }) => ft.blockName  === this.selectedId);
  //     if (selectedFlat) {
  //       return ${selectedFlat.blockName} - ${selectedFlat.floorName} - ${selectedFlat.name};
  //     }
  //   }
  //   return '';
  // }
  selectedId: number = 0;
  selectedBlockName: string = '';
  rentalUnitIdControl = new UntypedFormControl('');

  get datalistId(): string {
    return this.selectedBlockName === '' ? 'browsers' : '';
  }

  handleInput(event: any): void {
    const inputValue = event.target.value;
    this.selectedBlockName = inputValue;
    const selectedOption = this.flatData.find((ft: { blockName: any; }) => ft.blockName === inputValue);
    if (selectedOption) {
      this.selectedId = selectedOption.id;
    } else {
      this.selectedId = 0;
    }
  }

  getSelectedBlockName(): string {
    return this.selectedBlockName;
  }
}