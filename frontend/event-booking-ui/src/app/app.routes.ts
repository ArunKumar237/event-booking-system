import { Routes } from '@angular/router';
import { TimeslotsComponent } from './timeslots/timeslots.component';
import { PreferencesComponent } from './preferences/preferences.component';

export const routes: Routes = [
  { path: '', component: TimeslotsComponent },
  { path: 'preferences', component: PreferencesComponent },
];
