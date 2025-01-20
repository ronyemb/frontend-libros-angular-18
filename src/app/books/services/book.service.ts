import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../interfaces/book.interface';
import { HttpClientService } from '../../core/services/http-client.service';
import { environment } from '../../environments/environment';

// import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiURL: string = `${environment.apiUrl}`;

  constructor(
    private httpClient: HttpClientService,
    // private http: HttpClient,
  ) {}

  // Obtener todos los libros
  public getAllBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(this.apiURL);
  }

  // Obtener un libro por ID
  public getBookById(id: number): Observable<Book> {
    return this.httpClient.get<Book>(`${this.apiURL}/${id}`);
  }

  // Crear un nuevo libro
  public createBook(book: Book, image:File): Observable<Book> {
    const formData = new FormData()
    formData.append('book', new Blob([JSON.stringify(book)], { type: 'application/json' }));
    formData.append('file', image)
    return this.httpClient.post<Book>(this.apiURL, formData);
    // return this.http.post<Book>(this.apiURL, formData);
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
