// @flow strict-local
import type { RuleModule } from 'eslint';

import { suppressionTypes } from '../utilities';

const FLOW_STRICT_MATCHER = /^\s*@(?:no)?flow\s*strict(?:-local)?\s*$/u;

export default ({
  meta: {
    messages: {
      noFlowSuppression:
        'No suppression comments are allowed in "strict" Flow files. Either remove the error suppression, or lower the strictness of this module.',
    },
    schema: [
      {
        additionalProperties: false,
        properties: Object.fromEntries(
          suppressionTypes.map((suppressionType) => [
            suppressionType,
            {
              type: 'boolean',
            },
          ]),
        ),
        type: 'object',
      },
    ],
  },
  create(context) {
    const suppressionOptions = context.options[0] ?? {};

    const isStrictFlowFile = () => context
      .getSourceCode()
      .getAllComments()
      .some((comment) => FLOW_STRICT_MATCHER.test(comment.value));
    if (!isStrictFlowFile()) {
      // Skip this file - nothing to check here
      return {};
    }

    return {
      Program: () => {
        const comments = context
          .getSourceCode()
          .getAllComments()
          .filter((node) => node.type === 'Block' || node.type === 'Line');

        for (const commentNode of comments) {
          const comment = commentNode.value.trimStart();
          const match = suppressionTypes.some((prefix) => {
            if (suppressionOptions[prefix] === false) return false;

            return comment.startsWith(prefix);
          });
          if (match) {
            context.report({
              messageId: 'noFlowSuppression',
              node: commentNode,
            });
          }
        }
      },
    };
  },
}: RuleModule<
  [
    {
      $FlowExpectedError?: boolean,
      $FlowFixMe?: boolean,
      $FlowIgnore?: boolean,
      $FlowIssue?: boolean,
    } | void,
  ]
>);
