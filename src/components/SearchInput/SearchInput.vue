<template>
  <div>
    <input
      type="text"
      :value="modelValue"
      @input="handleInput"
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
  methods: {
    handleInput(event: Event) {
      const target = event.target as HTMLInputElement; 
      this.$emit('update:modelValue', target.value); 
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
