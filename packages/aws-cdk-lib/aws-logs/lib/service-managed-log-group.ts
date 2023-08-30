import * as path from 'path';
import { Construct, IConstruct } from 'constructs';
import { BaseLogGroupProps, ILogGroup } from './log-group';
import { LogGroupBase } from './log-group-base';
import { validateLogGroupRetention } from './private/util';
import * as iam from '../../aws-iam';
import * as s3_assets from '../../aws-s3-assets';
import * as cdk from '../../core';

const SERVICE_MANAGED_LOG_GROUP_TYPE = 'Custom::ServiceManagedLogGroup';
const SERVICE_MANAGED_LOG_GROUP_TAG = 'aws-cdk:service-managed-log-group';

/**
 * Properties for ServiceManagedLogGroup
 */
export interface ServiceManagedLogGroupProps extends BaseLogGroupProps {}

/**
 * Options for binding a ServiceManagedLogGroup to its parent
 */
export interface ServiceManagedLogGroupBindOptions {
  /**
   * The arn of the log group
   */
  readonly logGroupArn: string;

  /**
   * The resource owning the log group.
   */
  readonly parent: IConstruct;

  /**
   * Configuration for tagging the parent resource
   */
  readonly tagging: ServiceManagedLogGroupTaggingConfig;
}

/**
 * Tagging config for retrieving tags from the owning resource
 */
export interface ServiceManagedLogGroupTaggingConfig {
  /**
   * The service managing the log group
   */
  readonly service: string;
  /**
   * The API action used to retrieve tags
   */
  readonly action: string;
  /**
   * The request field in dot notation to pass the resource name
   * @default "Resource"
   */
  readonly requestField?: string;
  /**
   * The response field in dot notation that will contain the list of tags
   * @default "Tags"
   */
  readonly responseField?: string;
  /**
   * Additional permissions given to the custom resource function to query tags
   * @default "[]"
   */
  readonly permissions?: string[];
}

/**
 * A CloudWatch Log Group that is created and managed by another service
 *
 * With this construct, the Log Group configuration can be changed anyway.
 * You must call `bind()` on the ServiceManagedLogGroup, to connect it with the parent resource.
 *
 * @resource AWS::Logs::LogGroup
 */
export class ServiceManagedLogGroup extends LogGroupBase implements ILogGroup {
  public readonly logGroupArn: string;
  public readonly logGroupName: string;

  /**
   * Tags for the LogGroup.
   */
  public readonly tags: cdk.TagManager = new cdk.TagManager(cdk.TagType.KEY_VALUE, 'AWS::Logs::LogGroup');

  private provider: ServiceManagedLogGroupFunction;
  private props: BaseLogGroupProps;
  private _logGroupArn?: string;

  constructor(scope: Construct, id: string, props: ServiceManagedLogGroupProps = {}) {
    super(scope, id);

    this.props = {
      ...props,
      retention: validateLogGroupRetention(props.retention),
    };

    this.logGroupArn = cdk.Lazy.string({
      produce: () => this._logGroupArn + ':*',
    });
    this.logGroupName = cdk.Lazy.string({
      produce: () => cdk.Stack.of(this).splitArn(this._logGroupArn!, cdk.ArnFormat.COLON_RESOURCE_NAME).resourceName,
    });

    // Custom resource provider
    this.provider = this.ensureSingletonProviderFunction();
  }

  /**
   * Helper method to ensure that only one instance of the provider function resources is in the stack.
   * Mimicking the behavior of @aws-cdk/aws-lambda's SingletonFunction to prevent circular dependencies.
   */
  private ensureSingletonProviderFunction() {
    const functionLogicalId = 'ServiceManagedLogGroup' + 'f0360f7393ea41069d5f706d30f37fa7';
    const existing = cdk.Stack.of(this).node.tryFindChild(functionLogicalId);
    if (existing) {
      return existing as ServiceManagedLogGroupFunction;
    }
    return new ServiceManagedLogGroupFunction(cdk.Stack.of(this), functionLogicalId);
  }

