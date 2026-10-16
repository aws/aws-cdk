import type { Construct } from 'constructs';
import { CfnNetworkConnector } from './lambda.generated';
import type * as ec2 from '../../aws-ec2';
import * as iam from '../../aws-iam';
import type { IResource } from '../../core';
import { Annotations, Arn, ArnFormat, Resource, Stack, Token, UnscopedValidationError, ValidationError } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { INetworkConnectorRef, NetworkConnectorReference } from '../../interfaces/generated/aws-lambda-interfaces.generated';

/**
 * A Lambda Network Connector.
 */
// Deliberately not `ec2.IConnectable`: an imported connector (`fromNetworkConnectorArn`) does
// not know its security groups, so the interface cannot promise `connections` without another
// throwing getter. If demand shows up, adding `connections` to the class alone is additive.
export interface INetworkConnector extends IResource, INetworkConnectorRef {
  /**
   * The unqualified ARN of the network connector.
   *
   * Identifies the connector as a whole, across its versions: use it in IAM policies and for
   * consumers that resolve the current version at run time. It does not name a version, so
   * WebFunction — which pins a revision to one version — does not accept it.
   *
   * @attribute
   */
  readonly networkConnectorArn: string;

  /**
   * The qualified ARN of the connector's latest version.
   *
   * WebFunction pins a revision to this. For a connector defined in this app the value changes
   * on every update to the connector, which replaces the revision that references it.
   *
   * @attribute
   */
  readonly latestVersionArn: string;
}

/**
 * The compute resource type a network connector is provisioned for.
 *
 * A connector serves exactly one type; a WebFunction can only use a connector created for
 * `WEB_FUNCTION`.
 */
export enum NetworkConnectorComputeType {
  /** Lambda WebFunction. */
  WEB_FUNCTION = 'WebFunction',

  /** Lambda MicroVM. */
  MICRO_VM = 'MicroVm',
}

/**
 * The IP protocol the connector's network interfaces use.
 */
export enum NetworkProtocol {
  /** IPv4 only. */
  IPV4 = 'IPv4',

  /** IPv4 and IPv6. */
  DUAL_STACK = 'DualStack',
}

/**
 * Configuration for a connector that gives the compute egress into a VPC.
 */
export interface VpcEgressConfiguration {
  /**
   * The Lambda compute resource type this connector serves.
   *
   * The compute type cannot be changed after the connector is created.
   */
  readonly computeType: NetworkConnectorComputeType;

  /**
   * The VPC to create network interfaces in.
   */
  readonly vpc: ec2.IVpc;

  /**
   * Which subnets of the VPC to create network interfaces in.
   *
   * The selection must yield between 1 and 16 subnets.
   *
   * @default - the VPC's default selection: its private subnets, if it has any
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * The security groups to attach to the network interfaces.
   *
   * Between 1 and 5 security groups, in the same VPC as the subnets. At least one is required,
   * so the interfaces never fall back to the VPC's default security group. The connector only
   * initiates connections, so inbound rules are irrelevant; the outbound rules decide what the
   * compute can reach.
   */
  readonly securityGroups: ec2.ISecurityGroupRef[];

  /**
   * The IP protocol the network interfaces use.
   *
   * The protocol cannot be changed after the connector is created.
   *
   * @default NetworkProtocol.IPV4
   */
  readonly networkProtocol?: NetworkProtocol;
}

/**
 * The network configuration of a connector.
 *
 * Exactly one kind of configuration applies to a connector; pick it with one of the static
 * factories.
 */
export abstract class NetworkConnectorConfiguration {
  /**
   * Egress from the compute into a VPC, through network interfaces the connector manages.
   */
  public static vpcEgress(config: VpcEgressConfiguration): NetworkConnectorConfiguration {
    return new VpcEgressNetworkConnectorConfiguration(config);
  }

  /**
   * Render the configuration for the L1.
   *
   * @internal
   */
  public abstract _render(scope: Construct): CfnNetworkConnector.ConfigProperty;
}

