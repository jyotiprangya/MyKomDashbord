import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  
  form: any = FormGroup;
  resetPasswordForm:any = FormGroup;
  tokenFromUrl!: string;
  newPassword!: string;
  confirmPassword!: string;

  constructor(  
    private service: ApiService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.tokenFromUrl = params['token'];
    });
    console.log(this.tokenFromUrl)
    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [
          this.confirmPasswordValidator('newPassword', 'confirmPassword'),
        ],
      }
    );
   
  }


  confirmPasswordValidator = (newPassword: string, confirmPassword: string) => {
    return (formGroup: FormGroup) => {
      //storing controlName value in control
      let control = formGroup.controls[newPassword];
      let controlToMatch = formGroup.controls[confirmPassword];

      if (
        controlToMatch.errors &&
        !controlToMatch.errors['confirmPasswordValidator']
      ) {
        return;
      }
      if (control.value !== controlToMatch.value) {
        controlToMatch.setErrors({ confirmPasswordValidator: true }); // if it ll true then it ll show the error
      } else {
        controlToMatch.setErrors(null);
      }
    };
  };

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')!.value;
    const confirmPassword = form.get('confirmPassword')!.value;

    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')!.setErrors({ passwordMismatch: true });
    } else {
      form.get('confirmPassword')!.setErrors(null);
    }

    return null;
  }

  resetPassword(){

    const result = window.confirm('This will be your new password');
    if (result) {
      console.log('confirmed');
  {
    //this.societyId= localStorage.getItem('societyId');
  
    console.log(this.form.value);
    this.service.resetPass({token:this.tokenFromUrl,newPassword:this.form.value.newPassword}).subscribe((res)=>{
      console.log(res,'res==>');
      this.form.reset();
  
    },(error) => {
      alert(error.error.message);
      console.error('Error:', error);
      // You can show an error message to the user if needed
    });
   }
  }else {
    console.log('Delete canceled');
  }
  }
  
}
