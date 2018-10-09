import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { LogGroupRef } from './log-group';
import { cloudformation } from './logs.generated';
import { ILogSubscriptionDestination, LogSubscriptionDestination } from './subscription-filter';

export interface CrossAccountDestinationProps {
  /**
   * The name of the log destination.
   *
   * @default Automatically generated
   */
  destinationName?: string;

  /**
   * The role to assume that grants permissions to write to 'target'.
   *
   * The role must be assumable by 'logs.{REGION}.amazonaws.com'.
   */
  role: iam.Role;

  /**
   * The log destination target's ARN
   */
  targetArn: string;
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
  public readonly policyDocument: cdk.PolicyDocument = new cdk.PolicyDocument();

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
  private readonly resource: cloudformation.DestinationResource;

  constructor(parent: cdk.Construct, id: string, props: CrossAccountDestinationProps) {
    super(parent, id);

    // In the underlying model, the name is not optional, but we make it so anyway.
    const destinationName = props.destinationName || new cdk.Token(() => this.generateUniqueName());

    this.resource = new cloudformation.DestinationResource(this, 'Resource', {
      destinationName,
      // Must be stringified policy
      destinationPolicy: new cdk.Token(() => this.stringifiedPolicyDocument()),
      roleArn: props.role.roleArn,
      targetArn: props.targetArn
    });

    this.destinationArn = this.resource.destinationArn;
    this.destinationName = this.resource.destinationName;
  }

  public addToPolicy(statement: cdk.PolicyStatement) {
    this.policyDocument.addStatement(statement);
  }

  public logSubscriptionDestination(_sourceLogGroup: LogGroupRef): LogSubscriptionDestination {
    return { arn: this.destinationArn };
  }

  /**
   * Generate a unique Destination name in case the user didn't supply one
   */
  private generateUniqueName(): string {
    // Combination of stack name and LogicalID, which are guaranteed to be unique.
    const stack = cdk.Stack.find(this);
    return stack.name + '-' + this.resource.logicalId;
  }

  /**
   * Return a stringified JSON version of the PolicyDocument
   */
  private stringifiedPolicyDocument() {
    return this.policyDocument.isEmpty ? '' : cdk.CloudFormationJSON.stringify(cdk.resolve(this.policyDocument));
  }
}
