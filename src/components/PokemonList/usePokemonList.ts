import { reactive, ref, computed, onMounted, watch } from "vue";
import { usePokemon } from "../usePokemon";

export function usePokemonList(props: any) {
  const { pokemonList, loading, loadPokemon } = usePokemon();
  const filteredPokeNames = ref<string[]>([]);
  const pokemonTypes = reactive<{ [name: string]: string }>({});
  const typeColors :Record<string, string> = {
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
  interface PokeSearch {
    typedPoke: string;
    pokeList: Array<{ name: string; url: string }>;
  }

  const searchPokemonByName = ({ typedPoke, pokeList }: PokeSearch) => {
    const trimmedPokeName = typedPoke.trim();
    if (!trimmedPokeName) {
      return [];
    }

    const filteredPoke = pokeList.filter((poke) =>
      poke.name.toLowerCase().includes(trimmedPokeName.toLowerCase())
    );

    return filteredPoke.map(
      (pokemon) => pokemon.name
      // ({
      //   name: pokemon.name,
      //   url: pokemon.url,
      // })
    );
  };

  const pokemonImage = (url: string) => {
    const id = url.split("/").filter(Boolean).pop();
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  };

  const getPokemonId = (url: string) => {
    return parseInt(url.split("/").filter(Boolean).pop()!);
  };

  const selectPokemon = (name: string) => {
    if (props.onSelectPokemon) props.onSelectPokemon(name);
  };

  const isFavorite = (id: number) => {
    const favorites = JSON.parse(
      localStorage.getItem("pokeIdsFavorite") || "[]"
    );
    return favorites.includes(id);
  };

  const filterPokemonByType = () => {
    return pokemonList.value.filter((pokemon) => {
      const types = pokemonTypes[pokemon.name]?.split(", ") || [];
      return (
        props.selectedTypeToFilter.length === 0 ||
        props.selectedTypeToFilter.some((selectedType: any) =>
          types.includes(selectedType)
        )
      );
    });
  };

  const filterPokemonByName = () => {
    const pokeSearchData: PokeSearch = {
      typedPoke: props.typedPoke.toLowerCase(),
      pokeList: pokemonList.value,
    };
    if (props.typedPoke) {
      filteredPokeNames.value = searchPokemonByName(pokeSearchData) || [];
    } else {
      filteredPokeNames.value = pokemonList.value.map((poke) => poke.name);
    }
  };

  const filteredPokemonList = computed(() => {
    let filteredList = filterPokemonByType();
    if (props.typedPoke) {
      filteredList = filteredList.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(props.typedPoke.toLowerCase())
      );
    }
    return filteredList;
  });

  const getPokemonType = async (name: string) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const pokemonData = await response.json();
      const types = pokemonData.types.map((type: any) => type.type.name);
      pokemonTypes[name] = types.join(", ");
    } catch (error) {
      console.error(`Erro ao buscar tipo do Pokémon ${name}`, error);
      pokemonTypes[name] = "Tipo desconhecido";
    }
  };

  const handleScroll = async () => {
    const bottomOfWindow =
      window.innerHeight + window.scrollY >=
      document.documentElement.offsetHeight;
    if (bottomOfWindow && !loading.value) {
      await loadPokemon();
      await loadPokemonTypes();
    }
  };

  const loadPokemonTypes = async () => {
    for (const pokemon of pokemonList.value) {
      if (!pokemonTypes[pokemon.name]) {
        await getPokemonType(pokemon.name);
      }
    }
  };

  onMounted(async () => {
    window.addEventListener("scroll", handleScroll);
    await loadPokemon();
    setTimeout(async () => {
      await loadPokemonTypes();
    }, 500);
  });

  watch(
    () => props.typedPoke,
    async () => {
      filterPokemonByName();
      await loadPokemonTypes();
    }
  );

  watch(
    () => props.selectedTypeToFilter,
    async () => {
      if (props.selectedTypeToFilter.length === 0) {
        await loadPokemonTypes();
      }
    }
  );

  return {
    pokemonList,
    loading,
    pokemonImage,
    selectPokemon,
    pokemonTypes,
    filteredPokemonList,
    typeColors,
    getPokemonId,
    isFavorite,
  };
}
