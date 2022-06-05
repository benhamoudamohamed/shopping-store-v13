import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Category } from '../../../shared/interface/category';
import { environment } from '../../../../environments/environment';
import { FileApiService } from '../../../shared/api/file.service';
import { CategoryApiService } from '../../../shared/api/category.service';
import { CategoryEdit } from '../../../shared/interface/categorygroup-edit';

@Component({
  selector: 'shoppingstore-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit, OnDestroy  {

  title!: string;
  form!: FormGroup;
  category!: Category;
  id = '';
  name = '';
  fileName!: string;
  fileURL!: string;
  fileName_low!: string;
  fileURL_low!: string;
  isTypesupported!: string
  sizeLimit!: string;
  file: any;
  file_low: any;
  fileSize: any;
  destroy$ = new Subject();

  submitted = false;
  queryError!: string;
  loadingSpinner = false;
  itemId!: string;
  isupdateview!: boolean;

  api: string = environment.api_server;
  companyID!: string;

  preview!: any

  fileNamesArray: Array<any> = []

  constructor(private categoryApiService: CategoryApiService,
    private fileApiService: FileApiService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name : ['', [Validators.required]],
      file : [''],
      fileName : ['', [Validators.required]],
      fileURL : ['', [Validators.required]],
      file_low : [''],
      fileName_low : ['', [Validators.required]],
      fileURL_low : ['', [Validators.required]],
    });

    this.form.valueChanges.subscribe(() => {
      this.queryError = ''
    });

    this.itemId = this.route.snapshot.params['id'];

    if(this.itemId !== undefined) {
      this.isupdateview = true
      this.title = 'تحديث فئة المنتجات'
      this.categoryApiService.getOne(this.itemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: Category) => {
        this.category = res;
        this.id = this.category.id ?? '';
        this.form.setValue({
          name: this.category.name,
          file: '', // It could open security risks otherwise
          fileName: this.category.fileName,
          fileURL: this.category.fileURL,
          file_low : [''], // It could open security risks otherwise
          fileName_low: this.category.fileName_low,
          fileURL_low: this.category.fileURL_low,
        });
      })
    } else {
      this.isupdateview = false
      this.title = 'إنشاء فئة المنتجات'
      this.form.setValue({
        name: '',
        file: '',
        fileName: '',
        fileURL: '',
        file_low : '',
        fileName_low: '',
        fileURL_low: '',
      });
    }
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
    if(this.itemId !== undefined) {
      this.update(this.itemId, data)
    } else {
      this.create(data)
    }
  }

  create(data: CategoryEdit) {
    if(this.fileSize > 1000) {
      this.loadingSpinner = false;
      this.sizeLimit = `حجم الملف: ${this.formatBytes(this.file.size)}، حد الحجم المقبول أصغر من 1 MB`
    }
    else if(this.file.name === this.file_low.name) {
      this.queryError = 'لا يجب إختيار نفس الصورة'
    }
    else if(this.file.name !== this.file_low.name) {
      const name = data.name

      this.fileApiService.uploadMultiple(this.file, this.file_low)
      .subscribe({
        next: (response) =>  {
          const fileName = response['High'][0].filename
          const fileURL = `${this.api}/api/upload/${fileName}`
          const fileName_low = response['Low'][0].filename
          const fileURL_low = `${this.api}/api/upload/${fileName_low}`
          this.createProductGroup({name, fileName, fileURL, fileName_low, fileURL_low})
        },
        error: (e) => {
          if(e.error.message) {
            this.queryError = e.error.message
          }
          else {
            this.queryError = 'خطأ من الخادم الداخلي'
          }
        },
      })
    }
    this.submitted = false;
    this.loadingSpinner = false;
  }
  createProductGroup(data: CategoryEdit) {
    const {name, fileName, fileURL, fileName_low, fileURL_low} = data
    this.categoryApiService.create({name, fileName, fileURL, fileName_low, fileURL_low})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        this.form.reset();
        this.router.navigateByUrl('admin/category')
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
  }

  update(id: string, data: CategoryEdit) {
    const name = data.name

    if( (!this.file && this.file_low) || (this.file && !this.file_low) ){
      this.loadingSpinner = false;
      this.submitted = false;
      this.queryError = 'لا يجب إختيار صورة واحدة دون الأخرى، في حالة عدم إختيار كلتا الصورتين يتم إعتماد الصورتين السابقتين.'
      return;
    }
    if(this.file && this.file_low) {
      if(this.fileSize > 1000) {
        this.loadingSpinner = false;
        this.sizeLimit = `حجم الملف: ${this.formatBytes(this.file.size)}، حد الحجم المقبول أصغر من 1 MB`
      }
      else if(this.file.name === this.file_low.name) {
        this.queryError = 'لا يجب إختيار نفس الصورة'
      }
      else if(this.file.name !== this.file_low.name) {
        // Delete old images first
        this.fileApiService.deleteMultiple(this.category.fileName, this.category.fileName_low)
        .pipe(takeUntil(this.destroy$))
        .subscribe({error: (e) => console.error(e)})

        this.fileApiService.uploadMultiple(this.file, this.file_low)
        .subscribe({
          next: (response) =>  {
            const fileName = response['High'][0].filename
            const fileURL = `${this.api}/api/upload/${fileName}`
            const fileName_low = response['Low'][0].filename
            const fileURL_low = `${this.api}/api/upload/${fileName_low}`
            this.updateProductGroup(id, {name, fileName, fileURL, fileName_low, fileURL_low})
          },
          error: (e) => {
            if(e.error.message) {
              this.queryError = e.error.message
            }
            else {
              this.queryError = 'خطأ من الخادم الداخلي'
            }
          },
        })
      }
    }
    else if(!this.file && !this.file_low){
      const fileName = data.fileName
      const fileURL = data.fileURL
      const fileName_low = data.fileName_low
      const fileURL_low = data.fileURL_low
      this.updateProductGroup(id, {name, fileName, fileURL, fileName_low, fileURL_low})
    }
    this.loadingSpinner = false;
    this.submitted = false;
  }

  updateProductGroup(id: string, data: CategoryEdit) {
    const {name, fileName, fileURL, fileName_low, fileURL_low} = data
    this.categoryApiService.update(id, {name, fileName, fileURL, fileName_low, fileURL_low})
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        this.form.reset();
        this.router.navigateByUrl('admin/category')
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
  }

  onFileSecelected(event: any) {
    if (event.target.files && event.target.files.length) {
      const file: File = event.target.files[0];
      this.file = file

      const src = URL.createObjectURL(this.file);
      const preview: any = document.getElementById("file-1-preview");
      preview.src = src

      if(this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
        this.isTypesupported = ''
        this.fileSize = Math.round(this.file.size / 1024)

        if(this.fileSize <= 1000) {
          this.sizeLimit = `حجم الملف: ${this.formatBytes(this.file.size)}، الحجم مقبول`
        } else {
          this.sizeLimit = `حجم الملف: ${this.formatBytes(this.file.size)}، حد الحجم المقبول أصغر من 1 MB`
          this.form.patchValue({
            file: '',
          });
        }
        this.form.patchValue({
          fileName: 's',
          fileURL: 's',
        });
      } else {
        this.isTypesupported = `نوع الملف غير مقبول, ${this.file.type}`
        this.form.patchValue({
          file: '',
        });
      }
    }
    else {
      return;
    }
  }

  onFileSecelectedLow(event: any) {
    if (event.target.files && event.target.files.length) {
      const file: File = event.target.files[0];
      this.file_low = file

      const src = URL.createObjectURL(this.file_low);
      const preview: any = document.getElementById("file-2-preview");
      preview.src = src

      if(this.file_low.type === 'image/jpeg' || this.file_low.type === 'image/png') {
        this.isTypesupported = ''
        this.fileSize = Math.round(this.file_low.size / 1024)

        if(this.fileSize <= 1000) {
          this.sizeLimit = `حجم الملف: ${this.formatBytes(this.file_low.size)}، الحجم مقبول`
        } else {
          this.sizeLimit = `حجم الملف: ${this.formatBytes(this.file_low.size)}، حد الحجم المقبول أصغر من 1 MB`
          this.form.patchValue({
            file_low: '',
          });
        }
        this.form.patchValue({
          fileName_low: 's',
          fileURL_low: 's',
        });
      } else {
        this.isTypesupported = `نوع الملف غير مقبول, ${this.file_low.type}`
        this.form.patchValue({
          file_low: '',
        });
      }
    }
    else {
      return;
    }
  }

  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}

