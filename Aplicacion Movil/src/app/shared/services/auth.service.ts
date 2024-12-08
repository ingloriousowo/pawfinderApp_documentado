import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  register(userData: any): Observable<any> {
    console.log('Registering user:', userData);
    return of({ success: true }).pipe(delay(1000));
  }

  login(correoElectronico: string, password: string): Observable<any> {
    console.log('Logging in user:', correoElectronico);
    const success = correoElectronico === 'test@example.com' && password === 'password';
    return of({ success, token: success ? 'fake-jwt-token' : null }).pipe(delay(1000));
  }

  logout() {
    localStorage.removeItem('auth_token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}
