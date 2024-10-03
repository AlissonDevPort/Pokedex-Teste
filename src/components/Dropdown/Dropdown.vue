<template>
  <div>
    <div class="dropdown-container">
      <select v-model="selectedTypeToAdd" class="custom-select">
        <option value="" disabled selected>Selecione um tipo</option>
        <option v-for="type in pokemonTypesToFilter" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
      <button @click="addType">Adicionar</button>
    </div>

    <div class="selected-types">
      <div
        v-for="(type, index) in selectedTypes"
        :key="index"
        class="type-item"
      >
        {{ type }}
        <button @click="removeType(index)">X</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from "vue";
import { usePokemon } from "../usePokemon";
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
    const { loading } = usePokemon();

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
      loading,
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
.dropdown-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 10px;
}

.custom-select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #6d6d6d;
  cursor: pointer;

}

.custom-select:focus {
  outline: none;
  border-color: #66afe9; 
}

.custom-select option {
  padding: 10px; 
  background-color: #3a3a3a; 
}

.selected-types {
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.type-item {
  background-color: #858585;
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