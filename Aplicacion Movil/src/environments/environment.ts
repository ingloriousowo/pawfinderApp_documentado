// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // Aquí se almacena la clave de API de Google Maps
  // Asegúrate de reemplazar 'TU_CLAVE_DE_API_AQUI' con tu clave real
  googleMapsApiKey: 'AIzaSyCrnw7tPASz16T4K8vPkHQdqYJBcB0H7Hc',
  apiUrl: 'http://127.0.0.1:8000'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.