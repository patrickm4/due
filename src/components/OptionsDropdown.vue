<template>
  <div class="options-dropdown-container">
    <div class="option-btn" @click="closeChecked">
      <span>Close Checked</span>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['closeChecked'],
  methods: {
    closeChecked() {
      this.$emit('closeChecked');
    },
  },
};
</script>

<style scoped>
.options-dropdown-container {
  position: absolute;
  background-color: #f1f1f1;
  min-width: 160px;
  right: 20px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}
.option-btn {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}
.option-btn:hover {
  background-color: #ddd;
}
</style>
