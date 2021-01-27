import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnCodeSigningConfig } from './lambda.generated';
import { SigningProfile } from '@aws-cdk/aws-signer';

export enum UntrustedArtifactOnDeployment {
  ENFORCE = 'enforce',
  WARN = 'warn',
}

export interface ICodeSigningConfig extends IResource {
  /**
   * The ARN of Code Signing Config
   * @Attribute CodeSigningConfigArn
   */
  readonly codeSigningConfigArn: string;

  /**
   * The id of Code Signing Config
   * @Attribute CodeSigningConfigId
   */
  readonly codeSigningConfigId: string;
}

export interface CodeSigningConfigProps {
  signingProfile: SigningProfile,
  untrustedArtifactOnDeployment?: UntrustedArtifactOnDeployment,
  description?: string
}

export class CodeSigningConfig extends Resource implements ICodeSigningConfig{
  readonly codeSigningConfigArn: string;
  readonly codeSigningConfigId: string;

  constructor(scope: Construct, id: string, props: CodeSigningConfigProps) {
    super(scope, id);

    if (props.signingProfile.length > 20) {
      throw new Error('Signing profile version arn is up to 20');
    }

    const resource: CfnCodeSigningConfig = new CfnCodeSigningConfig(this, 'Resource', {
      allowedPublishers: {
        signingProfileVersionArns: props.signingProfile.signingProfileVersionArn,
      },
      codeSigningPolicies: {
        untrustedArtifactOnDeployment: props.untrustedArtifactOnDeployment
      },
      description: props.description
    });
    this.codeSigningConfigArn = resource.attrCodeSigningConfigArn;
    this.codeSigningConfigId = resource.attrCodeSigningConfigId;
  }
}
