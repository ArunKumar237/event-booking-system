import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'http://127.0.0.1:8000/api/';

  constructor(private readonly http: HttpClient) {}

  getCategories(): Observable<unknown> {
    return this.http.get<unknown>(`${this.baseUrl}categories/`);
  }

  getTimeslots(): Observable<unknown> {
    return this.http.get<unknown>(`${this.baseUrl}timeslots/`);
  }

  bookTimeslot(id: number): Observable<unknown> {
    return this.http.post<unknown>(`${this.baseUrl}timeslots/${id}/book/`, {});
  }

  unsubscribeTimeslot(id: number): Observable<unknown> {
    return this.http.post<unknown>(`${this.baseUrl}timeslots/${id}/unsubscribe/`, {});
  }
}
