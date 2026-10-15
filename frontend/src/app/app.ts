import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { LiveDataService } from './services/live-data.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly crestUrl = LiveDataService.CREST_URL;
  readonly year = new Date().getFullYear();
  readonly navLinks = [
    { path: '/', label: 'Home' },
    { path: '/news', label: 'News' },
    { path: '/fixtures', label: 'Fixtures' },
    { path: '/table', label: 'Table' },
    { path: '/squad', label: 'Squad' },
    { path: '/stats', label: 'Stats' },
    { path: '/blog', label: 'Fan Blog' }
  ];
  readonly nextMatch$;
  menuOpen = false;

  constructor(public authService: AuthService, liveData: LiveDataService) {
    this.nextMatch$ = liveData.getFixtures().pipe(map(fixtures => fixtures[0]));
  }

  logout(): void {
    this.authService.logout();
  }
}
