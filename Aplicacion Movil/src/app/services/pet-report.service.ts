import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PetReport {
  id?: string;
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
  emailContacto: string;
}

export interface PetReportResponse {
  message: string;
  reporte: PetReport;
}

@Injectable({
  providedIn: 'root'
})
export class PetReportService {
  private apiUrl = `${environment.apiUrl}/reportes`;

  constructor(
    private http: HttpClient
  ) { }

  createReport(formData: FormData): Observable<PetReportResponse> {
    return this.http.post<PetReportResponse>(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  getAllReports(): Observable<PetReport[]> {
    return this.http.get<PetReport[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getReportById(id: string): Observable<PetReport> {
    return this.http.get<PetReport>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateReport(id: string, formData: FormData): Observable<PetReport> {
    return this.http.put<PetReport>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(this.handleError)
    );
  }

  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getReportsByEmail(email: string): Observable<PetReport[]> {
    return this.http.get<PetReport[]>(`${this.apiUrl}/user/${email}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error en la operación';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar al servidor. Por favor, verifica tu conexión a internet.';
      } else if (error.status === 422) {
        errorMessage = 'Los datos enviados no son válidos. Por favor, revisa el formulario e intenta de nuevo.';
        console.error('Errores de validación:', error.error);
        if (error.error && typeof error.error === 'object') {
          const validationErrors = Object.entries(error.error)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ');
          errorMessage += ` Detalles: ${validationErrors}`;
        }
      } else {
        errorMessage = error.error?.message || error.message || 'Error del servidor';
      }
    }

    console.error('Error en PetReportService:', error);
    return throwError(() => new Error(errorMessage));
  }
}
