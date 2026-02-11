import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, of, throwError } from 'rxjs';

interface AuthUser {
  id: number;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly baseUrl = '/api/';

  private readonly userSubject = new BehaviorSubject<AuthUser | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    this.http.get(`${this.baseUrl}csrf/`, {
        withCredentials: true
    }).subscribe();
  }

  // Centralized HTTP error handling keeps service behavior predictable.
  // We only log in dev mode and rethrow to avoid changing existing flows.
  private handleHttpError(operation: string) {
    return (error: HttpErrorResponse) => {
      if (isDevMode()) {
        console.error(`[AuthService] ${operation} failed`, error);
      }
      return throwError(() => error);
    };
  }

  loadUser() {
    this.http.get<AuthUser>(`${this.baseUrl}me/`, { withCredentials: true })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Preserve current behavior: unauthenticated/failed load maps to null user.
          if (isDevMode()) {
            console.error('[AuthService] loadUser failed', error);
          }
          return of(null);
        })
      )
      .subscribe(user => {
        this.userSubject.next(user);
      });
  }

  login(credentials: { username: string; password: string }) {
    return this.http.post(
      `${this.baseUrl}login/`,
      credentials,
      { withCredentials: true }
    ).pipe(catchError(this.handleHttpError('login')));
  }

  logout() {
    return this.http.post(
      `${this.baseUrl}logout/`,
      {},
      { withCredentials: true }
    ).pipe(catchError(this.handleHttpError('logout')));
  }
}
