import { Component, inject, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { Book } from '../../interfaces/book.interface';
import { BookService } from '../../services/book.service';
import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { BookPageComponent } from "../book-page/book-page.component";
import { BookStateService } from '../../services/book-state.service';

@Component({
  standalone: true,
  imports: [
    BookPageComponent
]
    ,
  templateUrl: './list-page.component.html',
  styleUrl: './list-page.component.scss',
  encapsulation: ViewEncapsulation.None, // Importante para PrimeNG
})

export class ListPageComponent implements OnInit {

  private bookService = inject(BookService);
  public books = signal<Book[]>([]);

  constructor() { }

  ngOnInit():void {
    this.getAllBooks();
  }

  private getAllBooks(): void {
    this.bookService.getAllBooks()
      .subscribe({
        next: (data) => {
          this.books.set(data); // Corrección: Usar el método set() para asignar valores a signals
        },
        error: (err) => {
          console.error('Error loading books:', err); // Manejo de errores
        }
      });
  }

  public onBookDeleted(bookId: number): void {
    this.bookService.deleteBook(bookId).subscribe(() => {
      // Filtra los libros para eliminar el que fue borrado
      this.books.update((currentBooks) =>
        currentBooks.filter((book) => book.id !== bookId)
      );
    });
  }

}
