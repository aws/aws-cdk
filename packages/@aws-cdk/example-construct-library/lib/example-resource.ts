/*
 * We always import other construct libraries entirely with a prefix -
 * we never import individual classes from them without a qualifier
 * (the prefix makes it more obvious where a given dependency comes from,
 * and prevents conflicting names causing issues).
 * Our linter also enforces ES6-style imports -
 * we don't use TypeScript's import a = require('a') imports.
 */
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';
// for files that are part of this package, we do import individual classes or functions
import { exampleResourceArnComponents } from './private/example-resource-common';

/**
 * The interface that represents the ExampleResource resource.
 * We always use an interface, because each L2 resource type in the CDK can occur in two aspects:
 *
 *   1. It can be a resource that's created and managed by the CDK.
 *     Those resources are represented by the class with the name identical to the resource -
 *     `ExampleResource` in our case, which implements `IExampleResource`.
 *   2. It can be a resource that exists already, and is not managed by the CDK code,
 *     but needs to be referenced in your infrastructure definition code.
 *     Those kinds of instances are returned from static `fromXyz(Name/Arn/Attributes)` methods -
 *     in our case, the `ExampleResource.fromExampleResourceName` method.
 *     In general, those kinds of resources do not allow any sort of mutating operations to be performed on them
 *     (the exception is when they can be changed by creating a different resource -
 *     IAM Roles, which you can attach multiple IAM Policies to,
 *     are the canonical example of this sort of resource),
 *     as they are not part of the CloudFormation stack that is created by the CDK.
 *
 *  So, an interface like `IExampleResource` represents a resource that *might* be mutable,
 *  while the `ExampleResource` class represents a resource that definitely is mutable.
 *  Whenever a type that represents this resource needs to referenced in other code,
 *  you want to use `IExampleResource` as the type, not `ExampleResource`.
 *
 *  The interface for the resource should have at least 2 (readonly) properties
 *  that represent the ARN and the physical name of the resource -
 *  in our example, those are `exampleResourceArn` and `exampleResourceName`.
 *
 *  The interface defines the behaviors the resource exhibits.
 *  Common behaviors are:
 *    - `addToRolePolicy` for resources that are tied to an IAM Role
 *    - grantXyz() methods (represented by `grantRead` in this example)
 *    - onXyz() CloudWatch Events methods (represented by `onEvent` in this example)
 *    - metricXyz() CloudWatch Metric methods (represented by `metricCount` in this example)
 *
 *  Of course, other behaviors are possible -
 *  it all depends on the capabilities of the underlying resource that is being modeled.
 *
 *  This interface must always extend the IResource interface from the core module.
 *  It can also extend some other common interfaces that add various default behaviors -
 *  some examples are shown below.
 */
