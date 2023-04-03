"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudWatchLogGroup = exports.LogGroupTargetInput = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_events_1 = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const core_1 = require("@aws-cdk/core");
const log_group_resource_policy_1 = require("./log-group-resource-policy");
const util_1 = require("./util");
/**
 * The input to send to the CloudWatch LogGroup target
 */
class LogGroupTargetInput {
    /**
     * Pass a JSON object to the the log group event target
     *
     * May contain strings returned by `EventField.from()` to substitute in parts of the
     * matched event.
     */
    static fromObject(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_LogGroupTargetInputOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromObject);
            }
            throw error;
        }
        return aws_events_1.RuleTargetInput.fromObject({
            timestamp: options?.timestamp ?? aws_events_1.EventField.time,
            message: options?.message ?? aws_events_1.EventField.detailType,
        });
    }
    ;
}
exports.LogGroupTargetInput = LogGroupTargetInput;
_a = JSII_RTTI_SYMBOL_1;
LogGroupTargetInput[_a] = { fqn: "@aws-cdk/aws-events-targets.LogGroupTargetInput", version: "0.0.0" };
/**
 * Use an AWS CloudWatch LogGroup as an event rule target.
 */
class CloudWatchLogGroup {
    constructor(logGroup, props = {}) {
        this.logGroup = logGroup;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_LogGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CloudWatchLogGroup);
            }
            throw error;
        }
    }
    /**
     * Returns a RuleTarget that can be used to log an event into a CloudWatch LogGroup
     */
    bind(_rule, _id) {
        // Use a custom resource to set the log group resource policy since it is not supported by CDK and cfn.
        const resourcePolicyId = `EventsLogGroupPolicy${cdk.Names.nodeUniqueId(_rule.node)}`;
        const logGroupStack = cdk.Stack.of(this.logGroup);
        if (this.props.event && this.props.logEvent) {
            throw new Error('Only one of "event" or "logEvent" can be specified');
        }
        this.target = this.props.event?.bind(_rule);
        if (this.target?.inputPath || this.target?.input) {
            throw new Error('CloudWatchLogGroup targets does not support input or inputPath');
        }
        _rule.node.addValidation({ validate: () => this.validateInputTemplate() });
        if (!this.logGroup.node.tryFindChild(resourcePolicyId)) {
            new log_group_resource_policy_1.LogGroupResourcePolicy(logGroupStack, resourcePolicyId, {
                policyStatements: [new iam.PolicyStatement({
                        effect: iam.Effect.ALLOW,
                        actions: ['logs:PutLogEvents', 'logs:CreateLogStream'],
                        resources: [this.logGroup.logGroupArn],
                        principals: [new iam.ServicePrincipal('events.amazonaws.com')],
                    })],
            });
        }
        return {
            ...util_1.bindBaseTargetConfig(this.props),
            arn: logGroupStack.formatArn({
                service: 'logs',
                resource: 'log-group',
                arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
                resourceName: this.logGroup.logGroupName,
            }),
            input: this.props.event ?? this.props.logEvent,
            targetResource: this.logGroup,
        };
    }
    /**
     * Validate that the target event input template has the correct format.
     * The CloudWatchLogs target only supports a template with the format of:
     *   {"timestamp": <time>, "message": <message>}
     *
     * This is only needed if the deprecated `event` property is used.
     *
     * @see https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutTargets.html
     */
    validateInputTemplate() {
        if (this.target?.inputTemplate) {
            const resolvedTemplate = core_1.Stack.of(this.logGroup).resolve(this.target.inputTemplate);
            if (typeof (resolvedTemplate) === 'string') {
                // need to add the quotes back to the string so that we can parse the json
                // '{"timestamp": <time>}' -> '{"timestamp": "<time>"}'
                const quotedTemplate = resolvedTemplate.replace(new RegExp('(\<.*?\>)', 'g'), '"$1"');
                try {
                    const inputTemplate = JSON.parse(quotedTemplate);
                    const inputTemplateKeys = Object.keys(inputTemplate);
                    if (inputTemplateKeys.length !== 2 ||
                        (!inputTemplateKeys.includes('timestamp') || !inputTemplateKeys.includes('message'))) {
                        return ['CloudWatchLogGroup targets only support input templates in the format {timestamp: <timestamp>, message: <message>}'];
                    }
                }
                catch (e) {
                    return ['Could not parse input template as JSON.\n' +
                            'CloudWatchLogGroup targets only support input templates in the format {timestamp: <timestamp>, message: <message>}', e];
                }
            }
        }
        return [];
    }
}
exports.CloudWatchLogGroup = CloudWatchLogGroup;
_b = JSII_RTTI_SYMBOL_1;
CloudWatchLogGroup[_b] = { fqn: "@aws-cdk/aws-events-targets.CloudWatchLogGroup", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nLWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLG9EQUFvRztBQUNwRyx3Q0FBd0M7QUFFeEMscUNBQXFDO0FBQ3JDLHdDQUFpRDtBQUNqRCwyRUFBcUU7QUFDckUsaUNBQStEO0FBMkIvRDs7R0FFRztBQUNILE1BQXNCLG1CQUFtQjtJQUV2Qzs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBb0M7Ozs7Ozs7Ozs7UUFDM0QsT0FBTyw0QkFBZSxDQUFDLFVBQVUsQ0FBQztZQUNoQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsSUFBSSx1QkFBVSxDQUFDLElBQUk7WUFDaEQsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLElBQUksdUJBQVUsQ0FBQyxVQUFVO1NBQ25ELENBQUMsQ0FBQztLQUNKO0lBQUEsQ0FBQzs7QUFiSixrREFtQkM7OztBQTBCRDs7R0FFRztBQUNILE1BQWEsa0JBQWtCO0lBRTdCLFlBQTZCLFFBQXdCLEVBQW1CLFFBQXVCLEVBQUU7UUFBcEUsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7UUFBbUIsVUFBSyxHQUFMLEtBQUssQ0FBb0I7Ozs7OzsrQ0FGdEYsa0JBQWtCOzs7O0tBRXdFO0lBRXJHOztPQUVHO0lBQ0ksSUFBSSxDQUFDLEtBQW1CLEVBQUUsR0FBWTtRQUMzQyx1R0FBdUc7UUFDdkcsTUFBTSxnQkFBZ0IsR0FBRyx1QkFBdUIsR0FBRyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUM7UUFFckYsTUFBTSxhQUFhLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRWxELElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7WUFDM0MsTUFB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QTJDOzRCQUNqRCxvSEFBb0gsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDNUg7YUFDRjtTQUNGO1FBQ0QsT0FBTyxFQUFFLENBQUM7S0FDWDs7QUE5RUgsZ0RBK0VDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0IHsgUnVsZVRhcmdldElucHV0UHJvcGVydGllcywgUnVsZVRhcmdldElucHV0LCBFdmVudEZpZWxkLCBJUnVsZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBBcm5Gb3JtYXQsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBMb2dHcm91cFJlc291cmNlUG9saWN5IH0gZnJvbSAnLi9sb2ctZ3JvdXAtcmVzb3VyY2UtcG9saWN5JztcbmltcG9ydCB7IFRhcmdldEJhc2VQcm9wcywgYmluZEJhc2VUYXJnZXRDb25maWcgfSBmcm9tICcuL3V0aWwnO1xuXG4vKipcbiAqIE9wdGlvbnMgdXNlZCB3aGVuIGNyZWF0aW5nIGEgdGFyZ2V0IGlucHV0IHRlbXBsYXRlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9nR3JvdXBUYXJnZXRJbnB1dE9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHRpbWVzdGFtcCB0aGF0IHdpbGwgYXBwZWFyIGluIHRoZSBDbG91ZFdhdGNoIExvZ3MgcmVjb3JkXG4gICAqXG4gICAqIEBkZWZhdWx0IEV2ZW50RmllbGQudGltZVxuICAgKi9cbiAgcmVhZG9ubHkgdGltZXN0YW1wPzogYW55O1xuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgcHJvdmlkZWQgaGVyZSB3aWxsIGJlIHVzZWQgaW4gdGhlIExvZyBcIm1lc3NhZ2VcIiBmaWVsZC5cbiAgICpcbiAgICogVGhpcyBmaWVsZCBtdXN0IGJlIGEgc3RyaW5nLiBJZiBhbiBvYmplY3QgaXMgcGFzc2VkIChlLmcuIEpTT04gZGF0YSlcbiAgICogaXQgd2lsbCBub3QgdGhyb3cgYW4gZXJyb3IsIGJ1dCB0aGUgbWVzc2FnZSB0aGF0IG1ha2VzIGl0IHRvXG4gICAqIENsb3VkV2F0Y2ggbG9ncyB3aWxsIGJlIGluY29ycmVjdC4gVGhpcyBpcyBhIGxpa2VseSBzY2VuYXJpbyBpZlxuICAgKiBkb2luZyBzb21ldGhpbmcgbGlrZTogRXZlbnRGaWVsZC5mcm9tUGF0aCgnJC5kZXRhaWwnKSBzaW5jZSBpbiBtb3N0IGNhc2VzXG4gICAqIHRoZSBgZGV0YWlsYCBmaWVsZCBjb250YWlucyBKU09OIGRhdGEuXG4gICAqXG4gICAqIEBkZWZhdWx0IEV2ZW50RmllbGQuZGV0YWlsVHlwZVxuICAgKi9cbiAgcmVhZG9ubHkgbWVzc2FnZT86IGFueTtcbn1cblxuLyoqXG4gKiBUaGUgaW5wdXQgdG8gc2VuZCB0byB0aGUgQ2xvdWRXYXRjaCBMb2dHcm91cCB0YXJnZXRcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIExvZ0dyb3VwVGFyZ2V0SW5wdXQge1xuXG4gIC8qKlxuICAgKiBQYXNzIGEgSlNPTiBvYmplY3QgdG8gdGhlIHRoZSBsb2cgZ3JvdXAgZXZlbnQgdGFyZ2V0XG4gICAqXG4gICAqIE1heSBjb250YWluIHN0cmluZ3MgcmV0dXJuZWQgYnkgYEV2ZW50RmllbGQuZnJvbSgpYCB0byBzdWJzdGl0dXRlIGluIHBhcnRzIG9mIHRoZVxuICAgKiBtYXRjaGVkIGV2ZW50LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tT2JqZWN0KG9wdGlvbnM/OiBMb2dHcm91cFRhcmdldElucHV0T3B0aW9ucyk6IFJ1bGVUYXJnZXRJbnB1dCB7XG4gICAgcmV0dXJuIFJ1bGVUYXJnZXRJbnB1dC5mcm9tT2JqZWN0KHtcbiAgICAgIHRpbWVzdGFtcDogb3B0aW9ucz8udGltZXN0YW1wID8/IEV2ZW50RmllbGQudGltZSxcbiAgICAgIG1lc3NhZ2U6IG9wdGlvbnM/Lm1lc3NhZ2UgPz8gRXZlbnRGaWVsZC5kZXRhaWxUeXBlLFxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGlucHV0IHByb3BlcnRpZXMgZm9yIHRoaXMgaW5wdXQgb2JqZWN0XG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgYmluZChydWxlOiBJUnVsZSk6IFJ1bGVUYXJnZXRJbnB1dFByb3BlcnRpZXM7XG59XG5cbi8qKlxuICogQ3VzdG9taXplIHRoZSBDbG91ZFdhdGNoIExvZ0dyb3VwIEV2ZW50IFRhcmdldFxuICovXG5leHBvcnQgaW50ZXJmYWNlIExvZ0dyb3VwUHJvcHMgZXh0ZW5kcyBUYXJnZXRCYXNlUHJvcHMge1xuICAvKipcbiAgICogVGhlIGV2ZW50IHRvIHNlbmQgdG8gdGhlIENsb3VkV2F0Y2ggTG9nR3JvdXBcbiAgICpcbiAgICogVGhpcyB3aWxsIGJlIHRoZSBldmVudCBsb2dnZWQgaW50byB0aGUgQ2xvdWRXYXRjaCBMb2dHcm91cFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBlbnRpcmUgRXZlbnRCcmlkZ2UgZXZlbnRcbiAgICogQGRlcHJlY2F0ZWQgdXNlIGxvZ0V2ZW50IGluc3RlYWRcbiAgICovXG4gIHJlYWRvbmx5IGV2ZW50PzogZXZlbnRzLlJ1bGVUYXJnZXRJbnB1dDtcblxuICAvKipcbiAgICogVGhlIGV2ZW50IHRvIHNlbmQgdG8gdGhlIENsb3VkV2F0Y2ggTG9nR3JvdXBcbiAgICpcbiAgICogVGhpcyB3aWxsIGJlIHRoZSBldmVudCBsb2dnZWQgaW50byB0aGUgQ2xvdWRXYXRjaCBMb2dHcm91cFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIHRoZSBlbnRpcmUgRXZlbnRCcmlkZ2UgZXZlbnRcbiAgICovXG4gIHJlYWRvbmx5IGxvZ0V2ZW50PzogTG9nR3JvdXBUYXJnZXRJbnB1dDtcbn1cblxuLyoqXG4gKiBVc2UgYW4gQVdTIENsb3VkV2F0Y2ggTG9nR3JvdXAgYXMgYW4gZXZlbnQgcnVsZSB0YXJnZXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBDbG91ZFdhdGNoTG9nR3JvdXAgaW1wbGVtZW50cyBldmVudHMuSVJ1bGVUYXJnZXQge1xuICBwcml2YXRlIHRhcmdldD86IFJ1bGVUYXJnZXRJbnB1dFByb3BlcnRpZXM7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgbG9nR3JvdXA6IGxvZ3MuSUxvZ0dyb3VwLCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBMb2dHcm91cFByb3BzID0ge30pIHt9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBSdWxlVGFyZ2V0IHRoYXQgY2FuIGJlIHVzZWQgdG8gbG9nIGFuIGV2ZW50IGludG8gYSBDbG91ZFdhdGNoIExvZ0dyb3VwXG4gICAqL1xuICBwdWJsaWMgYmluZChfcnVsZTogZXZlbnRzLklSdWxlLCBfaWQ/OiBzdHJpbmcpOiBldmVudHMuUnVsZVRhcmdldENvbmZpZyB7XG4gICAgLy8gVXNlIGEgY3VzdG9tIHJlc291cmNlIHRvIHNldCB0aGUgbG9nIGdyb3VwIHJlc291cmNlIHBvbGljeSBzaW5jZSBpdCBpcyBub3Qgc3VwcG9ydGVkIGJ5IENESyBhbmQgY2ZuLlxuICAgIGNvbnN0IHJlc291cmNlUG9saWN5SWQgPSBgRXZlbnRzTG9nR3JvdXBQb2xpY3kke2Nkay5OYW1lcy5ub2RlVW5pcXVlSWQoX3J1bGUubm9kZSl9YDtcblxuICAgIGNvbnN0IGxvZ0dyb3VwU3RhY2sgPSBjZGsuU3RhY2sub2YodGhpcy5sb2dHcm91cCk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5ldmVudCAmJiB0aGlzLnByb3BzLmxvZ0V2ZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgb25lIG9mIFwiZXZlbnRcIiBvciBcImxvZ0V2ZW50XCIgY2FuIGJlIHNwZWNpZmllZCcpO1xuICAgIH1cblxuICAgIHRoaXMudGFyZ2V0ID0gdGhpcy5wcm9wcy5ldmVudD8uYmluZChfcnVsZSk7XG4gICAgaWYgKHRoaXMudGFyZ2V0Py5pbnB1dFBhdGggfHwgdGhpcy50YXJnZXQ/LmlucHV0KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nsb3VkV2F0Y2hMb2dHcm91cCB0YXJnZXRzIGRvZXMgbm90IHN1cHBvcnQgaW5wdXQgb3IgaW5wdXRQYXRoJyk7XG4gICAgfVxuXG4gICAgX3J1bGUubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMudmFsaWRhdGVJbnB1dFRlbXBsYXRlKCkgfSk7XG5cbiAgICBpZiAoIXRoaXMubG9nR3JvdXAubm9kZS50cnlGaW5kQ2hpbGQocmVzb3VyY2VQb2xpY3lJZCkpIHtcbiAgICAgIG5ldyBMb2dHcm91cFJlc291cmNlUG9saWN5KGxvZ0dyb3VwU3RhY2ssIHJlc291cmNlUG9saWN5SWQsIHtcbiAgICAgICAgcG9saWN5U3RhdGVtZW50czogW25ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgYWN0aW9uczogWydsb2dzOlB1dExvZ0V2ZW50cycsICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbSddLFxuICAgICAgICAgIHJlc291cmNlczogW3RoaXMubG9nR3JvdXAubG9nR3JvdXBBcm5dLFxuICAgICAgICAgIHByaW5jaXBhbHM6IFtuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2V2ZW50cy5hbWF6b25hd3MuY29tJyldLFxuICAgICAgICB9KV0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uYmluZEJhc2VUYXJnZXRDb25maWcodGhpcy5wcm9wcyksXG4gICAgICBhcm46IGxvZ0dyb3VwU3RhY2suZm9ybWF0QXJuKHtcbiAgICAgICAgc2VydmljZTogJ2xvZ3MnLFxuICAgICAgICByZXNvdXJjZTogJ2xvZy1ncm91cCcsXG4gICAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgICAgIHJlc291cmNlTmFtZTogdGhpcy5sb2dHcm91cC5sb2dHcm91cE5hbWUsXG4gICAgICB9KSxcbiAgICAgIGlucHV0OiB0aGlzLnByb3BzLmV2ZW50ID8/IHRoaXMucHJvcHMubG9nRXZlbnQsXG4gICAgICB0YXJnZXRSZXNvdXJjZTogdGhpcy5sb2dHcm91cCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlIHRoYXQgdGhlIHRhcmdldCBldmVudCBpbnB1dCB0ZW1wbGF0ZSBoYXMgdGhlIGNvcnJlY3QgZm9ybWF0LlxuICAgKiBUaGUgQ2xvdWRXYXRjaExvZ3MgdGFyZ2V0IG9ubHkgc3VwcG9ydHMgYSB0ZW1wbGF0ZSB3aXRoIHRoZSBmb3JtYXQgb2Y6XG4gICAqICAge1widGltZXN0YW1wXCI6IDx0aW1lPiwgXCJtZXNzYWdlXCI6IDxtZXNzYWdlPn1cbiAgICpcbiAgICogVGhpcyBpcyBvbmx5IG5lZWRlZCBpZiB0aGUgZGVwcmVjYXRlZCBgZXZlbnRgIHByb3BlcnR5IGlzIHVzZWQuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2V2ZW50YnJpZGdlL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX1B1dFRhcmdldHMuaHRtbFxuICAgKi9cbiAgcHJpdmF0ZSB2YWxpZGF0ZUlucHV0VGVtcGxhdGUoKTogc3RyaW5nW10ge1xuICAgIGlmICh0aGlzLnRhcmdldD8uaW5wdXRUZW1wbGF0ZSkge1xuICAgICAgY29uc3QgcmVzb2x2ZWRUZW1wbGF0ZSA9IFN0YWNrLm9mKHRoaXMubG9nR3JvdXApLnJlc29sdmUodGhpcy50YXJnZXQuaW5wdXRUZW1wbGF0ZSk7XG4gICAgICBpZiAodHlwZW9mKHJlc29sdmVkVGVtcGxhdGUpID09PSAnc3RyaW5nJykge1xuICAgICAgICAvLyBuZWVkIHRvIGFkZCB0aGUgcXVvdGVzIGJhY2sgdG8gdGhlIHN0cmluZyBzbyB0aGF0IHdlIGNhbiBwYXJzZSB0aGUganNvblxuICAgICAgICAvLyAne1widGltZXN0YW1wXCI6IDx0aW1lPn0nIC0+ICd7XCJ0aW1lc3RhbXBcIjogXCI8dGltZT5cIn0nXG4gICAgICAgIGNvbnN0IHF1b3RlZFRlbXBsYXRlID0gcmVzb2x2ZWRUZW1wbGF0ZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyhcXDwuKj9cXD4pJywgJ2cnKSwgJ1wiJDFcIicpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGlucHV0VGVtcGxhdGUgPSBKU09OLnBhcnNlKHF1b3RlZFRlbXBsYXRlKTtcbiAgICAgICAgICBjb25zdCBpbnB1dFRlbXBsYXRlS2V5cyA9IE9iamVjdC5rZXlzKGlucHV0VGVtcGxhdGUpO1xuICAgICAgICAgIGlmIChpbnB1dFRlbXBsYXRlS2V5cy5sZW5ndGggIT09IDIgfHxcbiAgICAgICAgICAgICghaW5wdXRUZW1wbGF0ZUtleXMuaW5jbHVkZXMoJ3RpbWVzdGFtcCcpIHx8ICFpbnB1dFRlbXBsYXRlS2V5cy5pbmNsdWRlcygnbWVzc2FnZScpKSkge1xuICAgICAgICAgICAgcmV0dXJuIFsnQ2xvdWRXYXRjaExvZ0dyb3VwIHRhcmdldHMgb25seSBzdXBwb3J0IGlucHV0IHRlbXBsYXRlcyBpbiB0aGUgZm9ybWF0IHt0aW1lc3RhbXA6IDx0aW1lc3RhbXA+LCBtZXNzYWdlOiA8bWVzc2FnZT59J107XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgcmV0dXJuIFsnQ291bGQgbm90IHBhcnNlIGlucHV0IHRlbXBsYXRlIGFzIEpTT04uXFxuJyArXG4gICAgICAgICAgICAnQ2xvdWRXYXRjaExvZ0dyb3VwIHRhcmdldHMgb25seSBzdXBwb3J0IGlucHV0IHRlbXBsYXRlcyBpbiB0aGUgZm9ybWF0IHt0aW1lc3RhbXA6IDx0aW1lc3RhbXA+LCBtZXNzYWdlOiA8bWVzc2FnZT59JywgZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG4iXX0=