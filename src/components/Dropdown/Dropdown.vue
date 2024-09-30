<template>
  <select v-model="selectedTypeToFilter">
    <option value="">Todos os tipos</option>
    <option v-for="type in pokemonTypesToFilter" :key="type" :value="type">
      {{ type }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from "vue";
import { usePokemon } from "../usePokemon";

export default defineComponent({
  name: "Dropdown",
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selectedTypeToFilter = ref<string>("");

    const pokemonTypesToFilter = ref<string[]>([
      "water",
      "poison",
      "fire",
      "grass",
    ]);
    watch(selectedTypeToFilter, (newValue) => {
      emit("update:modelValue", newValue);
    });

    return {
        selectedTypeToFilter,
        pokemonTypesToFilter,
    };
  },
});
</script>
