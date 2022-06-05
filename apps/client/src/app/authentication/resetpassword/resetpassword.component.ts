import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ResetPasswordType } from '@shoppingstore/api-interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { validateWhitespaces } from '../../shared/validators';
import { environment } from '../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { UserApiService } from '../../shared/api/user.service';

@Component({
  selector: 'shoppingstore-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit, OnDestroy {

  submitted = false;
  loadingSpinner = false;
  queryError!: string;

  firstForm!: FormGroup;
  secondForm!: FormGroup;
  thirdForm!: FormGroup;
  email = '';
  password = '';
  verificationCode = '';
  enableStepper = false
  destroy$ = new Subject();
  readonly: boolean

  cookieUserRole: string = environment.cookieUserRole

  constructor(private userApiService: UserApiService,
    private cookieService: CookieService,
    private location: Location,
    private formBuilder: FormBuilder) {
    this.readonly = false
  }

  ngOnInit() {
    this.cookieService.delete(this.cookieUserRole, '/')

    this.firstForm = this.formBuilder.group({
      email : ['', [Validators.required, validateWhitespaces]],
    });

    this.secondForm = this.formBuilder.group({
      verificationCode : ['', [Validators.required, validateWhitespaces]],
    });

    this.thirdForm = this.formBuilder.group({
      password : ['', [Validators.required, validateWhitespaces]],
    });

    this.firstForm.valueChanges.subscribe(() => {
      this.queryError = ''
    });
    this.secondForm.valueChanges.subscribe(() => {
      this.queryError = ''
    });
    this.thirdForm.valueChanges.subscribe(() => {
      this.queryError = ''
    });
  }

  get f1() {
    return this.firstForm.controls
  }

  get f2() {
    return this.secondForm.controls
  }

  get f3() {
    return this.thirdForm.controls
  }

  onFirstSubmit(stepper: any) {
    const data = this.firstForm.value;
    if (this.firstForm.invalid) {
      return;
    }
    this.submitted = true;
    this.loadingSpinner = true;

    this.userApiService.sendVerificationCode(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        stepper.next()
        this.queryError = 'إنسخ الرمز من بريدك الخاص، إذا لم يصلك بعد الرجاء إعادة المحاولة'
        this.loadingSpinner = false;
      },
      error: (e) => {
        this.queryError = e.error.error
        if(!e.error.status) console.log(e)
        this.loadingSpinner = false;
      }
    })
    this.submitted = false;
  }

  onSecondSubmit(stepper: any) {
     const data = this.secondForm.value;
    if (this.secondForm.invalid) {
      return;
    }
    this.submitted = true;
    this.loadingSpinner = true;

    const input: ResetPasswordType = {
      email: this.firstForm.get('email')?.value,
      code: data.verificationCode,
    }

    this.userApiService.verifyCode(input)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        stepper.next()
        this.queryError = ''
        this.loadingSpinner = false;
      },
      error: (e) => {
        this.queryError = e.error.error
        if(!e.error.status) console.log(e)
        this.loadingSpinner = false;
      }
    })
    this.submitted = false;
  }

  onThirdSubmit(stepper: any) {
    this.submitted = true;
    const data = this.thirdForm.value;
    if (this.thirdForm.invalid) {
      return;
    }
    this.loadingSpinner = true;

    const input: ResetPasswordType = {
      email: this.firstForm.get('email')?.value,
      password: data.password,
    }

    this.userApiService.resetPassowrd(input)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        stepper.next()
        this.loadingSpinner = false;
      },
      error: (e) => {
        console.log(e)
        let errorMessages: Array<string> = []
        if(e.error.message) {
          errorMessages = e.error.message
          errorMessages.forEach(i => {
            this.queryError = i
          })
        }
        this.loadingSpinner = false;
      },
    })
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
