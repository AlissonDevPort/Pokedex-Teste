import { ref, onMounted } from "vue";
import { PokemonDetails, usePokemon } from "../usePokemon";
import { toast } from "vue3-toastify";

export function usePokemonDetails(pokemonName: string) {
  const { getPokemonInfo, getEvolutionChain } = usePokemon();
  const pokemon = ref<PokemonDetails | null>(null);
  const pokemonImage = ref("");
  const evolutionChain = ref<any[]>([]);
  const favoriteIds = ref<number[]>([]);

  const typeColors:Record<string, string> = {
    water: "#3D9DD9",
    poison: "#A55EB5",
    fire: "#FF9C00",
    grass: "#6BCB4A",
    flying: "#A4C8E1",
    rock: "#B6A77D",
    ground: "#D18D36",
    fighting: "#E03C31",
    normal: "#A8A78D",
    psychic: "#F64D8C",
    ice: "#4FC2E8",
    electric: "#E7C94C",
    fairy: "#F2A6D9",
    dragon: "#6B75D5",
    dark: "#707070",
    ghost: "#A4B6C6",
    steel: "#B7B8B7",
  };

  const isFavorite = () => {
    return pokemon.value ? favoriteIds.value.includes(pokemon.value.id) : false;
  };

  const pokemonIdToFavorite = () => {
    if (pokemon.value) {
      const pokeId = pokemon.value.id;

      if (favoriteIds.value.includes(pokeId)) {
        favoriteIds.value = favoriteIds.value.filter((id) => id !== pokeId);
        toast.success(
          `O Pokémon ${pokemon.value.name} foi removido dos favoritos`
        );
      } else {
        favoriteIds.value.push(pokeId);
        toast.success(
          `O Pokémon ${pokemon.value.name} foi adicionado aos favoritos`
        );
      }

      localStorage.setItem(
        "pokeIdsFavorite",
        JSON.stringify(favoriteIds.value)
      );
    }
  };

  const extractEvolutionChain = (chain: any) => {
    const evoChain = [];
    let current = chain;

    while (current) {
      evoChain.push({
        name: current.species.name,
        id: current.species.url.split("/").filter(Boolean).pop(),
      });
      current = current.evolves_to[0];
    }

    return evoChain;
  };

  onMounted(async () => {
    if (pokemonName) {
      const pokemonData = await getPokemonInfo(pokemonName);
      pokemon.value = pokemonData;
      pokemonImage.value = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`;

      const evolutionData = await getEvolutionChain(pokemonData.id);
      evolutionChain.value = extractEvolutionChain(evolutionData.chain);

      favoriteIds.value = JSON.parse(
        localStorage.getItem("pokeIdsFavorite") || "[]"
      );
    }
  });

  return {
    pokemon,
    pokemonImage,
    evolutionChain,
    typeColors,
    pokemonIdToFavorite,
    isFavorite,
  };
}
