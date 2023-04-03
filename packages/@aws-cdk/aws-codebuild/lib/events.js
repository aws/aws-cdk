"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhaseChangeEvent = exports.StateChangeEvent = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const events = require("@aws-cdk/aws-events");
/**
 * Event fields for the CodeBuild "state change" event
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html#sample-build-notifications-ref
 */
class StateChangeEvent {
    constructor() {
    }
    /**
     * The triggering build's status
     */
    static get buildStatus() {
        return events.EventField.fromPath('$.detail.build-status');
    }
    /**
     * The triggering build's project name
     */
    static get projectName() {
        return events.EventField.fromPath('$.detail.project-name');
    }
    /**
     * Return the build id
     */
    static get buildId() {
        return events.EventField.fromPath('$.detail.build-id');
    }
    static get currentPhase() {
        return events.EventField.fromPath('$.detail.current-phase');
    }
}
exports.StateChangeEvent = StateChangeEvent;
_a = JSII_RTTI_SYMBOL_1;
StateChangeEvent[_a] = { fqn: "@aws-cdk/aws-codebuild.StateChangeEvent", version: "0.0.0" };
/**
 * Event fields for the CodeBuild "phase change" event
 *
 * @see https://docs.aws.amazon.com/codebuild/latest/userguide/sample-build-notifications.html#sample-build-notifications-ref
 */
