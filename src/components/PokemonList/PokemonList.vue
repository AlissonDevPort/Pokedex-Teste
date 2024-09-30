<template>
  <div class="pokemon-list-container">
    <div class="filters">
      <!-- Você pode adicionar mais filtros aqui se desejar -->
    </div>

    <div class="pokemon-list">
      <div
        v-for="pokemon in filteredPokemonList"
        :key="pokemon.name"
        class="pokemon-item"
        @click="selectPokemon(pokemon.name)"
      >
        <img :src="pokemonImage(pokemon.url)" alt="pokemon" />
        <p>{{ pokemon.name }}</p>
        <p>{{ pokemonTypes[pokemon.name] || "Carregando tipos..." }}</p>
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
    selectedTypeToFilter: { type: String, default: "" },
  },
  setup(props) {
    const { pokemonList, loading, loadPokemon, getPokemonInfo } = usePokemon();
    const filteredPokeNames = ref<string[]>([]);
    const pokemonTypes = reactive<{ [name: string]: string }>({});

    const pokemonImage = (url: string) => {
      const id = url.split("/").filter(Boolean).pop();
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    };

    const pokemonType = async (name: string) => {
      try {
        const pokemonData = await getPokemonInfo(name);
        const types = pokemonData.types.map(
          (pokeType: { type: { name: string } }) => pokeType.type.name
        );
        pokemonTypes[name] = types.join(", ");
      } catch (error) {
        console.error(`Erro ao obter tipo do Pokémon ${name}:`, error);
        pokemonTypes[name] = "Tipo desconhecido";
      }
    };

    const selectPokemon = (name: string) => {
      if (props.onSelectPokemon) props.onSelectPokemon(name);
    };

    const filterPokemonByType = () => {
      return pokemonList.value.filter((pokemon) => {
        const types = pokemonTypes[pokemon.name]?.split(", ") || [];
        return (
          !props.selectedTypeToFilter ||
          types.includes(props.selectedTypeToFilter)
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
        : pokemonList.value.map((p) => p.name);
      return filterPokemonByType().filter((pokemon) =>
        byName.includes(pokemon.name.toLowerCase()) 
      );
    });

    const handleScroll = () => {
      const bottomOfWindow =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight;
      if (bottomOfWindow && !loading.value) {
        loadPokemon();
      }
    };

    onMounted(async () => {
      window.addEventListener("scroll", handleScroll);
      await loadPokemon();

      for (const pokemon of pokemonList.value) {
        await pokemonType(pokemon.name);
      }
    });

    watch([() => props.typedPoke, () => props.selectedTypeToFilter], () => {
      filterPokemonByName();
    });

    return {
      pokemonList,
      loading,
      pokemonImage,
      selectPokemon,
      pokemonTypes,
      filteredPokemonList,
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