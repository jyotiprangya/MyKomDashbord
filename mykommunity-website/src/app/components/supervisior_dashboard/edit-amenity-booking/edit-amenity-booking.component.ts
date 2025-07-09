import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, UntypedFormBuilder, Validators, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services/api.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-edit-amenity-booking',
  templateUrl: './edit-amenity-booking.component.html',
  styleUrls: ['./edit-amenity-booking.component.css']
})
export class EditAmenityBookingComponent implements OnInit {

 
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


  constructor(private service:ApiService,
               private _location: Location,
               private fb: UntypedFormBuilder, 
               private router: Router,
               private route: ActivatedRoute,
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
  
  generateData:any = []; 
bookingId:any;

  ngOnInit(): void {
    // setInterval(() => {
    //   this.cdr.detectChanges(); // Trigger re-evaluation periodically
    // }, 1000);
    this.route.queryParams.subscribe(params => {
      this.generateData = JSON.parse(params['generateData']);
      console.log(this.generateData);
      this.amenityType = this.generateData[0].amenityType;
      this.amenityID=this.generateData[0].amenityTypeId;
      console.log(this.generateData[0].startTime);

      // Use the generateData in the second page as needed
this.bookingId=this.generateData[0].id;
      this.getonlyAmenityData(this.amenityID,this.generateData[0].startTime,this.generateData[0].endTime);
    });
  
    this.noslots = false;
  
    this.initializeForm(); 
    this.populateFormWithGeneratedData();         // Initialize the form setup
       // this.subscribeToStartTimeChange();   // StartTime change handler
  }
  
  initializeForm(): void {
    
    this.form = this.fb.group({
      
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      time: [false],
    });
  }
  
  populateFormWithGeneratedData(): void {
    const startTime = new Date(this.generateData[0].startTime);
    const endTime = new Date(this.generateData[0].endTime);
    
    console.log(startTime, this.generateData[0].startTime);  // Debugging line
    console.log(endTime, this.generateData[0].endTime);      // Debugging line
    
    // Adjust by subtracting 5 hours and 30 minutes (330 minutes)
    startTime.setMinutes(startTime.getMinutes() - 330);  // Subtract 5 hours and 30 minutes
    endTime.setMinutes(endTime.getMinutes() - 330);      // Subtract 5 hours and 30 minutes
    
    // Log adjusted times
    console.log("Adjusted Start Time:", startTime);
    console.log("Adjusted End Time:", endTime);
    this.selectedDate = startTime;

    this.form.patchValue({
      startTime: startTime,
      endTime: endTime,
    });
    if (this.amenityType === 'HOURLY') {
      this.getAvailableDateDataOnChange2(this.amenityID, this.generateData[0].startTime,this.generateData[0].endTime);
    }

  }
  
  // subscribeToStartTimeChange(): void {
  //   this.form.get('startTime')?.valueChanges.subscribe((date: any) => {
  //     this.selectedDate = date;
  
  //     if (this.selectedDate && this.amenityType === 'HOURLY') {
  //       this.getAvailableDateData(this.amenityID, this.selectedDate);
  //     }
  //   });
  // }
  onStartTimeChange(event: any): void {
    this.selectedDate = event.value;  // Access the selected date directly from the event object
    

    if (this.selectedDate && this.amenityType === 'HOURLY') {
      this.getAvailableDateDataOnChange(this.amenityID, this.selectedDate);
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

  getonlyAmenityData(amenityId: any,startTime:any,endTime:any){
    this.disabledDates= [];

    this.service.getAmenity().subscribe((res)=>{
      this.selectedAmenity = res.data.filter((item: any) => item.id === amenityId);
      console.log(this.selectedAmenity);
      this.amenityType = this.selectedAmenity[0].type;
      console.log(this.amenityType);
      if (this.amenityType === 'DAILY') {
        console.log("hello");
        this.checkSlotsData(amenityId,startTime,endTime);
      }
      
    });
  }
  checkSlotsData(amenityId: any,startTime:any,endTime:any) {

    this.service.checkSlots(amenityId).subscribe((res) => {
      this.slotsData = res.data;
      console.log(res.data);
      // const startDate = new Date(new Date(startTime).getTime()  5.5 * 60 * 60 * 1000); // Add 5.5 hours
      // const endDate = new Date(new Date(endTime).getTime() - 5.5 * 60 * 60 * 1000); // Add 5.5 hours
  
  const resetToStartOfDay = (date: string) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // Set to the start of the day (00:00:00)
    return d;
  };

  // Adjust `startTime` and `endTime` to the start of the day and subtract 5 hours and 30 minutes
  const startDate = resetToStartOfDay(startTime);
  const endDate = resetToStartOfDay(endTime);

  // Subtract 5.5 hours from both start and end times
  const adjustedStartDate = new Date(startDate.getTime()); // Subtract 5.5 hours
  const adjustedEndDate = new Date(endDate.getTime()); // Subtract 5.5 hours

  this.disabledDates = this.slotsData
    .map((dateStr: { match: (arg0: RegExp) => { (): any; new(): any; map: { (arg0: NumberConstructor): never[]; new(): any; }; }; }) => {
      const [year, month, day] = dateStr.match(/\d+/g)?.map(Number) || [];
      return new Date(year, month - 1, day); // Correct month for JavaScript Date
    })
    .filter((date: Date) => {
      // Exclude dates within the adjusted range
      return !(date >= adjustedStartDate && date <= adjustedEndDate);
    });
      console.log(this.disabledDates);
    });
  }
  generateSlotsBetween(startTime: Date, endTime: Date): any[] {
    const slots = [];
    let currentStartTime = new Date(startTime);

    // Loop to create slots of 59 minutes between start and end times
    while (currentStartTime < endTime) {
        // Ensure start time seconds and milliseconds are set to 00
        currentStartTime.setSeconds(0);
        currentStartTime.setMilliseconds(0);

        // Create the slot end time (59 minutes after the start)
        let currentEndTime = new Date(currentStartTime);
        currentEndTime.setMinutes(currentEndTime.getMinutes() + 59);
        currentEndTime.setSeconds(59); // Ensure seconds are always set to 59
        currentEndTime.setMilliseconds(999); // Ensure milliseconds are always set to 999

        // Ensure the end time doesn't exceed the specified end time
        if (currentEndTime > endTime) {
            currentEndTime = new Date(endTime);
            currentEndTime.setSeconds(59); // Ensure the last slot ends with seconds set to 59
            currentEndTime.setMilliseconds(999); // Ensure the last slot ends with milliseconds set to 999
        }

        // Format times to ISO strings for consistency
        const startTimeStr = currentStartTime.toISOString();
        const endTimeStr = currentEndTime.toISOString();

        // Add the slot to the array
        slots.push({
            startTime: startTimeStr,
            endTime: endTimeStr
        });

        // Increment the start time for the next slot by 59 minutes
        currentStartTime = new Date(currentEndTime);
        currentStartTime.setMinutes(currentStartTime.getMinutes() + 1); // Ensure the next slot starts 1 minute after the previous one
    }

    return slots; // Return the generated slots
}








generateHourlySlots(start: Date, end: Date): string[] {
    const slots = []; // Array to store slots
    let currentTime = new Date(start); // Start from the given start time

  
    // Ensure the loop runs until the end time
    while (currentTime < end) {
        // Define the end of the current slot (59 minutes after the start time)
        const slotEndTime = new Date(currentTime);
        slotEndTime.setMinutes(currentTime.getMinutes() + 59); // Set the end time to 59 minutes later
        slotEndTime.setSeconds(59);  // Set seconds to 59
        slotEndTime.setMilliseconds(999);  // Set milliseconds to 999 (almost at the next minute)

        // Clamp the slot end time to the provided end time if it exceeds it
        if (slotEndTime > end) {
            slotEndTime.setTime(end.getTime());
        }

        // Format the slot as "start-end"
        const slot = `${this.formatTime(currentTime)}-${this.formatTime(slotEndTime)}`;
        console.log("Processing slot:", slot);
        slots.push(slot);

        // Advance to the next slot start time (1 minute after current slot's start time)
        currentTime.setMinutes(currentTime.getMinutes() + 60);  // Move to next hour's start time
        currentTime.setSeconds(0);  // Reset seconds to 00
        currentTime.setMilliseconds(999);  // Reset milliseconds to 0

    }

    return slots; // Return the generated slots
}

getAvailableDateDataOnChange2(amenityId: any, date: any,endTime:any) {
  console.log(date);
  this.noslots = false;
  this.service.dateAvailable(amenityId, date).subscribe((res) => {
    this.datesData = res.data;
    const startDateTime = new Date(date);
    const endDateTime = new Date(endTime);

    // Generate all slots between the start and end times
    const generatedSlots = this.generateSlotsBetween(startDateTime, endDateTime);

    // Merge the existing datesData with the generated slots
    this.datesData = [...this.datesData, ...generatedSlots];

    // Log the combined result
    console.log("Updated Dates Data with Generated Slots:", this.datesData);

    // Now you can proceed with the rest of your logic
    this.datesData.sort((a: { startTime: string | number | Date; }, b: { startTime: string | number | Date; }) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    if(res.data.length == 0){
      this.noslots = true;
    }
    

    // Initialize `selectedTimes` as an array of `false` for each time slot
    this.selectedTimes = Array(this.formattedTimes.length).fill(false);

    this.dataLoaded = true;
    this.formattedTimes = this.formatTimes(this.datesData);
    console.log(this.datesData);
    // Initialize `selectedTimes` as an array of `false` for each time slot
    this.selectedTimes = Array(this.formattedTimes.length).fill(false);
    this.dataLoaded = true;
   
  });
}

isPastTime(timeRange: string): boolean {
  const currentTime = new Date();
  
  // Convert the date parameter to a Date object (if it's not already one)
  // const selectedDate = new Date(date);
  console.log(this.selectedDate);

  // Reset the selected date time to midnight to only compare the date part
  this.selectedDate.setHours(0, 0, 0, 0);
  
  
  const [startTime] = timeRange.split(' - ');
  const start = this.convertTo24HourFormat(startTime);
  
  
  const isToday = this.selectedDate.getDate() === currentTime.getDate() &&
                  this.selectedDate.getMonth() === currentTime.getMonth() &&
                  this.selectedDate.getFullYear() === currentTime.getFullYear();
  
  // Debugging: Log whether the selected date is today
  
  // If the selected date is today, check if the start time is in the past
  if (isToday) {
   
    // Disable if the start time is in the past
    return start.getTime() < currentTime.getTime();
  }

  // If the selected date is not today, do not disable it
  return false;
}


// Convert the 12-hour time format (e.g., "8:00am") to a Date object for comparison
convertTo24HourFormat(time: string): Date {
  const [timePart, ampm] = time.split(/(am|pm)/);
  let [hours, minutes] = timePart.split(':').map(num => parseInt(num, 10));

  
  // Adjust hours for AM/PM
  if (ampm === 'pm' && hours < 12) {
    hours += 12;
  } else if (ampm === 'am' && hours === 12) {
    hours = 0;
  }

  const now = new Date();
  now.setHours(hours, minutes, 0, 0); // Set the date object with the correct time
  return now;
}


  getAvailableDateDataOnChange(amenityId: any, date: any) {
    console.log(date);
    this.noslots = false;
    this.service.dateAvailable(amenityId, date).subscribe((res) => {
      this.datesData = res.data;
      if(res.data.length == 0){
        this.noslots = true;
      }
      
  
      // Initialize `selectedTimes` as an array of `false` for each time slot
      this.selectedTimes = Array(this.formattedTimes.length).fill(false);
  
      this.dataLoaded = true;
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
      console.log('Selected start time:', typeof this.selectedStartTime, this.selectedStartTime);
      console.log('Selected end time:', typeof this.selectedEndTime, this.selectedStartTime);

      console.log(`Selected start time: ${this.selectedStartTime}`);
      console.log(`Selected start time long: ${this.selectedStartTimelong}`);
      console.log(`Selected end time: ${this.selectedEndTime}`);
      console.log(`Selected end time long: ${this.selectedEndTimelong}`);

    } else {
      this.selectedStartTime = '';
      this.selectedEndTime = '';
    }
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
const dateObj = new Date(this.selectedStartTimelong);

// Convert back to ISO string without milliseconds
this.selectedStartTimelong = dateObj.toISOString().split('.')[0] + 'Z';
const dateObjE = new Date(this.selectedEndTimelong);

// Convert back to ISO string without milliseconds
this.selectedEndTimelong = dateObjE.toISOString().split('.')[0] + 'Z';
    }
    else{
      const dateObj = new Date(this.selectedStartTimelong);

// Convert back to ISO string without milliseconds
this.selectedStartTimelong = dateObj.toISOString().split('.')[0] + 'Z';
const dateObjE = new Date(this.selectedEndTimelong);

// Convert back to ISO string without milliseconds
this.selectedEndTimelong = dateObjE.toISOString().split('.')[0] + 'Z';
      this.selectedStartTimelong;
      this.selectedEndTimelong;
    }
    console.log({
      bookingId:this.bookingId,
      startTime:this.selectedStartTimelong,
      endTime:this.selectedEndTimelong,
    });
    this.service.EditBookedAmenity(
      {
        bookingId:this.bookingId,
        startTime:this.selectedStartTimelong,
        endTime:this.selectedEndTimelong,
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
