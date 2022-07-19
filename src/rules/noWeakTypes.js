// @flow strict-local
import type { RuleListener, RuleModule } from 'eslint';

export type OptionsT = [
  {
    any?: boolean,
    Function?: boolean,
    Object?: boolean,
    suppressTypes?: $ReadOnlyArray<string>,
    [string]: boolean,
  } | void,
];

export default ({
  meta: {
    messages: {
      noWeakTypes: 'Unexpected use of weak type "{{weakType}}"',
      noCustomWeakTypes: 'Unexpected use of custom weak type "{{weakType}}"',
    },
    schema: [
      {
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
    ],
  },
  create(context) {
    const checkAny = context.options[0]?.any === true;
    const checkFunction = context.options[0]?.Function === true;
    const checkObject = context.options[0]?.Object === true;
    const suppressTypes = context.options[0]?.suppressTypes ?? [];

    const checks: RuleListener = {};

    if (checkAny) {
      checks.AnyTypeAnnotation = (node) => {
        context.report({
          data: { style: '', weakType: 'any' },
          messageId: 'noWeakType',
          node,
        });
      };
    }

    if (checkFunction || checkObject || suppressTypes.length > 0) {
      checks.GenericTypeAnnotation = (node) => {
        if (node.id.type === 'QualifiedTypeIdentifier') {
          return;
        }
        const { name } = node.id;

        if (
          (checkFunction && name === 'Function')
          || (checkObject && name === 'Object')
        ) {
          context.report({
            data: { weakType: name },
            messageId: 'noWeakType',
            node,
          });
        }
        if (suppressTypes.includes(name)) {
          context.report({
            data: { weakType: name },
            messageId: 'noCustomWeakType',
            node,
          });
        }
      };
    }

    return checks;
  },
}: RuleModule<OptionsT>);
