import { Component, EventEmitter, inject, Input, OnInit, Output, Signal } from '@angular/core';
import { Book } from '../../interfaces/book.interface';
import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { BookService } from '../../services/book.service';
import { BookStateService } from '../../services/book-state.service';

@Component({
  selector: 'books-book-card',
  standalone: true,
  imports: [CurrencyPipe, CardModule, ButtonModule, RouterModule],
  templateUrl: './book-page.component.html',
  styleUrl: './book-page.component.css',
})
export class BookPageComponent implements OnInit {
  @Input() book!: Book;
  @Output() onDelete = new EventEmitter<number>(); // Emite el ID del libro a eliminar
  private bookService = inject(BookService);


  constructor() {}

  ngOnInit() {
    if (!this.book) throw Error('Book property is required.');
  }

  public onDeleteBook(): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el libro "${this.book.title}"?`)) {
      this.onDelete.emit(this.book.id);
    }
  }
}
