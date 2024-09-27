<script setup lang="ts">
import { ref } from "vue";
import PokemonDetailsVue from "./components/PokemonDetails/PokemonDetails.vue";
import PokemonListVue from "./components/PokemonList/PokemonList.vue";
import Modal from "./components/Modal/Modal.vue";
import SearchInput from "./components/SearchInput/SearchInput.vue";

const selectedPokemon = ref<string | null>(null);

const selectPokemon = (name: string) => {
  selectedPokemon.value = name;
  isModalVisible.value = true;
};

const clearSelection = () => {
  selectedPokemon.value = null;
  isModalVisible.value = false;
};

const isModalVisible = ref(false);
</script>

<template>
  <SearchInput />
  <Modal :isVisible="isModalVisible" @close="clearSelection">
    <PokemonDetailsVue
      :pokemonName="selectedPokemon"
      @clearSelection="clearSelection"
    />
  </Modal>

  <PokemonListVue @selectPokemon="selectPokemon" />
  <button v-if="selectedPokemon" @click="clearSelection">Voltar</button>
</template>

<style scoped></style>
