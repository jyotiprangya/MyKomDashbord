import { AbstractType, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, catchError, from, switchMap, throwError } from "rxjs";
import { AngularFireAuth } from "@angular/fire/compat/auth";


@Injectable({
    providedIn: 'root'
})


export class ApiService
{
  [x: string]: any;
    get: any;
   set : any;
   User:any;
   societyId:any;
  
    constructor( private _http:HttpClient ,  public afAuth: AngularFireAuth){ }
   //  devapiurl = "http://3.111.99.46:3000/api/v1/";
  // prodapiurl = "https://prodapi.mykommunity.in:3003/api/v1/";
//apiurl = "http://3.111.99.46:3000/api/v1/";
apiurl = "https://prodapi.mykommunity.in:3003/api/v1/";

    login = `${this.apiurl}auth/email`;
    
    loginAdmin(data: any): Observable<any> {
        return from(this.afAuth.signInWithEmailAndPassword(data.email, data.password))
          .pipe(
            switchMap(() => {
              // Handle successful login here (if needed)
              // Then make the HTTP POST request
              return this._http.post(`${this.login}`, data).pipe(
                catchError(apiError => {
                    alert('Invalid Credentials....');
                  // Handle API response error here
                  // If there's an error, you may choose to log it or take other actions
                  // This will prevent user creation if the API response results in an error
                  return throwError(apiError);
                })
              );
            }),
            catchError(error => {
              if (error.code === 'auth/user-not-found') {
                // If the user doesn't exist, create a new user
                return from(this.afAuth.createUserWithEmailAndPassword(data.email, data.password))
                  .pipe(
                    switchMap(() => {
                      // Handle successful user creation here (if needed)
                      // You can also log the user in here if you want
                      return this._http.post(`${this.login}`, data);
                    }),
                    catchError(userCreationError => {
                      // Handle user creation error here
                      // If there's an error, you may choose to log it or take other actions
                      // This will prevent user creation if it fails
                      return throwError(userCreationError);
                    })
                  );
              } else {
                // If some other error occurred during login, propagate the error
                return throwError(error);
              }
            })
          );
      }
//        loginAdmin(data: any): Observable<any> {
//     return this._http.post(`${this.login}`, data).pipe(
//       switchMap(() => {
//         return from(this.afAuth.signInWithEmailAndPassword(data.email, data.password)).pipe(
//           catchError(apiError => {
//             alert('Invalid Credentials....');
//             return throwError(apiError);
//           })
//         );
//       }),
//       catchError(apiError => {
//         if (apiError.status === 401) {
//           return from(this.afAuth.createUserWithEmailAndPassword(data.email, data.password)).pipe(
//             switchMap(() => {
//               return this._http.post(`${this.login}`, data);
//             }),
//             catchError(userCreationError => {
//               return throwError(userCreationError);
//             })
//           );
//         } else {
//           return throwError(apiError);
//         }
//       })
//     );
//   }

      forgotPassword = `${this.apiurl}auth/forgot-password`;

      forgotpass(data:any):Observable<any>
      {
        return from(this.afAuth.sendPasswordResetEmail(data.email)).pipe(
            switchMap(() => {
                // After successfully sending the reset email with Firebase, proceed with your API call
                return this._http.post(`${this.forgotPassword}`, data).pipe(
                    catchError(apiError => {
                        // Handle errors from your API here
                        return throwError(apiError);
                    })
                );
            }),
            catchError(firebaseError => {
                // Handle errors from Firebase here
                return throwError(firebaseError);
            })
        );
        
        //   return this._http.post(`${this.forgotPassword}`,data);
      }
      resetPassword = `${this.apiurl}auth/reset-password`;

      resetPass(data:any):Observable<any>
      {
          return this._http.post(`${this.resetPassword}`,data);
      }


    stateGetCreate = `${this.apiurl}state/`;
    getState():Observable<any>
    {
        return this._http.get(`${this.stateGetCreate}`);
        
    }

    createState(data:any):Observable<any>
    {
        return this._http.post(`${this.stateGetCreate}`,data);
    }
    stateUpdation = `${this.apiurl}state/update`;
    updateState(data:any):Observable<any>
    {
        return this._http.post(`${this.stateUpdation}`,data);
    }


    stateDisable = `${this.apiurl}state/disable`;
    disableState(data:any):Observable<any>
    {
        return this._http.post(`${this.stateDisable}`,data);
    }

    stateEnable = `${this.apiurl}state/enable`;
    enableState(data:any):Observable<any>
    {
        return this._http.post(`${this.stateEnable}`,data);
    }
    getunregRU():Observable<any>
    {
        return this._http.get(`${this.apiurl}rental-unit/membership/unregisteredRentalunit`);
        
    }
    cityList = `${this.apiurl}city/list`;
    getCities():Observable<any>
    {
        return this._http.get(`${this.cityList}`);
        
    }

