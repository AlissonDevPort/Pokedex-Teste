<template>
  <div>
    <select v-model="selectedTypeToAdd">
      <option value="">Selecione um tipo</option>
      <option v-for="type in pokemonTypesToFilter" :key="type" :value="type">
        {{ type }}
      </option>
    </select>
    <button @click="addType">Adicionar</button>

    <div class="selected-types">
      <div v-for="(type, index) in selectedTypes" :key="index" class="type-item">
        {{ type }}
        <button @click="removeType(index)">X</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from "vue";

export default defineComponent({
  name: "Dropdown",
  props: {
    modelValue: {
      type: Array as PropType<string[]>, 
      required: true,
    },
  },
  setup(props, { emit }) {
  
    const selectedTypeToAdd = ref<string>("");

 
    const pokemonTypesToFilter = ref<string[]>([
      "water",
      "poison",
      "fire",
      "grass",
      "flying",
      "rock",
      "ground",
      "fighting",
      "normal",
      "psychic",
      "ice",
      "eletric",
      "fairy",
      "dragon",
      "dark",
      "ghost",
      "steel",
    ]);

    const selectedTypes = ref<string[]>([...props.modelValue]);

    const addType = () => {
      if (
        selectedTypeToAdd.value &&
        !selectedTypes.value.includes(selectedTypeToAdd.value)
      ) {
        selectedTypes.value.push(selectedTypeToAdd.value);
        emit("update:modelValue", selectedTypes.value); 
        selectedTypeToAdd.value = ""; 
      }
    };

    const removeType = (index: number) => {
      selectedTypes.value.splice(index, 1);
      emit("update:modelValue", selectedTypes.value); 
    };
    watch(
      () => props.modelValue,
      (newVal) => {
        selectedTypes.value = [...newVal];
      }
    );

    return {
      selectedTypeToAdd,
      pokemonTypesToFilter,
      selectedTypes,
      addType,
      removeType,
    };
  },
});
</script>

<style scoped>
.selected-types {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.type-item {
  background-color: #e0e0e0;
  padding: 5px 10px;
  margin-right: 5px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  border-radius: 3px;
}

.type-item button {
  margin-left: 10px;
  background-color: red;
  color: white;
  border: none;
  padding: 2px 5px;
  cursor: pointer;
}
</style>