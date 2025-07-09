import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators, UntypedFormBuilder } from '@angular/forms';
import emailjs from 'emailjs-com';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  formControls: any;

  
  constructor(private fb: UntypedFormBuilder) {
    
  }
  frmRegister:any=  UntypedFormGroup;
  submitted = false;
 ngOnInit(): void {
  
  this.frmRegister = this.fb.group({
    Name: [null, [ Validators.required ] ],
    Email: [null, [Validators.required]],
    Number:[null, [Validators.required]],
    message:[null, [Validators.required]]
    
  });
 }

 
 

 get frm(){
   return this.frmRegister.controls;
 }

//  RegisterClick(obj:any){
//    this.submitted = true;
//    if(this.frmRegister.invalid){
//      return;
//    }
//    alert(JSON.stringify(obj));

//  }
RegisterClick() {
  this.submitted = true;

  // Stop here if the form is invalid
  if (this.frmRegister.invalid) {
    return;
  }

  // Prepare the form data to be sent via email
  const emailData = {
    to_email: 'barsharani.rath@mohrisa.com', // Replace with the recipient's email address
    from_name: this.frmRegister.value.Name,
    from_email: this.frmRegister.value.Email,
    contact_number: this.frmRegister.value.Number,
    message: this.frmRegister.value.message,
    reply_to: this.frmRegister.value.message

  };
  console.log(emailData);

  // Send the email using EmailJS
  emailjs.send('service_pged91q', 'template_pyvbv48', emailData, 'VX3P9yRHJ52soJzXy')
    .then((response:any) => {
      console.log('Email sent:', response);
     alert('Sent Request Successfully...');

      this.frmRegister.reset();
      // You can show a success message to the user if needed
    }, (error:any) => {
      console.error('Error sending email:', error);
      console.error('Error sending email:', error.error);

      // You can show an error message to the user if needed
    });
}
}