export interface IExampleResource extends
  // all L2 interfaces need to extend IResource
  core.IResource,

  // Only for resources that have an associated IAM Role.
  // Allows this resource to be the target in calls like bucket.grantRead(exampleResource).
  iam.IGrantable,

  // only for resources that are in a VPC and have SecurityGroups controlling their traffic
  ec2.IConnectable {

  /**
   * The ARN of example resource.
   * Equivalent to doing `{ 'Fn::GetAtt': ['LogicalId', 'Arn' ]}`
   * in CloudFormation if the underlying CloudFormation resource
   * surfaces the ARN as a return value -
   * if not, we usually construct the ARN "by hand" in the construct,
   * using the Fn::Join function.
   *
   * It needs to be annotated with '@attribute' if the underlying CloudFormation resource
   * surfaces the ARN as a return value.
   *
   * @attribute
   */
  readonly exampleResourceArn: string;

  /**
   * The physical name of the example resource.
   * Often, equivalent to doing `{ 'Ref': 'LogicalId' }`
   * (but not always - depends on the particular resource modeled)
   * in CloudFormation.
   * Also needs to be annotated with '@attribute'.
   *
   * @attribute
   */
  readonly exampleResourceName: string;

  /**
   * For resources that have an associated IAM Role,
   * surface that Role as a property,
   * so that other classes can add permissions to it.
   * Make it optional,
   * as resources imported with `ExampleResource.fromExampleResourceName`
   * will not have this set.
   */
  readonly role?: iam.IRole;

  /**
   * For resources that have an associated IAM Role,
   * surface a method that allows you to conditionally
   * add a statement to that Role if it's known.
   * This is just a convenience,
   * so that clients of your interface don't have to check `role` for null.
   * Many such methods in the CDK return void;
   * you can also return a boolean indicating whether the permissions were in fact added
   * (so, when `role` is not null).
   */
  addToRolePolicy(policyStatement: iam.PolicyStatement): boolean;

  /**
   * An example of a method that grants the given IAM identity
   * permissions to this resource
   * (in this case - read permissions).
   */
  grantRead(identity: iam.IGrantable): iam.Grant;

  /**
   * Add a CloudWatch rule that will use this resource as the source of events.
   * Resources that emit events have a bunch of methods like these,
   * that allow different resources to be triggered on various events happening to this resource
   * (like item added, item updated, item deleted, ect.) -
   * exactly which methods you need depends on the resource you're modeling.
   */
  onEvent(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Standard method that allows you to capture metrics emitted by this resource,
   * and use them in dashboards and alarms.
   * The details of which metric methods you should have of course depends on the
   * resource that is being modeled.
   */
  metricCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}

/**
 * A common abstract superclass that implements the `IExampleResource` interface.
 * We often have these classes to share code between the `ExampleResource`
 * class and the `IExampleResource` instances returned from methods like
 * `ExampleResource.fromExampleResourceName`.
 * It has to extend the Resource class from the core module.
 *
 * Notice that the class is not exported - it's not part of the public API of this module!
 */
abstract class ExampleResourceBase extends core.Resource implements IExampleResource {
  // these stay abstract at this level
  public abstract readonly exampleResourceArn: string;
  public abstract readonly exampleResourceName: string;
  public abstract readonly role?: iam.IRole;
  // this property is needed for the iam.IGrantable interface
  public abstract readonly grantPrincipal: iam.IPrincipal;
  // This is needed for the ec2.IConnectable interface.
  // Allow subclasses to write this field.
  // JSII requires all member starting with an underscore to be annotated with '@internal'.
  /** @internal */
  protected _connections: ec2.Connections | undefined;

  /** Implement the ec2.IConnectable interface, using the _connections field. */
  public get connections(): ec2.Connections {
    if (!this._connections) {
      throw new Error('An imported ExampleResource cannot manage its security groups');
    }
    return this._connections;
  }

  /** Implement the convenience `IExampleResource.addToRolePolicy` method. */
  public addToRolePolicy(policyStatement: iam.PolicyStatement): boolean {
    if (this.role) {
      this.role.addToPrincipalPolicy(policyStatement);
      return true;
    } else {
      return false;
    }
  }

  /** Implement the `IExampleResource.grantRead` method. */
  public grantRead(identity: iam.IGrantable): iam.Grant {
    // usually, we would grant some service-specific permissions here,
    // but since this is just an example, let's use S3
    return iam.Grant.addToPrincipal({
      grantee: identity,
      actions: ['s3:Get*'], // as many actions as you need
      resourceArns: [this.exampleResourceArn],
    });
  }

  /**
   * Implement the `IExampleResource.onEvent` method.
   * Notice that we change 'options' from an optional argument to an argument with a default value -
   * that's a common trick in the CDK
   * (you're not allowed to have default values for arguments in interface methods in TypeScript),
   * as it simplifies the implementation code (less branching).
   */
  public onEvent(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = new events.Rule(this, id, options);
    rule.addTarget(options.target);
    rule.addEventPattern({
      // obviously, you would put your resource-specific values here
      source: ['aws.cloudformation'],
      detail: {
        'example-resource-name': [this.exampleResourceName],
      },
    });
    return rule;
  }

  /** Implement the `IExampleResource.metricCount` method. */
  public metricCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      // of course, you would put your resource-specific values here
      namespace: 'AWS/ExampleResource',
      metricName: 'Count',
      dimensionsMap: { ExampleResource: this.exampleResourceName },
      ...props,
    }).attachTo(this);
  }
}

/**
 * Construction properties for `ExampleResource`.
 * All constructs have the same construction pattern:
 * you provide a scope of type Construct,
 * a string identifier, and a third argument,
 * representing the properties specific to that resource.
 * That third type is represented in the CDK by an interface
 * with only readonly simple properties (no methods),
 * sometimes called, in JSII terminology, a 'struct'.
 * This is this struct for the `ExampleResource` class.
 *
 * This interface is always called '<ResourceName>Props'.
 */