    cityCreation=`${this.apiurl}city/`;
    createCity(data:any):Observable<any>
    {
        return this._http.post(`${this.cityCreation}`,data);
    }
    updateCity(data:any):Observable<any>
    {
        return this._http.post(`${this.cityCreation}update`,data);
    }


    communityList = `${this.apiurl}society/list`;
    getCommunities():Observable<any>
    {
        return this._http.get(`${this.communityList}`);
        
    }
              //Create Scoiety//
    
     societyCreation = `${this.apiurl}society/`;
    createSociety(data:any):Observable<any>
    {
        return this._http.post(`${this.societyCreation}`,data);
    }
    createSocietyStaff(data:any):Observable<any>
    {
        return this._http.post(`${this.societyCreation}add-staff`,data);
    }
    getstafflist():Observable<any>
    {
        
        return this._http.get(`${this.societyCreation}staff-list`);
        
    }
    updateSociety(data:any):Observable<any>
    {
        return this._http.post(`${this.societyCreation}update`,data);
    }
              
                ads=`${this.apiurl}advertisement`;
                getAds():Observable<any>
                {
               return this._http.get(`${this.ads}/admin`);
}
                createAd(data:any):Observable<any>
                {
                    return this._http.post(`${this.ads}`,data);
                }
                updateAd(data:any):Observable<any>
                {
                    return this._http.patch(`${this.ads}`,data);
                }
                deleteAd(data: any): Observable<any> {
                    return this._http.delete(`${this.ads}`, { body: data });
                }
                          

    Block = `${this.apiurl}block`;
    getBlock():Observable<any>
    {
    this.societyId= sessionStorage.getItem('societyId');

        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(this.Block,{params:param});
        
    }

    createBlock(data:any):Observable<any>
    {
        return this._http.post(`${this.Block}`,data);
    }
    BlockUpdate = `${this.apiurl}block/update`;

    updateBlock(data:any):Observable<any>
    {
        return this._http.post(`${this.Block}/update`,data);
    }
    disableBlock(data:any):Observable<any>
    {
        return this._http.post(`${this.Block}/disable`,data);
    }

    removeBlock(data:any):Observable<any>
    {
        return this._http.post(`${this.Block}/disable`,data);
    }

    restoreBlock(data:any):Observable<any>
    {
        return this._http.post(`${this.Block}/enable`,data);
    }
    
    enableBlock(data:any):Observable<any>
    {
        return this._http.post(`${this.Block}/enable`,data);
    }


    Floor = `${this.apiurl}floor`;
    FloorOfSociety = `${this.apiurl}floor/find-by-society`;
    getFloor():Observable<any>
    {
    this.societyId= sessionStorage.getItem('societyId');

        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(this.FloorOfSociety,{params:param});
        
    }
    createFloor(data:any):Observable<any>
    {
        return this._http.post(`${this.Floor}`,data);
    }

    updateFloor(data:any):Observable<any>
    {
        return this._http.post(`${this.Floor}/update`,data);
    }
    removeFloor(data:any):Observable<any>
    {
        return this._http.post(`${this.Floor}/disable`,data);
    }
    restoreFloor(data:any):Observable<any>
    {
        return this._http.post(`${this.Floor}/enable`,data);
    }
    disableFloor(data:any):Observable<any>
    {
        return this._http.post(`${this.Floor}/disable`,data);
    }
    enableFloor(data:any):Observable<any>
    {
        return this._http.post(`${this.Floor}/enable`,data);
    }
  

RentalUnit = `${this.apiurl}rental-unit`;
RentalUnittype = `${this.apiurl}rental-unit/rental-unit-types`;

FlatOfSociety = `${this.apiurl}rental-unit/find-by-society`;
getFlat():Observable<any>
{
this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('societyId',this.societyId);
    return this._http.get(this.FlatOfSociety,{params:param});
    
}
getremoveFlat():Observable<any>
{
this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('societyId',this.societyId);
    return this._http.get(`${this.RentalUnit}/removed-list`,{params:param});
    
}
getFlatType():Observable<any>
{
this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('societyId',this.societyId);
    return this._http.get(this.RentalUnittype,{params:param});
    
}
SocietyDetails = `${this.apiurl}society`;
getSocietyDetails():Observable<any>
{
this.societyId= sessionStorage.getItem('societyId');

    return this._http.get(`${this.SocietyDetails}/${this.societyId}`);
    
}
createFlat(data:any):Observable<any>
{
    return this._http.post(`${this.RentalUnit}/`,data);
}

updateFlat(data:any):Observable<any>
{
    return this._http.post(`${this.RentalUnit}/update`,data);
}

disableFlat(data:any):Observable<any>
{
    return this._http.post(`${this.RentalUnit}/disable`,data);
}
enableFlat(data:any):Observable<any>
{
    return this._http.post(`${this.RentalUnit}/enable`,data);
}


