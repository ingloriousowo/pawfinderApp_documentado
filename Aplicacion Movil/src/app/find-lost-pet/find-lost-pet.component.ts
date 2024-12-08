import { Component, OnInit } from '@angular/core';
import { PetListingService, Pet } from '../services/pet-listing.service';

@Component({
  selector: 'app-find-lost-pet',
  templateUrl: './find-lost-pet.component.html',
  styleUrls: ['./find-lost-pet.component.scss']
})
export class FindLostPetComponent implements OnInit {
  mascotas: Pet[] = [];
  mascotasFiltradas: Pet[] = [];
  terminoBusqueda: string = '';
  tipoSeleccionado: string = 'todos';

  constructor(private petListingService: PetListingService) { }

  ngOnInit() {
    this.cargarMascotas();
  }

  cargarMascotas() {
    this.petListingService.getPets().subscribe({
      next: (mascotas) => {
        this.mascotas = mascotas;
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Error al cargar las mascotas:', error);
      }
    });
  }

  aplicarFiltros() {
    this.mascotasFiltradas = this.mascotas.filter(mascota => {
      const coincideBusqueda =
        mascota.nombre_mascota.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        mascota.raza?.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        mascota.descripcion.toLowerCase().includes(this.terminoBusqueda.toLowerCase());

      const coincideTipo =
        this.tipoSeleccionado === 'todos' ||
        mascota.tipo_mascota.toLowerCase() === this.tipoSeleccionado.toLowerCase();

      return coincideBusqueda && coincideTipo;
    });
  }

  onBusquedaCambio(event: any) {
    this.terminoBusqueda = event.detail.value;
    this.aplicarFiltros();
  }

  onTipoCambio(event: any) {
    this.tipoSeleccionado = event.detail.value;
    this.aplicarFiltros();
  }

  formatearFecha(fecha: string): string {
    if (!fecha || fecha === 'Invalid Date') return 'Fecha no disponible';
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'Fecha no disponible';
    }
  }
}
