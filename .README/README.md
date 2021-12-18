<div align="center">
  <a href="https://eslint.org/">
    <img width="150" height="150" src="https://eslint.org/assets/img/logo.svg">
  </a>
  <a href="https://flow-typed.github.io/flow-typed/#/">
    <img width="150" height="150" src="https://raw.githubusercontent.com/flow-typed/flow-typed/master/docs/_media/flow.svg">
  </a>
  <h1>eslint-plugin-ft-flow</h1>
  <p><a href="http://flow.org/">Flowtype</a> linting rules for ESLint.</p>
</div>

<p align="center">
  <a href="https://github.com/flow-typed/eslint-plugin-ft-flow/actions/workflows/build.yml">
    <img src="https://github.com/flow-typed/eslint-plugin-ft-flow/workflows/build/badge.svg" alt="ci status">
  </a>
  <a href="https://www.npmjs.com/package/eslint-plugin-ft-flow"><img src="https://img.shields.io/npm/v/eslint-plugin-ft-flow.svg" alt="npm package"></a>
  <a href="https://discordapp.com/invite/8ezwRUK">
    <img src="https://img.shields.io/discord/539606376339734558.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=555555&cacheSeconds=60" alt="discord">
  </a>
</p>

---

{"gitdown": "contents"}

## Installation

```bash
npm install eslint-plugin-ft-flow eslint @babel/eslint-parser @babel/plugin-syntax-flow @babel/plugin-syntax-jsx  --save-dev

# or with yarn
yarn add -D eslint-plugin-ft-flow eslint @babel/eslint-parser @babel/plugin-syntax-flow @babel/plugin-syntax-jsx
```

## Configuration

1. Set `parser` property to `@babel/eslint-parser`.
2. Add `plugins` section and specify `eslint-plugin-ft-flow` as a plugin.
3. Enable rules.

<!-- -->

```json
{
  "parser": "@babel/eslint-parser",
  "plugins": [
    "ft-flow"
  ],
  "rules": {
    "ft-flow/boolean-style": [
      2,
      "boolean"
    ],
    // ... more rules
  },
  "settings": {
    "ft-flow": {
      "onlyFilesWithFlowAnnotation": false
    }
  }
}
```

### Shareable configurations

#### Recommended

This plugin exports a [recommended configuration](./src/configs/recommended.json) that enforces Flowtype best practices.

To enable this configuration use the extends property in your `.eslintrc` config file:

```json
{
  "extends": [
    "plugin:ft-flow/recommended"
  ],
  "plugins": [
    "ft-flow"
  ]
}
```

See [ESLint documentation](http://eslint.org/docs/user-guide/configuring#extending-configuration-files) for more information about extending configuration files.

## Settings

### `onlyFilesWithFlowAnnotation`

When `true`, only checks files with a [`@flow` annotation](http://flow.org/docs/about-flow.html#gradual) in the first comment.

```js
{
  "settings": {
    "ft-flow": {
      "onlyFilesWithFlowAnnotation": true
    }
  }
}
```

## Rules

<!-- Rules are sorted alphabetically. -->

{"gitdown": "include", "file": "./rules/array-style-complex-type.md"}
{"gitdown": "include", "file": "./rules/array-style-simple-type.md"}
{"gitdown": "include", "file": "./rules/arrow-parens.md"}
{"gitdown": "include", "file": "./rules/boolean-style.md"}
{"gitdown": "include", "file": "./rules/define-flow-type.md"}
{"gitdown": "include", "file": "./rules/delimiter-dangle.md"}
{"gitdown": "include", "file": "./rules/enforce-line-break.md"}
{"gitdown": "include", "file": "./rules/enforce-suppression-code.md"}
{"gitdown": "include", "file": "./rules/generic-spacing.md"}
{"gitdown": "include", "file": "./rules/interface-id-match.md"}
{"gitdown": "include", "file": "./rules/newline-after-flow-annotation.md"}
{"gitdown": "include", "file": "./rules/no-dupe-keys.md"}
{"gitdown": "include", "file": "./rules/no-duplicate-type-union-intersection-members.md"}
{"gitdown": "include", "file": "./rules/no-existential-type.md"}
{"gitdown": "include", "file": "./rules/no-flow-fix-me-comments.md"}
{"gitdown": "include", "file": "./rules/no-flow-suppressions-in-strict-files.md"}
{"gitdown": "include", "file": "./rules/no-internal-flow-type.md"}
{"gitdown": "include", "file": "./rules/no-mixed.md"}
{"gitdown": "include", "file": "./rules/no-mutable-array.md"}
{"gitdown": "include", "file": "./rules/no-primitive-constructor-types.md"}
{"gitdown": "include", "file": "./rules/no-types-missing-file-annotation.md"}
{"gitdown": "include", "file": "./rules/no-unused-expressions.md"}
{"gitdown": "include", "file": "./rules/no-weak-types.md"}
{"gitdown": "include", "file": "./rules/object-type-curly-spacing.md"}
{"gitdown": "include", "file": "./rules/object-type-delimiter.md"}
{"gitdown": "include", "file": "./rules/quotes.md"}
{"gitdown": "include", "file": "./rules/require-compound-type-alias.md"}
{"gitdown": "include", "file": "./rules/require-exact-type.md"}
{"gitdown": "include", "file": "./rules/require-indexer-name.md"}
{"gitdown": "include", "file": "./rules/require-inexact-type.md"}
{"gitdown": "include", "file": "./rules/require-parameter-type.md"}
{"gitdown": "include", "file": "./rules/require-readonly-react-props.md"}
{"gitdown": "include", "file": "./rules/require-return-type.md"}
{"gitdown": "include", "file": "./rules/require-types-at-top.md"}
{"gitdown": "include", "file": "./rules/require-valid-file-annotation.md"}
{"gitdown": "include", "file": "./rules/require-variable-type.md"}
{"gitdown": "include", "file": "./rules/semi.md"}
{"gitdown": "include", "file": "./rules/sort-keys.md"}
{"gitdown": "include", "file": "./rules/sort-type-union-intersection-members.md"}
{"gitdown": "include", "file": "./rules/space-after-type-colon.md"}
{"gitdown": "include", "file": "./rules/space-before-generic-bracket.md"}
{"gitdown": "include", "file": "./rules/space-before-type-colon.md"}
{"gitdown": "include", "file": "./rules/spread-exact-type.md"}
{"gitdown": "include", "file": "./rules/type-id-match.md"}
{"gitdown": "include", "file": "./rules/type-import-style.md"}
{"gitdown": "include", "file": "./rules/union-intersection-spacing.md"}
{"gitdown": "include", "file": "./rules/use-flow-type.md"}
{"gitdown": "include", "file": "./rules/use-read-only-spread.md"}
{"gitdown": "include", "file": "./rules/valid-syntax.md"}
