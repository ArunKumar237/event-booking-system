import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1>Hello, {{ title() }}</h1>

    <router-outlet />
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('event-booking-ui');

  constructor(private readonly api: ApiService) {
    this.api.getTimeslots().subscribe((response) => {
      console.log('Timeslots response:', response);
    });
  }
}
