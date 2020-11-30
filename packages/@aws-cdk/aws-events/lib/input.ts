import {
  captureStackTrace, DefaultTokenResolver, IResolvable,
  IResolveContext, Lazy, Stack, StringConcat, Token, Tokenization,
} from '@aws-cdk/core';
import { IRule } from './rule-ref';

/**
 * The input to send to the event target
 */
export abstract class RuleTargetInput {
  /**
   * Pass text to the event target
   *
   * May contain strings returned by EventField.from() to substitute in parts of the
   * matched event.
   */
  public static fromText(text: string): RuleTargetInput {
    return new FieldAwareEventInput(text, InputType.Text);
  }

  /**
   * Pass text to the event target, splitting on newlines.
   *
   * This is only useful when passing to a target that does not
   * take a single argument.
   *
   * May contain strings returned by EventField.from() to substitute in parts
   * of the matched event.
   */
  public static fromMultilineText(text: string): RuleTargetInput {
    return new FieldAwareEventInput(text, InputType.Multiline);
  }

  /**
   * Pass a JSON object to the event target
   *
   * May contain strings returned by EventField.from() to substitute in parts of the
   * matched event.
   */
  public static fromObject(obj: any): RuleTargetInput {
    return new FieldAwareEventInput(obj, InputType.Object);
  }

  /**
   * Take the event target input from a path in the event JSON
   */
  public static fromEventPath(path: string): RuleTargetInput {
    return new LiteralEventInput({ inputPath: path });
  }

  protected constructor() {
  }

  /**
   * Return the input properties for this input object
   */
  public abstract bind(rule: IRule): RuleTargetInputProperties;
}

/**
 * The input properties for an event target
 */
export interface RuleTargetInputProperties {
  /**
   * Literal input to the target service (must be valid JSON)
   *
   * @default - input for the event target. If the input contains a paths map
   *   values wil be extracted from event and inserted into the `inputTemplate`.
   */
  readonly input?: string;

  /**
   * JsonPath to take input from the input event
   *
   * @default - None. The entire matched event is passed as input
   */
  readonly inputPath?: string;

  /**
   * Input template to insert paths map into
   *
   * @default - None.
   */
  readonly inputTemplate?: string;

  /**
   * Paths map to extract values from event and insert into `inputTemplate`
   *
   * @default - No values extracted from event.
   */
  readonly inputPathsMap?: { [key: string]: string };
}

/**
 * Event Input that is directly derived from the construct
 */
class LiteralEventInput extends RuleTargetInput {
  constructor(private readonly props: RuleTargetInputProperties) {
    super();
  }