class PhaseChangeEvent {
    constructor() {
    }
    /**
     * The triggering build's project name
     */
    static get projectName() {
        return events.EventField.fromPath('$.detail.project-name');
    }
    /**
     * The triggering build's id
     */
    static get buildId() {
        return events.EventField.fromPath('$.detail.build-id');
    }
    /**
     * The phase that was just completed
     */
    static get completedPhase() {
        return events.EventField.fromPath('$.detail.completed-phase');
    }
    /**
     * The status of the completed phase
     */
    static get completedPhaseStatus() {
        return events.EventField.fromPath('$.detail.completed-phase-status');
    }
    /**
     * The duration of the completed phase
     */
    static get completedPhaseDurationSeconds() {
        return events.EventField.fromPath('$.detail.completed-phase-duration-seconds');
    }
    /**
     * Whether the build is complete
     */
    static get buildComplete() {
        return events.EventField.fromPath('$.detail.build-complete');
    }
}
exports.PhaseChangeEvent = PhaseChangeEvent;
_b = JSII_RTTI_SYMBOL_1;
PhaseChangeEvent[_b] = { fqn: "@aws-cdk/aws-codebuild.PhaseChangeEvent", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQThDO0FBRTlDOzs7O0dBSUc7QUFDSCxNQUFhLGdCQUFnQjtJQTBCM0I7S0FDQztJQTFCRDs7T0FFRztJQUNJLE1BQU0sS0FBSyxXQUFXO1FBQzNCLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsdUJBQXVCLENBQUMsQ0FBQztLQUM1RDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxLQUFLLFdBQVc7UUFDM0IsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0tBQzVEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLEtBQUssT0FBTztRQUN2QixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDeEQ7SUFFTSxNQUFNLEtBQUssWUFBWTtRQUM1QixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLENBQUM7S0FDN0Q7O0FBeEJILDRDQTRCQzs7O0FBRUQ7Ozs7R0FJRztBQUNILE1BQWEsZ0JBQWdCO0lBMkMzQjtLQUNDO0lBM0NEOztPQUVHO0lBQ0ksTUFBTSxLQUFLLFdBQVc7UUFDM0IsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0tBQzVEO0lBRUQ7O09BRUc7SUFDSSxNQUFNLEtBQUssT0FBTztRQUN2QixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLG1CQUFtQixDQUFDLENBQUM7S0FDeEQ7SUFFRDs7T0FFRztJQUNJLE1BQU0sS0FBSyxjQUFjO1FBQzlCLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsQ0FBQztLQUMvRDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxLQUFLLG9CQUFvQjtRQUNwQyxPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLGlDQUFpQyxDQUFDLENBQUM7S0FDdEU7SUFFRDs7T0FFRztJQUNJLE1BQU0sS0FBSyw2QkFBNkI7UUFDN0MsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0tBQ2hGO0lBRUQ7O09BRUc7SUFDSSxNQUFNLEtBQUssYUFBYTtRQUM3QixPQUFPLE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLENBQUM7S0FDOUQ7O0FBekNILDRDQTZDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcblxuLyoqXG4gKiBFdmVudCBmaWVsZHMgZm9yIHRoZSBDb2RlQnVpbGQgXCJzdGF0ZSBjaGFuZ2VcIiBldmVudFxuICpcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2NvZGVidWlsZC9sYXRlc3QvdXNlcmd1aWRlL3NhbXBsZS1idWlsZC1ub3RpZmljYXRpb25zLmh0bWwjc2FtcGxlLWJ1aWxkLW5vdGlmaWNhdGlvbnMtcmVmXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0ZUNoYW5nZUV2ZW50IHtcbiAgLyoqXG4gICAqIFRoZSB0cmlnZ2VyaW5nIGJ1aWxkJ3Mgc3RhdHVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldCBidWlsZFN0YXR1cygpIHtcbiAgICByZXR1cm4gZXZlbnRzLkV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmJ1aWxkLXN0YXR1cycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0cmlnZ2VyaW5nIGJ1aWxkJ3MgcHJvamVjdCBuYW1lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldCBwcm9qZWN0TmFtZSgpIHtcbiAgICByZXR1cm4gZXZlbnRzLkV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLnByb2plY3QtbmFtZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgYnVpbGQgaWRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IGJ1aWxkSWQoKSB7XG4gICAgcmV0dXJuIGV2ZW50cy5FdmVudEZpZWxkLmZyb21QYXRoKCckLmRldGFpbC5idWlsZC1pZCcpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXQgY3VycmVudFBoYXNlKCkge1xuICAgIHJldHVybiBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwuY3VycmVudC1waGFzZScpO1xuICB9XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgfVxufVxuXG4vKipcbiAqIEV2ZW50IGZpZWxkcyBmb3IgdGhlIENvZGVCdWlsZCBcInBoYXNlIGNoYW5nZVwiIGV2ZW50XG4gKlxuICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY29kZWJ1aWxkL2xhdGVzdC91c2VyZ3VpZGUvc2FtcGxlLWJ1aWxkLW5vdGlmaWNhdGlvbnMuaHRtbCNzYW1wbGUtYnVpbGQtbm90aWZpY2F0aW9ucy1yZWZcbiAqL1xuZXhwb3J0IGNsYXNzIFBoYXNlQ2hhbmdlRXZlbnQge1xuICAvKipcbiAgICogVGhlIHRyaWdnZXJpbmcgYnVpbGQncyBwcm9qZWN0IG5hbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IHByb2plY3ROYW1lKCkge1xuICAgIHJldHVybiBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwucHJvamVjdC1uYW1lJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRyaWdnZXJpbmcgYnVpbGQncyBpZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXQgYnVpbGRJZCgpIHtcbiAgICByZXR1cm4gZXZlbnRzLkV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmJ1aWxkLWlkJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHBoYXNlIHRoYXQgd2FzIGp1c3QgY29tcGxldGVkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdldCBjb21wbGV0ZWRQaGFzZSgpIHtcbiAgICByZXR1cm4gZXZlbnRzLkV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmNvbXBsZXRlZC1waGFzZScpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBzdGF0dXMgb2YgdGhlIGNvbXBsZXRlZCBwaGFzZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXQgY29tcGxldGVkUGhhc2VTdGF0dXMoKSB7XG4gICAgcmV0dXJuIGV2ZW50cy5FdmVudEZpZWxkLmZyb21QYXRoKCckLmRldGFpbC5jb21wbGV0ZWQtcGhhc2Utc3RhdHVzJyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGR1cmF0aW9uIG9mIHRoZSBjb21wbGV0ZWQgcGhhc2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IGNvbXBsZXRlZFBoYXNlRHVyYXRpb25TZWNvbmRzKCkge1xuICAgIHJldHVybiBldmVudHMuRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwuY29tcGxldGVkLXBoYXNlLWR1cmF0aW9uLXNlY29uZHMnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBidWlsZCBpcyBjb21wbGV0ZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXQgYnVpbGRDb21wbGV0ZSgpIHtcbiAgICByZXR1cm4gZXZlbnRzLkV2ZW50RmllbGQuZnJvbVBhdGgoJyQuZGV0YWlsLmJ1aWxkLWNvbXBsZXRlJyk7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge1xuICB9XG59XG4iXX0=