import { IGrantable } from "@aws-cdk/aws-iam";
import { AnyEventProperty, Event, IEvent } from "./Event";
import { IState } from "./State";
/**
 * Transition Event specification
 *
 * @export
 * @interface ITransitionEvent
 * @extends {IEvent}
 */
export interface ITransitionEvent extends IEvent {
  /**
   * The {@link IState} to transition into
   *
   * @type {IState}
   * @memberof ITransitionEvent
   */
  nextState: IState;
}

/**
 * IoTEvents Transition Event
 *
 * @export
 * @class TransitionEvent
 * @extends {Event}
 * @implements {ITransitionEvent}
 */
export class TransitionEvent extends Event implements ITransitionEvent {
  public nextState: IState;
  public constructor(name: string, nextState: IState, condition: string) {
    super(name, condition);
    this.nextState = nextState;
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
      nextState: this.nextState.name,
    };
  }
}
