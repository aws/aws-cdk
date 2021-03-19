import { ISigningProfile } from '@aws-cdk/aws-signer';
import { IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnCodeSigningConfig } from './lambda.generated';

/**
 * Code signing configuration policy for deployment validation failure.
 */
export enum UntrustedArtifactOnDeployment {
  /**
   * Lambda blocks the deployment request if signature validation checks fail.
   */
  ENFORCE = 'Enforce',

  /**
   * Lambda allows the deployment of the code package, but issues a warning.
   * Lambda issues a new Amazon CloudWatch metric, called a signature validation error and also stores the warning in CloudTrail.
   */
  WARN = 'Warn',
}

/**
 * A Code Signing Config
 */
export interface ICodeSigningConfig extends IResource {
  /**
   * The ARN of Code Signing Config
   * @attribute
   */
  readonly codeSigningConfigArn: string;

  /**
   * The id of Code Signing Config
   * @attribute
   */
  readonly codeSigningConfigId: string;
}

/**
 * Construction properties for a Code Signing Config object
 */
export interface CodeSigningConfigProps {
  /**
   * List of signing profiles that defines a
   * trusted user who can sign a code package.
   */
  readonly signingProfiles: ISigningProfile[],

  /**
   * Code signing configuration policy for deployment validation failure.
   * If you set the policy to Enforce, Lambda blocks the deployment request
   * if signature validation checks fail.
   * If you set the policy to Warn, Lambda allows the deployment and
   * creates a CloudWatch log.
   *
   * @default UntrustedArtifactOnDeployment.WARN
   */
  readonly untrustedArtifactOnDeployment?: UntrustedArtifactOnDeployment,

  /**
   * Code signing configuration description.
   *
   * @default - No description.
   */
  readonly description?: string,
}

/**
 * Defines a Code Signing Config.
 *
 * @resource AWS::Lambda::CodeSigningConfig
 */
export class CodeSigningConfig extends Resource implements ICodeSigningConfig {
  /**
   * Creates a Signing Profile construct that represents an external Signing Profile.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param codeSigningConfigArn The ARN of code signing config.
   */
  public static fromCodeSigningConfigArn( scope: Construct, id: string, codeSigningConfigArn: string): ICodeSigningConfig {
    const codeSigningProfileId = Stack.of(scope).parseArn(codeSigningConfigArn).resourceName;
    if (!codeSigningProfileId) {
      throw new Error(`Code signing config ARN must be in the format 'arn:aws:lambda:<region>:<account>:code-signing-config:<codeSigningConfigArn>', got: '${codeSigningConfigArn}'`);
    }
    const assertedCodeSigningProfileId = codeSigningProfileId;
    class Import extends Resource implements ICodeSigningConfig {
      public readonly codeSigningConfigArn = codeSigningConfigArn;
      public readonly codeSigningConfigId = assertedCodeSigningProfileId;

      constructor() {
        super(scope, id);
      }
    }
    return new Import();
  }

  public readonly codeSigningConfigArn: string;
  public readonly codeSigningConfigId: string;

  constructor(scope: Construct, id: string, props: CodeSigningConfigProps) {
    super(scope, id);

    const signingProfileVersionArns = props.signingProfiles.map(signingProfile => {
      return signingProfile.signingProfileVersionArn;
    });

    const resource: CfnCodeSigningConfig = new CfnCodeSigningConfig(this, 'Resource', {
      allowedPublishers: {
        signingProfileVersionArns,
      },
      codeSigningPolicies: {
        untrustedArtifactOnDeployment: props.untrustedArtifactOnDeployment ?? UntrustedArtifactOnDeployment.WARN,
      },
      description: props.description,
    });
    this.codeSigningConfigArn = resource.attrCodeSigningConfigArn;
    this.codeSigningConfigId = resource.attrCodeSigningConfigId;
  }
}
