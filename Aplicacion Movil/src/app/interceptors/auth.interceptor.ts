import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // No interceptar llamadas a Google Maps
    if (request.url.includes('maps.googleapis.com')) {
      return next.handle(request);
    }

    // Obtener el token del AuthService
    const token = this.authService.getToken();

    // Si existe un token, lo añadimos a los headers de la petición
    if (token) {
      // Clonamos la petición original y añadimos el header de autorización
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('AuthInterceptor: Token añadido a la petición');
    } else {
      console.log('AuthInterceptor: No se encontró token');
    }

    // Pasamos la petición modificada (o la original si no había token) al siguiente manejador
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Manejamos los errores que puedan surgir en la petición
        if (error.status === 401) {
          // Si recibimos un error 401 (No autorizado), cerramos la sesión y redirigimos al login
          console.log('AuthInterceptor: Error 401 detectado, cerrando sesión');
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        } else {
          // Para otros errores, los registramos en consola
          console.error('AuthInterceptor: Error en la petición', error);
        }
        // Propagamos el error para que pueda ser manejado por otros componentes si es necesario
        return throwError(() => new Error(error.message || 'Error en la petición'));
      })
    );
  }
}
