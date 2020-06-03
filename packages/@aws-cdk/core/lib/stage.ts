import { Assembly } from './assembly';
import { Construct } from './construct-compat';
import { Environment } from './environment';

/**
 * Properties for a Stage
 */
export interface StageProps {
  /**
   * Default AWS environment (account/region) for `Stack`s in this `Stage`.
   *
   * Stacks defined inside this `Stage` with either `region` or `account` missing
   * from its env will use the corresponding field given here.
   *
   * If either `region` or `account`is is not configured for `Stack` (either on
   * the `Stack` itself or on the containing `Stage`), the Stack will be
   * *environment-agnostic*.
   *
   * Environment-agnostic stacks can be deployed to any environment, may not be
   * able to take advantage of all features of the CDK. For example, they will
   * not be able to use environmental context lookups, will not automatically
   * translate Service Principals to the right format based on the environment's
   * AWS partition, and other such enhancements.
   *
   * @example
   *
   * // Use a concrete account and region to deploy this Stage to
   * new MyStage(app, 'Stage1', {
   *   env: { account: '123456789012', region: 'us-east-1' },
   * });
   *
   * // Use the CLI's current credentials to determine the target environment
   * new MyStage(app, 'Stage2', {
   *   env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
   * });
   *
   * @default - The environments should be configured on the `Stack`s.
   */
  readonly env?: Environment;

  /**
   * Stage name
   *
   * Will be prepended to default Stack names of stacks in this Stage.
   *
   * Stack names can be overridden at the Stack level.
   *
   * @default - Same as the construct id
   */
  readonly stageName?: string;
}

/**
 * An application modeling unit consisting of Stacks that should be deployed together
 *
 * Derive a subclass of this construct and use it to model a single
 * instance of your application.
 *
 * You can then instantiate your subclass multiple times to model multiple
 * copies of your application which should be be deployed to different
 * environments.
 */
export class Stage extends Assembly {
  /**
   * Stage name of this stage
   */
  public readonly stageName: string;

  constructor(scope: Construct, id: string, props: StageProps = {}) {
    super(scope, id, {
      env: props.env,
      assemblyName: props.stageName,
    });

    this.stageName = this.assemblyName;
  }
}