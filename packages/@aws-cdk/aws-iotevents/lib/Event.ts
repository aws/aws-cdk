import { IGrantable } from "@aws-cdk/aws-iam";
import { CfnDeliveryStream } from "@aws-cdk/aws-kinesisfirehose";
import { IFunction } from "@aws-cdk/aws-lambda";
import { ITopic } from "@aws-cdk/aws-sns";
import { IQueue } from "@aws-cdk/aws-sqs";
import { Duration, Lazy } from "@aws-cdk/core";
import { IDetectorModel } from "./DetectorModel";
import { CfnDetectorModel } from "./iotevents.generated";
export type AnyEventProperty =
  | CfnDetectorModel.EventProperty
  | CfnDetectorModel.TransitionEventProperty;

/**
 * Event specification
 *
 * @export
 * @interface IEvent
 */
export interface IEvent {
  /**
   * The event name
   *
   * @type {string}
   * @memberof IEvent
   */
  readonly name: string;

  /**
   * Optional condition for the event
   *
   * @type {(string | undefined)}
   * @memberof IEvent
   */
  readonly condition: string | undefined;

  /**
   * Generate the CFN
   *
   * @param {IGrantable} grantable
   * @returns {AnyEventProperty}
   * @memberof IEvent
   * @internal
   */
  _cfn(grantable: IGrantable): AnyEventProperty;

  /**
   * Action to clear a timer
   *
   * @param {string} name the timer name
   * @returns {Event}
   * @memberof IEvent
   */
  clearTimer(name: string): Event;

  /**
   * Action to publish to Kinesis Firehose
   *
   * @param {CfnDeliveryStream} deliveryStream
   * @param {(string | "\n")} [separator]
   * @returns {Event}
   * @memberof IEvent
   */
  addFirehose(
    deliveryStream: CfnDeliveryStream,
    separator?: string | "\n"
  ): Event;

  /**
   * Action to republish into another {@link DetectorModel}
   *
   * @param {IDetectorModel} detectorModel
   * @returns {Event}
   * @memberof IEvent
   */
  republish(detectorModel: IDetectorModel): Event;

  /**
   * Action to publish to an IoT Topic
   *
   * @param {string} topicRule
   * @returns {Event}
   * @memberof IEvent
   */
  publishToIotTopic(topicRule: string): Event;

  /**
   * Action to call a lambda function
   *
   * @param {IFunction} func
   * @returns {Event}
   * @memberof IEvent
   */
  addLambda(func: IFunction): Event;

  /**
   * Action to reset a timer
   *
   * @param {string} name
   * @returns {Event}
   * @memberof IEvent
   */
  resetTimer(name: string): Event;

  /**
   * Action to set a variable
   *
   * @param {string} name
   * @param {string} value
   * @returns {Event}
   * @memberof IEvent
   */
  setVariable(name: string, value: string): Event;

  /**
   * Action to set a timer
   *
   * @param {string} name
   * @param {Duration} duration
   * @returns {Event}
   * @memberof IEvent
   * @throws {Error} if duration is less than 60 seconds
   */
  setTimer(name: string, duration: Duration): Event;

  /**
   * Action to send a SNS
   *
   * @param {ITopic} topic
   * @returns {Event}
   * @memberof IEvent
   */
  addSNS(topic: ITopic): Event;

  /**
   * Action to publish into an SQS
   *
   * @param {IQueue} queue
   * @param {(boolean | true)} [useBase64]
   * @returns {Event}
   * @memberof IEvent
   */
  addSQS(queue: IQueue, useBase64?: boolean | true): Event;
}

/* tslint:disable:callable-types */
/**
 * Points to a function
 *
 * @export
 * @interface FunctionPointer
 */
export interface FunctionPointer {
  (grantable: IGrantable): void;
}
/* tslint:enable:callable-types */

/**
 * IotEvents Event
 *
 * @export
 * @class Event
 * @implements {IEvent}
 */
export class Event implements IEvent {
  public readonly condition: string | undefined;
  public readonly name: string;
  protected actions: CfnDetectorModel.ActionProperty[] = [];
  protected grants: FunctionPointer[] = [];
  public constructor(name: string, condition?: string) {
    this.name = name;
    this.condition = condition;
  }
  /**
   * @internal
   */
  public _cfn(grantable: IGrantable): AnyEventProperty {
    this.processGrants(grantable);
    return {
      eventName: this.name,
      condition: this.condition,
      actions: this.actions,
    };
  }

  public addFirehose(
    deliveryStream: CfnDeliveryStream,
    separator?: string | "\n"
  ): Event {
    this.actions.push({
      firehose: {
        deliveryStreamName: deliveryStream.deliveryStreamName,
        separator,
      },
    });
    return this;
  }
  public addLambda(func: IFunction): Event {
    this.grants.push((grantable: IGrantable) => func.grantInvoke(grantable));

    this.actions.push({
      lambda: {
        functionArn: Lazy.stringValue({ produce: () => func.functionArn }),
      },
    });
    return this;
  }
  public addSNS(topic: ITopic): Event {
    this.grants.push((grantable: IGrantable) => topic.grantPublish(grantable));
    this.actions.push({
      sns: { targetArn: Lazy.stringValue({ produce: () => topic.topicArn }) },
    });
    return this;
  }
  public addSQS(queue: IQueue, useBase64?: boolean | undefined): Event {
    this.grants.push((grantable: IGrantable) =>
      queue.grantSendMessages(grantable)
    );

    this.actions.push({
      sqs: {
        queueUrl: Lazy.stringValue({ produce: () => queue.queueUrl }),
        useBase64,
      },
    });
    return this;
  }

  public clearTimer(name: string): Event {
    this.actions.push({ clearTimer: { timerName: name } });
    return this;
  }
  public publishToIotTopic(mqttTopic: string): Event {
    this.actions.push({
      iotTopicPublish: { mqttTopic },
    });
    return this;
  }
  public republish(detectorModel: IDetectorModel): Event {
    this.actions.push({
      iotEvents: {
        inputName: Lazy.stringValue({
          produce: () => detectorModel.detectorModelName,
        }),
      },
    });
    return this;
  }
  public resetTimer(name: string): Event {
    this.actions.push({ resetTimer: { timerName: name } });
    return this;
  }
  public setTimer(name: string, duration: Duration): Event {
    const seconds = duration.toSeconds();

    if (seconds < 60) {
      throw Error("The minimum valid duration for setTimer() is 60 seconds");
    }
    this.actions.push({ setTimer: { timerName: name, seconds } });
    return this;
  }
  public setVariable(name: string, value: string): Event {
    this.actions.push({ setVariable: { variableName: name, value } });
    return this;
  }

  protected processGrants(grantable: IGrantable) {
    this.grants.forEach(grant => {
      grant(grantable);
    });
  }
}
