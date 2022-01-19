import { Event, getEventJson } from './event';
import { CfnDetectorModel } from './iotevents.generated';

/**
 * Properties for defining a state of a detector
 */
export interface StateProps {
  /**
   * The name of the state
   */
  readonly stateName: string;

  /**
   * Specifies the actions that are performed when the state is entered and the `condition` is `TRUE`
   *
   * @default None
   */
  readonly onEnterEvents?: Event[];
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
   */
  public toStateJson(): CfnDetectorModel.StateProperty {
    const { stateName, onEnterEvents } = this.props;
    return {
      stateName,
      onEnter: onEnterEvents && { events: getEventJson(onEnterEvents) },
    };
  }

  /**
   * returns true if this state has at least one condition via events
   */
  public hasCondition(): boolean {
    return this.props.onEnterEvents?.some(event => event.condition) ?? false;
  }
}
