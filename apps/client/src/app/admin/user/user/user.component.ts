import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import * as moment from 'moment-hijri';
import { CookieService } from 'ngx-cookie-service';
import { NbDialogService } from '@nebular/theme';
import { UserRole } from '@shoppingstore/api-interfaces';
import { environment } from '../../../../environments/environment';
import { UserApiService } from '../../../shared/api/user.service';
import { User } from '../../../shared/interface/user';

@Component({
  selector: 'shoppingstore-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  loadingSpinner = false;
  user!: User;
  id: string;
  convertedtohijri: string
  destroy$ = new Subject();

  adminUser!: UserRole
  userID: string;
  userRole: string;
  display!: boolean;

  constructor(private userApiService: UserApiService,
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
    const ID = environment.cookieUserId
    this.userID = this.cookieService.get(ID)

    if (this.userRole === UserRole.ADMIN) {
      this.display = true;
    }
    if (this.userRole === UserRole.USER) {
      this.display = false;
    }
  }
  ngOnInit() {
    this.getOne()
  }

  getOne() {
    this.loadingSpinner = true;
    this.userApiService.getOne(this.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: User) =>  {
        this.user = data;
        this.convertedtohijri = moment(data.created, 'YYYY-M-D').format('iYYYY/iM/iDهـ الموافق YYYY/M/D');
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
  }

  update(id: string) {
    this.router.navigateByUrl(`admin/user/edit/${id})`)
  }

  openDialog(dialog: TemplateRef<any>) {
    this.dialogService.open(dialog, { context: ''});
  }

  delete(id: string) {
    id = this.id
    this.userApiService.delete(id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {this.router.navigateByUrl('admin/user')},
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
