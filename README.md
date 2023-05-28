# due

Project is based on a mobile app that was on a windows phone long ago. A simple todo list meant to separate work and life tasks.

Today I'll do this.
Tomorrow I'll finish that.
Someday maybe I'll start that.

Following Vue PWA guide from here https://blog.logrocket.com/building-pwa-vue/

## Built with

- Vue 2
- PWA

### Roadmap

- [x] Create tasks
- [x] Read tasks
- [x] Update tasks
- [x] Delete tasks
- [x] Make checkmarks, text, and task buttons bigger
- [ ] Move tomorrow task to today by time
- [ ] Move somedays into tomorrow with a arbitrary time function
- [ ] Options menu, three dots, top right fixed positon, About and Settings
- [x] Add darker bg color. lighter font color
- [ ] add name top left. - with logo?
- [ ] Make quick logo
- [x] Light grey color for checked off tasks
- [ ] Option to remove completed tasks, maybe an archive tab?
- [ ] Add how long ago task was added, option to show this or not.
- [ ] Change task array into map with task.id as key 

- [ ] Deploy to patrickmoreno.ca/due

After observations on very quick, limited testing, suggestions and my findings:
- [ ] Tap and hold to move tasks?
- [ ] Click anywhere to create task
- [ ] Indications that task can be clicked
- [ ] indicator that scroll left and right to another day is possible
- [ ] Prevent scroll on create

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
