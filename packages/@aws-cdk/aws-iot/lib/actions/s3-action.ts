import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { kebab as toKebabCase } from 'case';
import { IAction, ActionConfig, ITopicRule } from '..';
import { singletonActionRole } from './util';

/**
 * Configuration properties of an action for s3.
 */
export interface S3ActionProps {
  /**
   * The Amazon S3 canned ACL that controls access to the object identified by the object key.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl
   * @default None
   */
  readonly cannedAcl?: s3.BucketAccessControl;
  /**
   * The path to the file where the data is written.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   *
   * @default '${topic()}/${timestamp()}'
   */
  readonly key?: string;
  /**
   * The IAM role that allows access to the S3.
   *
   * @default a new role will be created
   */
  readonly role?: iam.IRole;
}

/**
 * The action to write the data from an MQTT message to an Amazon S3 bucket.
 */
export class S3Action implements IAction {
  private readonly cannedAcl?: string;
  private readonly key?: string;
  private readonly role?: iam.IRole;

  /**
   * @param bucket The Amazon S3 bucket to which to write data.
   * @param props Optional properties to not use default
   */
  constructor(private readonly bucket: s3.IBucket, props: S3ActionProps = {}) {
    this.cannedAcl = props.cannedAcl;
    this.key = props.key;
    this.role = props.role;
  }

  bind(rule: ITopicRule): ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    role.addToPrincipalPolicy(this.putEventStatement(this.bucket));

    return {
      s3: {
        bucketName: this.bucket.bucketName,
        cannedAcl: this.cannedAcl && toKebabCase(this.cannedAcl.toString()),
        key: this.key ?? '${topic()}/${timestamp()}',
        roleArn: role.roleArn,
      },
    };
  }

  private putEventStatement(bucket: s3.IBucket) {
    return new iam.PolicyStatement({
      actions: ['s3:PutObject'],
      resources: [bucket.arnForObjects('*')],
    });
  }
}
