const schema = [];

const create = (context) => {
  let globalScope;

  // // do nearly the same thing that eslint does for config globals
  // // https://github.com/eslint/eslint/blob/v2.0.0/lib/eslint.js#L118-L194
  // const makeDefined = (ident) => {
  //   let ii;

  //   // start from the right since we're going to remove items from the array
  //   for (ii = globalScope.through.length - 1; ii >= 0; ii--) {
  //     const ref = globalScope.through[ii];
  //     const typeName = ident.name

  //     if (ref.identifier.name === typeName) {
  //       console.log(ident);
  //       // use "__defineGeneric" since we don't have a reference to "escope.Variable"

  //       // console.log(globalScope.__defineGeneric);
  //       // if (globalScope.__defineGeneric) {

  //       //   globalScope.__defineGeneric(
  //       //     ident.name,
  //       //     globalScope.set,
  //       //     globalScope.variables,
  //       //   );
  //       // }
  //       const variable = globalScope.set.get(typeName);
  //       console.log(variable);

  //       if (!variable) {
  //         globalScope.variables.push({
  //           name: typeName,
  //           identifiers: [],
  //           references: []
  //         });
  //         globalScope.set.set(typeName, { defs: [], references: [] });
  //       }

  //       // variable.writeable = false;

  //       // // "through" contains all references whose definition cannot be found
  //       // // so we need to update references and remove the ones that were added
  //       // globalScope.through.splice(ii, 1);
  //       // ref.resolved = variable;
  //       // variable.references.push(ref);
  //     }
  //   }
  // };

  const makeDefined = (variableName) => {
    // Add the variable to the global scope
    globalScope.through = globalScope.through.filter(ref => {
      if (ref.identifier.name === variableName) {
          globalScope.variables.push({
              name: variableName,
              identifiers: [ref.identifier],
              references: [ref],
              defs: [],
          });
          return false;
      }
      return true;
    });
  }

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
        do {
          qid = qid.qualification;
        } while (qid.qualification);

        makeDefined(node.id.name);
      }
    },

    // Can be removed once https://github.com/babel/babel-eslint/pull/696 is published
    OpaqueType(node) {
      if (node.id.type === 'Identifier') {
        makeDefined(node.id.name);
      }
    },
    Program(node) {
      const newGetScope = context.sourceCode.getScope;
      if (newGetScope) {
        globalScope = context.sourceCode.getScope(node);
      } else {
        globalScope = context.getScope();
      }
    },
    TypeParameterDeclaration(node) {
      for (const param of node.params) {
        makeDefined(node.id.name);
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
