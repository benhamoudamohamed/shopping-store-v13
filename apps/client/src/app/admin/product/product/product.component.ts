import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import * as moment from 'moment-hijri';
import { UserRole } from '@shoppingstore/api-interfaces';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { NbDialogService } from '@nebular/theme';
import { FileApiService } from '../../../shared/api/file.service';
import { ProductApiService } from '../../../shared/api/product.service';
import { Product } from '../../../shared/interface/product';

@Component({
  selector: 'shoppingstore-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, OnDestroy {

  loadingSpinner = false;
  product!: Product;
  id: string;
  convertedtohijri: string
  destroy$ = new Subject();

  adminUser!: UserRole
  userRole: string;

  constructor(private productApiService: ProductApiService,
    private fileApiService: FileApiService,
    private dialogService: NbDialogService,
    private cookieService: CookieService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute) {
    this.id = this.route.snapshot.params['id'];
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
    this.productApiService.getOne(this.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Product) =>  {
        this.product = data;
        this.convertedtohijri = moment(data.created, 'YYYY-M-D').format('iYYYY/iM/iDهـ الموافق YYYY/M/D');
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  update(id: string) {
    this.router.navigateByUrl(`admin/product/edit/${id})`)
  }

  openDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: ''});
  }

  delete(id: string) {
    id = this.id

    this.fileApiService.deleteMultiple(this.product.fileName, this.product.fileName_low)
    .pipe(takeUntil(this.destroy$))
    .subscribe({error: (e) => console.error(e)})

    this.productApiService.delete(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {this.router.navigateByUrl('admin/product')},
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
