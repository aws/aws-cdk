import cdk = require('@aws-cdk/cdk');

/**
 * Properties for a SecretString
 */
export interface SecretStringProps {
  /**
   * Unique identifier or ARN of the secret
   */
  secretId: string;

  /**
   * Specifies the secret version that you want to retrieve by the staging label attached to the version.
   *
   * Can specify at most one of versionId and versionStage.
   *
   * @default AWSCURRENT
   */
  versionStage?: string;

  /**
   * Specifies the unique identifier of the version of the secret that you want to use in stack operations.
   *
   * Can specify at most one of versionId and versionStage.
   *
   * @default AWSCURRENT
   */
  versionId?: string;
}

/**
 * References a secret string in Secrets Manager
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html
 */
export class SecretString extends cdk.DynamicReference {
  constructor(scope: cdk.Construct, id: string, private readonly props: SecretStringProps) {
    super(scope, id, {
      service: cdk.DynamicReferenceService.SecretsManager,
      referenceKey: '',
    });

    // If we don't validate this here it will lead to a very unclear
    // error message in CloudFormation, so better do it.
    if (!props.secretId) {
      throw new Error('SecretString: secretId cannot be empty');
    }
  }

  /**
   * Return the full value of the secret
   */
  public get stringValue(): string {
    return this.resolveStringForJsonKey('');
  }

  /**
   * Interpret the secret as a JSON object and return a field's value from it
   */
  public jsonFieldValue(key: string) {
    return this.resolveStringForJsonKey(key);
  }

  private resolveStringForJsonKey(jsonKey: string) {
    const parts = [
      this.props.secretId,
      'SecretString',
      jsonKey,
      this.props.versionStage || '',
      this.props.versionId || ''
    ];

    return this.makeResolveValue(cdk.DynamicReferenceService.SecretsManager, parts.join(':'));
  }
}
