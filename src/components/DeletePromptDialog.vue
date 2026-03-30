<template>
  <div>
    <dialog ref="myDialog">
      <form method="dialog">
        <h2>Confirm Delete</h2>
        <p>
          Are you sure you want to delete
          {{ deleteType === 'multi' ? 'these tasks?' : 'this task?' }}
        </p>

        <div class="btn-box">
          <button type="button" class="cancel-btn" @click="closeDialog">Cancel</button>
          <button type="button" class="confirm-btn" @click="confirm">Delete</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script>
export default {
  emits: ['confirm'],
  props: {
    deleteType: { type: String, default: '' },
  },
  methods: {
    openDialog() {
      this.$refs.myDialog.showModal();
    },
    closeDialog() {
      this.$refs.myDialog.close();
    },
    confirm() {
      this.$emit('confirm');
      this.closeDialog();
    },
  },
};
</script>

<style scoped>
/* Styling the background dimming */
dialog::backdrop {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
}

/* Basic dialog styling */
dialog {
  border: none;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.cancel-btn {
  font-size: 17px;
  font-family: 'Source Sans Pro', sans-serif;
  border: none;
  border-radius: 5px;
  padding: 6px 18px;
}

.confirm-btn {
  font-size: 17px;
  font-family: 'Source Sans Pro', sans-serif;
  border: none;
  border-radius: 5px;
  padding: 6px 18px;
  margin-left: 1rem;
  background-color: rgb(87, 182, 134);
  color: #fff;
}

.btn-box {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>
