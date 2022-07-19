// @flow strict-local
import type { RuleMetaData, RuleTesterTests } from 'eslint';

export type RuleTestAssertionsT<TOptions: $ReadOnlyArray<$FlowFixMe> = []> =
  $ReadOnly<{
    invalid: RuleTesterTests<TOptions>['invalid'],
    misconfigured: $ReadOnlyArray<
      $ReadOnly<{
        errors: $ReadOnlyArray<
          $ReadOnly<{
            data: mixed,
            instancePath: string,
            keyword: string,
            message: string,
            params: $ReadOnly<{ [string]: string }>,
            parentSchema: RuleMetaData['schema'],
            schema: mixed,
            schemaPath: string,
          }>>,
        options: TOptions,
      }>>,
    valid: RuleTesterTests<TOptions>['valid'],
  }>;
