import { Construct } from 'constructs';
import { Alias, AliasOptions } from './alias';
import { IVersion } from './lambda-version';

export function addAlias(scope: Construct, version: IVersion, aliasName: string, options: AliasOptions = {}) {
  return new Alias(scope, `Alias${aliasName}`, {
    aliasName,
    version,
    ...options,
  });
}
