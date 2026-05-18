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

  logout(): void {
    this._auth.clearStorage();
    this._user.logout();
    this._router.navigate(['']);
  }
}
