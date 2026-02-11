import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { Timeslot } from './timeslot.model';

@Component({
  selector: 'app-timeslots',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container">
      <h1 class="title">Available Timeslots</h1>

      <ng-container *ngIf="timeslots$ | async as timeslots; else loading">

        <div class="grid">
          <div class="card" *ngFor="let slot of timeslots">

            <!-- HEADER -->
            <div class="card-header">
              <span class="category">{{ slot.category_name }}</span>

              <span
                class="status booked"
                *ngIf="slot.booked_by; else available"
              >
                Booked
              </span>

              <ng-template #available>
                <span class="status available">Available</span>
              </ng-template>
            </div>

            <!-- TIME -->
            <div class="time">
              {{ slot.start_time | date:'medium' }}
              <span class="dash">—</span>
              {{ slot.end_time | date:'medium' }}
            </div>

            <!-- USER -->
            <div class="user" *ngIf="slot.booked_by">
              👤 Booked by:
              <strong>{{ slot.booked_by.username }}</strong>
            </div>

            <!-- ACTION -->
            <button
              class="btn subscribe"
              *ngIf="!slot.booked_by"
              (click)="subscribe(slot.id)"
            >
              Subscribe
            </button>

            <button
              class="btn unsubscribe"
              *ngIf="slot.booked_by"
              (click)="unsubscribe(slot.id)"
            >
              Unsubscribe
            </button>

          </div>
        </div>

      </ng-container>

      <ng-template #loading>
        <div class="loading">Loading timeslots...</div>
      </ng-template>
    </section>
  `,
  styleUrls: ['./timeslots.component.css']
})
export class TimeslotsComponent {

  timeslots$: Observable<Timeslot[]>;

  constructor(private readonly api: ApiService) {
    // ✅ SAFE — api is now initialized
    this.timeslots$ = this.api.getTimeslots();
  }

  subscribe(id: number): void {
    this.timeslots$ = this.api.bookSlot(id).pipe(
      switchMap(() => this.api.getTimeslots())
    );
  }

  unsubscribe(id: number): void {
    this.timeslots$ = this.api.unsubscribeSlot(id).pipe(
      switchMap(() => this.api.getTimeslots())
    );
  }
}
