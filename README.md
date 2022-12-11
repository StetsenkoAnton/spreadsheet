# spreadsheet

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## First setup

```sh
yarn install
yarn build
yarn start
```

## Project Setup and Update

```sh
git pull
yarn build
yarn start
```

## TODOS
- При сохранении не перезатирать форматирование ячеек
- БАГ - Сохранить изменения в файле -> Выйти на главную страницу -> Выбрать тот же файл -> Откроется версия без изменений
- Добавить автосохранение при изменении ячейки. Вынести функцию формирования файла в отдельный поток
