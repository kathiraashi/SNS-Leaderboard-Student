// Default Modules
   import { NgModule } from '@angular/core';
   import { CommonModule} from '@angular/common';
   import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
   import { BrowserModule } from '@angular/platform-browser';
   import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
   import { FormsModule, ReactiveFormsModule } from '@angular/forms';
   import { HttpModule } from '@angular/http';
   import { RouterModule, Routes } from '@angular/router';

// Feature Modules
   import { MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, } from '@angular/material';
   import { ImageCropperModule } from 'ngx-image-cropper';
   import { ModalModule } from 'ngx-bootstrap';

// Default Module
   import { AppComponent } from './app.component';
// Routing Module
   import { AppRoutingModule } from './app-routing.module';

// Components
   // Common-Components
   import { LoginComponent } from './Components/Common-Components/login/login.component';
   import { AccountActivateComponent } from './Components/Common-Components/account-activate/account-activate.component';
   // Dashboard
   import { DashboardComponent } from './Components/dashboard/dashboard.component';


@NgModule({
   declarations: [
      AppComponent,
      // Components
         // Common-Components
            LoginComponent,
            AccountActivateComponent,
         // Dashboard
            DashboardComponent
   ],
   imports: [
      // Default Modules
         BrowserModule,
         BrowserAnimationsModule,
         RouterModule,
         HttpModule,
         FormsModule,
         ReactiveFormsModule,
      // Feature Modules
         MatCheckboxModule,
         MatDatepickerModule,
         MatNativeDateModule,
         ImageCropperModule,
         ModalModule.forRoot(),
      // Routing Module
         AppRoutingModule
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
