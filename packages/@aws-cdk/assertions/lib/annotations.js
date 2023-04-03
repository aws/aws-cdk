"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Annotations = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const messages_1 = require("./private/messages");
/**
 * Suite of assertions that can be run on a CDK Stack.
 * Focused on asserting annotations.
 */
class Annotations {
    /**
     * Base your assertions on the messages returned by a synthesized CDK `Stack`.
     * @param stack the CDK Stack to run assertions on
     */
    static fromStack(stack) {
        return new Annotations(toMessages(stack));
    }
    constructor(messages) {
        this._messages = convertArrayToMessagesType(messages);
    }
    /**
     * Assert that an error with the given message exists in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the error. Provide `'*'` to match all errors in the template.
     * @param message the error message as should be expected. This should be a string or Matcher object.
     */
    hasError(constructPath, message) {
        const matchError = (0, messages_1.hasMessage)(this._messages, constructPath, constructMessage('error', message));
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Assert that an error with the given message does not exist in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the error. Provide `'*'` to match all errors in the template.
     * @param message the error message as should be expected. This should be a string or Matcher object.
     */
    hasNoError(constructPath, message) {
        const matchError = (0, messages_1.hasNoMessage)(this._messages, constructPath, constructMessage('error', message));
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Get the set of matching errors of a given construct path and message.
     *
     * @param constructPath the construct path to the error. Provide `'*'` to match all errors in the template.
     * @param message the error message as should be expected. This should be a string or Matcher object.
     */
    findError(constructPath, message) {
        return convertMessagesTypeToArray((0, messages_1.findMessage)(this._messages, constructPath, constructMessage('error', message)));
    }
    /**
     * Assert that an warning with the given message exists in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the warning. Provide `'*'` to match all warnings in the template.
     * @param message the warning message as should be expected. This should be a string or Matcher object.
     */
    hasWarning(constructPath, message) {
        const matchError = (0, messages_1.hasMessage)(this._messages, constructPath, constructMessage('warning', message));
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Assert that an warning with the given message does not exist in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the warning. Provide `'*'` to match all warnings in the template.
     * @param message the warning message as should be expected. This should be a string or Matcher object.
     */
    hasNoWarning(constructPath, message) {
        const matchError = (0, messages_1.hasNoMessage)(this._messages, constructPath, constructMessage('warning', message));
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Get the set of matching warning of a given construct path and message.
     *
     * @param constructPath the construct path to the warning. Provide `'*'` to match all warnings in the template.
     * @param message the warning message as should be expected. This should be a string or Matcher object.
     */
    findWarning(constructPath, message) {
        return convertMessagesTypeToArray((0, messages_1.findMessage)(this._messages, constructPath, constructMessage('warning', message)));
    }
    /**
     * Assert that an info with the given message exists in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the info. Provide `'*'` to match all info in the template.
     * @param message the info message as should be expected. This should be a string or Matcher object.
     */
    hasInfo(constructPath, message) {
        const matchError = (0, messages_1.hasMessage)(this._messages, constructPath, constructMessage('info', message));
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Assert that an info with the given message does not exist in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the info. Provide `'*'` to match all info in the template.
     * @param message the info message as should be expected. This should be a string or Matcher object.
     */
    hasNoInfo(constructPath, message) {
        const matchError = (0, messages_1.hasNoMessage)(this._messages, constructPath, constructMessage('info', message));
        if (matchError) {
            throw new Error(matchError);
        }
    }
    /**
     * Get the set of matching infos of a given construct path and message.
     *
     * @param constructPath the construct path to the info. Provide `'*'` to match all infos in the template.
     * @param message the info message as should be expected. This should be a string or Matcher object.
     */
    findInfo(constructPath, message) {
        return convertMessagesTypeToArray((0, messages_1.findMessage)(this._messages, constructPath, constructMessage('info', message)));
    }
}
_a = JSII_RTTI_SYMBOL_1;
Annotations[_a] = { fqn: "@aws-cdk/assertions.Annotations", version: "0.0.0" };
exports.Annotations = Annotations;
function constructMessage(type, message) {
    return {
        level: type,
        entry: {
            data: message,
        },
    };
}
function convertArrayToMessagesType(messages) {
    return messages.reduce((obj, item, index) => {
        return {
            ...obj,
            [index]: item,
        };
    }, {});
}
function convertMessagesTypeToArray(messages) {
    return Object.values(messages);
}
function toMessages(stack) {
    const root = stack.node.root;
    if (!core_1.Stage.isStage(root)) {
        throw new Error('unexpected: all stacks must be part of a Stage or an App');
    }
    // to support incremental assertions (i.e. "expect(stack).toNotContainSomething(); doSomething(); expect(stack).toContainSomthing()")
    const force = true;
    const assembly = root.synth({ force });
    return assembly.getStackArtifact(stack.artifactId).messages;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ub3RhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbm5vdGF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdDQUE2QztBQUc3QyxpREFBMkU7QUFFM0U7OztHQUdHO0FBQ0gsTUFBYSxXQUFXO0lBQ3RCOzs7T0FHRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBWTtRQUNsQyxPQUFPLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQzNDO0lBSUQsWUFBb0IsUUFBNEI7UUFDOUMsSUFBSSxDQUFDLFNBQVMsR0FBRywwQkFBMEIsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN2RDtJQUVEOzs7OztPQUtHO0lBQ0ksUUFBUSxDQUFDLGFBQXFCLEVBQUUsT0FBWTtRQUNqRCxNQUFNLFVBQVUsR0FBRyxJQUFBLHFCQUFVLEVBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDakcsSUFBSSxVQUFVLEVBQUU7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzdCO0tBQ0Y7SUFFRDs7Ozs7T0FLRztJQUNJLFVBQVUsQ0FBQyxhQUFxQixFQUFFLE9BQVk7UUFDbkQsTUFBTSxVQUFVLEdBQUcsSUFBQSx1QkFBWSxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ25HLElBQUksVUFBVSxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QjtLQUNGO0lBRUQ7Ozs7O09BS0c7SUFDSSxTQUFTLENBQUMsYUFBcUIsRUFBRSxPQUFZO1FBQ2xELE9BQU8sMEJBQTBCLENBQUMsSUFBQSxzQkFBVyxFQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUs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Q0FBQyxJQUFJLENBQUM7SUFDN0IsSUFBSSxDQUFDLFlBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDeEIsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsQ0FBQyxDQUFDO0tBQzdFO0lBRUQscUlBQXFJO0lBQ3JJLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQztJQUVuQixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztJQUV2QyxPQUFPLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQzlELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdGFjaywgU3RhZ2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IFN5bnRoZXNpc01lc3NhZ2UgfSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgTWVzc2FnZXMgfSBmcm9tICcuL3ByaXZhdGUvbWVzc2FnZSc7XG5pbXBvcnQgeyBmaW5kTWVzc2FnZSwgaGFzTWVzc2FnZSwgaGFzTm9NZXNzYWdlIH0gZnJvbSAnLi9wcml2YXRlL21lc3NhZ2VzJztcblxuLyoqXG4gKiBTdWl0ZSBvZiBhc3NlcnRpb25zIHRoYXQgY2FuIGJlIHJ1biBvbiBhIENESyBTdGFjay5cbiAqIEZvY3VzZWQgb24gYXNzZXJ0aW5nIGFubm90YXRpb25zLlxuICovXG5leHBvcnQgY2xhc3MgQW5ub3RhdGlvbnMge1xuICAvKipcbiAgICogQmFzZSB5b3VyIGFzc2VydGlvbnMgb24gdGhlIG1lc3NhZ2VzIHJldHVybmVkIGJ5IGEgc3ludGhlc2l6ZWQgQ0RLIGBTdGFja2AuXG4gICAqIEBwYXJhbSBzdGFjayB0aGUgQ0RLIFN0YWNrIHRvIHJ1biBhc3NlcnRpb25zIG9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TdGFjayhzdGFjazogU3RhY2spOiBBbm5vdGF0aW9ucyB7XG4gICAgcmV0dXJuIG5ldyBBbm5vdGF0aW9ucyh0b01lc3NhZ2VzKHN0YWNrKSk7XG4gIH1cblxuICBwcml2YXRlIHJlYWRvbmx5IF9tZXNzYWdlczogTWVzc2FnZXM7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihtZXNzYWdlczogU3ludGhlc2lzTWVzc2FnZVtdKSB7XG4gICAgdGhpcy5fbWVzc2FnZXMgPSBjb252ZXJ0QXJyYXlUb01lc3NhZ2VzVHlwZShtZXNzYWdlcyk7XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgYW4gZXJyb3Igd2l0aCB0aGUgZ2l2ZW4gbWVzc2FnZSBleGlzdHMgaW4gdGhlIHN5bnRoZXNpemVkIENESyBgU3RhY2tgLlxuICAgKlxuICAgKiBAcGFyYW0gY29uc3RydWN0UGF0aCB0aGUgY29uc3RydWN0IHBhdGggdG8gdGhlIGVycm9yLiBQcm92aWRlIGAnKidgIHRvIG1hdGNoIGFsbCBlcnJvcnMgaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgZXJyb3IgbWVzc2FnZSBhcyBzaG91bGQgYmUgZXhwZWN0ZWQuIFRoaXMgc2hvdWxkIGJlIGEgc3RyaW5nIG9yIE1hdGNoZXIgb2JqZWN0LlxuICAgKi9cbiAgcHVibGljIGhhc0Vycm9yKGNvbnN0cnVjdFBhdGg6IHN0cmluZywgbWVzc2FnZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgbWF0Y2hFcnJvciA9IGhhc01lc3NhZ2UodGhpcy5fbWVzc2FnZXMsIGNvbnN0cnVjdFBhdGgsIGNvbnN0cnVjdE1lc3NhZ2UoJ2Vycm9yJywgbWVzc2FnZSkpO1xuICAgIGlmIChtYXRjaEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWF0Y2hFcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGF0IGFuIGVycm9yIHdpdGggdGhlIGdpdmVuIG1lc3NhZ2UgZG9lcyBub3QgZXhpc3QgaW4gdGhlIHN5bnRoZXNpemVkIENESyBgU3RhY2tgLlxuICAgKlxuICAgKiBAcGFyYW0gY29uc3RydWN0UGF0aCB0aGUgY29uc3RydWN0IHBhdGggdG8gdGhlIGVycm9yLiBQcm92aWRlIGAnKidgIHRvIG1hdGNoIGFsbCBlcnJvcnMgaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgZXJyb3IgbWVzc2FnZSBhcyBzaG91bGQgYmUgZXhwZWN0ZWQuIFRoaXMgc2hvdWxkIGJlIGEgc3RyaW5nIG9yIE1hdGNoZXIgb2JqZWN0LlxuICAgKi9cbiAgcHVibGljIGhhc05vRXJyb3IoY29uc3RydWN0UGF0aDogc3RyaW5nLCBtZXNzYWdlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBtYXRjaEVycm9yID0gaGFzTm9NZXNzYWdlKHRoaXMuX21lc3NhZ2VzLCBjb25zdHJ1Y3RQYXRoLCBjb25zdHJ1Y3RNZXNzYWdlKCdlcnJvcicsIG1lc3NhZ2UpKTtcbiAgICBpZiAobWF0Y2hFcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1hdGNoRXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHNldCBvZiBtYXRjaGluZyBlcnJvcnMgb2YgYSBnaXZlbiBjb25zdHJ1Y3QgcGF0aCBhbmQgbWVzc2FnZS5cbiAgICpcbiAgICogQHBhcmFtIGNvbnN0cnVjdFBhdGggdGhlIGNvbnN0cnVjdCBwYXRoIHRvIHRoZSBlcnJvci4gUHJvdmlkZSBgJyonYCB0byBtYXRjaCBhbGwgZXJyb3JzIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIG1lc3NhZ2UgdGhlIGVycm9yIG1lc3NhZ2UgYXMgc2hvdWxkIGJlIGV4cGVjdGVkLiBUaGlzIHNob3VsZCBiZSBhIHN0cmluZyBvciBNYXRjaGVyIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyBmaW5kRXJyb3IoY29uc3RydWN0UGF0aDogc3RyaW5nLCBtZXNzYWdlOiBhbnkpOiBTeW50aGVzaXNNZXNzYWdlW10ge1xuICAgIHJldHVybiBjb252ZXJ0TWVzc2FnZXNUeXBlVG9BcnJheShmaW5kTWVzc2FnZSh0aGlzLl9tZXNzYWdlcywgY29uc3RydWN0UGF0aCwgY29uc3RydWN0TWVzc2FnZSgnZXJyb3InLCBtZXNzYWdlKSkgYXMgTWVzc2FnZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGF0IGFuIHdhcm5pbmcgd2l0aCB0aGUgZ2l2ZW4gbWVzc2FnZSBleGlzdHMgaW4gdGhlIHN5bnRoZXNpemVkIENESyBgU3RhY2tgLlxuICAgKlxuICAgKiBAcGFyYW0gY29uc3RydWN0UGF0aCB0aGUgY29uc3RydWN0IHBhdGggdG8gdGhlIHdhcm5pbmcuIFByb3ZpZGUgYCcqJ2AgdG8gbWF0Y2ggYWxsIHdhcm5pbmdzIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIG1lc3NhZ2UgdGhlIHdhcm5pbmcgbWVzc2FnZSBhcyBzaG91bGQgYmUgZXhwZWN0ZWQuIFRoaXMgc2hvdWxkIGJlIGEgc3RyaW5nIG9yIE1hdGNoZXIgb2JqZWN0LlxuICAgKi9cbiAgcHVibGljIGhhc1dhcm5pbmcoY29uc3RydWN0UGF0aDogc3RyaW5nLCBtZXNzYWdlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBtYXRjaEVycm9yID0gaGFzTWVzc2FnZSh0aGlzLl9tZXNzYWdlcywgY29uc3RydWN0UGF0aCwgY29uc3RydWN0TWVzc2FnZSgnd2FybmluZycsIG1lc3NhZ2UpKTtcbiAgICBpZiAobWF0Y2hFcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1hdGNoRXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCBhbiB3YXJuaW5nIHdpdGggdGhlIGdpdmVuIG1lc3NhZ2UgZG9lcyBub3QgZXhpc3QgaW4gdGhlIHN5bnRoZXNpemVkIENESyBgU3RhY2tgLlxuICAgKlxuICAgKiBAcGFyYW0gY29uc3RydWN0UGF0aCB0aGUgY29uc3RydWN0IHBhdGggdG8gdGhlIHdhcm5pbmcuIFByb3ZpZGUgYCcqJ2AgdG8gbWF0Y2ggYWxsIHdhcm5pbmdzIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIG1lc3NhZ2UgdGhlIHdhcm5pbmcgbWVzc2FnZSBhcyBzaG91bGQgYmUgZXhwZWN0ZWQuIFRoaXMgc2hvdWxkIGJlIGEgc3RyaW5nIG9yIE1hdGNoZXIgb2JqZWN0LlxuICAgKi9cbiAgcHVibGljIGhhc05vV2FybmluZyhjb25zdHJ1Y3RQYXRoOiBzdHJpbmcsIG1lc3NhZ2U6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IG1hdGNoRXJyb3IgPSBoYXNOb01lc3NhZ2UodGhpcy5fbWVzc2FnZXMsIGNvbnN0cnVjdFBhdGgsIGNvbnN0cnVjdE1lc3NhZ2UoJ3dhcm5pbmcnLCBtZXNzYWdlKSk7XG4gICAgaWYgKG1hdGNoRXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtYXRjaEVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzZXQgb2YgbWF0Y2hpbmcgd2FybmluZyBvZiBhIGdpdmVuIGNvbnN0cnVjdCBwYXRoIGFuZCBtZXNzYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gY29uc3RydWN0UGF0aCB0aGUgY29uc3RydWN0IHBhdGggdG8gdGhlIHdhcm5pbmcuIFByb3ZpZGUgYCcqJ2AgdG8gbWF0Y2ggYWxsIHdhcm5pbmdzIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIG1lc3NhZ2UgdGhlIHdhcm5pbmcgbWVzc2FnZSBhcyBzaG91bGQgYmUgZXhwZWN0ZWQuIFRoaXMgc2hvdWxkIGJlIGEgc3RyaW5nIG9yIE1hdGNoZXIgb2JqZWN0LlxuICAgKi9cbiAgcHVibGljIGZpbmRXYXJuaW5nKGNvbnN0cnVjdFBhdGg6IHN0cmluZywgbWVzc2FnZTogYW55KTogU3ludGhlc2lzTWVzc2FnZVtdIHtcbiAgICByZXR1cm4gY29udmVydE1lc3NhZ2VzVHlwZVRvQXJyYXkoZmluZE1lc3NhZ2UodGhpcy5fbWVzc2FnZXMsIGNvbnN0cnVjdFBhdGgsIGNvbnN0cnVjdE1lc3NhZ2UoJ3dhcm5pbmcnLCBtZXNzYWdlKSkgYXMgTWVzc2FnZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGF0IGFuIGluZm8gd2l0aCB0aGUgZ2l2ZW4gbWVzc2FnZSBleGlzdHMgaW4gdGhlIHN5bnRoZXNpemVkIENESyBgU3RhY2tgLlxuICAgKlxuICAgKiBAcGFyYW0gY29uc3RydWN0UGF0aCB0aGUgY29uc3RydWN0IHBhdGggdG8gdGhlIGluZm8uIFByb3ZpZGUgYCcqJ2AgdG8gbWF0Y2ggYWxsIGluZm8gaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgaW5mbyBtZXNzYWdlIGFzIHNob3VsZCBiZSBleHBlY3RlZC4gVGhpcyBzaG91bGQgYmUgYSBzdHJpbmcgb3IgTWF0Y2hlciBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgaGFzSW5mbyhjb25zdHJ1Y3RQYXRoOiBzdHJpbmcsIG1lc3NhZ2U6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IG1hdGNoRXJyb3IgPSBoYXNNZXNzYWdlKHRoaXMuX21lc3NhZ2VzLCBjb25zdHJ1Y3RQYXRoLCBjb25zdHJ1Y3RNZXNzYWdlKCdpbmZvJywgbWVzc2FnZSkpO1xuICAgIGlmIChtYXRjaEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWF0Y2hFcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGF0IGFuIGluZm8gd2l0aCB0aGUgZ2l2ZW4gbWVzc2FnZSBkb2VzIG5vdCBleGlzdCBpbiB0aGUgc3ludGhlc2l6ZWQgQ0RLIGBTdGFja2AuXG4gICAqXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3RQYXRoIHRoZSBjb25zdHJ1Y3QgcGF0aCB0byB0aGUgaW5mby4gUHJvdmlkZSBgJyonYCB0byBtYXRjaCBhbGwgaW5mbyBpbiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBtZXNzYWdlIHRoZSBpbmZvIG1lc3NhZ2UgYXMgc2hvdWxkIGJlIGV4cGVjdGVkLiBUaGlzIHNob3VsZCBiZSBhIHN0cmluZyBvciBNYXRjaGVyIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyBoYXNOb0luZm8oY29uc3RydWN0UGF0aDogc3RyaW5nLCBtZXNzYWdlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBtYXRjaEVycm9yID0gaGFzTm9NZXNzYWdlKHRoaXMuX21lc3NhZ2VzLCBjb25zdHJ1Y3RQYXRoLCBjb25zdHJ1Y3RNZXNzYWdlKCdpbmZvJywgbWVzc2FnZSkpO1xuICAgIGlmIChtYXRjaEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWF0Y2hFcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc2V0IG9mIG1hdGNoaW5nIGluZm9zIG9mIGEgZ2l2ZW4gY29uc3RydWN0IHBhdGggYW5kIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3RQYXRoIHRoZSBjb25zdHJ1Y3QgcGF0aCB0byB0aGUgaW5mby4gUHJvdmlkZSBgJyonYCB0byBtYXRjaCBhbGwgaW5mb3MgaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgaW5mbyBtZXNzYWdlIGFzIHNob3VsZCBiZSBleHBlY3RlZC4gVGhpcyBzaG91bGQgYmUgYSBzdHJpbmcgb3IgTWF0Y2hlciBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgZmluZEluZm8oY29uc3RydWN0UGF0aDogc3RyaW5nLCBtZXNzYWdlOiBhbnkpOiBTeW50aGVzaXNNZXNzYWdlW10ge1xuICAgIHJldHVybiBjb252ZXJ0TWVzc2FnZXNUeXBlVG9BcnJheShmaW5kTWVzc2FnZSh0aGlzLl9tZXNzYWdlcywgY29uc3RydWN0UGF0aCwgY29uc3RydWN0TWVzc2FnZSgnaW5mbycsIG1lc3NhZ2UpKSBhcyBNZXNzYWdlcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29uc3RydWN0TWVzc2FnZSh0eXBlOiAnaW5mbycgfCAnd2FybmluZycgfCAnZXJyb3InLCBtZXNzYWdlOiBhbnkpOiB7W2tleTpzdHJpbmddOiBhbnkgfSB7XG4gIHJldHVybiB7XG4gICAgbGV2ZWw6IHR5cGUsXG4gICAgZW50cnk6IHtcbiAgICAgIGRhdGE6IG1lc3NhZ2UsXG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29udmVydEFycmF5VG9NZXNzYWdlc1R5cGUobWVzc2FnZXM6IFN5bnRoZXNpc01lc3NhZ2VbXSk6IE1lc3NhZ2VzIHtcbiAgcmV0dXJuIG1lc3NhZ2VzLnJlZHVjZSgob2JqLCBpdGVtLCBpbmRleCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5vYmosXG4gICAgICBbaW5kZXhdOiBpdGVtLFxuICAgIH07XG4gIH0sIHt9KSBhcyBNZXNzYWdlcztcbn1cblxuZnVuY3Rpb24gY29udmVydE1lc3NhZ2VzVHlwZVRvQXJyYXkobWVzc2FnZXM6IE1lc3NhZ2VzKTogU3ludGhlc2lzTWVzc2FnZVtdIHtcbiAgcmV0dXJuIE9iamVjdC52YWx1ZXMobWVzc2FnZXMpIGFzIFN5bnRoZXNpc01lc3NhZ2VbXTtcbn1cblxuZnVuY3Rpb24gdG9NZXNzYWdlcyhzdGFjazogU3RhY2spOiBhbnkge1xuICBjb25zdCByb290ID0gc3RhY2subm9kZS5yb290O1xuICBpZiAoIVN0YWdlLmlzU3RhZ2Uocm9vdCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuZXhwZWN0ZWQ6IGFsbCBzdGFja3MgbXVzdCBiZSBwYXJ0IG9mIGEgU3RhZ2Ugb3IgYW4gQXBwJyk7XG4gIH1cblxuICAvLyB0byBzdXBwb3J0IGluY3JlbWVudGFsIGFzc2VydGlvbnMgKGkuZS4gXCJleHBlY3Qoc3RhY2spLnRvTm90Q29udGFpblNvbWV0aGluZygpOyBkb1NvbWV0aGluZygpOyBleHBlY3Qoc3RhY2spLnRvQ29udGFpblNvbXRoaW5nKClcIilcbiAgY29uc3QgZm9yY2UgPSB0cnVlO1xuXG4gIGNvbnN0IGFzc2VtYmx5ID0gcm9vdC5zeW50aCh7IGZvcmNlIH0pO1xuXG4gIHJldHVybiBhc3NlbWJseS5nZXRTdGFja0FydGlmYWN0KHN0YWNrLmFydGlmYWN0SWQpLm1lc3NhZ2VzO1xufVxuIl19