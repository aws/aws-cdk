import { Token } from '@aws-cdk/cdk';
import { EventRuleTargetInputProperties } from './target';

/**
 * The input to send to the event target
 */
export class EventTargetInput {
  /**
   * Pass text to the event target
   *
   * May contain strings returned by EventField.from() to substitute in parts of the
   * matched event.
   */
  public static fromText(text: string): EventTargetInput {
    return new EventTargetInput({ input: JSON.stringify(text) });
  }

  /**
   * Pass a JSON object to the event target
   *
   * May contain strings returned by EventField.from() to substitute in parts of the
   * matched event.
   */
  public static fromObject(obj: any): EventTargetInput {
    return new EventTargetInput({ input: JSON.stringify(obj) });
  }

  /**
   * Take the event target input from a path in the event JSON
   */
  public static fromEventPath(path: string): EventTargetInput {
    return new EventTargetInput({ inputPath: path });
  }

  private constructor(private readonly props: EventRuleTargetInputProperties) {
  }

  /**
   * Return the input properties for this input object
   */
  public toInputProperties() {
    return this.props;
  }
}

/**
 * Represents a field in the event pattern
 */
export class EventField extends Token {
  /**
   * Extract the event ID from the event
   */
  public static get eventId(): string {
    return this.fromPath('$.id', 'eventId');
  }

  /**
   * Extract the detail type from the event
   */
  public static get detailType(): string {
    return this.fromPath('$.detail-type', 'detailType');
  }

  /**
   * Extract the source from the event
   */
  public static get source(): string {
    return this.fromPath('$.source', 'source');
  }

  /**
   * Extract the account from the event
   */
  public static get account(): string {
    return this.fromPath('$.account', 'account');
  }

  /**
   * Extract the time from the event
   */
  public static get time(): string {
    return this.fromPath('$.time', 'time');
  }

  /**
   * Extract the region from the event
   */
  public static get region(): string {
    return this.fromPath('$.region', 'region');
  }

  /**
   * Extract a custom JSON path from the event
   */
  public static fromPath(path: string, nameHint?: string): string {
    EventField.fieldCounter += 1;

    nameHint = nameHint || `f${EventField.fieldCounter}`;

    return new EventField(`<${nameHint}>`, path).toString();
  }

  private static fieldCounter = 0;

  private constructor(public readonly key: string, public readonly path: string) {
    super(key);
  }
}