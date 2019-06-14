import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import { Construct, PhysicalName, ResourceIdentifiers, Stack } from '@aws-cdk/cdk';
import { FunctionBase, IFunction } from './function-base';
import { IVersion } from './lambda-version';
import { CfnAlias } from './lambda.generated';

/**
 * Properties for a new Lambda alias
 */
export interface AliasProps {
  /**
   * Description for the alias
   *
   * @default No description
   */
  readonly description?: string;

  /**
   * Function version this alias refers to
   *
   * Use lambda.addVersion() to obtain a new lambda version to refer to.
   */
  readonly version: IVersion;

  /**
   * Name of this alias
   */
  readonly aliasName: PhysicalName;

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
  readonly additionalVersions?: VersionWeight[];
}

/**
 * A new alias to a particular version of a Lambda function.
 */
export class Alias extends FunctionBase {
  /**
   * Name of this alias.
   *
   * @attribute
   */
  public readonly aliasName: string;
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

  protected readonly canCreatePermissions: boolean = true;

  /**
   * The actual Lambda function object that this Alias is pointing to
   */
  private readonly underlyingLambda: IFunction;

  constructor(scope: Construct, id: string, props: AliasProps) {
    super(scope, id, {
      physicalName: props.aliasName,
    });

    this.aliasName = this.physicalName.value || '';
    this.underlyingLambda = props.version.lambda;

    const alias = new CfnAlias(this, 'Resource', {
      name: this.aliasName,
      description: props.description,
      functionName: this.underlyingLambda.functionName,
      functionVersion: props.version.version,
      routingConfig: this.determineRoutingConfig(props)
    });

    const resourceIdentifiers = new ResourceIdentifiers(this, {
      arn: alias.aliasArn,
      name: this.aliasName,
      arnComponents: {
        service: 'lambda',
        resource: 'function',
        resourceName: `${this.underlyingLambda.functionName}:${this.physicalName.value}`,
        sep: ':',
      },
    });
    this.functionArn = resourceIdentifiers.arn;
    // ARN parsing splits on `:`, so we can only get the function's name from the ARN as resourceName...
    // And we're parsing it out (instead of using the underlying function directly) in order to have use of it incur
    // an implicit dependency on the resource.
    this.functionName = `${Stack.of(this).parseArn(this.functionArn, ":").resourceName!}:${this.aliasName}`;
  }

  /**
   * Role associated with this alias
   */
  public get role() {
    return this.underlyingLambda.role;
  }

  public get grantPrincipal() {
    return this.underlyingLambda.grantPrincipal;
  }

  public metric(metricName: string, props: cloudwatch.MetricOptions = {}): cloudwatch.Metric {
    // Metrics on Aliases need the "bare" function name, and the alias' ARN, this differes from the base behavior.
    return super.metric(metricName, {
      dimensions: {
        FunctionName: this.underlyingLambda.functionName,
        // construct the ARN from the underlying lambda so that alarms on an alias
        // don't cause a circular dependency with CodeDeploy
        // see: https://github.com/awslabs/aws-cdk/issues/2231
        Resource: `${this.underlyingLambda.functionArn}:${this.aliasName}`
      },
      ...props
    });
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
          functionVersion: vw.version.version,
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
  readonly version: IVersion;

  /**
   * How much weight to assign to this version (0..1)
   */
  readonly weight: number;
}
