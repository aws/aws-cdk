import type {
  IResolvable,
  IResolveContext,
} from '../../core';
import {
  DefaultTokenResolver, Lazy, Stack, StringConcat, Token, Tokenization,
  UnscopedValidationError,
} from '../../core';
import { lit } from '../../core/lib/private/literal-string';
import type { IRuleRef } from '../../interfaces/generated/aws-events-interfaces.generated';

/**
 * The input to send to the event target
 *
 * This class abstracts over the three different ways CloudFormation lets you shape
 * a target's input, so you do not have to choose between them yourself:
 *
 * * `Input` - a literal value, emitted when the input does not reference the event.
 * * `InputPath` - a single JSONPath into the event, emitted by `fromEventPath()`.
 * * `InputTransformer` - an `InputPathsMap` plus an `InputTemplate`, emitted
 *   automatically when the input references parts of the event via `EventField`.
 *
 * You pick a factory method based on the *shape* you want the target to receive, and
 * whether you reference `EventField` determines which of the above is synthesized.
 * For example, `fromObject({ foo: 'bar' })` produces a literal `Input`, while
 * `fromObject({ id: EventField.fromPath('$.detail.instance-id') })` produces an
 * `InputTransformer` with the path lifted into `InputPathsMap`.
 */
export abstract class RuleTargetInput {
  /**
   * Pass text to the event target
   *
   * May contain strings returned by `EventField.from()` to substitute in parts of the
   * matched event.
   *
   * The Rule Target input value will be a single string: the string you pass
   * here.  Do not use this method to pass a complex value like a JSON object to
   * a Rule Target.  Use `RuleTargetInput.fromObject()` instead.
   *
   * The target `Input` field must be valid JSON, so the text is JSON-encoded
   * when the template is synthesized. As a result a plain string is wrapped in
   * double quotes: `fromText('something')` renders as `Input: '"something"'`.
   * The quotes are part of the required JSON encoding, not an extra value added
   * by CDK, and cannot be removed.
   *
   * Whether those quotes are visible to the recipient depends on the target
   * service. Some targets deliver the JSON-encoded value as-is, so the recipient
   * sees the surrounding quotes (for example, an SNS topic delivering to an
   * email subscriber shows `"something"`). To send a structured payload, use
   * `RuleTargetInput.fromObject()` instead.
   *
   * @example
   *
   * declare const rule: events.Rule;
   * declare const topic: sns.Topic;
   *
   * // Referencing the event turns this into an InputTransformer, with the paths
   * // lifted into InputPathsMap and this string used as the InputTemplate.
   * rule.addTarget(new targets.SnsTopic(topic, {
   *   message: events.RuleTargetInput.fromText(
   *     `Instance ${events.EventField.fromPath('$.detail.instance-id')} is now ${events.EventField.fromPath('$.detail.state')}`,
   *   ),
   * }));
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
   * May contain strings returned by `EventField.from()` to substitute in parts
   * of the matched event.
   *
   * As with `fromText`, each line is JSON-encoded, so every line is wrapped in
   * double quotes in the synthesized template. Whether those quotes are visible
   * to the recipient depends on the target service.
   *
   * @example
   *
   * declare const rule: events.Rule;
   * declare const topic: sns.Topic;
   *
   * // Each line is passed to the target as a separate argument.
   * rule.addTarget(new targets.SnsTopic(topic, {
   *   message: events.RuleTargetInput.fromMultilineText(
   *     `First line\nSecond line`,
   *   ),
   * }));
   */
  public static fromMultilineText(text: string): RuleTargetInput {
    return new FieldAwareEventInput(text, InputType.Multiline);
  }

  /**
   * Pass a JSON object to the event target
   *
   * May contain strings returned by `EventField.from()` to substitute in parts of the
   * matched event.
   *
   * @example
   *
   * declare const rule: events.Rule;
   * declare const topic: sns.Topic;
   *
   * // Without EventField this is a literal `Input`:
   * //   {"source":"my-app"}
   * rule.addTarget(new targets.SnsTopic(topic, {
   *   message: events.RuleTargetInput.fromObject({ source: 'my-app' }),
   * }));
   *
   * // Referencing the event makes it an `InputTransformer` instead: each path
   * // becomes an `InputPathsMap` entry keyed by a readable hint derived from the
   * // path, with a matching <hint> placeholder substituted into the `InputTemplate`.
   * rule.addTarget(new targets.SnsTopic(topic, {
   *   message: events.RuleTargetInput.fromObject({
   *     instance: events.EventField.fromPath('$.detail.instance-id'),
   *     state: events.EventField.fromPath('$.detail.state'),
   *   }),
   * }));
   *
   * @returns RuleTargetInput
   */
  public static fromObject(obj: any): RuleTargetInput {
    return new FieldAwareEventInput(obj, InputType.Object);
  }

