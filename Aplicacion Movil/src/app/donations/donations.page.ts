import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.page.html',
  styleUrls: ['./donations.page.scss'],
})
export class DonationsPage implements OnInit {
  // Definimos la propiedad donationOptions que faltaba
  donationOptions = [
    { amount: 5000, description: 'Alimento para 1 semana' },
    { amount: 10000, description: 'Vacunas para 2 mascotas' },
    { amount: 20000, description: 'Tratamiento médico completo' },
    { amount: 50000, description: 'Rescate y rehabilitación' }
  ];

  // Definimos la propiedad customAmount que faltaba
  customAmount: number = 0;

  constructor() { }

  ngOnInit() {
  }

  // Agregamos el método donate que faltaba
  donate(amount: number) {
    console.log(`Procesando donación de ${amount} pesos`);
    // Aquí iría la lógica para procesar el pago
    alert(`Gracias por tu donación de ${amount} pesos`);
  }

  // Agregamos el método donateCustom que faltaba
  donateCustom() {
    if (this.customAmount && this.customAmount > 0) {
      this.donate(this.customAmount);
      this.customAmount = 0; // Reseteamos el valor después de la donación
    }
  }
}
