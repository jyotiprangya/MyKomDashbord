import { Component, OnInit, Pipe } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { PopupMessageComponent } from '../popup-message/popup-message.component';
import { SuccessMessageComponent } from '../success-message/success-message.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

   email: string="";
   password: string="";
   loading = false;
   submitted = false;
   error:any;
   resp:any;
   
   // Password visibility toggle
   showPassword = false;

   closeResult: any;
   content:any;
   message:String = '';
   form:any= UntypedFormGroup;


  
   constructor(
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private _auth: ApiService,    
    private modalService: NgbModal,
    ) { }

     formData =  this.formBuilder.group({
         email: ['', Validators.required],
         password: ['',Validators.required]
         
      });

      ngOnInit() :void{ 

        this.form = this.formBuilder.group({
          email: [null]
        });
       }
       
get f() { 
         return this.formData.controls;  
        }  

        // Toggle password visibility
        togglePasswordVisibility() {
          this.showPassword = !this.showPassword;
        }
       
        onClickSubmit() {
          if (this.formData.valid) {
            this.loading = true;
            console.log({
              email: this.formData.value.email.toLowerCase(),
              password: this.formData.value.password
            }, 'loginvalue...');
        
            this._auth.loginAdmin({
              email: this.formData.value.email.toLowerCase(),
              password: this.formData.value.password
            }).subscribe({
              next: (res) => {
                console.log("Is Login Success: ");
                console.log(res);
        
                if (res.userRole == "SUPER_ADMIN") {
                  console.log(res, 'data...');
                  const token = res.token;
                  console.log(res.token);
                  sessionStorage.setItem('token', token);
                  this.router.navigate(['/admin/dashboard']);
                } 
                else if (res.userRole == "SOCIETY_ADMIN" || res.userRole == "SOCIETY_ADMIN_DISPLAY") {
                  console.log(res, 'data...');
                  const token = res.token;
                  const societyId = res.societyId;
                  const firstName = res.profile.firstName;
                  const lastName = res.profile.lastName;
                  const societyName = res.societyName;
                  const societyImage = res.societyImage;
                  const role = res.userRole;
        
                  sessionStorage.setItem('token', token);
                  sessionStorage.setItem('firstName', firstName);
                  sessionStorage.setItem('lastName', lastName);
                  sessionStorage.setItem('societyName', societyName);
                  sessionStorage.setItem('societyImage', societyImage);
                  sessionStorage.setItem('role', role);
                  sessionStorage.setItem('societyId', societyId);
        
                  this.router.navigate(['/supervisor/dashboard']);
                } 
                else {
                  // Redirect to a default page or show an error message for unknown user roles
                  this.router.navigate(['/login']);
                }
              },
              error: (error) => {
                this.loading = false;
                console.error("Error during login:", error);
                
                // Check if the error is due to internet connectivity
                if (!navigator.onLine || error.status === 0) {
                  this.error = "Please check your internet connection";
                } else {
                  this.error = "Invalid Email or Password";
                }
                
                const modalRef = this.modalService.open(PopupMessageComponent);
                modalRef.componentInstance.message = this.error;
                this.formData.reset();
                this.error = '';
              }
            });
          } else {
            alert("Invalid Form...");
          }
        }

   open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  
  
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
   //  //location.reload();
  
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    // //location.reload();
  
      return 'by clicking on a backdrop';
    } else {
     ////location.reload();
  
      return `with: ${reason}`;
    }
  
  }  
  
  forgotPassword(){

    const result = window.confirm('Are you sure you ant to reset your password?');
    if (result) {
      console.log('confirmed');
  {
    //this.societyId= sessionStorage.getItem('societyId');
  
    console.log(this.form.value);
    this._auth.forgotpass({email:this.form.value.email}).subscribe((res)=>{
      console.log(res,'res==>');
      // alert(res.message);
      this.resp= res.message;
      const modalRef = this.modalService.open(SuccessMessageComponent);
      modalRef.componentInstance.message = this.resp;
      this.form.reset();
  
    },(error) => {
       //alert(error.message);
      console.error('Error:', error);
      this.error= error.message;
      const modalRef = this.modalService.open(PopupMessageComponent);
      modalRef.componentInstance.message = this.error;
      this.formData.reset();
this.error = '';
      // You can show an error message to the user if needed
    });
   }
  }else {
    console.log('Delete canceled');
  }
  }
  
}