    staffCreation=`${this.apiurl}super-admin/add-staff`;
    createStaff(data:any):Observable<any>
    {
        return this._http.post(`${this.staffCreation}`,data);
    }
allAdminList =`${this.apiurl}super-admin/list`;
getAdminList():Observable<any>
    {
        return this._http.get(`${this.allAdminList}`);
        
    }
    SupervisorActivity = `${this.apiurl}user/supervisor-activity`;
    getSupervisorActivitylist():Observable<any>
    {
    
        return this._http.get(this.SupervisorActivity);
        
    }
    Resident = `${this.apiurl}user/residents`;
    getUserlist():Observable<any>
    {
    this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(this.Resident,{params:param});
        
    }
    ResidentDirectory = `${this.apiurl}user/resident-directory`;
    getRDlist():Observable<any>
    {
        return this._http.get(this.ResidentDirectory);
        
    }
    UpdateResident = `${this.apiurl}user/resident`;
    updateResidentDetail(data:any):Observable<any>
    {
        return this._http.patch(`${this.UpdateResident}`,data);
    }
    UpdateResidentinBulk = `${this.apiurl}user/resident-bulk`;
    updateResidentType(data:any):Observable<any>
    {
        return this._http.patch(`${this.UpdateResidentinBulk}`,data);
    }
    createResident = `${this.apiurl}rental-unit/membership/add-resident`;
    addResident(data:any):Observable<any>
    {
        return this._http.post(`${this.createResident}`,data);
    }

    Approved_Resident = `${this.apiurl}user/residents-approved`;
    getapprovedUserlist():Observable<any>
    {
    this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(this.Approved_Resident,{params:param});
        
    }
    Pending_Resident = `${this.apiurl}user/residents-pending`;
    getpendingUserlist():Observable<any>
    {
    this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(this.Pending_Resident,{params:param});
        
    }
    Rejected_Resident = `${this.apiurl}user/residents-rejected`;
    getrejectUserlist():Observable<any>
    {
    this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(this.Rejected_Resident,{params:param});
        
    }
    ResidentApproval = `${this.apiurl}rental-unit/membership`;
   
    pendingApproval(data:any):Observable<any>
    {
        return this._http.post(`${this.ResidentApproval}/approve`,data);
    }
    inactiveUser(data:any):Observable<any>
    {
        return this._http.post(`${this.ResidentApproval}/inactive`,data);
    }

    EmergencyContact = `${this.apiurl}emergency-contact`;
    getEmergencyContact():Observable<any>
    {
    this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(this.EmergencyContact,{params:param});
        
    }
   
    createEmergencyContact(data:any):Observable<any>
    {
        return this._http.post(`${this.EmergencyContact}`,data);
    }

