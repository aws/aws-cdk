import { IGrantable } from "@aws-cdk/aws-iam";
import { IEvent } from "./Event";
import { CfnDetectorModel } from "./iotevents.generated";
import { ITransitionEvent, TransitionEvent } from "./TransitionEvent";
/**
 * State specification
 *
 * @export
 * @interface IState
 */
export interface IState {
  /**
   * The State Name
   *
   * @type {string}
   * @memberof IState
   */
  readonly name: string;

  /**
   * Events to occur when entering the state
   *
   * @param {...IEvent[]} events
   * @memberof IState
   */
  onEnter(...events: IEvent[]): IState;

  /**
   * Events to occur when exiting the state
   *
   * @param {...IEvent[]} events
   * @memberof IState
   */
  onExit(...events: IEvent[]): IState;

  /**
   * Events to occur when input is occuring
   *
   * @param {...IEvent[]} events
   * @memberof IState
   */
  onInput(...events: IEvent[]): IState;

  /**
   * Calculate the list of reachable stats including this
   *
   * @returns {IState[]}
   * @memberof IState
   * @internal
   */
  _relatedStates(): IState[];
  /**
   * Generate the CFN
   *
   * @param {IGrantable} grantable
   * @returns {CfnDetectorModel.StateProperty}
   * @memberof IState
   * @internal
   */
  _cfn(grantable: IGrantable): CfnDetectorModel.StateProperty;
}

/**
 * IoTEvents State
 *
 * @export
 * @class State
 * @implements {IState}
 */
export class State implements IState {
  public readonly name: string;
  private onEnterEvents: IEvent[] = [];
  private onExitEvents: IEvent[] = [];
  private onInputEvents: IEvent[] = [];
  private onInputTransitionEvents: ITransitionEvent[] = [];

  public constructor(name: string) {
    this.name = name;
  }
  /**
   * @internal
   */

  public _relatedStates(): IState[] {
    return Array.from(
      new Set(this.onInputTransitionEvents.map(event => event.nextState))
    );
  }
  /**
   * @internal
   */
  public _cfn(grantable: IGrantable): CfnDetectorModel.StateProperty {
    return {
      stateName: this.name,
      onEnter: {
        events: this.onEnterEvents.map(e => e._cfn(grantable)),
      },
      onExit: {
        events: this.onExitEvents.map(e => e._cfn(grantable)),
      },
      onInput: {
        events: this.onInputEvents.map(e => e._cfn(grantable)),
        transitionEvents: this.onInputTransitionEvents.map(e =>
          e._cfn(grantable)
        ),
      },
    };
  }
  public onEnter(...events: IEvent[]): IState {
    events.forEach(event => {
      this.onEnterEvents.push(event);
    });
    return this;
  }
  public onExit(...events: IEvent[]): IState {
    events.forEach(event => {
      this.onExitEvents.push(event);
    });
    return this;
  }
  public onInput(...events: IEvent[]): IState {
    events.forEach(event => {
      if (event instanceof TransitionEvent) {
        this.onInputTransitionEvents.push(event);
      } else {
        this.onInputEvents.push(event);
      }
    });
    return this;
  }
}
