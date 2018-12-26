import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { RegisterAndLoginService } from './../Services/Register-And-Login/register-and-login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private _router: Router, private _service: RegisterAndLoginService) {

  }

  canActivate(): boolean {
    if (this._service.If_LoggedIn()) {
      return true;
    } else {
      this._router.navigate(['/']);
      return false;
    }
  }

}
