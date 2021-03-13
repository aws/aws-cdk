export { generatePolicyName } from '@aws-cdk/aws-iam/lib/util';
import { Stack } from '@aws-cdk/core';
import { IConstruct } from 'constructs';
import { CertificateAttributes } from './certificate';

export function parsePolicyArn(construct: IConstruct, policyName: string): string {
  return Stack.of(construct).formatArn({
    account: Stack.of(construct).account,
    region: Stack.of(construct).region,
    service: 'iot',
    resource: 'policy',
    resourceName: policyName,
  });
}

export function parseCertificateArn(construct: IConstruct, props: CertificateAttributes): string {
  if (props.certificateArn) {
    return props.certificateArn;
  }

  if (props.certificateId) {
    return Stack.of(construct).formatArn({
      region: Stack.of(construct).region,
      account: Stack.of(construct).account,
      service: 'iot',
      resource: 'cert',
      resourceName: props.certificateId,
    });
  }

  throw new Error('Cannot determine certifiate ARN. At least `certificateArn` or `certifiateId` is needed');
}

export function parseCertificateId(construct: IConstruct, props: CertificateAttributes): string {
  if (props.certificateId) {
    return props.certificateId;
  }

  // extract certificate id from certificate arn
  if (props.certificateArn) {
    const resourceName = Stack.of(construct).parseArn(props.certificateArn).resourceName || 'cert/';
    return resourceName.replace('cert/', '');
  }

  throw new Error('Cannot determine certifiate ID. At least `certificateArn` or `certifiateId` is needed');
}