  /**
   * Take the event target input from a path in the event JSON
   *
   * This emits CloudFormation's `InputPath` directly, so the target receives only
   * the selected fragment of the event. Use this when you want to forward part of
   * the event unchanged; use `fromObject()` when you need to reshape it.
   *
   * @example
   *
   * declare const rule: events.Rule;
   * declare const topic: sns.Topic;
   *
   * // The target receives only the `detail` object from the event.
   * rule.addTarget(new targets.SnsTopic(topic, {
   *   message: events.RuleTargetInput.fromEventPath('$.detail'),
   * }));
   */
  public static fromEventPath(path: string): RuleTargetInput {
    return new LiteralEventInput({ inputPath: path });
  }

  protected constructor() {
  }

  /**
   * Return the input properties for this input object
   */
  public abstract bind(rule: IRuleRef): RuleTargetInputProperties;
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
  public bind(_rule: IRuleRef): RuleTargetInputProperties {
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
 *
 * @internal
 */
export class FieldAwareEventInput extends RuleTargetInput {
  constructor(private readonly input: any, private readonly inputType: InputType) {
    super();
  }

  public bind(rule: IRuleRef): RuleTargetInputProperties {
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

    class EventFieldReplacer extends DefaultTokenResolver {
      constructor() {
        super(new StringConcat());
      }

      public resolveToken(t: Token, _context: IResolveContext) {
        if (!isEventField(t)) { return Token.asString(t); }

        const key = keyForField(t);
        if (inputPathsMap[key] && inputPathsMap[key] !== t.path) {
          throw new UnscopedValidationError(lit`DuplicateInputPathKey`, `Single key '${key}' is used for two different JSON paths: '${t.path}' and '${inputPathsMap[key]}'`);
        }
        inputPathsMap[key] = t.path;

        return `<${key}>`;
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

    const keys = Object.keys(inputPathsMap);

    if (keys.length === 0) {
      // Nothing special, just return 'input'
      return { input: resolved };
    }

    return {
      inputTemplate: this.unquoteKeyPlaceholders(resolved, keys),
      inputPathsMap,
    };
  }

  /**
   * Removing surrounding quotes from any object placeholders
   * when key is the lone value.
   *
   * Those have been put there by JSON.stringify(), but we need to
   * remove them.
   *
   * Do not remove quotes when the key is part of a larger string.
   *
   * Valid: { "data": "Some string with \"quotes\"<key>" } // key will be string
   * Valid: { "data": <key> } // Key could be number, bool, obj, or string
   */
  private unquoteKeyPlaceholders(sub: string, keys: string[]) {
    if (this.inputType !== InputType.Object) { return sub; }

    // eslint-disable-next-line no-restricted-syntax
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
        return keys.reduce((r, key) => r.replace(new RegExp(`(?<!\\\\)\"\<${key}\>\"`, 'g'), `<${key}>`), resolved);
      }
      return resolved;
    }
  }
}

/**
 * Represents a field in the event pattern
 *
 * Each `EventField` you reference from a `RuleTargetInput` becomes an entry in the
 * target's `InputPathsMap`, keyed by a readable hint derived from the path, and the
 * place you referenced it becomes a matching placeholder in the `InputTemplate`.
 * Referencing the same path more than once reuses a single entry.
 *
 * Because these are string tokens, they can be embedded in template literals and
 * composed with other strings.
 *
 * @example
 *
 * declare const rule: events.Rule;
 * declare const topic: sns.Topic;
 *
 * rule.addTarget(new targets.SnsTopic(topic, {
 *   message: events.RuleTargetInput.fromObject({
 *     // Named shorthands for the standard top-level event envelope fields
 *     account: events.EventField.account,
 *     region: events.EventField.region,
 *     // Any other field is reachable by JSONPath
 *     bucket: events.EventField.fromPath('$.detail.bucket.name'),
 *     // Tokens compose with ordinary strings
 *     summary: `Event ${events.EventField.eventId} from ${events.EventField.source}`,
 *   }),
 * }));
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
  public readonly creationStack: string[] = ['Token stack traces are no longer captured'];

  /**
   *
   * @param path the path to a field in the event pattern
   */
  private constructor(public readonly path: string) {
    this.displayHint = this.path.replace(/^[^a-zA-Z0-9_-]+/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
    Object.defineProperty(this, EVENT_FIELD_SYMBOL, { value: true });
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

/**
 * @internal
 */
export enum InputType {
  Object,
  Text,
  Multiline,
}

function isEventField(x: any): x is EventField {
  return EVENT_FIELD_SYMBOL in x;
}

const EVENT_FIELD_SYMBOL = Symbol.for('@aws-cdk/aws-events.EventField');