class VpcEgressNetworkConnectorConfiguration extends NetworkConnectorConfiguration {
  constructor(private readonly config: VpcEgressConfiguration) {
    super();
  }

  public _render(scope: Construct): CfnNetworkConnector.ConfigProperty {
    const { securityGroups } = this.config;
    const { subnetIds } = this.config.vpc.selectSubnets(this.config.vpcSubnets);
    if (!Token.isUnresolved(subnetIds) && (subnetIds.length < 1 || subnetIds.length > 16)) {
      throw new ValidationError(lit`NetworkConnectorSubnetCount`,
        `vpcSubnets must select between 1 and 16 subnets, got ${subnetIds.length}`, scope);
    }
    // The schema allows an empty list, in which case the interfaces land in the VPC's default
    // security group. Require at least one on purpose: CDK never places an interface in the
    // default group implicitly (other L2s either take groups or create one), and this
    // construct does not create one, so the caller has to say which group applies.
    if (securityGroups.length < 1 || securityGroups.length > 5) {
      throw new ValidationError(lit`NetworkConnectorSecurityGroupCount`,
        `securityGroups must contain between 1 and 5 items, got ${securityGroups.length}`, scope);
    }

    return {
      vpcEgressConfiguration: {
        subnetIds,
        securityGroupIds: securityGroups.map((group) => group.securityGroupRef.securityGroupId),
        networkProtocol: this.config.networkProtocol ?? NetworkProtocol.IPV4,
        associatedComputeResourceTypes: [this.config.computeType],
      },
    };
  }
}

/**
 * Attributes of an existing network connector, for importing it.
 */
export interface NetworkConnectorAttributes {
  /**
   * The unqualified ARN of the connector.
   */
  readonly networkConnectorArn: string;

  /**
   * The qualified ARN of the version a WebFunction should pin to.
   *
   * @default - not known; reading `latestVersionArn` on the imported connector throws
   */
  readonly latestVersionArn?: string;
}

/**
 * Properties for a network connector.
 */
export interface NetworkConnectorProps {
  /**
   * The network configuration.
   */
  readonly configuration: NetworkConnectorConfiguration;

  /**
   * A name for the connector, unique within the account and region.
   *
   * Changing it replaces the connector.
   *
   * @default - a name is generated by CloudFormation
   */
  readonly networkConnectorName?: string;

  /**
   * The role the Lambda service assumes to manage the connector's network interfaces in the VPC.
   *
   * The `AWSLambdaNetworkConnectorOperatorPolicy` managed policy is attached to a provided role
   * defined in this app, as it is to the default one. A role imported by ARN or name cannot be
   * modified from this app, so a warning is emitted instead: make sure it already carries that
   * policy, or equivalent permissions to manage the connector's network interfaces.
   *
   * @default - a role is created with the `AWSLambdaNetworkConnectorOperatorPolicy` managed policy
   */
  readonly operatorRole?: iam.IRoleRef;
}

abstract class NetworkConnectorBase extends Resource implements INetworkConnector {
  public abstract readonly networkConnectorArn: string;
  public abstract readonly latestVersionArn: string;

  public get networkConnectorRef(): NetworkConnectorReference {
    return { networkConnectorArn: this.networkConnectorArn };
  }
}

/** The AWS managed policy that lets the service manage a connector's network interfaces. */
const OPERATOR_MANAGED_POLICY = 'AWSLambdaNetworkConnectorOperatorPolicy';

function isRoleWithManagedPolicies(role: iam.IRoleRef): role is iam.IRole {
  return typeof (role as Partial<iam.IRole>).addManagedPolicy === 'function';
}

/**
 * The index of the `:` before a numeric version at the end of a connector's resource name,
 * or `undefined` if the name carries no version.
 */
function versionSeparator(resourceName: string): number | undefined {
  const separator = resourceName.lastIndexOf(':');
  return separator >= 0 && /^\d+$/.test(resourceName.slice(separator + 1)) ? separator : undefined;
}

const NETWORK_CONNECTOR_SYMBOL = Symbol.for('@aws-cdk/aws-lambda.NetworkConnector');

