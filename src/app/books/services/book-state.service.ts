import { Injectable, signal } from '@angular/core';
import { Book } from '../interfaces/book.interface';

@Injectable({ providedIn: 'root' })
export class BookStateService {
  books = signal<Book[]>([]); // Signal para manejar la lista de libros

  public setBooks(newBooks: Book[]): void {
    this.books.set(newBooks);
  }

  public getBooks() {
    return this.books;
  }

  deleteBookById(bookId: number): void {
    this.books.update((books) => books.filter((book) => book.id !== bookId));
  }
}
