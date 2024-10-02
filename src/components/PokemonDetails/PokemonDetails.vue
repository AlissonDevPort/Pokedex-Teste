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
    <h3>Stats</h3>
    <ul class="pokemon-stats">
      <li v-for="stat in pokemon.stats" :key="stat.stat.name" class="stat-item">
        {{ stat.stat.name }}: {{ stat.base_stat }}
      </li>
    </ul>

    <h3>Types</h3>
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
import { defineComponent, ref, onMounted } from "vue";
import { PokemonDetails, usePokemon } from "../usePokemon";

export default defineComponent({
  props: {
    pokemonName: String,
  },
  setup(props) {
    const { getPokemonInfo, getEvolutionChain } = usePokemon();
    const pokemon = ref<PokemonDetails | null>(null);
    const pokemonImage = ref("");
    const evolutionChain = ref<any[]>([]);
    const favoriteIds = ref<number[]>([]);
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

    onMounted(async () => {
      if (props.pokemonName) {
        const pokemonData = await getPokemonInfo(props.pokemonName);
        pokemon.value = pokemonData;
        pokemonImage.value = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`;

        const evolutionData = await getEvolutionChain(pokemonData.id);
        evolutionChain.value = extractEvolutionChain(evolutionData.chain);

        favoriteIds.value = JSON.parse(
          localStorage.getItem("pokeIdsFavorite") || "[]"
        );
      }
    });

    const isFavorite = () => {
      return pokemon.value
        ? favoriteIds.value.includes(pokemon.value.id)
        : false;
    };
    const pokemonIdToFavorite = () => {
      if (pokemon.value) {
        const pokeId = pokemon.value.id;

        if (favoriteIds.value.includes(pokeId)) {
          favoriteIds.value = favoriteIds.value.filter((id) => id !== pokeId);
          localStorage.setItem(
            "pokeIdsFavorite",
            JSON.stringify(favoriteIds.value)
          );
        } else {
          favoriteIds.value.push(pokeId);
          localStorage.setItem(
            "pokeIdsFavorite",
            JSON.stringify(favoriteIds.value)
          );
        }
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
}

.stat-item {
  width: 50%;
  box-sizing: border-box;
  padding: 0.5rem;
  text-align: center;
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

/* Media Queries for Responsiveness */
@media (max-width: 600px) {
  .pokemon-info {
    max-width: 90%;
  }

  .stat-item {
    width: 100%; /* Stack stats on smaller screens */
  }

  .pokemon-image {
    width: 80px; /* Smaller image for smaller screens */
  }

  .evolution-image {
    width: 50px; /* Smaller evolution images */
  }
}
</style>
