import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PurchaseApiService } from '../../../shared/api/purchase.service';
import { Purchase } from '../../../shared/interface/purchase';
import * as moment from 'moment';

@Component({
  selector: 'shoppingstore-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit, OnDestroy  {

  purchase!: Purchase;
  loadingSpinner!: boolean;
  id!: string;
  convertedtohijri!: string;
  destroy$ = new Subject();

  constructor(private purchaseApiService: PurchaseApiService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute) {

    this.id = this.route.snapshot.params['id'];
    moment.locale('ar-TN');
    this.convertedtohijri = ''
  }

  ngOnInit() {
    this.getOne()
  }

  getOne() {
    this.loadingSpinner = true;
    this.purchaseApiService.getOne(this.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Purchase) =>  {
        this.purchase = data;
        this.convertedtohijri = moment(data.created, 'YYYY-M-D').format('iYYYY/iM/iDهـ الموافق YYYY/M/D');
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  delete(id: string) {
    id = this.id
    this.purchaseApiService.delete(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {this.router.navigateByUrl('admin/purchase')},
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
