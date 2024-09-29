<template>
  <div class="pokemon-list">
    <div
      v-for="pokemon in pokemonList"
      :key="pokemon.name"
      class="pokemon-item"
      @click="selectPokemon(pokemon.name)"
    >
    {{typedPoke}}
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
  props: {
    onSelectPokemon: Function,
    typedPoke:{ type: String, default: String }
  },
  setup(props) {
    const { pokemonList, loading, loadPokemon } = usePokemon();

    const pokemonImage = (url: string) => {
      const id = url.split("/").filter(Boolean).pop();
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
    };

    const selectPokemon = (name: string) => {
      if (props.onSelectPokemon) props.onSelectPokemon(name);
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
      selectPokemon,
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
