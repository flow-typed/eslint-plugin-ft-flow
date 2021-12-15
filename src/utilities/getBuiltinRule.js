/* eslint-disable import/no-dynamic-require, global-require */

/**
 * Adopted from https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/rules/utils/get-builtin-rule.js.
 */
export const getBuiltinRule = (id) => {
  // TODO: Remove this when we drop support for ESLint 7
  // eslint-disable-next-line global-require
  const eslintVersion = require('eslint/package.json').version;
  /* istanbul ignore next */
  if (eslintVersion.startsWith('7.')) {
    return require(`eslint/lib/rules/${id}`);
  }

  // TODO: This whole file and area should be looked at
  // eslint-disable-next-line import/no-unresolved
  return require('eslint/use-at-your-own-risk').builtinRules.get(id);
};
