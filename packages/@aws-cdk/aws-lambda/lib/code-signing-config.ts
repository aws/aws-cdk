import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnCodeSigningConfig } from './lambda.generated';

export enum UntrustedArtifactOnDeployment {
  ENFORCE = 'enforce',
  WARN = 'warn',
}

export interface CodeSigningConfigOptions {
  signingProfileVersionArn: string[],
  untrustedArtifactOnDeployment?: UntrustedArtifactOnDeployment,
  description?: string
}

export class CodeSigningConfig extends Resource {
  public readonly codeSigningConfigArn: string;

  constructor(scope: Construct, id: string, props: CodeSigningConfigOptions) {
    super(scope, id);

    if (props.signingProfileVersionArn.length > 20) {
      throw new Error('Signing profile version arn is up to 20');
    }

    const resource: CfnCodeSigningConfig = new CfnCodeSigningConfig(this, 'Resource', {
      allowedPublishers: {
        signingProfileVersionArns: props.signingProfileVersionArn,
      },
      codeSigningPolicies: {
        untrustedArtifactOnDeployment: props.untrustedArtifactOnDeployment
      },
      description: props.description
    });
    this.codeSigningConfigArn = resource.ref;
  }
}