    updateEmergencyContact(data:any):Observable<any>
    {
        return this._http.patch(`${this.EmergencyContact}/`,data);
    }
    deleteEmergencyContact(data:any):Observable<any>
    {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: data
          };
        return this._http.delete(`${this.EmergencyContact}/`,httpOptions);
        // return this._http.delete(`${this.EmergencyContact}/`,data);
    }

    EmergencyCategory = `${this.apiurl}emergency-contact/category`;
    getEmergencyCategory():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(`${this.EmergencyCategory}`,{params:param});
        
    }

    getRemovedEmergencyCategory():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(`${this.apiurl}emergency-contact/removed-category`,{params:param});
        
    }
   
    createEmergencyCategory(data:any):Observable<any>
    {
        return this._http.post(`${this.EmergencyCategory}`,data);
    }
    updateEmergencyCategory(data:any):Observable<any>
    {
        return this._http.patch(`${this.EmergencyCategory}`,data);
    }
    removeEmergencyCategory(data:any):Observable<any>
    {
        return this._http.post(`${this.apiurl}emergency-contact/disable`,data);
    }
    restoreEmergencyCategory(data:any):Observable<any>
    {
        return this._http.post(`${this.apiurl}emergency-contact/enable`,data);
    }
   
    LocalServiceCategory = `${this.apiurl}local-service`;
    getLocalServiceCategory():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(`${this.LocalServiceCategory}`,{params:param});
        
    }

    getRemovedLocalServiceCategory():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(`${this.LocalServiceCategory}/removed-list`,{params:param});
        
    }
   
    createServiceCategory(data:any):Observable<any>
    {
        return this._http.post(`${this.LocalServiceCategory}`,data);
    }

    updateServiceCategory(data:any):Observable<any>
    {
        return this._http.patch(`${this.LocalServiceCategory}`,data);
    }
    removeServiceCategory(data:any):Observable<any>
    {
        return this._http.post(`${this.LocalServiceCategory}/disable`,data);
    }
    restoreServiceCategory(data:any):Observable<any>
    {
        return this._http.post(`${this.LocalServiceCategory}/enable`,data);
    }

    LocalServiceProvider = `${this.apiurl}local-service-provider`;
    getLocalServiceProvider():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(this.LocalServiceProvider,{params:param});        
    }
    getRemovedLocalServiceProvider():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(`${this.LocalServiceProvider}/removed-list`,{params:param});        
    }
    getLocalServiceProviderbyid(id:any):Observable<any>
    {
        return this._http.get(`${this.LocalServiceProvider}/${id}`);
 
    }
   
    createServiceProvider(data:any):Observable<any>
    {
        return this._http.post(`${this.LocalServiceProvider}`,data);
    }
    removeServiceProvider(data:any):Observable<any>
    {
        return this._http.post(`${this.LocalServiceProvider}/disable`,data);
    }
    restoreServiceProvider(data:any):Observable<any>
    {
        return this._http.post(`${this.LocalServiceProvider}/enable`,data);
    }
    updateServiceProvider(data:any):Observable<any>
    {
        return this._http.patch(`${this.LocalServiceProvider}`,data);
    }
    getLocalServiceProviderEntryExitRecord():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(`${this.LocalServiceProvider}/entry-exit-record-3`,{params:param});        
    }
    DailyHelpProvider = `${this.apiurl}society-dailyHelp`;
    getSocietydailyHelpProvider():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(this.DailyHelpProvider,{params:param});        
    }
    getRemovedSocietydailyHelpProvider():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(`${this.DailyHelpProvider}/past-member`,{params:param});        
    }
   
    createSocietyDailyHelpProvider(data:any):Observable<any>
    {
        return this._http.post(`${this.DailyHelpProvider}`,data);
    }
    removeSocietyDailyHelpProvider(data:any):Observable<any>
    {
        return this._http.post(`${this.DailyHelpProvider}/disable`,data);
    }
    restoreSocietyDailyHelpProvider(data:any):Observable<any>
    {
        return this._http.post(`${this.DailyHelpProvider}/enable`,data);
    }
    updateSocietyDailyHelpProvider(data:any):Observable<any>
    {
        return this._http.patch(`${this.DailyHelpProvider}`,data);
    }
    getSocietyDailyHelpProviderEntryExitRecord():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(`${this.DailyHelpProvider}/entry-exit-record-3`,{params:param});        
    }

    Notice = `${this.apiurl}notice/`;
    getNotice():Observable<any>
    {
        return this._http.get(`${this.Notice}`);
 
    }
   
    createNotice(data:any):Observable<any>
    {
        return this._http.post(`${this.Notice}`,data);
    }

    updateNotice(data:any):Observable<any>
    {
       
      
        return this._http.patch(`${this.Notice}`,data);
    }
    deleteNotice(data:any):Observable<any>
    {

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: data
          };
        return this._http.delete(`${this.Notice}`,httpOptions);
    }

    Vehicle = `${this.apiurl}rental-unit/vehicle`;
    getVehiclelist():Observable<any>
    {
        return this._http.get(`${this.Vehicle}/admin`);
 
    }
   
    updateVehicle(data:any):Observable<any>
    {
       
      
        return this._http.patch(`${this.Vehicle}/update/admin`,data);
    }
    deleteVehicle(data:any):Observable<any>
    {

        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
            body: data
          };
        return this._http.delete(`${this.Vehicle}`,httpOptions);
    }

    Complain = `${this.apiurl}complaint/admin`;
    getComplaint():Observable<any>
    {
        return this._http.get(`${this.Complain}`);
 
    }
    getComplaintResolved():Observable<any>
    {
    
        let param = new HttpParams().set('status','RESOLVED');
        return this._http.get(`${this.Complain}`,{params:param});        
    }
   
    getComplaintIn_progress():Observable<any>
    {
    
        let param = new HttpParams().set('status','IN_PROGRESS');
        return this._http.get(`${this.Complain}`,{params:param});        
    }
    getComplaintRe_opened():Observable<any>
    {
    
        let param = new HttpParams().set('status','RE_OPENED');
        return this._http.get(`${this.Complain}`,{params:param});        
    }
    getComplaintOn_hold():Observable<any>
    {
    
        let param = new HttpParams().set('status','ON_HOLD');
        return this._http.get(`${this.Complain}`,{params:param});        
    }
    getComplaintNew():Observable<any>
    {
    
        let param = new HttpParams().set('status','NEW');
        return this._http.get(`${this.Complain}`,{params:param});        
    }

    changecomplaintsts(data:any):Observable<any>
    {
        return this._http.patch(`${this.Complainbyid}`,data);
    }

    Complainbyid = `${this.apiurl}complaint/`;
    getComplaintbyid(id:any):Observable<any>
    {
        return this._http.get(`${this.Complainbyid}${id}`);
 
    }
    createComplaintcomment(data:any):Observable<any>
    {
        return this._http.post(`${this.Complainbyid}comment`,data);
    }
   // http://3.111.99.46:3000/api/v1/complaint/comment
  
    ComplainCategory = `${this.apiurl}complaint/category`;
    getComplaintCategory():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
        let param = new HttpParams().set('societyId',this.societyId);
        
        return this._http.get(`${this.ComplainCategory}`,{params:param});
 
    }
    getRemovedComplaintCategory():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
        let param = new HttpParams().set('societyId',this.societyId);
        
        return this._http.get(`${this.apiurl}complaint/removed-category`,{params:param});
 
    }
    createComplaintCategory(data:any):Observable<any>
    {
        return this._http.post(`${this.ComplainCategory}`,data);
    }

    updateComplaintCategory(data:any):Observable<any>
    {
        return this._http.patch(`${this.ComplainCategory}`, data);
    }
    removeComplaintCategory(data:any):Observable<any>
    {
        return this._http.post(`${this. apiurl}complaint/disable`, data);
    }
    restoreComplaintCategory(data:any):Observable<any>
    {
        return this._http.post(`${this. apiurl}complaint/enable`, data);
    }

    Gate = `${this.apiurl}society/gate`;
    getGate():Observable<any>
    {
        return this._http.get(`${this.Gate}`);
        
    }
    createGate(data:any):Observable<any>
    {
        return this._http.post(`${this.Gate}`,data);
    }

    removedGate(data:any):Observable<any>
    {
        return this._http.post(`${this.Gate}/disable`,data);
    }

    restoredGate(data:any):Observable<any>
    {
        return this._http.post(`${this.Gate}/enable`,data);
    }

    updateGate(data:any):Observable<any>
    {
        return this._http.patch(`${this.Gate}`, data);
    }

    Security = `${this.apiurl}society/security`;
    getSecurity():Observable<any>
    {
        return this._http.get(`${this.Security}`);
        
    }

    createSecurity(data:any):Observable<any>
    {
        return this._http.post(`${this.Security}`,data);
    }
    updateSecurity(data:any):Observable<any>
    {
        return this._http.patch(`${this.Security}`,data);
    }
    inactiveSecurity(data:any):Observable<any>
    {
        return this._http.post(`${this.Security}/inactive`,data);
    }

    ShiftAssign = `${this.apiurl}society/security/shift-assignment`;
    getShiftAssignments(): Observable<any> {
        return this._http.get(`${this.ShiftAssign}`);
      }

      createAssign(assignmentData: any): Observable<any> {
        return this._http.post(`${this. ShiftAssign}`, assignmentData);
      }

      updateAssignment(updatedAssignment: any) {
        return this._http.patch(`${this. ShiftAssign}`, updatedAssignment);
      }
      checkinOut(assignmentData: any): Observable<any> {
        return this._http.post(`${this. ShiftAssign}/checkin-out-admin-update`, assignmentData);
      }
      checkinOutInBulk(assignmentData: any): Observable<any> {
        return this._http.post(`${this. ShiftAssign}/checkin-out-admin-bulk-update`, assignmentData);
      }


    SecurityAssign = `${this.apiurl}society/security/shift`;
    getSecurityShifts(): Observable<any> {
        return this._http.get(`${this. SecurityAssign}`);
      }

      createShift(shiftData: any): Observable<any> {
        return this._http.post(`${this.SecurityAssign}`, shiftData);
      }
      inactiveShift(shiftData: any): Observable<any> {
        return this._http.post(`${this.SecurityAssign}/inactive`, shiftData);
      }
      removeShift(shiftData: any): Observable<any> {
        return this._http.post(`${this.SecurityAssign}/inactive`, shiftData);
      }

      restoreShift(shiftData: any): Observable<any> {
        return this._http.post(`${this.SecurityAssign}/inactive`, shiftData);
      }

    Sos = `${this.apiurl}sos/types`;
    getSos():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(`${this.Sos}`,{params:param});
        
    }

    getRemovedSos():Observable<any>
    {
        this.societyId= sessionStorage.getItem('societyId');
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(`${this.apiurl}sos/removed-types`,{params:param});
        
    }
    createSos(data:any):Observable<any>
    {
        return this._http.post(`${this.Sos}`,data);
    }
    updateSos(data:any):Observable<any>
    {
        return this._http.patch(`${this.Sos}`,data);
    }
    removeSos(data:any):Observable<any>
    {
        return this._http.post(`${this.apiurl}sos/disable`,data);
    }
    restoreSos(data:any):Observable<any>
    {
        return this._http.post(`${this.apiurl}sos/enable`,data);
    }
    //http://3.111.99.46:3000/api/v1/sos/society-admin
    SosDtails = `${this.apiurl}sos/society-admin`;
    getSosDetails():Observable<any>
    {
        return this._http.get(`${this.SosDtails}`);   
    }
    Activity = `${this.apiurl}visitor`;
    getActivity():Observable<any>
    {
       // return this._http.get(`${this.Activity}/activity-society`);
        this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(`${this.Activity}/activity-society`,{params:param}); 
    }
    getPending_approval():Observable<any>
    {
        return this._http.get(`${this.Activity}/pending-approval`);
        
    }
    getParcel_at_gate():Observable<any>
    {
        return this._http.get(`${this.Activity}/parcel-at-gate`);
        
    }
    visitor_pending_approval = `${this.apiurl}visitor/inside-building`;

    Visitor_Inside_building():Observable<any>
    {

        this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(this.visitor_pending_approval,{params:param}); 
        
    }
    getVisitorEntryExitRecord():Observable<any>
    {
       // return this._http.get(`${this.Activity}/activity-society`);
        this.societyId= sessionStorage.getItem('societyId');
    
        let param = new HttpParams().set('societyId',this.societyId);
        return this._http.get(`${this.Activity}/entry-exit-history`,{params:param}); 
    }

    getVisitorEntryExitRecordwithFilter(startdate: string, enddate: string): Observable<any> {
        this.societyId = sessionStorage.getItem('societyId');
    
        let params = new HttpParams()
            .set('societyId', this.societyId)
            .set('startDate', startdate)
            .set('endDate', enddate);
    
        return this._http.get(`${this.Activity}/entry-exit-history`, { params: params });
    }

  
    

    Amenity = `${this.apiurl}amenity`;
    getAmenity():Observable<any>
    {
        return this._http.get(`${this.Amenity}/admin`);
        
    }
    checkSlots(id:any):Observable<any>
    {
        
        return this._http.get(`${this.Amenity}/check-slots?amenityId=${id}`);
        
    }
    dateAvailable(id:any,date:any):Observable<any>
    {
        
        return this._http.get(`${this.Amenity}/check-monthly-availability?amenityId=${id}&date=${date}`);
        
    }
    createAmenity(data:any):Observable<any>
    {
        return this._http.post(`${this.Amenity}`,data);
    }
    updateAmenity(data:any):Observable<any>
    {
        return this._http.patch(`${this.Amenity}`,data);
    }
    removeAmenity(data:any):Observable<any>
    {
        return this._http.patch(`${this.Amenity}/toggle`,data);
    }
    restoreAmenity(data:any):Observable<any>
    {
        return this._http.patch(`${this.Amenity}/toggle`,data);
    }
    BookAmenity(data:any):Observable<any>
    {
        return this._http.post(`${this.Amenity}/book/admin`,data);
    }
    EditBookedAmenity(data:any):Observable<any>
    {
        return this._http.post(`${this.Amenity}/book/edit`,data);
    }
    CancelAmenityBooking(data:any):Observable<any>
    {
        return this._http.post(`${this.Amenity}/cancel/admin`,data);
    }
    getBooking():Observable<any>
    {
        return this._http.get(`${this.Amenity}/bookings/admin`);
        
    }
    getCancelledBooking():Observable<any>
    {
        return this._http.get(`${this.Amenity}/bookings/admin?status=CANCELLED`);
        
    }
    getBookedBooking():Observable<any>
    {
        return this._http.get(`${this.Amenity}/bookings/admin?status=BOOKED`);
        
    }


    
    qrcode = `${this.apiurl}qrcode`;
    
    getQRCodeRecord():Observable<any>
    {
        return this._http.get(`${this.qrcode}/scan-record`);
        
    }
    getQRScanCodeRecord():Observable<any>
    {
        return this._http.get(`${this.qrcode}/scanned-record`);
        
    }
    createQRCode(data:any):Observable<any>
    {
        return this._http.post(`${this.qrcode}/generate`,data);
    }

    
    
    Vendor = `${this.apiurl}visitor/vendor`;
    getVendor():Observable<any>
    {
        return this._http.get(`${this.Vendor}/all`);
        
    }
    createVendor(data:any):Observable<any>
    {
        return this._http.post(`${this.Vendor}`,data);
    }
    deleteVendor(vendorId:any):Observable<any>
    {
        
        return this._http.delete(`${this.Vendor}`);
    }
  

