import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, switchMap, map } from 'rxjs';
import { TimeslotCardComponent } from '../timeslot-card.component';
import { Timeslot } from '../timeslot.model';

@Component({
  standalone: true,
  selector: 'app-calendar',
  imports: [CommonModule, FormsModule, TimeslotCardComponent],
  template: `
    <section class="container">

      <h2 class="title">Weekly Calendar</h2>

      <h3 class="date-range">
        {{ dateRange$ | async }}
      </h3>

      <div class="controls">
        <button (click)="prevWeek()">Previous</button>

        <button class="today-btn" (click)="goToCurrentWeek()">
          Today
        </button>

        <button (click)="nextWeek()">Next</button>

        <select
          [(ngModel)]="selectedCategory"
          (ngModelChange)="category$.next($event)"
        >
          <option *ngFor="let c of categories" [value]="c.id">
            {{ c.name }}
          </option>
        </select>
      </div>

      <ng-container *ngIf="timeslots$ | async as timeslots">

        <p class="count">Total slots: {{ timeslots.length }}</p>

        <div class="grid">
          <app-timeslot-card
            *ngFor="let slot of timeslots"
            [slot]="slot"
            (subscribe)="bookSlot($event)"
            (unsubscribe)="unbookSlot($event)"
          />
        </div>

      </ng-container>

    </section>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: auto;
      padding: 24px;
      font-family: system-ui;
    }

    .title {
      text-align: center;
      margin-bottom: 10px;
    }

    .date-range {
      text-align: center;
      color: #555;
      margin-bottom: 20px;
      font-weight: 500;
    }

    .controls {
      display: flex;
      gap: 12px;
      justify-content: center;
      margin-bottom: 20px;
    }

    .grid {
      display: grid;
      gap: 20px;
    }

    .count {
      text-align: center;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .today-btn {
      background: #16a34a;
      color: white;
      font-weight: 600;
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
    }

    .today-btn:hover {
      background: #15803d;
    }
  `]
})
export class CalendarComponent {

  private today = new Date();

  selectedCategory = '';

  categories = [
    { id: '', name: 'All Categories' },
    { id: '1', name: 'Cat 1' },
    { id: '2', name: 'Cat 2' },
    { id: '3', name: 'Cat 3' }
  ];

  // ⭐ STATE STREAMS
  private currentDate$ = new BehaviorSubject<Date>(this.today);
  category$ = new BehaviorSubject<string>('');
  private refresh$ = new BehaviorSubject<void>(undefined);

  // ⭐ WEEK STREAM (derived)
  private week$ = this.currentDate$.pipe(
    map(date => this.getWeekRangeFromDate(date))
  );

  // ⭐ MAIN DATA STREAM
  timeslots$ = combineLatest([
    this.week$,
    this.category$,
    this.refresh$
  ]).pipe(
    switchMap(([week, category]) =>
      this.api.getTimeslotsFiltered(
        week.start,
        week.end,
        category
      )
    )
  );

  // ⭐ DISPLAY RANGE
  dateRange$ = this.week$.pipe(
    map(week => {

      const start = new Date(week.start);
      const end = new Date(week.end);

      const options: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      };

      return `${start.toLocaleDateString(undefined, options)}
              — 
              ${end.toLocaleDateString(undefined, options)}`;
    })
  );

  constructor(private api: ApiService) {}

  // ⭐ PURE FUNCTION
  private getWeekRangeFromDate(date: Date) {

    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }

  nextWeek() {
    const next = new Date();
    next.setDate(this.currentDate$.value.getDate() + 7);
    this.currentDate$.next(next);
  }

  prevWeek() {
    const prev = new Date();
    prev.setDate(this.currentDate$.value.getDate() - 7);
    this.currentDate$.next(prev);
  }

  goToCurrentWeek() {
    this.currentDate$.next(new Date());
  }

  bookSlot(id: number) {
    this.api.bookSlot(id).subscribe(() => {
      this.refresh$.next();
    });
  }

  unbookSlot(id: number) {
    this.api.unsubscribeSlot(id).subscribe(() => {
      this.refresh$.next();
    });
  }
}
