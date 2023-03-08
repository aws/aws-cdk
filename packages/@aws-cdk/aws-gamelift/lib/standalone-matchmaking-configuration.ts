import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as gamelift from './gamelift.generated';
import { MatchmakingConfigurationProps, MatchmakingConfigurationBase, IMatchmakingConfiguration } from './matchmaking-configuration';

/**
 * Properties for a new standalone matchmaking configuration
 */
export interface StandaloneMatchmakingConfigurationProps extends MatchmakingConfigurationProps {}

/**
 * A FlexMatch matchmaker process does the work of building a game match.
 * It manages the pool of matchmaking requests received, forms teams for a match, processes and selects players to find the best possible player groups, and initiates the process of placing and starting a game session for the match.
 * This topic describes the key aspects of a matchmaker and how to configure one customized for your game.
 *
 * @see https://docs.aws.amazon.com/gamelift/latest/flexmatchguide/match-configuration.html
 *
 * @resource AWS::GameLift::MatchmakingConfiguration
 */
export class StandaloneMatchmakingConfiguration extends MatchmakingConfigurationBase {

  /**
     * Import an existing matchmaking configuration from its name.
     */
  static fromStandaloneMatchmakingConfigurationName(scope: Construct, id: string, matchmakingConfigurationName: string): IMatchmakingConfiguration {
    return this.fromMatchmakingConfigurationAttributes(scope, id, { matchmakingConfigurationName });
  }

  /**
     * Import an existing matchmaking configuration from its ARN.
     */
  static fromStandaloneMatchmakingConfigurationArn(scope: Construct, id: string, matchmakingConfigurationArn: string): IMatchmakingConfiguration {
    return this.fromMatchmakingConfigurationAttributes(scope, id, { matchmakingConfigurationArn });
  }

  /**
   * The Identifier of the matchmaking configuration.
   */
  public readonly matchmakingConfigurationName: string;
  /**
   * The ARN of the matchmaking configuration.
   */
  public readonly matchmakingConfigurationArn: string;
  /**
   * The notification target for matchmaking events
   */
  public readonly notificationTarget?: sns.ITopic;

  constructor(scope: Construct, id: string, props: StandaloneMatchmakingConfigurationProps) {
    super(scope, id, {
      physicalName: props.matchmakingConfigurationName,
    });

    if (props.matchmakingConfigurationName && !cdk.Token.isUnresolved(props.matchmakingConfigurationName)) {
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

    //Notification target
    this.notificationTarget = props.notificationTarget;
    if (!this.notificationTarget) {
      this.notificationTarget = new sns.Topic(this, 'Topic', {});
    }
    // Be sure to add the right TopicPolicy to enable gamelift publish action to given topic
    const topicPolicy = new sns.TopicPolicy(this, 'TopicPolicy', {
      topics: [this.notificationTarget],
    });
    topicPolicy.document.addStatements(new iam.PolicyStatement({
      actions: ['sns:Publish'],
      principals: [new iam.ServicePrincipal('gamelift.amazonaws.com')],
      resources: [this.notificationTarget.topicArn],
    }));

    const resource = new gamelift.CfnMatchmakingConfiguration(this, 'Resource', {
      name: this.physicalName,
      acceptanceRequired: Boolean(props.requireAcceptance),
      acceptanceTimeoutSeconds: props.acceptanceTimeout && props.acceptanceTimeout.toSeconds(),
      customEventData: props.customEventData,
      description: props.description,
      flexMatchMode: 'STANDALONE',
      notificationTarget: this.notificationTarget.topicArn,
      requestTimeoutSeconds: props.requestTimeout && props.requestTimeout.toSeconds() || cdk.Duration.seconds(300).toSeconds(),
      ruleSetName: props.ruleSet.matchmakingRuleSetName,
    });

    this.matchmakingConfigurationName = this.getResourceNameAttribute(resource.ref);
    this.matchmakingConfigurationArn = cdk.Stack.of(scope).formatArn({
      service: 'gamelift',
      resource: 'matchmakingconfiguration',
      resourceName: this.matchmakingConfigurationName,
      arnFormat: cdk.ArnFormat.SLASH_RESOURCE_NAME,
    });
  }
}