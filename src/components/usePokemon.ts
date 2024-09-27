import { ref, onMounted } from "vue";
import {

  getPokemonList,
} from "../services/pokeapi";

export interface Pokemon {
  name: string;
  url: string;
}



export const usePokemon = () => {
  const pokemonList = ref<Pokemon[]>([]);
  const offset = ref(0);
  const limit = 20;
  const loading = ref(false);

  const loadPokemon = async () => {
    loading.value = true;
    const response = await getPokemonList(offset.value, limit);
    pokemonList.value.push(...response.results);
    offset.value += limit;
    loading.value = false;
  };

 


  onMounted(loadPokemon);

  return {
    pokemonList,
    loading,
    loadPokemon,
   
  };
};
