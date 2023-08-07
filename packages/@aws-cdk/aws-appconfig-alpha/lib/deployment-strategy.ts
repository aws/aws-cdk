import { Resource, IResource, Stack, ArnFormat, Names, Duration } from 'aws-cdk-lib';
import { CfnDeploymentStrategy } from 'aws-cdk-lib/aws-appconfig';
import { Construct } from 'constructs';

export interface DeploymentStrategyProps {
  /**
   * The rollout strategy for the deployment strategy. You can use predefined deployment
   * strategies, such as RolloutStrategy.ALL_AT_ONCE, RolloutStrategy.LINEAR_50_PERCENT_EVERY_30_SECONDS,
   * or RolloutStrategy.CANARY_10_PERCENT_20_MINUTES.
   */
  readonly rolloutStrategy: RolloutStrategy;

  /**
   * A name for the deployment strategy.
   *
   * @default - A name is generated.
   */
  readonly name?: string;

  /**
   * A description of the deployment strategy.
   *
   * @default - No description.
   */
  readonly description?: string;
}

/**
 * An AWS AppConfig deployment strategy.
 *
 * @resource AWS::AppConfig::DeploymentStrategy
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-deployment-strategy.html
 */
export class DeploymentStrategy extends Resource implements IDeploymentStrategy {
  /**
   * Imports a deployment strategy into the CDK using its Amazon Resource Name (ARN).
   *
   * @param scope The parent construct
   * @param id The name of the deployment strategy construct
   * @param deploymentStrategyArn The Amazon Resource Name (ARN) of the deployment strategy
   */
  public static fromDeploymentStrategyArn(scope: Construct, id: string, deploymentStrategyArn: string): IDeploymentStrategy {
    const parsedArn = Stack.of(scope).splitArn(deploymentStrategyArn, ArnFormat.SLASH_RESOURCE_NAME);
    const deploymentStrategyId = parsedArn.resourceName;
    if (!deploymentStrategyId) {
      throw new Error('Missing required deployment strategy id from deployment strategy ARN');
    }

    class Import extends Resource implements IDeploymentStrategy {
      public readonly deploymentStrategyId = deploymentStrategyId!;
      public readonly deploymentStrategyArn = deploymentStrategyArn;
    }

    return new Import(scope, id, {
      environmentFromArn: deploymentStrategyArn,
    });
  }

  /**
   * Imports a deployment strategy into the CDK using its ID.
   *
   * @param scope The parent construct
   * @param id The name of the deployment strategy construct
   * @param deploymentStrategyId The ID of the deployment strategy
   */
  public static fromDeploymentStrategyId(scope: Construct, id: string, deploymentStrategyId: string): IDeploymentStrategy {
    const stack = Stack.of(scope);
    const deploymentStrategyArn = stack.formatArn({
      service: 'appconfig',
      resource: 'deploymentstrategy',
      resourceName: deploymentStrategyId,
    });

    class Import extends Resource implements IDeploymentStrategy {
      public readonly deploymentStrategyId = deploymentStrategyId;
      public readonly deploymentStrategyArn = deploymentStrategyArn;
    }

    return new Import(scope, id, {
      environmentFromArn: deploymentStrategyArn,
    });
  }

  /**
   * The name of the deployment strategy.
   */
  public readonly name?: string;

  /**
   * The deployment duration in minutes of the deployment strategy.
   */
  public readonly deploymentDurationInMinutes?: number;

  /**
   * The growth factor of the deployment strategy.
   */
  public readonly growthFactor?: number;

  /**
   * The description of the deployment strategy.
   */
  public readonly description?: string;

  /**
   * The final bake time in minutes of the deployment strategy.
   */
  public readonly finalBakeTimeInMinutes?: number;

  /**
   * The growth type of the deployment strategy.
   */
  public readonly growthType?: GrowthType;

  /**
   * The ID of the deployment strategy.
   */
  public readonly deploymentStrategyId: string;

  /**
   * The Amazon Resource Name (ARN) of the deployment strategy.
   */
  public readonly deploymentStrategyArn: string;

  private readonly _cfnDeploymentStrategy: CfnDeploymentStrategy;

  constructor(scope: Construct, id: string, props: DeploymentStrategyProps) {
    super(scope, id, {
      physicalName: props.name,
    });

    this.deploymentDurationInMinutes = props.rolloutStrategy.deploymentDuration.toMinutes();
    this.growthFactor = props.rolloutStrategy.growthFactor;
    this.description = props.description;
    this.finalBakeTimeInMinutes = props.rolloutStrategy.finalBakeTime?.toMinutes();
    this.growthType = props.rolloutStrategy.growthType;
    this.name = props.name || Names.uniqueResourceName(this, {
      maxLength: 64,
      separator: '-',
    });

    const resource = new CfnDeploymentStrategy(this, 'Resource', {
      name: this.name,
      deploymentDurationInMinutes: this.deploymentDurationInMinutes,
      growthFactor: this.growthFactor,
      replicateTo: 'NONE',
      description: this.description,
      finalBakeTimeInMinutes: this.finalBakeTimeInMinutes,
      growthType: this.growthType,
    });
    this._cfnDeploymentStrategy = resource;

    this.deploymentStrategyId = this._cfnDeploymentStrategy.ref;
    this.deploymentStrategyArn = this.stack.formatArn({
      service: 'appconfig',
      resource: 'deploymentstrategy',
      resourceName: this.deploymentStrategyId,
    });
  }
}

