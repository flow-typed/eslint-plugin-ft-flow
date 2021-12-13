const message = 'No suppression comments are allowed in "strict" Flow files. Either remove the error suppression, or lower the strictness of this module.';

const invalid = (code) => ({
  code,
  errors: [{ message }],
});

const valid = (code) => ({
  code,
});

export default {
  invalid: [
    invalid('// @flow strict\n\n// $FlowFixMe\nconst text: string = 42;'),
    invalid('// @flow strict-local\n\n// $FlowFixMe\nconst text: string = 42;'),
    invalid('// @flow strict\n\n// $FlowExpectedError[xxx]\nconst text: string = 42;'),
  ],
  valid: [
    valid('// @flow\n\n// Error suppressions are fine in "normal" Flow files\n// $FlowFixMe\nconst text: string = 42;'),
    valid('// @flow-strict\n\n// Definitely nothing to suppress here\n// ...'),
    valid('// @flow-strict-local\n\n// Definitely nothing to suppress here\n// ...'),
  ],
};
