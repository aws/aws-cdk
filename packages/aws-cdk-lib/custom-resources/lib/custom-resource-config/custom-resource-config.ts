import { IConstruct, MetadataEntry } from 'constructs';
import * as cloudformation from '../../../aws-cloudformation';
import * as lambda from '../../../aws-lambda';
import * as logs from '../../../aws-logs';
import { Aspects, IAspect, RemovalPolicy } from '../../../core/lib';

/* This is duplicated in @aws-cdk/custom-resource-handlers/lib/custom-resources-framework/config.ts */
export const CUSTOM_RESOURCE_PROVIDER = 'aws:cdk:is-custom-resource-handler-customResourceProvider';
export const CUSTOM_RESOURCE_SINGLETON = 'aws:cdk:is-custom-resource-handler-singleton';
export const CUSTOM_RESOURCE_SINGLETON_LOG_GROUP = 'aws:cdk:is-custom-resource-handler-logGroup';
export const CUSTOM_RESOURCE_SINGLETON_LOG_RETENTION = 'aws:cdk:is-custom-resource-handler-logRetention';
export const CUSTOM_RESOURCE_RUNTIME_FAMILY = 'aws:cdk:is-custom-resource-handler-runtime-family';

/**
 * Manages AWS-vended Custom Resources
 *
 * This feature is currently experimental.
 */
export class CustomResourceConfig {
  /**
   * Returns the CustomResourceConfig for this scope.
   */
  public static of(scope: IConstruct): CustomResourceConfig {
    return new CustomResourceConfig(scope);
  }

  private constructor(private readonly scope: IConstruct) { }

  /**
   * Set the log retention of AWS-vended custom resource lambdas.
   *
   * This feature is currently experimental.
   */
  public addLogRetentionLifetime(rentention: logs.RetentionDays) {
    Aspects.of(this.scope).add(new CustomResourceLogRetention(rentention));
  }

  /**
   * Set the removal policy of AWS-vended custom resource logGroup.
   *
   * This feature is currently experimental.
   */
  public addRemovalPolicy(removalPolicy: RemovalPolicy) {
    Aspects.of(this.scope).add(new CustomResourceRemovalPolicy(removalPolicy));
  }

  /**
   * Set the runtime version on AWS-vended custom resources lambdas.
   *
   * This feature is currently experimental.
   */
  public addLambdaRuntime(lambdaRuntime: lambda.Runtime) {
    Aspects.of(this.scope).add(new CustomResourceLambdaRuntime(lambdaRuntime));
  }

}

/**
 * Manages log retention for AWS-vended custom resources.
 *
 * This feature is currently experimental.
 */
export class CustomResourceLogRetention implements IAspect {
  private readonly logRetention: logs.RetentionDays;

  constructor(setLogRetention: logs.RetentionDays) {
    this.logRetention = setLogRetention;
  }
  visit(node: IConstruct) {
    for (const metadataEntry of node.node.metadata as MetadataEntry[]) {
      if (metadataEntry.type == CUSTOM_RESOURCE_SINGLETON_LOG_GROUP) {
        const localNode = node.node.defaultChild as logs.CfnLogGroup;
        localNode.addPropertyOverride('RetentionInDays', this.logRetention);
      }

      if (metadataEntry.type == CUSTOM_RESOURCE_SINGLETON) {
        const localNode = node.node.defaultChild as lambda.CfnFunction;

        if (localNode && !localNode.loggingConfig) {
          const newLogGroup = this.createLogGroup(localNode);
          localNode.addPropertyOverride('LoggingConfig', {
            LogGroup: newLogGroup.logGroupName,
          });
        }
      }

      if (metadataEntry.type == CUSTOM_RESOURCE_SINGLETON_LOG_RETENTION) {
        let localNode = node.node.defaultChild as cloudformation.CfnCustomResource;
        localNode.addPropertyOverride('RetentionInDays', this.logRetention);
      }
    }
  }

  /*
   * Creates a new logGroup and associates with the singletonLambda
   * Returns a Cloudwatch LogGroup
   */
  private createLogGroup(scope: lambda.CfnFunction): logs.ILogGroup {
    const newLogGroup = new logs.LogGroup(scope, 'logGroup', {
      retention: this.logRetention,
    });
    newLogGroup.node.addMetadata(`${CUSTOM_RESOURCE_SINGLETON_LOG_GROUP}`, true);
    return newLogGroup;
  }
}

/**
 * Manages removal policy for AWS-vended custom resources.
 *
 * This feature is currently experimental.
 */
export class CustomResourceRemovalPolicy implements IAspect {
  private readonly removalPolicy: RemovalPolicy;

  constructor(removalPolicy: RemovalPolicy) {
    this.removalPolicy = removalPolicy;
  }
  visit(node: IConstruct) {
    for (const metadataEntry of node.node.metadata as MetadataEntry[]) {
      if (metadataEntry.type == CUSTOM_RESOURCE_SINGLETON_LOG_GROUP) {
        const localNode = node.node.defaultChild as logs.CfnLogGroup;
        localNode.applyRemovalPolicy(this.removalPolicy);
      }
    }
  }
}

/**
 * Manages lambda runtime for AWS-vended custom resources.
 *
 * This feature is currently experimental.
 */
export class CustomResourceLambdaRuntime implements IAspect {
  private readonly lambdaRuntime: lambda.Runtime;

  constructor(lambdaRuntime: lambda.Runtime) {
    this.lambdaRuntime = lambdaRuntime;
  }
  visit(node: IConstruct) {
    for (const metadataEntry of node.node.metadata as MetadataEntry[]) {
      if (metadataEntry.type == CUSTOM_RESOURCE_RUNTIME_FAMILY) {
        if (metadataEntry.data == this.lambdaRuntime.family) {
          const localNode = node.node.defaultChild as lambda.CfnFunction;
          localNode.addPropertyOverride('Runtime', this.lambdaRuntime.toString());
        }
      }
    }
  }
}
