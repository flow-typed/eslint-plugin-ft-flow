const schema = [];

const create = (context) => {
  let globalScope;

  const makeDefined = (variableName) => {
    // Add the variable to the global scope
    globalScope.through = globalScope.through.filter((ref) => {
      if (ref.identifier.name === variableName) {
        return false;
      }
      return true;
    });
  };

  // NOTE: For future contributors, if you ever need to add support for a new identifier,
  // use `Identifier(node) {}` to find out which identifiers should be handled.
  return {
    ClassImplements(node) {
      makeDefined(node.id.name);
    },
    DeclareInterface(node) {
      makeDefined(node.id.name);
    },
    DeclareTypeAlias(node) {
      makeDefined(node.id.name);
    },
    EnumDeclaration(node) {
      makeDefined(node.id.name);
    },
    EnumDefaultedMember(node) {
      makeDefined(node.id.name);
    },
    EnumNumberMember(node) {
      makeDefined(node.id.name);
    },
    EnumStringMember(node) {
      makeDefined(node.id.name);
    },
    GenericTypeAnnotation(node) {
      if (node.id.type === 'Identifier') {
        makeDefined(node.id.name);
      } else if (node.id.type === 'QualifiedTypeIdentifier') {
        let qid;

        qid = node.id;
        while (qid.qualification) {
          qid = qid.qualification;
        }

        makeDefined(qid.name);
      }
    },

    // Can be removed once https://github.com/babel/babel-eslint/pull/696 is published
    OpaqueType(node) {
      if (node.id.type === 'Identifier') {
        makeDefined(node.id.name);
      }
    },
    Program(node) {
      if (context.sourceCode?.getScope) {
        globalScope = context.sourceCode.getScope(node);
      } else {
        globalScope = context.getScope();
      }
    },
    TypeParameterDeclaration(node) {
      for (const param of node.params) {
        makeDefined(param.name);
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
