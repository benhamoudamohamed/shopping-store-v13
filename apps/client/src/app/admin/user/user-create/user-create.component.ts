import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { UserApiService } from '../../../shared/api/user.service';
import { User } from '../../../shared/interface/user';
import { validateWhitespaces } from '../../../shared/validators';

@Component({
  selector: 'shoppingstore-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit, OnDestroy  {

  title!: string;
  form!: FormGroup;
  user!: User;
  fullname = '';
  password = '';
  email = '';
  userRole = '';
  destroy$ = new Subject();

  submitted = false;
  queryError!: string;
  loadingSpinner = false;
  itemId!: string;

  constructor(private userApiService: UserApiService,
    private cookieService: CookieService,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      fullname : ['', [Validators.required]],
      password : ['', [Validators.required, validateWhitespaces]],
      email : ['', [Validators.required, validateWhitespaces]],
      userRole : ['', [Validators.required]],
    });

    this.form.valueChanges.subscribe(() => {
      this.queryError = ''
    });

    this.title = 'إرسال دعوة'
    this.form.setValue({
      fullname: '',
      password: '',
      email: '',
      userRole: null
    });
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
    this.create(data)
  }

  create(data: User) {
    this.userApiService.register(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        this.form.reset();
        this.router.navigateByUrl('admin/user')
      },
      error: (e) => {
        if(e.error.status === 406) {
          this.queryError = 'لم نستطيع أن نرسل لك رابط تفعيل البريد الإلكتروني، يرجى التحقق من العنوان الذي أدخلته أو أعد المحاولة'
        }
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
    this.submitted = false;
    this.loadingSpinner = false;
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
