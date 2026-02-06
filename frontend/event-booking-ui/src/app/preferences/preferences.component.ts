import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

type Category = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <h2>Preferences</h2>

      <div *ngIf="categories.length > 0; else empty">
        <label *ngFor="let category of categories" class="category-row">
          <input
            type="checkbox"
            [checked]="isSelected(category.id)"
            (change)="toggleCategory(category.id)"
          />
          <span>{{ category.name }}</span>
        </label>
      </div>

      <ng-template #empty>
        <div>No categories found.</div>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .category-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 4px 0;
      }
    `,
  ],
})
export class PreferencesComponent implements OnInit {
  categories: Category[] = [];
  private readonly storageKey = 'selectedCategoryIds';
  private readonly selectedIds = new Set<number>();

  constructor(
    private readonly api: ApiService,
    private readonly cdr: ChangeDetectorRef
  ) {}


  ngOnInit(): void {
    this.loadSelection();
    this.api.getCategories().subscribe((response) => {
      this.categories = Array.isArray(response) ? response : [];
      this.cdr.detectChanges();
    });

  }

  isSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  toggleCategory(id: number): void {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }

    this.saveSelection();
  }

  private loadSelection(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as number[];
      if (Array.isArray(parsed)) {
        parsed.forEach((id) => this.selectedIds.add(Number(id)));
      }
    } catch {
      // Ignore invalid storage values.
    }
  }

  private saveSelection(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(Array.from(this.selectedIds)));
  }
}
