import { Injectable, isDevMode } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Timeslot } from './timeslot.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = '/api/';

  constructor(private readonly http: HttpClient) {}

  // Keep HTTP error handling in one place so every call uses a consistent policy.
  // We rethrow to preserve existing control flow and avoid changing business behavior.
  private handleHttpError(operation: string) {
    return (error: HttpErrorResponse) => {
      // Avoid noisy/sensitive console output in production builds.
      if (isDevMode()) {
        console.error(`[ApiService] ${operation} failed`, error);
      }
      return throwError(() => error);
    };
  }

  getTimeslots(): Observable<Timeslot[]> {
    return this.http.get<Timeslot[]>(
      `${this.baseUrl}timeslots/`,
      { withCredentials: true }
    ).pipe(catchError(this.handleHttpError('getTimeslots')));
  }

  bookSlot(id: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}timeslots/${id}/book/`,
      {},
      { withCredentials: true }
    ).pipe(catchError(this.handleHttpError('bookSlot')));
  }

  unsubscribeSlot(id: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}timeslots/${id}/unsubscribe/`,
      {},
      { withCredentials: true }
    ).pipe(catchError(this.handleHttpError('unsubscribeSlot')));
  }

  getPreferences() {
    return this.http.get<number[]>(
      `${this.baseUrl}preferences/`,
      { withCredentials: true }
    ).pipe(catchError(this.handleHttpError('getPreferences')));
  }

  savePreferences(categories: number[]) {
    return this.http.post(
      `${this.baseUrl}preferences/`,
      { categories },
      { withCredentials: true }
    ).pipe(catchError(this.handleHttpError('savePreferences')));
  }

  getTimeslotsFiltered(start: string, end: string, category?: string) {

    let url = `${this.baseUrl}timeslots/?start_date=${start}&end_date=${end}`;

    if (category && category !== '') {
      url += `&category=${category}`;
    }

    return this.http.get<any[]>(url, {
      withCredentials: true
    }).pipe(catchError(this.handleHttpError('getTimeslotsFiltered')));
  }

}
