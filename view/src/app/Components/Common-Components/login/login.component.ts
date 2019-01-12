import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import * as CryptoJS from 'crypto-js';

import { ToastrService } from './../../../Services/Common-Services/Toastr-Service/toastr.service';
import { RegisterAndLoginService } from './../../../Services/Register-And-Login/register-and-login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

   ActiveTab: any = 'Login';

   LoginForm: FormGroup;
   RegistrationForm: FormGroup;

   constructor(   private Toastr: ToastrService,
                  private router: Router,
                  private service: RegisterAndLoginService
               ) {
                  localStorage.clear();
               }

   ngOnInit() {
      this.LoginForm = new FormGroup({
         Email: new FormControl('', [Validators.required, Validators.email]),
         Password: new FormControl('', Validators.required),
      });
      this.RegistrationForm = new FormGroup({
         Reg_No: new FormControl('', Validators.required),
         Email: new FormControl(''),
      });
   }

   ActiveTabChange(TabString: any) {
      if (this.ActiveTab !== TabString) {
         this.ActiveTab = TabString;
         this.LoginForm.reset();
         this.RegistrationForm.reset();
      }
   }

   Login() {
      if (this.LoginForm.valid) {
            const Data = this.LoginForm.value;
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.service.StudentLogin_Validate({'Info': Info}).subscribe( response => {
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Successfully Logged In' });
                  this.router.navigate(['/Main/Activities']);
               } else if (response['status'] === 200 || response['status'] === 400 || response['status'] === 417 && !ReceivingData.Status ) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ReceivingData['Message'] });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Some Error Occurred!' });               }
            });
      }
   }

   Register() {
      if (this.RegistrationForm.valid) {
            const Data = this.RegistrationForm.value;
            let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
            Info = Info.toString();
            this.service.StudentRegistration_Validate({'Info': Info}).subscribe( response => {
               const ReceivingData = JSON.parse(response['_body']);
               if (response['status'] === 200 && ReceivingData.Status) {
                  const CryptoBytes  = CryptoJS.AES.decrypt(ReceivingData['Response'], 'SecretKeyOut@123');
                  const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                  this.router.navigate(['/Account-Activate', DecryptedData._id, DecryptedData.EmailToken ]);
               } else if (response['status'] === 200 || response['status'] === 400 || response['status'] === 417 && !ReceivingData.Status ) {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: ReceivingData['Message'] });
               } else {
                  this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Some Error Occurred!' });               }
            });
      }
   }

}
