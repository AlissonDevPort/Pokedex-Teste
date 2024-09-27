<template>
  <div v-if="pokemon" class="pokemon-info">
    <h2>{{ pokemon.name }} (#{{ pokemon.id }})</h2>
    <img :src="pokemonImage" alt="pokemon" class="pokemon-image" />

    <h3>Stats</h3>
    <ul class="pokemon-stats">
      <li v-for="stat in pokemon.stats" :key="stat.stat.name">
        {{ stat.stat.name }}: {{ stat.base_stat }}
      </li>
    </ul>

    <h3>Types</h3>
    <div
      v-for="type in pokemon.types"
      :key="type.type.name"
      :style="{ backgroundColor: typeColors[type.type.name] }"
    >
      {{ type.type.name }}
    </div>

    <h3>Evolution Chain</h3>
    <div v-if="evolutionChain.length" class="pokemon-evo">
      <div v-for="(evo, index) in evolutionChain" :key="index">
        <img
          :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`"
          alt="evolution"
        />
        <p>{{ evo.name }} zzzzz</p>
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

    const typeColors = {
      grass: "#78C850",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
    };

    onMounted(async () => {
      if (props.pokemonName) {
        const pokemonData = await getPokemonInfo(props.pokemonName);
        pokemon.value = pokemonData;
        pokemonImage.value = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`;

        const evolutionData = await getEvolutionChain(pokemonData.id);
        evolutionChain.value = extractEvolutionChain(evolutionData.chain);
      }
    });

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
  background-color: #f1f1;
}
.pokemon-image {
  width: 100px;
}
.pokemon-evo {
  display: flex;
  justify-content: center;
  align-items: center;
}
.pokemon-stats {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
