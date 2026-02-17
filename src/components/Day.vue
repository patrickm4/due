<template>
  <div class="page-day">
    <template v-if="!isCreatingOrEditing">
      <h1>{{ dayName }}</h1>
      <div v-if="todos && todos.length" class="todos-container">
        <div
          v-for="(todo, index) in todos"
          :key="todo.id"
          @click="ToggleTaskActions(todo.id)"
          :style="{ paddingBottom: index + 1 === todos.length ? '100px' : '' }"
          class="task-and-btns-container"
        >
          <div
            class="tick-and-text-container"
            :class="[selectedTaskId === todo.id ? 'border-active-task' : '']"
          >
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
          <div v-if="selectedTaskId === todo.id" class="task-dropdown">
            <div class="task-actions-container">
              <button @click.stop="openCreateOrEdit('edit')">Edit</button>
              <button
                v-for="otherDay in otherDays"
                :key="todo.id + otherDay"
                @click.stop="changeTaskDay(otherDay)"
              >
                Do it {{ otherDay }}
              </button>
              <button @click.stop="deleteTask">Delete</button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="todos-container" @click="openCreateOrEdit('create')">
        <span class="what-to-do-text">What to do {{ dayName.toLowerCase() }}...</span>
      </div>
      <div class="add-todo-btn">
        <!-- maybe dont show this if no task this day? -->
        <span class="add-font" @click="openCreateOrEdit('create')">+</span>
        <!-- 
            other options
            remove completed items
            about
           -->
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
        </div>
        <div>
          <button class="create-task-btn" @click="createOrEditTodo">
            {{ isCreating ? 'Create' : 'Edit' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid';
import { todoRepository } from '@/db/repository.js';
import { cloneDeep } from 'lodash';

export default {
  name: 'Day',
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
    };
  },
  computed: {
    todos() {
      return this.items;
    },
    otherDays() {
      const allDays = ['someday', 'today', 'tomorrow'];
      return allDays.filter((d) => d !== this.dayName.toLowerCase());
    },
  },
  methods: {
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

      await todoRepository.update(this.selectedTaskId, {
        dueDate: time.toLocaleString('en-US', {
          timeZone: timezone,
        }),
      });

      this.selectedTaskId = '';
      this.$emit('reloadCache');
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
        };

        await todoRepository.add(newTodo);

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
  padding: 0.25rem 0 0.5rem 0;
  margin-top: 0.5rem;
}
.tick-and-text-container {
  display: flex;
  align-items: center;
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
  font-size: 36pt;
}
.add-todo-btn {
  position: absolute;
  bottom: 5%;
  display: flex;
  justify-content: center;
  width: 100%;
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
}
</style>
