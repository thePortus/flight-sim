import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './../../services/auth.service';
import { User, UserService } from './../../services/user.service';
import { Settings } from '../../app.settings';

interface PlaneSummary { id: number; name: string; slug: string; }

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  user: User | null = null;
  planes: PlaneSummary[] = [];
  selectedSlug = 'cessna-172';

  /** True while the pre-flight server/auth check is in progress. */
  flyingCheck = false;
  /** Non-empty when the check fails — shown below the Fly Now button. */
  flyError = '';

  constructor(
    private _auth: AuthService,
    private _user: UserService,
    private _router: Router,
    private _http: HttpClient
  ) {}

  ngOnInit(): void {
    if (this._auth.getUserDetails() != null) {
      const userDetails = JSON.parse(this._auth.getUserDetails()!);
      this._user.login({
        username: userDetails.username,
        email: userDetails.email,
        role: userDetails.role,
        token: userDetails.token
      });
    }
    this._user.user$.subscribe(u => (this.user = u));
    const stored = localStorage.getItem('selectedPlane');
    if (stored) this.selectedSlug = stored;
    this._http.get<PlaneSummary[]>(`${Settings.apiUrl}planes/`).subscribe({
      next: planes => this.planes = planes,
      error: () => {},
    });
  }

  selectPlane(slug: string): void {
    this.selectedSlug = slug;
    localStorage.setItem('selectedPlane', slug);
  }

  /**
   * Gate for the Fly Now button.
   * 1. User must be logged in.
   * 2. Server must respond to a lightweight ping (GET /planes/).
   * Only navigates to /game when both pass.
   */
  flyNow(): void {
    this.flyError = '';

    // 1. Auth check — must be logged in
    if (!this.user?.loggedIn) {
      this.flyError = 'You must be logged in to fly. Please sign in or create an account.';
      return;
    }

    // 2. Server reachability check
    this.flyingCheck = true;
    this._http.get(`${Settings.apiUrl}planes/`, { responseType: 'json' }).subscribe({
      next: () => {
        this.flyingCheck = false;
        this._router.navigate(['/game']);
      },
      error: () => {
        this.flyingCheck = false;
        this.flyError = 'Cannot reach the server. Please check your connection or try again shortly.';
      },
    });
  }

  logout(): void {
    this._auth.clearStorage();
    this._user.logout();
    this._router.navigate(['']);
  }
}
