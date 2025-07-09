import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-community-setup',
  templateUrl: './community-setup.component.html',
  styleUrls: ['./community-setup.component.css']
})
export class CommunitySetupComponent {


  constructor(
    private _location: Location,
    private router: Router ) { }

    back(){
      this._location.back();
    }
  

    block() {
      this.router.navigate(['/supervisor/block'])
    }
    society() {
      this.router.navigate(['/supervisor/society-setup'])
    }
    floor(){
      this.router.navigate(['/supervisor/floor']);
    }
    flat(){
      this.router.navigate(['/supervisor/flat']);
    }
    gate(){
      this.router.navigate(['/supervisor/gate']);
    }
    housetype(){
      this.router.navigate(['/supervisor/housetype']);
    }

    amenityTpe(){
      this.router.navigate(['/supervisor/amenity']);
    }
    complaintCategory(){
      this.router.navigate(['/supervisor/complainCategory']);
    }
    emergencyCategory(){
      this.router.navigate(['/supervisor/emergencyCategory']);
    }
    emergencyDail(){
      this.router.navigate(['/supervisor/emergency']);
    }
    sosCategory(){
      this.router.navigate(['/supervisor/sos']);
    }
    dailyhelpCategory(){
      this.router.navigate(['/supervisor/servicecategory']);
    }
    qrcode(){
      this.router.navigate(['/supervisor/qrcode']);
    }
    shift(){
      this.router.navigate(['/supervisor/shift-setup']);
    } 
    shiftAssignment(){
      this.router.navigate(['/supervisor/shift-assignment-setup']);
    }
    qrcodeScan(){
      this.router.navigate(['/supervisor/qrcode-status']);
    }
}
