<template>
  <div>
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)" 
      placeholder="Digite o nome do Pokémon"
    />
    <ul>
      <li v-for="poke in filteredPokeNames" :key="poke">{{ poke }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import { PokeSearch, searchPokemonByName } from "./SearchPokemon";

export default defineComponent({
  name: "SearchInput",
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const pokeList = ref([
      { name: "Bulbasaur" },
      { name: "Charmander" },
      { name: "Squirtle" },
    ]);
    const filteredPokeNames = ref<string[]>([]);

    const onInputChange = () => {
      const pokeSearchData: PokeSearch = {
        typedPoke: props.modelValue,
        pokeList: pokeList.value,
      };


      filteredPokeNames.value = searchPokemonByName(pokeSearchData) || [];
    };

    return {
      onInputChange,
      filteredPokeNames,
    };
  },
  watch: {
    modelValue: 'onInputChange',
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