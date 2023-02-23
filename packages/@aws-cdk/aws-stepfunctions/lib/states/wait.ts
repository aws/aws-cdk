import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { State } from './state';
import { Chain } from '../chain';
import { IChainable, INextable } from '../types';

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
   * Wait until the given ISO8601 timestamp
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

/**
 * Properties for defining a Wait state
 */
export interface WaitProps {
  /**
   * An optional description for this state
   *
   * @default No comment
   */
  readonly comment?: string;

  /**
   * Wait duration.
   */
  readonly time: WaitTime;
}

/**
 * Define a Wait state in the state machine
 *
 * A Wait state can be used to delay execution of the state machine for a while.
 */
export class Wait extends State implements INextable {
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
  public toStateJson(): object {
    return {
      Type: StateType.WAIT,
      Comment: this.comment,
      ...this.time._json,
      ...this.renderNextEnd(),
    };
  }
}
