<script setup lang="ts">
import { computed, ref, watch } from "vue";
import PokemonDetailsVue from "./components/PokemonDetails/PokemonDetails.vue";
import PokemonListVue from "./components/PokemonList/PokemonList.vue";
import Modal from "./components/Modal/Modal.vue";
import SearchInput from "./components/SearchInput/SearchInput.vue";
import Dropdown from "./components/Dropdown/Dropdown.vue";

const selectedPokemon = ref<string | null>(null);
const selectedTypeToFilter = ref<string[]>([]);
const typedPoke = ref("");

const selectPokemon = (name: string) => {
  selectedPokemon.value = name;
  isModalVisible.value = true;
};

const clearSelection = () => {
  selectedPokemon.value = null;
  isModalVisible.value = false;
};

const isSearchInputDisabled = computed(
  () => selectedTypeToFilter.value.length >= 1
);

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
  <div id="app" :class="{ 'no-hover': isModalVisible }">
    <SearchInput v-model="typedPoke" :disabled="isSearchInputDisabled" />
    <Dropdown v-model="selectedTypeToFilter" />
    <Modal :isVisible="isModalVisible" @close="clearSelection">
      <PokemonDetailsVue
        :pokemonName="selectedPokemon"
        @clearSelection="clearSelection"
      />
    </Modal>
    <PokemonListVue
      :isModalVisible="isModalVisible"
      @selectPokemon="selectPokemon"
      :typedPoke="typedPoke"
      :selectedTypeToFilter="selectedTypeToFilter"
    />
    <button v-if="selectedPokemon" @click="clearSelection">Voltar</button>
  </div>
</template>

<style>
.no-hover .pokemon-item:hover {
  transform: none;
  box-shadow: none;
}
</style>
