import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, Validators, UntypedFormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../../services/api.service';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';



// Custom Native Date Adapter
export class CustomDateAdapter extends NativeDateAdapter {
  override format(date: Date, displayFormat: Object): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

// Custom date format
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: { month: 'short', year: 'numeric', day: 'numeric' }
  },
  display: {
    dateInput: 'input',
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' }
  }
};

@Component({
  selector: 'app-allocatecharges',
  templateUrl: './allocatecharges.component.html',
  styleUrls: ['./allocatecharges.component.css'],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
})
export class AllocatechargesComponent implements OnInit {

  allSelected: any;
  searchUserForm: any;
  userTypeFilters: any;
  form!: UntypedFormGroup;
  loading = false;
  matSelect: any;


  constructor(
    private service:ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
     private modalService: NgbModal, 
     private route: ActivatedRoute,
      private _location: Location) { }

  readData2:any = []; 
  readData:any = []; 
  calculateData:any = []; 
  generateData:any = []; 

  totalLength:any;
  totalhousetypeLength:any;

  page:number = 1;

  showScreen = false;
  showScreen2 = false;
  showScreen3 = false;
  masterSelected:boolean | undefined;
  checklist:any;
  checkedList:any;
  isSelected:boolean = false;
  options = [];
  selectedOptions = new UntypedFormControl();
  societyId=sessionStorage.getItem('societyId');
 showSearchBox: boolean = false;
searchText: string = '';
filteredData: any[] = [];

   

  ngOnInit(): void {
  this.getAllRentalData();
  this.getAllchargeListData();
 
  this.form = this.formBuilder.group({
    chargetListId: ['', Validators.required],
   rentalUnits: this.formBuilder.array([]),
    isRoundOff:[false],
    isPrecent:[false],
    isfine:[false],
    gracePeriod:['0'],
    fine:['0'],
    billDate:['', Validators.required],
    dueDate:['', Validators.required],
   
  }
  
  );
  
  this.selectedOptions = new UntypedFormControl([]);

  this.form.get('rentalUnits')?.valueChanges.subscribe((value: any[]) => {
    this.selectedOptions.setValue(value);
  });

  
  }

filterOptions() {
    if (!this.searchText || this.searchText.trim() === '') {
      this.filteredData = [...this.readData2];
    } else {
      const searchTerm = this.searchText.toLowerCase().trim();
      this.filteredData = this.readData2.filter((flat: any) =>
        flat.blockName?.toLowerCase().includes(searchTerm) ||
        flat.rentalUnitName?.toLowerCase().includes(searchTerm)
      );
    }
    
   
  }



