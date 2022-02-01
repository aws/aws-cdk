import { IEvent, ITransitionEvent } from './event';
import { CfnDetectorModel } from './iotevents.generated';

/**
 * Properties for defining a state of a detector
 */
export interface StateProps {
  /**
   * The name of the state.
   */
  readonly stateName: string;

  /**
   * Specifies the events on enter. the conditions of the events are evaluated when the state is entered.
   * If the condition is `TRUE`, the actions of the event are performed.
   *
   * @default - events on enter will not be set
   */
  readonly onEnter?: IEvent[];
}

/**
 * Defines a state of a detector
 */
export class State {
  /**
   * The name of the state
   */
  public readonly stateName: string;

  private transitionEvents: ITransitionEvent[] = []

  constructor(private readonly props: StateProps) {
    this.stateName = props.stateName;
  }

  /**
   * Add a transition event to the state.
   *
   * @param transitionEvent the transition event that triggered if condition is evaluated to TRUE
   */
  public transitionTo(transitionEvent:ITransitionEvent) {
    this.transitionEvents.push(transitionEvent);
  }

  /**
   * Return the JSON of the states that is transited to.
   * This function is called recursively and collect the states.
   *
   * @internal
   */
  public _getStatesJson(states: CfnDetectorModel.StateProperty[] = []): CfnDetectorModel.StateProperty[] {
    const { stateName, onEnter } = this.props;

    if (states.some(s => s.stateName === stateName)) {
      return states;
    }

    const newStates: CfnDetectorModel.StateProperty[] = [...states, {
      stateName,
      onInput: {
        transitionEvents: this.transitionEvents.length > 0 ?
          getTransitionEventJson(this.transitionEvents) : undefined,
      },
      onEnter: onEnter && { events: getEventJson(onEnter) },
    }];

    return this.transitionEvents.reduce((acc, transitionEvent) => {
      return transitionEvent.nextState._getStatesJson(acc);
    }, newStates);
  }

  /**
   * returns true if this state has at least one condition via events
   *
   * @internal
   */
  public _onEnterEventsHaveAtLeastOneCondition(): boolean {
    return this.props.onEnter?.some(event => event.condition) ?? false;
  }
}

function getEventJson(events: IEvent[]): CfnDetectorModel.EventProperty[] {
  return events.map(e => {
    return {
      eventName: e.eventName,
      condition: e.condition?.evaluate(),
    };
  });
}
function getTransitionEventJson(events: ITransitionEvent[]): CfnDetectorModel.TransitionEventProperty[] {
  return events.map(e => {
    return {
      eventName: e.eventName,
      condition: e.condition.evaluate(),
      nextState: e.nextState.stateName,
    };
  });
}
