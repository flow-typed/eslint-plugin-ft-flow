const message = 'No suppression comments are allowed in "strict" Flow files. Either remove the error suppression, or lower the strictness of this module.';

const invalid = (code, options = {}) => ({
  code,
  errors: [{ message }],
  options: [options],
});

const valid = (code, options = {}) => ({
  code,
  options: [options],
});

export default {
  invalid: [
    invalid('// @flow strict\n\n// $FlowFixMe\nconst text: string = 42;'),
    invalid('// @flow strict-local\n\n// $FlowFixMe\nconst text: string = 42;'),
    invalid('// @flow strict\n\n// $FlowExpectedError[xxx]\nconst text: string = 42;'),
    invalid('/* @flow strict */\n\n// $FlowExpectedError[xxx]\nconst text: string = 42;'),
    invalid(`/*
* @flow strict
*
* something multi lined
*/

// $FlowExpectedError[xxx]
const text: string = 42;`),
    invalid(`/*
* @flow strict
*
* something multi lined
*/

/* $FlowIgnore[xxx] */
const text: string = 42;`),
    invalid(
      '// @flow strict\n\n// $FlowFixMe\nconst text: string = 42;',
      {
        $FlowExpectedError: false,
      },
    ),
  ],
  valid: [
    valid('// @flow\n\n// Error suppressions are fine in "normal" Flow files\n// $FlowFixMe\nconst text: string = 42;'),
    valid('// @flow strict\n\n// Definitely nothing to suppress here\n// ...'),
    valid('// @flow strict-local\n\n// Definitely nothing to suppress here\n// ...'),
    valid(
      '// @flow strict\n\n// $FlowExpectedError\nconst text: string = 42;',
      {
        $FlowExpectedError: false,
      },
    ),
    valid(
      '// @flow strict-local\n\n// $FlowExpectedError\nconst text: string = 42;',
      {
        $FlowExpectedError: false,
      },
    ),
  ],
};
