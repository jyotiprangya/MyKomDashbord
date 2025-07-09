import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable , of } from "rxjs";
import {  tap, delay } from "rxjs/operators"

@Injectable({
    providedIn: 'root'
})


export class StaffService
{

/*
    isUserLoggedIn2: boolean = false;
    Stafflogin(Email: string, password: string ): Observable<Boolean> {
      console.log(Email);
      console.log(password);
      this.isUserLoggedIn2 = Email == 'staff@mohrisa.com' && password == 'risamohStafF';
      localStorage.setItem('isUserLoggedIn2', this.isUserLoggedIn2 ? "true" : "false"); 
    

 return of(this.isUserLoggedIn2).pipe(
    delay(1000),
    tap(val => { 
       console.log("Is User Authentication is successful: " + val); 
    })
 );
 
   }

   
 

*/

 constructor() { }
}