//payment api 
Rentalunitsetup = `${this.apiurl}rental-setup`;
getrentalunitsetup():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('socityId',this.societyId);
    return this._http.get(this.Rentalunitsetup,{params:param});
    // return this._http.get(`${this.Rentalunitsetup}`);
    
}
createRentalunitsetup(data:any):Observable<any>
{
    return this._http.post(`${this.Rentalunitsetup}`,data);
}
updateRentalunitsetup(data:any):Observable<any>
{
    return this._http.put(`${this.Rentalunitsetup}`,data);
}

SocietyAccount = `${this.apiurl}accounts`;
getSocietyAccount():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

        let param = new HttpParams().set('socityId',this.societyId);
        return this._http.get(this.SocietyAccount,{params:param});
    // return this._http.get(`${this.SocietyAccount}`);
    
}
createSocietyAccount(data:any):Observable<any>
{
    return this._http.post(`${this.SocietyAccount}`,data);
}
createStakeHolder(data:any):Observable<any>
{
    return this._http.post(`${this.SocietyAccount}/createStakeHolder`,data);
}
addAccntDetailsToRazorpay(data:any):Observable<any>
{
    return this._http.post(`${this.SocietyAccount}/addAccountDetails`,data);
}
updateSocietyAccount(data:any):Observable<any>
{
    return this._http.put(`${this.SocietyAccount}`,data);
}
disableSocietyAccount(data:any):Observable<any>
{
    return this._http.post(`${this.SocietyAccount}/disable`,data);
}

