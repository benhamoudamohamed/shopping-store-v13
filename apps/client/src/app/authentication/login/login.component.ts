import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { validateWhitespaces } from '../../shared/validators';
import { AuthService } from '../../shared/api/auth.service';

@Component({
  selector: 'shoppingstore-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {

  form: FormGroup;
  email = '';
  password = '';
  submitted = false;
  queryError = '';
  loadingSpinner = false;
  destroy$ = new Subject();

  constructor(private authService: AuthService,
    private router: Router,
    private location: Location,
    private formBuilder: FormBuilder) {

    if (this.authService.isAccessTokenExpired()) {
      this.router.navigateByUrl('admin')
    }

    this.form = this.formBuilder.group({
      email : ['', [Validators.required, validateWhitespaces]],
      password : ['', [Validators.required, validateWhitespaces]],
    });

    this.form.valueChanges.subscribe(() => {
      this.queryError = ''
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loadingSpinner = true;
    const data = this.form.value;
    if (this.form.invalid) {
      return;
    }

    this.authService.login(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        this.form.reset();
        this.router.navigateByUrl('admin');
      },
      error: (e) => {
        console.log(e)
        this.queryError = e.error.error
        if(!e.error.status) console.log(e)
        this.router.navigateByUrl('login');
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
