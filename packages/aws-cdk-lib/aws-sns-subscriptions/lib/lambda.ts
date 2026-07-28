import { Construct } from 'constructs';
import type { SubscriptionProps } from './subscription';
import type * as lambda from '../../aws-lambda';
import * as sns from '../../aws-sns';
import { Names, ValidationError } from '../../core';
import { regionFromArn, snsServicePrincipals } from './private/util';
import { lit } from '../../core/lib/private/literal-string';

/**
 * Properties for a Lambda subscription
 */
export interface LambdaSubscriptionProps extends SubscriptionProps {
  /**
   * Whether the default SNS service principal (`sns.amazonaws.com`) should be granted
   * permission to invoke this Lambda function.
   *
   * Set this to `false` only if the topic lives in an opt-in region and the subscriber
   * should not also accept invocations from default-enabled regions.
   *
   * @default true
   */
  readonly includeDefaultServicePrincipal?: boolean;

  /**
   * Additional opt-in regions whose regionalized SNS service principals
   * (`sns.<region>.amazonaws.com`) should be granted permission to invoke this Lambda function.
   *
   * Required when the topic lives in an opt-in region and the subscriber lives in a
   * different region.
   *
   * @see https://docs.aws.amazon.com/sns/latest/dg/sns-cross-region-delivery.html
   * @default - none
   */
  readonly additionalServicePrincipalRegions?: string[];
}
/**
 * Use a Lambda function as a subscription target
 */
export class LambdaSubscription implements sns.ITopicSubscription {
  constructor(private readonly fn: lambda.IFunction, private readonly props: LambdaSubscriptionProps = {}) {
  }

  /**
   * Returns a configuration for a Lambda function to subscribe to an SNS topic
   */
  public bind(topic: sns.ITopic): sns.TopicSubscriptionConfig {
    // Create subscription under *consuming* construct to make sure it ends up
    // in the correct stack in cases of cross-stack subscriptions.
    if (!Construct.isConstruct(this.fn)) {
      throw new ValidationError(lit`SuppliedLambdaFunctionObjectInstance`, 'The supplied lambda Function object must be an instance of Construct', topic);
    }

    const principals = snsServicePrincipals(topic, {
      includeDefault: this.props.includeDefaultServicePrincipal ?? true,
      regions: this.props.additionalServicePrincipalRegions ?? [],
    });

    const baseId = `AllowInvoke:${Names.nodeUniqueId(topic.node)}`;
    for (const { idSuffix, principal } of principals) {
      this.fn.addPermission(idSuffix ? `${baseId}:${idSuffix}` : baseId, {
        sourceArn: topic.topicArn,
        principal,
      });
    }

    // if the topic and function are created in different stacks
    // then we need to make sure the topic is created first
    if (topic instanceof sns.Topic && topic.stack !== this.fn.stack) {
      this.fn.stack.addStackDependency(topic.stack);
    }

    return {
      subscriberScope: this.fn,
      subscriberId: topic.node.id,
      endpoint: this.fn.functionArn,
      protocol: sns.SubscriptionProtocol.LAMBDA,
      filterPolicy: this.props.filterPolicy,
      filterPolicyWithMessageBody: this.props.filterPolicyWithMessageBody,
      region: regionFromArn(topic, this.fn),
      deadLetterQueue: this.props.deadLetterQueue,
      deadLetterQueueServicePrincipals: principals.map(p => p.principal),
    };
  }
}
