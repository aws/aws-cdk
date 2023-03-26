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
    constructor() {
    }
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
}
exports.RuleTargetInput = RuleTargetInput;
_a = JSII_RTTI_SYMBOL_1;
RuleTargetInput[_a] = { fqn: "@aws-cdk/aws-events.RuleTargetInput", version: "0.0.0" };
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
     *
     * @param path the path to a field in the event pattern
     */
    constructor(path) {
        this.path = path;
        this.displayHint = this.path.replace(/^[^a-zA-Z0-9_-]+/, '').replace(/[^a-zA-Z0-9_-]/g, '-');
        Object.defineProperty(this, EVENT_FIELD_SYMBOL, { value: true });
        this.creationStack = core_1.captureStackTrace();
    }
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
exports.EventField = EventField;
_b = JSII_RTTI_SYMBOL_1;
EventField[_b] = { fqn: "@aws-cdk/aws-events.EventField", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnB1dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdDQUd1QjtBQUd2Qjs7R0FFRztBQUNILE1BQXNCLGVBQWU7SUE2Q25DO0tBQ0M7SUE3Q0Q7Ozs7Ozs7OztPQVNHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZEO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBWTtRQUMxQyxPQUFPLElBQUksb0JBQW9CLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM1RDtJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFRO1FBQy9CLE9BQU8sSUFBSSxvQkFBb0IsQ0FBQyxHQUFHLEVBQUUsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3hEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsYUFBYSxDQUFDLElBQVk7UUFDdEMsT0FBTyxJQUFJLGlCQUFpQixDQUFDLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDbkQ7O0FBM0NILDBDQW9EQzs7O0FBb0NEOztHQUVHO0FBQ0gsTUFBTSxpQkFBa0IsU0FBUSxlQUFlO0lBQzdDLFlBQTZCLEtBQWdDO1FBQzNELEtBQUssRUFBRSxDQUFDO1FBRG1CLFVBQUssR0FBTCxLQUFLLENBQTJCO0tBRTVEO0lBRUQ7O09BRUc7SUFDSSxJQUFJLENBQUMsS0FBWTtRQUN0QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbkI7Q0FDRjtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUNILE1BQU0sb0JBQXFCLFNBQVEsZUFBZTtJQUNoRCxZQUE2QixLQUFVLEVBQW1CLFNBQW9CO1FB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Q0FBQyxVQUFVLENBQUMsQ0FBQztLQUNsQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFZO1FBQ2pDLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7S0FDeEM7SUFrQk0sT0FBTyxDQUFDLElBQXFCO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQztLQUNsQjtJQUVNLFFBQVE7UUFDYixPQUFPLFlBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0tBQ2hFO0lBRUQ7O09BRUc7SUFDSSxNQUFNO1FBQ1gsT0FBTyxTQUFTLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQztLQUM5Qjs7QUEvRUgsZ0NBZ0ZDOzs7QUFFRCxJQUFLLFNBSUo7QUFKRCxXQUFLLFNBQVM7SUFDWiw2Q0FBTSxDQUFBO0lBQ04seUNBQUksQ0FBQTtJQUNKLG1EQUFTLENBQUE7QUFDWCxDQUFDLEVBSkksU0FBUyxLQUFULFNBQVMsUUFJYjtBQUVELFNBQVMsWUFBWSxDQUFDLENBQU07SUFDMUIsT0FBTyxrQkFBa0IsSUFBSSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUVELE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgY2FwdHVyZVN0YWNrVHJhY2UsIERlZmF1bHRUb2tlblJlc29sdmVyLCBJUmVzb2x2YWJsZSxcbiAgSVJlc29sdmVDb250ZXh0LCBMYXp5LCBTdGFjaywgU3RyaW5nQ29uY2F0LCBUb2tlbiwgVG9rZW5pemF0aW9uLFxufSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IElSdWxlIH0gZnJvbSAnLi9ydWxlLXJlZic7XG5cbi8qKlxuICogVGhlIGlucHV0IHRvIHNlbmQgdG8gdGhlIGV2ZW50IHRhcmdldFxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUnVsZVRhcmdldElucHV0IHtcbiAgLyoqXG4gICAqIFBhc3MgdGV4dCB0byB0aGUgZXZlbnQgdGFyZ2V0XG4gICAqXG4gICAqIE1heSBjb250YWluIHN0cmluZ3MgcmV0dXJuZWQgYnkgYEV2ZW50RmllbGQuZnJvbSgpYCB0byBzdWJzdGl0dXRlIGluIHBhcnRzIG9mIHRoZVxuICAgKiBtYXRjaGVkIGV2ZW50LlxuICAgKlxuICAgKiBUaGUgUnVsZSBUYXJnZXQgaW5wdXQgdmFsdWUgd2lsbCBiZSBhIHNpbmdsZSBzdHJpbmc6IHRoZSBzdHJpbmcgeW91IHBhc3NcbiAgICogaGVyZS4gIERvIG5vdCB1c2UgdGhpcyBtZXRob2QgdG8gcGFzcyBhIGNvbXBsZXggdmFsdWUgbGlrZSBhIEpTT04gb2JqZWN0IHRvXG4gICAqIGEgUnVsZSBUYXJnZXQuICBVc2UgYFJ1bGVUYXJnZXRJbnB1dC5mcm9tT2JqZWN0KClgIGluc3RlYWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21UZXh0KHRleHQ6IHN0cmluZyk6IFJ1bGVUYXJnZXRJbnB1dCB7XG4gICAgcmV0dXJuIG5ldyBGaWVsZEF3YXJlRXZlbnRJbnB1dCh0ZXh0LCBJbnB1dFR5cGUuVGV4dCk7XG4gIH1cblxuICAvKipcbiAgICogUGFzcyB0ZXh0IHRvIHRoZSBldmVudCB0YXJnZXQsIHNwbGl0dGluZyBvbiBuZXdsaW5lcy5cbiAgICpcbiAgICogVGhpcyBpcyBvbmx5IHVzZWZ1bCB3aGVuIHBhc3NpbmcgdG8gYSB0YXJnZXQgdGhhdCBkb2VzIG5vdFxuICAgKiB0YWtlIGEgc2luZ2xlIGFyZ3VtZW50LlxuICAgKlxuICAgKiBNYXkgY29udGFpbiBzdHJpbmdzIHJldHVybmVkIGJ5IGBFdmVudEZpZWxkLmZyb20oKWAgdG8gc3Vic3RpdHV0ZSBpbiBwYXJ0c1xuICAgKiBvZiB0aGUgbWF0Y2hlZCBldmVudC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbU11bHRpbGluZVRleHQodGV4dDogc3RyaW5nKTogUnVsZVRhcmdldElucHV0IHtcbiAgICByZXR1cm4gbmV3IEZpZWxkQXdhcmVFdmVudElucHV0KHRleHQsIElucHV0VHlwZS5NdWx0aWxpbmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBhc3MgYSBKU09OIG9iamVjdCB0byB0aGUgZXZlbnQgdGFyZ2V0XG4gICAqXG4gICAqIE1heSBjb250YWluIHN0cmluZ3MgcmV0dXJuZWQgYnkgYEV2ZW50RmllbGQuZnJvbSgpYCB0byBzdWJzdGl0dXRlIGluIHBhcnRzIG9mIHRoZVxuICAgKiBtYXRjaGVkIGV2ZW50LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tT2JqZWN0KG9iajogYW55KTogUnVsZVRhcmdldElucHV0IHtcbiAgICByZXR1cm4gbmV3IEZpZWxkQXdhcmVFdmVudElucHV0KG9iaiwgSW5wdXRUeXBlLk9iamVjdCk7XG4gIH1cblxuICAvKipcbiAgICogVGFrZSB0aGUgZXZlbnQgdGFyZ2V0IGlucHV0IGZyb20gYSBwYXRoIGluIHRoZSBldmVudCBKU09OXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21FdmVudFBhdGgocGF0aDogc3RyaW5nKTogUnVsZVRhcmdldElucHV0IHtcbiAgICByZXR1cm4gbmV3IExpdGVyYWxFdmVudElucHV0KHsgaW5wdXRQYXRoOiBwYXRoIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKCkge1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgaW5wdXQgcHJvcGVydGllcyBmb3IgdGhpcyBpbnB1dCBvYmplY3RcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBiaW5kKHJ1bGU6IElSdWxlKTogUnVsZVRhcmdldElucHV0UHJvcGVydGllcztcbn1cblxuLyoqXG4gKiBUaGUgaW5wdXQgcHJvcGVydGllcyBmb3IgYW4gZXZlbnQgdGFyZ2V0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUnVsZVRhcmdldElucHV0UHJvcGVydGllcyB7XG4gIC8qKlxuICAgKiBMaXRlcmFsIGlucHV0IHRvIHRoZSB0YXJnZXQgc2VydmljZSAobXVzdCBiZSB2YWxpZCBKU09OKVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGlucHV0IGZvciB0aGUgZXZlbnQgdGFyZ2V0LiBJZiB0aGUgaW5wdXQgY29udGFpbnMgYSBwYXRocyBtYXBcbiAgICogICB2YWx1ZXMgd2lsIGJlIGV4dHJhY3RlZCBmcm9tIGV2ZW50IGFuZCBpbnNlcnRlZCBpbnRvIHRoZSBgaW5wdXRUZW1wbGF0ZWAuXG4gICAqL1xuICByZWFkb25seSBpbnB1dD86IHN0cmluZztcblxuICAvKipcbiAgICogSnNvblBhdGggdG8gdGFrZSBpbnB1dCBmcm9tIHRoZSBpbnB1dCBldmVudFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuIFRoZSBlbnRpcmUgbWF0Y2hlZCBldmVudCBpcyBwYXNzZWQgYXMgaW5wdXRcbiAgICovXG4gIHJlYWRvbmx5IGlucHV0UGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogSW5wdXQgdGVtcGxhdGUgdG8gaW5zZXJ0IHBhdGhzIG1hcCBpbnRvXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm9uZS5cbiAgICovXG4gIHJlYWRvbmx5IGlucHV0VGVtcGxhdGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFBhdGhzIG1hcCB0byBleHRyYWN0IHZhbHVlcyBmcm9tIGV2ZW50IGFuZCBpbnNlcnQgaW50byBgaW5wdXRUZW1wbGF0ZWBcbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyB2YWx1ZXMgZXh0cmFjdGVkIGZyb20gZXZlbnQuXG4gICAqL1xuICByZWFkb25seSBpbnB1dFBhdGhzTWFwPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcbn1cblxuLyoqXG4gKiBFdmVudCBJbnB1dCB0aGF0IGlzIGRpcmVjdGx5IGRlcml2ZWQgZnJvbSB0aGUgY29uc3RydWN0XG4gKi9cbmNsYXNzIExpdGVyYWxFdmVudElucHV0IGV4dGVuZHMgUnVsZVRhcmdldElucHV0IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogUnVsZVRhcmdldElucHV0UHJvcGVydGllcykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBpbnB1dCBwcm9wZXJ0aWVzIGZvciB0aGlzIGlucHV0IG9iamVjdFxuICAgKi9cbiAgcHVibGljIGJpbmQoX3J1bGU6IElSdWxlKTogUnVsZVRhcmdldElucHV0UHJvcGVydGllcyB7XG4gICAgcmV0dXJuIHRoaXMucHJvcHM7XG4gIH1cbn1cblxuLyoqXG4gKiBJbnB1dCBvYmplY3QgdGhhdCBjYW4gY29udGFpbiBmaWVsZCByZXBsYWNlbWVudHNcbiAqXG4gKiBFdmFsdWF0aW9uIGlzIGRvbmUgaW4gdGhlIGJpbmQoKSBtZXRob2QgYmVjYXVzZSB0b2tlbiByZXNvbHV0aW9uXG4gKiByZXF1aXJlcyBhY2Nlc3MgdG8gdGhlIGNvbnN0cnVjdCB0cmVlLlxuICpcbiAqIE11bHRpcGxlIHRva2VucyB0aGF0IHVzZSB0aGUgc2FtZSBwYXRoIHdpbGwgdXNlIHRoZSBzYW1lIHN1YnN0aXR1dGlvblxuICoga2V5LlxuICpcbiAqIE9uZSB3ZWlyZCBleGNlcHRpb246IGlmIHdlJ3JlIGluIG9iamVjdCBjb250ZXh0LCB3ZSBNVVNUIHNraXAgdGhlIHF1b3Rlc1xuICogYXJvdW5kIHRoZSBwbGFjZWhvbGRlci4gSSBhc3N1bWUgdGhpcyBpcyBzbyBvbmNlIGEgdHJpdmlhbCBzdHJpbmcgcmVwbGFjZSBpc1xuICogZG9uZSBsYXRlciBvbiBieSBFdmVudEJyaWRnZSwgbnVtYmVycyBhcmUgc3RpbGwgbnVtYmVycy5cbiAqXG4gKiBTbyBpbiBzdHJpbmcgY29udGV4dDpcbiAqXG4gKiAgICBcInRoaXMgaXMgYSBzdHJpbmcgd2l0aCBhIDxmaWVsZD5cIlxuICpcbiAqIEJ1dCBpbiBvYmplY3QgY29udGV4dDpcbiAqXG4gKiAgICBcInsgXFxcInRoaXMgaXMgdGhlXFxcIjogPGZpZWxkPiB9XCJcbiAqXG4gKiBUbyBhY2hpZXZlIHRoZSBsYXR0ZXIsIHdlIHBvc3Rwcm9jZXNzIHRoZSBKU09OIHN0cmluZyB0byByZW1vdmUgdGhlIHN1cnJvdW5kaW5nXG4gKiBxdW90ZXMgYnkgdXNpbmcgYSBzdHJpbmcgcmVwbGFjZS5cbiAqL1xuY2xhc3MgRmllbGRBd2FyZUV2ZW50SW5wdXQgZXh0ZW5kcyBSdWxlVGFyZ2V0SW5wdXQge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGlucHV0OiBhbnksIHByaXZhdGUgcmVhZG9ubHkgaW5wdXRUeXBlOiBJbnB1dFR5cGUpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGJpbmQocnVsZTogSVJ1bGUpOiBSdWxlVGFyZ2V0SW5wdXRQcm9wZXJ0aWVzIHtcbiAgICBsZXQgZmllbGRDb3VudGVyID0gMDtcbiAgICBjb25zdCBwYXRoVG9LZXkgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICAgIGNvbnN0IGlucHV0UGF0aHNNYXA6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgICBmdW5jdGlvbiBrZXlGb3JGaWVsZChmOiBFdmVudEZpZWxkKSB7XG4gICAgICBjb25zdCBleGlzdGluZyA9IHBhdGhUb0tleS5nZXQoZi5wYXRoKTtcbiAgICAgIGlmIChleGlzdGluZyAhPT0gdW5kZWZpbmVkKSB7IHJldHVybiBleGlzdGluZzsgfVxuXG4gICAgICBmaWVsZENvdW50ZXIgKz0gMTtcbiAgICAgIGNvbnN0IGtleSA9IGYuZGlzcGxheUhpbnQgfHwgYGYke2ZpZWxkQ291bnRlcn1gO1xuICAgICAgcGF0aFRvS2V5LnNldChmLnBhdGgsIGtleSk7XG4gICAgICByZXR1cm4ga2V5O1xuICAgIH1cblxuICAgIGNsYXNzIEV2ZW50RmllbGRSZXBsYWNlciBleHRlbmRzIERlZmF1bHRUb2tlblJlc29sdmVyIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcihuZXcgU3RyaW5nQ29uY2F0KCkpO1xuICAgICAgfVxuXG4gICAgICBwdWJsaWMgcmVzb2x2ZVRva2VuKHQ6IFRva2VuLCBfY29udGV4dDogSVJlc29sdmVDb250ZXh0KSB7XG4gICAgICAgIGlmICghaXNFdmVudEZpZWxkKHQpKSB7IHJldHVybiBUb2tlbi5hc1N0cmluZyh0KTsgfVxuXG4gICAgICAgIGNvbnN0IGtleSA9IGtleUZvckZpZWxkKHQpO1xuICAgICAgICBpZiAoaW5wdXRQYXRoc01hcFtrZXldICYmIGlucHV0UGF0aHNNYXBba2V5XSAhPT0gdC5wYXRoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBTaW5nbGUga2V5ICcke2tleX0nIGlzIHVzZWQgZm9yIHR3byBkaWZmZXJlbnQgSlNPTiBwYXRoczogJyR7dC5wYXRofScgYW5kICcke2lucHV0UGF0aHNNYXBba2V5XX0nYCk7XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXRQYXRoc01hcFtrZXldID0gdC5wYXRoO1xuXG4gICAgICAgIHJldHVybiBgPCR7a2V5fT5gO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YocnVsZSk7XG5cbiAgICBsZXQgcmVzb2x2ZWQ6IHN0cmluZztcbiAgICBpZiAodGhpcy5pbnB1dFR5cGUgPT09IElucHV0VHlwZS5NdWx0aWxpbmUpIHtcbiAgICAgIC8vIEpTT05pZnkgaW5kaXZpZHVhbCBsaW5lc1xuICAgICAgcmVzb2x2ZWQgPSBUb2tlbml6YXRpb24ucmVzb2x2ZSh0aGlzLmlucHV0LCB7XG4gICAgICAgIHNjb3BlOiBydWxlLFxuICAgICAgICByZXNvbHZlcjogbmV3IEV2ZW50RmllbGRSZXBsYWNlcigpLFxuICAgICAgfSk7XG4gICAgICByZXNvbHZlZCA9IHJlc29sdmVkLnNwbGl0KCdcXG4nKS5tYXAoc3RhY2sudG9Kc29uU3RyaW5nKS5qb2luKCdcXG4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb2x2ZWQgPSBzdGFjay50b0pzb25TdHJpbmcoVG9rZW5pemF0aW9uLnJlc29sdmUodGhpcy5pbnB1dCwge1xuICAgICAgICBzY29wZTogcnVsZSxcbiAgICAgICAgcmVzb2x2ZXI6IG5ldyBFdmVudEZpZWxkUmVwbGFjZXIoKSxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMoaW5wdXRQYXRoc01hcCk7XG5cbiAgICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIE5vdGhpbmcgc3BlY2lhbCwganVzdCByZXR1cm4gJ2lucHV0J1xuICAgICAgcmV0dXJuIHsgaW5wdXQ6IHJlc29sdmVkIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGlucHV0VGVtcGxhdGU6IHRoaXMudW5xdW90ZUtleVBsYWNlaG9sZGVycyhyZXNvbHZlZCwga2V5cyksXG4gICAgICBpbnB1dFBhdGhzTWFwLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmVtb3Zpbmcgc3Vycm91bmRpbmcgcXVvdGVzIGZyb20gYW55IG9iamVjdCBwbGFjZWhvbGRlcnNcbiAgICogd2hlbiBrZXkgaXMgdGhlIGxvbmUgdmFsdWUuXG4gICAqXG4gICAqIFRob3NlIGhhdmUgYmVlbiBwdXQgdGhlcmUgYnkgSlNPTi5zdHJpbmdpZnkoKSwgYnV0IHdlIG5lZWQgdG9cbiAgICogcmVtb3ZlIHRoZW0uXG4gICAqXG4gICAqIERvIG5vdCByZW1vdmUgcXVvdGVzIHdoZW4gdGhlIGtleSBpcyBwYXJ0IG9mIGEgbGFyZ2VyIHN0cmluZy5cbiAgICpcbiAgICogVmFsaWQ6IHsgXCJkYXRhXCI6IFwiU29tZSBzdHJpbmcgd2l0aCBcXFwicXVvdGVzXFxcIjxrZXk+XCIgfSAvLyBrZXkgd2lsbCBiZSBzdHJpbmdcbiAgICogVmFsaWQ6IHsgXCJkYXRhXCI6IDxrZXk+IH0gLy8gS2V5IGNvdWxkIGJlIG51bWJlciwgYm9vbCwgb2JqLCBvciBzdHJpbmdcbiAgICovXG4gIHByaXZhdGUgdW5xdW90ZUtleVBsYWNlaG9sZGVycyhzdWI6IHN0cmluZywga2V5czogc3RyaW5nW10pIHtcbiAgICBpZiAodGhpcy5pbnB1dFR5cGUgIT09IElucHV0VHlwZS5PYmplY3QpIHsgcmV0dXJuIHN1YjsgfVxuXG4gICAgcmV0dXJuIExhenkudW5jYWNoZWRTdHJpbmcoeyBwcm9kdWNlOiAoY3R4OiBJUmVzb2x2ZUNvbnRleHQpID0+IFRva2VuLmFzU3RyaW5nKGRlZXBVbnF1b3RlKGN0eC5yZXNvbHZlKHN1YikpKSB9KTtcblxuICAgIGZ1bmN0aW9uIGRlZXBVbnF1b3RlKHJlc29sdmVkOiBhbnkpOiBhbnkge1xuICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzb2x2ZWQpKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlZC5tYXAoZGVlcFVucXVvdGUpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YocmVzb2x2ZWQpID09PSAnb2JqZWN0JyAmJiByZXNvbHZlZCAhPT0gbnVsbCkge1xuICAgICAgICBmb3IgKGNvbnN0IFtrZXksIHZhbHVlXSBvZiBPYmplY3QuZW50cmllcyhyZXNvbHZlZCkpIHtcbiAgICAgICAgICByZXNvbHZlZFtrZXldID0gZGVlcFVucXVvdGUodmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlZDtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mKHJlc29sdmVkKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGtleXMucmVkdWNlKChyLCBrZXkpID0+IHIucmVwbGFjZShuZXcgUmVnRXhwKGAoPzwhXFxcXFxcXFwpXFxcIlxcPCR7a2V5fVxcPlxcXCJgLCAnZycpLCBgPCR7a2V5fT5gKSwgcmVzb2x2ZWQpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc29sdmVkO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBmaWVsZCBpbiB0aGUgZXZlbnQgcGF0dGVyblxuICovXG5leHBvcnQgY2xhc3MgRXZlbnRGaWVsZCBpbXBsZW1lbnRzIElSZXNvbHZhYmxlIHtcbiAgLyoqXG4gICAqIEV4dHJhY3QgdGhlIGV2ZW50IElEIGZyb20gdGhlIGV2ZW50XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldCBldmVudElkKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbVBhdGgoJyQuaWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IHRoZSBkZXRhaWwgdHlwZSBmcm9tIHRoZSBldmVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXQgZGV0YWlsVHlwZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmZyb21QYXRoKCckLmRldGFpbC10eXBlJyk7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdCB0aGUgc291cmNlIGZyb20gdGhlIGV2ZW50XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldCBzb3VyY2UoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tUGF0aCgnJC5zb3VyY2UnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IHRoZSBhY2NvdW50IGZyb20gdGhlIGV2ZW50XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldCBhY2NvdW50KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZnJvbVBhdGgoJyQuYWNjb3VudCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgdGhlIHRpbWUgZnJvbSB0aGUgZXZlbnRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IHRpbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tUGF0aCgnJC50aW1lJyk7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdCB0aGUgcmVnaW9uIGZyb20gdGhlIGV2ZW50XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldCByZWdpb24oKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5mcm9tUGF0aCgnJC5yZWdpb24nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFeHRyYWN0IGEgY3VzdG9tIEpTT04gcGF0aCBmcm9tIHRoZSBldmVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUGF0aChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBuZXcgRXZlbnRGaWVsZChwYXRoKS50b1N0cmluZygpO1xuICB9XG5cbiAgLyoqXG4gICAqIEh1bWFuIHJlYWRhYmxlIGRpc3BsYXkgaGludCBhYm91dCB0aGUgZXZlbnQgcGF0dGVyblxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGRpc3BsYXlIaW50OiBzdHJpbmc7XG4gIHB1YmxpYyByZWFkb25seSBjcmVhdGlvblN0YWNrOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICpcbiAgICogQHBhcmFtIHBhdGggdGhlIHBhdGggdG8gYSBmaWVsZCBpbiB0aGUgZXZlbnQgcGF0dGVyblxuICAgKi9cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgcGF0aDogc3RyaW5nKSB7XG4gICAgdGhpcy5kaXNwbGF5SGludCA9IHRoaXMucGF0aC5yZXBsYWNlKC9eW15hLXpBLVowLTlfLV0rLywgJycpLnJlcGxhY2UoL1teYS16QS1aMC05Xy1dL2csICctJyk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIEVWRU5UX0ZJRUxEX1NZTUJPTCwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiAgICB0aGlzLmNyZWF0aW9uU3RhY2sgPSBjYXB0dXJlU3RhY2tUcmFjZSgpO1xuICB9XG5cbiAgcHVibGljIHJlc29sdmUoX2N0eDogSVJlc29sdmVDb250ZXh0KTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5wYXRoO1xuICB9XG5cbiAgcHVibGljIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBUb2tlbi5hc1N0cmluZyh0aGlzLCB7IGRpc3BsYXlIaW50OiB0aGlzLmRpc3BsYXlIaW50IH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbnZlcnQgdGhlIHBhdGggdG8gdGhlIGZpZWxkIGluIHRoZSBldmVudCBwYXR0ZXJuIHRvIEpTT05cbiAgICovXG4gIHB1YmxpYyB0b0pTT04oKSB7XG4gICAgcmV0dXJuIGA8cGF0aDoke3RoaXMucGF0aH0+YDtcbiAgfVxufVxuXG5lbnVtIElucHV0VHlwZSB7XG4gIE9iamVjdCxcbiAgVGV4dCxcbiAgTXVsdGlsaW5lLFxufVxuXG5mdW5jdGlvbiBpc0V2ZW50RmllbGQoeDogYW55KTogeCBpcyBFdmVudEZpZWxkIHtcbiAgcmV0dXJuIEVWRU5UX0ZJRUxEX1NZTUJPTCBpbiB4O1xufVxuXG5jb25zdCBFVkVOVF9GSUVMRF9TWU1CT0wgPSBTeW1ib2wuZm9yKCdAYXdzLWNkay9hd3MtZXZlbnRzLkV2ZW50RmllbGQnKTtcbiJdfQ==