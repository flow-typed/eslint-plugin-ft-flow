export default {
  invalid: [
    {
      code: '// @flow\nimport Foo from \'./foo\';',
      errors: [{ message: 'Expected newline after flow annotation' }],
      output: '// @flow\n\nimport Foo from \'./foo\';',
    },
    {
      code: '// @flow\nimport Foo from \'./foo\';',
      errors: [{ message: 'Expected newline after flow annotation' }],
      options: ['always'],
      output: '// @flow\n\nimport Foo from \'./foo\';',
    },
    {
      code: '// @flow\r\nimport Foo from \'./foo\';',
      errors: [{ message: 'Expected newline after flow annotation' }],
      options: ['always-windows'],
      output: '// @flow\r\n\r\nimport Foo from \'./foo\';',
    },
    {
      code: '// @flow\n\n',
      errors: [{ message: 'Expected no newline after flow annotation' }],
      options: ['never'],
      output: '// @flow\n',
    },
    {
      code: `/*
* @flow
*
* something multi lined
*/
const text: string = 42;`,
      errors: [{ message: 'Expected newline after flow annotation' }],
      output: `/*
* @flow
*
* something multi lined
*/

const text: string = 42;`,
    },
  ],
  valid: [
    {
      code: '// @flow\n\nimport Foo from \'./foo\';',
      options: ['always'],
    },
    {
      code: '// @flow\r\n\r\nimport Foo from \'./foo\';',
      options: ['always-windows'],
    },
    {
      code: '// @flow\nimport Foo from \'./foo\';',
      options: ['never'],
    },
    {
      code: `/*
* @flow
*
* something multi lined
*/

const text: string = 42;`,
      options: ['always'],
    },
  ],
};