export interface ExampleResourceProps {
  /**
   * The physical name of the resource.
   * If you don't provide one, CloudFormation will generate one for you.
   * Almost all resources, with only a few exceptions,
   * allow setting their physical name.
   * The name is a little silly,
   * because of the @resource annotation on the `ExampleResource` class
   * (CDK linters make sure those two names are aligned).
   *
   * @default - CloudFormation-generated name
   */
  readonly waitConditionHandleName?: string;

  /**
   * Many resources require an IAM Role to function.
   * While a customer can provide one,
   * the CDK will always create a new one
   * (with the correct assumeRole service principal) if it wasn't provided.
   *
   * @default - a new Role will be created
   */
  readonly role?: iam.IRole;

  /**
   * Many resources allow passing in an optional S3 Bucket.
   * Buckets can also have KMS Keys associated with them,
   * so any encryption settings in your resource should check
   * for the presence of that property on the passed Bucket.
   *
   * @default - no Bucket will be used
   */
  readonly bucket?: s3.IBucket;

  /**
   * Many resources can be attached to a VPC.
   * If your resource cannot function without a VPC,
   * make this property required -
   * do NOT make it optional, and then create a VPC implicitly!
   * This is different than what we do for IAM Roles, for example.
   *
   * @default - no VPC will be used
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Whenever you have IVpc as a property,
   * like we have in `vpc`,
   * you need to provide an optional property of type ec2.SubnetSelection,
   * which can be used to specify which subnets of the VPC should the resource use.
   * The default is usually all private subnets,
   * however you can change that default in your resource if it makes sense
   * (for example, to all public subnets).
   *
   * @default - default subnet selection strategy, see the EC2 module for details
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * If your resource interface extends ec2.IConnectable,
   * that means it needs security groups to control traffic coming to and from it.
   * Allow the customer to specify these security groups.
   * If none were specified, we will create a new one implicitly,
   * similarly like we do for IAM Roles.
   *
   * **Note**: a few resources in the CDK only allow you to provide a single SecurityGroup.
   * This is generally considered a historical mistake,
   * and all new code should allow an array of security groups to be passed.
   *
   * @default - a new security group will be created
   */
  readonly securityGroups?: ec2.ISecurityGroup[];

  /**
   * What to do when this resource is deleted from a stack.
   * Some stateful resources cannot be deleted if they have any contents
   * (S3 Buckets are the canonical example),
   * so we set their deletion policy to RETAIN by default.
   * If your resource also behaves like that,
   * you need to allow your customers to override this behavior if they need to.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: core.RemovalPolicy;
}

/**
 * The actual L2 class for the ExampleResource.
 * Extends ExampleResourceBase.
 * Represents a resource completely managed by the CDK, and thus mutable.
 * You can add additional methods to the public API of this class not present in `IExampleResource`,
 * although you should strive to minimize that as much as possible,
 * and have the entire API available in `IExampleResource`
 * (but perhaps some of it not having any effect,
 * like `IExampleResource.addToRolePolicy`).
 *
 * Usually, the CDK is able to figure out what's the equivalent CloudFormation resource for this L2,
 * but sometimes (like in this example), we need to specify it explicitly.
 * You do it with the '@resource' annotation:
 *
 * @resource AWS::CloudFormation::WaitConditionHandle
 */
export class ExampleResource extends ExampleResourceBase {
  /**
   * Reference an existing ExampleResource,
   * defined outside of the CDK code, by name.
   *
   * The class might contain more methods for referencing an existing resource,
   * like fromExampleResourceArn,
   * or fromExampleResourceAttributes
   * (the last one if you want the importing behavior to be more customizable).
   */
  public static fromExampleResourceName(scope: Construct, id: string, exampleResourceName: string): IExampleResource {
    // Imports are almost always implemented as a module-private
    // inline class in the method itself.
    // We extend ExampleResourceBase to reuse all of the logic inside it.
    class Import extends ExampleResourceBase {
      // we don't have an associated Role in this case
      public readonly role = undefined;
      // for imported resources, you always use the UnknownPrincipal,
      // which ignores all modifications
      public readonly grantPrincipal = new iam.UnknownPrincipal({ resource: this });

      public readonly exampleResourceName = exampleResourceName;
      // Since we have the name, we have to generate the ARN,
      // using the Stack.formatArn helper method from the core library.
      // We have to know the ARN components of ExampleResource in a few places, so,
      // to avoid duplication, extract that into a module-private function
      public readonly exampleResourceArn = core.Stack.of(scope)
        .formatArn(exampleResourceArnComponents(exampleResourceName));
    }

    return new Import(scope, id);
  }

