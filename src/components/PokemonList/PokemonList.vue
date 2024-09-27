<template>
  <div class="pokemon-list">
    <div
      v-for="pokemon in pokemonList"
      :key="pokemon.name"
      class="pokemon-item"
      
    >
      <img :src="pokemonImage(pokemon.url)" alt="pokemon" />
      <p>{{ pokemon.name }}</p>
    </div>
    <div v-if="loading">Carregando...</div>
  </div>
</template>

<script lang="tsx">
import { defineComponent, onMounted } from "vue";

import { usePokemon } from "../usePokemon";

export default defineComponent({
  setup() {
    const { pokemonList, loading, loadPokemon } = usePokemon();

    const pokemonImage = (url: string) => {
      // tentar evitar esse uso e pensar em algo diferente
      console.log(url)
      const id = url.split("/").filter(Boolean).pop();
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    };

    const handleScroll = () => {
      const bottomOfWindow =
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight;
      if (bottomOfWindow && !loading.value) {
        loadPokemon();
      }
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    return {
      pokemonList,
      loading,
      pokemonImage,

    };
  },
});
</script>

<style scoped>
.pokemon-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}
.pokemon-item {
  text-align: center;
  cursor: pointer;
}
</style>