  // Method to format date for display
  formatDateForDisplay(date: Date): string {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Method to handle date change
  onDateChange(controlName: string, event: any) {
    const selectedDate = new Date(event.target.value);
    console.log(`${controlName} selected:`, this.formatDateForDisplay(selectedDate));
  }
  back(){
    this._location.back();
  }
  // get rentalunitId(): FormArray {
  //   return this.options as FormArray;
  // }

  get rentalUnits(): UntypedFormArray {
    return this.form.get('rentalUnits') as UntypedFormArray;
  }

  getSelectedOptions() {
    
    this.options=this.selectedOptions.value;
    console.log(this.options);
  }
  billgeneration(){
    this.loading = true;

    this.form.value.rentalUnits=this.options;
    console.log(this.options);
    // console.log(this.form.value.rentalunitId);
    const result = window.confirm('Are you sure you want to generate this charge?');
    if (result) {
      console.log('confirmed');
    
    {
      console.log({
        chargetListId:this.form.value.chargetListId,
        rentalUnits:this.form.value.rentalUnits,
        isRoundOff:this.form.value.isRoundOff,
        billDate:this.form.value.billDate,
        societyId:this.societyId,
        dueDate:this.form.value.dueDate,
        isPrecent:this.form.value.isPrecent,
        fine:+(this.form.value.fine),
        gracePeriod:+(this.form.value.gracePeriod)
      });
      this.service.generate_bill(
        {
          chargetListId:this.form.value.chargetListId,
          rentalUnits:this.form.value.rentalUnits,
          isRoundOff:false,
          billDate:this.form.value.billDate,
          societyId:this.societyId,
          dueDate:this.form.value.dueDate,
          isPrecent:this.form.value.isPrecent,
          fine:+(this.form.value.fine),
          gracePeriod:+(this.form.value.gracePeriod)
        }
        ).subscribe((res)=>{
        console.log(res,'res==>');
        this.generateData = res.data;
       // this.totalLength = (res.data).length;
       this.loading = false;

          console.log(this.generateData);
       // this.getAllRentalData();
       this.router.navigate(['billgeneration'], {
        queryParams: { generateData: JSON.stringify(this.generateData) },
        relativeTo: this.route
      });
      this.onCancelClick();
    //  this.form.reset();

      }, (error) => {
        // Handle API errors or other issues here
        this.loading = false;
        console.error("Error during Bill Generation:", error);
        

      });
    }
  }else {

    this.loading = false;
    this.form.reset();
    this.onCancelClick();
    console.log('Delete canceled');
  }
   
    //this.router.navigate(['/billgeneration']);
  }
  onCancelClick(){
    
    this.form.reset();
    
   
  }
  saveDetails(form:any) {
    this.form.value.rentalUnits=this.options;
    console.log(this.options);
    // this.loading = true;

   // console.log(this.form.value.rentalunitId);
    
    {
      console.log(
        {
          chargetListId:this.form.value.chargetListId,
          rentalUnits:this.form.value.rentalUnits,
          isRoundOff:false,
          isPrecent:this.form.value.isPrecent,
          fine:+(this.form.value.fine)
        
        }
      );
      this.service.createallocate_charge(
        {
          chargetListId:this.form.value.chargetListId,
          rentalUnits:this.form.value.rentalUnits,
          isRoundOff:false,
          isPrecent:this.form.value.isPrecent,
          fine:+(this.form.value.fine)
        
        }).subscribe((res)=>{
        console.log(res,'res==>');
        // this.loading = false;

        this.calculateData = res.finData;
        this.totalLength = (res.finData).length;

        console.log(this.calculateData);
        //this.onCancelClick();
       // this.getAllRentalData();

      }, (error) => {
        // Handle API errors or other issues here
        // this.loading = false;
        console.error("Error during calculation:", error);
        

      });
    }
  }


  disablePastDates = (date: Date | null): boolean => {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize time
  return date >= today; // ✅ today and future dates are allowed
};

disableBeforeChargeDate = (date: Date | null): boolean => {
  if (!date) return false;
  const chargeDate = this.form.get('billDate')?.value;
  if (!chargeDate) return true; // disable until chargeDate is selected

  const selected = new Date(chargeDate);
  selected.setHours(0, 0, 0, 0);
  return date >= selected; // ✅ allow only dates on/after charge date
};


  

  getAllRentalData(){
    this.service.getrentalunitsetup().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData2 = res.data;
      this.filteredData = res.data;
      
     
    });
  }
  getAllchargeListData(){
    this.service.getChargeList().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData = res.data;
     
    });
  }
 
  
  selectAlloption() {
    this.options = this.readData2.map((flat: { flatId: any; }) => flat.flatId);
    this.selectedOptions.setValue(this.options);
    //this.rentalunitId.setValue(this.options);
    console.log(this.options);

  }
  UnselectAll() {
    this.options = [];
    this.selectedOptions.setValue(this.options);
   // this.rentalunitId.setValue(this.options);

  }
//   selectedOptions: any[]  = [];

// selectAlloption() {
//   this.selectedOptions = [...this.readData2];
// }

  togglePerOne(){ 
    if (this.allSelected.selected) {  
     this.allSelected.deselect();
     //return false;
 }
   if(this.searchUserForm.controls.userType.value.length==this.readData2.length)
     this.allSelected.select();
 
 }
   toggleAllSelection() {
     if (this.allSelected.selected) {
       this.searchUserForm.controls.userType
         .patchValue([...this.readData2.map((item: { name: any; }) => item.name), 0]);
     } else {
       this.searchUserForm.controls.userType.patchValue([]);
     }
   }
}