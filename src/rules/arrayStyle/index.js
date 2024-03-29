import isSimpleType from './isSimpleType';
import needWrap from './needWrap';

const schema = [
  {
    enum: ['verbose', 'shorthand'],
    type: 'string',
  },
];

const inlineType = (type) => {
  const inlined = type.replace(/\s+/ug, ' ');

  if (inlined.length <= 50) {
    return inlined;
  }

  return 'Type';
};

export default (defaultConfig, simpleType) => {
  const create = (context) => {
    const verbose = (context.options[0] || defaultConfig) === 'verbose';

    return {
      // shorthand
      ArrayTypeAnnotation(node) {
        const rawElementType = context.getSourceCode().getText(node.elementType);
        const inlinedType = inlineType(rawElementType);
        const wrappedInlinedType = needWrap(node.elementType) ? `(${inlinedType})` : inlinedType;

        if (isSimpleType(node.elementType) === simpleType && verbose) {
          context.report({
            data: {
              type: inlinedType,
              wrappedType: wrappedInlinedType,
            },
            fix(fixer) {
              return fixer.replaceText(node, `Array<${rawElementType}>`);
            },
            message: 'Use "Array<{{ type }}>", not "{{ wrappedType }}[]"',
            node,
          });
        }
      },

      // verbose
      GenericTypeAnnotation(node) {
        // Don't report on un-parameterized Array annotations. There are valid cases for this,
        // but regardless, we must NOT crash when encountering them.
        if (node.id.name === 'Array'
          && node.typeParameters && node.typeParameters.params.length === 1) {
          const elementTypeNode = node.typeParameters.params[0];
          const rawElementType = context.getSourceCode().getText(elementTypeNode);
          const inlinedType = inlineType(rawElementType);
          const wrappedInlinedType = needWrap(elementTypeNode) ? `(${inlinedType})` : inlinedType;

          if (isSimpleType(elementTypeNode) === simpleType && !verbose) {
            context.report({
              data: {
                type: inlinedType,
                wrappedType: wrappedInlinedType,
              },
              fix(fixer) {
                if (needWrap(elementTypeNode)) {
                  return fixer.replaceText(node, `(${rawElementType})[]`);
                }

                return fixer.replaceText(node, `${rawElementType}[]`);
              },
              message: 'Use "{{ wrappedType }}[]", not "Array<{{ type }}>"',
              node,
            });
          }
        }
      },
    };
  };

  return {
    create,
    meta: {
      fixable: 'code',
      schema,
    },
  };
};
