import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Timeslot } from './timeslot.model';

@Component({
  selector: 'app-timeslot-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">

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

      <div class="time">
        {{ slot.start_time | date:'medium' }}
        —
        {{ slot.end_time | date:'medium' }}
      </div>

      <div class="user" *ngIf="slot.booked_by">
        👤 Booked by:
        <strong>{{ slot.booked_by.username }}</strong>
      </div>

      <button
        class="btn subscribe"
        *ngIf="!slot.booked_by"
        (click)="subscribe.emit(slot.id)"
      >
        Subscribe
      </button>

      <button
        class="btn unsubscribe"
        *ngIf="slot.booked_by"
        (click)="unsubscribe.emit(slot.id)"
      >
        Unsubscribe
      </button>

    </div>
  `,
  styleUrls: ['./timeslot-card.component.css']
})
export class TimeslotCardComponent {

  @Input() slot!: Timeslot;

  @Output() subscribe = new EventEmitter<number>();
  @Output() unsubscribe = new EventEmitter<number>();
}
