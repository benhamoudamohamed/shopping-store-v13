import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'apps/client/src/environments/environment';
import { UserApiService } from '../../../shared/api/user.service';
import { User } from '../../../shared/interface/user';

@Component({
  selector: 'shoppingstore-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit, OnDestroy  {

  title!: string;
  form!: FormGroup;
  user!: User;
  id = '';
  fullname = '';
  email = '';
  destroy$ = new Subject();

  submitted = false;
  queryError!: string;
  loadingSpinner = false;
  itemId!: string;

  constructor(private userApiService: UserApiService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      fullname : ['', [Validators.required]],
    });

    this.form.valueChanges.subscribe(() => {
      this.queryError = ''
    });

    this.itemId = this.route.snapshot.params['id'];
    this.title = 'تحديث المستخدم'
    this.userApiService.getOne(this.itemId)
    .pipe(takeUntil(this.destroy$))
    .subscribe((res: User) => {
      this.user = res
      this.id = this.user.id;
      this.email = this.user.email;
      this.form.setValue({
        fullname: this.user.fullname,
      });
    })
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    const data = this.form.value;
    if (this.form.invalid) {
      return;
    }
    this.loadingSpinner = true;
    this.update(this.itemId, data)
  }

  update(id: string, data: User) {
    this.userApiService.updateName(id, data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: User) =>  {
        this.user.fullname = res.fullname;
        const userName = environment.cookieUserName
        this.cookieService.set(userName, res.fullname, {expires: 7, path: '/', secure: true, sameSite: 'Lax'});
        this.form.reset();
        this.router.navigateByUrl(`admin/user`);
      },
      error: (e) => {
        if(e.error.message) {
          let errorMessages: Array<string> = []
          errorMessages = e.error.message
          errorMessages.forEach(i => {
            this.queryError = i
          })
        }
        else {
          this.queryError = 'خطأ من الخادم الداخلي'
        }
      },
    })
    this.loadingSpinner = false;
    this.submitted = false;
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
