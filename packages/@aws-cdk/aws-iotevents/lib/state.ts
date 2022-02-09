import { IAction } from './action';
import { IDetectorModel } from './detector-model';
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

  /**
   * The actions to be performed.
   *
   * @default - none
   */
  readonly actions?: IAction[];
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
   * The actions to be performed.
   *
   * @default - none
   */
  readonly actions?: IAction[];

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
   * Specifies the events on enter. The conditions of the events will be evaluated when entering this state.
   * If the condition of the event evaluates to `true`, the actions of the event will be executed.
   *
   * @default - events on enter will not be set
   */
  readonly onEnter?: Event[];

  /**
   * Specifies the events on inputted. the conditions of the events are evaluated when an input is received.
   * If the condition is `TRUE`, the actions of the event are performed.
   *
   * @default - events on inputted will not be set
   */
  readonly onInput?: Event[];

  /**
   * Specifies the events on exit. the conditions of the events are evaluated when exiting this state.
   * If the condition is `TRUE`, the actions of the event are performed.
   *
   * @default - events on exit will not be set
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
   * The transition event will be triggered if condition is evaluated to TRUE.
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
      actions: options.actions,
    });
  }

  /**
   * Return the JSONs of the states in dependency gragh that constructed by state transitions
   */
  public bind(detectorModel: IDetectorModel): CfnDetectorModel.StateProperty[] {
    return this.collectStates(new Set()).map(state => state.toStateJson(detectorModel));
  }

  /**
   * Returns true if this state has at least one condition via events.
   *
   * @internal
   */
  public _onEnterEventsHaveAtLeastOneCondition(): boolean {
    return this.props.onEnter?.some(event => event.condition) ?? false;
  }

  private collectStates(collectedStates: Set<State>): State[] {
    if (collectedStates.has(this)) {
      return [];
    }
    collectedStates.add(this);

    return [this, ...this.transitionEvents.flatMap(transitionEvent => transitionEvent.nextState.collectStates(collectedStates))];
  }

  private toStateJson(detectorModel: IDetectorModel): CfnDetectorModel.StateProperty {
    const { onEnter, onInput, onExit } = this.props;
    return {
      stateName: this.stateName,
      onEnter: {
        events: toEventsJson(detectorModel, onEnter),
      },
      onInput: {
        events: toEventsJson(detectorModel, onInput),
        transitionEvents: toTransitionEventsJson(detectorModel, this.transitionEvents),
      },
      onExit: {
        events: toEventsJson(detectorModel, onExit),
      },
    };
  }
}

function toEventsJson(
  detectorModel: IDetectorModel,
  events?: Event[],
): CfnDetectorModel.EventProperty[] | undefined {
  if (!events) {
    return undefined;
  }

  return events.map(event => ({
    eventName: event.eventName,
    condition: event.condition?.evaluate(),
    actions: event.actions?.map(action => action.bind(detectorModel).configuration),
  }));
}

function toTransitionEventsJson(
  detectorModel: IDetectorModel,
  transitionEvents: TransitionEvent[],
): CfnDetectorModel.TransitionEventProperty[] | undefined {
  if (transitionEvents.length === 0) {
    return undefined;
  }

  return transitionEvents.map(transitionEvent => ({
    eventName: transitionEvent.eventName,
    condition: transitionEvent.condition.evaluate(),
    actions: transitionEvent.actions?.map(action => action.bind(detectorModel).configuration),
    nextState: transitionEvent.nextState.stateName,
  }));
}
