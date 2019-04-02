import iam = require('@aws-cdk/aws-iam');
import ssm = require('@aws-cdk/aws-ssm');
import cdk = require('@aws-cdk/cdk');

export interface RuntimeValueProps {
  /**
   * A namespace for the runtime value.
   * It is recommended to use the name of the library/package that advertises this value.
   */
  readonly package: string;

  /**
   * The value to advertise. Can be either a primitive value or a token.
   */
  readonly value: any;
}

/**
 * Defines a value published from construction code which needs to be accessible
 * by runtime code.
 */
export class RuntimeValue extends cdk.Construct {

  /**
   * The recommended name of the environment variable to use to set the stack name
   * from which the runtime value is published.
   */
  public static readonly ENV_NAME = 'RTV_STACK_NAME';

  /**
   * IAM actions needed to read a value from an SSM parameter.
   */
  private static readonly SSM_READ_ACTIONS = [
    'ssm:DescribeParameters',
    'ssm:GetParameters',
    'ssm:GetParameter'
  ];

  /**
   * The value to assign to the `RTV_STACK_NAME` environment variable.
   */
  public readonly envValue: string;

  /**
   * The name of the runtime parameter.
   */
  public readonly parameterName: string;

  /**
   * The ARN fo the SSM parameter used for this runtime value.
   */
  public readonly parameterArn: string;

  constructor(scope: cdk.Construct, id: string, props: RuntimeValueProps) {
    super(scope, id);

    this.parameterName = `/rtv/${this.node.stack.stackName}/${props.package}/${id}`;
    this.envValue = this.node.stack.stackName;

    new ssm.CfnParameter(this, 'Parameter', {
      name: this.parameterName,
      type: 'String',
      value: props.value,
    });

    this.parameterArn = this.node.stack.formatArn({
      service: 'ssm',
      resource: 'parameter',
      resourceName: this.parameterName
    });
  }

  /**
   * Grants a principal read permissions on this runtime value.
   * @param principal The principal (e.g. Role, User, Group)
   */
  public grantRead(principal: iam.IGrantable) {

    // sometimes "role" is optional, so we want `rtv.grantRead(role)` to be a no-op
    if (!principal) {
      return;
    }

    principal.addToPolicy(new iam.PolicyStatement()
      .addResource(this.parameterArn)
      .addActions(...RuntimeValue.SSM_READ_ACTIONS));
  }
}
