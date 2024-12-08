import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  urlFotoPerfil?: string;
}

export interface LostPet {
  id: string;
  nombre: string;
  especie: string;
  raza: string;
  fechaUltimaVista: string;
  descripcion: string;
  direccion: string;
  urlImagenMascota?: string;
}

export interface AdoptionPet {
  id: string;
  petName: string;
  petType: string;
  breed: string;
  age: number;
  gender: string;
  description: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  // Usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // Reportes (Mascotas perdidas)
  getLostPets(): Observable<LostPet[]> {
    return this.http.get<LostPet[]>(`${this.apiUrl}/reportes`);
  }

  deleteLostPet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reportes/${id}`);
  }

  // Adopciones
  getAdoptionPets(): Observable<AdoptionPet[]> {
    return this.http.get<AdoptionPet[]>(`${this.apiUrl}/adopts`);
  }

  deleteAdoptionPet(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/adopts/${id}`);
  }
}
