import {
  spacingFixers,
} from '../utilities';

const schema = [
  {
    enum: ['always', 'never'],
    type: 'string',
  },
];

function isNeverOption(context) {
  return (context.options[0] || 'never') === 'never';
}

function isWhitespaceCRLF(whitespace) {
  return whitespace !== '\n' && whitespace !== '\r';
}

function spacesOutside(node, context) {
  const { callee, typeArguments } = node;
  if (typeArguments == null) {
    return;
  }

  const sourceCode = context.getSourceCode();
  const { name } = callee;
  const never = isNeverOption(context);
  const parentheses = sourceCode.getTokenAfter(typeArguments);

  const spacesBefore = typeArguments.range[0] - callee.range[1];
  const spacesAfter = parentheses.range[0] - typeArguments.range[1];

  if (never) {
    if (spacesBefore) {
      const whiteSpaceBefore = sourceCode.text[typeArguments.range[0]];

      if (isWhitespaceCRLF(whiteSpaceBefore)) {
        context.report({
          data: { name },
          fix: spacingFixers.stripSpacesBefore(typeArguments, spacesBefore),
          message: 'There must be no space before "{{name}}" type annotation',
          node,
        });
      }
    }

    if (spacesAfter) {
      const whiteSpaceAfter = sourceCode.text[typeArguments.range[1] - 1];

      if (isWhitespaceCRLF(whiteSpaceAfter)) {
        context.report({
          data: { name },
          fix: spacingFixers.stripSpacesAfter(typeArguments, spacesAfter),
          message: 'There must be no space after "{{name}}" type annotation',
          node,
        });
      }
    }

    return;
  }

  if (!never) {
    if (spacesBefore > 1) {
      context.report({
        data: { name },
        fix: spacingFixers.stripSpacesBefore(typeArguments, spacesBefore - 1),
        message: 'There must be one space before "{{name}}" generic type annotation bracket',
        node,
      });
    }

    if (spacesBefore === 0) {
      context.report({
        data: { name },
        fix: spacingFixers.addSpaceBefore(typeArguments),
        message: 'There must be a space before "{{name}}" generic type annotation bracket',
        node,
      });
    }

    if (spacesAfter > 1) {
      context.report({
        data: { name },
        fix: spacingFixers.stripSpacesAfter(typeArguments, spacesAfter),
        message: 'There must be one space before "{{name}}" generic type annotation bracket',
        node,
      });
    }

    if (spacesAfter === 0) {
      context.report({
        data: { name },
        fix: spacingFixers.addSpaceAfter(typeArguments),
        message: 'There must be a space before "{{name}}" generic type annotation bracket',
        node,
      });
    }
  }
}

function spacesInside(node, context) {
  const { callee, typeArguments } = node;
  if (typeArguments == null) {
    return;
  }

  const sourceCode = context.getSourceCode();
  const { name } = callee;
  const never = isNeverOption(context);
  const isNullable = typeArguments.params[0].type === 'NullableTypeAnnotation';
  const [
    opener,
    firstInnerToken,
    secondInnerToken,
  ] = sourceCode.getFirstTokens(typeArguments, 3);
  const [
    lastInnerToken,
    closer,
  ] = sourceCode.getLastTokens(typeArguments, 2);

  const spacesBefore = firstInnerToken.range[0] - opener.range[1];
  const spaceBetweenNullToken = secondInnerToken.range[0] - firstInnerToken.range[1];
  const spacesAfter = closer.range[0] - lastInnerToken.range[1];

  if (never) {
    if (spacesBefore) {
      const whiteSpaceBefore = sourceCode.text[opener.range[1]];

      if (whiteSpaceBefore !== '\n' && whiteSpaceBefore !== '\r') {
        context.report({
          data: { name },
          fix: spacingFixers.stripSpacesAfter(opener, spacesBefore),
          message: 'There must be no spaces inside at the start of "{{name}}" type annotation',
          node,
        });
      }
    }

    if (isNullable && spaceBetweenNullToken) {
      context.report({
        data: { name },
        fix: spacingFixers.stripSpacesAfter(firstInnerToken, spaceBetweenNullToken),
        message: 'There must be no spaces inside "{{name}}" type annotation',
        node,
      });
    }

    if (spacesAfter) {
      const whiteSpaceAfter = sourceCode.text[closer.range[0] - 1];

      if (isWhitespaceCRLF(whiteSpaceAfter)) {
        context.report({
          data: { name },
          fix: spacingFixers.stripSpacesAfter(lastInnerToken, spacesAfter),
          message: 'There must be no spaces inside at the end of "{{name}}" type annotation',
          node,
        });
      }
    }

    return;
  }

  if (!never) {
    if (spacesBefore > 1) {
      context.report({
        data: { name },
        fix: spacingFixers.stripSpacesBefore(opener, spacesBefore - 1),
        message: 'There must be one space before "{{name}}" generic type annotation bracket',
        node,
      });
    }

    if (spacesBefore === 0) {
      context.report({
        data: { name },
        fix: spacingFixers.addSpaceBefore(opener),
        message: 'There must be a space before "{{name}}" generic type annotation bracket',
        node,
      });
    }

    if (spacesAfter > 1) {
      context.report({
        data: { name },
        fix: spacingFixers.stripSpacesAfter(closer, spacesAfter),
        message: 'There must be one space before "{{name}}" generic type annotation bracket',
        node,
      });
    }

    if (spacesAfter === 0) {
      context.report({
        data: { name },
        fix: spacingFixers.addSpaceAfter(closer),
        message: 'There must be a space before "{{name}}" generic type annotation bracket',
        node,
      });
    }
  }
}

const create = (context) => ({
  CallExpression(node) {
    spacesOutside(node, context);
    spacesInside(node, context);
  },
});

export default {
  create,
  meta: {
    fixable: 'code',
  },
  schema,
};
