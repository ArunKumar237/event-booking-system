import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Timeslot } from './timeslot.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:8000/api/';

  constructor(private readonly http: HttpClient) {}

  getTimeslots(): Observable<Timeslot[]> {
    return this.http.get<Timeslot[]>(
      `${this.baseUrl}timeslots/`,
      { withCredentials: true }
    );
  }

  bookSlot(id: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}timeslots/${id}/book/`,
      {},
      { withCredentials: true }
    );
  }

  unsubscribeSlot(id: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}timeslots/${id}/unsubscribe/`,
      {},
      { withCredentials: true }
    );
  }
}
