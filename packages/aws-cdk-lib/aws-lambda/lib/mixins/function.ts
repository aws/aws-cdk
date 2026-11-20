import type { IConstruct } from 'constructs';
import { Annotations, Token } from '../../../core';
import { CfnPropsMixin } from '../../../core/lib/helpers-internal';
import { Mixin, PropertyMergeStrategy } from '../../../core/lib/mixins';
import { CfnFunction } from '../lambda.generated';

/**
 * Properties for the FunctionRuntimeConfig mixin.
 */
export interface FunctionRuntimeConfigProps {
  // Strings rather than a runtime alias reference: CDK has no runtime constructs. A ref-based
  // option can be added later as a static method without changing these props.
  /**
   * The ARN of the customer-managed runtime that the function uses, for example
   * `arn:aws:lambda:us-east-1:123456789012:runtime/my-runtime`.
   *
   * The specific runtime version is resolved by the service from `runtimeAlias`.
   */
  readonly runtimeArn: string;

  /**
   * The name of the runtime alias that selects which runtime version the
   * function runs on (for example `stable` or `latest`).
   *
   * With the default `RuntimeManagementMode.AUTO`, moving the alias to a new
   * version rolls the function forward on its next cold start, without a
   * function redeploy.
   */
  readonly runtimeAlias: string;
}

/**
 * Lambda-specific Mixin to run a function on a customer-managed runtime (CMR).
 *
 * Sets the `runtimeConfig` property on the function, replacing any existing
 * `runtimeConfig`. The function's runtime must be `custom`, and the function
 * must not be a container image function; both are checked at synthesis, so a
 * runtime or package type set after the mixin is applied is still checked. A
 * runtime that is only known at deployment, such as a parameter value, is not
 * checked.
 *
 * Which runtime versions and architectures the runtime supports, and whether
 * the calling account may use it, are validated by the service at deployment.
 */
export class FunctionRuntimeConfig extends Mixin {
  constructor(private readonly props: FunctionRuntimeConfigProps) {
    super();
  }

  public supports(construct: IConstruct): construct is CfnFunction {
    return CfnFunction.isCfnFunction(construct);
  }

  public applyTo(construct: IConstruct): void {
    if (!this.supports(construct)) return;

    // Both members are required together, so the whole object is replaced rather than merged.
    new CfnPropsMixin(CfnFunction, {
      runtimeConfig: {
        runtimeArn: this.props.runtimeArn,
        runtimeAlias: this.props.runtimeAlias,
      },
    }, { strategy: PropertyMergeStrategy.override() }).applyTo(construct);

    // Clears the info that Function adds for a custom runtime without RuntimeConfig.
    Annotations.of(construct).acknowledgeInfo('@aws-cdk/aws-lambda:customRuntimeRequiresRuntimeConfig',
      'FunctionRuntimeConfig supplies the required RuntimeConfig');

    construct.node.addValidation({
      validate: () => {
        const errors = new Array<string>();
        if (construct.packageType === 'Image') {
          errors.push('runtimeConfig cannot be used with a container image function; the image supplies its own runtime');
        } else if (!Token.isUnresolved(construct.runtime) && construct.runtime !== 'custom') {
          errors.push(`runtime must be 'custom' when runtimeConfig is set, got ${JSON.stringify(construct.runtime)}`);
        }
        return errors;
      },
    });
  }
}
