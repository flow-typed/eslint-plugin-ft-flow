import {
  ESLint,
  RuleTester,
} from 'eslint';

import {
  getBuiltinRule,
} from '../../../src/utilities/getBuiltinRule';

const noUndefRule = getBuiltinRule('no-undef');

const VALID_WITH_DEFINE_FLOW_TYPE = [
  {
    code: 'var a: AType',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'var a: AType; var b: AType',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'var a; (a: AType)',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'var a: AType<BType>',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
      {
        message: '\'BType\' is not defined.',
      },
    ],
  },
  {
    code: 'type A = AType',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'declare type A = number',
    errors: [
      {
        message: '\'A\' is not defined.',
      },
    ],
  },
  {
    code: 'opaque type A = AType',
    errors: [
      // Complaining about 'A' is fixed in https://github.com/babel/babel-eslint/pull/696
      {
        message: '\'A\' is not defined.',
      },
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'function f(a: AType) {}',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'function f(a: AType.a) {}',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'function f(a: AType.a.b) {}',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'function f(a): AType {}; var a: AType',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'function f(a): AType {}',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'class C { a: AType }',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'class C { a: AType.a }',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'class C { a: AType.a.b }',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'class C implements AType {}',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'declare interface A {}',
    errors: [
      {
        message: '\'A\' is not defined.',
      },
    ],
  },
  {
    code: '({ a: ({b() {}}: AType) })',

    // `AType` appears twice in `globalScope.through` as distinct
    // references, this may be a babel-eslint bug.
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
      {
        message: '\'AType\' is not defined.',
      },
    ],
  },
  {
    code: 'type X = {Y<AType>(): BType}',
    errors: [
      {
        message: '\'AType\' is not defined.',
      },
      {
        message: '\'BType\' is not defined.',
      },
    ],
  },

  // This tests to ensure we have a robust handling of @flow comments
  {
    code: `
/**
* Copyright 2019 no corp
* @flow
*/
type Foo = $ReadOnly<{}>`,
    errors: [
      {
        message: '\'$ReadOnly\' is not defined.',
      },
    ],
    settings: {
      'ft-flow': {
        onlyFilesWithFlowAnnotation: true,
      },
    },
  },

  // Enum types
  {
    code: 'enum Status { Active, Paused }',
    errors: [
      {
        message: '\'Status\' is not defined.',
      },
      {
        message: '\'Active\' is not defined.',
      },
      {
        message: '\'Paused\' is not defined.',
      },
    ],
  },
  {
    // eslint-disable-next-line quotes
    code: `enum Status { Active = 'active', Paused = 'paused' }`,
    errors: [
      {
        message: '\'Status\' is not defined.',
      },
      {
        message: '\'Active\' is not defined.',
      },
      {
        message: '\'Paused\' is not defined.',
      },
    ],
  },
  {
    // eslint-disable-next-line quotes
    code: `enum Status { Active = 1, Paused = 2 }`,
    errors: [
      {
        message: '\'Status\' is not defined.',
      },
      {
        message: '\'Active\' is not defined.',
      },
      {
        message: '\'Paused\' is not defined.',
      },
    ],
  },
];

const ALWAYS_INVALID = [
  {
    code: 'var a = b',
    errors: [
      {
        message: '\'b\' is not defined.',
      },
    ],
  },
  {
    code: 'function f(a = b) {}',
    errors: [
      {
        message: '\'b\' is not defined.',
      },
    ],
  },
  {
    code: 'class C extends b {}',
    errors: [
      {
        message: '\'b\' is not defined.',
      },
    ],
  },
  {
    code: 'class C { static S = b }',
    errors: [
      {
        message: '\'b\' is not defined.',
      },
    ],
  },
];

const ALWAYS_VALID = [
  'var a: string',
  'var a: Array',
  'var a: Array<string>',
  'type A = Array',

  // This complains about 'A' not being defined. It might be an upstream bug
  // 'opaque type A = Array',
  'function f(a: string) {}',
  'function f(a): string {}',
  'class C { a: string }',
  'var AType = {}; class C { a: AType.a }',
  'declare module A { declare var a: AType }',
];

const isESLint8 = ESLint.version.startsWith('8.');

const babelLanguageOptions = {
  parser: isESLint8
    ? require.resolve('@babel/eslint-parser')
    : require('@babel/eslint-parser'),
  parserOptions: {
    babelOptions: {
      plugins: [
        'babel-plugin-transform-flow-enums',
        '@babel/plugin-syntax-flow',
      ],
    },
    requireConfigFile: false,
  },
};

/**
 * This rule is tested differently than the rest because `RuleTester` is
 * designed to test rule reporting and define-flow-type doesn't report
 * anything. define-flow-type suppresses reports from no-undef. So we're
 * actually testing no-undef's reporting with define-flow-type enabled.
 */
{
  const ruleTester = new RuleTester({
    ...(isESLint8
      ? babelLanguageOptions
      : { languageOptions: babelLanguageOptions }),
  });

  ruleTester.run('no-undef must not trigger an error in these cases', noUndefRule, {
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

  ruleTester.run('no-undef must trigger an error when define-flow-type is not used in these cases', noUndefRule, {
    invalid: [
      ...ALWAYS_INVALID,
    ],
    valid: [],
  });
}

export default {
  invalid: [],
  valid: [
    ...VALID_WITH_DEFINE_FLOW_TYPE.map((subject) => ({
      code: subject.code,
      rules: {
        'no-undef': 2,
      },
      ...(subject.settings ? { settings: subject.settings } : {}),
    })),
    ...VALID_WITH_DEFINE_FLOW_TYPE.map((subject) => ({
      code: subject.code,
      rules: {
        'no-undef': 2,
        'no-use-before-define': [
          2,
          'nofunc',
        ],
        // I can't get the test to work, but it should correctly error if enabled instead
        // of having runtime errors
        // 'no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
      },
      ...(subject.settings ? { settings: subject.settings } : {}),
    })),
  ],
};
