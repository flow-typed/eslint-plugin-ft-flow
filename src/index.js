import _ from 'lodash';

import packageJson from '../package.json';
import recommendedJson from './configs/recommended.json';
import babelParserJson from './configs/babel-parser.json';

import arrayStyleComplexType from './rules/arrayStyleComplexType';
import arrayStyleSimpleType from './rules/arrayStyleSimpleType';
import arrowParens from './rules/arrowParens';
import booleanStyle from './rules/booleanStyle';
import defineFlowType from './rules/defineFlowType';
import delimiterDangle from './rules/delimiterDangle';
import enforceLineBreak from './rules/enforceLineBreak';
import enforceSuppressionCode from './rules/enforceSuppressionCode';
import genericSpacing from './rules/genericSpacing';
import interfaceIdMatch from './rules/interfaceIdMatch';
import newlineAfterFlowAnnotation from './rules/newlineAfterFlowAnnotation';
import noDupeKeys from './rules/noDupeKeys';
import noDuplicateTypeUnionIntersectionMembers from './rules/noDuplicateTypeUnionIntersectionMembers';
import noExistentialType from './rules/noExistentialType';
import noFlowFixMeComments from './rules/noFlowFixMeComments';
import noFlowSuppressionsInStrictFiles from './rules/noFlowSuppressionsInStrictFiles';
import noInternalFlowType from './rules/noInternalFlowType';
import noMixed from './rules/noMixed';
import noMutableArray from './rules/noMutableArray';
import noPrimitiveConstructorTypes from './rules/noPrimitiveConstructorTypes';
import noTypesMissingFileAnnotation from './rules/noTypesMissingFileAnnotation';
import noUnusedExpressions from './rules/noUnusedExpressions';
import noWeakTypes from './rules/noWeakTypes';
import objectTypeCurlySpacing from './rules/objectTypeCurlySpacing';
import objectTypeDelimiter from './rules/objectTypeDelimiter';
import quotes from './rules/quotes';
import requireCompoundTypeAlias from './rules/requireCompoundTypeAlias';
import requireExactType from './rules/requireExactType';
import requireIndexerName from './rules/requireIndexerName';
import requireInexactType from './rules/requireInexactType';
import requireParameterType from './rules/requireParameterType';
import requireReadonlyReactProps from './rules/requireReadonlyReactProps';
import requireReturnType from './rules/requireReturnType';
import requireTypesAtTop from './rules/requireTypesAtTop';
import requireValidFileAnnotation from './rules/requireValidFileAnnotation';
import requireVariableType from './rules/requireVariableType';
import semi from './rules/semi';
import sortKeys from './rules/sortKeys';
import sortTypeUnionIntersectionMembers from './rules/sortTypeUnionIntersectionMembers';
import spaceAfterTypeColon from './rules/spaceAfterTypeColon';
import spaceBeforeGenericBracket from './rules/spaceBeforeGenericBracket';
import spaceBeforeTypeColon from './rules/spaceBeforeTypeColon';
import spreadExactType from './rules/spreadExactType';
import typeIdMatch from './rules/typeIdMatch';
import typeImportStyle from './rules/typeImportStyle';
import unionIntersectionSpacing from './rules/unionIntersectionSpacing';
import useFlowType from './rules/useFlowType';
import useReadOnlySpread from './rules/useReadOnlySpread';
import validSyntax from './rules/validSyntax';
import {
  checkFlowFileAnnotation,
} from './utilities';

const rules = {
  'array-style-complex-type': arrayStyleComplexType,
  'array-style-simple-type': arrayStyleSimpleType,
  'arrow-parens': arrowParens,
  'boolean-style': booleanStyle,
  'define-flow-type': defineFlowType,
  'delimiter-dangle': delimiterDangle,
  'enforce-line-break': enforceLineBreak,
  'enforce-suppression-code': enforceSuppressionCode,
  'generic-spacing': genericSpacing,
  'interface-id-match': interfaceIdMatch,
  'newline-after-flow-annotation': newlineAfterFlowAnnotation,
  'no-dupe-keys': noDupeKeys,
  'no-duplicate-type-union-intersection-members': noDuplicateTypeUnionIntersectionMembers,
  'no-existential-type': noExistentialType,
  'no-flow-fix-me-comments': noFlowFixMeComments,
  'no-flow-suppressions-in-strict-files': noFlowSuppressionsInStrictFiles,
  'no-internal-flow-type': noInternalFlowType,
  'no-mixed': noMixed,
  'no-mutable-array': noMutableArray,
  'no-primitive-constructor-types': noPrimitiveConstructorTypes,
  'no-types-missing-file-annotation': noTypesMissingFileAnnotation,
  'no-unused-expressions': noUnusedExpressions,
  'no-weak-types': noWeakTypes,
  'object-type-curly-spacing': objectTypeCurlySpacing,
  'object-type-delimiter': objectTypeDelimiter,
  quotes,
  'require-compound-type-alias': requireCompoundTypeAlias,
  'require-exact-type': requireExactType,
  'require-indexer-name': requireIndexerName,
  'require-inexact-type': requireInexactType,
  'require-parameter-type': requireParameterType,
  'require-readonly-react-props': requireReadonlyReactProps,
  'require-return-type': requireReturnType,
  'require-types-at-top': requireTypesAtTop,
  'require-valid-file-annotation': requireValidFileAnnotation,
  'require-variable-type': requireVariableType,
  semi,
  'sort-keys': sortKeys,
  'sort-type-union-intersection-members': sortTypeUnionIntersectionMembers,
  'space-after-type-colon': spaceAfterTypeColon,
  'space-before-generic-bracket': spaceBeforeGenericBracket,
  'space-before-type-colon': spaceBeforeTypeColon,
  'spread-exact-type': spreadExactType,
  'type-id-match': typeIdMatch,
  'type-import-style': typeImportStyle,
  'union-intersection-spacing': unionIntersectionSpacing,
  'use-flow-type': useFlowType,
  'use-read-only-spread': useReadOnlySpread,
  'valid-syntax': validSyntax,
};

const plugin = {
  meta: {
    name: packageJson.name,
    version: packageJson.version,
    namespace: 'ft-flow',
  },
  /** @type {Record<string, import("eslint").Rule.RuleModule>} */
  rules: _.mapValues(rules, (rule, key) => {
    if (['no-types-missing-file-annotation', 'require-valid-file-annotation'].includes(key)) {
      return rule;
    }

    return {
      ...rule,
      create: _.partial(checkFlowFileAnnotation, rule.create),
    };
  }),
};

const ftFlow = {
  ...plugin,
  configs: {
    /** @type {import("eslint").Linter.LegacyConfig} */
    recommended: recommendedJson,
    /** @type {import("eslint").Linter.LegacyConfig} */
    'babel-parser': babelParserJson,
    /** @type {import("eslint").Linter.FlatConfig} */
    'flat/recommended': {
      name: 'ft-flow/recommended',
      plugins: {
        'ft-flow': plugin,
      },
      languageOptions: {
        get parser() {
          return require('hermes-eslint');
        },
      },
      settings: recommendedJson.settings,
      rules: recommendedJson.rules,
    },
    /** @type {import("eslint").Linter.FlatConfig} */
    'flat/babel-parser': {
      name: 'ft-flow/custom-recommended',
      plugins: {
        'ft-flow': plugin,
      },
      languageOptions: {
        get parser() {
          return require('@babel/eslint-parser');
        },
      },
      settings: babelParserJson.settings,
      rules: babelParserJson.rules,
    },
  },
};

export default ftFlow;
