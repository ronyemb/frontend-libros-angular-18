import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../interfaces/book.interface';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiURL: string = `${environment.apiUrl}`;

  constructor(private httpClient: HttpClientService) {}

  // Obtener todos los libros
  public getAllBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.apiURL);
  }

  // Obtener un libro por ID
  public getBookById(id: number): Observable<Book> {
    return this.httpClient.get<Book>(`${this.apiURL}/${id}`);
  }

  // Crear un nuevo libro
  public createBook(book: Book): Observable<Book> {
    return this.httpClient.post<Book>(this.apiURL, book);
  }

  // Actualizar un libro existente
  public updateBook(id: number, book: Book): Observable<Book> {
    return this.httpClient.put<Book>(`${this.apiURL}/${id}`, book);
  }

  // Eliminar un libro
  public deleteBook(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiURL}/${id}`);
  }

  // Subir una imagen de un libro
  public updateBookImage(id: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.uploadFile(`${this.apiURL}/${id}/image`, formData);
  }
}
