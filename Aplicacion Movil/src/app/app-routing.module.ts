import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard'; // Importamos el AdminGuard

const routes: Routes = [
  // Ruta por defecto, redirige a la página de login
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  // Módulo de autenticación
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  // Página principal, protegida por AuthGuard
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  // Página de perfil, protegida por AuthGuard
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule),
    canActivate: [AuthGuard]
  },
  //Pagina de notificaciones, protegida por AuthGuard
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsModule),
    canActivate: [AuthGuard]
  },
  // Página para reportar mascotas perdidas, protegida por AuthGuard
  {
    path: 'report-lost',
    loadChildren: () => import('./report-lost/report-lost.module').then(m => m.ReportLostModule),
    canActivate: [AuthGuard]
  },
  // Página para buscar mascotas perdidas, protegida por AuthGuard
  {
    path: 'find-lost-pet',
    loadChildren: () => import('./find-lost-pet/find-lost-pet.module').then(m => m.FindLostPetModule),
    canActivate: [AuthGuard]
  },
  // Página para dar en adopción, protegida por AuthGuard
  {
    path: 'give-adoption',
    loadChildren: () => import('./give-adoption/give-adoption.module').then(m => m.GiveAdoptionModule),
    canActivate: [AuthGuard]
  },
  // Página para adoptar mascotas, protegida por AuthGuard
  {
    path: 'adopt-pet',
    loadChildren: () => import('./adopt-pet/adopt-pet.module').then(m => m.AdoptPetModule),
    canActivate: [AuthGuard]
  },
  // Página de donaciones, protegida por AuthGuard
  {
    path: 'donations',
    loadChildren: () => import('./donations/donations.module').then(m => m.DonationsPageModule),
    canActivate: [AuthGuard]
  },
  // Página "Acerca de PawFinder", protegida por AuthGuard
  {
    path: 'about-pawfinder',
    loadChildren: () => import('./about-pawfinder/about-pawfinder.module').then(m => m.AboutPawfinderPageModule),
    canActivate: [AuthGuard]
  },
  // Página de reportes de mascotas perdidas, protegida por AuthGuard
  {
    path: 'lost-pet-reports',
    loadChildren: () => import('./user-reports/lost-pets/lost-pets-reports.module').then(m => m.LostPetReportsModule),
    canActivate: [AuthGuard]
  },
  // Página de reportes de adopciones, protegida por AuthGuard
  {
    path: 'adoption-reports',
    loadChildren: () => import('./user-reports/adoptions/adoption-reports.module').then(m => m.AdoptionReportsModule),
    canActivate: [AuthGuard]
  },
  // Nueva ruta para el dashboard de administrador, protegida por AuthGuard y AdminGuard
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin-dashboard/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, AdminGuard]
  },
  // Ruta comodín, redirige a la página de login si no se encuentra la ruta
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
