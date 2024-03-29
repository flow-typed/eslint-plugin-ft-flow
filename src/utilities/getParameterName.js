import _ from 'lodash';

export default (identifierNode, context) => {
  if (_.has(identifierNode, 'name')
      && identifierNode.type !== 'FunctionTypeParam') {
    return identifierNode.name;
  }

  if (_.has(identifierNode, 'left.name')) {
    return identifierNode.left.name;
  }

  if (_.has(identifierNode, 'key.name')) {
    return identifierNode.key.name;
  }

  if (identifierNode.type === 'RestElement') {
    return identifierNode.argument.name;
  }

  if (identifierNode.type === 'ObjectTypeProperty') {
    let tokenIndex;

    tokenIndex = 0;

    if (identifierNode.static) {
      tokenIndex += 1;
    }

    if (identifierNode.variance) {
      tokenIndex += 1;
    }

    if (identifierNode.kind === 'set' || identifierNode.kind === 'get') {
      tokenIndex += 1;
    }

    return context.getSourceCode().getFirstToken(identifierNode, tokenIndex).value;
  }

  if (identifierNode.type === 'ObjectTypeIndexer') {
    let tokenIndex;

    tokenIndex = 0;

    if (identifierNode.static) {
      tokenIndex += 1;
    }

    if (identifierNode.variance) {
      tokenIndex += 1;
    }

    tokenIndex += 1;

    const id = context.getSourceCode().getFirstToken(identifierNode, tokenIndex);
    const colonOrBrace = context.getSourceCode().getTokenAfter(id);
    if (colonOrBrace.value === ':') {
      return id.value;
    }

    return null;
  }

  if (identifierNode.type === 'FunctionTypeParam') {
    return context.getSourceCode().getFirstToken(identifierNode).value;
  }

  if (identifierNode.type === 'ObjectPattern' || identifierNode.type === 'ArrayPattern') {
    const text = context.getSourceCode().getText(identifierNode);

    if (identifierNode.typeAnnotation) {
      return text.replace(context.getSourceCode().getText(identifierNode.typeAnnotation), '').trim();
    }

    return text;
  }

  if (_.get(identifierNode, 'left.type') === 'ObjectPattern') {
    return context.getSourceCode().getText(identifierNode.left);
  }

  return null;
};
