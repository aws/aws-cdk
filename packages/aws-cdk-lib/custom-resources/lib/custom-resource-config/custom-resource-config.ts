import { IConstruct, MetadataEntry } from 'constructs';
import * as cloudformation from '../../../aws-cloudformation';
import * as lambda from '../../../aws-lambda';
import * as logs from '../../../aws-logs';
import { IAspect, Aspects } from '../../../core/lib';

export const CUSTOM_RESOURCE_PROVIDER = 'aws:cdk:is-custom-resource-handler-customResourceProvider';
export const CUSTOM_RESOURCE_SINGLETON = 'aws:cdk:is-custom-resource-handler-singleton';
export const CUSTOM_RESOURCE_SINGLETON_LOG_GROUP = 'aws:cdk:is-custom-resource-handler-logGroup';
export const CUSTOM_RESOURCE_SINGLETON_LOG_RETENTION = 'aws:cdk:is-custom-resource-handler-logRetention';

/**
 * Manages AWS vended Custom Resources
 */
export class CustomResourceConfig {
  /**
   * Returns the tags API for this scope.
   * @param scope The scope
   */
  public static of(scope: IConstruct): CustomResourceConfig {
    return new CustomResourceConfig(scope);
  }

  private constructor(private readonly scope: IConstruct) { }

  /**
   * Set the log retention specified on AWS vended custom resources that have certain CDK metadata from the CDK library.
   */
  public addLogRetentionLifetime(rentention: logs.RetentionDays) {
    Aspects.of(this.scope).add(new CustomResourceLogRetention(rentention));
  }
}

/**
 * Manages log retention for AWS vended custom resources within a construct scope.
 */
export class CustomResourceLogRetention implements IAspect {
  private readonly SET_LOG_RETENTION: logs.RetentionDays;

  constructor(setLogRetention: logs.RetentionDays) {
    this.SET_LOG_RETENTION = setLogRetention;
  }
  visit(node: IConstruct) {
    for (const metadataEntry of node.node.metadata as MetadataEntry[]) {
      if (metadataEntry.type == CUSTOM_RESOURCE_SINGLETON_LOG_GROUP) {
        const localNode = node.node.defaultChild as logs.CfnLogGroup;
        localNode.addPropertyOverride('RetentionInDays', this.SET_LOG_RETENTION);
      }

      if (metadataEntry.type == CUSTOM_RESOURCE_SINGLETON) {
        const localNode = node.node.defaultChild as lambda.CfnFunction;

        if (localNode && !localNode.loggingConfig) {
          localNode.addPropertyOverride('LoggingConfig', {
            LogGroup: this.createNewLogGroupForSingletonFunction(localNode).logGroupName,
          });
        }
      }

      if (metadataEntry.type == CUSTOM_RESOURCE_SINGLETON_LOG_RETENTION) {
        let localNode = node.node.defaultChild as cloudformation.CfnCustomResource;
        localNode.addPropertyOverride('RetentionInDays', this.SET_LOG_RETENTION);
      }
    }
  }

  /*
   * Creates a new logGroup and associates with the singletonLambda
   * Returns a Cloudwatch LogGroup
   * @param {lambda.CfnFunction} scope - SingletonFunction
   */
  private createNewLogGroupForSingletonFunction(scope: lambda.CfnFunction): logs.ILogGroup {
    return new logs.LogGroup(scope, 'logGroup', {
      retention: this.SET_LOG_RETENTION,
    });
  }
}
