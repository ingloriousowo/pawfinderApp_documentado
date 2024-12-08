import { Component, OnInit } from '@angular/core';
import { GiveAdoptionService } from '../services/give-adoption.service';

interface Pet {
  id: string;
  petName: string;
  petType: string;
  breed: string;
  age: number;
  gender: string;
  description: string;
  healthStatus: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  imageUrl: string;
}

@Component({
  selector: 'app-adopt-pet',
  templateUrl: './adopt-pet.component.html',
  styleUrls: ['./adopt-pet.component.scss']
})
export class AdoptPetComponent implements OnInit {
  pets: Pet[] = [];
  filteredPets: Pet[] = [];
  searchTerm: string = '';
  selectedType: string = 'all';

  constructor(private giveAdoptionService: GiveAdoptionService) { }

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.giveAdoptionService.getAdoptions().subscribe({
      next: (data: Pet[]) => {
        this.pets = data;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error al obtener las adopciones:', error);
      }
    });
  }

  applyFilters() {
    this.filteredPets = this.pets.filter(pet =>
      (this.selectedType === 'all' || pet.petType.toLowerCase() === this.selectedType.toLowerCase()) &&
      (this.searchTerm === '' ||
        pet.petName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  onSearchChange(event: CustomEvent) {
    this.searchTerm = event.detail.value;
    this.applyFilters();
  }

  onTypeChange(event: CustomEvent) {
    this.selectedType = event.detail.value;
    this.applyFilters();
  }
}
