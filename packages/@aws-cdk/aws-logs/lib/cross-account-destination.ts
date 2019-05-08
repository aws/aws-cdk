import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { ILogGroup } from './log-group';
import { CfnDestination } from './logs.generated';
import { ILogSubscriptionDestination, LogSubscriptionDestination } from './subscription-filter';

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
 * Log destinations can be used to subscribe a Kinesis stream in a different
 * account to a CloudWatch Subscription. A Kinesis stream in the same account
 * can be subscribed directly.
 *
 * The @aws-cdk/aws-kinesis library takes care of this automatically; you shouldn't
 * need to bother with this class.
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
    const destinationName = props.destinationName || new cdk.Token(() => this.generateUniqueName()).toString();

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
    this.policyDocument.addStatement(statement);
  }

  public logSubscriptionDestination(_sourceLogGroup: ILogGroup): LogSubscriptionDestination {
    return { arn: this.destinationArn };
  }

  /**
   * Generate a unique Destination name in case the user didn't supply one
   */
  private generateUniqueName(): string {
    // Combination of stack name and LogicalID, which are guaranteed to be unique.
    return this.node.stack.name + '-' + this.resource.logicalId;
  }

  /**
   * Return a stringified JSON version of the PolicyDocument
   */
  private lazyStringifiedPolicyDocument(): string {
    return new cdk.Token(() => this.policyDocument.isEmpty ? '' : this.node.stringifyJson(this.policyDocument)).toString();
  }
}
