// @flow strict-local
import type { OptionsT } from '../../../src/rules/noWeakTypes';
import type { RuleTestAssertionsT } from '../types';

export default ({
  invalid: [
    {
      code: 'function foo(thing): any {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
      ],
    },
    {
      code: 'function foo(thing): Promise<any> {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
      ],
    },
    {
      code: 'function foo(thing): Promise<Promise<any>> {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
      ],
    },
    {
      code: 'function foo(thing): Object {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Object' },
        },
      ],
    },
    {
      code: 'function foo(thing): Promise<Object> {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Object' },
        },
      ],
    },
    {
      code: 'function foo(thing): Promise<Promise<Object>> {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Object' },
        },
      ],
    },
    {
      code: 'function foo(thing): Function {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Function' },
        },
      ],
    },
    {
      code: 'function foo(thing): Promise<Function> {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Function' },
        },
      ],
    },
    {
      code: 'function foo(thing): Promise<Promise<Function>> {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Function' },
        },
      ],
    },
    {
      code: '(foo: any) => {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
      ],
    },
    {
      code: '(foo: Function) => {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Function' },
        },
      ],
    },
    {
      code: '(foo?: any) => {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
      ],
    },
    {
      code: '(foo?: Function) => {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Function' },
        },
      ],
    },
    {
      code: '(foo: { a: any }) => {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
      ],
    },
    {
      code: '(foo: { a: Object }) => {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Object' },
        },
      ],
    },
    {
      code: '(foo: any[]) => {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
      ],
    },
    {
      code: 'type Foo = any',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
      ],
    },
    {
      code: 'type Foo = Function',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Function' },
        },
      ],
    },
    {
      code: 'type Foo = { a: any }',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
      ],
    },
    {
      code: 'type Foo = { a: Object }',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Object' },
        },
      ],
    },
    {
      code: 'type Foo = { (a: Object): string }',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Object' },
        },
      ],
    },
    {
      code: 'type Foo = { (a: string): Function }',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Function' },
        },
      ],
    },
    {
      code: 'function foo(thing: any) {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
      ],
    },
    {
      code: 'function foo(thing: Object) {}',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Object' },
        },
      ],
    },
    {
      code: 'var foo: Function',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Function' },
        },
      ],
    },
    {
      code: 'var foo: Object',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Object' },
        },
      ],
    },
    {
      code: 'class Foo { props: any }',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
      ],
    },
    {
      code: 'class Foo { props: Object }',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Object' },
        },
      ],
    },
    {
      code: 'var foo: any',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
      ],
    },
    {
      code: 'type X = any; type Y = Function; type Z = Object',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'any' },
        },
        {
          messageId: 'noWeakTypes',
          data: { weakType: 'Object' },
        },
      ],
      options: [
        {
          Function: false,
        },
      ],
    },
    {
      code: 'type X = any; type Y = Function; type Z = Object',
      errors: [
        {
          messageId: 'noWeakTypes',
          data: { weakType: [{ message: 'Function' }] },
        },
      ],
      options: [
        {
          any: false,
          Object: false,
        },
      ],
    },
    {
      code: 'const a: $FlowFixMe = 1',
      errors: [
        {
          messageId: 'noCustomWeakTypes',
          data: { weakType: '$FlowFixMe' },
        },
      ],
      options: [
        {
          suppressTypes: ['$FlowFixMe'],
        },
      ],
    },
    {
      code: 'const a: Something = 1',
      errors: [
        {
          messageId: 'noCustomWeakTypes',
          data: { weakType: 'Something' },
        },
      ],
      options: [
        {
          suppressTypes: ['$FlowFixMe', 'Something'],
        },
      ],
    },
  ],
  misconfigured: [
    {
      errors: [
        {
          data: {
            nonExistentWeakType: false,
          },
          instancePath: '/0',
          keyword: 'additionalProperties',
          message: 'must NOT have additional properties',
          params: {
            additionalProperty: 'nonExistentWeakType',
          },
          parentSchema: {
            additionalProperties: false,
            properties: {
              any: {
                type: 'boolean',
              },
              Function: {
                type: 'boolean',
              },
              Object: {
                type: 'boolean',
              },
              suppressTypes: {
                items: {
                  type: 'string',
                },
                type: 'array',
              },
            },
            type: 'object',
          },
          schema: false,
          schemaPath: '#/items/0/additionalProperties',
        },
      ],
      options: [{ nonExistentWeakType: false }],
    },
    {
      errors: [
        {
          data: 'irrelevant',
          instancePath: '/0/Object',
          keyword: 'type',
          message: 'must be boolean',
          params: {
            type: 'boolean',
          },
          parentSchema: {
            type: 'boolean',
          },
          schema: 'boolean',
          schemaPath: '#/items/0/properties/Object/type',
        },
      ],
      options: [
        // $FlowIgnore[incompatible-cast] - intentionally bad schema
        {
          Object: 'irrelevant',
        },
      ],
    },
  ],
  valid: [
    {
      code: 'function foo(thing): string {}',
    },
    {
      code: 'function foo(thing): Promise<string> {}',
    },
    {
      code: 'function foo(thing): Promise<Promise<string>> {}',
    },
    {
      code: '(foo?: string) => {}',
    },
    {
      code: '(foo: ?string) => {}',
    },
    {
      code: '(foo: { a: string }) => {}',
    },
    {
      code: '(foo: { a: ?string }) => {}',
    },
    {
      code: '(foo: string[]) => {}',
    },
    {
      code: 'type Foo = string',
    },
    {
      code: 'type Foo = { a: string }',
    },
    {
      code: 'type Foo = { (a: string): string }',
    },
    {
      code: 'function foo(thing: string) {}',
    },
    {
      code: 'var foo: string',
    },
    {
      code: 'class Foo { props: string }',
    },
    {
      code: 'type X = any; type Y = Object',
      options: [
        {
          any: false,
          Object: false,
        },
      ],
    },
    {
      code: 'type X = Function',
      options: [{ Function: false }],
    },
    {
      code: 'function foo(thing): Function {}',
      settings: {
        'ft-flow': {
          onlyFilesWithFlowAnnotation: true,
        },
      },
    },
    {
      code: '// $FlowFixMe\nconst a: string = 1',
      options: [
        {
          suppressTypes: ['$FlowFixMe'],
        },
      ],
    },
    {
      code: 'const Foo = 1',
      options: [
        {
          suppressTypes: ['Foo'],
        },
      ],
    },
  ],
}: RuleTestAssertionsT<OptionsT>);
