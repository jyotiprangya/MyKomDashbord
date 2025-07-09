import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-entry-exit-record',
  templateUrl: './entry-exit-record.component.html',
  styleUrls: ['./entry-exit-record.component.css']
})
export class EntryExitRecordComponent {
  constructor(
    private _location: Location,
    private router: Router ) { }

    back(){
      this._location.back();
    }
  

    visitor() {
      this.router.navigate(['/supervisor/visitorentryexit'])
    }
    dailyhelp() {
      this.router.navigate(['/supervisor/dailyhelpentryexit'])
    }
    societyStaff(){
      this.router.navigate(['/supervisor/society-dailyhelp-entry-exit-record']);
    }
   
}
