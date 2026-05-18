import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NgForm, FormsModule } from '@angular/forms';
import { Router} from '@angular/router';
import { RouterLink } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';


import { ApiService } from './../../../services/api.service';
import { AuthService } from './../../../services/auth.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-register',
  imports: [
    RouterLink, MatInputModule, MatCardModule, MatButtonModule,
    MatFormFieldModule, CommonModule, FormsModule
  ],
  standalone: true,
  providers: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
   // local and server error messages
   errorMessage: any;
   showErrorMessage: boolean = false;
   // observable and local object for user data
   userDetails$!: Observable<User>;
   user: any;

  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _user: UserService,
    private _router: Router
  ) {}

  ngOnInit(): void {
 // check local storage data whether user is already logged in
    this.isUserLogin();
    // get observable & set behavior on change
    this.userDetails$ = this._user.user$;
    this.userDetails$.subscribe(result => {
      this.user = result;
    });
  }

  /**
   * Uses auth service to see if user already has stored login data
   * in local storage. If so, then uses the user service to
   * store that data for the application.
   */
  isUserLogin() {
    if(this._auth.getUserDetails() != null) {
      const userDetails = JSON.parse(this._auth.getUserDetails()!);
      this._user.login({
        username: userDetails.username,
        email: userDetails.email,
        role: userDetails.role,
        token: userDetails.token
      });
    }
  }

  /**
   * Submits user data to server and stores local user data from server response.
   * 
   * @param form Form data with user registration info
   */
  onSubmit(form: NgForm) {
    this.showErrorMessage = false;
    // check for matching passwords
    if (form.value.password !== form.value.password2) {
      this.errorMessage = 'Error: passwords must match!';
      this.showErrorMessage = true;
    }
    else {
      this._api.postTypeRequest('user/register', form.value).subscribe((res: any) => {
        // Server returns { message, user: { id, username, email } } on 201 — no token
        if (res.user) {
          this._router.navigate(['/login']);
        } else {
          this.errorMessage = res.message || 'Registration failed.';
          this.showErrorMessage = true;
        }
      }, (error: any) => {
        this.errorMessage = error?.error?.message || 'Could not reach the server.';
        this.showErrorMessage = true;
      });
    }
  }

  /**
   * Clears user data both from user service and from local storage
   */
  logout() {
    this._auth.clearStorage();
    this._user.logout();
    this._router.navigate(['']);
  }

}
