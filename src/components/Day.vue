<template>
  <div class="page-day">
    <template v-if="!isCreating">
      <h1>{{ dayName }}</h1>
      <div v-if="todos && todos.length" class="todos-container">
        <draggable :list="todos" class="drag-area" @change="handleChange">
          <div
            v-for="(todo, index) in todos"
            :key="todo.id"
            @click="ToggleTaskActions(todo.id)"
            :style="{
              paddingBottom: index + 1 === todos.length ? '100px' : '',
            }"
            class="task-and-btns-container"
          >
            <div
              class="tick-and-text-container"
              :class="[selectedTask === todo.id ? 'border-active-task' : '']"
            >
              <label>
                <input
                  type="checkbox"
                  :checked="todo.checked"
                  @click.stop
                  @change="updateChecked(todo.id, todo.checked)"
                />
              </label>
              <span
                class="todo-text"
                :class="{ 'dark-and-strike-through': todo.checked }"
                >{{ todo.task }}</span
              >
            </div>
            <div v-if="selectedTask === todo.id" class="task-dropdown">
              <div class="task-actions-container">
                <button @click.stop="editTask">Edit</button>
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
        </draggable>
      </div>
      <div v-else class="todos-container" @click="openCreateOrEdit">
        <span class="what-to-do-text"
          >What to do {{ dayName.toLowerCase() }}...</span
        >
      </div>
      <div class="add-todo-btn">
        <!-- maybe dont show this if no task this day? -->
        <span class="add-font" @click="openCreateOrEdit">+</span>
        <!-- 
            other options
            remove completed items
            about
           -->
      </div>
    </template>
    <template v-else>
      <div class="close-create-todo-btn" @click="isCreating = false">Close</div>
      <div class="create-todo-input-box">
        <div class="task-input-area">
          <span class="due-day-text">Due {{ dayName }}</span>
          <input
            type="text"
            v-model="newTodo"
            class="create-todo-input"
            @keyup.enter="createOrEditTodo"
            :ref="`create-todo-${dayName.toLowerCase()}`"
          />
        </div>
        <div>
          <button class="create-task-btn" @click="createOrEditTodo">
            Create
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { VueDraggableNext } from "vue-draggable-next";
import { v4 as uuidv4 } from "uuid";

