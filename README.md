# due

Project is based on a mobile app that was on a windows phone long ago. A simple todo list meant to separate work and life tasks.

Today I'll do this.
Tomorrow I'll finish that.
Someday maybe I'll start that.

Following these Vue PWA guides:

- https://blog.logrocket.com/building-pwa-vue/
- https://dev.to/drbragg/handling-service-worker-updates-in-your-vue-pwa-1pip

## Built with

- Vue 2
- PWA

2023-09-17 Migrated to Vue 3

### Roadmap

- [x] Create tasks
- [x] Read tasks
- [x] Update tasks
- [x] Delete tasks
- [x] Make checkmarks, text, and task buttons bigger
- [x] Move tomorrow task to today by time
- [x] Move somedays into tomorrow with a arbitrary time function
- [ ] Options menu, have About and Settings options
- [x] Add darker bg color. lighter font color
- [ ] add name top left. - with logo?
- [x] Make quick logo - Feb 2026
- [x] Light grey color for checked off tasks
- [x] Option to remove completed tasks 2026-03-29 PR #23
- [x] Add how long ago task was added 2026-03-29 PR #23
- [ ] Change task array into map with task.id as key

- [x] Deploy to patrickmoreno.ca/due

After observations on very quick, limited testing, suggestions and my findings:

- [ ] Click anywhere to create task
- [ ] Indications that task can be clicked
- [ ] indicator that scroll left and right to another day is possible
- [ ] Prevent scroll on create

2026

- [x] Migrate update.js to use vite pwa plugin 2026-02-22 PR #18
- [x] Drag to move rearrange tasks 2026-03-21 PR #22
- [x] Switch from localstorage to indexedDB 2026-02-16 PR #17
- [x] Migrate VUE CLI to Vite 2026-02-15 PR #16
- [ ] Set notifications to go off a a certain time to start a task
- [ ] Save a history of completed tasks

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
