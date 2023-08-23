import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MultiSelectService {
  private categoriesSubject = new BehaviorSubject<Array<string>>([]);
  categories$ = this.categoriesSubject.asObservable();
  categories: Array<string> = [];
  allCategories: Array<string> = Array.from({ length: 1000 }, (_, i) => `item #${i}`);

  constructor() {
    this.getNextItems();
    this.categoriesSubject.next(this.categories);
  }

  loadMore(): void {
    if (this.getNextItems()) {
      this.categoriesSubject.next(this.categories);
    }
  }

  getNextItems(): boolean {
    if (this.categories.length >= this.allCategories.length) {
      return false;
    }
    const remainingLength = Math.min(100, this.allCategories.length - this.categories.length);
    this.categories.push(...this.allCategories.slice(this.categories.length, this.categories.length + remainingLength));
    return true;
  }
}
