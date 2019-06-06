import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import ec2 = require('@aws-cdk/aws-ec2');
import iam = require('@aws-cdk/aws-iam');
import { IResource, Resource } from '@aws-cdk/cdk';
import { IEventSource } from './event-source';
import { EventSourceMapping, EventSourceMappingOptions } from './event-source-mapping';
import { CfnPermission } from './lambda.generated';
import { Permission } from './permission';

export interface IFunction extends IResource, ec2.IConnectable, iam.IGrantable {

  /**
   * Logical ID of this Function.
   */
  readonly id: string;

  /**
   * The name of the function.
   *
   * @attribute
   */
  readonly functionName: string;

  /**
   * The ARN fo the function.
   *
   * @attribute
   */
  readonly functionArn: string;

  /**
   * The IAM role associated with this function.
   */
  readonly role?: iam.IRole;

  /**
   * Whether or not this Lambda function was bound to a VPC
   *
   * If this is is `false`, trying to access the `connections` object will fail.
   */
  readonly isBoundToVpc: boolean;

  /**
   * Adds an event source that maps to this AWS Lambda function.
   * @param id construct ID
   * @param options mapping options
   */
  addEventSourceMapping(id: string, options: EventSourceMappingOptions): EventSourceMapping;

  /**
   * Adds a permission to the Lambda resource policy.
   * @param id The id ƒor the permission construct
   */
  addPermission(id: string, permission: Permission): void;

  addToRolePolicy(statement: iam.PolicyStatement): void;

  /**
   * Grant the given identity permissions to invoke this Lambda
   */
  grantInvoke(identity: iam.IGrantable): iam.Grant;

  /**
   * Return the given named metric for this Lambda
   */
  metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the Duration of this Lambda
   *
   * @default average over 5 minutes
   */
  metricDuration(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the number of invocations of this Lambda
   *
   * @default sum over 5 minutes
   */
  metricInvocations(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  /**
   * Metric for the number of throttled invocations of this Lambda
   *
   * @default sum over 5 minutes
   */
  metricThrottles(props?: cloudwatch.MetricOptions): cloudwatch.Metric;

  addEventSource(source: IEventSource): void;
}

/**
 * Represents a Lambda function defined outside of this stack.
 */
export interface FunctionAttributes {
  /**
   * The ARN of the Lambda function.
   *
   * Format: arn:<partition>:lambda:<region>:<account-id>:function:<function-name>
   */
  readonly functionArn: string;

  /**
   * The IAM execution role associated with this function.
   *
   * If the role is not specified, any role-related operations will no-op.
   */
  readonly role?: iam.IRole;

  /**
   * Id of the securityGroup for this Lambda, if in a VPC.
   *
   * This needs to be given in order to support allowing connections
   * to this Lambda.
   */
  readonly securityGroupId?: string;
}

export abstract class FunctionBase extends Resource implements IFunction  {
  /**
   * The principal this Lambda Function is running as
   */
  public abstract readonly grantPrincipal: iam.IPrincipal;

  /**
   * The name of the function.
   */
  public abstract readonly functionName: string;

  /**
   * The ARN fo the function.
   */
  public abstract readonly functionArn: string;

  /**
   * The IAM role associated with this function.
   *
   * Undefined if the function was imported without a role.
   */
  public abstract readonly role?: iam.IRole;

  /**
   * Whether the addPermission() call adds any permissions
   *
   * True for new Lambdas, false for imported Lambdas (they might live in different accounts).
   */
  protected abstract readonly canCreatePermissions: boolean;

  /**
   * Actual connections object for this Lambda
   *
   * May be unset, in which case this Lambda is not configured use in a VPC.
   * @internal
   */
  protected _connections?: ec2.Connections;

  /**
   * Adds a permission to the Lambda resource policy.
   * @param id The id ƒor the permission construct
   */
  public addPermission(id: string, permission: Permission) {
    if (!this.canCreatePermissions) {
      // FIXME: Report metadata
      return;
    }

    const principal = this.parsePermissionPrincipal(permission.principal);
    const action = permission.action || 'lambda:InvokeFunction';

    new CfnPermission(this, id, {
      action,
      principal,
      functionName: this.functionArn,
      eventSourceToken: permission.eventSourceToken,
      sourceAccount: permission.sourceAccount,
      sourceArn: permission.sourceArn,
    });
  }

  public get id() {
    return this.node.id;
  }

  public addToRolePolicy(statement: iam.PolicyStatement) {
    if (!this.role) {
      return;
    }

    this.role.addToPolicy(statement);
  }

  /**
   * Access the Connections object
   *
   * Will fail if not a VPC-enabled Lambda Function
   */
  public get connections(): ec2.Connections {
    if (!this._connections) {
      // tslint:disable-next-line:max-line-length
      throw new Error('Only VPC-associated Lambda Functions have security groups to manage. Supply the "vpc" parameter when creating the Lambda, or "securityGroupId" when importing it.');
    }
    return this._connections;
  }

  /**
   * Whether or not this Lambda function was bound to a VPC
   *
   * If this is is `false`, trying to access the `connections` object will fail.
   */
  public get isBoundToVpc(): boolean {
    return !!this._connections;
  }

  public addEventSourceMapping(id: string, options: EventSourceMappingOptions): EventSourceMapping {
    return new EventSourceMapping(this, id, {
      target: this,
      ...options
    });
  }

  /**
   * Grant the given identity permissions to invoke this Lambda
   */
  public grantInvoke(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipalOrResource({
      grantee,
      actions: ['lambda:InvokeFunction'],
      resourceArns: [this.functionArn],

      // Fake resource-like object on which to call addToResourcePolicy(), which actually
      // calls addPermission()
      resource: {
        addToResourcePolicy: (_statement) => {
          // Couldn't add permissions to the principal, so add them locally.
          const identifier = `Invoke${grantee.grantPrincipal}`; // calls the .toString() of the princpal
          this.addPermission(identifier, {
            principal: grantee.grantPrincipal!,
            action: 'lambda:InvokeFunction',
          });
        },
        node: this.node,
      },
    });
  }

  /**
   * Adds an event source to this function.
   *
   * Event sources are implemented in the @aws-cdk/aws-lambda-event-sources module.
   *
   * The following example adds an SQS Queue as an event source:
   *
   *     import { SqsEventSource } from '@aws-cdk/aws-lambda-event-sources';
   *     myFunction.addEventSource(new SqsEventSource(myQueue));
   *
   * @param source The event source to bind to this function
   */
  public addEventSource(source: IEventSource) {
    source.bind(this);
  }

  private parsePermissionPrincipal(principal?: iam.IPrincipal) {
    if (!principal) {
      return undefined;
    }
    // use duck-typing, not instance of

    if ('accountId' in principal) {
      return (principal as iam.AccountPrincipal).accountId;
    }

    if (`service` in principal) {
      return (principal as iam.ServicePrincipal).service;
    }

    throw new Error(`Invalid principal type for Lambda permission statement: ${principal.constructor.name}. ` +
      'Supported: AccountPrincipal, ServicePrincipal');
  }
}
