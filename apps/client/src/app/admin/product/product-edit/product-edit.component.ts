import { Component, OnInit, OnDestroy  } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Product } from '../../../shared/interface/product';
import { environment } from '../../../../environments/environment';
import { FileApiService } from '../../../shared/api/file.service';
import { ProductApiService } from '../../../shared/api/product.service';
import { Category } from '../../../shared/interface/category';
import { ProductEdit } from '../../../shared/interface/product-edit';
import { CategoryApiService } from '../../../shared/api/category.service';

@Component({
  selector: 'shoppingstore-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit, OnDestroy {

  title!: string;
  form!: FormGroup;
  product!: Product;
  id = '';
  name = '';
  productCode = '';
  price = '';
  isFavorite!: boolean;
  isAvailable!: boolean;
  category = '';

  categories!: Category[];
  catID!: string;

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
  preview!: any

  constructor(private productApiService: ProductApiService,
    private categoryApiService: CategoryApiService,
    private fileApiService: FileApiService,
    private cookieService: CookieService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name : ['', [Validators.required]],
      productCode : ['', [Validators.required]],
      price : ['', [Validators.required]],
      isFavorite : ['', [Validators.required]],
      isAvailable : ['', [Validators.required]],
      file : [''],
      fileName : ['', [Validators.required]],
      fileURL : ['', [Validators.required]],
      file_low : [''],
      fileName_low : ['', [Validators.required]],
      fileURL_low : ['', [Validators.required]],
      category : [''],
    });

    this.itemId = this.route.snapshot.params['id'];
    this.getCategories()

    this.form.valueChanges.subscribe((res) => {
      this.queryError = ''
      this.catID = res.category
    });

    if(this.itemId !== undefined) {
      this.isupdateview = true
      this.title = 'تحديث المنتج'
      this.productApiService.getOne(this.itemId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: Product) => {
        this.product = res;
        this.id = this.product.id ?? '';
        this.form.setValue({
          productCode: this.product.productCode,
          name: this.product.name,
          price: this.product.price,
          isFavorite: this.product.isFavorite,
          isAvailable: this.product.isAvailable,
          file: '', // It could open security risks otherwise
          fileName: this.product.fileName,
          fileURL: this.product.fileURL,
          file_low : [''], // It could open security risks otherwise
          fileName_low: this.product.fileName_low,
          fileURL_low: this.product.fileURL_low,
          category: +this.product.category.id,
        });
      })
    } else {
      this.isupdateview = false
      this.title = 'إنشاء المنتج'
      this.form.setValue({
        productCode: this.generateRandomProductCode(6),
        name: '',
        price: '',
        isFavorite: false,
        isAvailable: false,
        file: '',
        fileName: '',
        fileURL: '',
        file_low : '',
        fileName_low: '',
        fileURL_low: '',
        category: '',
      });
    }
  }

  get f() {
    return this.form.controls;
  }

  getCategories() {
    this.categoryApiService.getAll()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (data: Category[]) =>  {
        this.categories = data
        this.loadingSpinner = false;
      },
      error: (e) => console.error(e),
    })
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

  create(data: ProductEdit) {
    if(this.fileSize > 1000) {
      this.loadingSpinner = false;
      this.sizeLimit = `حجم الملف: ${this.formatBytes(this.file.size)}، حد الحجم المقبول أصغر من 1 MB`
    }
    else if(this.file.name === this.file_low.name) {
      this.queryError = 'لا يجب إختيار نفس الصورة'
    }
    else if(this.file.name !== this.file_low.name) {
      const name = data.name
      const productCode = data.productCode
      const price = data.price
      const isFavorite = data.isFavorite
      const isAvailable = data.isAvailable

      this.fileApiService.uploadMultiple(this.file, this.file_low)
      .subscribe({
        next: (response) =>  {
          const fileName = response['High'][0].filename
          const fileURL = `${this.api}/api/upload/${fileName}`
          const fileName_low = response['Low'][0].filename
          const fileURL_low = `${this.api}/api/upload/${fileName_low}`
          this.createProduct({name, productCode, price, isFavorite, isAvailable, fileName, fileURL, fileName_low, fileURL_low})
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
  createProduct(data: ProductEdit) {
    this.productApiService.create(data, this.catID)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        this.form.reset();
        this.router.navigateByUrl('admin/product')
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

  update(id: string, data: ProductEdit) {
    const name = data.name
    const productCode = data.productCode
    const price = data.price
    const isFavorite = data.isFavorite
    const isAvailable = data.isAvailable

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
        this.fileApiService.deleteMultiple(this.product.fileName, this.product.fileName_low)
        .pipe(takeUntil(this.destroy$))
        .subscribe({error: (e) => console.error(e)})

        this.fileApiService.uploadMultiple(this.file, this.file_low)
        .subscribe({
          next: (response) =>  {
            const fileName = response['High'][0].filename
            const fileURL = `${this.api}/api/upload/${fileName}`
            const fileName_low = response['Low'][0].filename
            const fileURL_low = `${this.api}/api/upload/${fileName_low}`
            this.updateProduct(id, {name, productCode, price, isFavorite, isAvailable, fileName, fileURL, fileName_low, fileURL_low})
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
      this.updateProduct(id, {name, productCode, price, isFavorite, isAvailable, fileName, fileURL, fileName_low, fileURL_low})
    }
    this.loadingSpinner = false;
    this.submitted = false;
  }
  updateProduct(id: string, data: ProductEdit) {
    // const {name, fileName, fileURL, fileName_low, fileURL_low} = data
    this.productApiService.update(id, data, this.catID)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () =>  {
        this.form.reset();
        this.router.navigateByUrl('admin/product')
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

  setTotalAmount() {
    const a = Number(this.form.get(['stockQuantity'])?.value);
    const b = Number(this.form.get(['price'])?.value);

    // sum
    const x = +Number(a * b);
    // result
    this.price = x.toFixed(3);
  }

  isAvailableEvent(isAvailable: boolean) {
    this.isAvailable = isAvailable;
  }

  generateRandomProductCode(length: number) {
    const result = [];
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * charactersLength)));
    }
    return result.join('');
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
