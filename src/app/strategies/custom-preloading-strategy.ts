import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root', // Esto lo hace automáticamente disponible como proveedor
})
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Si la ruta tiene la propiedad `preload: true`, la precarga
    if (route.data && route.data['preload']) {
      return load();
    }
    return of(null); // No precarga si preload no está definido o es false
  }
}
