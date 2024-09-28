<template>
  <div>
    <input
      type="text"
      :value="typedPoke"
      @input="$emit(event.target.value)"
      placeholder="Digite o nome do Pokémon"
    />
    {{ typedPoke }}
    <ul>
      <li v-for="poke in filteredPokeNames" :key="poke">{{ poke }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { PokeSearch, searchPokemonByName } from "./SearchPokemon";

export default defineComponent({
  name: "App",
  setup() {
    // Estado para armazenar o nome digitado e os resultados filtrados
    const typedPoke = ref("");
    const pokeList = ref([
      { name: "Bulbasaur" },
      { name: "Charmander" },
      { name: "Squirtle" },
      // Adicione mais Pokémons aqui
    ]);
    const filteredPokeNames = ref<string[]>([]);

    // Função chamada quando o input mudar
    const onInputChange = () => {
      const pokeSearchData: PokeSearch = {
        typedPoke: typedPoke.value,
        pokeList: pokeList.value,
      };

      // Atualiza a array com o resultado da busca
      filteredPokeNames.value = searchPokemonByName(pokeSearchData) || [];
    };

    return {
      onInputChange,
      typedPoke,
      filteredPokeNames,
    };
  },
});
</script>

<style scoped>
input {
  padding: 0.5rem;
  font-size: 1rem;
}
ul {
  margin-top: 1rem;
}
li {
  list-style: none;
  font-size: 1.2rem;
}
</style>