  /**
   * Return the input properties for this input object
   */
  public bind(_rule: IRule): RuleTargetInputProperties {
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
 * done later on by EventBridge, numbers are still numbers.
 *
 * So in string context:
 *
 *    "this is a string with a <field>"
 *
 * But in object context:
 *
 *    "{ \"this is the\": <field> }"
 *
 * To achieve the latter, we postprocess the JSON string to remove the surrounding
 * quotes by using a string replace.
 */
class FieldAwareEventInput extends RuleTargetInput {
  constructor(private readonly input: any, private readonly inputType: InputType) {
    super();
  }

  public bind(rule: IRule): RuleTargetInputProperties {
    let fieldCounter = 0;
    const pathToKey = new Map<string, string>();
    const inputPathsMap: {[key: string]: string} = {};

    function keyForField(f: EventField) {
      const existing = pathToKey.get(f.path);
      if (existing !== undefined) { return existing; }

      fieldCounter += 1;
      const key = f.displayHint || `f${fieldCounter}`;
      pathToKey.set(f.path, key);
      return key;
    }

    const self = this;

    class EventFieldReplacer extends DefaultTokenResolver {
      constructor() {
        super(new StringConcat());
      }

      public resolveToken(t: Token, _context: IResolveContext) {
        if (!isEventField(t)) { return Token.asString(t); }

        const key = keyForField(t);
        if (inputPathsMap[key] && inputPathsMap[key] !== t.path) {
          throw new Error(`Single key '${key}' is used for two different JSON paths: '${t.path}' and '${inputPathsMap[key]}'`);
        }
        inputPathsMap[key] = t.path;

        return self.keyPlaceholder(key);
      }
    }

    const stack = Stack.of(rule);

    let resolved: string;
    if (this.inputType === InputType.Multiline) {
      // JSONify individual lines
      resolved = Tokenization.resolve(this.input, {
        scope: rule,
        resolver: new EventFieldReplacer(),
      });
      resolved = resolved.split('\n').map(stack.toJsonString).join('\n');
    } else {
      resolved = stack.toJsonString(Tokenization.resolve(this.input, {
        scope: rule,
        resolver: new EventFieldReplacer(),
      }));
    }

    if (Object.keys(inputPathsMap).length === 0) {
      // Nothing special, just return 'input'
      return { input: resolved };
    }

    return {
      inputTemplate: this.unquoteKeyPlaceholders(resolved),
      inputPathsMap,
    };
  }

  /**
   * Return a template placeholder for the given key
   *
   * In object scope we'll need to get rid of surrounding quotes later on, so
   * return a bracing that's unlikely to occur naturally (like tokens).
   */
  private keyPlaceholder(key: string) {
    if (this.inputType !== InputType.Object) { return `<${key}>`; }
    return UNLIKELY_OPENING_STRING + key + UNLIKELY_CLOSING_STRING;
  }

  /**
   * Removing surrounding quotes from any object placeholders
   *
   * Those have been put there by JSON.stringify(), but we need to
   * remove them.
   */
  private unquoteKeyPlaceholders(sub: string) {
    if (this.inputType !== InputType.Object) { return sub; }

    return Lazy.uncachedString({ produce: (ctx: IResolveContext) => Token.asString(deepUnquote(ctx.resolve(sub))) });

    function deepUnquote(resolved: any): any {
      if (Array.isArray(resolved)) {
        return resolved.map(deepUnquote);
      } else if (typeof(resolved) === 'object' && resolved !== null) {
        for (const [key, value] of Object.entries(resolved)) {
          resolved[key] = deepUnquote(value);
        }
        return resolved;
      } else if (typeof(resolved) === 'string') {
        return resolved.replace(OPENING_STRING_REGEX, '<').replace(CLOSING_STRING_REGEX, '>');
      }
      return resolved;
    }
  }
}

const UNLIKELY_OPENING_STRING = '<<${';
const UNLIKELY_CLOSING_STRING = '}>>';

const OPENING_STRING_REGEX = new RegExp(regexQuote('"' + UNLIKELY_OPENING_STRING), 'g');
const CLOSING_STRING_REGEX = new RegExp(regexQuote(UNLIKELY_CLOSING_STRING + '"'), 'g');

/**
 * Represents a field in the event pattern
 */
export class EventField implements IResolvable {
  /**
   * Extract the event ID from the event
   */
  public static get eventId(): string {
    return this.fromPath('$.id');
  }

  /**
   * Extract the detail type from the event
   */
  public static get detailType(): string {
    return this.fromPath('$.detail-type');
  }

  /**
   * Extract the source from the event
   */
  public static get source(): string {
    return this.fromPath('$.source');
  }

  /**
   * Extract the account from the event
   */
  public static get account(): string {
    return this.fromPath('$.account');
  }

  /**
   * Extract the time from the event
   */
  public static get time(): string {
    return this.fromPath('$.time');
  }

  /**
   * Extract the region from the event
   */
  public static get region(): string {
    return this.fromPath('$.region');
  }

  /**
   * Extract a custom JSON path from the event
   */
  public static fromPath(path: string): string {
    return new EventField(path).toString();
  }

  /**
   * Human readable display hint about the event pattern
   */
  public readonly displayHint: string;
  public readonly creationStack: string[];

  /**
   *
   * @param path the path to a field in the event pattern
   */
  private constructor(public readonly path: string) {
    this.displayHint = this.path.replace(/^[^a-zA-Z0-9_-]+/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
    Object.defineProperty(this, EVENT_FIELD_SYMBOL, { value: true });
    this.creationStack = captureStackTrace();
  }

  public resolve(_ctx: IResolveContext): any {
    return this.path;
  }

  public toString() {
    return Token.asString(this, { displayHint: this.displayHint });
  }

  /**
   * Convert the path to the field in the event pattern to JSON
   */
  public toJSON() {
    return `<path:${this.path}>`;
  }
}

enum InputType {
  Object,
  Text,
  Multiline,
}

function isEventField(x: any): x is EventField {
  return EVENT_FIELD_SYMBOL in x;
}

const EVENT_FIELD_SYMBOL = Symbol.for('@aws-cdk/aws-events.EventField');

/**
 * Quote a string for use in a regex
 */
function regexQuote(s: string) {
  return s.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
}
