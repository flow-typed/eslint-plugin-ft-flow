const schema = [];

const create = (context) => {
  const markTypeAsUsed = (node) => {
    if (context.sourceCode?.markVariableAsUsed) {
      context.sourceCode.markVariableAsUsed(node.id.name, node);
    } else {
      context.markVariableAsUsed(node.id.name);
    }
  };

  const markTypeAsUsedWithGenericType = (node) => {
    let typeId;

    if (node.id.type === 'Identifier') {
      typeId = node.id;
    } else if (node.id.type === 'QualifiedTypeIdentifier') {
      typeId = node.id;
      do {
        typeId = typeId.qualification;
      } while (typeId.qualification);
    }

    if (!typeId || !typeId.name) {
      return;
    }

    if (context.sourceCode?.markVariableAsUsed) {
      context.sourceCode.markVariableAsUsed(typeId.name, typeId);
    } else {
      context.markVariableAsUsed(typeId.name);
    }
  };

  return {
    DeclareClass: markTypeAsUsed,
    DeclareFunction: markTypeAsUsed,
    DeclareModule: markTypeAsUsed,
    DeclareVariable: markTypeAsUsed,
    GenericTypeAnnotation: markTypeAsUsedWithGenericType,
    TypeParameterDeclaration(node) {
      for (const param of node.params) {
        if (param.default && param.default.typeParameters) {
          if (param.default.type === 'GenericTypeAnnotation') {
            markTypeAsUsedWithGenericType(param.default);
          }

          for (const typeParameterNode of param.default.typeParameters.params) {
            if (typeParameterNode.type === 'GenericTypeAnnotation') {
              markTypeAsUsedWithGenericType(typeParameterNode);
            }
          }
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
