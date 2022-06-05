import { Component, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserApiService } from '../../shared/api/user.service';

@Component({
  selector: 'shoppingstore-emailactivation',
  templateUrl: './emailactivation.component.html',
  styleUrls: ['./emailactivation.component.scss']
})
export class EmailactivationComponent implements OnDestroy {

  token: string;
  message: string;
  loadingSpinner: boolean;
  login: boolean;
  register: boolean;
  destroy$ = new Subject();

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private userApiService: UserApiService) {

    this.token = this.route.snapshot.params['token'];
    this.message = ''
    this.loadingSpinner = true;
    this.login = false;
    this.register = false;

    const data = {
      activatetoken: this.token
    }

    this.userApiService.activate(data)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        this.message = 'لقد تم تفعيل البريد الإلكتروني الخاص بك'
        this.login = true;
      },
      error: (e) => {
        if(e.error.status === 403) {
          this.message = e.error.error
          this.login = true;
        }
        else {
          this.message = e.error.error
        }
      },
    })
    this.loadingSpinner = false;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
