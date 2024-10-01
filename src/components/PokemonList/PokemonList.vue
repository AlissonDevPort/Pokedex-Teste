<template>
  <div class="pokemon-list-container">
    <div class="filters"></div>
    <div class="pokemon-list">
      <div
        v-for="pokemon in filteredPokemonList"
        :key="pokemon.name"
        class="pokemon-item"
        @click="selectPokemon(pokemon.name)"
      >
        <img :src="pokemonImage(pokemon.url)" alt="pokemon" />
        <p>{{ pokemon.name }}</p>
        <div>
          <span
            v-for="type in pokemonTypes[pokemon.name]?.split(', ')"
            :key="type"
            :style="{ color: typeColors[type] || '#000', marginRight: '5px' }"
          >
            {{ type }}
          </span>
        </div>
      </div>
      <div v-if="loading">Carregando...</div>
    </div>
  </div>
</template>

<script lang="tsx">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  watch,
  computed,
} from "vue";
import { usePokemon } from "../usePokemon";
import { PokeSearch, searchPokemonByName } from "../SearchInput/SearchPokemon";

export default defineComponent({
  props: {
    onSelectPokemon: Function,
    typedPoke: { type: String, default: "" },
    selectedTypeToFilter: { type: Array as () => string[], default: () => [] },
  },
  setup(props) {
    const { pokemonList, loading, loadPokemon, getPokemonInfo } = usePokemon();
    const filteredPokeNames = ref<string[]>([]);
    const pokemonTypes = reactive<{ [name: string]: string }>({});
    const typeColors = {
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
    const pokemonImage = (url: string) => {
      const id = url.split("/").filter(Boolean).pop();
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    };

    const selectPokemon = (name: string) => {
      if (props.onSelectPokemon) props.onSelectPokemon(name);
    };

    const filterPokemonByType = () => {
      return pokemonList.value.filter((pokemon) => {
        const types = pokemonTypes[pokemon.name]?.split(", ") || [];
        return (
          props.selectedTypeToFilter.length === 0 ||
          props.selectedTypeToFilter.some((selectedType) =>
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
      const byName = filteredPokeNames.value.length
        ? filteredPokeNames.value
        : pokemonList.value.map((poke) => poke.name);
      return filterPokemonByType().filter((pokemon) =>
        byName.includes(pokemon.name.toLowerCase())
      );
    });

    const getPokemonType = async (name: string) => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${name}`
        );
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
      await loadPokemonTypes();
    });

    watch(
      () => props.typedPoke,
      () => {
        filterPokemonByName();
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
      typeColors
    };
  },
});
</script>
<style scoped>
.pokemon-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  width: 100%;
}
.pokemon-item {
  text-align: center;
  cursor: pointer;
  background-color: #494949;
}
</style>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}

img {
  width: 100px;
  height: auto;
}

.pokemon-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  width: 100%;
}
.pokemon-item {
  text-align: center;
  cursor: pointer;
  background-color: #494949;
}
</style>
