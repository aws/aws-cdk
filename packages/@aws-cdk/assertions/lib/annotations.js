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
    constructor(messages) {
        this._messages = convertArrayToMessagesType(messages);
    }
    /**
     * Base your assertions on the messages returned by a synthesized CDK `Stack`.
     * @param stack the CDK Stack to run assertions on
     */
    static fromStack(stack) {
        return new Annotations(toMessages(stack));
    }
    /**
     * Assert that an error with the given message exists in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the error. Provide `'*'` to match all errors in the template.
     * @param message the error message as should be expected. This should be a string or Matcher object.
     */
    hasError(constructPath, message) {
        const matchError = messages_1.hasMessage(this._messages, constructPath, constructMessage('error', message));
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
        const matchError = messages_1.hasNoMessage(this._messages, constructPath, constructMessage('error', message));
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
        return convertMessagesTypeToArray(messages_1.findMessage(this._messages, constructPath, constructMessage('error', message)));
    }
    /**
     * Assert that an warning with the given message exists in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the warning. Provide `'*'` to match all warnings in the template.
     * @param message the warning message as should be expected. This should be a string or Matcher object.
     */
    hasWarning(constructPath, message) {
        const matchError = messages_1.hasMessage(this._messages, constructPath, constructMessage('warning', message));
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
        const matchError = messages_1.hasNoMessage(this._messages, constructPath, constructMessage('warning', message));
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
        return convertMessagesTypeToArray(messages_1.findMessage(this._messages, constructPath, constructMessage('warning', message)));
    }
    /**
     * Assert that an info with the given message exists in the synthesized CDK `Stack`.
     *
     * @param constructPath the construct path to the info. Provide `'*'` to match all info in the template.
     * @param message the info message as should be expected. This should be a string or Matcher object.
     */
    hasInfo(constructPath, message) {
        const matchError = messages_1.hasMessage(this._messages, constructPath, constructMessage('info', message));
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
        const matchError = messages_1.hasNoMessage(this._messages, constructPath, constructMessage('info', message));
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
        return convertMessagesTypeToArray(messages_1.findMessage(this._messages, constructPath, constructMessage('info', message)));
    }
}
exports.Annotations = Annotations;
_a = JSII_RTTI_SYMBOL_1;
Annotations[_a] = { fqn: "@aws-cdk/assertions.Annotations", version: "0.0.0" };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ub3RhdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhbm5vdGF0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdDQUE2QztBQUc3QyxpREFBMkU7QUFFM0U7OztHQUdHO0FBQ0gsTUFBYSxXQUFXO0lBV3RCLFlBQW9CLFFBQTRCO1FBQzlDLElBQUksQ0FBQyxTQUFTLEdBQUcsMEJBQTBCLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDdkQ7SUFaRDs7O09BR0c7SUFDSSxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQVk7UUFDbEMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUMzQztJQVFEOzs7OztPQUtHO0lBQ0ksUUFBUSxDQUFDLGFBQXFCLEVBQUUsT0FBWTtRQUNqRCxNQUFNLFVBQVUsR0FBRyxxQkFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2pHLElBQUksVUFBVSxFQUFFO1lBQ2QsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUM3QjtLQUNGO0lBRUQ7Ozs7O09BS0c7SUFDSSxVQUFVLENBQUMsYUFBcUIsRUFBRSxPQUFZO1FBQ25ELE1BQU0sVUFBVSxHQUFHLHVCQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkcsSUFBSSxVQUFVLEVBQUU7WUFDZCxNQUFNLElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzdCO0tBQ0Y7SUFFRDs7Ozs7T0FLRztJQUNJLFNBQVMsQ0FBQyxhQUFxQixFQUFFLE9BQVk7UUFDbEQsT0FBTywwQkFBMEIsQ0FBQyxzQkFBVyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsYUFBYSxFQUFFLGdCQUFn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Q0FBQyxJQUFJLENBQUMsRUFBRTtRQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7S0FDN0U7SUFFRCxxSUFBcUk7SUFDckksTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBRW5CLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRXZDLE9BQU8sUUFBUSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDOUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrLCBTdGFnZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgU3ludGhlc2lzTWVzc2FnZSB9IGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBNZXNzYWdlcyB9IGZyb20gJy4vcHJpdmF0ZS9tZXNzYWdlJztcbmltcG9ydCB7IGZpbmRNZXNzYWdlLCBoYXNNZXNzYWdlLCBoYXNOb01lc3NhZ2UgfSBmcm9tICcuL3ByaXZhdGUvbWVzc2FnZXMnO1xuXG4vKipcbiAqIFN1aXRlIG9mIGFzc2VydGlvbnMgdGhhdCBjYW4gYmUgcnVuIG9uIGEgQ0RLIFN0YWNrLlxuICogRm9jdXNlZCBvbiBhc3NlcnRpbmcgYW5ub3RhdGlvbnMuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbm5vdGF0aW9ucyB7XG4gIC8qKlxuICAgKiBCYXNlIHlvdXIgYXNzZXJ0aW9ucyBvbiB0aGUgbWVzc2FnZXMgcmV0dXJuZWQgYnkgYSBzeW50aGVzaXplZCBDREsgYFN0YWNrYC5cbiAgICogQHBhcmFtIHN0YWNrIHRoZSBDREsgU3RhY2sgdG8gcnVuIGFzc2VydGlvbnMgb25cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0YWNrKHN0YWNrOiBTdGFjayk6IEFubm90YXRpb25zIHtcbiAgICByZXR1cm4gbmV3IEFubm90YXRpb25zKHRvTWVzc2FnZXMoc3RhY2spKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgX21lc3NhZ2VzOiBNZXNzYWdlcztcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKG1lc3NhZ2VzOiBTeW50aGVzaXNNZXNzYWdlW10pIHtcbiAgICB0aGlzLl9tZXNzYWdlcyA9IGNvbnZlcnRBcnJheVRvTWVzc2FnZXNUeXBlKG1lc3NhZ2VzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBc3NlcnQgdGhhdCBhbiBlcnJvciB3aXRoIHRoZSBnaXZlbiBtZXNzYWdlIGV4aXN0cyBpbiB0aGUgc3ludGhlc2l6ZWQgQ0RLIGBTdGFja2AuXG4gICAqXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3RQYXRoIHRoZSBjb25zdHJ1Y3QgcGF0aCB0byB0aGUgZXJyb3IuIFByb3ZpZGUgYCcqJ2AgdG8gbWF0Y2ggYWxsIGVycm9ycyBpbiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBtZXNzYWdlIHRoZSBlcnJvciBtZXNzYWdlIGFzIHNob3VsZCBiZSBleHBlY3RlZC4gVGhpcyBzaG91bGQgYmUgYSBzdHJpbmcgb3IgTWF0Y2hlciBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgaGFzRXJyb3IoY29uc3RydWN0UGF0aDogc3RyaW5nLCBtZXNzYWdlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBtYXRjaEVycm9yID0gaGFzTWVzc2FnZSh0aGlzLl9tZXNzYWdlcywgY29uc3RydWN0UGF0aCwgY29uc3RydWN0TWVzc2FnZSgnZXJyb3InLCBtZXNzYWdlKSk7XG4gICAgaWYgKG1hdGNoRXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtYXRjaEVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgYW4gZXJyb3Igd2l0aCB0aGUgZ2l2ZW4gbWVzc2FnZSBkb2VzIG5vdCBleGlzdCBpbiB0aGUgc3ludGhlc2l6ZWQgQ0RLIGBTdGFja2AuXG4gICAqXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3RQYXRoIHRoZSBjb25zdHJ1Y3QgcGF0aCB0byB0aGUgZXJyb3IuIFByb3ZpZGUgYCcqJ2AgdG8gbWF0Y2ggYWxsIGVycm9ycyBpbiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBtZXNzYWdlIHRoZSBlcnJvciBtZXNzYWdlIGFzIHNob3VsZCBiZSBleHBlY3RlZC4gVGhpcyBzaG91bGQgYmUgYSBzdHJpbmcgb3IgTWF0Y2hlciBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgaGFzTm9FcnJvcihjb25zdHJ1Y3RQYXRoOiBzdHJpbmcsIG1lc3NhZ2U6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IG1hdGNoRXJyb3IgPSBoYXNOb01lc3NhZ2UodGhpcy5fbWVzc2FnZXMsIGNvbnN0cnVjdFBhdGgsIGNvbnN0cnVjdE1lc3NhZ2UoJ2Vycm9yJywgbWVzc2FnZSkpO1xuICAgIGlmIChtYXRjaEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWF0Y2hFcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgc2V0IG9mIG1hdGNoaW5nIGVycm9ycyBvZiBhIGdpdmVuIGNvbnN0cnVjdCBwYXRoIGFuZCBtZXNzYWdlLlxuICAgKlxuICAgKiBAcGFyYW0gY29uc3RydWN0UGF0aCB0aGUgY29uc3RydWN0IHBhdGggdG8gdGhlIGVycm9yLiBQcm92aWRlIGAnKidgIHRvIG1hdGNoIGFsbCBlcnJvcnMgaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgZXJyb3IgbWVzc2FnZSBhcyBzaG91bGQgYmUgZXhwZWN0ZWQuIFRoaXMgc2hvdWxkIGJlIGEgc3RyaW5nIG9yIE1hdGNoZXIgb2JqZWN0LlxuICAgKi9cbiAgcHVibGljIGZpbmRFcnJvcihjb25zdHJ1Y3RQYXRoOiBzdHJpbmcsIG1lc3NhZ2U6IGFueSk6IFN5bnRoZXNpc01lc3NhZ2VbXSB7XG4gICAgcmV0dXJuIGNvbnZlcnRNZXNzYWdlc1R5cGVUb0FycmF5KGZpbmRNZXNzYWdlKHRoaXMuX21lc3NhZ2VzLCBjb25zdHJ1Y3RQYXRoLCBjb25zdHJ1Y3RNZXNzYWdlKCdlcnJvcicsIG1lc3NhZ2UpKSBhcyBNZXNzYWdlcyk7XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgYW4gd2FybmluZyB3aXRoIHRoZSBnaXZlbiBtZXNzYWdlIGV4aXN0cyBpbiB0aGUgc3ludGhlc2l6ZWQgQ0RLIGBTdGFja2AuXG4gICAqXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3RQYXRoIHRoZSBjb25zdHJ1Y3QgcGF0aCB0byB0aGUgd2FybmluZy4gUHJvdmlkZSBgJyonYCB0byBtYXRjaCBhbGwgd2FybmluZ3MgaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgd2FybmluZyBtZXNzYWdlIGFzIHNob3VsZCBiZSBleHBlY3RlZC4gVGhpcyBzaG91bGQgYmUgYSBzdHJpbmcgb3IgTWF0Y2hlciBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgaGFzV2FybmluZyhjb25zdHJ1Y3RQYXRoOiBzdHJpbmcsIG1lc3NhZ2U6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IG1hdGNoRXJyb3IgPSBoYXNNZXNzYWdlKHRoaXMuX21lc3NhZ2VzLCBjb25zdHJ1Y3RQYXRoLCBjb25zdHJ1Y3RNZXNzYWdlKCd3YXJuaW5nJywgbWVzc2FnZSkpO1xuICAgIGlmIChtYXRjaEVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IobWF0Y2hFcnJvcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFzc2VydCB0aGF0IGFuIHdhcm5pbmcgd2l0aCB0aGUgZ2l2ZW4gbWVzc2FnZSBkb2VzIG5vdCBleGlzdCBpbiB0aGUgc3ludGhlc2l6ZWQgQ0RLIGBTdGFja2AuXG4gICAqXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3RQYXRoIHRoZSBjb25zdHJ1Y3QgcGF0aCB0byB0aGUgd2FybmluZy4gUHJvdmlkZSBgJyonYCB0byBtYXRjaCBhbGwgd2FybmluZ3MgaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgd2FybmluZyBtZXNzYWdlIGFzIHNob3VsZCBiZSBleHBlY3RlZC4gVGhpcyBzaG91bGQgYmUgYSBzdHJpbmcgb3IgTWF0Y2hlciBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgaGFzTm9XYXJuaW5nKGNvbnN0cnVjdFBhdGg6IHN0cmluZywgbWVzc2FnZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgbWF0Y2hFcnJvciA9IGhhc05vTWVzc2FnZSh0aGlzLl9tZXNzYWdlcywgY29uc3RydWN0UGF0aCwgY29uc3RydWN0TWVzc2FnZSgnd2FybmluZycsIG1lc3NhZ2UpKTtcbiAgICBpZiAobWF0Y2hFcnJvcikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKG1hdGNoRXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIHNldCBvZiBtYXRjaGluZyB3YXJuaW5nIG9mIGEgZ2l2ZW4gY29uc3RydWN0IHBhdGggYW5kIG1lc3NhZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3RQYXRoIHRoZSBjb25zdHJ1Y3QgcGF0aCB0byB0aGUgd2FybmluZy4gUHJvdmlkZSBgJyonYCB0byBtYXRjaCBhbGwgd2FybmluZ3MgaW4gdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0gbWVzc2FnZSB0aGUgd2FybmluZyBtZXNzYWdlIGFzIHNob3VsZCBiZSBleHBlY3RlZC4gVGhpcyBzaG91bGQgYmUgYSBzdHJpbmcgb3IgTWF0Y2hlciBvYmplY3QuXG4gICAqL1xuICBwdWJsaWMgZmluZFdhcm5pbmcoY29uc3RydWN0UGF0aDogc3RyaW5nLCBtZXNzYWdlOiBhbnkpOiBTeW50aGVzaXNNZXNzYWdlW10ge1xuICAgIHJldHVybiBjb252ZXJ0TWVzc2FnZXNUeXBlVG9BcnJheShmaW5kTWVzc2FnZSh0aGlzLl9tZXNzYWdlcywgY29uc3RydWN0UGF0aCwgY29uc3RydWN0TWVzc2FnZSgnd2FybmluZycsIG1lc3NhZ2UpKSBhcyBNZXNzYWdlcyk7XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgYW4gaW5mbyB3aXRoIHRoZSBnaXZlbiBtZXNzYWdlIGV4aXN0cyBpbiB0aGUgc3ludGhlc2l6ZWQgQ0RLIGBTdGFja2AuXG4gICAqXG4gICAqIEBwYXJhbSBjb25zdHJ1Y3RQYXRoIHRoZSBjb25zdHJ1Y3QgcGF0aCB0byB0aGUgaW5mby4gUHJvdmlkZSBgJyonYCB0byBtYXRjaCBhbGwgaW5mbyBpbiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBtZXNzYWdlIHRoZSBpbmZvIG1lc3NhZ2UgYXMgc2hvdWxkIGJlIGV4cGVjdGVkLiBUaGlzIHNob3VsZCBiZSBhIHN0cmluZyBvciBNYXRjaGVyIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyBoYXNJbmZvKGNvbnN0cnVjdFBhdGg6IHN0cmluZywgbWVzc2FnZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgbWF0Y2hFcnJvciA9IGhhc01lc3NhZ2UodGhpcy5fbWVzc2FnZXMsIGNvbnN0cnVjdFBhdGgsIGNvbnN0cnVjdE1lc3NhZ2UoJ2luZm8nLCBtZXNzYWdlKSk7XG4gICAgaWYgKG1hdGNoRXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtYXRjaEVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXNzZXJ0IHRoYXQgYW4gaW5mbyB3aXRoIHRoZSBnaXZlbiBtZXNzYWdlIGRvZXMgbm90IGV4aXN0IGluIHRoZSBzeW50aGVzaXplZCBDREsgYFN0YWNrYC5cbiAgICpcbiAgICogQHBhcmFtIGNvbnN0cnVjdFBhdGggdGhlIGNvbnN0cnVjdCBwYXRoIHRvIHRoZSBpbmZvLiBQcm92aWRlIGAnKidgIHRvIG1hdGNoIGFsbCBpbmZvIGluIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIG1lc3NhZ2UgdGhlIGluZm8gbWVzc2FnZSBhcyBzaG91bGQgYmUgZXhwZWN0ZWQuIFRoaXMgc2hvdWxkIGJlIGEgc3RyaW5nIG9yIE1hdGNoZXIgb2JqZWN0LlxuICAgKi9cbiAgcHVibGljIGhhc05vSW5mbyhjb25zdHJ1Y3RQYXRoOiBzdHJpbmcsIG1lc3NhZ2U6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IG1hdGNoRXJyb3IgPSBoYXNOb01lc3NhZ2UodGhpcy5fbWVzc2FnZXMsIGNvbnN0cnVjdFBhdGgsIGNvbnN0cnVjdE1lc3NhZ2UoJ2luZm8nLCBtZXNzYWdlKSk7XG4gICAgaWYgKG1hdGNoRXJyb3IpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihtYXRjaEVycm9yKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBzZXQgb2YgbWF0Y2hpbmcgaW5mb3Mgb2YgYSBnaXZlbiBjb25zdHJ1Y3QgcGF0aCBhbmQgbWVzc2FnZS5cbiAgICpcbiAgICogQHBhcmFtIGNvbnN0cnVjdFBhdGggdGhlIGNvbnN0cnVjdCBwYXRoIHRvIHRoZSBpbmZvLiBQcm92aWRlIGAnKidgIHRvIG1hdGNoIGFsbCBpbmZvcyBpbiB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSBtZXNzYWdlIHRoZSBpbmZvIG1lc3NhZ2UgYXMgc2hvdWxkIGJlIGV4cGVjdGVkLiBUaGlzIHNob3VsZCBiZSBhIHN0cmluZyBvciBNYXRjaGVyIG9iamVjdC5cbiAgICovXG4gIHB1YmxpYyBmaW5kSW5mbyhjb25zdHJ1Y3RQYXRoOiBzdHJpbmcsIG1lc3NhZ2U6IGFueSk6IFN5bnRoZXNpc01lc3NhZ2VbXSB7XG4gICAgcmV0dXJuIGNvbnZlcnRNZXNzYWdlc1R5cGVUb0FycmF5KGZpbmRNZXNzYWdlKHRoaXMuX21lc3NhZ2VzLCBjb25zdHJ1Y3RQYXRoLCBjb25zdHJ1Y3RNZXNzYWdlKCdpbmZvJywgbWVzc2FnZSkpIGFzIE1lc3NhZ2VzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb25zdHJ1Y3RNZXNzYWdlKHR5cGU6ICdpbmZvJyB8ICd3YXJuaW5nJyB8ICdlcnJvcicsIG1lc3NhZ2U6IGFueSk6IHtba2V5OnN0cmluZ106IGFueSB9IHtcbiAgcmV0dXJuIHtcbiAgICBsZXZlbDogdHlwZSxcbiAgICBlbnRyeToge1xuICAgICAgZGF0YTogbWVzc2FnZSxcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0QXJyYXlUb01lc3NhZ2VzVHlwZShtZXNzYWdlczogU3ludGhlc2lzTWVzc2FnZVtdKTogTWVzc2FnZXMge1xuICByZXR1cm4gbWVzc2FnZXMucmVkdWNlKChvYmosIGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm9iaixcbiAgICAgIFtpbmRleF06IGl0ZW0sXG4gICAgfTtcbiAgfSwge30pIGFzIE1lc3NhZ2VzO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0TWVzc2FnZXNUeXBlVG9BcnJheShtZXNzYWdlczogTWVzc2FnZXMpOiBTeW50aGVzaXNNZXNzYWdlW10ge1xuICByZXR1cm4gT2JqZWN0LnZhbHVlcyhtZXNzYWdlcykgYXMgU3ludGhlc2lzTWVzc2FnZVtdO1xufVxuXG5mdW5jdGlvbiB0b01lc3NhZ2VzKHN0YWNrOiBTdGFjayk6IGFueSB7XG4gIGNvbnN0IHJvb3QgPSBzdGFjay5ub2RlLnJvb3Q7XG4gIGlmICghU3RhZ2UuaXNTdGFnZShyb290KSkge1xuICAgIHRocm93IG5ldyBFcnJvcigndW5leHBlY3RlZDogYWxsIHN0YWNrcyBtdXN0IGJlIHBhcnQgb2YgYSBTdGFnZSBvciBhbiBBcHAnKTtcbiAgfVxuXG4gIC8vIHRvIHN1cHBvcnQgaW5jcmVtZW50YWwgYXNzZXJ0aW9ucyAoaS5lLiBcImV4cGVjdChzdGFjaykudG9Ob3RDb250YWluU29tZXRoaW5nKCk7IGRvU29tZXRoaW5nKCk7IGV4cGVjdChzdGFjaykudG9Db250YWluU29tdGhpbmcoKVwiKVxuICBjb25zdCBmb3JjZSA9IHRydWU7XG5cbiAgY29uc3QgYXNzZW1ibHkgPSByb290LnN5bnRoKHsgZm9yY2UgfSk7XG5cbiAgcmV0dXJuIGFzc2VtYmx5LmdldFN0YWNrQXJ0aWZhY3Qoc3RhY2suYXJ0aWZhY3RJZCkubWVzc2FnZXM7XG59XG4iXX0=