import { Component, OnInit, ElementRef, ViewChild, TemplateRef } from '@angular/core';
import { formatDate } from '@angular/common';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { ImageCroppedEvent } from 'ngx-image-cropper';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalDirective } from 'ngx-bootstrap/modal';

import {NativeDateAdapter} from '@angular/material';
import {DateAdapter} from '@angular/material/core';
export class MyDateAdapter extends NativeDateAdapter {
   format(date: Date, displayFormat: Object): string {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
   }
}

import * as CryptoJS from 'crypto-js';

import { ToastrService } from './../../../Services/Common-Services/Toastr-Service/toastr.service';
import { RegisterAndLoginService } from './../../../Services/Register-And-Login/register-and-login.service';


@Component({
  selector: 'app-account-activate',
  templateUrl: './account-activate.component.html',
  styleUrls: ['./account-activate.component.css'],
  providers: [{provide: DateAdapter, useClass: MyDateAdapter}],
})
export class AccountActivateComponent implements OnInit {

   Loader: Boolean = true;
   Student: any;
   EmailToken: any;
   _Data: any;
   Form: FormGroup;

   @ViewChild('profileImg') profileImg: ElementRef;
   @ViewChild('Cropper') childModal: ModalDirective;

   Show_Img_Preview: Boolean = false;
   Default_Img: any = '../../../../assets/images/Basic/student-avatar-1.png' ;
   Cropped_Img: any = '';
   imageChangedEvent: any = '';

   Temp_File: File;
   Temp_Crop_Img: any;

   modalRef: BsModalRef;

   FormData: FormData = new FormData;
   Uploading: Boolean = false;


  constructor( private Toastr: ToastrService,
               private router: Router,
               private service: RegisterAndLoginService,
               private active_route: ActivatedRoute,
               private modalService: BsModalService
            ) {
               this.active_route.url.subscribe((u) => {
                  this.Student = this.active_route.snapshot.params['Student'];
                  this.EmailToken = this.active_route.snapshot.params['Email_Token'];
                  const Data = {'Student' : this.Student, 'EmailToken': this.EmailToken};
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Loader = true;
                  this.service.StudentAccountActivate_Validate({'Info': Info}).subscribe( response => {
                     const ResponseData = JSON.parse(response['_body']);
                     this.Loader = false;
                     if (response['status'] === 200 && ResponseData['Status'] && !ResponseData['Registration_Completed']) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        this._Data = DecryptedData;
                        this.LoadFormDetails();
                     } else if (response['status'] === 200 && ResponseData['Status'] && ResponseData['Registration_Completed']) {
                        this.Toastr.NewToastrMessage({ Type: 'Info', Message: 'Your Account Already Activated' });
                        this.router.navigate(['/']);
                     } else if (response['status'] === 200 && !ResponseData['Status'] ) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message:  ResponseData['Message'] });
                        this.router.navigate(['/']);
                     } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status'] ) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Some Error Occurred!' });
                     }
                  });
               });
            }

   ngOnInit() {
   }

   NotAllow(): boolean {return false; }

   LoadFormDetails() {
      if (this._Data) {
         if (this._Data['Gender'] === 'M') { this._Data['Gender'] = 'Male'; }
         if (this._Data['Gender'] === 'F') { this._Data['Gender'] = 'Female'; }
         this._Data['Yearly_Badge']['Batch'] = formatDate(new Date(this._Data['Yearly_Badge']['Starting_MonthAndYear']), 'MMM yyyy ', 'en-US')  + ' - ' + formatDate(new Date(this._Data['Yearly_Badge']['Ending_MonthAndYear']), 'MMM yyyy ', 'en-US');
            this.Form = new FormGroup({
               Student: new FormControl( this.Student , Validators.required),
               EmailToken: new FormControl( this.EmailToken , Validators.required),
               Reg_No: new FormControl({value: this._Data['Reg_No'], disabled: true} , Validators.required),
               Name: new FormControl({value: this._Data['Name'], disabled: true}, Validators.required),
               Institution: new FormControl({value: this._Data['Institution_Management']['Institution']['Institution'], disabled: true}, Validators.required),
               Course: new FormControl({value: this._Data['Institution_Management']['Course']['Course'], disabled: true}, Validators.required),
               Department: new FormControl({value: this._Data['Institution_Management']['Department']['Department'], disabled: true}, Validators.required),
               Yearly_Badge: new FormControl({value: this._Data['Yearly_Badge']['Batch'], disabled: true}, Validators.required),
               Password: new FormControl({value: null, disabled: false}, Validators.required),
               Confirm_Password: new FormControl({value: null, disabled: false}, Validators.required),
               Email: new FormControl({value: this._Data['Email'], disabled: false}, [Validators.required, Validators.email]),
               Mobile: new FormControl({value: this._Data['Contact_Number'], disabled: false}, Validators.required),
               Gender: new FormControl({value: this._Data['Gender'], disabled: false}, Validators.required),
               Blood_Group: new FormControl({value: this._Data['Blood_Group'], disabled: false}, Validators.required),
               DOB: new FormControl({value: null, disabled: false}, Validators.required),
               Confirmation: new FormControl(null, Validators.requiredTrue),
            }, [this.passwordConfirming]);
      }
   }

   passwordConfirming(c: AbstractControl): { notMatch: boolean } {
      if (c.get('Password').value !== c.get('Confirm_Password').value) {
         return {notMatch: true};
      }
   }


   fileChangeEvent(event: any): void {
      if (event.target.files && event.target.files.length > 0) {
         this.imageChangedEvent = event;
         this.modalRef = this.modalService.show(this.childModal, { ignoreBackdropClick: true, class: 'modal-lg' });
      } else {
         this.profileImg.nativeElement.value = null;
         this.Show_Img_Preview = true;
         this.FormData.delete('profile');
      }
   }

   imageCropped(event: ImageCroppedEvent) {
      this.Temp_Crop_Img = event.base64;
      event.file['lastModifiedDate'] = new Date();
      event.file['name'] = 'Student.png';
      this.Temp_File = <File>event.file;
   }


   SetCroppedImg() {
      this.Show_Img_Preview = true;
      this.Cropped_Img = this.Temp_Crop_Img;
      this.FormData.set('profile', this.Temp_File, this.Temp_File.name);
      this.modalService.hide(1);
      this.profileImg.nativeElement.value = null;
   }

   CancelCrop() {
      this.modalService.hide(1);
      this.profileImg.nativeElement.value = null;
   }


   Submit() {
      if (this.Form.valid && !this.Uploading) {
         this.Uploading = true;
         const Data = this.Form.getRawValue();
         let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
         Info = Info.toString();
         this.FormData.set('Info', Info);
         this.service.StudentActivate_UpdateAndLogin(this.FormData).subscribe( response => {
            const ReceivingData = JSON.parse(response['_body']);
            this.Uploading = false;
            if (response['status'] === 200 && ReceivingData.Status) {
               this.Toastr.NewToastrMessage({ Type: 'Success', Message: 'Successfully Updated!' });
               this.router.navigate(['/Main/Activities']);
            } else if (response['status'] === 200 || response['status'] === 400 || response['status'] === 417 && !ReceivingData.Status ) {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: ReceivingData['Message'] });
            } else {
               this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Some Error Occurred!' });
            }
         });
      }
   }

}
