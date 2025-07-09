import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-createamenitybooking',
  templateUrl: './createamenitybooking.component.html',
  styleUrls: ['./createamenitybooking.component.css']
})
export class CreateamenitybookingComponent implements OnInit {

 
  first_name = '';
  comment = '';
  closeResult: any;
  getparamid:any;
  id:any
  searchAmenity:any = "";
  form:any= UntypedFormGroup;
  loading = false
  noslots = false

   searchFlat:any = "";
  searchControl = new UntypedFormControl(); // Initialize the FormControl
  myControl = new UntypedFormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions!: any[];
  role=sessionStorage.getItem('role');
  formattedTimes: string[] = [];
  selectedTimes: boolean[] = [];  // Array to hold selected checkbox values
  selectedStartTime: string = ''; // Store the selected start time
  selectedStartTimelong: string = ''; // Store the selected start time
  selectedEndTimelong: string = ''; // Store the selected start time


  selectedEndTime: string = '';  
  dataLoaded: boolean = false;    // Flag to indicate that data has been loaded
  selectedDate: any = null; // or specify the type, e.g., Date | null
  isToday:any;

  constructor(private service:ApiService,
               private _location: Location,
               private fb: UntypedFormBuilder, 
               private router: Router,
               private cdr: ChangeDetectorRef

               ) { }

 
  totalLength:any;
  amenityType:any;
  amenityID:any;

  page:number=1;
 
  readData:any = [];
  slotsData:any = [];
  datesData:any = [];

  disabledDates: Date[] = []; 

  flatData:any = [];

  readData2:any = [];
  selectedAmenity:any = [];

  filteredFlatData: any[] = [];
  searchTerm: string = '';
  showDropdown: boolean = false;
  
 

  ngOnInit(): void {
    this.getAllBookingData();
    this.getAllAmenityData();
    this.getAllFlatData();
    this.noslots = false;
  
    this.initializeForm();          // Initialize the form setup
    this.form.get('amenityId')?.valueChanges.subscribe((amenityId: any) => {
      if (amenityId && amenityId !== 0) {
        this.dataLoaded = false;
        this.form.get('startTime')?.enable();
        this.getonlyAmenityData(amenityId);
        this.amenityID = amenityId;
        this.selectedDate = null;
        this.noslots = false;
        console.log(this.amenityType);
       
        // Reset `startTime` field
        this.form.get('startTime')?.setValue('', { emitEvent: false });
      this.form.get('startTime')?.markAsPristine();
      this.form.get('startTime')?.markAsUntouched();
  
       
      } else {
        this.form.get('startTime')?.disable();
      }
  
      // Reset fields and clear selections
      this.resetFields();
      this.clearTimeSelections();
    });    // this.subscribeToStartTimeChange();   // StartTime change handler
  }
  
  initializeForm(): void {
    this.form = this.fb.group({
      amenityId: ['', Validators.required],
      startTime: [{ value: '', disabled: true }, Validators.required],
      endTime: ['', Validators.required],
      time: [false],
      rentalUnitId: new UntypedFormControl(''),
    });
  }
  
 
  
  subscribeToStartTimeChange(): void {
    this.form.get('startTime')?.valueChanges.subscribe((date: any) => {
      this.selectedDate = date;
  
      if (this.selectedDate && this.amenityType === 'HOURLY') {
        this.getAvailableDateData(this.amenityID, this.selectedDate);
      }
    });
  }
  onStartTimeChange(event: any): void {
    this.selectedDate = event.value;  // Access the selected date directly from the event object
    
    

    if (this.selectedDate && this.amenityType === 'HOURLY') {
      this.getAvailableDateData(this.amenityID, this.selectedDate);
    }
  }
  
  
    
  
resetFields() {
  // Reset necessary fields, keep `amenityId` unchanged
  this.form.patchValue({
    startTime: null,
    endTime: null,
    time: false,
    rentalUnitId: null
  });
}
clearTimeSelections() {
  this.formattedTimes = [];
  this.selectedTimes = []; // Reset all checkboxes
  this.selectedStartTime = '';
  this.selectedEndTime = '';
}


  back(){
    this._location.back();
  }

  getonlyAmenityData(amenityId: any){
    this.disabledDates= [];
    this.service.getAmenity().subscribe((res)=>{
      this.selectedAmenity = res.data.filter((item: any) => item.id === amenityId);
      console.log(this.selectedAmenity);
      this.amenityType = this.selectedAmenity[0].type;
      console.log(this.amenityType);
      if (this.amenityType === 'DAILY') {
        console.log("hello");
        this.checkSlotsData(amenityId);
      }
      
    });
  }
  checkSlotsData(amenityId: any) {

    this.service.checkSlots(amenityId).subscribe((res) => {
      this.slotsData = res.data;
      this.disabledDates = this.slotsData.map((dateStr: { match: (arg0: RegExp) => { (): any; new(): any; map: { (arg0: NumberConstructor): never[]; new(): any; }; }; }) => {
        const [year, month, day] = dateStr.match(/\d+/g)?.map(Number) || [];
        return new Date(year, month - 1, day); // Correct month for JavaScript Date
      });
      console.log(this.disabledDates);
    });
  }

