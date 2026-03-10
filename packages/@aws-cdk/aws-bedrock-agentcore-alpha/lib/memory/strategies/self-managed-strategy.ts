/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import * as cdk from 'aws-cdk-lib';
import type * as bedrockagentcore from 'aws-cdk-lib/aws-bedrockagentcore';
import * as iam from 'aws-cdk-lib/aws-iam';
import type { Location } from 'aws-cdk-lib/aws-s3';
import type * as sns from 'aws-cdk-lib/aws-sns';
import type { IConstruct } from 'constructs';
import type { IMemoryStrategy, MemoryStrategyCommonProps, MemoryStrategyType } from '../memory-strategy';
import { MEMORY_NAME_MIN_LENGTH, MEMORY_NAME_MAX_LENGTH } from '../memory-strategy';
import { validateStringFieldLength, throwIfInvalid, validateFieldPattern } from '../validation-helpers';

/******************************************************************************
 *                              CONSTANTS
 *****************************************************************************/
/**
 * Minimum value for time-based trigger in seconds
 * @internal
 */
const TIME_BASED_TRIGGER_MIN = 10;
/**
 * Maximum value for time-based trigger in seconds
 * @internal
 */
const TIME_BASED_TRIGGER_MAX = 3000;
/**
 * Minimum value for token-based trigger
 * @internal
 */
const TOKEN_BASED_TRIGGER_MIN = 100;
/**
 * Maximum value for token-based trigger
 * @internal
 */
const TOKEN_BASED_TRIGGER_MAX = 500000;
/**
 * Minimum value for message-based trigger
 * @internal
 */
const MESSAGE_BASED_TRIGGER_MIN = 1;
/**
 * Maximum value for message-based trigger
 * @internal
 */
const MESSAGE_BASED_TRIGGER_MAX = 50;
/**
 * Minimum value for historical context window size
 * @internal
 */
const HISTORICAL_CONTEXT_WINDOW_SIZE_MIN = 0;
/**
 * Maximum value for historical context window size
 * @internal
 */
const HISTORICAL_CONTEXT_WINDOW_SIZE_MAX = 50;
/**
 * Default value for historical context window size
 * @internal
 */
const DEFAULT_HISTORICAL_CONTEXT_WINDOW_SIZE = 4;
/**
 * Default value for message-based trigger
 * @internal
 */
const DEFAULT_MESSAGE_BASED_TRIGGER = 1;
/**
 * Default value for time-based trigger
 * @internal
 */
const DEFAULT_TIME_BASED_TRIGGER = cdk.Duration.seconds(10);
/**
 * Default value for token-based trigger
 * @internal
 */
const DEFAULT_TOKEN_BASED_TRIGGER = 100;

/**
 * Trigger conditions for self managed memory strategy
 * When first condition is met, batched payloads are sent to specified S3 bucket.
 */
export interface TriggerConditions {
  /**
   * Triggers memory processing when specified number of new messages is reached
   * @default 1
   */
  readonly messageBasedTrigger?: number;
  /**
   * Triggers memory processing when the session has been idle for the specified duration.
   * Value in seconds.
   * @default - 10 seconds
   */
  readonly timeBasedTrigger?: cdk.Duration;
  /**
   * Triggers memory processing when the token size reaches the specified threshold.
   * @default 100
   */
  readonly tokenBasedTrigger?: number;
}

/**
 * Invocation configuration for self managed memory strategy
 */
export interface InvocationConfiguration {
  /**
   * SNS Topic Configuration
   */
  readonly topic: sns.ITopic;
  /**
   * S3 Location Configuration
   */
  readonly s3Location: Location;
}

/**
 * Configuration parameters for a self managed memory strategy
 * existing built-in default prompts/models
 */
