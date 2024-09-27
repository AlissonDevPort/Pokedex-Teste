import { ref, onMounted } from "vue";
import {
  getPokemonDetails,
  getPokemonEvolutionChain,
  getPokemonList,
} from "../services/pokeapi";

export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  stats: { base_stat: number; stat: { name: string } }[];
  types: { type: { name: string } }[];
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

  const getPokemonInfo = async (name: string) => {
      const response = await getPokemonDetails(name);
      console.log(response)
    return response.data;
  };
  const favoritePokemon = async (name: string) => {
      // selecionar melhor maneira para adicionar o poke a lista de fav
  };

  const getEvolutionChain = async (id: number) => {
    const response = await getPokemonEvolutionChain(id);
    return response.data;
  };


  onMounted(loadPokemon);

  return {
    pokemonList,
    loading,
    loadPokemon,
    getPokemonInfo,
    getEvolutionChain,
  };
};
