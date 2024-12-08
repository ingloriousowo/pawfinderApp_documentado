import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log('AuthGuard: Verificando autenticación');

    // Verifica si el usuario está autenticado utilizando el AuthService
    if (this.authService.isAuthenticated()) {
      console.log('AuthGuard: Usuario autenticado');
      // Si el usuario está autenticado, permite el acceso a la ruta
      return true;
    } else {
      console.log('AuthGuard: Usuario no autenticado, redirigiendo a login');
      // Si el usuario no está autenticado, redirige al usuario a la página de login
      // Utilizamos createUrlTree para generar una redirección segura
      return this.router.createUrlTree(['/auth/login']);
    }
  }
}
