<template>
  <div class="pokemon-list">
    <div
      v-for="pokemon in pokemonList"
      :key="pokemon.name"
      class="pokemon-item"
      @click="selectPokemon(pokemon.name)"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="2rem"
        viewBox="0 0 576 512"
      >
        <path
          d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z"
        />
      </svg>

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
