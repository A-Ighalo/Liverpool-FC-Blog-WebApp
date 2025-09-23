import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtResponse, LoginRequest, SignupRequest, MessageResponse } from '../models/auth.model';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.apiUrl + '/signin', {
      username,
      password
    }, this.httpOptions).pipe(
      tap(response => {
        this.saveToken(response.accessToken);
        this.saveUser(response);
        this.loggedIn.next(true);
      })
    );
  }

  register(username: string, email: string, password: string): Observable<MessageResponse> {
    return this.http.post<MessageResponse>(this.apiUrl + '/signup', {
      username,
      email,
      password
    }, this.httpOptions);
  }

  logout(): void {
    window.sessionStorage.clear();
    this.loggedIn.next(false);
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  public isLoggedIn(): boolean {
    return !!this.getToken();
  }

  public get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  public hasRole(role: string): boolean {
    const user = this.getUser();
    return user && user.roles && user.roles.includes('ROLE_' + role.toUpperCase());
  }

  public isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }
}