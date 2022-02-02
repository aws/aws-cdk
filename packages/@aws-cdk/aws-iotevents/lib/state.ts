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
   * The Boolean expression that, when TRUE, causes the state transition and the actions to be performed.
   */
  readonly condition: Expression;
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
   * The Boolean expression that, when TRUE, causes the state transition and the actions to be performed.
   */
  readonly condition: Expression;

  /**
   * The next state to transit to. When the resuld of condition expression is TRUE, the state is transited.
   */
  readonly nextState: State;
}

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
  readonly onEnter?: Event[];
}

/**
 * Defines a state of a detector
 */
export class State {
  /**
   * The name of the state
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
      condition: options.condition,
    });
  }

  /**
   * Collect states in dependency gragh that constructed by state transitions,
   * and return the JSONs of the states.
   * This function is called recursively and collect the states.
   *
   * @internal
   */
  public _collectStateJsons(collectedStates = new Set<State>()): CfnDetectorModel.StateProperty[] {
    if (collectedStates.has(this)) {
      return [];
    }
    collectedStates.add(this);

    return [
      this.toStateJson(),
      ...this.transitionEvents.flatMap(({ nextState }) => {
        return nextState._collectStateJsons(collectedStates);
      }),
    ];
  }

  /**
   * returns true if this state has at least one condition via events
   *
   * @internal
   */
  public _onEnterEventsHaveAtLeastOneCondition(): boolean {
    return this.props.onEnter?.some(event => event.condition) ?? false;
  }

  private toStateJson(): CfnDetectorModel.StateProperty {
    const { stateName, onEnter } = this.props;
    return {
      stateName,
      onInput: {
        transitionEvents: toTransitionEventJson(this.transitionEvents),
      },
      onEnter: onEnter && { events: toEventJson(onEnter) },
    };
  }
}

function toEventJson(events: Event[]): CfnDetectorModel.EventProperty[] {
  return events.map(e => {
    return {
      eventName: e.eventName,
      condition: e.condition?.evaluate(),
    };
  });
}

function toTransitionEventJson(events: TransitionEvent[]): CfnDetectorModel.TransitionEventProperty[] | undefined {
  if (events.length === 0) {
    return undefined;
  }

  return events.map(e => {
    return {
      eventName: e.eventName,
      condition: e.condition.evaluate(),
      nextState: e.nextState.stateName,
    };
  });
}
