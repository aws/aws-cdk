"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventField = exports.RuleTargetInput = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
/**
 * The input to send to the event target
 */
class RuleTargetInput {
    /**
     * Pass text to the event target
     *
     * May contain strings returned by `EventField.from()` to substitute in parts of the
     * matched event.
     *
     * The Rule Target input value will be a single string: the string you pass
     * here.  Do not use this method to pass a complex value like a JSON object to
     * a Rule Target.  Use `RuleTargetInput.fromObject()` instead.
     */
    static fromText(text) {
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
     */
    static fromMultilineText(text) {
        return new FieldAwareEventInput(text, InputType.Multiline);
    }
    /**
     * Pass a JSON object to the event target
     *
     * May contain strings returned by `EventField.from()` to substitute in parts of the
     * matched event.
     */
    static fromObject(obj) {
        return new FieldAwareEventInput(obj, InputType.Object);
    }
    /**
     * Take the event target input from a path in the event JSON
     */
    static fromEventPath(path) {
        return new LiteralEventInput({ inputPath: path });
    }
    constructor() {
    }
}
_a = JSII_RTTI_SYMBOL_1;
RuleTargetInput[_a] = { fqn: "@aws-cdk/aws-events.RuleTargetInput", version: "0.0.0" };
exports.RuleTargetInput = RuleTargetInput;
/**
 * Event Input that is directly derived from the construct
 */
class LiteralEventInput extends RuleTargetInput {
    constructor(props) {
        super();
        this.props = props;
    }
    /**
     * Return the input properties for this input object
     */
    bind(_rule) {
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
    constructor(input, inputType) {
        super();
        this.input = input;
        this.inputType = inputType;
    }
    bind(rule) {
        let fieldCounter = 0;
        const pathToKey = new Map();
        const inputPathsMap = {};
        function keyForField(f) {
            const existing = pathToKey.get(f.path);
            if (existing !== undefined) {
                return existing;
            }
            fieldCounter += 1;
            const key = f.displayHint || `f${fieldCounter}`;
            pathToKey.set(f.path, key);
            return key;
        }
        class EventFieldReplacer extends core_1.DefaultTokenResolver {
            constructor() {
                super(new core_1.StringConcat());
            }
            resolveToken(t, _context) {
                if (!isEventField(t)) {
                    return core_1.Token.asString(t);
                }
                const key = keyForField(t);
                if (inputPathsMap[key] && inputPathsMap[key] !== t.path) {
                    throw new Error(`Single key '${key}' is used for two different JSON paths: '${t.path}' and '${inputPathsMap[key]}'`);
                }
                inputPathsMap[key] = t.path;
                return `<${key}>`;
            }
        }
        const stack = core_1.Stack.of(rule);
        let resolved;
        if (this.inputType === InputType.Multiline) {
            // JSONify individual lines
            resolved = core_1.Tokenization.resolve(this.input, {
                scope: rule,
                resolver: new EventFieldReplacer(),
            });
            resolved = resolved.split('\n').map(stack.toJsonString).join('\n');
        }
        else {
            resolved = stack.toJsonString(core_1.Tokenization.resolve(this.input, {
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
    unquoteKeyPlaceholders(sub, keys) {
        if (this.inputType !== InputType.Object) {
            return sub;
        }
        return core_1.Lazy.uncachedString({ produce: (ctx) => core_1.Token.asString(deepUnquote(ctx.resolve(sub))) });
        function deepUnquote(resolved) {
            if (Array.isArray(resolved)) {
                return resolved.map(deepUnquote);
            }
            else if (typeof (resolved) === 'object' && resolved !== null) {
                for (const [key, value] of Object.entries(resolved)) {
                    resolved[key] = deepUnquote(value);
                }
                return resolved;
            }
            else if (typeof (resolved) === 'string') {
                return keys.reduce((r, key) => r.replace(new RegExp(`(?<!\\\\)\"\<${key}\>\"`, 'g'), `<${key}>`), resolved);
            }
            return resolved;
        }
    }
}
/**
 * Represents a field in the event pattern
 */
class EventField {
    /**
     * Extract the event ID from the event
     */
    static get eventId() {
        return this.fromPath('$.id');
    }
    /**
     * Extract the detail type from the event
     */
    static get detailType() {
        return this.fromPath('$.detail-type');
    }
    /**
     * Extract the source from the event
     */
    static get source() {
        return this.fromPath('$.source');
    }
    /**
     * Extract the account from the event
     */
    static get account() {
        return this.fromPath('$.account');
    }
    /**
     * Extract the time from the event
     */
    static get time() {
        return this.fromPath('$.time');
    }
    /**
     * Extract the region from the event
     */
    static get region() {
        return this.fromPath('$.region');
    }
    /**
     * Extract a custom JSON path from the event
     */
    static fromPath(path) {
        return new EventField(path).toString();
    }
    /**
     *
     * @param path the path to a field in the event pattern
     */
    constructor(path) {
        this.path = path;
        this.displayHint = this.path.replace(/^[^a-zA-Z0-9_-]+/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
        Object.defineProperty(this, EVENT_FIELD_SYMBOL, { value: true });
        this.creationStack = (0, core_1.captureStackTrace)();
    }
    resolve(_ctx) {
        return this.path;
    }
    toString() {
        return core_1.Token.asString(this, { displayHint: this.displayHint });
    }
    /**
     * Convert the path to the field in the event pattern to JSON
     */
    toJSON() {
        return `<path:${this.path}>`;
    }
}
_b = JSII_RTTI_SYMBOL_1;
EventField[_b] = { fqn: "@aws-cdk/aws-events.EventField", version: "0.0.0" };
exports.EventField = EventField;
var InputType;
(function (InputType) {
    InputType[InputType["Object"] = 0] = "Object";
    InputType[InputType["Text"] = 1] = "Text";
    InputType[InputType["Multiline"] = 2] = "Multiline";
})(InputType || (InputType = {}));
function isEventField(x) {
    return EVENT_FIELD_SYMBOL in x;
}
const EVENT_FIELD_SYMBOL = Symbol.for('@aws-cdk/aws-events.EventField');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdDQUd1QjtBQUd2Qjs7R0FFRztBQUNILE1BQXNCLGVBQWU7SUFDbkM7Ozs7Ozs7OztPQVNHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZEO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBWTtRQUMxQyxPQUFPLElBQUksb0JBQW9CLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM1RDtJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFRO1FBQy9CLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3hEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQVk7UUFDdEMsT0FBTyxJQUFJLGlCQUFpQixDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDbkQ7SUFFRDtLQUNDOzs7O0FBOUNtQiwwQ0FBZTtBQXdGckM7O0dBRUc7QUFDSCxNQUFNLGlCQUFrQixTQUFRLGVBQWU7SUFDN0MsWUFBNkIsS0FBZ0M7UUFDM0QsS0FBSyxFQUFFLENBQUM7UUFEbUIsVUFBSyxHQUFMLEtBQUssQ0FBMkI7S0FFNUQ7SUFFRDs7T0FFRztJQUNJLElBQUksQ0FBQyxLQUFZO1FBQ3RCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjtDQUNGO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJHO0FBQ0gsTUFBTSxvQkFBcUIsU0FBUSxlQUFlO0lBQ2hELFlBQTZCLEtBQVUsRUFBbUIsU0FBb0I7UUFD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TUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNqRSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUEsd0JBQWlCLEdBQUUsQ0FBQztLQUMxQztJQUVNLE9BQU8sQ0FBQyxJQUFxQjtRQUNsQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDbEI7SUFFTSxRQUFRO1FBQ2IsT0FBTyxZQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztLQUNoRTtJQUVEOztPQUVHO0lBQ0ksTUFBTTtRQUNYLE9BQU8sU0FBUyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7S0FDOUI7Ozs7QUEvRVUsZ0NBQVU7QUFrRnZCLElBQUssU0FJSjtBQUpELFdBQUssU0FBUztJQUNaLDZDQUFNLENBQUE7SUFDTix5Q0FBSSxDQUFBO0lBQ0osbURBQVMsQ0FBQTtBQUNYLENBQUMsRUFKSSxTQUFTLEtBQVQsU0FBUyxRQUliO0FBRUQsU0FBUyxZQUFZLENBQUMsQ0FBTTtJQUMxQixPQUFPLGtCQUFrQixJQUFJLENBQUMsQ0FBQztBQUNqQyxDQUFDO0FBRUQsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGdDQUFnQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBjYXB0dXJlU3RhY2tUcmFjZSwgRGVmYXVsdFRva2VuUmVzb2x2ZXIsIElSZXNvbHZhYmxlLFxuICBJUmVzb2x2ZUNvbnRleHQsIExhenksIFN0YWNrLCBTdHJpbmdDb25jYXQsIFRva2VuLCBUb2tlbml6YXRpb24sXG59IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSVJ1bGUgfSBmcm9tICcuL3J1bGUtcmVmJztcblxuLyoqXG4gKiBUaGUgaW5wdXQgdG8gc2VuZCB0byB0aGUgZXZlbnQgdGFyZ2V0XG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSdWxlVGFyZ2V0SW5wdXQge1xuICAvKipcbiAgICogUGFzcyB0ZXh0IHRvIHRoZSBldmVudCB0YXJnZXRcbiAgICpcbiAgICogTWF5IGNvbnRhaW4gc3RyaW5ncyByZXR1cm5lZCBieSBgRXZlbnRGaWVsZC5mcm9tKClgIHRvIHN1YnN0aXR1dGUgaW4gcGFydHMgb2YgdGhlXG4gICAqIG1hdGNoZWQgZXZlbnQuXG4gICAqXG4gICAqIFRoZSBSdWxlIFRhcmdldCBpbnB1dCB2YWx1ZSB3aWxsIGJlIGEgc2luZ2xlIHN0cmluZzogdGhlIHN0cmluZyB5b3UgcGFzc1xuICAgKiBoZXJlLiAgRG8gbm90IHVzZSB0aGlzIG1ldGhvZCB0byBwYXNzIGEgY29tcGxleCB2YWx1ZSBsaWtlIGEgSlNPTiBvYmplY3QgdG9cbiAgICogYSBSdWxlIFRhcmdldC4gIFVzZSBgUnVsZVRhcmdldElucHV0LmZyb21PYmplY3QoKWAgaW5zdGVhZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVRleHQodGV4dDogc3RyaW5nKTogUnVsZVRhcmdldElucHV0IHtcbiAgICByZXR1cm4gbmV3IEZpZWxkQXdhcmVFdmVudElucHV0KHRleHQsIElucHV0VHlwZS5UZXh0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQYXNzIHRleHQgdG8gdGhlIGV2ZW50IHRhcmdldCwgc3BsaXR0aW5nIG9uIG5ld2xpbmVzLlxuICAgKlxuICAgKiBUaGlzIGlzIG9ubHkgdXNlZnVsIHdoZW4gcGFzc2luZyB0byBhIHRhcmdldCB0aGF0IGRvZXMgbm90XG4gICAqIHRha2UgYSBzaW5nbGUgYXJndW1lbnQuXG4gICAqXG4gICAqIE1heSBjb250YWluIHN0cmluZ3MgcmV0dXJuZWQgYnkgYEV2ZW50RmllbGQuZnJvbSgpYCB0byBzdWJzdGl0dXRlIGluIHBhcnRzXG4gICAqIG9mIHRoZSBtYXRjaGVkIGV2ZW50LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTXVsdGlsaW5lVGV4dCh0ZXh0OiBzdHJpbmcpOiBSdWxlVGFyZ2V0SW5wdXQge1xuICAgIHJldHVybiBuZXcgRmllbGRBd2FyZUV2ZW50SW5wdXQodGV4dCwgSW5wdXRUeXBlLk11bHRpbGluZSk7XG4gIH1cblxuICAvKipcbiAgICogUGFzcyBhIEpTT04gb2JqZWN0IHRvIHRoZSBldmVudCB0YXJnZXRcbiAgICpcbiAgICogTWF5IGNvbnRhaW4gc3RyaW5ncyByZXR1cm5lZCBieSBgRXZlbnRGaWVsZC5mcm9tKClgIHRvIHN1YnN0aXR1dGUgaW4gcGFydHMgb2YgdGhlXG4gICAqIG1hdGNoZWQgZXZlbnQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21PYmplY3Qob2JqOiBhbnkpOiBSdWxlVGFyZ2V0SW5wdXQge1xuICAgIHJldHVybiBuZXcgRmllbGRBd2FyZUV2ZW50SW5wdXQob2JqLCBJbnB1dFR5cGUuT2JqZWN0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlIHRoZSBldmVudCB0YXJnZXQgaW5wdXQgZnJvbSBhIHBhdGggaW4gdGhlIGV2ZW50IEpTT05cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUV2ZW50UGF0aChwYXRoOiBzdHJpbmcpOiBSdWxlVGFyZ2V0SW5wdXQge1xuICAgIHJldHVybiBuZXcgTGl0ZXJhbEV2ZW50SW5wdXQoeyBpbnB1dFBhdGg6IHBhdGggfSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBpbnB1dCBwcm9wZXJ0aWVzIGZvciB0aGlzIGlucHV0IG9iamVjdFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGJpbmQocnVsZTogSVJ1bGUpOiBSdWxlVGFyZ2V0SW5wdXRQcm9wZXJ0aWVzO1xufVxuXG4vKipcbiAqIFRoZSBpbnB1dCBwcm9wZXJ0aWVzIGZvciBhbiBldmVudCB0YXJnZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSdWxlVGFyZ2V0SW5wdXRQcm9wZXJ0aWVzIHtcbiAgLyoqXG4gICAqIExpdGVyYWwgaW5wdXQgdG8gdGhlIHRhcmdldCBzZXJ2aWNlIChtdXN0IGJlIHZhbGlkIEpTT04pXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gaW5wdXQgZm9yIHRoZSBldmVudCB0YXJnZXQuIElmIHRoZSBpbnB1dCBjb250YWlucyBhIHBhdGhzIG1hcFxuICAgKiAgIHZhbHVlcyB3aWwgYmUgZXh0cmFjdGVkIGZyb20gZXZlbnQgYW5kIGluc2VydGVkIGludG8gdGhlIGBpbnB1dFRlbXBsYXRlYC5cbiAgICovXG4gIHJlYWRvbmx5IGlucHV0Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBKc29uUGF0aCB0byB0YWtlIGlucHV0IGZyb20gdGhlIGlucHV0IGV2ZW50XG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS4gVGhlIGVudGlyZSBtYXRjaGVkIGV2ZW50IGlzIHBhc3NlZCBhcyBpbnB1dFxuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXRQYXRoPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbnB1dCB0ZW1wbGF0ZSB0byBpbnNlcnQgcGF0aHMgbWFwIGludG9cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgaW5wdXRUZW1wbGF0ZT86IHN0cmluZztcblxuICAvKipcbiAgICogUGF0aHMgbWFwIHRvIGV4dHJhY3QgdmFsdWVzIGZyb20gZXZlbnQgYW5kIGluc2VydCBpbnRvIGBpbnB1dFRlbXBsYXRlYFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIHZhbHVlcyBleHRyYWN0ZWQgZnJvbSBldmVudC5cbiAgICovXG4gIHJlYWRvbmx5IGlucHV0UGF0aHNNYXA/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xufVxuXG4vKipcbiAqIEV2ZW50IElucHV0IHRoYXQgaXMgZGlyZWN0bHkgZGVyaXZlZCBmcm9tIHRoZSBjb25zdHJ1Y3RcbiAqL1xuY2xhc3MgTGl0ZXJhbEV2ZW50SW5wdXQgZXh0ZW5kcyBSdWxlVGFyZ2V0SW5wdXQge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBSdWxlVGFyZ2V0SW5wdXRQcm9wZXJ0aWVzKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGlucHV0IHByb3BlcnRpZXMgZm9yIHRoaXMgaW5wdXQgb2JqZWN0XG4gICAqL1xuICBwdWJsaWMgYmluZChfcnVsZTogSVJ1bGUpOiBSdWxlVGFyZ2V0SW5wdXRQcm9wZXJ0aWVzIHtcbiAgICByZXR1cm4gdGhpcy5wcm9wcztcbiAgfVxufVxuXG4vKipcbiAqIElucHV0IG9iamVjdCB0aGF0IGNhbiBjb250YWluIGZpZWxkIHJlcGxhY2VtZW50c1xuICpcbiAqIEV2YWx1YXRpb24gaXMgZG9uZSBpbiB0aGUgYmluZCgpIG1ldGhvZCBiZWNhdXNlIHRva2VuIHJlc29sdXRpb25cbiAqIHJlcXVpcmVzIGFjY2VzcyB0byB0aGUgY29uc3RydWN0IHRyZWUuXG4gKlxuICogTXVsdGlwbGUgdG9rZW5zIHRoYXQgdXNlIHRoZSBzYW1lIHBhdGggd2lsbCB1c2UgdGhlIHNhbWUgc3Vic3RpdHV0aW9uXG4gKiBrZXkuXG4gKlxuICogT25lIHdlaXJkIGV4Y2VwdGlvbjogaWYgd2UncmUgaW4gb2JqZWN0IGNvbnRleHQsIHdlIE1VU1Qgc2tpcCB0aGUgcXVvdGVzXG4gKiBhcm91bmQgdGhlIHBsYWNlaG9sZGVyLiBJIGFzc3VtZSB0aGlzIGlzIHNvIG9uY2UgYSB0cml2aWFsIHN0cmluZyByZXBsYWNlIGlzXG4gKiBkb25lIGxhdGVyIG9uIGJ5IEV2ZW50QnJpZGdlLCBudW1iZXJzIGFyZSBzdGlsbCBudW1iZXJzLlxuICpcbiAqIFNvIGluIHN0cmluZyBjb250ZXh0OlxuICpcbiAqICAgIFwidGhpcyBpcyBhIHN0cmluZyB3aXRoIGEgPGZpZWxkPlwiXG4gKlxuICogQnV0IGluIG9iamVjdCBjb250ZXh0OlxuICpcbiAqICAgIFwieyBcXFwidGhpcyBpcyB0aGVcXFwiOiA8ZmllbGQ+IH1cIlxuICpcbiAqIFRvIGFjaGlldmUgdGhlIGxhdHRlciwgd2UgcG9zdHByb2Nlc3MgdGhlIEpTT04gc3RyaW5nIHRvIHJlbW92ZSB0aGUgc3Vycm91bmRpbmdcbiAqIHF1b3RlcyBieSB1c2luZyBhIHN0cmluZyByZXBsYWNlLlxuICovXG5jbGFzcyBGaWVsZEF3YXJlRXZlbnRJbnB1dCBleHRlbmRzIFJ1bGVUYXJnZXRJbnB1dCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgaW5wdXQ6IGFueSwgcHJpdmF0ZSByZWFkb25seSBpbnB1dFR5cGU6IElucHV0VHlwZSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgYmluZChydWxlOiBJUnVsZSk6IFJ1bGVUYXJnZXRJbnB1dFByb3BlcnRpZXMge1xuICAgIGxldCBmaWVsZENvdW50ZXIgPSAwO1xuICAgIGNvbnN0IHBhdGhUb0tleSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmc+KCk7XG4gICAgY29uc3QgaW5wdXRQYXRoc01hcDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcblxuICAgIGZ1bmN0aW9uIGtleUZvckZpZWxkKGY6IEV2ZW50RmllbGQpIHtcbiAgICAgIGNvbnN0IGV4aXN0aW5nID0gcGF0aFRvS2V5LmdldChmLnBhdGgpO1xuICAgICAgaWYgKGV4aXN0aW5nICE9PSB1bmRlZmluZWQpIHsgcmV0dXJuIGV4aXN0aW5nOyB9XG5cbiAgICAgIGZpZWxkQ291bnRlciArPSAxO1xuICAgICAgY29uc3Qga2V5ID0gZi5kaXNwbGF5SGludCB8fCBgZiR7ZmllbGRDb3VudGVyfWA7XG4gICAgICBwYXRoVG9LZXkuc2V0KGYucGF0aCwga2V5KTtcbiAgICAgIHJldHVybiBrZXk7XG4gICAgfVxuXG4gICAgY2xhc3MgRXZlbnRGaWVsZFJlcGxhY2VyIGV4dGVuZHMgRGVmYXVsdFRva2VuUmVzb2x2ZXIge1xuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKG5ldyBTdHJpbmdDb25jYXQoKSk7XG4gICAgICB9XG5cbiAgICAgIHB1YmxpYyByZXNvbHZlVG9rZW4odDogVG9rZW4sIF9jb250ZXh0OiBJUmVzb2x2ZUNvbnRleHQpIHtcbiAgICAgICAgaWYgKCFpc0V2ZW50RmllbGQodCkpIHsgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHQpOyB9XG5cbiAgICAgICAgY29uc3Qga2V5ID0ga2V5Rm9yRmllbGQodCk7XG4gICAgICAgIGlmIChpbnB1dFBhdGhzTWFwW2tleV0gJiYgaW5wdXRQYXRoc01hcFtrZXldICE9PSB0LnBhdGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNpbmdsZSBrZXkgJyR7a2V5fScgaXMgdXNlZCBmb3IgdHdvIGRpZmZlcmVudCBKU09OIHBhdGhzOiAnJHt0LnBhdGh9JyBhbmQgJyR7aW5wdXRQYXRoc01hcFtrZXldfSdgKTtcbiAgICAgICAgfVxuICAgICAgICBpbnB1dFBhdGhzTWFwW2tleV0gPSB0LnBhdGg7XG5cbiAgICAgICAgcmV0dXJuIGA8JHtrZXl9PmA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihydWxlKTtcblxuICAgIGxldCByZXNvbHZlZDogc3RyaW5nO1xuICAgIGlmICh0aGlzLmlucHV0VHlwZSA9PT0gSW5wdXRUeXBlLk11bHRpbGluZSkge1xuICAgICAgLy8gSlNPTmlmeSBpbmRpdmlkdWFsIGxpbmVzXG4gICAgICByZXNvbHZlZCA9IFRva2VuaXphdGlvbi5yZXNvbHZlKHRoaXMuaW5wdXQsIHtcbiAgICAgICAgc2NvcGU6IHJ1bGUsXG4gICAgICAgIHJlc29sdmVyOiBuZXcgRXZlbnRGaWVsZFJlcGxhY2VyKCksXG4gICAgICB9KTtcbiAgICAgIHJlc29sdmVkID0gcmVzb2x2ZWQuc3BsaXQoJ1xcbicpLm1hcChzdGFjay50b0pzb25TdHJpbmcpLmpvaW4oJ1xcbicpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNvbHZlZCA9IHN0YWNrLnRvSnNvblN0cmluZyhUb2tlbml6YXRpb24ucmVzb2x2ZSh0aGlzLmlucHV0LCB7XG4gICAgICAgIHNjb3BlOiBydWxlLFxuICAgICAgICByZXNvbHZlcjogbmV3IEV2ZW50RmllbGRSZXBsYWNlcigpLFxuICAgICAgfSkpO1xuICAgIH1cblxuICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhpbnB1dFBhdGhzTWFwKTtcblxuICAgIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgLy8gTm90aGluZyBzcGVjaWFsLCBqdXN0IHJldHVybiAnaW5wdXQnXG4gICAgICByZXR1cm4geyBpbnB1dDogcmVzb2x2ZWQgfTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgaW5wdXRUZW1wbGF0ZTogdGhpcy51bnF1b3RlS2V5UGxhY2Vob2xkZXJzKHJlc29sdmVkLCBrZXlzKSxcbiAgICAgIGlucHV0UGF0aHNNYXAsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmluZyBzdXJyb3VuZGluZyBxdW90ZXMgZnJvbSBhbnkgb2JqZWN0IHBsYWNlaG9sZGVyc1xuICAgKiB3aGVuIGtleSBpcyB0aGUgbG9uZSB2YWx1ZS5cbiAgICpcbiAgICogVGhvc2UgaGF2ZSBiZWVuIHB1dCB0aGVyZSBieSBKU09OLnN0cmluZ2lmeSgpLCBidXQgd2UgbmVlZCB0b1xuICAgKiByZW1vdmUgdGhlbS5cbiAgICpcbiAgICogRG8gbm90IHJlbW92ZSBxdW90ZXMgd2hlbiB0aGUga2V5IGlzIHBhcnQgb2YgYSBsYXJnZXIgc3RyaW5nLlxuICAgKlxuICAgKiBWYWxpZDogeyBcImRhdGFcIjogXCJTb21lIHN0cmluZyB3aXRoIFxcXCJxdW90ZXNcXFwiPGtleT5cIiB9IC8vIGtleSB3aWxsIGJlIHN0cmluZ1xuICAgKiBWYWxpZDogeyBcImRhdGFcIjogPGtleT4gfSAvLyBLZXkgY291bGQgYmUgbnVtYmVyLCBib29sLCBvYmosIG9yIHN0cmluZ1xuICAgKi9cbiAgcHJpdmF0ZSB1bnF1b3RlS2V5UGxhY2Vob2xkZXJzKHN1Yjogc3RyaW5nLCBrZXlzOiBzdHJpbmdbXSkge1xuICAgIGlmICh0aGlzLmlucHV0VHlwZSAhPT0gSW5wdXRUeXBlLk9iamVjdCkgeyByZXR1cm4gc3ViOyB9XG5cbiAgICByZXR1cm4gTGF6eS51bmNhY2hlZFN0cmluZyh7IHByb2R1Y2U6IChjdHg6IElSZXNvbHZlQ29udGV4dCkgPT4gVG9rZW4uYXNTdHJpbmcoZGVlcFVucXVvdGUoY3R4LnJlc29sdmUoc3ViKSkpIH0pO1xuXG4gICAgZnVuY3Rpb24gZGVlcFVucXVvdGUocmVzb2x2ZWQ6IGFueSk6IGFueSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShyZXNvbHZlZCkpIHtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVkLm1hcChkZWVwVW5xdW90ZSk7XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZihyZXNvbHZlZCkgPT09ICdvYmplY3QnICYmIHJlc29sdmVkICE9PSBudWxsKSB7XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKHJlc29sdmVkKSkge1xuICAgICAgICAgIHJlc29sdmVkW2tleV0gPSBkZWVwVW5xdW90ZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc29sdmVkO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YocmVzb2x2ZWQpID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4ga2V5cy5yZWR1Y2UoKHIsIGtleSkgPT4gci5yZXBsYWNlKG5ldyBSZWdFeHAoYCg/PCFcXFxcXFxcXClcXFwiXFw8JHtrZXl9XFw+XFxcImAsICdnJyksIGA8JHtrZXl9PmApLCByZXNvbHZlZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzb2x2ZWQ7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIGZpZWxkIGluIHRoZSBldmVudCBwYXR0ZXJuXG4gKi9cbmV4cG9ydCBjbGFzcyBFdmVudEZpZWxkIGltcGxlbWVudHMgSVJlc29sdmFibGUge1xuICAvKipcbiAgICogRXh0cmFjdCB0aGUgZXZlbnQgSUQgZnJvbSB0aGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IGV2ZW50SWQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tUGF0aCgnJC5pZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgdGhlIGRldGFpbCB0eXBlIGZyb20gdGhlIGV2ZW50XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldCBkZXRhaWxUeXBlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbVBhdGgoJyQuZGV0YWlsLXR5cGUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IHRoZSBzb3VyY2UgZnJvbSB0aGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IHNvdXJjZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmZyb21QYXRoKCckLnNvdXJjZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgdGhlIGFjY291bnQgZnJvbSB0aGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IGFjY291bnQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tUGF0aCgnJC5hY2NvdW50Jyk7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdCB0aGUgdGltZSBmcm9tIHRoZSBldmVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXQgdGltZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmZyb21QYXRoKCckLnRpbWUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IHRoZSByZWdpb24gZnJvbSB0aGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IHJlZ2lvbigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmZyb21QYXRoKCckLnJlZ2lvbicpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgYSBjdXN0b20gSlNPTiBwYXRoIGZyb20gdGhlIGV2ZW50XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21QYXRoKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG5ldyBFdmVudEZpZWxkKHBhdGgpLnRvU3RyaW5nKCk7XG4gIH1cblxuICAvKipcbiAgICogSHVtYW4gcmVhZGFibGUgZGlzcGxheSBoaW50IGFib3V0IHRoZSBldmVudCBwYXR0ZXJuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZGlzcGxheUhpbnQ6IHN0cmluZztcbiAgcHVibGljIHJlYWRvbmx5IGNyZWF0aW9uU3RhY2s6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0gcGF0aCB0aGUgcGF0aCB0byBhIGZpZWxkIGluIHRoZSBldmVudCBwYXR0ZXJuXG4gICAqL1xuICBwcml2YXRlIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBwYXRoOiBzdHJpbmcpIHtcbiAgICB0aGlzLmRpc3BsYXlIaW50ID0gdGhpcy5wYXRoLnJlcGxhY2UoL15bXmEtekEtWjAtOV8tXSsvLCAnJykucmVwbGFjZSgvW15hLXpBLVowLTlfLV0vZywgJy0nKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgRVZFTlRfRklFTERfU1lNQk9MLCB7IHZhbHVlOiB0cnVlIH0pO1xuICAgIHRoaXMuY3JlYXRpb25TdGFjayA9IGNhcHR1cmVTdGFja1RyYWNlKCk7XG4gIH1cblxuICBwdWJsaWMgcmVzb2x2ZShfY3R4OiBJUmVzb2x2ZUNvbnRleHQpOiBhbnkge1xuICAgIHJldHVybiB0aGlzLnBhdGg7XG4gIH1cblxuICBwdWJsaWMgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIFRva2VuLmFzU3RyaW5nKHRoaXMsIHsgZGlzcGxheUhpbnQ6IHRoaXMuZGlzcGxheUhpbnQgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29udmVydCB0aGUgcGF0aCB0byB0aGUgZmllbGQgaW4gdGhlIGV2ZW50IHBhdHRlcm4gdG8gSlNPTlxuICAgKi9cbiAgcHVibGljIHRvSlNPTigpIHtcbiAgICByZXR1cm4gYDxwYXRoOiR7dGhpcy5wYXRofT5gO1xuICB9XG59XG5cbmVudW0gSW5wdXRUeXBlIHtcbiAgT2JqZWN0LFxuICBUZXh0LFxuICBNdWx0aWxpbmUsXG59XG5cbmZ1bmN0aW9uIGlzRXZlbnRGaWVsZCh4OiBhbnkpOiB4IGlzIEV2ZW50RmllbGQge1xuICByZXR1cm4gRVZFTlRfRklFTERfU1lNQk9MIGluIHg7XG59XG5cbmNvbnN0IEVWRU5UX0ZJRUxEX1NZTUJPTCA9IFN5bWJvbC5mb3IoJ0Bhd3MtY2RrL2F3cy1ldmVudHMuRXZlbnRGaWVsZCcpO1xuIl19