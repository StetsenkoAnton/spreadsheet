# spreadsheet

This is not a commercial project, designed to learn how to work handsontable

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### API - V1
* /api/v1/document - get list of all documents in the documents folder
    - response
```js
    [{name: "documentName"}]
```

* /api/v1/document/{documentName} - get first sheet from the workbook
    - response - see [Sheetjs - Workbook Object](https://docs.sheetjs.com/docs/csf/book), [Sheetjs - Sheet Object](https://docs.sheetjs.com/docs/csf/sheet)

### [Sheetjs DOCS](https://docs.sheetjs.com/)

TODO
1. Файлы хранятся в папку Files
2. Запрос на список файлов
3. Запрос на чтение файла
4. Изменение значения ячейки
5. Уведомление что ячейка занята
6. Сохрание таблицы через ??? сек / мин или запрос на сохранение
