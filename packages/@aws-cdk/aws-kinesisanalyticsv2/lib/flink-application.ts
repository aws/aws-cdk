import * as iam from '@aws-cdk/aws-iam';
import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ApplicationCode } from './application-code';
import { CfnApplication } from './kinesisanalyticsv2.generated';
import { flinkApplicationArnComponents } from './private/example-resource-common';
import { PropertyGroup } from './property-group';

export interface IFlinkApplication extends core.IResource, iam.IGrantable {
  /**
   * The application ARN.
   *
   * @attribute
   */
  readonly applicationArn: string;

  /**
   * The name of the Flink application.
   *
   * @attribute
   */
  readonly applicationName: string;

  /**
   * The application IAM role.
   */
  readonly role?: iam.IRole;

  /**
   * Convenience method for adding a policy statement to the application role.
   */
  addToPrincipalPolicy(policyStatement: iam.PolicyStatement): boolean;
}

export class FlinkRuntime {
  public static FLINK_1_6 = new FlinkRuntime('FLINK-1_6');
  public static FLINK_1_8 = new FlinkRuntime('FLINK-1_8');
  public static FLINK_1_11 = new FlinkRuntime('FLINK-1_11');
  public constructor(public readonly value: string) {}
}

/**
 * Implements the functionality shared between CDK created and imported
 * IFlinkApplications.
 */
abstract class FlinkApplicationBase extends core.Resource implements IFlinkApplication {
  public abstract readonly applicationArn: string;
  public abstract readonly applicationName: string;
  public abstract readonly role?: iam.IRole;

  // Implement iam.IGrantable interface
  public abstract readonly grantPrincipal: iam.IPrincipal;

  /** Implement the convenience {@link IFlinkApplication.addToPrincipalPolicy} method. */
  public addToPrincipalPolicy(policyStatement: iam.PolicyStatement): boolean {
    if (this.role) {
      this.role.addToPrincipalPolicy(policyStatement);
      return true;
    }

    return false;
  }
}

/**
 * Props for creating a FlinkApplication construct.
 * @resource AWS::KinesisAnalyticsV2::Application
 */
export interface FlinkApplicationProps {
  /**
   * A name for your FlinkApplication that is unique to an AWS account.
   *
   * @default - CloudFormation-generated name
   */
  readonly applicationName?: string;

  /**
   * The Flink version to use for this application.
   */
  readonly runtime: FlinkRuntime;

  /**
   * The Flink code asset to run.
   */
  readonly code: ApplicationCode;

  /**
   * Whether checkpointing is enabled.
   *
   * @default true
   */
  readonly checkpointingEnabled?: boolean;

  /**
   * Configuration PropertyGroups. You can use these property groups to pass
   * arbitrary runtime configuration values to your Flink App.
   */
  readonly propertyGroups?: PropertyGroup[];

  /**
   * A role to use to grant permissions to your application. Prefer omitting
   * this property and using the default role.
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

interface Attributes {
  applicationName: string;
  applicationArn: string;
}

/**
 * The L2 construct for Flink Kinesis Data Applications.
 * @resource AWS::KinesisAnalyticsV2::Application
 * @experimental
 */
export class FlinkApplication extends FlinkApplicationBase {
  /**
   * Import an existing Flink application, defined outside of the CDK code.
   */
  public static fromAttributes(scope: Construct, id: string, attributes: Attributes): IFlinkApplication {
    class Import extends FlinkApplicationBase {
      // Imported flink applications have no associated role or grantPrincipal
      public readonly role = undefined;
      public readonly grantPrincipal = new iam.UnknownPrincipal({ resource: this });

      public readonly applicationName = attributes.applicationName;
      public readonly applicationArn = attributes.applicationArn;
    }

    return new Import(scope, id);
  }

  public readonly applicationArn: string;
  public readonly applicationName: string;

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

    this.role = props.role ?? new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('kinesisanalytics.amazonaws.com'),
    });
    this.grantPrincipal = this.role;

    const resource = new CfnApplication(this, 'Resource', {
      runtimeEnvironment: props.runtime.value,
      serviceExecutionRole: this.role.roleArn,
      applicationConfiguration: {
        applicationCodeConfiguration: props.code.bind(this),
        environmentProperties: this.environmentProperties(props.propertyGroups),
        flinkApplicationConfiguration: this.flinkApplicationConfiguration({
          checkpointingEnabled: props.checkpointingEnabled,
        }),
      },
    });

    // The resource's physical name and ARN are set using
    // some protected methods from the Resource superclass
    // that correctly resolve when your L2 is used in another resource
    // that is in a different AWS region or account than this one.
    this.applicationName = this.getResourceNameAttribute(
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
    this.applicationArn = this.getResourceArnAttribute(
      // A lot of the L1 classes have an 'attrArn' property -
      // if yours does, use it here.
      // However, if it doesn't,
      // you can often formulate the ARN yourself,
      // using the Stack.formatArn helper function.
      // Here, we assume resource.ref returns the physical name of the resource.
      core.Stack.of(this).formatArn(flinkApplicationArnComponents(resource.ref)),
      // always use the protected physicalName property for this second argument
      flinkApplicationArnComponents(this.physicalName));

    resource.applyRemovalPolicy(props.removalPolicy, {
      default: core.RemovalPolicy.DESTROY,
    });
  }

  private flinkApplicationConfiguration({ checkpointingEnabled: checkpointingEnabled }: { checkpointingEnabled?: boolean }) {
    if (checkpointingEnabled === undefined) {
      return;
    }

    return {
      checkpointConfiguration: this.checkpointConfiguration({
        checkpointingEnabled: checkpointingEnabled,
      }),
    };
  }

  private environmentProperties(propertyGroups?: PropertyGroup[]) {
    if (!propertyGroups || propertyGroups.length === 0) {
      return;
    }

    return {
      propertyGroups: propertyGroups.map(pg => pg.toCfn()),
    };
  }

  private checkpointConfiguration({ checkpointingEnabled: checkpointingEnabled }: { checkpointingEnabled?: boolean }) {
    if (checkpointingEnabled === undefined) {
      return;
    }

    return {
      checkpointingEnabled,
      configurationType: 'CUSTOM',
    };
  }
}
