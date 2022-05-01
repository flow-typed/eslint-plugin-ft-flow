export default {
  invalid: [
    // Never
    {
      code: 'type X = Promise< string>',
      errors: [{ message: 'There must be no space at start of "Promise" generic type annotation' }],
      output: 'type X = Promise<string>',
    },
    {
      code: 'type X = Promise<  string>',
      errors: [{ message: 'There must be no space at start of "Promise" generic type annotation' }],
      options: ['never'],
      output: 'type X = Promise<string>',
    },
    {
      code: 'type X = FooBar<string >',
      errors: [{ message: 'There must be no space at end of "FooBar" generic type annotation' }],
      output: 'type X = FooBar<string>',
    },
    {
      code: 'type X = Promise< string >',
      errors: [
        { message: 'There must be no space at start of "Promise" generic type annotation' },
        { message: 'There must be no space at end of "Promise" generic type annotation' },
      ],
      output: 'type X = Promise<string>',
    },
    {
      code: 'type X = Promise< (foo), bar, (((baz))) >',
      errors: [
        { message: 'There must be no space at start of "Promise" generic type annotation' },
        { message: 'There must be no space at end of "Promise" generic type annotation' },
      ],
      output: 'type X = Promise<(foo), bar, (((baz)))>',
    },

    // Always (given no space)

    {
      code: 'type X = Promise<string >',
      errors: [{ message: 'There must be a space at start of "Promise" generic type annotation' }],
      options: ['always'],
      output: 'type X = Promise< string >',
    },
    {
      code: 'type X = FooBar< string>',
      errors: [{ message: 'There must be a space at end of "FooBar" generic type annotation' }],
      options: ['always'],
      output: 'type X = FooBar< string >',
    },
    {
      code: 'type X = Promise<string>',
      errors: [
        { message: 'There must be a space at start of "Promise" generic type annotation' },
        { message: 'There must be a space at end of "Promise" generic type annotation' },
      ],
      options: ['always'],
      output: 'type X = Promise< string >',
    },
    {
      code: 'type X = Promise<(foo), bar, (((baz)))>',
      errors: [
        { message: 'There must be a space at start of "Promise" generic type annotation' },
        { message: 'There must be a space at end of "Promise" generic type annotation' },
      ],
      options: ['always'],
      output: 'type X = Promise< (foo), bar, (((baz))) >',
    },

    // Always (given too many spaces)

    {
      code: 'type X = FooBar<  string >',
      errors: [{ message: 'There must be one space at start of "FooBar" generic type annotation' }],
      options: ['always'],
      output: 'type X = FooBar< string >',
    },
    {
      code: 'type X = FooBar< string  >',
      errors: [{ message: 'There must be one space at end of "FooBar" generic type annotation' }],
      options: ['always'],
      output: 'type X = FooBar< string >',
    },
    {
      code: 'type X = Promise<  (foo), bar, (((baz)))  >',
      errors: [
        { message: 'There must be one space at start of "Promise" generic type annotation' },
        { message: 'There must be one space at end of "Promise" generic type annotation' },
      ],
      options: ['always'],
      output: 'type X = Promise< (foo), bar, (((baz))) >',
    },

    // Type annotations
    {
      code: 'const [state, setState] = useState<?string >(null)',
      errors: [{ message: 'There must be no space at start of type annotations' }],
      output: 'const [state, setState] = useState<?string>(null)',
    },
    {
      code: 'const [state, setState] = useState<?string > (null)',
      errors: [{ message: 'There must be no space at start of type annotations' }],
      output: 'const [state, setState] = useState<?string>(null)',
    },
    {
      code: 'const [state, setState] = useState< ?string>(null)',
      errors: [{ message: 'There must be no space at start of type annotations' }],
      output: 'const [state, setState] = useState<?string>(null)',
    },
    {
      code: 'const [state, setState] = useState < ?string>(null)',
      errors: [{ message: 'There must be no space at start of type annotations' }],
      output: 'const [state, setState] = useState<?string>(null)',
    },
    {
      code: 'const [state, setState] = useState<? string>(null)',
      errors: [{ message: 'There must be no space at start of type annotations' }],
      output: 'const [state, setState] = useState<?string>(null)',
    },
    {
      code: 'const [state, setState] = useState< ? string>(null)',
      errors: [{ message: 'There must be no space at start of type annotations' }],
      output: 'const [state, setState] = useState<?string>(null)',
    },
    {
      code: 'const [state, setState] = useState< ? string >(null)',
      errors: [{ message: 'There must be no space at start of type annotations' }],
      output: 'const [state, setState] = useState<?string>(null)',
    },
    {
      code: 'const [state, setState] = useState < ? string > (null)',
      errors: [{ message: 'There must be no space at start of type annotations' }],
      output: 'const [state, setState] = useState<?string>(null)',
    },
    {
      code: 'const [state, setState] = useState < ? string > ()',
      errors: [{ message: 'There must be no space at start of type annotations' }],
      output: 'const [state, setState] = useState<?string>(null)',
    },
    {
      code: 'useState<string >(null)',
      errors: [{ message: 'There must be no space at start of type annotations' }],
      output: 'useState<string>(null)',
    },
    {
      code: 'useState< string>(null)',
      errors: [{ message: 'There must be no space at start of type annotations' }],
      output: 'useState<string>(null)',
    },
    {
      code: 'useState< string >(null)',
      errors: [{ message: 'There must be no space at start of type annotations' }],
      output: 'useState<string>(null)',
    },
  ],
  misconfigured: [
    {
      errors: [
        {
          data: 'frequently',
          instancePath: '/0',
          keyword: 'enum',
          message: 'must be equal to one of the allowed values',
          params: {
            allowedValues: [
              'always',
              'never',
            ],
          },
          parentSchema: {
            enum: [
              'always',
              'never',
            ],
            type: 'string',
          },
          schema: [
            'always',
            'never',
          ],
          schemaPath: '#/items/0/enum',
        },
      ],
      options: ['frequently'],
    },
  ],
  valid: [
    // Never

    { code: 'type X = Promise<string>' },
    { code: 'type X = Promise<(string)>' },
    { code: 'type X = Promise<(foo), bar, (((baz)))>' },
    {
      code:
        `type X = Promise<
  (foo),
  bar,
  (((baz)))
>`,
    },
    { code: 'type X =  Promise<\r\n    (foo),\r\n    bar,\r\n    (((baz)))\r\n>' },

    // Always

    {
      code: 'type X = Promise< string >',
      options: ['always'],
    },
    {
      code: 'type X = Promise< (string) >',
      options: ['always'],
    },
    {
      code: 'type X = Promise< (foo), bar, (((baz))) >',
      options: ['always'],
    },
    {
      code: 'const [state, setState] = useState< string >("")',
      options: ['always'],
    },
    {
      code: 'const [state, setState] = useState< ?string >(null)',
      options: ['always'],
    },
    {
      code: 'const [state, setState] = useState< string | null >(null)',
      options: ['always'],
    },
    {
      code: 'const [state, setState] = useState< string | number >(2)',
      options: ['always'],
    },

    // Never
    {
      code: 'const [state, setState] = useState(null)',
      options: ['never'],
    },
    {
      code: 'const [state, setState] = useState<string>("")',
      options: ['never'],
    },
    {
      code: 'const [state, setState] = useState<?string>(null)',
      options: ['never'],
    },
    {
      code: 'const [state, setState] = useState<string | null>(null)',
      options: ['never'],
    },
    {
      code: 'const [state, setState] = useState<string | number>(2)',
      options: ['never'],
    },
  ],
};
