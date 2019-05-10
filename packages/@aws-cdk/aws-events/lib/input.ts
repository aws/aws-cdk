import { CloudFormationLang, DefaultTokenResolver, IFragmentConcatenator, IResolveContext, resolve, Token } from '@aws-cdk/cdk';
import { IEventRule } from './rule-ref';

/**
 * The input to send to the event target
 */
export abstract class EventTargetInput {
  /**
   * Pass text to the event target
   *
   * May contain strings returned by EventField.from() to substitute in parts of the
   * matched event.
   */
  public static fromText(text: string): EventTargetInput {
    return new FieldAwareEventInput(text, false);
  }

  /**
   * Pass a JSON object to the event target
   *
   * May contain strings returned by EventField.from() to substitute in parts of the
   * matched event.
   */
  public static fromObject(obj: any): EventTargetInput {
    return new FieldAwareEventInput(obj, true);
  }

  /**
   * Take the event target input from a path in the event JSON
   */
  public static fromEventPath(path: string): EventTargetInput {
    return new LiteralEventInput({ inputPath: path });
  }

  protected constructor() {
  }

  /**
   * Return the input properties for this input object
   */
  public abstract bind(rule: IEventRule): EventRuleTargetInputProperties;
}

/**
 * The input properties for an event target
 */
export interface EventRuleTargetInputProperties {
  /**
   * Literal input to the target service (must be valid JSON)
   */
  readonly input?: string;

  /**
   * JsonPath to take input from the input event
   */
  readonly inputPath?: string;

  /**
   * Input template to insert paths map into
   */
  readonly inputTemplate?: string;

  /**
   * Paths map to extract values from event and insert into `inputTemplate`
   */
  readonly inputPathsMap?: {[key: string]: string};
}

/**
 * Event Input that is directly derived from the construct
 */
class LiteralEventInput extends EventTargetInput {
  constructor(private readonly props: EventRuleTargetInputProperties) {
    super();
  }

  /**
   * Return the input properties for this input object
   */
  public bind(_rule: IEventRule): EventRuleTargetInputProperties {
    return this.props;
  }
}

/**
 * Input object that can contain field replacements
 *
 * Evaluation is done in the bind() method because token resolution
 * requires access to the construct tree.
 *
 * Multiple tokens that use the same path will use the same substitution
 * key.
 *
 * One weird exception: if we're in object context, we MUST skip the quotes
 * around the placeholder. I assume this is so once a trivial string replace is
 * done later on by CWE, numbers are still numbers.
 *
 * So in string context:
 *
 *    "this is a string with a <field>"
 *
 * But in object context:
 *
 *    "{ \"this is the\": <field> }"
 *
 * To achieve the latter, we use the cooperation of the JSONification framework.
 */
class FieldAwareEventInput extends EventTargetInput {
  constructor(private readonly input: any, private readonly objectScope: boolean) {
    super();
  }

  public bind(rule: IEventRule): EventRuleTargetInputProperties {
    Array.isArray(this.objectScope);
    let fieldCounter = 0;
    const pathToKey = new Map<string, string>();
    const inputPathsMap: {[key: string]: string} = {};

    function keyForField(f: EventField) {
      const existing = pathToKey.get(f.path);
      if (existing !== undefined) { return existing; }

      fieldCounter += 1;
      const key = f.nameHint || `f${fieldCounter}`;
      pathToKey.set(f.path, key);
      return key;
    }

    class EventFieldReplacer extends DefaultTokenResolver {
      constructor() {
        super(new StringConcat());
      }

      public resolveToken(t: Token, _context: IResolveContext) {
        if (!isEventField(t)) { return t; }

        const key = keyForField(t);
        if (inputPathsMap[key] && inputPathsMap[key] !== t.path) {
          throw new Error(`Single key '${key}' is used for two different JSON paths: '${t.path}' and '${inputPathsMap[key]}'`);
        }
        inputPathsMap[key] = t.path;

        return `<${key}>`;
      }
    }

    console.log('resolving', this.input);
    console.log('resolved ', resolve(this.input, {
      scope: rule,
      resolver: new EventFieldReplacer()
    }));

    const resolved = CloudFormationLang.toJSON(resolve(this.input, {
      scope: rule,
      resolver: new EventFieldReplacer()
    }));

    if (Object.keys(inputPathsMap).length === 0) {
      // Nothing special, just return 'input'
      return { input: resolved };
    }

    return {
      inputTemplate: resolved,
      inputPathsMap
    };
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
    return new EventField(path, nameHint).toString();
  }

  private constructor(public readonly path: string, public readonly nameHint?: string) {
    super(() => path);

    Object.defineProperty(this, EVENT_FIELD_SYMBOL, { value: true });
  }
}

function isEventField(x: any): x is EventField {
  return typeof x === 'object' && x !== null && x[EVENT_FIELD_SYMBOL];
}

const EVENT_FIELD_SYMBOL = Symbol.for('@aws-cdk/aws-events.EventField');

/**
 * Converts all fragments to strings and concats those
 *
 * Drops 'undefined's.
 */
class StringConcat implements IFragmentConcatenator {
  public join(left: any | undefined, right: any | undefined): any {
    if (left === undefined) { return right !== undefined ? `${right}` : undefined; }
    if (right === undefined) { return `${left}`; }
    return `${left}${right}`;
  }
}