/**
 * Defines the growth type of the deployment strategy.
 */
export enum GrowthType {
  LINEAR = 'LINEAR',
  EXPONENTIAL = 'EXPONENTIAL',
}

/**
 * Defines the deployment strategy ID's of AWS AppConfig predefined strategies.
 */
export enum PredefinedDeploymentStrategyId {
  CANARY_10_PERCENT_20_MINUTES = 'AppConfig.Canary10Percent20Minutes',
  LINEAR_50_PERCENT_EVERY_30_SECONDS = 'AppConfig.Linear50PercentEvery30Seconds',
  LINEAR_20_PERCENT_EVERY_6_MINUTES = 'AppConfig.Linear20PercentEvery6Minutes',
  ALL_AT_ONCE = 'AppConfig.AllAtOnce',
}

export interface RolloutStrategyProps {
  /**
   * The growth factor of the deployment strategy. This defines
   * the percentage of targets to receive a deployed configuration
   * during each interval.
   */
  readonly growthFactor: number;

  /**
   * The deployment duration of the deployment strategy. This defines
   * the total amount of time for a deployment to last.
   */
  readonly deploymentDuration: Duration;

  /**
   * The final bake time of the deployment strategy.
   *
   * This setting specifies the amount of time AWS AppConfig monitors for Amazon
   * CloudWatch alarms after the configuration has been deployed to
   * 100% of its targets, before considering the deployment to be complete.
   * If an alarm is triggered during this time, AWS AppConfig rolls back
   * the deployment.
   *
   * @default Duration.minutes(0)
   */
  readonly finalBakeTime?: Duration;
}

/**
 * Defines the rollout strategy for a deployment strategy and includes the growth factor,
 * deployment duration, growth type, and optionally final bake time.
 */
export abstract class RolloutStrategy {
  public static readonly CANARY_10_PERCENT_20_MINUTES = RolloutStrategy.exponential({
    growthFactor: 10,
    deploymentDuration: Duration.minutes(20),
    finalBakeTime: Duration.minutes(10),
  });
  public static readonly LINEAR_50_PERCENT_EVERY_30_SECONDS = RolloutStrategy.linear({
    growthFactor: 50,
    deploymentDuration: Duration.minutes(1),
    finalBakeTime: Duration.minutes(1),
  });
  public static readonly LINEAR_20_PERCENT_EVERY_6_MINUTES = RolloutStrategy.linear({
    growthFactor: 20,
    deploymentDuration: Duration.minutes(30),
    finalBakeTime: Duration.minutes(30),
  });
  public static readonly ALL_AT_ONCE = RolloutStrategy.linear({
    growthFactor: 100,
    deploymentDuration: Duration.minutes(0),
    finalBakeTime: Duration.minutes(10),
  });

  /**
   * @returns A linear rollout strategy.
   */
  public static linear(props: RolloutStrategyProps): RolloutStrategy {
    return {
      growthFactor: props.growthFactor,
      deploymentDuration: props.deploymentDuration,
      growthType: GrowthType.LINEAR,
      finalBakeTime: props.finalBakeTime,
    };
  }

  /**
   * @returns An exponential rollout strategy.
   */
  public static exponential(props: RolloutStrategyProps): RolloutStrategy {
    return {
      growthFactor: props.growthFactor,
      deploymentDuration: props.deploymentDuration,
      growthType: GrowthType.EXPONENTIAL,
      finalBakeTime: props.finalBakeTime,
    };
  }

  /**
   * The growth factor of the rollout strategy.
   */
  public abstract readonly growthFactor: number;

  /**
   * The deployment duration of the rollout strategy.
   */
  public abstract readonly deploymentDuration: Duration;

  /**
   * The growth type of the rollout strategy.
   */
  public abstract readonly growthType?: GrowthType;

  /**
   * The final bake time of the deployment strategy.
   */
  public abstract readonly finalBakeTime?: Duration;
}

export interface IDeploymentStrategy extends IResource {
  /**
   * The name of the deployment strategy.
   */
  readonly name?: string;

  /**
   * The deployment duration in minutes.
   */
  readonly deploymentDurationInMinutes?: number;

  /**
   * The growth factor of the deployment strategy.
   */
  readonly growthFactor?: number;

  /**
   * The description of the deployment strategy.
   */
  readonly description?: string;

  /**
   * The final bake time in minutes.
   */
  readonly finalBakeTimeInMinutes?: number;

  /**
   * The growth type of the deployment strategy.
   */
  readonly growthType?: GrowthType;

  /**
   * The ID of the deployment strategy.
   */
  readonly deploymentStrategyId: string;

  /**
   * The Amazon Resource Name (ARN) of the deployment strategy.
   */
  readonly deploymentStrategyArn: string;
}