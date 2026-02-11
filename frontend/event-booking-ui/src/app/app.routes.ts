import { Routes } from '@angular/router';
import { CalendarComponent } from './calender/calendar.component';
import { LoginComponent } from './login.component';

export const routes: Routes = [
    { path: '', redirectTo: 'calendar', pathMatch: 'full' },
    { path: 'calendar', component: CalendarComponent },
    { path: 'login', component: LoginComponent }

];
