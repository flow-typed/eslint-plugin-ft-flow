import {
  ESLint,
  RuleTester,
} from 'eslint';

import useFlowType from '../../../src/rules/useFlowType';
import {
  getBuiltinRule,
} from '../../../src/utilities/getBuiltinRule';

const noUnusedVarsRule = getBuiltinRule('no-unused-vars');

/**
 * `no-unused-vars` has suggestions that we don't want to deal with in these tests,
 * so we create a version of it without suggestions.
 */
const getNoUnusedVarsRuleWithoutSuggestions = () => ({
  ...noUnusedVarsRule,
  create(context) {
    const wrappedContext = Object.create(context, {
      report: {
        configurable: true,
        enumerable: true,
        writable: true,
        value: (...reportArgs) => {
          if (reportArgs.length === 1 && reportArgs[0] && typeof reportArgs[0] === 'object') {
            const {
              suggest,
              ...reportDescriptor
            } = reportArgs[0];

            context.report(reportDescriptor);
            return;
          }

          context.report(...reportArgs);
        },
      },
    });

    return noUnusedVarsRule.create(wrappedContext);
  },
  meta: {
    ...noUnusedVarsRule.meta,
    hasSuggestions: false,
  },
});

const VALID_WITH_USE_FLOW_TYPE = [
  {
    code: 'declare class A {}',
    errors: [
      {
        message: '\'A\' is defined but never used.',
      },
    ],
  },
  {
    code: 'declare function A(): Y',
    errors: [
      {
        message: '\'A\' is defined but never used.',
      },
    ],
  },
  {
    code: 'declare module A {}',
    errors: [
      {
        message: '\'A\' is defined but never used.',
      },
    ],
  },
  {
    code: 'declare module A { declare var a: Y }',
    errors: [
      {
        message: '\'A\' is defined but never used.',
      },
    ],
  },
  {
    code: 'declare var A: Y',
    errors: [
      {
        message: '\'A\' is defined but never used.',
      },
    ],
  },
  {
    code: 'import type A from "a"; type X<B = ComponentType<A>> = { b: B }; let x: X; console.log(x);',
    errors: [
      {
        message: '\'A\' is defined but never used.',
      },
    ],
  },
  {
    code: 'import type A from "a"; type X<B = A<string>> = { b: B }; let x: X; console.log(x);',
    errors: [
      {
        message: '\'A\' is defined but never used.',
      },
    ],
  },
];

const ALWAYS_INVALID = [
  {
    code: 'type A = Y',
    errors: [
      {
        message: '\'A\' is defined but never used.',
      },
    ],
  },
  {
    code: 'function x<A>() {}; x()',
    errors: [
      {
        message: '\'A\' is defined but never used.',
      },
    ],
  },
  {
    code: 'import type A from "a";',
    errors: [
      {
        message: '\'A\' is defined but never used.',
      },
    ],
  },
];

const ALWAYS_VALID = [
  'type A = Y; var x: A; x()',
  'var x: A; type A = Y; x()',
  'type A = Y; function x(a: A) { a() }; x()',
  'function x(a: A) { a() }; type A = Y; x()',
  'type A = Y; (x: A)',
  '(x: A); type A = Y',
  'function x<A>(): A {}; x()',
  'import type A from "a"; (function(): A {})',
  '(function(): A {}); import type A from "a";',
  'declare interface A {}',
  'declare type A = {}',
];

const isESLint8 = ESLint.version.startsWith('8.');

const babelLanguageOptions = {
  parser: isESLint8
    ? require.resolve('@babel/eslint-parser')
    : require('@babel/eslint-parser'),
  parserOptions: {
    babelOptions: {
      plugins: ['@babel/plugin-syntax-flow'],
    },
    requireConfigFile: false,
  },
};

/**
 * This rule is tested differently than the rest because `RuleTester` is
 * designed to test rule reporting and use-flow-type doesn't report
 * anything. use-flow-type suppresses reports from no-unused-vars. So we're
 * actually testing no-unused-vars's reporting with use-flow-type enabled.
 */
{
  const ruleTester = new RuleTester({
    ...(isESLint8
      ? babelLanguageOptions
      : { languageOptions: babelLanguageOptions }),
  });

  ruleTester.run('no-unused-vars must not trigger an error in these cases', getNoUnusedVarsRuleWithoutSuggestions(), {
    invalid: [],
    valid: ALWAYS_VALID,
  });
}

{
  const ruleTester = new RuleTester({
    ...(isESLint8
      ? babelLanguageOptions
      : { languageOptions: babelLanguageOptions }),
  });

  ruleTester.run('no-unused-vars must trigger an error in these cases', getNoUnusedVarsRuleWithoutSuggestions(), {
    invalid: [
      ...ALWAYS_INVALID,
      ...VALID_WITH_USE_FLOW_TYPE,
    ],
    valid: [],
  });
}

{
  const ruleTester = new RuleTester({
    ...(isESLint8
      ? babelLanguageOptions
      : { languageOptions: babelLanguageOptions }),
    rules: isESLint8 ? {
      'use-flow-type': 1,
    } : {
      'ft-flow/use-flow-type': 1,
    },
    plugins: isESLint8 ? [] : {
      'ft-flow': {
        rules: {
          'use-flow-type': useFlowType,
        },
      },
    },
  });

  if (isESLint8) {
    ruleTester.defineRule('use-flow-type', useFlowType);
  }
  ruleTester.run('use-flow-type must not affect no-unused-vars behavior in these cases', getNoUnusedVarsRuleWithoutSuggestions(), {
    invalid: ALWAYS_INVALID,
    valid: ALWAYS_VALID,
  });
}

export default {
  invalid: [],
  valid: [
    ...VALID_WITH_USE_FLOW_TYPE.map((subject) => ({
      code: subject.code,
      rules: {
        'no-unused-vars': 1,
      },
    })),
  ],
};
