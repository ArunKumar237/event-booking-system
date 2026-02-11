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

  getPreferences() {
    return this.http.get<number[]>(
      `${this.baseUrl}preferences/`,
      { withCredentials: true }
    );
  }

  savePreferences(categories: number[]) {
    return this.http.post(
      `${this.baseUrl}preferences/`,
      { categories },
      { withCredentials: true }
    );
  }

  getTimeslotsFiltered(start: string, end: string, category?: string) {

    let url = `${this.baseUrl}timeslots/?start_date=${start}&end_date=${end}`;

    if (category && category !== '') {
      url += `&category=${category}`;
    }

    return this.http.get<any[]>(url, {
      withCredentials: true
    });
  }

}
