import * as iam from '@aws-cdk/aws-iam';
import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';
import { flinkApplicationArnComponents } from './private/example-resource-common';

export interface IFlinkApplication extends core.IResource, iam.IGrantable {
  /**
   * The application ARN.
   *
   * @attribute
   */
  readonly flinkApplicationArn: string;

  /**
   * The name of the Flink application.
   *
   * @attribute
   */
  readonly flinkApplicationName: string;

  /**
   * The application IAM role.
   */
  readonly role?: iam.IRole;

  /**
   * Convenience method for adding a policy statement to the application role.
   */
  addToRolePolicy(policyStatement: iam.PolicyStatement): boolean;
}

/**
 * Implements the functionality of the Flink applications that is shared
 * between CDK created and imported IFlinkApplications.
 */
abstract class FlinkApplicationBase extends core.Resource implements IFlinkApplication {
  public abstract readonly flinkApplicationArn: string;
  public abstract readonly flinkApplicationName: string;
  public abstract readonly role?: iam.IRole;

  // Implement iam.IGrantable interface
  public abstract readonly grantPrincipal: iam.IPrincipal;

  /** Implement the convenience {@link IFlinkApplication.addToRolePolicy} method. */
  public addToRolePolicy(policyStatement: iam.PolicyStatement): boolean {
    if (this.role) {
      this.role.addToPolicy(policyStatement);
      return true;
    }

    return false;
  }
}

/**
 * Props for creating a FlinkApplication construct.
 */
export interface FlinkApplicationProps {
  /**
   * @default - CloudFormation-generated name
   */
  readonly applicationName?: string;

  /**
   * A role to use to grant permissions to your application. Omitting this
   * property and using the default role is recommended.
   *
   * @default - a new Role will be created
   */
  readonly role?: iam.IRole;

  /**
   * Provide a RemovalPolicy to override the default.
   *
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: core.RemovalPolicy;
}

/**
 * The L2 construct for Flink Kinesis Data Applications.
 *
 * @resource AWS::KinesisAnalyticsV2::Application
 */
export class FlinkApplication extends core.Resource {
  /**
   * Import an existing Flink application, defined outside of the CDK code by name.
   */
  public static fromFlinkApplicationName(scope: Construct, id: string, flinkApplicationName: string): IFlinkApplication {
    class Import extends FlinkApplicationBase {
      // Imported flink applications have no associated role or grantPrincipal
      public readonly role = undefined;
      public readonly grantPrincipal = new iam.UnknownPrincipal({ resource: this });

      public readonly flinkApplicationName = flinkApplicationName;
      public readonly flinkApplicationArn = core.Stack.of(scope)
        .formatArn(flinkApplicationArnComponents(flinkApplicationName));
    }

    return new Import(scope, id);
  }

  public readonly flinkApplicationArn: string;
  public readonly flinkApplicationName: string;

  // Role must be optional for JSII compatibility
  public readonly role?: iam.IRole;

  public readonly grantPrincipal: iam.IPrincipal;

  constructor(scope: Construct, id: string, props: FlinkApplicationProps) {
    super(scope, id, { physicalName: props.applicationName });

    // We often add validations for properties,
    // so that customers receive feedback about incorrect properties
    // sooner than a CloudFormation deployment.
    // However, when validating string (and number!) properties,
    // it's important to remember that the value can be a CFN function
    // (think a { Ref: ParameterName } expression in CloudFormation),
    // and that sort of value would be also encoded as a string;
    // so, we need to use the Token.isUnresolved() method from the core library
    // to skip validation in that case.
    // if (props.waitConditionHandleName !== undefined &&
    //     !core.Token.isUnresolved(props.waitConditionHandleName) &&
    //     !/^[_a-zA-Z]+$/.test(props.waitConditionHandleName)) {
    //   throw new Error('waitConditionHandleName must be non-empty and contain only letters and underscores, ' +
    //     `got: '${props.waitConditionHandleName}'`);
    // }

    // If this was a real resource, we would use a specific L1 for that resource
    // (like a CfnBucket inside the Bucket class),
    // but since this is just an example,
    // we'll use CloudFormation wait conditions.

    // Remember to always, always, pass 'this' as the first argument
    // when creating any constructs inside your L2s!
    // This guarantees that they get scoped correctly,
    // and the CDK will make sure their locally-unique identifiers
    // are globally unique, which makes your L2 compose.
    const waitConditionHandle = new core.CfnWaitConditionHandle(this, 'WaitConditionHandle');

    // The 'main' L1 you create should always have the logical ID 'Resource'.
    // This is important, so that the ConstructNode.defaultChild method works correctly.
    // The local variable representing the L1 is often called 'resource' as well.
    const resource = new core.CfnWaitCondition(this, 'Resource', {
      count: 0,
      handle: waitConditionHandle.ref,
      timeout: '10',
    });

    // The resource's physical name and ARN are set using
    // some protected methods from the Resource superclass
    // that correctly resolve when your L2 is used in another resource
    // that is in a different AWS region or account than this one.
    this.flinkApplicationName = this.getResourceNameAttribute(
      // A lot of the CloudFormation resources return their physical name
      // when the Ref function is used on them.
      // If your resource is like that, simply pass 'resource.ref' here.
      // However, if Ref for your resource returns something else,
      // it's often still possible to use CloudFormation functions to get out the physical name;
      // for example, if Ref for your resource returns the ARN,
      // and the ARN for your resource is of the form 'arn:aws:<service>:<region>:<account>:resource/physical-name',
      // which is quite common,
      // you can use Fn::Select and Fn::Split to take out the part after the '/' from the ARN:
      core.Fn.select(1, core.Fn.split('/', resource.ref)),
    );
    this.flinkApplicationArn = this.getResourceArnAttribute(
      // A lot of the L1 classes have an 'attrArn' property -
      // if yours does, use it here.
      // However, if it doesn't,
      // you can often formulate the ARN yourself,
      // using the Stack.formatArn helper function.
      // Here, we assume resource.ref returns the physical name of the resource.
      core.Stack.of(this).formatArn(flinkApplicationArnComponents(resource.ref)),
      // always use the protected physicalName property for this second argument
      flinkApplicationArnComponents(this.physicalName));

    // if a role wasn't passed, create one
    const role = props.role || new iam.Role(this, 'Role', {
      // of course, fill your correct service principal here
      assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
    });
    this.role = role;
    // we need this to correctly implement the iam.IGrantable interface
    this.grantPrincipal = role;

    // this is how you apply the removal policy
    resource.applyRemovalPolicy(props.removalPolicy, {
      // this is the default to apply if props.removalPolicy is undefined
      default: core.RemovalPolicy.DESTROY,
    });
  }
}
