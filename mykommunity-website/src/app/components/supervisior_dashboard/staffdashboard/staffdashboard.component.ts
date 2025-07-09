import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staffdashboard',
  templateUrl: './staffdashboard.component.html',
  styleUrls: ['./staffdashboard.component.css']
})
export class StaffdashboardComponent implements OnInit {

  constructor(private service:ApiService,private router:Router) { }
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  getBodyClass(): string{
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768){
      styleClass = 'body-trimmed';

    }
    else if(this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0){
      styleClass = 'body-md-screen'
    }
    return styleClass;
  }
  readData2:any = [];
  readData:any = [];
  readData3:any = [];
  readData4:any = [];
  readData5:any = [];



  ngOnInit(): void {
    this.getAllUserData();
    this.getAllComplainData();
    this.getAllServiceData();
    this.getAllFlatData();
    this.getAllAmenityData();
  }


  getAllUserData(){
    this.service.getUserlist().subscribe((res)=>{
      console.log(res,"res==>");;
      this.readData = res.data;
      
    });
  }
  getAllComplainData(){
    this.service.getComplaint().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData2 = res.data;
      
    });
  }
  getAllServiceData(){
    this.service.getLocalServiceProvider().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData3 = res.data;
      
    });
  }
  getAllFlatData(){
    this.service.getFlat().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData4 = res.data;

    });
  }
  getAllAmenityData(){
    this.service.getBooking().subscribe((res)=>{
      console.log(res,"res==>");
      this.readData5 = res.data;

    });
  }
  user() {
    this.router.navigate(['/supervisor/user'])
  }
  complain(){
    this.router.navigate(['/supervisor/complain']);
  }
  services(){
    this.router.navigate(['/supervisor/localservices']);
  }
  flat(){
    this.router.navigate(['/supervisor/flat']);
  }
  Amenities(){
    this.router.navigate(['/supervisor/booking']);
  }
}
