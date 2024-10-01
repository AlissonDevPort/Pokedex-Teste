<script setup lang="ts">
import { computed, ref, watch } from "vue";
import PokemonDetailsVue from "./components/PokemonDetails/PokemonDetails.vue";
import PokemonListVue from "./components/PokemonList/PokemonList.vue";
import Modal from "./components/Modal/Modal.vue";
import SearchInput from "./components/SearchInput/SearchInput.vue";
import Dropdown from "./components/Dropdown/Dropdown.vue";

const selectedPokemon = ref<string | null>(null);
const selectedTypeToFilter = ref<string[]>([]);
console.log(selectedTypeToFilter);
const typedPoke = ref("");
const typedPokeType = ref("");

const selectPokemon = (name: string) => {
  selectedPokemon.value = name;
  isModalVisible.value = true;
};

const clearSelection = () => {
  selectedPokemon.value = null;
  isModalVisible.value = false;
};
const isSearchInputDisabled = computed(() => selectedTypeToFilter.value.length >= 1);

const clearSearchInput = () => {
  typedPoke.value = "";
};
watch(selectedTypeToFilter, (newValue) => {
  if (newValue.length > 0) {
    clearSearchInput(); 
  }
});
const isModalVisible = ref(false);
</script>

<template>
   <SearchInput v-model="typedPoke" :disabled="isSearchInputDisabled" />
  <Dropdown v-model="selectedTypeToFilter" />
  {{ typedPokeType }}
  <Modal :isVisible="isModalVisible" @close="clearSelection">
    <PokemonDetailsVue
      :pokemonName="selectedPokemon"
      @clearSelection="clearSelection"
    />
  </Modal>

  <PokemonListVue
    @selectPokemon="selectPokemon"
    :typedPoke="typedPoke"
    :selectedTypeToFilter="selectedTypeToFilter"
  />
  <button v-if="selectedPokemon" @click="clearSelection">Voltar</button>
</template>

<style scoped></style>
