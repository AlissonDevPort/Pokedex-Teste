// Importando a função createApp do Vue
import { createApp } from 'vue';
import App from './App.vue'; // Importando o componente principal da aplicação
import './style.css'
// Importando o core do FontAwesome
import { library } from '@fortawesome/fontawesome-svg-core';

// Importando o componente do ícone do FontAwesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Importando ícones específicos do FontAwesome
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'; // Ícone da estrela regular
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'; // Ícone da estrela sólida

// Adicionando ícones à biblioteca
library.add(farStar, fasStar); // Adicione os ícones que você irá usar

// Criando e montando a aplicação Vue
createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon) // Registrando o componente do FontAwesome
  .mount('#app'); // Montando a aplicação no elemento com o id 'app'