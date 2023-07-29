module.exports = {
  extends: ['eslint-config-bzc'],
  rules: {
    'global-require': 0,
    'import/no-dynamic-require': 0,
    // Overriding from https://github.com/airbnb/javascript/blob/fd77bbebb77362ddecfef7aba3bf6abf7bdd81f2/packages/eslint-config-airbnb-base/rules/style.js#L206C16-L212C8
    'max-len': ['error', 120, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'no-restricted-syntax': 0,
  },
};
