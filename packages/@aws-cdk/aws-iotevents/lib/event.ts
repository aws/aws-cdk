import { Expression } from './expression';
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
  readonly condition?: Expression;
}

export function getEventJson(events: Event[]): CfnDetectorModel.EventProperty[] {
  return events.map(e => {
    return {
      eventName: e.eventName,
      condition: e.condition?.evaluate(),
    };
  });
}
