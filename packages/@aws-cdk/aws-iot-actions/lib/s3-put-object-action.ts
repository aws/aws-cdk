import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as s3 from '@aws-cdk/aws-s3';
import { kebab as toKebabCase } from 'case';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for s3.
 */
export interface S3PutObjectActionProps extends CommonActionProps {
  /**
   * The Amazon S3 canned ACL that controls access to the object identified by the object key.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl
   *
   * @default None
   */
  readonly accessControl?: s3.BucketAccessControl;

  /**
   * The path to the file where the data is written.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   *
   * @default '${topic()}/${timestamp()}'
   */
  readonly key?: string;
}

/**
 * The action to write the data from an MQTT message to an Amazon S3 bucket.
 */
export class S3PutObjectAction implements iot.IAction {
  private readonly accessControl?: string;
  private readonly key?: string;
  private readonly role?: iam.IRole;

  /**
   * @param bucket The Amazon S3 bucket to which to write data.
   * @param props Optional properties to not use default
   */
  constructor(private readonly bucket: s3.IBucket, props: S3PutObjectActionProps = {}) {
    this.accessControl = props.accessControl;
    this.key = props.key;
    this.role = props.role;
  }

  /**
   * @internal
   */
  public _bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['s3:PutObject'],
      resources: [this.bucket.arnForObjects('*')],
    }));

    return {
      configuration: {
        s3: {
          bucketName: this.bucket.bucketName,
          cannedAcl: this.accessControl && toKebabCase(this.accessControl.toString()),
          key: this.key ?? '${topic()}/${timestamp()}',
          roleArn: role.roleArn,
        },
      },
    };
  }
}
