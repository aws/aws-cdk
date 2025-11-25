import { CfnResource } from 'aws-cdk-lib/core';
import type { IConstruct } from 'constructs';

export function makeIsCfnResource(cfnResourceType: string): (construct: IConstruct) => boolean {
  return (construct: IConstruct) => CfnResource.isCfnResource(construct) && construct.cfnResourceType === cfnResourceType;
}
