import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NgForm, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { ApiService } from './../../../services/api.service';
import { AuthService } from './../../../services/auth.service';
import { User, UserService } from './../../../services/user.service';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink, CommonModule, FormsModule, MatInputModule,
    MatCardModule, MatButtonModule, MatSnackBarModule
  ],
  standalone: true,
  providers: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  // local and server error messages
  errorMsgs: string[] = [];
  // observable and local object for user data
  userDetails$!: Observable<User>;
  user: any;
  
  constructor(
    private _api: ApiService,
    private _auth: AuthService,
    private _user: UserService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) {}

  /**
   * Checks if the user is logged in, and gets user details as an
   * observable if so.
   */
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
   * Submits user data to server and stores local user data from server response.
   * 
   * @param form Form data with user login info
   */
  onSubmit(form: NgForm) {
    this._api.postTypeRequest('user/login', form.value).subscribe((res: any) => {
      if (res.token) {
        // store data in local browser storage for later sessions
        this._auth.setDataInLocalStorage('userData', JSON.stringify(res));
        this._auth.setDataInLocalStorage('token', res.token);
        // push user into the shared UserService state
        this._user.login({
          username: res.username,
          email:    res.email,
          role:     res.role,
          token:    res.token,
        });
        this._snackBar.open('Successfully logged in!', '', { duration: 2000 });
        this._router.navigate(['']);
      } else {
        this._snackBar.open('There was a problem logging in — check your username and password.', '', { duration: 5000 });
      }
    }, (error: any) => {
      const msg = error?.error?.message;
      if (msg === 'User not found.' || msg === 'Invalid password.') {
        this._snackBar.open('Incorrect username or password.', '', { duration: 5000 });
      } else {
        this._snackBar.open('Could not reach the server — is it running?', '', { duration: 5000 });
      }
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
   * Clears user data both from user service and from local storage
   */
  logout() {
    this._auth.clearStorage();
    this._user.logout();
    this._router.navigate(['']);
  }

}
