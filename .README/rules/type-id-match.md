### `type-id-match`

Enforces a consistent naming pattern for type aliases.

#### Options

This rule requires a text RegExp:

```js
{
    "rules": {
        "ft-flow/type-id-match": [
            2,
            "^([A-Z][a-z0-9]*)+Type$"
        ]
    }
}
```

`'^([A-Z][a-z0-9]*)+Type$$'` is the default pattern.

<!-- assertions typeIdMatch -->
