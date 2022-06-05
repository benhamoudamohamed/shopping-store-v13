import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CategoryApiService } from '../../shared/api/category.service';
import { Category } from '../../shared/interface/category';

@Component({
  selector: 'shoppingstore-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy  {

  loadingSpinner = false;
  categories!: Category[]
  private readonly destroy$ = new Subject();

  constructor(private categoryApiService: CategoryApiService, private router: Router) { }

  ngOnInit() {
    this.loadAllCategories()
  }

  loadAllCategories() {
    this.loadingSpinner = true;
    this.categoryApiService.getAll()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Category[]) =>  {
        this.categories = data
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  onClick(id: string) {
    this.router.navigateByUrl(`store/products/${id})`)
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
