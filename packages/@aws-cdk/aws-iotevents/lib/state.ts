import { CfnDetectorModel } from './iotevents.generated';

/**
 * Specifies the actions to be performed when the condition evaluates to TRUE.
 */
export interface Event {
  /**
   * The name of the event
   */
  readonly eventName: string;

  /**
   * The Boolean expression that, when TRUE, causes the actions to be performed.
   *
   * @default None - Defaults to perform the actions always.
   */
  readonly condition?: string;
}

/**
 * Properties for defining a state of a detector
 */
export interface StateProps {
  /**
   * The name of the state
   */
  readonly stateName: string

  /**
   * Specifies the actions that are performed when the state is entered and the `condition` is `TRUE`
   *
   * @default None
   */
  readonly onEnterEvents?: Event[]
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
      onEnter: onEnterEvents && { events: onEnterEvents },
    };
  }
}