  /**
   * Bind
   */
  public bind(options: ServiceManagedLogGroupBindOptions) {
    this._logGroupArn = options.logGroupArn;

    const resource = new cdk.CfnResource(this, 'Resource', {
      type: SERVICE_MANAGED_LOG_GROUP_TYPE,
      properties: {
        ServiceToken: this.provider.functionArn,
        LogGroupName: this.logGroupName,
        LogGroupRegion: cdk.Lazy.string({
          produce: () => cdk.Stack.of(this).splitArn(this._logGroupArn!, cdk.ArnFormat.COLON_RESOURCE_NAME).region,
        }),
        DataProtectionPolicy: this.props.dataProtectionPolicy?._bind(this),
        KmsKeyId: this.props.encryptionKey?.keyArn,
        RetentionInDays: this.props.retention,
        Tags: this.tags.renderedTags,
        Tagging: options.tagging,
        RemovalPolicy: this.props.removalPolicy,
      },
    });
    resource.applyRemovalPolicy(this.props.removalPolicy);

    // Grant required permissions to the provider function, depending on used features
    if (this.props.encryptionKey) {
      this.provider.grantEncryption(this._logGroupArn);
    }
    if (this.props.dataProtectionPolicy) {
      this.provider.grantDataProtectionPolicy(this._logGroupArn);
    }
    if (this.props.removalPolicy === cdk.RemovalPolicy.DESTROY) {
      this.provider.grantDelete(this._logGroupArn);
    }
    // We don't know ahead of time if tags are going to be set
    this.provider.grantTags(this._logGroupArn);

    // We also tag the parent resource to record the fact that we are updating the log group
    // The custom resource will check this tag before delete the log group
    // Because tagging and untagging will ALWAYS happen before the CR is deleted,
    // we can remove the construct, without the deleting the log group  as a side effect.
    if (cdk.Resource.isOwnedResource(options.parent)) {
      cdk.Tags.of(options.parent.node.defaultChild!).add(SERVICE_MANAGED_LOG_GROUP_TAG, 'true');
    }
  }
}

/**
 * The lambda function backing the custom resource
 */
class ServiceManagedLogGroupFunction extends Construct implements cdk.ITaggable {
  public readonly functionArn: cdk.Reference;

  public readonly tags: cdk.TagManager = new cdk.TagManager(cdk.TagType.KEY_VALUE, 'AWS::Lambda::Function');

  private readonly role: iam.IRole;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const asset = new s3_assets.Asset(this, 'Code', {
      path: path.join(__dirname, 'service-managed-log-group-provider'),
    });

    const role = new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
    });

    // Special permissions for log retention
    // Using '*' here because we will also put a retention policy on
    // the log group of the provider function.
    // Referencing its name creates a CF circular dependency.
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:PutRetentionPolicy', 'logs:DeleteRetentionPolicy'],
      resources: ['*'],
    }));

    this.role = role;

    // Lambda function
    const resource = new cdk.CfnResource(this, 'Resource', {
      type: 'AWS::Lambda::Function',
      properties: {
        Handler: 'index.handler',
        Runtime: 'nodejs18.x',
        Code: {
          S3Bucket: asset.s3BucketName,
          S3Key: asset.s3ObjectKey,
        },
        Role: role.roleArn,
        Tags: this.tags.renderedTags,
      },
    });
    this.functionArn = resource.getAtt('Arn');

    asset.addResourceMetadata(resource, 'Code');

    // Function dependencies
    role.node.children.forEach((child) => {
      if (cdk.CfnResource.isCfnResource(child)) {
        resource.addDependency(child);
      }
      if (Construct.isConstruct(child) && child.node.defaultChild && cdk.CfnResource.isCfnResource(child.node.defaultChild)) {
        resource.addDependency(child.node.defaultChild);
      }
    });
  }

  /**
   * @internal
   */
  public grantDataProtectionPolicy(logGroupArn: string) {
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:PutDataProtectionPolicy', 'logs:DeleteDataProtectionPolicy'],
      resources: [`${logGroupArn}:*`],
    }));
  }

  /**
   * @internal
   */
  public grantEncryption(logGroupArn: string) {
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:AssociateKmsKey', 'logs:DisassociateKmsKey'],
      resources: [`${logGroupArn}:*`],
    }));
  }

  /**
   * @internal
   */
  public grantTags(logGroupArn: string) {
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: [
        'logs:ListTagsForResource',
        'logs:TagResource',
        'logs:UntagResource',
      ],
      resources: [logGroupArn],
    }));
  }

  /**
   * @internal
   */
  public grantDelete(logGroupArn: string) {
    this.role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['logs:DeleteLogGroup'],
      resources: [`${logGroupArn}:*`],
    }));
  }
}
