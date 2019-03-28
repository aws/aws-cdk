import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import metadata = require('aws-sdk/apis/metadata.json');
import path = require('path');
import { CustomResource } from './custom-resource';

/**
 * AWS SDK service metadata.
 */
export type AwsSdkMetadata = {[key: string]: any};

const awsSdkMetadata: AwsSdkMetadata = metadata;

/**
 * An AWS SDK call.
 */
export interface AwsSdkCall {
  /**
   * The service to call
   */
  readonly service: string;

  /**
   * The service action to call
   */
  readonly action: string;

  /**
   * The parameters for the service action
   */
  readonly parameters?: any;
}

export interface AwsCustomResourceProps {
  /**
   * The physical resource id of the custom resource.
   */
  readonly physicalResourceId: string;

  /**
   * The AWS SDK call to make when the resource is created.
   * At least onCreate, onUpdate or onDelete must be specified.
   *
   * @default the call when the resource is updated
   */
  readonly onCreate?: AwsSdkCall;

  /**
   * The AWS SDK call to make when the resource is updated
   *
   * @default no call
   */
  readonly onUpdate?: AwsSdkCall;

  /**
   * THe AWS SDK call to make when the resource is deleted
   *
   * @default no call
   */
  readonly onDelete?: AwsSdkCall;

  /**
   * The IAM policy statements to allow the different calls. Use only if
   * resource restriction is needed.
   *
   * @default Allow onCreate, onUpdate and onDelete calls on all resources ('*')
   */
  readonly policyStatements?: iam.PolicyStatement[];
}

export class AwsCustomResource extends cdk.Construct {
  /**
   * The physical resource id of the custom resource.
   */
  public readonly physicalResourceId: string;

  /**
   * The AWS SDK call made when the resource is created.
   */
  public readonly onCreate?: AwsSdkCall;

  /**
   * The AWS SDK call made when the resource is udpated.
   */
  public readonly onUpdate?: AwsSdkCall;

  /**
   * The AWS SDK call made when the resource is deleted.
   */
  public readonly onDelete?: AwsSdkCall;

  /**
   * The IAM policy statements used by the lambda provider.
   */
  public readonly policyStatements: iam.PolicyStatement[];

  /**
   * The custom resource making the AWS SDK calls.
   */
  private readonly customResource: CustomResource;

  constructor(scope: cdk.Construct, id: string, props: AwsCustomResourceProps) {
    super(scope, id);

    if (!props.onCreate && !props.onUpdate && !props.onDelete) {
      throw new Error('At least `onCreate`, `onUpdate` or `onDelete` must be specified.');
    }

    this.onCreate = props.onCreate || props.onUpdate;
    this.onUpdate = props.onUpdate;
    this.onDelete = props.onDelete;
    this.physicalResourceId = props.physicalResourceId;

    const fn = new lambda.SingletonFunction(this, 'Function', {
      code: lambda.Code.asset(path.join(__dirname, 'aws-custom-resource-provider')),
      runtime: lambda.Runtime.NodeJS810,
      handler: 'index.handler',
      uuid: '679f53fa-c002-430c-b0da-5b7982bd2287'
    });

    if (props.policyStatements) {
      props.policyStatements.forEach(statement => {
        fn.addToRolePolicy(statement);
      });
      this.policyStatements = props.policyStatements;
    } else { // Derive statements from AWS SDK calls
      this.policyStatements = [];

      [this.onCreate, this.onUpdate, this.onDelete].forEach(call => {
        if (call) {
          const statement = new iam.PolicyStatement()
            .addAction(awsSdkToIamAction(call.service, call.action))
            .addAllResources();
          fn.addToRolePolicy(statement); // TODO: remove duplicates?
          this.policyStatements.push(statement);
        }
      });
    }

    this.customResource = new CustomResource(this, 'Resource', {
      resourceType: 'Custom::AWS',
      lambdaProvider: fn,
      properties: {
        physicalResourceId: this.physicalResourceId,
        create: this.onCreate,
        update: this.onUpdate,
        delete: this.onDelete
      }
    });
  }

  /**
   * Returns response data for the AWS SDK call.
   * Example for S3 / listBucket : 'Buckets.0.Name'
   *
   * @param dataPath the path to the data
   */
  public getData(dataPath: string) {
    return this.customResource.getAtt(dataPath);
  }
}

/**
 * Transform SDK service/action to IAM action using metadata from aws-sdk module.
 * Example: CloudWatchLogs with putRetentionPolicy => logs:PutRetentionPolicy
 *
 * TODO: is this mapping correct for all services?
 */
function awsSdkToIamAction(service: string, action: string): string {
  const srv = service.toLowerCase();
  const iamService = awsSdkMetadata[srv].prefix || srv;
  const iamAction = action.charAt(0).toUpperCase() + action.slice(1);
  return `${iamService}:${iamAction}`;
}
