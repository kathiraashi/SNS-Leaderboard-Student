import { Component, OnInit } from '@angular/core';

import * as CryptoJS from 'crypto-js';

import { RegisterAndLoginService } from './../../Services/Register-And-Login/register-and-login.service';
import { ActivitiesService } from './../../Services/Activities/activities.service';
import { ToastrService } from './../../Services/Common-Services/Toastr-Service/toastr.service';

@Component({
  selector: 'app-my-activities',
  templateUrl: './my-activities.component.html',
  styleUrls: ['./my-activities.component.css']
})
export class MyActivitiesComponent implements OnInit {

   Student: any;
   Institution: any;

   Activities_List: any[] = [];
   Loader: Boolean = true;

   constructor(   public Login_Service: RegisterAndLoginService,
                  public Service: ActivitiesService,
                  private Toastr: ToastrService
               ) {
                  this.Student = this.Login_Service.Login_Info()['_id'];
                  this.Institution = this.Login_Service.Login_Info()['Institution_Management']['Institution']['_id'];

                  // Get Institutions List
                  const Data = {'Student' : this.Student, 'Institution': this.Institution };
                  let Info = CryptoJS.AES.encrypt(JSON.stringify(Data), 'SecretKeyIn@123');
                  Info = Info.toString();
                  this.Loader = true;
                  this.Service.Activities_List({'Info': Info}).subscribe( response => {
                     const ResponseData = JSON.parse(response['_body']);
                     this.Loader = false;
                     if (response['status'] === 200 && ResponseData['Status'] ) {
                        const CryptoBytes  = CryptoJS.AES.decrypt(ResponseData['Response'], 'SecretKeyOut@123');
                        const DecryptedData = JSON.parse(CryptoBytes.toString(CryptoJS.enc.Utf8));
                        DecryptedData.map(obj => {
                           obj['MaxPoints'] = Math.max.apply(Math, obj['MaxPoints_Array'].map( obj_1 => parseFloat(obj_1.Max_Points) ));
                           return obj;
                        });
                        this.Activities_List = DecryptedData;
                        DecryptedData.map(obj => {
                           this.Activities_List.push(obj);
                        });
                        DecryptedData.map(obj => {
                           this.Activities_List.push(obj);
                        });
                        console.log(this.Activities_List);
                     } else if (response['status'] === 400 || response['status'] === 417 || response['status'] === 401 && !ResponseData['Status']) {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: ResponseData['Message'] });
                     } else {
                        this.Toastr.NewToastrMessage({ Type: 'Error', Message: 'Some Error Occurred!' });
                     }
                  });
               }


  ngOnInit() {
  }

}
