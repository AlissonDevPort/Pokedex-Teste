<script setup lang="ts">
import { ref } from "vue";
import PokemonDetailsVue from "./components/PokemonDetails/PokemonDetails.vue";
import PokemonListVue from "./components/PokemonList/PokemonList.vue";
import Modal from "./components/Modal/Modal.vue";
import SearchInput from "./components/SearchInput/SearchInput.vue";
import Dropdown from "./components/Dropdown/Dropdown.vue";
import { ToastifyContainer } from "vue3-toastify";

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

// const isSearchInputDisabled = computed(
//   () => selectedTypeToFilter.value.length >= 1
// );

// const clearSearchInput = () => {
//   typedPoke.value = "";
// };

// watch(selectedTypeToFilter, (newValue) => {
//   if (newValue.length > 0) {
//     clearSearchInput();
//   }
// });
const isModalVisible = ref(false);
</script>

<template>
  <div :class="{ 'no-hover': isModalVisible }">
    <div class="container-main">
      <SearchInput v-model="typedPoke" />
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
  </div>
  <ToastifyContainer />
</template>

<style>
.container-main{
  padding: 20px;
}
.no-hover .pokemon-item:hover {
  transform: none;
  box-shadow: none;
}
</style>
