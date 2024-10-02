<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <div class="btn-close">
        <button @click="closeModal" class="close-button">X</button>
      </div>
      <slot> </slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: rgb(128, 128, 128);
  padding: 20px;
  border-radius: 5px;
  width: 350px;
  text-align: center;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
