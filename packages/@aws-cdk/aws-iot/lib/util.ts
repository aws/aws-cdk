import { DefaultTokenResolver, Tokenization, Stack, StringConcat } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { CertificateAttributes } from './certificate';
import { ThingAttributes } from './thing';

const MAX_POLICY_NAME_LEN = 128;
/**
 * Returns a string composed of the last n characters of str.
 * If str is shorter than n, returns str.
 *
 * @param str the string to return the last n characters of
 * @param n how many characters to return
 */
function lastNCharacters(str: string, n: number) {
  const startIndex = Math.max(str.length - n, 0);
  return str.substring(startIndex, str.length);
}
/**
 * Used to generate a unique policy name based on the policy resource construct.
 * The logical ID of the resource is a great candidate as long as it doesn't exceed
 * 128 characters, so we take the last 128 characters (in order to make sure the hash
 * is there).
 */
export function generatePolicyName(scope: IConstruct, logicalId: string): string {
  // as logicalId is itself a Token, resolve it first
  const resolvedLogicalId = Tokenization.resolve(logicalId, {
    scope,
    resolver: new DefaultTokenResolver(new StringConcat()),
  });
  return lastNCharacters(resolvedLogicalId, MAX_POLICY_NAME_LEN);
}

export function parsePolicyArn(construct: IConstruct, policyName: string): string {
  return parseArn(construct, 'policy', policyName);
}

export function parseCertificateArn(construct: IConstruct, props: CertificateAttributes): string {
  if (props.certificateArn) {
    return props.certificateArn;
  }

  if (props.certificateId) {
    return parseArn(construct, 'cert', props.certificateId);
  }

  throw new Error('Cannot determine certifiate ARN. At least `certificateArn` or `certifiateId` is needed');
}

export function parseCertificateId(construct: IConstruct, props: CertificateAttributes): string {
  if (props.certificateId) {
    return props.certificateId;
  }

  // extract certificate id from certificate arn
  if (props.certificateArn) {
    return Stack.of(construct).parseArn(props.certificateArn).resourceName?.replace('cert/', '') || '';
  }

  throw new Error('Cannot determine certifiate ID. At least `certificateArn` or `certifiateId` is needed');
}

export function parseThingArn(construct: IConstruct, props: ThingAttributes): string {
  if (props.thingArn) {
    return props.thingArn;
  }

  if (props.thingName) {
    return parseArn(construct, 'thing', props.thingName);
  }

  throw new Error('Cannot determine thing ARN. At least `thingArn` or `thingName` is needed');
}

export function parseThingName(construct: IConstruct, props: ThingAttributes): string {
  if (props.thingName) {
    return props.thingName;
  }

  // extract certificate id from certificate arn
  if (props.thingArn) {
    return Stack.of(construct).parseArn(props.thingArn).resourceName?.replace('thing/', '') || '';
  }

  throw new Error('Cannot determine thing ID. At least `thingArn` or `thingName` is needed');
}

function parseArn(construct: IConstruct, resource: string, resourceName: string): string {
  return Stack.of(construct).formatArn({
    region: Stack.of(construct).region,
    account: Stack.of(construct).account,
    service: 'iot',
    resource: resource,
    resourceName: resourceName,
  });
}
