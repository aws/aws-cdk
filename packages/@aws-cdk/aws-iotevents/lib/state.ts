import { Event } from './event';
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

  constructor(private readonly props: StateProps) {
    this.stateName = props.stateName;
  }

  /**
   * Return the state property JSON
   *
   * @internal
   */
  public _toStateJson(): CfnDetectorModel.StateProperty {
    const { stateName, onEnter } = this.props;
    return {
      stateName,
      onEnter: onEnter && { events: getEventJson(onEnter) },
    };
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

function getEventJson(events: Event[]): CfnDetectorModel.EventProperty[] {
  return events.map(e => {
    return {
      eventName: e.eventName,
      condition: e.condition?.evaluate(),
    };
  });
}
