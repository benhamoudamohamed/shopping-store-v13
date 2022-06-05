import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import * as moment from 'moment-hijri';
import { UserRole } from '@shoppingstore/api-interfaces';
import { CookieService } from 'ngx-cookie-service';
import { NbDialogService } from '@nebular/theme';
import { Category } from '../../../shared/interface/category';
import { Product } from '../../../shared/interface/product';
import { FileApiService } from '../../../shared/api/file.service';
import { CategoryApiService } from '../../../shared/api/category.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'shoppingstore-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {

  loadingSpinner = false;
  category!: Category;
  products!: Product[];
  id: string;
  convertedtohijri: string
  destroy$ = new Subject();

  adminUser!: UserRole
  userRole: string;

  constructor(private categoryApiService: CategoryApiService,
    private fileApiService: FileApiService,
    private dialogService: NbDialogService,
    private cookieService: CookieService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'] ?? '';
    moment.locale('ar-TN');
    this.convertedtohijri = ''

    this.adminUser = UserRole.ADMIN
    const role = environment.cookieUserRole
    this.userRole = this.cookieService.get(role)
  }

  ngOnInit() {
    this.getOne()
  }

  getOne() {
    this.loadingSpinner = true;
    this.categoryApiService.getOne(this.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Category) =>  {
        this.category = data;
        this.products = data.products
        this.convertedtohijri = moment(data.created, 'YYYY-M-D').format('iYYYY/iM/iDهـ الموافق YYYY/M/D');
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  update(id: string) {
    this.router.navigateByUrl(`admin/category/edit/${id})`)
  }

  openDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: ''});
  }

  view(id: string) {
    this.router.navigateByUrl(`admin/product/detail/${id})`)
  }

  delete(id: string) {
    id = this.id

    this.fileApiService.deleteMultiple(this.category.fileName, this.category.fileName_low)
    .pipe(takeUntil(this.destroy$))
    .subscribe({error: (e) => console.error(e)})

    this.categoryApiService.delete(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {this.router.navigateByUrl('admin/category')},
      error: (e) => console.error(e),
    })
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}

