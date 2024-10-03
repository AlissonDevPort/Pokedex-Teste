<template>
  <div>
    <input
      type="text"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Digite o nome do Pokémon"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "SearchInput",
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true,
    },
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
