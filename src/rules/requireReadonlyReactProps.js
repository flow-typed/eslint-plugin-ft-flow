import _ from 'lodash';

const schema = [
  {
    additionalProperties: false,
    properties: {
      useImplicitExactTypes: {
        type: 'boolean',
      },
      useExperimentalTypeScriptSyntax: {
        type: 'boolean',
      },
    },
    type: 'object',
  },
];

const reComponentName = /^(Pure)?Component$/u;
const reReadOnly = /^\$(ReadOnly|FlowFixMe)$/u;
const reReadOnlyTypeScript = /^(Readonly|$FlowFixMe)$/u;

const isReactComponent = (node) => {
  if (!node.superClass) {
    return false;
  }

  return (

    // class Foo extends Component { }
    // class Foo extends PureComponent { }
    (node.superClass.type === 'Identifier' && reComponentName.test(node.superClass.name))

    // class Foo extends React.Component { }
    // class Foo extends React.PureComponent { }
    || (node.superClass.type === 'MemberExpression'
    && (node.superClass.object.name === 'React' && reComponentName.test(node.superClass.property.name)))
  );
};

// type Props = {| +foo: string |}
const isReadOnlyObjectType = (node, { useImplicitExactTypes }) => {
  if (!node || node.type !== 'ObjectTypeAnnotation') {
    return false;
  }

  if (node.properties.length === 0) {
    // we consider `{}` to be ReadOnly since it's exact
    // AND has no props (when `implicitExactTypes=true`)
    // we consider `{||}` to be ReadOnly since it's exact
    // AND has no props (when `implicitExactTypes=false`)
    if (useImplicitExactTypes === true && node.exact === false) {
      return true;
    }

    if (node.exact === true) {
      return true;
    }
  }

  // { +foo: ..., +bar: ..., ... }
  return node.properties.length > 0
        && node.properties.every((prop) => prop.variance && prop.variance.kind === 'plus');
};

// type Props = {| +foo: string |} | {| +bar: number |}
const isReadOnlyObjectUnionType = (node, options) => {
  if (!node || node.type !== 'UnionTypeAnnotation') {
    return false;
  }

  return node.types.every((type) => isReadOnlyObjectType(type, options));
};

const isReadOnlyName = (name, { useExperimentalTypeScriptSyntax }) => (useExperimentalTypeScriptSyntax ? reReadOnlyTypeScript.test(name) : reReadOnly.test(name));

const isReadOnlyType = (node, options) => (
  (node.right.id && isReadOnlyName(node.right.id.name, options))
  || isReadOnlyObjectType(node.right, options)
  || isReadOnlyObjectUnionType(node.right, options)
);

const create = (context) => {
  const useImplicitExactTypes = _.get(context, ['options', 0, 'useImplicitExactTypes'], false);
  const useExperimentalTypeScriptSyntax = _.get(context, ['options', 0, 'useExperimentalTypeScriptSyntax'], false);
  const options = { useImplicitExactTypes, useExperimentalTypeScriptSyntax };

  const readOnlyTypes = [];
  const foundTypes = [];
  const reportedFunctionalComponents = [];

  const isReadOnlyClassProp = (node) => {
    const id = node.superTypeParameters && node.superTypeParameters.params[0].id;

    return (
      id
      && !isReadOnlyName(id.name, options)
      && !readOnlyTypes.includes(id.name)
      && foundTypes.includes(id.name)
    );
  };

  for (const node of context.getSourceCode().ast.body) {
    let idName;
    let typeNode;

    // type Props = $ReadOnly<{}>
    if (node.type === 'TypeAlias') {
      idName = node.id.name;
      typeNode = node;

      // export type Props = $ReadOnly<{}>
    } else if (node.type === 'ExportNamedDeclaration'
        && node.declaration
        && node.declaration.type === 'TypeAlias') {
      idName = node.declaration.id.name;
      typeNode = node.declaration;
    }

    if (idName) {
      foundTypes.push(idName);
      if (isReadOnlyType(typeNode, options)) {
        readOnlyTypes.push(idName);
      }
    }
  }

  const typeName = useExperimentalTypeScriptSyntax ? 'Readonly' : '$ReadOnly';

  return {

    // class components
    ClassDeclaration(node) {
      if (isReactComponent(node) && isReadOnlyClassProp(node)) {
        context.report({
          message: `${node.superTypeParameters.params[0].id.name} must be ${typeName}`,
          node,
        });
      } else if (node.superTypeParameters
                && node.superTypeParameters.params[0].type === 'ObjectTypeAnnotation'
                && !isReadOnlyObjectType(node.superTypeParameters.params[0], options)) {
        context.report({
          message: `${node.id.name} class props must be ${typeName}`,
          node,
        });
      }
    },

    // functional components
    JSXElement(node) {
      let currentNode = node;

      while (currentNode && currentNode.type !== 'FunctionDeclaration') {
        currentNode = currentNode.parent;
      }

      // functional components can only have 1 param
      if (!currentNode || currentNode.params.length !== 1) {
        return;
      }

      const { typeAnnotation } = currentNode.params[0];

      if (currentNode.params[0].type === 'Identifier' && typeAnnotation) {
        const identifier = typeAnnotation.typeAnnotation.id;
        if (identifier
            && foundTypes.includes(identifier.name)
            && !readOnlyTypes.includes(identifier.name)
            && !isReadOnlyName(identifier.name, options)) {
          if (reportedFunctionalComponents.includes(identifier)) {
            return;
          }

          context.report({
            message: `${identifier.name} must be ${typeName}`,
            node: identifier,
          });

          reportedFunctionalComponents.push(identifier);

          return;
        }

        if (typeAnnotation.typeAnnotation.type === 'ObjectTypeAnnotation'
            && !isReadOnlyObjectType(typeAnnotation.typeAnnotation, options)) {
          context.report({
            message: `${currentNode.id.name} component props must be ${typeName}`,
            node,
          });
        }
      }
    },
  };
};

export default {
  create,
  meta: {
    schema,
  },
};