  getAvailableDateData(amenityId: any, date: any) {
    console.log(date);
    this.noslots = false;
    this.service.dateAvailable(amenityId, date).subscribe((res) => {
      this.datesData = res.data;
      if(res.data.length == 0){
        this.noslots = true;
      }
      this.formattedTimes = this.formatTimes(this.datesData);
      // Initialize `selectedTimes` as an array of `false` for each time slot
      this.selectedTimes = Array(this.formattedTimes.length).fill(false);
      this.dataLoaded = true;
      console.log(this.selectedTimes);
      console.log(this.formattedTimes);

      console.log("Initialized selectedTimes:", this.selectedTimes); // Debugging log
      // this.cdr.detectChanges();

    });
  }
  
  // trackByIndex(index: number, item: any): number {
  //   return index;
  // }
  
  

  formatTimes(dates: any[]): string[] {
    return dates.map((slot) => {
      const start = new Date(slot.startTime);
      const end = new Date(slot.endTime);
      return `${this.formatTime(start)}-${this.formatTime(end)}`;
    });
  }

  formatTime(date: Date): string {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12; // Convert to 12-hour format
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes}${ampm}`;
  }

  onCheckboxChange(index: number) {
    console.log("Checkbox changed at index:", index); // Debugging line
  
    // Toggle the checkbox state
    this.selectedTimes[index] = !this.selectedTimes[index];
  
    // Update the selected times after toggling
    this.updateSelectedTimes();
  }

  updateSelectedTimes() {
    // Map checked values to indexes
    const selectedIndexes = this.selectedTimes
      .map((checked, idx) => (checked ? idx : -1))
      .filter((index) => index !== -1);
  
    console.log("Selected Indexes:", selectedIndexes); // Debugging line
    console.log("Selected Times Array:", this.selectedTimes); // Debugging line
  
    if (selectedIndexes.length > 0) {
      const firstIndex = selectedIndexes[0];
      const lastIndex = selectedIndexes[selectedIndexes.length - 1];
  
      this.selectedStartTime = this.formatTime(new Date(this.datesData[firstIndex].startTime));
      this.selectedEndTime = this.formatTime(new Date(this.datesData[lastIndex].endTime));
      this.selectedStartTimelong = this.datesData[firstIndex].startTime;
      this.selectedEndTimelong = this.datesData[lastIndex].endTime;

      console.log(`Selected start time: ${this.selectedStartTime}`);
      console.log(`Selected start time long: ${this.selectedStartTimelong}`);
      console.log(`Selected end time: ${this.selectedEndTime}`);
    } else {
      this.selectedStartTime = '';
      this.selectedEndTime = '';
    }
  }
  
  isPastTime(timeRange: string): boolean {
    const currentTime = new Date();
    
    // Convert the date parameter to a Date object (if it's not already one)
    // const selectedDate = new Date(date);
    console.log(this.selectedDate);

    // Reset the selected date time to midnight to only compare the date part
    this.selectedDate.setHours(0, 0, 0, 0);
    
    // Debugging: Log the current time and the selected date
    console.log("Current time:", currentTime);
    console.log("Selected date at midnight:", this.selectedDate);
    
    // Extract the start time from the timeRange string (format is "HH:MM AM/PM - HH:MM AM/PM")
    const [startTime] = timeRange.split(' - ');
    const start = this.convertTo24HourFormat(startTime);
    
    // Debugging: Log the extracted start time and converted Date object
    console.log("Start time from timeRange:", startTime);
    console.log("Converted start time to Date object:", start);
    
    // Check if the selected date is today
    const isToday = this.selectedDate.getDate() === currentTime.getDate() &&
                    this.selectedDate.getMonth() === currentTime.getMonth() &&
                    this.selectedDate.getFullYear() === currentTime.getFullYear();
    
    // Debugging: Log whether the selected date is today
    console.log("Is the selected date today?", isToday);
    
    // If the selected date is today, check if the start time is in the past
    if (isToday) {
      console.log("Comparing start time with current time...");
      console.log("Start time:", start.getTime());
      console.log("Current time:", currentTime.getTime());
      
      // Disable if the start time is in the past
      return start.getTime() < currentTime.getTime();
    }
  
    // If the selected date is not today, do not disable it
    console.log("The selected date is not today, not disabling the checkbox.");
    return false;
  }
  
  
  
  
  // Convert the 12-hour time format (e.g., "8:00am") to a Date object for comparison
  convertTo24HourFormat(time: string): Date {
    const [timePart, ampm] = time.split(/(am|pm)/);
    let [hours, minutes] = timePart.split(':').map(num => parseInt(num, 10));
  
    //console.log("Time parsed:", { hours, minutes, ampm }); // Log the parsed time and am/pm
    
    // Adjust hours for AM/PM
    if (ampm === 'pm' && hours < 12) {
      hours += 12;
    } else if (ampm === 'am' && hours === 12) {
      hours = 0;
    }
  
    const now = new Date();
    now.setHours(hours, minutes, 0, 0); // Set the date object with the correct time
   // console.log("Converted Date:", now); // Log the final Date object
    return now;
  }
  
  

  myDateFilter = (d: Date | null): boolean => {
    if (!d) return false;

    // Disable dates in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today for comparison
    const isFutureOrToday = d >= today;

    // Disable specific dates from the disabledDates array
    const isNotDisabledDate = !this.disabledDates.some(
      (disabledDate) =>
        d.getFullYear() === disabledDate.getFullYear() &&
        d.getMonth() === disabledDate.getMonth() &&
        d.getDate() === disabledDate.getDate()
    );

    return isFutureOrToday && isNotDisabledDate;
  };
  
  getAllBookingData(){
    this.service.getBooking().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
      this.readData.sort((a:any, b:any) => {
        return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
      });
      this.totalLength = (res.data).length;
     
    });
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
  saveDetails(form:any) {
   
    // Get today's date for comparison (local time)
   
    const result = window.confirm('Are you sure you want to add this Amenity?');
    const selectedOption = this.flatData.find((option: { name: any; }) => option.name === this.myControl.value);
    const rentalId = selectedOption.id;

    console.log( {
      amenityId:this.form.value.amenityId,
      
    });

    if (result) {
      this.loading = true;
      console.log('confirmed');
  {
    //this.societyId= sessionStorage.getItem('societyId');
    if(this.amenityType == 'DAILY'){
    const startTime = this.form.value.startTime;
    const endTime = this.form.value.endTime;
    
    // Parse the date objects from the form values
    const startTimeObj = new Date(startTime);
    const endTimeObj = new Date(endTime);
    
    // Log the original times as is (local)
    
    // Adjust the start time to UTC and format it as 'YYYY-MM-DDTHH:mm:ss.sssZ'
    const startTimeUTC = new Date(startTimeObj.getTime() - startTimeObj.getTimezoneOffset() * 60000);
    const endTimeUTC = new Date(endTimeObj.getTime() - endTimeObj.getTimezoneOffset() * 60000);
    
    // Format the date as '2024-11-23T18:30:00.000Z'
    const isoStartTime = startTimeUTC.toISOString();
    const isoEndTime = endTimeUTC.toISOString();
    
    console.log('Start time in ISO format (UTC):', isoStartTime);
    console.log('End time in ISO format (UTC):', isoEndTime);
    
   

// Get the current date and time
const now = new Date();

// Calculate one hour after the current time
const oneHourLater = new Date(now.getTime() + 1 * 60 * 60 * 1000);
console.log(now);
console.log(oneHourLater);


// Check if startTime is today (in local time)
const isToday = startTimeObj.toDateString() === now.toDateString();
console.log(isToday);

let adjustedStartTime;
let adjustedEndTime;

if (isToday) {
    // If start time is today, set start time to one hour after the current time
    adjustedStartTime = new Date(oneHourLater.getTime() - oneHourLater.getTimezoneOffset() * 60000).toISOString();
    console.log(adjustedStartTime);
} else {
    // If start time is not today, set it to the start of the selected date in UTC
    adjustedStartTime = new Date(startTimeUTC.setUTCHours(0, 0, 0, 0)).toISOString();
}

// Set end time to the end of the selected date in UTC
adjustedEndTime = new Date(endTimeUTC.setUTCHours(23, 59, 59, 999)).toISOString();

console.log('Adjusted start time (ISO):', adjustedStartTime);
console.log('Adjusted end time (ISO):', adjustedEndTime);

this.selectedStartTimelong = adjustedStartTime;
this.selectedEndTimelong = adjustedEndTime;

    }
    else{
      this.selectedStartTimelong;
      this.selectedEndTimelong;
    }
    console.log({
      amenityId:this.form.value.amenityId,
      startTime:this.selectedStartTimelong,
      endTime:this.selectedEndTimelong,
      rentalUnitId:rentalId,
    })

    this.service.BookAmenity(
      {
        amenityId:this.form.value.amenityId,
        startTime:this.selectedStartTimelong,
        endTime:this.selectedEndTimelong,
        rentalUnitId:rentalId,
      }).subscribe((res)=>{
      console.log(res,'res==>');
   //   this.form.reset();
   alert(res.message);
   this.router.navigate(['/supervisor/booking']);
      this.getAllBookingData();
      this.onCancelClick();
      this.loading = false;

      ////location.reload();
  
    },(error) => {
      alert(error.error.message);
      console.error('Error:', error);
      this.loading = false;
      // You can show an error message to the user if needed
    });
   }
  }else {
    this.form.reset();
    this.onCancelClick();
    this.loading = false;
    console.log('Delete canceled');
  }
  }
}
