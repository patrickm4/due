<template>
  <div class="page-day">
    <template v-if="!isCreatingOrEditing">
      <div class="header">
        <h1>{{ dayName }}</h1>
        <div style="position: relative">
          <span class="add-font" @click="openCreateOrEdit('create')">+</span>
          <span
            v-if="!isOptionsDropdownActive"
            class="add-font option-ellipsis"
            @click.stop="isOptionsDropdownActive = true"
            >⋯</span
          >
          <span
            v-if="isOptionsDropdownActive"
            class="add-font option-ellipsis option-ellipsis-active"
            @click="isOptionsDropdownActive = false"
            >⋯</span
          >
          <div ref="dropdownMenu">
            <OptionsDropdown
              v-if="isOptionsDropdownActive"
              @closeChecked="openConfirmDelete('multi')"
            />
          </div>
        </div>
      </div>
      <div v-if="todos && todos.length" class="todos-container">
        <VueDraggable
          v-model="todos"
          handle=".drag-handle"
          dragClass="drag-item"
          :animation="150"
          @start="isUpdatingPosition = true"
        >
          <div
            v-for="(todo, index) in todos"
            :key="todo.id"
            @click="ToggleTaskActions(todo.id)"
            class="task-and-btns-container"
          >
            <div
              class="tick-and-text-container"
              :class="[selectedTaskId === todo.id ? 'border-active-task' : '']"
            >
              <div>
                <label>
                  <input
                    type="checkbox"
                    :checked="todo.isCompleted"
                    @click.stop
                    @change="updateChecked(todo.id, todo.isCompleted)"
                  />
                </label>
                <span class="todo-text" :class="{ 'dark-and-strike-through': todo.isCompleted }">{{
                  todo.taskName
                }}</span>
              </div>
              <span v-if="todos?.length > 1" class="drag-handle">
                <img src="/drag-handle.svg" class="drag-handle" />
              </span>
            </div>
            <template v-if="selectedTaskId === todo.id">
              <div class="days-added-box">{{ daysSinceAdded(todo) }}</div>
              <div class="task-dropdown">
                <div class="task-actions-container">
                  <button @click.stop="openConfirmDelete('single')">Delete</button>
                  <button
                    v-for="otherDay in otherDays"
                    :key="todo.id + otherDay"
                    @click.stop="changeTaskDay(otherDay)"
                  >
                    Do it {{ otherDay }}
                  </button>
                  <button @click.stop="openCreateOrEdit('edit')">Edit</button>
                </div>
              </div>
            </template>
          </div>
        </VueDraggable>
      </div>
      <div v-else class="todos-container" @click="openCreateOrEdit('create')">
        <span class="what-to-do-text">What to do {{ dayName.toLowerCase() }}...</span>
      </div>
    </template>
    <template v-else>
      <div class="close-create-todo-btn" @click="closeInput">Close</div>
      <div class="create-todo-input-box">
        <div class="task-input-area">
          <span class="due-day-text">Due {{ dayName }}</span>
          <input
            v-if="isEditingTask"
            type="text"
            v-model="editingTask.taskName"
            class="create-todo-input"
            @keyup.enter="createOrEditTodo"
            :ref="`create-todo-${dayName.toLowerCase()}`"
          />
          <input
            v-else
            type="text"
            v-model="newTodo"
            class="create-todo-input"
            @keyup.enter="createOrEditTodo"
            :ref="`create-todo-${dayName.toLowerCase()}`"
          />
          <button class="create-task-btn" @click="createOrEditTodo">
            {{ isCreating ? 'Create' : 'Edit' }}
          </button>
        </div>
      </div>
    </template>
    <DeletePromptDialog ref="deletePrompt" @confirm="confirmDelete" :deleteType="deleteType" />

    <div v-if="isToastin" class="toast">No Completed Tasks To Delete</div>
  </div>
</template>

<script>
import DeletePromptDialog from './DeletePromptDialog.vue';
import OptionsDropdown from './OptionsDropdown.vue';
import { v4 as uuidv4 } from 'uuid';
import { todoRepository } from '@/db/repository.js';
import { cloneDeep } from 'lodash';
import { VueDraggable } from 'vue-draggable-plus';
import { helper } from '@/composables/helpers.js';

