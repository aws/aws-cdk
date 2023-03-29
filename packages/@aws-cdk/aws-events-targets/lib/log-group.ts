import * as events from '@aws-cdk/aws-events';
import { RuleTargetInputProperties, RuleTargetInput, EventField, IRule } from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as cdk from '@aws-cdk/core';
import { ArnFormat, Stack } from '@aws-cdk/core';
import { LogGroupResourcePolicy } from './log-group-resource-policy';
import { TargetBaseProps, bindBaseTargetConfig } from './util';

/**
 * Options used when creating a target input template
 */
export interface LogGroupTargetInputOptions {
  /**
   * The timestamp that will appear in the CloudWatch Logs record
   *
   * @default EventField.time
   */
  readonly timestamp?: any;

  /**
   * The value provided here will be used in the Log "message" field.
   *
   * This field must be a string. If an object is passed (e.g. JSON data)
   * it will not throw an error, but the message that makes it to
   * CloudWatch logs will be incorrect. This is a likely scenario if
   * doing something like: EventField.fromPath('$.detail') since in most cases
   * the `detail` field contains JSON data.
   *
   * @default EventField.detailType
   */
  readonly message?: any;
}

/**
 * The input to send to the CloudWatch LogGroup target
 */
export abstract class LogGroupTargetInput {

  /**
   * Pass a JSON object to the the log group event target
   *
   * May contain strings returned by `EventField.from()` to substitute in parts of the
   * matched event.
   */
  public static fromObject(options?: LogGroupTargetInputOptions): RuleTargetInput {
    return RuleTargetInput.fromObject({
      timestamp: options?.timestamp ?? EventField.time,
      message: options?.message ?? EventField.detailType,
    });
  };

  /**
   * Return the input properties for this input object
   */
  public abstract bind(rule: IRule): RuleTargetInputProperties;
}

/**
 * Customize the CloudWatch LogGroup Event Target
 */
export interface LogGroupProps extends TargetBaseProps {
  /**
   * The event to send to the CloudWatch LogGroup
   *
   * This will be the event logged into the CloudWatch LogGroup
   *
   * @default - the entire EventBridge event
   * @deprecated use logEvent instead
   */
  readonly event?: events.RuleTargetInput;

  /**
   * The event to send to the CloudWatch LogGroup
   *
   * This will be the event logged into the CloudWatch LogGroup
   *
   * @default - the entire EventBridge event
   */
  readonly logEvent?: LogGroupTargetInput;
}

/**
 * Use an AWS CloudWatch LogGroup as an event rule target.
 */
export class CloudWatchLogGroup implements events.IRuleTarget {
  private target?: RuleTargetInputProperties;
  constructor(private readonly logGroup: logs.ILogGroup, private readonly props: LogGroupProps = {}) {}

  /**
   * Returns a RuleTarget that can be used to log an event into a CloudWatch LogGroup
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    // Use a custom resource to set the log group resource policy since it is not supported by CDK and cfn.
    const resourcePolicyId = `EventsLogGroupPolicy${cdk.Names.nodeUniqueId(_rule.node)}`;

    const logGroupStack = cdk.Stack.of(this.logGroup);

    if (this.props.event && this.props.logEvent) {
      throw new Error('Only one of "event" or "logEvent" can be specified');
    }

    this.target = this.props.event?.bind(_rule);
    if (this.target?.inputPath || this.target?.input) {
      throw new Error('CloudWatchLogGroup targets does not support input or inputPath');
    }

    _rule.node.addValidation({ validate: () => this.validateInputTemplate() });

    if (!this.logGroup.node.tryFindChild(resourcePolicyId)) {
      new LogGroupResourcePolicy(logGroupStack, resourcePolicyId, {
        policyStatements: [new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['logs:PutLogEvents', 'logs:CreateLogStream'],
          resources: [this.logGroup.logGroupArn],
          principals: [new iam.ServicePrincipal('events.amazonaws.com')],
        })],
      });
    }

    return {
      ...bindBaseTargetConfig(this.props),
      arn: logGroupStack.formatArn({
        service: 'logs',
        resource: 'log-group',
        arnFormat: ArnFormat.COLON_RESOURCE_NAME,
        resourceName: this.logGroup.logGroupName,
      }),
      input: this.props.event ?? this.props.logEvent,
      targetResource: this.logGroup,
    };
  }

  /**
   * Validate that the target event input template has the correct format.
   * The CloudWatchLogs target only supports a template with the format of:
   *   {"timestamp": <time>, "message": <message>}
   *
   * This is only needed if the deprecated `event` property is used.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutTargets.html
   */
  private validateInputTemplate(): string[] {
    if (this.target?.inputTemplate) {
      const resolvedTemplate = Stack.of(this.logGroup).resolve(this.target.inputTemplate);
      if (typeof(resolvedTemplate) === 'string') {
        // need to add the quotes back to the string so that we can parse the json
        // '{"timestamp": <time>}' -> '{"timestamp": "<time>"}'
        const quotedTemplate = resolvedTemplate.replace(new RegExp('(\<.*?\>)', 'g'), '"$1"');
        try {
          const inputTemplate = JSON.parse(quotedTemplate);
          const inputTemplateKeys = Object.keys(inputTemplate);
          if (inputTemplateKeys.length !== 2 ||
            (!inputTemplateKeys.includes('timestamp') || !inputTemplateKeys.includes('message'))) {
            return ['CloudWatchLogGroup targets only support input templates in the format {timestamp: <timestamp>, message: <message>}'];
          }
        } catch (e: any) {
          return ['Could not parse input template as JSON.\n' +
            'CloudWatchLogGroup targets only support input templates in the format {timestamp: <timestamp>, message: <message>}', e];
        }
      }
    }
    return [];
  }
}