enableSocietyAccount(data:any):Observable<any>
{
    return this._http.post(`${this.SocietyAccount}/enable`,data);
}
GeneralLedger = `${this.apiurl}general-ledger`;
getGeneralLedger():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

        let param = new HttpParams().set('socityId',this.societyId);
        return this._http.get(this.GeneralLedger,{params:param});
    // return this._http.get(`${this.GeneralLedger}`);
    
}
createGeneralLedger(data:any):Observable<any>
{
    return this._http.post(`${this.GeneralLedger}`,data);
}
updateGeneralLedger(data:any):Observable<any>
{
    return this._http.put(`${this.GeneralLedger}`,data);
}
disableGeneralLedger(data:any):Observable<any>
{
    return this._http.patch(`${this.GeneralLedger}/disable`,data);
}

enableGeneralLedger(data:any):Observable<any>
{
    return this._http.patch(`${this.GeneralLedger}/enable`,data);
}
ChartOfAccount = `${this.apiurl}chart-of-account`;
getChartOfAccount():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('socityId',this.societyId);
    return this._http.get(this.ChartOfAccount,{params:param});
    // return this._http.get(`${this.ChartOfAccount}`);
    
}
createChartOfAccount(data:any):Observable<any>
{
    return this._http.post(`${this.ChartOfAccount}`,data);
}
updateChartOfAccount(data:any):Observable<any>
{
    return this._http.put(`${this.ChartOfAccount}`,data);
}

