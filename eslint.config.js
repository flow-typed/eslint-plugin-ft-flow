const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: ['dist', 'flow-typed', 'node_modules'],
  },
  ...compat.extends('eslint-config-bzc'),
  {
    settings: {
      react: { version: '19' }, // "contextOrFilename.getFilename is not a function", see https://github.com/jsx-eslint/eslint-plugin-react/issues/3977
    },
    rules: {
      'global-require': 'off',
      'import/no-dynamic-require': 'off',
      'max-len': 'off',
      'no-restricted-syntax': 'off',

      // Not yet compatible with ESLint v10.
      'react/jsx-filename-extension': 'off',
      'fb-flow/use-indexed-access-type': 'off',
    },
  },
];
