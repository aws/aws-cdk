"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePercentage = exports.deployArtifactBounds = exports.sourceArtifactBounds = void 0;
const core_1 = require("@aws-cdk/core");
/**
 * The ArtifactBounds that make sense for source Actions -
 * they don't have any inputs, and have exactly one output.
 */
function sourceArtifactBounds() {
    return {
        minInputs: 0,
        maxInputs: 0,
        minOutputs: 1,
        maxOutputs: 1,
    };
}
exports.sourceArtifactBounds = sourceArtifactBounds;
/**
 * The ArtifactBounds that make sense for deploy Actions -
 * they have exactly one input, and don't produce any outputs.
 */
function deployArtifactBounds() {
    return {
        minInputs: 1,
        maxInputs: 1,
        minOutputs: 0,
        maxOutputs: 0,
    };
}
exports.deployArtifactBounds = deployArtifactBounds;
function validatePercentage(name, value) {
    if (value === undefined || core_1.Token.isUnresolved(value)) {
        return;
    }
    if (value < 0 || value > 100 || !Number.isInteger(value)) {
        throw new Error(`'${name}': must be a whole number between 0 and 100, got: ${value}`);
    }
}
exports.validatePercentage = validatePercentage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUNBLHdDQUFzQztBQUV0Qzs7O0dBR0c7QUFDSCxTQUFnQixvQkFBb0I7SUFDbEMsT0FBTztRQUNMLFNBQVMsRUFBRSxDQUFDO1FBQ1osU0FBUyxFQUFFLENBQUM7UUFDWixVQUFVLEVBQUUsQ0FBQztRQUNiLFVBQVUsRUFBRSxDQUFDO0tBQ2QsQ0FBQztBQUNKLENBQUM7QUFQRCxvREFPQztBQUVEOzs7R0FHRztBQUNILFNBQWdCLG9CQUFvQjtJQUNsQyxPQUFPO1FBQ0wsU0FBUyxFQUFFLENBQUM7UUFDWixTQUFTLEVBQUUsQ0FBQztRQUNaLFVBQVUsRUFBRSxDQUFDO1FBQ2IsVUFBVSxFQUFFLENBQUM7S0FDZCxDQUFDO0FBQ0osQ0FBQztBQVBELG9EQU9DO0FBRUQsU0FBZ0Isa0JBQWtCLENBQUMsSUFBWSxFQUFFLEtBQWM7SUFDN0QsSUFBSSxLQUFLLEtBQUssU0FBUyxJQUFJLFlBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDcEQsT0FBTztLQUNSO0lBRUQsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3hELE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLHFEQUFxRCxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZGO0FBQ0gsQ0FBQztBQVJELGdEQVFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcblxuLyoqXG4gKiBUaGUgQXJ0aWZhY3RCb3VuZHMgdGhhdCBtYWtlIHNlbnNlIGZvciBzb3VyY2UgQWN0aW9ucyAtXG4gKiB0aGV5IGRvbid0IGhhdmUgYW55IGlucHV0cywgYW5kIGhhdmUgZXhhY3RseSBvbmUgb3V0cHV0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gc291cmNlQXJ0aWZhY3RCb3VuZHMoKTogY29kZXBpcGVsaW5lLkFjdGlvbkFydGlmYWN0Qm91bmRzIHtcbiAgcmV0dXJuIHtcbiAgICBtaW5JbnB1dHM6IDAsXG4gICAgbWF4SW5wdXRzOiAwLFxuICAgIG1pbk91dHB1dHM6IDEsXG4gICAgbWF4T3V0cHV0czogMSxcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGUgQXJ0aWZhY3RCb3VuZHMgdGhhdCBtYWtlIHNlbnNlIGZvciBkZXBsb3kgQWN0aW9ucyAtXG4gKiB0aGV5IGhhdmUgZXhhY3RseSBvbmUgaW5wdXQsIGFuZCBkb24ndCBwcm9kdWNlIGFueSBvdXRwdXRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVwbG95QXJ0aWZhY3RCb3VuZHMoKTogY29kZXBpcGVsaW5lLkFjdGlvbkFydGlmYWN0Qm91bmRzIHtcbiAgcmV0dXJuIHtcbiAgICBtaW5JbnB1dHM6IDEsXG4gICAgbWF4SW5wdXRzOiAxLFxuICAgIG1pbk91dHB1dHM6IDAsXG4gICAgbWF4T3V0cHV0czogMCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZhbGlkYXRlUGVyY2VudGFnZShuYW1lOiBzdHJpbmcsIHZhbHVlPzogbnVtYmVyKSB7XG4gIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IFRva2VuLmlzVW5yZXNvbHZlZCh2YWx1ZSkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAodmFsdWUgPCAwIHx8IHZhbHVlID4gMTAwIHx8ICFOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihgJyR7bmFtZX0nOiBtdXN0IGJlIGEgd2hvbGUgbnVtYmVyIGJldHdlZW4gMCBhbmQgMTAwLCBnb3Q6ICR7dmFsdWV9YCk7XG4gIH1cbn0iXX0=