Payment_vendor = `${this.apiurl}vendors`;
getPayment_vendor():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('socityId',this.societyId);
    return this._http.get(this.Payment_vendor,{params:param});
    // return this._http.get(`${this.Payment_vendor}`);
    
}
createPayment_vendor(data:any):Observable<any>
{
    return this._http.post(`${this.Payment_vendor}`,data);
}
updatePayment_vendor(data:any):Observable<any>
{
    return this._http.put(`${this.Payment_vendor}`,data);
}
disablePayment_vendor(data:any):Observable<any>
{
    return this._http.post(`${this.Payment_vendor}/disable`,data);
}

enablePayment_vendor(data:any):Observable<any>
{
    return this._http.post(`${this.Payment_vendor}/enable`,data);
}

getPayment_vendor_booking():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('societyId',this.societyId);
    return this._http.get(`${this.Payment_vendor}/booking`,{params:param});
   // return this._http.get(`${this.Payment_vendor}/booking`);
    
}
getPayment_vendor_booking_report(params: any): Observable<any> {
    // Convert parameters to HttpParams
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        httpParams = httpParams.append(key, params[key]);
      }
    }

    return this._http.get(`${this.Payment_vendor}/booking`, { params: httpParams });
  }
createPayment_vendor_booking(data:any):Observable<any>
{
    return this._http.post(`${this.Payment_vendor}/booking`,data);
}
updatePayment_vendor_booking(data:any):Observable<any>
{
    return this._http.put(`${this.Payment_vendor}/booking`,data);
}
disablePayment_vendor_booking(data:any):Observable<any>
{
    return this._http.post(`${this.Payment_vendor}/booking/disable`,data);
}

enablePayment_vendor_booking(data:any):Observable<any>
{
    return this._http.post(`${this.Payment_vendor}/booking/enable`,data);
}
cash_cheque_transfer = `${this.apiurl}transaction-details`;
getcash_cheque_transfer():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('societyId',this.societyId);
    return this._http.get(this.cash_cheque_transfer,{params:param});
  //  return this._http.get(`${this.cash_cheque_transfer}`);
    
}

