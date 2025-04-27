import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { AssignableStateOptions, JsonataCommonOptions, JsonPathCommonOptions, State, StateBaseProps } from './state';
import * as cdk from '../../../core';
import { Chain } from '../chain';
import { IChainable, INextable, QueryLanguage } from '../types';

/**
 * Represents the Wait state which delays a state machine from continuing for a specified time
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-wait-state.html
 */
export class WaitTime {
  /**
   * Wait a fixed amount of time.
   */
  public static duration(duration: cdk.Duration) { return new WaitTime({ Seconds: duration.toSeconds() }); }

  /**
   * Wait for a number of seconds stored in the state object from string.
   * This method can use JSONata expression.
   *
   * If you want to use fixed value, we recommend using `WaitTime.duration()`
   *
   * Example value: `{% $waitSeconds %}`
   */
  public static seconds(seconds: string) { return new WaitTime({ Seconds: seconds }); }

  /**
   * Wait until the given ISO8601 timestamp.
   * This method can use JSONata expression.
   *
   * Example value: `2016-03-14T01:59:00Z`
   */
  public static timestamp(timestamp: string) { return new WaitTime({ Timestamp: timestamp }); }

  /**
   * Wait for a number of seconds stored in the state object.
   *
   * Example value: `$.waitSeconds`
   */
  public static secondsPath(path: string) { return new WaitTime({ SecondsPath: path }); }

  /**
   * Wait until a timestamp found in the state object.
   *
   * Example value: `$.waitTimestamp`
   */
  public static timestampPath(path: string) { return new WaitTime({ TimestampPath: path }); }

  private constructor(private readonly json: any) { }

  /**
   * @internal
   */
  public get _json() {
    return this.json;
  }
}

interface WaitOptions {
  /**
   * Wait duration.
   */
  readonly time: WaitTime;
}

/**
 * Properties for defining a Wait state that using JSONPath
 */
export interface WaitJsonPathProps extends StateBaseProps, AssignableStateOptions, WaitOptions, JsonPathCommonOptions { }
/**
 * Properties for defining a Wait state that using JSONata
 */
export interface WaitJsonataProps extends StateBaseProps, AssignableStateOptions, WaitOptions, JsonataCommonOptions { }
/**
 * Properties for defining a Wait state
 */
export interface WaitProps extends StateBaseProps, AssignableStateOptions, WaitOptions { }

/**
 * Define a Wait state in the state machine
 *
 * A Wait state can be used to delay execution of the state machine for a while.
 */
export class Wait extends State implements INextable {
  /**
   * Define a Wait state using JSONPath in the state machine
   *
   * A Wait state can be used to delay execution of the state machine for a while.
   */
  public static jsonPath(scope: Construct, id: string, props: WaitJsonPathProps) {
    return new Wait(scope, id, props);
  }
  /**
   * Define a Wait state using JSONata in the state machine
   *
   * A Wait state can be used to delay execution of the state machine for a while.
   */
  public static jsonata(scope: Construct, id: string, props: WaitJsonataProps) {
    return new Wait(scope, id, {
      ...props,
      queryLanguage: QueryLanguage.JSONATA,
    });
  }
  public readonly endStates: INextable[];

  private readonly time: WaitTime;

  constructor(scope: Construct, id: string, props: WaitProps) {
    super(scope, id, props);

    this.time = props.time;
    this.endStates = [this];
  }

  /**
   * Continue normal execution with the given state
   */
  public next(next: IChainable): Chain {
    super.makeNext(next.startState);
    return Chain.sequence(this, next);
  }

  /**
   * Return the Amazon States Language object for this state
   */
  public toStateJson(topLevelQueryLanguage?: QueryLanguage): object {
    return {
      Type: StateType.WAIT,
      ...this.renderQueryLanguage(topLevelQueryLanguage),
      Comment: this.comment,
      ...this.time._json,
      ...this.renderInputOutput(),
      ...this.renderNextEnd(),
      ...this.renderAssign(topLevelQueryLanguage),
    };
  }
}
