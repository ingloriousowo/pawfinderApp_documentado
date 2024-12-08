import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Pet {
  id: string;
  tipo_mascota: string;
  nombre_mascota: string;
  descripcion: string;
  urlImagenMascota?: string;
  raza: string;
  edad: string;
  color: string;
  direccion: string;
  fechaUltimaVista: string;
  recompensa: boolean;
  montoRecompensa?: number;
  ubicacion: {
    lat: number;
    lng: number;
  };
  telefonoContacto: string;
}

@Injectable({
  providedIn: 'root'
})
export class PetListingService {
  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(private http: HttpClient) { }

  getPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.apiUrl);
  }
}
