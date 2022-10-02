import { Construct } from 'constructs';
import { IAction, ActionBindOptions } from './action';
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
   * When this was evaluated to `true`, the state transition and the actions are triggered.
   */
  readonly when: Expression;

  /**
   * The actions to be performed with the transition.
   *
   * @default - no actions will be performed
   */
  readonly executing?: IAction[];
}

/**
 * Specifies the state transition and the actions to be performed when the condition evaluates to `true`.
 */
interface TransitionEvent {
  /**
   * The name of the event.
   */
  readonly eventName: string;

  /**
   * The Boolean expression that, when `true`, causes the state transition and the actions to be performed.
   */
  readonly condition: Expression;

  /**
   * The actions to be performed.
   *
   * @default - no actions will be performed
   */
  readonly actions?: IAction[];

  /**
   * The next state to transit to. When the resuld of condition expression is `true`, the state is transited.
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
   * Specifies the events on enter. The conditions of the events will be evaluated when entering this state.
   * If the condition of the event evaluates to `true`, the actions of the event will be executed.
   *
   * @default - no events will trigger on entering this state
   */
  readonly onEnter?: Event[];

  /**
   * Specifies the events on input. The conditions of the events will be evaluated when any input is received.
   * If the condition of the event evaluates to `true`, the actions of the event will be executed.
   *
   * @default - no events will trigger on input in this state
   */
  readonly onInput?: Event[];

  /**
   * Specifies the events on exit. The conditions of the events are evaluated when an exiting this state.
   * If the condition evaluates to `true`, the actions of the event will be executed.
   *
   * @default - no events will trigger on exiting this state
   */
  readonly onExit?: Event[];
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
   * The transition event will be triggered if condition is evaluated to `true`.
   *
   * @param targetState the state that will be transit to when the event triggered
   * @param options transition options including the condition that causes the state transition
   */
  public transitionTo(targetState: State, options: TransitionOptions) {
    const alreadyAdded = this.transitionEvents.some(transitionEvent => transitionEvent.nextState === targetState);
    if (alreadyAdded) {
      throw new Error(`State '${this.stateName}' already has a transition defined to '${targetState.stateName}'`);
    }

    this.transitionEvents.push({
      eventName: options.eventName ?? `${this.stateName}_to_${targetState.stateName}`,
      nextState: targetState,
      condition: options.when,
      actions: options.executing,
    });
  }

  /**
   * Collect states in dependency gragh that constructed by state transitions,
   * and return the JSONs of the states.
   * This function is called recursively and collect the states.
   *
   * @internal
   */
  public _collectStateJsons(scope: Construct, actionBindOptions: ActionBindOptions, collectedStates: Set<State>): CfnDetectorModel.StateProperty[] {
    if (collectedStates.has(this)) {
      return [];
    }
    collectedStates.add(this);

    return [
      this.toStateJson(scope, actionBindOptions),
      ...this.transitionEvents.flatMap(transitionEvent => {
        return transitionEvent.nextState._collectStateJsons(scope, actionBindOptions, collectedStates);
      }),
    ];
  }

  /**
   * Returns true if this state has at least one condition via events.
   *
   * @internal
   */
  public _onEnterEventsHaveAtLeastOneCondition(): boolean {
    return this.props.onEnter?.some(event => event.condition) ?? false;
  }

  private toStateJson(scope: Construct, actionBindOptions: ActionBindOptions): CfnDetectorModel.StateProperty {
    const { onEnter, onInput, onExit } = this.props;
    return {
      stateName: this.stateName,
      onEnter: onEnter && {
        events: toEventsJson(scope, actionBindOptions, onEnter),
      },
      onInput: (onInput || this.transitionEvents.length !== 0) ? {
        events: toEventsJson(scope, actionBindOptions, onInput),
        transitionEvents: toTransitionEventsJson(scope, actionBindOptions, this.transitionEvents),
      } : undefined,
      onExit: onExit && {
        events: toEventsJson(scope, actionBindOptions, onExit),
      },
    };
  }
}

function toEventsJson(
  scope: Construct,
  actionBindOptions: ActionBindOptions,
  events?: Event[],
): CfnDetectorModel.EventProperty[] | undefined {
  return events?.map(event => ({
    eventName: event.eventName,
    condition: event.condition?.evaluate(),
    actions: event.actions?.map(action => action._bind(scope, actionBindOptions).configuration),
  }));
}

function toTransitionEventsJson(
  scope: Construct,
  actionBindOptions: ActionBindOptions,
  transitionEvents: TransitionEvent[],
): CfnDetectorModel.TransitionEventProperty[] | undefined {
  if (transitionEvents.length === 0) {
    return undefined;
  }

  return transitionEvents.map(transitionEvent => ({
    eventName: transitionEvent.eventName,
    condition: transitionEvent.condition.evaluate(),
    actions: transitionEvent.actions?.map(action => action._bind(scope, actionBindOptions).configuration),
    nextState: transitionEvent.nextState.stateName,
  }));
}
