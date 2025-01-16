import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpClientService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.get<T>(url, options).pipe(
      catchError((error) => {
        console.error('HTTP GET Error:', error);
        throw error;
      })
    );
  }

  post<T>(url: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.post<T>(url, body, options).pipe(
      catchError((error) => {
        console.error('HTTP POST Error:', error);
        throw error;
      })
    );
  }

  put<T>(url: string, body: any, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.put<T>(url, body, options).pipe(
      catchError((error) => {
        console.error('HTTP PUT Error:', error);
        throw error;
      })
    );
  }

  delete<T>(url: string, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.http.delete<T>(url, options).pipe(
      catchError((error) => {
        console.error('HTTP DELETE Error:', error);
        throw error;
      })
    );
  }

  // Manejo de archivos: subida de imágenes u otros
  uploadFile(url: string, formData: FormData, options?: { headers?: HttpHeaders }): Observable<any> {
    return this.http.put(url, formData, options).pipe(
      catchError((error) => {
        console.error('File Upload Error:', error);
        throw error;
      })
    );
  }
}