export default {
  components: { DeletePromptDialog, OptionsDropdown, VueDraggable },
  emits: ['updateOtherDay', 'update:items', 'reloadCache'],
  props: {
    items: {
      type: Array,
      default: function () {
        return [];
      },
    },
    dayName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      list: [], // initialize the passed todos
      isCreating: false,
      newTodo: '',
      editingTask: null,
      selectedTaskId: '',
      isEditingTask: false,
      isCreatingOrEditing: false,
      isUpdatingPosition: false,
      isOptionsDropdownActive: false,
      deleteType: '',
      isToastin: false,
    };
  },
  mounted() {
    document.addEventListener('click', this.closeIfClickedOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.closeIfClickedOutside);
  },
  computed: {
    todos: {
      get() {
        return this.items;
      },
      set(value) {
        let savingValue = value;

        if (this.isUpdatingPosition) {
          savingValue = helper.updatePositions(value);
          this.isUpdatingPosition = false;
        }

        this.$emit('update:items', savingValue);
      },
    },
    otherDays() {
      const allDays = ['someday', 'today', 'tomorrow'];
      return allDays.filter((d) => d !== this.dayName.toLowerCase());
    },
    checkedTasks() {
      return this.todos.filter((todo) => todo.isCompleted);
    },
  },
  methods: {
    closeIfClickedOutside(event) {
      if (this.isOptionsDropdownActive && !this.$refs.dropdownMenu.contains(event.target)) {
        this.isOptionsDropdownActive = false;
      }
    },
    confirmDelete() {
      if (this.deleteType === 'multi') {
        this.closeChecked();
      } else {
        this.deleteTask();
      }
    },
    openConfirmDelete(type = '') {
      if (type === 'multi') {
        if (this.checkedTasks?.length === 0) {
          this.isToastin = true;
          setTimeout(() => {
            this.isToastin = false;
          }, 3000);
          return;
        }
      }
      this.deleteType = type;
      this.$refs.deletePrompt.openDialog();
    },
    async closeChecked() {
      const idsToClose = this.checkedTasks.map((task) => task.id);

      await todoRepository.bulkDelete(idsToClose);
      this.$emit('reloadCache');
    },
    daysSinceAdded(row) {
      const today = new Date();
      const created = new Date(row.createdAt);
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      const diffInDays = Math.trunc((today - created) / millisecondsPerDay);
      let message = '';

      if (diffInDays === 0) {
        message = 'Created Today';
      } else if (diffInDays > 0) {
        if (diffInDays === 1) {
          message = 'Created yesterday';
        } else {
          message = `Created ${diffInDays} days ago`;
        }
      }

      return message;
    },
    ToggleTaskActions(taskId) {
      !this.selectedTaskId || this.selectedTaskId !== taskId
        ? (this.selectedTaskId = taskId)
        : (this.selectedTaskId = '');
    },
    /**
     * When the checkbox is checked run this to update the database
     * @params {string} id
     * @params {boolean} isChecked
     */
    async updateChecked(id, isChecked) {
      await todoRepository.update(id, { isCompleted: !isChecked });
      this.$emit('reloadCache');
    },
    /**
     * Assign the editing task obj to be editable
     */
    setEditTask() {
      const taskToEdit = this.todos.find((t) => t.id === this.selectedTaskId);

      this.editingTask = cloneDeep(taskToEdit);

      this.isEditingTask = true;
    },
    /**
     * Change the day for the task
     * @param {string} day
     */
    async changeTaskDay(day) {
      const time = new Date();
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const currentDay = time.getDate();

      switch (day) {
        case 'today':
          break;
        case 'tomorrow':
          time.setDate(currentDay + 1);
          break;
        case 'someday': {
          // TODO need to setup a global way to set what time some day will be so we can make it user editable later
          const min = Math.ceil(7);
          const max = Math.floor(21);
          const randomDays = Math.floor(Math.random() * (max - min) + min);
          time.setDate(currentDay + randomDays);
          break;
        }
      }

      const todo = cloneDeep(this.todos.find((t) => t.id === this.selectedTaskId));

      todo.dueDate = time.toLocaleString('en-US', {
        timeZone: timezone,
      });

      this.selectedTaskId = '';

      this.$emit('updateOtherDay', day, todo);
    },
    /**
     * Delete the selected task and grab fresh data
     */
    async deleteTask() {
      await todoRepository.delete(this.selectedTaskId);
      this.selectedTaskId = '';
      this.$emit('reloadCache');
    },
    /**
     * start the edit or create action depeding on the current state the user is in
     */
    createOrEditTodo() {
      if (this.isCreating) {
        this.createTodo();
      } else if (this.isEditingTask) {
        this.EditTodo();
      }
    },
    /**
     * Save any edits and grab fresh data
     */
    async EditTodo() {
      await todoRepository.put({
        ...this.editingTask,
      });

      this.closeInput();
      this.$emit('reloadCache');
    },
    /**
     * Create the task and grab fresh data
     */
    async createTodo() {
      if (!this.isEditingTask) {
        // use clients timezone
        const time = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let timeToSave = null;
        let meta = {
          timezone,
        };

        switch (this.dayName.toLowerCase()) {
          case 'tomorrow': {
            const currentDay = time.getDate();
            time.setDate(currentDay + 1);

            timeToSave = time.toLocaleString('en-US', { timeZone: timezone });
            break;
          }
          case 'someday': {
            const min = Math.ceil(7);
            const max = Math.floor(21);
            const randomDays = Math.floor(Math.random() * (max - min) + min);
            const currentDay = time.getDate();
            time.setDate(currentDay + randomDays);

            timeToSave = time.toLocaleString('en-US', { timeZone: timezone });
            meta.someday = {
              numOfRandomDays: randomDays,
            };
            break;
          }
          case 'today':
          default:
            timeToSave = time.toLocaleString('en-US', { timeZone: timezone });
        }

        const newTodo = {
          id: `task-${uuidv4()}`,
          taskName: this.newTodo,
          isCompleted: false,
          dueDate: timeToSave,
          createdAt: new Date().toLocaleString('en-US', {
            timeZone: timezone,
          }),
          meta,
          position: 0,
        };

        const updatedPositionsList = this.todos.map((todo) => {
          todo.position += 1;
          return todo;
        });

        await todoRepository.bulkPut([newTodo, ...updatedPositionsList]);

        this.newTodo = '';
        this.isCreating = false;
      } else {
        await todoRepository.put({
          ...this.editingTask,
        });

        this.isEditingTask = false;
        this.editingTask = null;
        this.selectedTaskId = '';
      }
      this.closeInput();
      this.$emit('reloadCache');
    },
    /**
     * Close inputs and reset users state
     */
    closeInput() {
      this.isEditingTask = false;
      this.editingTask = null;
      this.isCreating = false;
      this.isCreatingOrEditing = false;
    },
    /**
     * Change users state, setup the editing area if editing and focus the input
     * @param {string} action
     */
    openCreateOrEdit(action) {
      if (action === 'edit') {
        this.setEditTask();
      } else if (action === 'create') {
        this.isCreating = true;
      }

      this.isCreatingOrEditing = true;

      this.$nextTick(() => {
        this.$refs[`create-todo-${this.dayName.toLowerCase()}`].focus();
      });
    },
  },
};
</script>

