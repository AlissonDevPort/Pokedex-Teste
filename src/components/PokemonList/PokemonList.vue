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
import { defineComponent } from "vue";
import { usePokemonList } from "./usePokemonList";

export default defineComponent({
  props: {
    onSelectPokemon: Function,
    typedPoke: { type: String, default: "" },
    selectedTypeToFilter: { type: Array as () => string[], default: () => [] },
  },
  setup(props) {
    const {
      pokemonList,
      loading,
      pokemonImage,
      selectPokemon,
      pokemonTypes,
      filteredPokemonList,
      typeColors,
      getPokemonId,
      isFavorite,
    } = usePokemonList(props);

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
