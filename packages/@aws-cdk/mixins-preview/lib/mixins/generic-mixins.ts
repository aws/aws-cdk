import { IConstruct } from 'constructs';
import { CfnResource } from 'aws-cdk-lib';
import { IMixin } from '../core';

/**
 * Generic mixin for applying CloudFormation properties.
 */
export class CfnPropertiesMixin implements IMixin {
  constructor(private readonly properties: Record<string, any>) {}

  supports(construct: IConstruct): boolean {
    return construct instanceof CfnResource;
  }

  applyTo(construct: IConstruct): IConstruct {
    if (construct instanceof CfnResource) {
      Object.assign(construct, this.properties);
    }
    return construct;
  }
}
