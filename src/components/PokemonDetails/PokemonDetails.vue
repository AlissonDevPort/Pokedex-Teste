<template>
  <div v-if="pokemon" class="pokemon-info">
    <div class="pokemon-name-star">
      <h2 @click="pokemonIdToFavorite">
        {{ pokemon.name }} (#{{ pokemon.id }})
      </h2>
      <font-awesome-icon
        :icon="isFavorite() ? 'fas fa-star' : 'far fa-star'"
        @click="pokemonIdToFavorite"
        class="star-icon"
      />
    </div>
    <img :src="pokemonImage" alt="pokemon" class="pokemon-image" />
    <h4 class="pokemon-sub-info">Stats</h4>
    <ul class="pokemon-stats">
      <li v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat-item">
        {{ stat.stat.name }}: {{ stat.base_stat }}
      </li>
    </ul>

    <h4 class="pokemon-sub-info">Types</h4>
    <div class="types">
      <div
        class="type-badge"
        v-for="type in pokemon.types"
        :key="type.type.name"
        :style="{ backgroundColor: typeColors[type.type.name] }"
      >
        {{ type.type.name }}
      </div>
    </div>

    <h3>Evolution Chain</h3>
    <div v-if="evolutionChain.length" class="pokemon-evo">
      <div
        v-for="(evo, index) in evolutionChain"
        :key="index"
        class="evolution-item"
      >
        <img
          :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`"
          alt="evolution"
          class="evolution-image"
        />
        <p>{{ evo.name }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from "vue";
import { usePokemonDetails } from "./usePokemonDetails";

export default defineComponent({
  props: {
    pokemonName: String ,
  },
  setup(props) {
    const pokemonName = props.pokemonName ?? '';
    const {
      pokemon,
      pokemonImage,
      evolutionChain,
      typeColors,
      pokemonIdToFavorite,
      isFavorite,
    } = usePokemonDetails(pokemonName);

    return {
      pokemon,
      pokemonImage,
      evolutionChain,
      typeColors,
      pokemonIdToFavorite,
      isFavorite,
    };
  },
});
</script>
<style scoped>
.pokemon-info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #444444;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: auto;

  max-height: 90vh; 
  overflow-y: auto; 
}
.star-icon {
  color: gold;
  font-size: 24px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.star-icon:hover {
  transform: scale(1.1) rotate(15deg);
}
.pokemon-image {
  width: 100px;
  margin-bottom: 1rem;
}

.pokemon-evo {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.pokemon-stats {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
  gap: 10px; 
}

.stat-item {
  width: calc(50% - 10px); 
  box-sizing: border-box;
  padding: 0.5rem;
  text-align: center;
  background-color: #555; 
  border-radius: 8px;

  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis; 
}

.pokemon-info::-webkit-scrollbar {
  width: 8px;
}

.pokemon-info::-webkit-scrollbar-thumb {
  background-color: #888; 
  border-radius: 10px; 
}

.pokemon-info::-webkit-scrollbar-thumb:hover {
  background-color: #555; 
}

.types {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  flex-wrap: wrap;
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

.evolution-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0.5rem;
}

.evolution-image {
  width: 60px;
}
.pokemon-name-star {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}

@media (max-width: 600px) {
  .pokemon-info {
    max-width: 90%;
  }

  .pokemon-image {
    width: 55px;
    margin: 0px;
  }

  .evolution-image {
    width: 50px; 
  }
  .pokemon-sub-info{
    margin:5px;
  }
}

</style>
