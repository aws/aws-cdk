import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Construct, Lazy, Stack } from '@aws-cdk/cdk';
import { ILogGroup } from './log-group';
import { CfnDestination } from './logs.generated';
import { ILogSubscriptionDestination, LogSubscriptionDestinationConfig } from './subscription-filter';

/**
 * Properties for a CrossAccountDestination
 */
export interface CrossAccountDestinationProps {
  /**
   * The name of the log destination.
   *
   * @default Automatically generated
   */
  readonly destinationName?: string;

  /**
   * The role to assume that grants permissions to write to 'target'.
   *
   * The role must be assumable by 'logs.{REGION}.amazonaws.com'.
   */
  readonly role: iam.IRole;

  /**
   * The log destination target's ARN
   */
  readonly targetArn: string;
}

/**
 * A new CloudWatch Logs Destination for use in cross-account scenarios
 *
 * CrossAccountDestinations are used to subscribe a Kinesis stream in a
 * different account to a CloudWatch Subscription.
 *
 * Consumers will hardly ever need to use this class. Instead, directly
 * subscribe a Kinesis stream using the integration class in the
 * `@aws-cdk/aws-logs-destinations` package; if necessary, a
 * `CrossAccountDestination` will be created automatically.
 */
export class CrossAccountDestination extends cdk.Construct implements ILogSubscriptionDestination {
  /**
   * Policy object of this CrossAccountDestination object
   */
  public readonly policyDocument: iam.PolicyDocument = new iam.PolicyDocument();

  /**
   * The name of this CrossAccountDestination object
   */
  public readonly destinationName: string;

  /**
   * The ARN of this CrossAccountDestination object
   */
  public readonly destinationArn: string;

  /**
   * The inner resource
   */
  private readonly resource: CfnDestination;

  constructor(scope: cdk.Construct, id: string, props: CrossAccountDestinationProps) {
    super(scope, id);

    // In the underlying model, the name is not optional, but we make it so anyway.
    const destinationName = props.destinationName || Lazy.stringValue({ produce: () => this.generateUniqueName() });

    this.resource = new CfnDestination(this, 'Resource', {
      destinationName,
      // Must be stringified policy
      destinationPolicy: this.lazyStringifiedPolicyDocument(),
      roleArn: props.role.roleArn,
      targetArn: props.targetArn
    });

    this.destinationArn = this.resource.destinationArn;
    this.destinationName = this.resource.destinationName;
  }

  public addToPolicy(statement: iam.PolicyStatement) {
    this.policyDocument.addStatements(statement);
  }

  public bind(_scope: Construct, _sourceLogGroup: ILogGroup): LogSubscriptionDestinationConfig {
    return { arn: this.destinationArn };
  }

  /**
   * Generate a unique Destination name in case the user didn't supply one
   */
  private generateUniqueName(): string {
    // Combination of stack name and LogicalID, which are guaranteed to be unique.
    return Stack.of(this).stackName + '-' + this.resource.logicalId;
  }

  /**
   * Return a stringified JSON version of the PolicyDocument
   */
  private lazyStringifiedPolicyDocument(): string {
    return Lazy.stringValue({ produce: () =>
      this.policyDocument.isEmpty ? '' : Stack.of(this).toJsonString(this.policyDocument)
    });
  }
}