export default {
  components: {
    draggable: VueDraggableNext,
  },
  props: {
    items: {
      type: Array,
      default: function () {
        return [];
      },
    },
    dayName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      list: [], // initialize the passed todos
      isCreating: false,
      newTodo: "",
      selectedTask: "",
      editingTask: false,
    };
  },
  computed: {
    todos() {
      return this.list;
    },
    otherDays() {
      const allDays = ["someday", "today", "tomorrow"];
      return allDays.filter((d) => d !== this.dayName.toLowerCase());
    },
  },
  watch: {
    items: {
      deep: true,
      handler(val) {
        this.list = val;
      },
    },
  },
  methods: {
    handleChange(event) {
      console.log("Changed:", event);
    },
    ToggleTaskActions(taskId) {
      !this.selectedTask || this.selectedTask !== taskId
        ? (this.selectedTask = taskId)
        : (this.selectedTask = "");
    },
    updateChecked(id, isChecked) {
      const cachedTodos = window.localStorage.getItem("todos")
        ? JSON.parse(window.localStorage.getItem("todos"))
        : "";

      if (cachedTodos) {
        const cachedTodoIndex = cachedTodos.findIndex((t) => t.id === id);

        cachedTodos[cachedTodoIndex].checked = !isChecked;

        window.localStorage.setItem("todos", JSON.stringify(cachedTodos));
        this.$emit("reloadCache");
      }
    },
    editTask() {
      const cachedTodos = window.localStorage.getItem("todos")
        ? JSON.parse(window.localStorage.getItem("todos"))
        : "";

      if (cachedTodos) {
        const cachedTodoIndex = cachedTodos.findIndex(
          (t) => t.id === this.selectedTask
        );

        this.newTodo = cachedTodos[cachedTodoIndex].task;
      }

      this.editingTask = true;
      this.openCreateOrEdit();
    },
    changeTaskDay(day) {
      const taskIndex = this.list.findIndex((t) => t.id === this.selectedTask);

      if (taskIndex !== -1) {
        this.list.splice(taskIndex, 1);
        const cachedTodos = window.localStorage.getItem("todos")
          ? JSON.parse(window.localStorage.getItem("todos"))
          : "";

        if (cachedTodos) {
          const cachedTodoIndex = cachedTodos.findIndex(
            (t) => t.id === this.selectedTask
          );
          const time = new Date();
          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const currentDay = time.getDate();

          // adjust due date
          switch (day) {
            case "today":
              break;
            case "tomorrow":
              time.setDate(currentDay + 1);
              break;
            case "someday": {
              const min = Math.ceil(7);
              const max = Math.floor(21);
              const randomDays = Math.floor(Math.random() * (max - min) + min);
              time.setDate(currentDay + randomDays);
              break;
            }
          }

          cachedTodos[cachedTodoIndex].due_date = time.toLocaleString("en-US", {
            timeZone: timezone,
          });

          window.localStorage.setItem("todos", JSON.stringify(cachedTodos));
        }

        this.selectedTask = "";
        this.$emit("reloadCache");
      }
    },
    deleteTask() {
      const taskIndex = this.list.findIndex((t) => t.id === this.selectedTask);

      if (taskIndex !== -1) {
        this.list.splice(taskIndex, 1);
        const cachedTodos = window.localStorage.getItem("todos")
          ? JSON.parse(window.localStorage.getItem("todos"))
          : "";

        if (cachedTodos) {
          const cachedTodoIndex = cachedTodos.findIndex(
            (t) => t.id === this.selectedTask
          );

          cachedTodos.splice(cachedTodoIndex, 1);

          window.localStorage.setItem("todos", JSON.stringify(cachedTodos));
        }

        this.selectedTask = "";
      }
    },
    createOrEditTodo() {
      const cachedTodos = window.localStorage.getItem("todos")
        ? JSON.parse(window.localStorage.getItem("todos"))
        : "";

      if (!this.editingTask) {
        // use clients timezone
        const time = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let timeToSave = null;
        let meta = {
          timezone,
        };

        switch (this.dayName.toLowerCase()) {
          case "tomorrow": {
            const currentDay = time.getDate();
            time.setDate(currentDay + 1);

            timeToSave = time.toLocaleString("en-US", { timeZone: timezone });
            break;
          }
          case "someday": {
            const min = Math.ceil(7);
            const max = Math.floor(21);
            const randomDays = Math.floor(Math.random() * (max - min) + min);
            const currentDay = time.getDate();
            time.setDate(currentDay + randomDays);

            timeToSave = time.toLocaleString("en-US", { timeZone: timezone });
            meta.someday = {
              numOfRandomDays: randomDays,
            };
            break;
          }
          case "today":
          default:
            timeToSave = time.toLocaleString("en-US", { timeZone: timezone });
        }

        const newTodo = {
          id: `task-${uuidv4()}`,
          task: this.newTodo,
          checked: false,
          due_date: timeToSave,
          created_at: new Date().toLocaleString("en-US", {
            timeZone: timezone,
          }),
          meta,
        };

        this.list.push(newTodo);

        if (cachedTodos) {
          cachedTodos.push(newTodo);

          window.localStorage.setItem("todos", JSON.stringify(cachedTodos));
        } else {
          window.localStorage.setItem("todos", JSON.stringify(this.list));
        }

        this.newTodo = "";
        this.isCreating = false;
      } else {
        if (cachedTodos) {
          const cachedTodoIndex = cachedTodos.findIndex(
            (t) => t.id === this.selectedTask
          );

          cachedTodos[cachedTodoIndex].task = this.newTodo;

          window.localStorage.setItem("todos", JSON.stringify(cachedTodos));

          this.editingTask = false;
          this.newTodo = "";
          this.isCreating = false;
          this.selectedTask = "";
          this.$emit("reloadCache");
        }
      }
    },
    openCreateOrEdit() {
      this.isCreating = true;
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
input[type="checkbox"] {
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
