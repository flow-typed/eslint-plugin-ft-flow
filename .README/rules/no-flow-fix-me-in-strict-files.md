### `no-flow-fix-me-in-strict-files`

This rule validates that no error suppression comments (e.g. `$FlowFixMe`) are used in `// @flow strict` (or `// @flow strict-local`) files.

This codifies the best practices [as documented here](https://flow.org/en/docs/strict/#toc-adoption):

> _"Do not add `$FlowFixMe` to suppress the new errors as they appear; just add `@flow strict` once all issues have been resolved."_
#### Options

This rule accepts 1 option as an object to disable errors being thrown on specific suppression error types. For example, you don't want `$FlowFixMe` but `$FlowExpectedError` you want to allow because they are expected issues that can't be solved.

```js
{
  "rules": {
    "ft-flow/no-flow-fix-me-in-strict-files": [2, {
      "$FlowExpectedError": false
    }]
  }
}
```

<!-- assertions noFlowFixMeInStrictFiles -->
