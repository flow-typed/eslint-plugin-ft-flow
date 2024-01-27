// @flow
import assert from 'assert';
import Ajv from 'ajv';
import {
  RuleTester,
} from 'eslint';
import {
  camelCase,
} from 'lodash';

import plugin from '../../src';

const reportingRules = [
  // 'array-style-complex-type',
  // 'array-style-simple-type',
  // 'arrow-parens',
  // 'boolean-style',
  'define-flow-type',
  // 'delimiter-dangle',
  // 'enforce-line-break',
  // 'enforce-suppression-code',
  // 'generic-spacing',
  // 'interface-id-match',
  // 'newline-after-flow-annotation',
  // 'no-dupe-keys',
  // 'no-duplicate-type-union-intersection-members',
  // 'no-existential-type',
  // 'no-flow-fix-me-comments',
  // 'no-flow-suppressions-in-strict-files',
  // 'no-mutable-array',
  // 'no-primitive-constructor-types',
  // 'no-types-missing-file-annotation',
  // 'no-unused-expressions',
  // 'no-weak-types',
  // 'no-internal-flow-type',
  // 'no-mixed',
  // 'object-type-curly-spacing',
  // 'object-type-delimiter',
  // 'quotes',
  // 'require-compound-type-alias',
  // 'require-inexact-type',
  // 'require-indexer-name',
  // 'require-exact-type',
  // 'require-parameter-type',
  // 'require-readonly-react-props',
  // 'require-return-type',
  // 'require-types-at-top',
  // 'require-valid-file-annotation',
  // 'require-variable-type',
  // 'semi',
  // 'sort-keys',
  // 'sort-type-union-intersection-members',
  // 'space-after-type-colon',
  // 'space-before-generic-bracket',
  // 'space-before-type-colon',
  // 'spread-exact-type',
  // 'type-id-match',
  // 'type-import-style',
  // 'union-intersection-spacing',
  // 'use-flow-type',
  // 'use-read-only-spread',
  // 'valid-syntax',
];

const ajv = new Ajv({
  verbose: true,
});

for (const ruleName of reportingRules) {
  // $FlowExpectedError[unsupported-syntax]
  const assertions = require(`./assertions/${camelCase(ruleName)}`);

  if (assertions.misconfigured) {
    for (const misconfiguration of assertions.misconfigured) {
      RuleTester.describe(ruleName, () => {
        RuleTester.describe('misconfigured', () => {
          RuleTester.it(JSON.stringify(misconfiguration.options), () => {
            const schema = plugin.rules[ruleName].meta && plugin.rules[ruleName].meta.schema && plugin.rules[ruleName].meta.schema;

            if (!schema) {
              throw new Error('No schema.');
            }

            const validateSchema = ajv.compile({
              items: schema,
              type: 'array',
            });

            validateSchema(misconfiguration.options);
            if (!validateSchema.errors) {
              throw new Error('Schema was valid.');
            }

            assert.deepStrictEqual(validateSchema.errors, misconfiguration.errors);
          });
        });
      });
    }
  }

  [
    '@babel/eslint-parser',
    'hermes-eslint',
  ].forEach((parser) => {
    const babelParserOnlyRules = ['define-flow-type', 'use-flow-type'];

    // if (parser === '@babel/eslint-parser' && babelParserOnlyRules.includes(ruleName)) {
    //   return;
    // }

    const ruleTester = new RuleTester({
      parser: require.resolve(parser),
    });

    ruleTester.run(`${ruleName} with ${parser} parser`, plugin.rules[ruleName], assertions);
  });
}