<style>
.task-and-btns-container {
  width: 95%;
  margin: 0.5rem 0 0.5rem 0;
}
.border-active-task {
  border-top: 1px solid #505662;
  padding: 0.25rem 0 0 0;
  margin-top: 0.5rem;
}
.tick-and-text-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
input[type='checkbox'] {
  width: 18px;
  height: 18px;
  margin-right: 1rem;
  flex: 1;
}
.todo-text,
.what-to-do-text {
  font-size: 16pt;
}
.due-day-text {
  font-size: 14pt;
}
.task-dropdown-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1rem;
}
.task-dropdown-right > button {
  margin-bottom: 0.5rem;
}
.task-dropdown {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}
.close-create-todo-btn {
  margin: 1rem;
}
.create-todo-input {
  border: none;
  border-bottom: 2px solid #eee;
  border-left: 2px solid #eee;
  border-right: 2px solid #eee;
  background-color: #282c34;
  color: #fff;
  margin-top: 2rem;
  padding: 0.5rem 1rem;
  font-size: 18pt;
  outline: none;
}
.create-todo-input-box,
.task-input-area {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.create-todo-input-box {
  justify-content: space-between;
  height: 80vh;
}
.todos-container {
  margin-left: 1.5rem;
  overflow: auto;
  height: 80vh;
}
.add-font {
  font-size: 24pt;
  margin-right: 20px;
}
.task-actions-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #505662;
}
.task-actions-container > button {
  background-color: #424855;
  padding: 0.25rem 0.5rem;
  text-decoration: none;
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 0.2rem;
  color: #e7e7e7;
}
.create-task-btn {
  width: 92vw;
  height: 40px;
  background-color: #3f4f5f;
  border-color: #3f4f5f;
  color: #eee;
  border-style: solid;
  border-width: 1px;
  margin-top: 25px;
}
.drag-handle {
  height: 30px;
}
.drag-item {
  background-color: rgb(83, 53, 218);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.days-added-box {
  margin: 0.25rem 0 1rem 0;
  color: #3ca78a;
}
.option-ellipsis {
  padding: 0.5rem;
}
.option-ellipsis-active {
  background-color: aquamarine;
  color: black !important;
}

.toast {
  background: #2c3e50;
  padding: 1.5rem;
  color: #fff;
  display: flex;
  justify-content: center;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70vw;
  border-radius: 6px;
}
</style>
