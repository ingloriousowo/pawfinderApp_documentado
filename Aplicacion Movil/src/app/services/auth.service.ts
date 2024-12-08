import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

// Interfaces para las respuestas y datos del usuario
export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginCredentials {
  correo: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface User {
  id?: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  genero: string;
  rut: string;
  dv: string;
  urlFotoPerfil?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Variables privadas del servicio
  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    // Inicializar el BehaviorSubject con el usuario almacenado en localStorage
    this.currentUserSubject = new BehaviorSubject<User | null>(
      this.getUserFromStorage()
    );
    this.currentUser = this.currentUserSubject.asObservable();
    console.log('AuthService: Servicio inicializado');
    console.log('Current User: ' + this.currentUser);
  }

  // Obtener el email del usuario actual
  getUserEmail(): Promise<string> {
    return new Promise((resolve, reject) => {
      const currentUser = this.currentUserValue;
      if (currentUser && currentUser.correo) {
        console.log('AuthService: Email del usuario obtenido:', currentUser.correo);
        resolve(currentUser.correo);
      } else {
        console.error('AuthService: No se pudo obtener el email del usuario');
        reject(new Error('No hay usuario autenticado o no se encontró el email'));
      }
    });
  }

  // Obtener el usuario almacenado en localStorage
  private getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    console.log(
      'AuthService: Usuario obtenido del almacenamiento:',
      storedUser ? 'Existe' : 'No existe'
    );
    return storedUser ? JSON.parse(storedUser) : null;
  }

  // Obtener el valor actual del usuario
  public get currentUserValue(): User | null {
    console.log('AuthService: Obteniendo valor actual del usuario');
    return this.currentUserSubject.value;
  }

  // Método de inicio de sesión
  login(credentials: LoginCredentials): Observable<LoginResponse> {
    const loginData = {
      correo: credentials.correo,
      password: credentials.password,
    };

    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    console.log('AuthService: Enviando datos de login:', loginData);

    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, loginData, { headers })
      .pipe(
        tap((response: LoginResponse) => {
          console.log('AuthService: Respuesta del servidor:', response);
          if (response && response.access_token) {
            // Si la autenticación es exitosa, guardamos los datos del usuario
            this.setAuthData(response.access_token, response.user);
            console.log(
              '///////////////////////////' + response.user.urlFotoPerfil
            );
          }
        }),
        catchError(this.handleError)
      );
  }

  // Método de registro de usuario
  register(userData: FormData): Observable<RegisterResponse> {
    console.log('AuthService: Enviando datos de registro');

    return this.http
      .post<RegisterResponse>(`${this.apiUrl}/signup`, userData)
      .pipe(
        tap((response) =>
          console.log(
            'AuthService: Respuesta del servidor para registro:',
            response
          )
        ),
        catchError(this.handleError)
      );
  }

  // Método de cierre de sesión
  logout(): Observable<any> {
    return of(null).pipe(
      tap(() => {
        this.removeToken();
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/auth/login']);
        console.log('AuthService: Sesión cerrada y redirigido a login');
      })
    );
  }

  // Obtener los datos del usuario actual
  getUserData(): Observable<User | null> {
    const currentUser = this.currentUserValue;
    if (currentUser) {
      console.log('AuthService: Devolviendo datos del usuario almacenados');
      return of(currentUser);
    } else {
      console.log('AuthService: No hay usuario autenticado');
      return throwError(() => new Error('No hay usuario autenticado'));
    }
  }

  // Obtener el token de autenticación
  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('AuthService: Token obtenido:', !!token);
    return token;
  }

  // Guardar el token de autenticación
  private setToken(token: string): void {
    console.log('AuthService: Guardando token');
    localStorage.setItem('token', token);
  }

  // Eliminar el token de autenticación
  private removeToken(): void {
    console.log('AuthService: Eliminando token');
    localStorage.removeItem('token');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.currentUserValue;
    console.log(
      'AuthService: Verificando autenticación, token presente:',
      !!token,
      'usuario presente:',
      !!user
    );
    return !!token && !!user;
  }

  // Establecer los datos de autenticación
  private setAuthData(token: string, user: User): void {
    console.log('AuthService: Estableciendo datos de autenticación');
    this.setToken(token);
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Obtener la imagen de perfil del usuario
  getProfileImage(imageUrl: string): Observable<Blob> {
    console.log('AuthService: Obteniendo imagen de perfil');
    return this.http.get(imageUrl, { responseType: 'blob' }).pipe(
      tap(() =>
        console.log('AuthService: Imagen de perfil obtenida correctamente')
      ),
      catchError((error) => {
        console.error(
          'AuthService: Error al obtener la imagen de perfil:',
          error
        );
        return throwError(
          () => new Error('Error al obtener la imagen de perfil')
        );
      })
    );
  }

  // Verificar si el usuario es administrador
  isAdmin(): Observable<boolean> {
    return this.getUserData().pipe(
      map(user => user?.correo === 'admin@admin.cl'),
      catchError(() => of(false))
    );
  }

  // Manejar errores de las peticiones HTTP
  private handleError(error: HttpErrorResponse) {
    console.error('AuthService: Error completo:', error);
    let errorMessage = 'Ha ocurrido un error en el servidor.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
      if (error.status === 422) {
        errorMessage = 'Los datos proporcionados no son válidos.';
        if (error.error?.detail) {
          errorMessage +=
            ' ' +
            (Array.isArray(error.error.detail)
              ? error.error.detail.join(', ')
              : JSON.stringify(error.error.detail));
        }
      } else if (error.status === 401) {
        errorMessage = 'No autorizado. Por favor, inicie sesión nuevamente.';
        this.logout(); // Cerrar sesión si el token no es válido
      } else if (error.status === 404) {
        errorMessage = 'Usuario no encontrado o ruta incorrecta';
      } else {
        errorMessage = `Error ${error.status}: ${
          error.error?.message || 'Error desconocido'
        }`;
      }
    }

    console.error('AuthService: Error manejado:', errorMessage);
    return throwError(() => ({ status: error.status, message: errorMessage }));
  }
}
