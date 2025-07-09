import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';


@Component({
  selector: 'app-billdetails',
  templateUrl: './billdetails.component.html',
  styleUrls: ['./billdetails.component.css']
})
export class BilldetailsComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit(): void {
  }
  back(){
    this._location.back();
  }
}
