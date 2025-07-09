import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {


 
  constructor(private service:ApiService,private router:Router) { }

  readCom:any = [];
  readCity:any = [];
  readadmin:any = [];
  readstate:any = [];


  ngOnInit(): void {
    this.getAllCom();
    this.getAllCityData();
    this.getAllState();
    this.getAllSupervisor();

  }

 getAllCom(){
      this.service.getCommunities().subscribe((res)=>{
        console.log(res,"res==>");
        this.readCom = res.data; 
      });}

getAllCityData(){
  this.service.getCities().subscribe((res)=>{
    console.log(res,"res==>");
    this.readCity = res.data;
    
  });
}
getAllState(){
  this.service.getState().subscribe((res)=>{
    console.log(res,"res==>");
    this.readstate = res.data; 
  });}

getAllSupervisor(){
this.service.getAdminList().subscribe((res)=>{
console.log(res,"res==>");
this.readadmin = res.data;

});
}



  User() {
    this.router.navigate(['/admin/society-supervisor'])
  }
  Community() {
    this.router.navigate(['/admin/community'])
  }
  City() {
    this.router.navigate(['/admin/city'])
  }
  State() {
    this.router.navigate(['/admin/state'])
  }

}
