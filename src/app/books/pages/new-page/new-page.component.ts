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


  constructor(private fb: FormBuilder){
    this.formBook = this.fb.group({
      id: [null],
      title: ['', Validators.required],
      author: ['', Validators.required],
      pages: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(0)]],
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

  public onSubmit(): void {
    if ( this.formBook.invalid ) return;

    const { id, ...book } = this.formBook.value;

    const saveObservable = id
    ? this.bookService.updateBook(id, book as Book)
    : this.bookService.createBook(book as Book);

    saveObservable.subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: id ? 'Book Updated' : 'Book Created',
          detail: `Book "${response.title}" was successfully ${
            id ? 'updated' : 'created'
          }!`,
        });
        if (!id) {
          // this.router.navigate(['/edit', response.id]);
          this.formBook.reset();
        }
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