  // implement all fields that are abstract in ExampleResourceBase
  public readonly exampleResourceArn: string;
  public readonly exampleResourceName: string;
  // while we know 'role' will actually never be undefined in this class,
  // JSII does not allow changing the optionality of a field
  // when overriding it, so it has to be 'role?'
  public readonly role?: iam.IRole;
  public readonly grantPrincipal: iam.IPrincipal;

  /**
   * The constructor of a construct has always 3 arguments:
   * the parent Construct, the string identifier,
   * locally unique within the scope of the parent,
   * and a properties struct.
   *
   * If the props only have optional properties, like in our case,
   * make sure to add a default value of an empty object to the props argument.
   */
  constructor(scope: Construct, id: string, props: ExampleResourceProps = {}) {
    // Call the constructor from Resource superclass,
    // which attaches this construct to the construct tree.
    super(scope, id, {
      // You need to let the Resource superclass know which of your properties
      // signifies the resource's physical name.
      // If your resource doesn't have a physical name,
      // don't set this property.
      // For more information on what exactly is a physical name,
      // see the CDK guide: https://docs.aws.amazon.com/cdk/latest/guide/resources.html#resources_physical_names
      physicalName: props.waitConditionHandleName,
    });

    // We often add validations for properties,
    // so that customers receive feedback about incorrect properties
    // sooner than a CloudFormation deployment.
    // However, when validating string (and number!) properties,
    // it's important to remember that the value can be a CFN function
    // (think a { Ref: ParameterName } expression in CloudFormation),
    // and that sort of value would be also encoded as a string;
    // so, we need to use the Token.isUnresolved() method from the core library
    // to skip validation in that case.
    if (props.waitConditionHandleName !== undefined &&
        !core.Token.isUnresolved(props.waitConditionHandleName) &&
        !/^[_a-zA-Z]+$/.test(props.waitConditionHandleName)) {
      throw new Error('waitConditionHandleName must be non-empty and contain only letters and underscores, ' +
        `got: '${props.waitConditionHandleName}'`);
    }

    // Inside the implementation of the L2,
    // we very often use L1 classes (those whose names begin with 'Cfn').
    // However, it's important we don't 'leak' that fact to the API of the L2 class -
    // so, we should never take L1 types as inputs in our props,
    // and we should not surface any L1 classes in public fields or methods of the class.
    // The 'Cfn*' class is purely an implementation detail.

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
    this.exampleResourceName = this.getResourceNameAttribute(
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
    this.exampleResourceArn = this.getResourceArnAttribute(
      // A lot of the L1 classes have an 'attrArn' property -
      // if yours does, use it here.
      // However, if it doesn't,
      // you can often formulate the ARN yourself,
      // using the Stack.formatArn helper function.
      // Here, we assume resource.ref returns the physical name of the resource.
      core.Stack.of(this).formatArn(exampleResourceArnComponents(resource.ref)),
      // always use the protected physicalName property for this second argument
      exampleResourceArnComponents(this.physicalName));

    // if a role wasn't passed, create one
    const role = props.role || new iam.Role(this, 'Role', {
      // of course, fill your correct service principal here
      assumedBy: new iam.ServicePrincipal('cloudformation.amazonaws.com'),
    });
    this.role = role;
    // we need this to correctly implement the iam.IGrantable interface
    this.grantPrincipal = role;

    // implement the ec2.IConnectable interface,
    // by writing to the _connections field in ExampleResourceBase,
    // if a VPC was passed in props
    if (props.vpc) {
      const securityGroups = (props.securityGroups ?? []).length === 0
        // no security groups were provided - create one
        ? [new ec2.SecurityGroup(this, 'SecurityGroup', {
          vpc: props.vpc,
        })]
        : props.securityGroups;
      this._connections = new ec2.Connections({ securityGroups });

      // this is how you would use the VPC inputs to fill a subnetIds property of an L1:
      new ec2.CfnVPCEndpoint(this, 'VpcEndpoint', {
        vpcId: props.vpc.vpcId,
        serviceName: 'ServiceName',
        subnetIds: props.vpc.selectSubnets(props.vpcSubnets).subnetIds,
      });
    }

    // this is how you apply the removal policy
    resource.applyRemovalPolicy(props.removalPolicy, {
      // this is the default to apply if props.removalPolicy is undefined
      default: core.RemovalPolicy.RETAIN,
    });
  }
}
