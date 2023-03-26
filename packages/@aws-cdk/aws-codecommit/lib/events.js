"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceEvent = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const events = require("@aws-cdk/aws-events");
/**
 * Fields of CloudWatch Events that change references
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#codebuild_event_type
 */
class ReferenceEvent {
    constructor() {
    }
    /**
     * The type of reference event
     *
     * 'referenceCreated', 'referenceUpdated' or 'referenceDeleted'
     */
    static get eventType() {
        return events.EventField.fromPath('$.detail.event');
    }
    /**
     * Name of the CodeCommit repository
     */
    static get repositoryName() {
        return events.EventField.fromPath('$.detail.repositoryName');
    }
    /**
     * Id of the CodeCommit repository
     */
    static get repositoryId() {
        return events.EventField.fromPath('$.detail.repositoryId');
    }
    /**
     * Type of reference changed
     *
     * 'branch' or 'tag'
     */
    static get referenceType() {
        return events.EventField.fromPath('$.detail.referenceType');
    }
    /**
     * Name of reference changed (branch or tag name)
     */
    static get referenceName() {
        return events.EventField.fromPath('$.detail.referenceName');
    }
    /**
     * Full reference name
     *
     * For example, 'refs/tags/myTag'
     */
    static get referenceFullName() {
        return events.EventField.fromPath('$.detail.referenceFullName');
    }
    /**
     * Commit id this reference now points to
     */
    static get commitId() {
        return events.EventField.fromPath('$.detail.commitId');
    }
}
exports.ReferenceEvent = ReferenceEvent;
_a = JSII_RTTI_SYMBOL_1;
ReferenceEvent[_a] = { fqn: "@aws-cdk/aws-codecommit.ReferenceEvent", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQThDO0FBRTlDOzs7O0dBSUc7QUFDSCxNQUFhLGNBQWM7SUF3RHpCO0tBQ0M7SUF4REQ7Ozs7T0FJRztJQUNJLE1BQU0sS0FBSyxTQUFTO1FBQ3pCLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUNyRDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxLQUFLLGNBQWM7UUFDOUIsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0tBQzlEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLEtBQUssWUFBWTtRQUM1QixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUFDLENBQUM7S0FDNUQ7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxLQUFLLGFBQWE7UUFDN0IsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0tBQzdEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLEtBQUssYUFBYTtRQUM3QixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDN0Q7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxLQUFLLGlCQUFpQjtRQUNqQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLDRCQUE0QixDQUFDLENBQUM7S0FDakU7SUFFRDs7T0FFRztJQUNJLE1BQU0sS0FBSyxRQUFRO1FBQ3hCLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQztLQUN4RDs7QUF0REgsd0NBMERDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuXG4vKipcbiAqIEZpZWxkcyBvZiBDbG91ZFdhdGNoIEV2ZW50cyB0aGF0IGNoYW5nZSByZWZlcmVuY2VzXG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uQ2xvdWRXYXRjaC9sYXRlc3QvZXZlbnRzL0V2ZW50VHlwZXMuaHRtbCNjb2RlYnVpbGRfZXZlbnRfdHlwZVxuICovXG5leHBvcnQgY2xhc3MgUmVmZXJlbmNlRXZlbnQge1xuICAvKipcbiAgICogVGhlIHR5cGUgb2YgcmVmZXJlbmNlIGV2ZW50XG4gICAqXG4gICAqICdyZWZlcmVuY2VDcmVhdGVkJywgJ3JlZmVyZW5jZVVwZGF0ZWQnIG9yICdyZWZlcmVuY2VEZWxldGVkJ1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXQgZXZlbnRUeXBlKCkge1xuICAgIHJldHVybiBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwuZXZlbnQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBDb2RlQ29tbWl0IHJlcG9zaXRvcnlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IHJlcG9zaXRvcnlOYW1lKCkge1xuICAgIHJldHVybiBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwucmVwb3NpdG9yeU5hbWUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZCBvZiB0aGUgQ29kZUNvbW1pdCByZXBvc2l0b3J5XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldCByZXBvc2l0b3J5SWQoKSB7XG4gICAgcmV0dXJuIGV2ZW50cy5FdmVudEZpZWxkLmZyb21QYXRoKCckLmRldGFpbC5yZXBvc2l0b3J5SWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUeXBlIG9mIHJlZmVyZW5jZSBjaGFuZ2VkXG4gICAqXG4gICAqICdicmFuY2gnIG9yICd0YWcnXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldCByZWZlcmVuY2VUeXBlKCkge1xuICAgIHJldHVybiBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwucmVmZXJlbmNlVHlwZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgcmVmZXJlbmNlIGNoYW5nZWQgKGJyYW5jaCBvciB0YWcgbmFtZSlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IHJlZmVyZW5jZU5hbWUoKSB7XG4gICAgcmV0dXJuIGV2ZW50cy5FdmVudEZpZWxkLmZyb21QYXRoKCckLmRldGFpbC5yZWZlcmVuY2VOYW1lJyk7XG4gIH1cblxuICAvKipcbiAgICogRnVsbCByZWZlcmVuY2UgbmFtZVxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgJ3JlZnMvdGFncy9teVRhZydcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IHJlZmVyZW5jZUZ1bGxOYW1lKCkge1xuICAgIHJldHVybiBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwucmVmZXJlbmNlRnVsbE5hbWUnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21taXQgaWQgdGhpcyByZWZlcmVuY2Ugbm93IHBvaW50cyB0b1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXQgY29tbWl0SWQoKSB7XG4gICAgcmV0dXJuIGV2ZW50cy5FdmVudEZpZWxkLmZyb21QYXRoKCckLmRldGFpbC5jb21taXRJZCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgfVxufVxuIl19