import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, Validators, FormGroup} from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { switchMap } from 'rxjs';
import { Book } from '../../interfaces/book.interface';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api'
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileSelectEvent } from 'primeng/fileupload';
import { FileUploadModule } from 'primeng/fileupload'

@Component({
  selector: 'app-new-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    ToastModule,
    CommonModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    CardModule,
    FileUploadModule,
  ],
  templateUrl: './new-page.component.html',
  styleUrl: './new-page.component.scss'
})
export class NewPageComponent implements OnInit {

  public formBook!: FormGroup;
  public isSaveInProgress = signal<boolean>(false);
  private bookService = inject(BookService);
  public router = inject(Router);
  private activeRouter = inject(ActivatedRoute);
  private messageService = inject(MessageService);
  private selectedFile: File | null = null;
  public selectedImageName: string = '';
  public uploadedFileName: string | null = null;


  constructor(private fb: FormBuilder){
    this.formBook = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      author: ['', Validators.required],
      pages: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
      image: [null]
    });
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) {
      return;
    }
    this.activeRouter.params
      .pipe(switchMap(({ id }) => this.bookService.getBookById(id)))
      .subscribe({
        next: (book) => {
          if (!book) {
            this.router.navigateByUrl('/');
            return;
          }
          this.formBook.reset(book);
        },
        error: () => this.router.navigateByUrl('/'),
      });
  }

  public onFileSelected(event: FileSelectEvent) {
    this.selectedFile = event.files[0];

  }

  handleFileSelect(event: any): void {
    const file = event.files[0];
    if (file) {
      this.uploadedFileName = file.name;
    }
    // Ejecutar la lógica previa según corresponda
    this.formBook.get('id')?.value
      ? this.changeImage(event)
      : this.onFileSelected(event);
  }
  changeImage(event: FileSelectEvent) {
    this.selectedFile = event.files[0];
    if (!this.selectedFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Seleccione una imagen e intente nuevamente',
      });
      return;
    }
    this.isSaveInProgress.set(true);
    this.bookService.updateBookImage(this.formBook.value.id, this.selectedFile).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: 'Libro actualizado correctamente',
        });
        this.isSaveInProgress.set(false);
        this.router.navigateByUrl('/');
      },
      error: () => {
        this.isSaveInProgress.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Revise el archivo seleccionado',
        });
      },
    });
  }

  public onSubmit(): void {
    if ( this.formBook.invalid ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Check the fields and try again.`,
      });
      return;
    };
    if ( !this.selectedFile && !this.formBook.get('id')?.value ) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Select an Image.`,
      });
      return;
    };

    const { id, ...book } = this.formBook.value;

    const saveObservable = id
    ? this.bookService.updateBook(id, book as Book)
    : this.bookService.createBook(book as Book, this.selectedFile!);

    saveObservable.subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: id ? 'Book Updated' : 'Book Created',
          detail: `Book "${response.title}" was successfully ${
            id ? 'updated' : 'created'
          }!`,
        });
        // if (!id) {
          this.router.navigate(['/']);
          // this.formBook.reset();
        // }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to ${id ? 'update' : 'create'} the book.`,
        });
      },
      complete: () => this.isSaveInProgress.set(false),
    });
  }
}