export interface SelfManagedStrategyProps extends MemoryStrategyCommonProps {
  /**
   * Define the number of previous events to be included when processing memory. A larger history window provides more context from past conversations.
   * @default 4
   */
  readonly historicalContextWindowSize?: number;
  /**
   * Invocation configuration for self managed memory strategy
   */
  readonly invocationConfiguration: InvocationConfiguration;
  /**
   * Trigger conditions for self managed memory strategy
   * @default - undefined
   */
  readonly triggerConditions?: TriggerConditions;
}

/**
 * Use AgentCore memory for event storage with custom triggers. Define memory processing logic in your own environment.
 */
export class SelfManagedMemoryStrategy implements IMemoryStrategy {
  public readonly name: string;
  public readonly description?: string;
  public readonly strategyType: MemoryStrategyType;
  /**
   * Invocation configuration for self managed memory strategy
   */
  public readonly invocationConfiguration: InvocationConfiguration;
  /**
   * Trigger conditions for self managed memory strategy
   */
  public readonly triggerConditions: TriggerConditions;
  /**
   * Historical context window size for self managed memory strategy
   */
  public readonly historicalContextWindowSize: number;

  constructor(strategyType: MemoryStrategyType, props: SelfManagedStrategyProps) {
    this.name = props.name;
    this.description = props.description;
    this.strategyType = strategyType;
    this.invocationConfiguration = props.invocationConfiguration;
    this.triggerConditions = {
      messageBasedTrigger: props.triggerConditions?.messageBasedTrigger ?? DEFAULT_MESSAGE_BASED_TRIGGER,
      timeBasedTrigger: props.triggerConditions?.timeBasedTrigger ?? DEFAULT_TIME_BASED_TRIGGER,
      tokenBasedTrigger: props.triggerConditions?.tokenBasedTrigger ?? DEFAULT_TOKEN_BASED_TRIGGER,
    };
    this.historicalContextWindowSize = props.historicalContextWindowSize ?? DEFAULT_HISTORICAL_CONTEXT_WINDOW_SIZE;

    // ------------------------------------------------------
    // Validations
    // ------------------------------------------------------
    throwIfInvalid(this._validateMemoryStrategyName, this.name);
    throwIfInvalid(this._validateHistoricalContextWindowSize, this.historicalContextWindowSize);
    throwIfInvalid(this._validateTriggerConditions, this.triggerConditions);
  }

  public render(): bedrockagentcore.CfnMemory.MemoryStrategyProperty {
    return {
      customMemoryStrategy: {
        name: this.name,
        description: this.description,
        type: this.strategyType,
        configuration: {
          selfManagedConfiguration: {
            historicalContextWindowSize: this.historicalContextWindowSize,
            invocationConfiguration: {
              topicArn: this.invocationConfiguration.topic.topicArn,
              payloadDeliveryBucketName: this.invocationConfiguration.s3Location.bucketName,
            },
            triggerConditions: [
              {
                messageBasedTrigger: {
                  messageCount: this.triggerConditions.messageBasedTrigger,
                },
              },
              {
                timeBasedTrigger: {
                  idleSessionTimeout: this.triggerConditions.timeBasedTrigger?.toSeconds(),
                },
              },
              {
                tokenBasedTrigger: {
                  tokenCount: this.triggerConditions.tokenBasedTrigger,
                },
              },
            ],
          },
        },
      },
    } as any; // Type assertion to work around CloudFormation type limitations
  }

