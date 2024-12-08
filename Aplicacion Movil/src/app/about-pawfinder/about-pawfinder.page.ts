import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about-pawfinder',
  templateUrl: './about-pawfinder.page.html',
  styleUrls: ['./about-pawfinder.page.scss'],
})
export class AboutPawfinderPage implements OnInit {
  // Objeto que contiene estadísticas de impacto
  impact = {
    adoptions: 1500,
    rescues: 2000,
    volunteers: 500
  };

  // Array de objetos que contiene preguntas frecuentes y sus respuestas
  faqs = [
    {
      question: '¿Cómo puedo adoptar una mascota?',
      answer: 'Puedes navegar por nuestra sección de "Adoptar Mascota", elegir un animal que te interese y contactar al refugio o cuidador a través de la aplicación.'
    },
    {
      question: '¿Qué debo considerar antes de adoptar?',
      answer: 'Es importante considerar el espacio en tu hogar, tu estilo de vida, el tiempo que puedes dedicar a una mascota y los costos asociados con su cuidado.'
    },
    {
      question: '¿Cómo puedo reportar una mascota perdida?',
      answer: 'Utiliza la función "Reportar Mascota Perdida" en la aplicación. Proporciona una descripción detallada y una foto reciente de tu mascota.'
    },
    {
      question: '¿Cómo puedo convertirme en voluntario?',
      answer: 'Puedes registrarte como voluntario en la sección "Cómo Ayudar" de esta página. Te contactaremos con oportunidades de voluntariado en tu área.'
    }
  ];

  constructor() { }

  ngOnInit() {
    // Inicialización del componente
  }
}
