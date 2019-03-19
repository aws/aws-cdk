import cdk = require('@aws-cdk/cdk');
import { ISecret, Secret } from './secret';
import { CfnSecretTargetAttachment } from './secretsmanager.generated';

/**
 * The type of service or database that's being associated with the secret.
 */
export enum AttachmentTargetType {
  /**
   * A database instance
   */
  Instance = 'AWS::RDS::DBInstance',

  /**
   * A database cluster
   */
  Cluster = 'AWS::RDS::DBCluster'
}

/**
 * Options to add a secret attachement to a secret.
 */
export interface SecretTargetAttachmentOptions {
  /**
   * The id of the target to attach the secret to.
   */
  targetId: string;

  /**
   * The type of the target to attach the secret to.
   */
  targetType: AttachmentTargetType;
}

/**
 * Construction properties for a SecretAttachement.
 */
export interface SecretTargetAttachmentProps extends SecretTargetAttachmentOptions {
  /**
   * The secret to attach to the target.
   */
  secret: ISecret;
}

/**
 * A secret target attachment.
 */
export class SecretTargetAttachment extends cdk.Construct {
  /**
   * The secret attached to the target.
   */
  public readonly secret: ISecret;

  constructor(scope: cdk.Construct, id: string, props: SecretTargetAttachmentProps) {
    super(scope, id);

    const attachment = new CfnSecretTargetAttachment(this, 'Resource', {
      secretId: props.secret.secretArn,
      targetId: props.targetId,
      targetType: props.targetType
    });

    // This allows to reference the secret after attachment (dependency). When
    // creating a secret for a RDS cluster or instance this is the secret that
    // will be used as the input for the rotation.
    this.secret = Secret.import(this, 'Secret', {
      secretArn: attachment.secretTargetAttachmentSecretArn,
      encryptionKey: props.secret.encryptionKey
    });
  }
}
