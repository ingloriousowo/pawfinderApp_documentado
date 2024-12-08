import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-google-map',
  template: '<div #map></div>',
  styles: [`
    div {
      height: 300px;
      width: 100%;
    }
  `]
})
export class GoogleMapComponent implements AfterViewInit, OnDestroy {
  // Inicializamos mapRef con ! para indicar que será definido
  @ViewChild('map')
  mapRef!: ElementRef;

  // Inicializamos map como undefined
  map: GoogleMap | undefined;

  constructor() {}

  async ngAfterViewInit() {
    try {
      // Crear el mapa después de que la vista se haya inicializado
      this.map = await GoogleMap.create({
        id: 'my-map', // ID único para este mapa
        element: this.mapRef.nativeElement, // Elemento del DOM para el mapa
        apiKey: environment.googleMapsApiKey, // Clave de API de Google Maps
        config: {
          center: {
            // Coordenadas iniciales del mapa (Santiago, Chile)
            lat: -33.4489,
            lng: -70.6693
          },
          zoom: 8 // Nivel de zoom inicial
        }
      });

      console.log('Mapa creado exitosamente');
    } catch (error) {
      console.error('Error al crear el mapa:', error);
    }
  }

  // Implementación de OnDestroy para limpiar recursos
  ngOnDestroy(): void {
    if (this.map) {
      this.map.destroy();
    }
  }
}
