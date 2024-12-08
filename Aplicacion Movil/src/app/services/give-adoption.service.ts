import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GiveAdoptionService {
  private apiUrl = `${environment.apiUrl}/adopts`;

  constructor(private http: HttpClient) { }

  createAdoption(adoptionData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, adoptionData);
  }

  getAdoptions(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAdoptionById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateAdoption(id: string, adoptionData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, adoptionData);
  }

  deleteAdoption(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  searchAdoptions(searchTerm: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/search`, { params: { term: searchTerm } });
  }

  getAdoptionsByType(petType: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/type/${petType}`);
  }

  getRecentAdoptions(limit: number = 5): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/recent`, { params: { limit: limit.toString() } });
  }

  updateAdoptionStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  getAdoptionStatistics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/statistics`);
  }

  // Nuevo método para obtener adopciones por correo electrónico
  getAdoptionsByEmail(email: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${email}`);
  }

  private createFormData(data: any): FormData {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'imageUrl' && data[key] instanceof File) {
        formData.append('imageUrl', data[key], data[key].name);
      } else {
        formData.append(key, data[key]);
      }
    });
    return formData;
  }
}
