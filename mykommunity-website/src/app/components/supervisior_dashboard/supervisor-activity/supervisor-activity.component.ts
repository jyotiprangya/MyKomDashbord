import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-supervisor-activity',
  templateUrl: './supervisor-activity.component.html',
  styleUrls: ['./supervisor-activity.component.css']
})
export class SupervisorActivityComponent implements OnInit {
  closeResult: any;
  form:any= UntypedFormGroup;
  constructor(private service:ApiService,private fb: UntypedFormBuilder, private _location: Location) { }

  totalLength:any;
  page:number = 1;
  readData:any = [];
  readData2:any = [];
  getparamid:any;
  showImage = false;
  showparcelImage = false;
  searchActivity:any = "";
  filteredData:any = []; // Data to be displayed in the table
  categories = [
    'SOS', 
    'Vehicle', 
    'Complaint',
    'SocietyStaff',
    'EmergencyCategory',
    'EmergencyContacts',
    'DailyHelp_category',
    'DailyHelp',
    'RentalUnit',
    'Gate',
    'Floor',
    'Block',
    'Resident',
    'Notice',
    'Amenity',
    'ComplaintCategory',
    'Society',
    'SecurityGuard',
  'QR']; // List of categories
  selectedCategory = '';
 

  ngOnInit(): void {
   this.getAllData();



}

getAllData(){
  
  this.service.getSupervisorActivitylist().subscribe((res)=>{
    console.log(res,"res==>");
    this.readData = res.data;
    
    this.readData.sort((a:any, b:any) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    this.filteredData = this.readData;
    this.totalLength = (res.data).length;
    console.log(this.filteredData);
  });
}

filterByCategory() {
  if (this.selectedCategory) {
    // Filter the data based on the selected category
    this.filteredData = this.readData.filter((us: { category: any; }) => us.category === this.selectedCategory);
  } else {
    // If no category is selected, show all data
    this.filteredData = this.readData;
  }
  this.totalLength = this.filteredData.length; // Update total items count
}


back(){
  this._location.back();
}


 




}

