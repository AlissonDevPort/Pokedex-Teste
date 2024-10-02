<template>
  <div class="pokemon-list-container">
    <div class="filters"></div>
    <div class="pokemon-list">
      <div
        v-for="pokemon in filteredPokemonList"
        :key="pokemon.name"
        class="pokemon-item"
        @click="selectPokemon(pokemon.name, pokemon.url)"
      >
        <div class="pokemon-star">
          <font-awesome-icon
            :icon="
              isFavorite(getPokemonId(pokemon.url))
                ? 'fas fa-star'
                : 'far fa-star'
            "
            class="star-icon"
          />
        </div>
        <img :src="pokemonImage(pokemon.url)" alt="pokemon" />
        <p>{{ pokemon.name }}</p>
        <div class="types">
          <div
            v-for="type in pokemonTypes[pokemon.name]?.split(', ')"
            :key="type"
            :style="{ backgroundColor: typeColors[type] || '#000' }"
            class="type-badge"
          >
            {{ type }}
          </div>
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
    // isModalVisible: { type: Boolean, default: false }
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

    const getPokemonId = (url: string) => {
      return parseInt(url.split("/").filter(Boolean).pop()!);
    };

    const selectPokemon = (name: string, url: string) => {
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

    // watch(() => props.isModalVisible, (newValue) => {
    //   if (newValue) {
    //     const pokemonId = isFavorite(getPokemonId(selectPokemon.url))
    //   }
    // });
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
  },
});
</script>

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
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  width: 100%;
}

.pokemon-item {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  cursor: pointer;
  background-color: #494949;
  padding: 1rem;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.pokemon-item:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.star-icon {
  /* position: absolute;
  top: 10px;
  right: 10px; */
  color: gold;
  font-size: 24px;
  transition: transform 0.3s ease;
}

.star-icon:hover {
  transform: scale(1.2) rotate(15deg);
}

.pokemon-item img {
  width: 100px;
  height: auto;
  transition: transform 0.3s ease;
}

/* .pokemon-item:hover img {
  transform: scale(1.1);
} */

.pokemon-item p {
  margin-top: 0.5rem;
  color: white;
  font-weight: bold;
}

.types {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
}

.type-badge {
  color: white;
  font-weight: bold;
  padding: 0.3rem 0.6rem;
  margin-right: 5px;
  border-radius: 12px;
  font-size: 0.85rem;
  text-transform: capitalize;
}

.type-badge:last-child {
  margin-right: 0;
}
.star-icon {
  color: gold;
  font-size: 24px;
  transition: transform 0.3s ease;
}

.star-icon:hover {
  transform: rotate(15deg);
}
@media (max-width: 768px) {
  .pokemon-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .pokemon-item img {
    width: 80px;
  }

  .star-icon {
    font-size: 20px;
  }
}

.pokemon-star {
  width: 100%;
  display: flex;
  justify-content: end;
}
@media (max-width: 480px) {
  .pokemon-list {
    grid-template-columns: 1fr;
  }

  .pokemon-item img {
    width: 70px;
  }

  .star-icon {
    font-size: 18px;
  }
}
</style>