  /**
   * Grants the necessary permissions to the role
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee - The grantee to grant permissions to
   * @returns The Grant object for chaining
   */
  public grant(grantee: iam.IGrantable): iam.Grant | undefined {
    // no existing grant method that provides both required sns actions
    const grant1 = iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: ['sns:GetTopicAttributes', 'sns:Publish'],
      resourceArns: [
        this.invocationConfiguration.topic.topicArn,
      ],
    });

    let grant2: iam.Grant | undefined;

    // we don't have the scope here, so we add manually the permissions to the role policy
    if (this.invocationConfiguration?.s3Location) {
      // Grant S3 permissions for the specified location
      grant2 = iam.Grant.addToPrincipal({
        grantee: grantee,
        actions: [
          's3:GetBucketLocation',
          's3:PutObject',
        ],
        resourceArns: [
          `arn:${cdk.Aws.PARTITION}:s3:::${this.invocationConfiguration.s3Location.bucketName}`,
          `arn:${cdk.Aws.PARTITION}:s3:::${this.invocationConfiguration.s3Location.bucketName}/*`,
        ],
      });
    }

    return grant1 && grant2 ? grant1.combine(grant2) : grant1 || grant2;
  }

  // ------------------------------------------------------
  // VALIDATORS
  // ------------------------------------------------------
  /**
   * Validates the memory strategy name
   * @param name - The name to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validateMemoryStrategyName = (name: string, scope?: IConstruct): string[] => {
    let errors: string[] = [];

    errors.push(...validateStringFieldLength({
      value: name,
      fieldName: 'Memory name',
      minLength: MEMORY_NAME_MIN_LENGTH,
      maxLength: MEMORY_NAME_MAX_LENGTH,
    }, scope));

    // Check if name matches the AWS API pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
    // Must start with a letter, followed by up to 47 letters, numbers, or underscores
    const validNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/;
    errors.push(...validateFieldPattern(name, 'Memory name', validNamePattern, undefined, scope));

    return errors;
  };

  /**
   * Validates the historical context window size
   * @param historicalContextWindowSize - The historical context window size to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validateHistoricalContextWindowSize = (historicalContextWindowSize: number): string[] => {
    let errors: string[] = [];

    if (historicalContextWindowSize < HISTORICAL_CONTEXT_WINDOW_SIZE_MIN
        || historicalContextWindowSize > HISTORICAL_CONTEXT_WINDOW_SIZE_MAX) {
      errors.push(`Historical context window size must be between ${HISTORICAL_CONTEXT_WINDOW_SIZE_MIN} and ${HISTORICAL_CONTEXT_WINDOW_SIZE_MAX}, got ${historicalContextWindowSize}`);
    }

    return errors;
  };

  /**
   * Validates the trigger conditions
   * @param triggerConditions - The trigger conditions to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validateTriggerConditions = (triggerConditions: TriggerConditions): string[] => {
    let errors: string[] = [];

    // Validate message-based trigger
    if (triggerConditions.messageBasedTrigger !== undefined) {
      if (triggerConditions.messageBasedTrigger < MESSAGE_BASED_TRIGGER_MIN
        || triggerConditions.messageBasedTrigger > MESSAGE_BASED_TRIGGER_MAX) {
        errors.push(`Message-based trigger must be between ${MESSAGE_BASED_TRIGGER_MIN} and ${MESSAGE_BASED_TRIGGER_MAX}, got ${triggerConditions.messageBasedTrigger}`);
      }
    }

    // Validate time-based trigger
    if (triggerConditions.timeBasedTrigger !== undefined) {
      const seconds = triggerConditions.timeBasedTrigger.toSeconds();
      if (seconds < TIME_BASED_TRIGGER_MIN || seconds > TIME_BASED_TRIGGER_MAX) {
        errors.push(`Time-based trigger must be between ${TIME_BASED_TRIGGER_MIN} and ${TIME_BASED_TRIGGER_MAX} seconds, got ${seconds}`);
      }
    }

    // Validate token-based trigger
    if (triggerConditions.tokenBasedTrigger !== undefined) {
      if (triggerConditions.tokenBasedTrigger < TOKEN_BASED_TRIGGER_MIN || triggerConditions.tokenBasedTrigger > TOKEN_BASED_TRIGGER_MAX) {
        errors.push(`Token-based trigger must be between ${TOKEN_BASED_TRIGGER_MIN} and ${TOKEN_BASED_TRIGGER_MAX}, got ${triggerConditions.tokenBasedTrigger}`);
      }
    }

    return errors;
  };
}
