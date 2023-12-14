import { Construct } from 'constructs';
import { AliasAttributes } from './alias';
import { ArnFormat, Stack } from '../../core';

export function parseAliasName(construct: Construct, props: AliasAttributes) : string | undefined {
  if (props.aliasName) {
    return props.aliasName;
  }

  if (props.aliasArn) {
    const { resource, resourceName } = Stack.of(construct).splitArn(props.aliasArn, ArnFormat.SLASH_RESOURCE_NAME);
    return `${resource}/${resourceName}`;
  }

  return undefined;
}

export function makeAliasArn(construct: Construct, props: AliasAttributes): string | undefined {
  // if we have an explicit alias ARN, use it.
  if (props.aliasArn) {
    return props.aliasArn;
  }

  if (!props.aliasName) {
    return undefined;
  }

  const stack = Stack.of(construct);
  const account = props.account ?? stack.account;
  const region = props.region ?? stack.region;

  return Stack.of(construct).formatArn({
    account,
    region,
    service: 'kms',
    resource: props.aliasName,
  });
}
