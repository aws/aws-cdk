import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import { Construct } from '@aws-cdk/core';
import { IFunction, QualifiedFunctionBase } from './function-base';
import { IVersion } from './lambda-version';
import { CfnAlias } from './lambda.generated';

export interface IAlias extends IFunction {
  /**
   * Name of this alias.
   *
   * @attribute
   */
  readonly aliasName: string;

  /**
   * The underlying Lambda function version.
   */
  readonly version: IVersion;
}

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
  readonly aliasName: string;

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

export interface AliasAttributes {
  readonly aliasName: string;
  readonly aliasVersion: IVersion;
}

/**
 * A new alias to a particular version of a Lambda function.
 */
export class Alias extends QualifiedFunctionBase implements IAlias {
  public static fromAliasAttributes(scope: Construct, id: string, attrs: AliasAttributes): IAlias {
    class Imported extends QualifiedFunctionBase implements IAlias {
      public readonly aliasName = attrs.aliasName;
      public readonly version = attrs.aliasVersion;
      public readonly lambda = attrs.aliasVersion.lambda;
      public readonly functionArn = `${attrs.aliasVersion.lambda.functionArn}:${attrs.aliasName}`;
      public readonly functionName = `${attrs.aliasVersion.lambda.functionName}:${attrs.aliasName}`;
      public readonly grantPrincipal = attrs.aliasVersion.grantPrincipal;
      public readonly role = attrs.aliasVersion.role;

      protected readonly canCreatePermissions = false;
    }
    return new Imported(scope, id);
  }

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

  public readonly lambda: IFunction;

  public readonly version: IVersion;

  /**
   * ARN of this alias
   *
   * Used to be able to use Alias in place of a regular Lambda. Lambda accepts
   * ARNs everywhere it accepts function names.
   */
  public readonly functionArn: string;

  protected readonly canCreatePermissions: boolean = true;

  constructor(scope: Construct, id: string, props: AliasProps) {
    super(scope, id, {
      physicalName: props.aliasName,
    });

    this.lambda = props.version.lambda;
    this.aliasName = this.physicalName;
    this.version = props.version;

    const alias = new CfnAlias(this, 'Resource', {
      name: this.aliasName,
      description: props.description,
      functionName: this.version.lambda.functionName,
      functionVersion: props.version.version,
      routingConfig: this.determineRoutingConfig(props)
    });

    this.functionArn = this.getResourceArnAttribute(alias.ref, {
      service: 'lambda',
      resource: 'function',
      resourceName: `${this.lambda.functionName}:${this.physicalName}`,
      sep: ':',
    });

    // ARN parsing splits on `:`, so we can only get the function's name from the ARN as resourceName...
    // And we're parsing it out (instead of using the underlying function directly) in order to have use of it incur
    // an implicit dependency on the resource.
    this.functionName = `${this.stack.parseArn(this.functionArn, ":").resourceName!}:${this.aliasName}`;
  }

  public get grantPrincipal() {
    return this.version.grantPrincipal;
  }

  public get role() {
    return this.version.role;
  }

  public metric(metricName: string, props: cloudwatch.MetricOptions = {}): cloudwatch.Metric {
    // Metrics on Aliases need the "bare" function name, and the alias' ARN, this differes from the base behavior.
    return super.metric(metricName, {
      dimensions: {
        FunctionName: this.lambda.functionName,
        // construct the ARN from the underlying lambda so that alarms on an alias
        // don't cause a circular dependency with CodeDeploy
        // see: https://github.com/aws/aws-cdk/issues/2231
        Resource: `${this.lambda.functionArn}:${this.aliasName}`
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
