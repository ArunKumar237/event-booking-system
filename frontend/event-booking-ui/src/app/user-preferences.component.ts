import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from './api.service';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-preferences',
  imports: [CommonModule, FormsModule],
  template: `
    <h2>User Preferences</h2>

    <div *ngFor="let cat of categories">
      <input
        type="checkbox"
        [value]="cat.id"
        [(ngModel)]="selected[cat.id]"
      />
      {{ cat.name }}
    </div>

    <button (click)="save()">Save</button>
  `
})
export class UserPreferencesComponent implements OnInit {

  categories = [
    { id: 1, name: 'Cat 1' },
    { id: 2, name: 'Cat 2' },
    { id: 3, name: 'Cat 3' }
  ];

  selected: any = {};

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPreferences().subscribe((res: any) => {
      res.categories.forEach((id: number) => {
        this.selected[id] = true;
      });
    });
  }

  save() {
    const chosen = Object.keys(this.selected)
      .filter(k => this.selected[k])
      .map(k => Number(k));

    this.api.savePreferences(chosen).subscribe();
  }
}
