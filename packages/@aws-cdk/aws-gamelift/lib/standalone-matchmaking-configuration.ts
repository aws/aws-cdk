import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as gamelift from './gamelift.generated';
import { MatchmakingConfigurationProps, MatchmakingConfigurationBase, IMatchmakingConfiguration } from './matchmaking-configuration';

/**
 * Properties for a new standalone matchmaking configuration
 */
export interface StandaloneMatchmakingConfigurationProps extends MatchmakingConfigurationProps {}

/**
 *
 * @see https://docs.aws.amazon.com/gamelift/latest/fleetiqguide/gsg-intro.html
 *
 * @resource AWS::GameLift::MatchmakingConfiguration
 */
export class StandaloneMatchmakingConfiguration extends MatchmakingConfigurationBase {

  /**
     * Import an existing matchmaking configuration from its identifier.
     */
  static fromQueuedMatchmakingConfigurationId(scope: Construct, id: string, matchmakingConfigurationId: string): IMatchmakingConfiguration {
    return this.fromMatchmakingConfigurationAttributes(scope, id, { matchmakingConfigurationId: matchmakingConfigurationId });
  }

  /**
     * Import an existing matchmaking configuration from its ARN.
     */
  static fromQueuedMatchmakingConfigurationArn(scope: Construct, id: string, matchmakingConfigurationArn: string): IMatchmakingConfiguration {
    return this.fromMatchmakingConfigurationAttributes(scope, id, { matchmakingConfigurationArn: matchmakingConfigurationArn });
  }

  /**
       * The Identifier of the matchmaking configuration.
       */
  public matchmakingConfigurationId: string;
  /**
       * The ARN of the matchmaking configuration.
       */
  public matchmakingConfigurationArn: string;

  private readonly gameSessionQueues: string[] = [];

  constructor(scope: Construct, id: string, props: StandaloneMatchmakingConfigurationProps) {
    super(scope, id, {
      physicalName: props.matchmakingConfigurationName,
    });

    if (!cdk.Token.isUnresolved(props.matchmakingConfigurationName)) {
      if (props.matchmakingConfigurationName.length > 128) {
        throw new Error(`Matchmaking configuration name can not be longer than 128 characters but has ${props.matchmakingConfigurationName.length} characters.`);
      }

      if (!/^[a-zA-Z0-9-\.]+$/.test(props.matchmakingConfigurationName)) {
        throw new Error(`Matchmaking configuration name ${props.matchmakingConfigurationName} can contain only letters, numbers, hyphens, back slash or dot with no spaces.`);
      }
    }

    if (props.description && !cdk.Token.isUnresolved(props.description)) {
      if (props.description.length > 1024) {
        throw new Error(`Matchmaking configuration description can not be longer than 1024 characters but has ${props.description.length} characters.`);
      }
    }

    if (props.customEventData && props.customEventData.length > 256) {
      throw new Error(`Matchmaking configuration custom event data can not be longer than 256 characters but has ${props.customEventData.length} characters.`);
    }

    if (props.acceptanceTimeout && props.acceptanceTimeout.toSeconds() > 600) {
      throw new Error(`Matchmaking configuration acceptance timeout can not exceed 600 seconds, actual ${props.acceptanceTimeout.toSeconds()} seconds.`);
    }

    if (props.requestTimeout && props.requestTimeout.toSeconds() > 43200) {
      throw new Error(`Matchmaking configuration request timeout can not exceed 43200 seconds, actual ${props.requestTimeout.toSeconds()} seconds.`);
    }

    const resource = new gamelift.CfnMatchmakingConfiguration(this, 'Resource', {
      name: this.physicalName,
      acceptanceRequired: props.requireAcceptance,
      acceptanceTimeoutSeconds: props.acceptanceTimeout && props.acceptanceTimeout.toSeconds(),
      customEventData: props.customEventData,
      description: props.description,
      flexMatchMode: 'STANDALONE',
      notificationTarget: props.notificationTarget && props.notificationTarget.topicArn,
      requestTimeoutSeconds: props.requestTimeout && props.requestTimeout.toSeconds() || cdk.Duration.seconds(300).toSeconds(),
      ruleSetName: props.ruleSet.matchmakingRuleSetArn,
    });

    this.matchmakingConfigurationId = this.getResourceNameAttribute(resource.ref);
    this.matchmakingConfigurationArn = cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'matchmakingconfiguration',
      resourceName: this.matchmakingConfigurationId,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
  }
}