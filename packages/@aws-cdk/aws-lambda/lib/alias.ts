import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { FunctionRef } from './lambda-ref';
import { FunctionVersion } from './lambda-version';
import { cloudformation } from './lambda.generated';
import { Permission } from './permission';

/**
 * Properties for a new Lambda alias
 */
export interface AliasProps {
  /**
   * Description for the alias
   *
   * @default No description
   */
  description?: string;

  /**
   * Function version this alias refers to
   *
   * Use lambda.addVersion() to obtain a new lambda version to refer to.
   */
  version: FunctionVersion;

  /**
   * Name of this alias
   */
  aliasName: string;

  /**
   * Additional versions with individual weights this alias points to
   *
   * Individual additional version weights specified here should add up to
   * (less than) one. All remaining weight is routed to the default
   * version.
   *
   * For example, the config is
   *
   *    version: "1"
   *    additionalVersions: [{ version: "2", weight: 0.05 }]
   *
   * Then 5% of traffic will be routed to function version 2, while
   * the remaining 95% of traffic will be routed to function version 1.
   *
   * @default No additional versions
   */
  additionalVersions?: VersionWeight[];
}

/**
 * A new alias to a particular version of a Lambda function.
 */
export class Alias extends FunctionRef {
  /**
   * ARN of this alias
   *
   * Used to be able to use Alias in place of a regular Lambda. Lambda accepts
   * ARNs everywhere it accepts function names.
   */
  public readonly functionName: string;

  /**
   * ARN of this alias
   *
   * Used to be able to use Alias in place of a regular Lambda. Lambda accepts
   * ARNs everywhere it accepts function names.
   */
  public readonly functionArn: string;

  /**
   * Role associated with this alias
   */
  public readonly role?: iam.Role | undefined;

  protected readonly canCreatePermissions: boolean = true; // Not used anyway

  /**
   * The actual Lambda function object that this Alias is pointing to
   */
  private readonly underlyingLambda: FunctionRef;

  constructor(parent: cdk.Construct, name: string, props: AliasProps) {
    super(parent, name);

    this.underlyingLambda = props.version.lambda;

    const alias = new cloudformation.AliasResource(this, 'Resource', {
      aliasName: props.aliasName,
      description: props.description,
      functionName: this.underlyingLambda.functionName,
      functionVersion: props.version.functionVersion,
      routingConfig: this.determineRoutingConfig(props)
    });

    // Not actually the name, but an ARN can be used in all places
    // where the name is expected, and an ARN can refer to an Alias.
    this.functionName = alias.ref;
    this.functionArn = alias.aliasArn;
  }

  public addPermission(name: string, permission: Permission) {
    // Forward addPermission() to the underlying Lambda object
    this.underlyingLambda.addPermission(name, permission);
  }

  /**
   * Calculate the routingConfig parameter from the input props
   */
  private determineRoutingConfig(props: AliasProps) {
    if (!props.additionalVersions || props.additionalVersions.length === 0) {
      return undefined;
    }

    this.validateAdditionalWeights(props.additionalVersions);

    return {
      additionalVersionWeights: props.additionalVersions.map(vw => {
        return {
          functionVersion: vw.version.functionVersion,
          functionWeight: vw.weight
        };
      })
    };
  }

  /**
   * Validate that the additional version weights make sense
   *
   * We validate that they are positive and add up to something <= 1.
   */
  private validateAdditionalWeights(weights: VersionWeight[]) {
    const total = weights.map(w => {
      if (w.weight < 0 || w.weight > 1) { throw new Error(`Additional version weight must be between 0 and 1, got: ${w.weight}`); }
      return w.weight;
    }).reduce((a, x) => a + x);

    if (total > 1) {
      throw new Error(`Sum of additional version weights must not exceed 1, got: ${total}`);
    }
  }
}

/**
 * A version/weight pair for routing traffic to Lambda functions
 */
export interface VersionWeight {
  /**
   * The version to route traffic to
   */
  readonly version: FunctionVersion;

  /**
   * How much weight to assign to this version (0..1)
   */
  readonly weight: number;
}
