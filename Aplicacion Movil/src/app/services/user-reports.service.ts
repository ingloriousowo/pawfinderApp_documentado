import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LostPetReport {
  id: string;
  nombre_mascota: string;
  tipo_mascota: string;
  raza: string;
  fechaUltimaVista: string;
  descripcion: string;
  urlImagenMascota?: string;
  userEmail: string;
}

export interface AdoptionListing {
  id: string;
  petName: string;
  petType: string;
  breed: string;
  age: number;
  description: string;
  imageUrl?: string;
  createdAt: string;
  userEmail: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserReportsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Lost Pet Reports
  getLostPetReports(userEmail: string): Observable<LostPetReport[]> {
    return this.http.get<LostPetReport[]>(`${this.apiUrl}/reportes/email/${encodeURIComponent(userEmail)}`);
  }

  getLostPetReport(id: string): Observable<LostPetReport> {
    return this.http.get<LostPetReport>(`${this.apiUrl}/reportes/${id}`);
  }

  createLostPetReport(report: LostPetReport): Observable<LostPetReport> {
    return this.http.post<LostPetReport>(`${this.apiUrl}/reportes`, report);
  }

  updateLostPetReport(id: string, report: Partial<LostPetReport>): Observable<LostPetReport> {
    return this.http.put<LostPetReport>(`${this.apiUrl}/reportes/${id}`, report);
  }

  deleteLostPetReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reportes/${id}`);
  }

  // Adoption Listings
  getAdoptionListings(userEmail: string): Observable<AdoptionListing[]> {
    return this.http.get<AdoptionListing[]>(`${this.apiUrl}/adopts/email/${encodeURIComponent(userEmail)}`);
  }

  getAdoptionListing(id: string): Observable<AdoptionListing> {
    return this.http.get<AdoptionListing>(`${this.apiUrl}/adopts/${id}`);
  }

  createAdoptionListing(listing: AdoptionListing): Observable<AdoptionListing> {
    return this.http.post<AdoptionListing>(`${this.apiUrl}/adopts`, listing);
  }

  updateAdoptionListing(id: string, listing: Partial<AdoptionListing>): Observable<AdoptionListing> {
    return this.http.put<AdoptionListing>(`${this.apiUrl}/adopts/${id}`, listing);
  }

  deleteAdoptionListing(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/adopts/${id}`);
  }
}