/**
 * A Lambda Network Connector: network configuration that Lambda compute attaches to.
 *
 * The connector owns the network interfaces in the VPC. Compute references a connector rather
 * than carrying subnets and security groups itself, so the interfaces are provisioned when the
 * connector is created, not when each function is.
 *
 * Every update to the connector produces a new immutable version. A WebFunction pins its
 * revision to one version (`latestVersionArn`), so when the connector in the same stack is
 * updated, the revision is replaced and moves to the new version as part of that deployment.
 * To hold a WebFunction on a fixed version instead — or to reference a connector from another
 * stack — import the version with `fromNetworkConnectorVersionArn`.
 */
@propertyInjectable
export class NetworkConnector extends NetworkConnectorBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-lambda.NetworkConnector';

  /**
   * Return whether the given object is a NetworkConnector.
   */
  public static isNetworkConnector(x: any): x is NetworkConnector {
    return x !== null && typeof x === 'object' && NETWORK_CONNECTOR_SYMBOL in x;
  }

  /**
   * Import a specific version of a connector by its qualified ARN.
   *
   * This is the form a WebFunction can reference. The revision stays on this version until the
   * ARN in your code changes, regardless of updates to the connector.
   *
   * A literal ARN is checked for a version suffix at synthesis. A deploy-time value — an SSM
   * parameter, an imported value — cannot be inspected until deployment, where an unqualified
   * ARN is rejected by the service when the revision is created.
   *
   * Do not pass the `latestVersionArn` of a connector in another stack. It changes on every
   * update to the connector, and CloudFormation does not allow an exported value that another
   * stack imports to change; a WebFunction rejects such an import at synthesis.
   *
   * @param networkConnectorVersionArn A qualified ARN, `arn:...:network-connector:nc-<id>:<version>`
   */
  public static fromNetworkConnectorVersionArn(scope: Construct, id: string, networkConnectorVersionArn: string): INetworkConnector {
    const parsed = Arn.split(networkConnectorVersionArn, ArnFormat.COLON_RESOURCE_NAME);
    let connectorId: string;
    if (Token.isUnresolved(networkConnectorVersionArn)) {
      // Split on a token selects the segment right after the resource type, which is the connector id;
      // the version is the segment after that and is dropped.
      connectorId = parsed.resourceName ?? '';
    } else {
      const resourceName = parsed.resourceName ?? '';
      const separator = versionSeparator(resourceName);
      if (separator === undefined) {
        throw new UnscopedValidationError(lit`NetworkConnectorVersionArnUnqualified`,
          `Expected a qualified network connector ARN ending in ':<version>', got '${networkConnectorVersionArn}'. ` +
          'To import a connector without a version, use fromNetworkConnectorArn().');
      }
      connectorId = resourceName.slice(0, separator);
    }
    const networkConnectorArn = Stack.of(scope).formatArn({
      ...parsed,
      resourceName: connectorId,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
    return NetworkConnector.fromNetworkConnectorAttributes(scope, id, { networkConnectorArn, latestVersionArn: networkConnectorVersionArn });
  }

  /**
   * Import a connector by its unqualified ARN.
   *
   * The result names the connector as a whole, not a version, so it can be used in IAM
   * policies but not as a WebFunction's `egressNetworkConnector`; reading `latestVersionArn`
   * on it throws. Use `fromNetworkConnectorVersionArn` for that.
   *
   * @param networkConnectorArn An unqualified ARN, `arn:...:network-connector:nc-<id>`
   */
  public static fromNetworkConnectorArn(scope: Construct, id: string, networkConnectorArn: string): INetworkConnector {
    if (!Token.isUnresolved(networkConnectorArn)) {
      const resourceName = Arn.split(networkConnectorArn, ArnFormat.COLON_RESOURCE_NAME).resourceName ?? '';
      if (versionSeparator(resourceName) !== undefined) {
        throw new UnscopedValidationError(lit`NetworkConnectorArnQualified`,
          `Expected an unqualified network connector ARN, got '${networkConnectorArn}', which ends in a version. ` +
          'To import a connector version, use fromNetworkConnectorVersionArn().');
      }
    }
    return NetworkConnector.fromNetworkConnectorAttributes(scope, id, { networkConnectorArn });
  }

  /**
   * Import a connector from its attributes.
   */
  public static fromNetworkConnectorAttributes(scope: Construct, id: string, attrs: NetworkConnectorAttributes): INetworkConnector {
    class Import extends NetworkConnectorBase {
      public readonly networkConnectorArn = attrs.networkConnectorArn;

      public get latestVersionArn(): string {
        if (attrs.latestVersionArn === undefined) {
          throw new ValidationError(lit`NetworkConnectorImportedWithoutVersion`,
            `The network connector '${attrs.networkConnectorArn}' was imported without a version, so its latest ` +
            'version ARN is not known. WebFunction pins a revision to a version: import the connector with ' +
            'NetworkConnector.fromNetworkConnectorVersionArn() instead.', this);
        }
        return attrs.latestVersionArn;
      }
    }
    return new Import(scope, id, { environmentFromArn: attrs.networkConnectorArn });
  }

  /**
   * The role the Lambda service assumes to manage the connector's network interfaces.
   */
  public readonly operatorRole: iam.IRoleRef;

  private readonly resource: CfnNetworkConnector;

  constructor(scope: Construct, id: string, props: NetworkConnectorProps) {
    super(scope, id, { physicalName: props.networkConnectorName });
    addConstructMetadata(this, props);

    // No confused-deputy condition on the trust policy: verified by deployment, the service
    // presents no source keys when it assumes this role, so adding `aws:SourceAccount` makes
    // CreateNetworkConnector fail with "The service is unable to assume the provided
    // NetworkConnectorOperatorRole". This matches the trust policy the LNC developer guide
    // instructs customers to create.
    const operatorPolicy = iam.ManagedPolicy.fromAwsManagedPolicyName(OPERATOR_MANAGED_POLICY);
    if (props.operatorRole) {
      this.operatorRole = props.operatorRole;
      this.attachOperatorPolicy(props.operatorRole, operatorPolicy);
    } else {
      this.operatorRole = new iam.Role(this, 'OperatorRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [operatorPolicy],
      });
    }

    this.resource = new CfnNetworkConnector(this, 'Resource', {
      name: this.physicalName,
      configuration: props.configuration._render(this),
      operatorRole: this.operatorRole.roleRef.roleArn,
    });
  }

  /**
   * Give a caller-provided operator role the managed policy the service needs.
   *
   * Only a role defined in this app can be changed. An imported role's `addManagedPolicy` is
   * a no-op for an AWS managed policy and emits an IAM warning that does not say what the
   * connector needs, so it is not called; this construct warns instead.
   */
  private attachOperatorPolicy(role: iam.IRoleRef, policy: iam.IManagedPolicy): void {
    if (Resource.isOwnedResource(role) && isRoleWithManagedPolicies(role)) {
      role.addManagedPolicy(policy);
      return;
    }
    const roleArn = role.roleRef.roleArn;
    const roleName = Token.isUnresolved(roleArn) ? `'${role.node.path}'` : `'${roleArn}' (${role.node.path})`;
    Annotations.of(this).addWarningV2(
      '@aws-cdk/aws-lambda:networkConnectorOperatorRoleNotModified',
      `The operator role ${roleName} cannot be modified from this app, so the ` +
      `${OPERATOR_MANAGED_POLICY} managed policy was not attached to it. Make sure the role ` +
      'carries that policy, or equivalent permissions to manage the connector\'s network interfaces.',
    );
  }

  @memoizedGetter
  public get networkConnectorArn(): string {
    return this.resource.attrArn;
  }

  @memoizedGetter
  public get latestVersionArn(): string {
    return this.resource.attrLatestVersionArn;
  }
}

Object.defineProperty(NetworkConnector.prototype, NETWORK_CONNECTOR_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});
