import { Event } from './event';
import { Expression } from './expression';
import { CfnDetectorModel } from './iotevents.generated';

/**
 * Properties for options of state transition.
 */
export interface TransitionOptions {
  /**
   * The name of the event.
   *
   * @default string combining the names of the States as `${originStateName}_to_${targetStateName}`
   */
  readonly eventName?: string;

  /**
   * The condition that is used to determine to cause the state transition and the actions.
   * When this was evaluated to TRUE, the state transition and the actions are triggered.
   */
  readonly when: Expression;
}

/**
 * Specifies the state transition and the actions to be performed when the condition evaluates to TRUE.
 */
interface TransitionEvent {
  /**
   * The name of the event.
   */
  readonly eventName: string;

  /**
   * The condition that is used to determine to cause the state transition and the actions.
   * When this was evaluated to TRUE, the state transition and the actions are triggered.
   */
  readonly when: Expression;

  /**
   * The next state to transit to. When the resuld of condition expression is TRUE, the state is transited.
   */
  readonly nextState: State;
}

/**
 * Properties for defining a state of a detector.
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
  readonly onEnter?: Event[];
}

/**
 * Defines a state of a detector.
 */
export class State {
  /**
   * The name of the state.
   */
  public readonly stateName: string;

  private readonly transitionEvents: TransitionEvent[] = [];

  constructor(private readonly props: StateProps) {
    this.stateName = props.stateName;
  }

  /**
   * Add a transition event to the state.
   * The transition event will be triggered if condition is evaluated to TRUE.
   *
   * @param targetState the state that will be transit to when the event triggered
   * @param options transition options including the condition that causes the state transition
   */
  public transitionTo(targetState: State, options: TransitionOptions) {
    const alreadyAdded = this.transitionEvents.some((event) => event.nextState === targetState);
    if (alreadyAdded) {
      throw new Error(`State '${this.stateName}' already has a transition defined to '${targetState.stateName}'`);
    }

    this.transitionEvents.push({
      eventName: options.eventName ?? `${this.stateName}_to_${targetState.stateName}`,
      nextState: targetState,
      when: options.when,
    });
  }

  /**
   * Collect states in dependency gragh that constructed by state transitions,
   * and return the JSONs of the states.
   * This function is called recursively and collect the states.
   *
   * @internal
   */
  public _collectStateJsons(collectedStates: Set<State>): CfnDetectorModel.StateProperty[] {
    if (collectedStates.has(this)) {
      return [];
    }
    collectedStates.add(this);

    return [
      this.toStateJson(),
      ...this.transitionEvents.flatMap(transitionEvent => {
        return transitionEvent.nextState._collectStateJsons(collectedStates);
      }),
    ];
  }

  /**
   * Returns true if this state has at least one condition as `Event.when`s.
   *
   * @internal
   */
  public _onEnterEventsHaveAtLeastOneCondition(): boolean {
    return this.props.onEnter?.some(event => event.when) ?? false;
  }

  private toStateJson(): CfnDetectorModel.StateProperty {
    const { onEnter } = this.props;
    return {
      stateName: this.stateName,
      onEnter: onEnter && { events: toEventsJson(onEnter) },
      onInput: {
        transitionEvents: toTransitionEventsJson(this.transitionEvents),
      },
    };
  }
}

function toEventsJson(events: Event[]): CfnDetectorModel.EventProperty[] {
  return events.map(event => {
    return {
      eventName: event.eventName,
      condition: event.when?.evaluate(),
    };
  });
}

function toTransitionEventsJson(transitionEvents: TransitionEvent[]): CfnDetectorModel.TransitionEventProperty[] | undefined {
  if (transitionEvents.length === 0) {
    return undefined;
  }

  return transitionEvents.map(transitionEvent => {
    return {
      eventName: transitionEvent.eventName,
      condition: transitionEvent.when.evaluate(),
      nextState: transitionEvent.nextState.stateName,
    };
  });
}