getcash_transfer():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('societyId',this.societyId);
    return this._http.get(`${this.cash_cheque_transfer}/cash`,{params:param});    
}
getcheque_transfer():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('societyId',this.societyId);
    return this._http.get(`${this.cash_cheque_transfer}/cheque`,{params:param});    
}
createcash_cheque_transfer(data:any):Observable<any>
{
    return this._http.post(`${this.cash_cheque_transfer}`,data);
}
updatecash_cheque_transfer(data:any):Observable<any>
{
    return this._http.put(`${this.cash_cheque_transfer}`,data);
}
HouseType = `${this.apiurl}house-type`;
getHouseType():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');
    let param = new HttpParams().set('socityId',this.societyId);

    return this._http.get(this.HouseType,{params:param});

    
}

createHouseType(data:any):Observable<any>
{
    return this._http.post(`${this.HouseType}`,data);
}
updateHouseType(data:any):Observable<any>
{
    return this._http.put(`${this.HouseType}`,data);
}
 removeHouseType(data:any):Observable<any>
{
    return this._http.post(`${this.HouseType}/disable`,data);
}
restoreHouseType(data:any):Observable<any>
{
    return this._http.post(`${this.HouseType}/enable`,data);
}
ChargeType = `${this.apiurl}charge-list/type`;
getChargeType():Observable<any>
{
    return this._http.get(`${this.ChargeType}`);
    
}
createChargeType(data:any):Observable<any>
{
    return this._http.post(`${this.ChargeType}`,data);
}
ChargeList = `${this.apiurl}charge-list`;
getChargeList():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('socityId',this.societyId);
    return this._http.get(this.ChargeList,{params:param});
    // return this._http.get(`${this.ChargeList}`);
    
}
createChargeList(data:any):Observable<any>
{
    return this._http.post(`${this.ChargeList}`,data);
}
updateChargeList(data:any):Observable<any>
{
    return this._http.put(`${this.ChargeList}`,data);
}

socity_budget = `${this.apiurl}socity-budget`;
getsocity_budget():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('socityId',this.societyId);
    return this._http.get(`${this.socity_budget}/details`,{params:param});
    // return this._http.get(`${this.socity_budget}`);
    
}
createsocity_budget(data:any):Observable<any>
{
    return this._http.post(`${this.socity_budget}`,data);
}
updatesocity_budget(data:any):Observable<any>
{
    return this._http.put(`${this.socity_budget}`,data);
}
billing = `${this.apiurl}billing`;

createallocate_charge(data:any):Observable<any>
{
    return this._http.post(`${this.billing}/calculate`,data);
}
getall_dues():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('societyId',this.societyId);
    return this._http.get(`${this.billing}/all-dues`,{params:param});
   // return this._http.get(`${this.billing}/all-dues`);
    
}
get_specific_dues(id:any):Observable<any>
{
    return this._http.get(`${this.billing}/all-dues?rentalUnitId=`+id);
    
}
get_show_dues(id:any):Observable<any>
{
    return this._http.get(`${this.billing}/rental-peyment-overview?rentalUnitId=`+id);
    
}
getinvoice_grp():Observable<any>
{
    return this._http.get(`${this.billing}`);
    
}
getinvoice_grp_details(id:any):Observable<any>
{
    return this._http.get(`${this.billing}?billgroupId=`+id);
    
}
//http://3.111.99.46:3000/api/v1/billing/generate-bill
generate_bill(data:any):Observable<any>
{
    return this._http.post(`${this.billing}/generate-bill`,data);
}
generateInvoice = `${this.apiurl}invoices`;

generate_invoice(data:any):Observable<any>
{
    return this._http.post(`${this.generateInvoice}`,data);
}
general_payment = `${this.apiurl}payment/general-payment`;
getgeneral_payment():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('societyId',this.societyId);
    return this._http.get(this.general_payment,{params:param});
   // return this._http.get(`${this.general_payment}`);
    
}
creategeneral_payment(data:any):Observable<any>
{
    return this._http.post(`${this.general_payment}`,data);
}
updategeneral_payment(data:any):Observable<any>
{
    return this._http.put(`${this.general_payment}`,data);
}
rental_transaction = `${this.apiurl}payment/rental`;
getrental_transaction():Observable<any>
{
    this.societyId= sessionStorage.getItem('societyId');

    let param = new HttpParams().set('socityId',this.societyId);
    return this._http.get(this.rental_transaction,{params:param});
    // return this._http.get(`${this.rental_transaction}`);
    
}
createrental_transaction(data:any):Observable<any>
{
    return this._http.post(`${this.rental_transaction}/create-receipt`,data);
}
cancelIntimation(data:any):Observable<any>
{
    return this._http.post(`${this.rental_transaction}/cancel`,data);
}
checkbounce(data:any):Observable<any>
{
    return this._http.post(`${this.rental_transaction}/check-bounce`,data);
}
updaterental_transaction(data:any):Observable<any>
{
    return this._http.put(`${this.rental_transaction}`,data);
}

}