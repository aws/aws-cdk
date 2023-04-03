"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const codepipeline = require("@aws-cdk/aws-codepipeline");
/**
 * Low-level class for generic CodePipeline Actions.
 * If you're implementing your own IAction,
 * prefer to use the Action class from the codepipeline module.
 */
class Action extends codepipeline.Action {
    constructor(actionProperties) {
        super();
        this.providedActionProperties = actionProperties;
    }
}
exports.Action = Action;
_a = JSII_RTTI_SYMBOL_1;
Action[_a] = { fqn: "@aws-cdk/aws-codepipeline-actions.Action", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMERBQTBEO0FBRTFEOzs7O0dBSUc7QUFDSCxNQUFzQixNQUFPLFNBQVEsWUFBWSxDQUFDLE1BQU07SUFHdEQsWUFBc0IsZ0JBQStDO1FBQ25FLEtBQUssRUFBRSxDQUFDO1FBQ1IsSUFBSSxDQUFDLHdCQUF3QixHQUFHLGdCQUFnQixDQUFDO0tBQ2xEOztBQU5ILHdCQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY29kZXBpcGVsaW5lIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUnO1xuXG4vKipcbiAqIExvdy1sZXZlbCBjbGFzcyBmb3IgZ2VuZXJpYyBDb2RlUGlwZWxpbmUgQWN0aW9ucy5cbiAqIElmIHlvdSdyZSBpbXBsZW1lbnRpbmcgeW91ciBvd24gSUFjdGlvbixcbiAqIHByZWZlciB0byB1c2UgdGhlIEFjdGlvbiBjbGFzcyBmcm9tIHRoZSBjb2RlcGlwZWxpbmUgbW9kdWxlLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWN0aW9uIGV4dGVuZHMgY29kZXBpcGVsaW5lLkFjdGlvbiB7XG4gIHByb3RlY3RlZCByZWFkb25seSBwcm92aWRlZEFjdGlvblByb3BlcnRpZXM6IGNvZGVwaXBlbGluZS5BY3Rpb25Qcm9wZXJ0aWVzO1xuXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihhY3Rpb25Qcm9wZXJ0aWVzOiBjb2RlcGlwZWxpbmUuQWN0aW9uUHJvcGVydGllcykge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5wcm92aWRlZEFjdGlvblByb3BlcnRpZXMgPSBhY3Rpb25Qcm9wZXJ0aWVzO1xuICB9XG59XG4iXX0=