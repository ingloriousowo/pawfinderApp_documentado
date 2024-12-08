import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface GeocodingResponse {
  results: Array<{
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeocodingService {
  private apiKey = ''; // Reemplaza con tu API key de Google Maps
  private apiUrl = 'https://maps.googleapis.com/maps/api/geocode/json';

  constructor(private http: HttpClient) {}

  geocodeAddress(address: string): Observable<GeocodingResponse> {
    const url = `${this.apiUrl}?address=${encodeURIComponent(address)}&key=${
      this.apiKey
    }`;
    return this.http.get<GeocodingResponse>(url);
  }
}
