import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { CouponApiService } from '../../../shared/api/coupon.service';
import { Coupon } from '../../../shared/interface/coupon';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'shoppingstore-coupon',
  templateUrl: './coupon.component.html',
  styleUrls: ['./coupon.component.scss']
})
export class CouponComponent implements OnInit, OnDestroy  {

  coupon!: Coupon;
  id!: string;
  qrdata!: string;
  loadingSpinner!: boolean;
  convertedtohijri: string
  destroy$ = new Subject();

  constructor(private couponApiService: CouponApiService,
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
    this.couponApiService.getOne(this.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Coupon) =>  {
        this.coupon = data;
        this.qrdata = data.code
        this.convertedtohijri = moment(data.created, 'YYYY-M-D').format('iYYYY/iM/iDهـ الموافق YYYY/M/D');
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  update(id: string) {
    this.router.navigateByUrl(`admin/coupon/edit/${id})`)
  }

  downloadQRCode() {
    const fileNameToDownload = 'image_qrcode';
    const base64Img = document.getElementsByClassName('coolQRCode')[0].children[0].attributes[0].value
    fetch(base64Img)
    .then(res => res.blob())
    .then((blob) => {
      // IE
      const nav = (window.navigator as any);
      if (nav.msSaveOrOpenBlob) {
        nav.msSaveOrOpenBlob(blob, base64Img);
      }
      else { // Chrome
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileNameToDownload;
        link.click();
      }
    })
  }

  delete(id: string) {
    id = this.id
    this.couponApiService.delete(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {this.router.navigateByUrl('admin/coupon')},
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
