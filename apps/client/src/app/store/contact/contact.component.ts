import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { ContactApiService } from '../../shared/api/contactus.service';

@Component({
  selector: 'shoppingstore-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  fullname = '';
  email = '';
  phone = '';
  subject = '';
  message = '';
  submitted = false;
  loadingSpinner = false;
  feedback = '';
  queryError!: string;
  private readonly destroy$ = new Subject();

  constructor(private formBuilder: FormBuilder, private contactApiService: ContactApiService, private location: Location) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      subject : ['', [Validators.required]],
      fullname : ['', [Validators.required]],
      email : ['', [Validators.required]],
      phone : ['', [Validators.required]],
      message : ['', [Validators.required]],
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
    const data = this.form.value;
    if (this.form.invalid) {
      return;
    }
    this.loadingSpinner = true;

    this.contactApiService.create(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        this.form.reset();
        this.feedback = 'تم إرسال رسالتك بنجاح'
        setTimeout(() => {
          this.feedback = ''
        }, 3000)
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
    this.submitted = false;
    this.loadingSpinner = false;

    // this.contactApiService.create(data)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(() => {
    //     this.loadingSpinner = false;
    //     this.submitted = false;
    //     this.form.reset();
    //     this.feedback = 'Your message is sent successfully'
    //     setTimeout(() => {
    //       this.feedback = ''
    //     }, 3000)
    //   }, (error: any) => {
    //     console.log(error)
    //     this.loadingSpinner = false
    //     this.queryError = error.error.message
    //   }
    // );
  }

  keyPressNumbers(event: any) {
    const charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
