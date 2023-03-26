"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeAlarm = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const alarm_base_1 = require("./alarm-base");
const cloudwatch_generated_1 = require("./cloudwatch.generated");
/**
 * A Composite Alarm based on Alarm Rule.
 */
class CompositeAlarm extends alarm_base_1.AlarmBase {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.compositeAlarmName ?? core_1.Lazy.string({ produce: () => this.generateUniqueId() }),
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudwatch_CompositeAlarmProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, CompositeAlarm);
            }
            throw error;
        }
        if (props.alarmRule.renderAlarmRule().length > 10240) {
            throw new Error('Alarm Rule expression cannot be greater than 10240 characters, please reduce the conditions in the Alarm Rule');
        }
        let extensionPeriod = props.actionsSuppressorExtensionPeriod;
        let waitPeriod = props.actionsSuppressorWaitPeriod;
        if (props.actionsSuppressor === undefined) {
            if (extensionPeriod !== undefined || waitPeriod !== undefined) {
                throw new Error('ActionsSuppressor Extension/Wait Periods require an ActionsSuppressor to be set.');
            }
        }
        else {
            extensionPeriod = extensionPeriod ?? core_1.Duration.minutes(1);
            waitPeriod = waitPeriod ?? core_1.Duration.minutes(1);
        }
        this.alarmRule = props.alarmRule.renderAlarmRule();
        const alarm = new cloudwatch_generated_1.CfnCompositeAlarm(this, 'Resource', {
            alarmName: this.physicalName,
            alarmRule: this.alarmRule,
            alarmDescription: props.alarmDescription,
            actionsEnabled: props.actionsEnabled,
            alarmActions: core_1.Lazy.list({ produce: () => this.alarmActionArns }),
            insufficientDataActions: core_1.Lazy.list({ produce: (() => this.insufficientDataActionArns) }),
            okActions: core_1.Lazy.list({ produce: () => this.okActionArns }),
            actionsSuppressor: props.actionsSuppressor?.alarmArn,
            actionsSuppressorExtensionPeriod: extensionPeriod?.toSeconds(),
            actionsSuppressorWaitPeriod: waitPeriod?.toSeconds(),
        });
        this.alarmName = this.getResourceNameAttribute(alarm.ref);
        this.alarmArn = this.getResourceArnAttribute(alarm.attrArn, {
            service: 'cloudwatch',
            resource: 'alarm',
            resourceName: this.physicalName,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
    }
    /**
     * Import an existing CloudWatch composite alarm provided an Name.
     *
     * @param scope The parent creating construct (usually `this`)
     * @param id The construct's name
     * @param compositeAlarmName Composite Alarm Name
     */
    static fromCompositeAlarmName(scope, id, compositeAlarmName) {
        const stack = core_1.Stack.of(scope);
        return this.fromCompositeAlarmArn(scope, id, stack.formatArn({
            service: 'cloudwatch',
            resource: 'alarm',
            resourceName: compositeAlarmName,
        }));
    }
    /**
     * Import an existing CloudWatch composite alarm provided an ARN.
     *
     * @param scope The parent creating construct (usually `this`)
     * @param id The construct's name
     * @param compositeAlarmArn Composite Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm/CompositeAlarmName)
     */
    static fromCompositeAlarmArn(scope, id, compositeAlarmArn) {
        class Import extends alarm_base_1.AlarmBase {
            constructor() {
                super(...arguments);
                this.alarmArn = compositeAlarmArn;
                this.alarmName = core_1.Stack.of(scope).splitArn(compositeAlarmArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
            }
        }
        return new Import(scope, id);
    }
    generateUniqueId() {
        const name = core_1.Names.uniqueId(this);
        if (name.length > 240) {
            return name.substring(0, 120) + name.substring(name.length - 120);
        }
        return name;
    }
}
exports.CompositeAlarm = CompositeAlarm;
_a = JSII_RTTI_SYMBOL_1;
CompositeAlarm[_a] = { fqn: "@aws-cdk/aws-cloudwatch.CompositeAlarm", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9zaXRlLWFsYXJtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tcG9zaXRlLWFsYXJtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3RTtBQUV4RSw2Q0FBNkQ7QUFDN0QsaUVBQTJEO0FBeUQzRDs7R0FFRztBQUNILE1BQWEsY0FBZSxTQUFRLHNCQUFTO0lBa0QzQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQTBCO1FBQ2xFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxrQkFBa0IsSUFBSSxXQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUM7U0FDbEcsQ0FBQyxDQUFDOzs7Ozs7K0NBckRNLGNBQWM7Ozs7UUF1RHZCLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFO1lBQ3BELE1BQU0sSUFBSSxLQUFLLENBQUMsK0dBQStHLENBQUMsQ0FBQztTQUNsSTtRQUVELElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQyxnQ0FBZ0MsQ0FBQztRQUM3RCxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUMsMkJBQTJCLENBQUM7UUFDbkQsSUFBSSxLQUFLLENBQUMsaUJBQWlCLEtBQUssU0FBUyxFQUFFO1lBQ3pDLElBQUksZUFBZSxLQUFLLFNBQVMsSUFBSSxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUM3RCxNQUFNLElBQUksS0FBSyxDQUFDLGtGQUFrRixDQUFDLENBQUM7YUFDckc7U0FDRjthQUFNO1lBQ0wsZUFBZSxHQUFHLGVBQWUsSUFBSSxlQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pELFVBQVUsR0FBRyxVQUFVLElBQUksZUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FB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O0tBQ2I7O0FBckdILHdDQXVHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFybkZvcm1hdCwgTGF6eSwgTmFtZXMsIFN0YWNrLCBEdXJhdGlvbiB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBBbGFybUJhc2UsIElBbGFybSwgSUFsYXJtUnVsZSB9IGZyb20gJy4vYWxhcm0tYmFzZSc7XG5pbXBvcnQgeyBDZm5Db21wb3NpdGVBbGFybSB9IGZyb20gJy4vY2xvdWR3YXRjaC5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGNyZWF0aW5nIGEgQ29tcG9zaXRlIEFsYXJtXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9zaXRlQWxhcm1Qcm9wcyB7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGFjdGlvbnMgZm9yIHRoaXMgYWxhcm0gYXJlIGVuYWJsZWRcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aW9uc0VuYWJsZWQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBEZXNjcmlwdGlvbiBmb3IgdGhlIGFsYXJtXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZGVzY3JpcHRpb24uXG4gICAqL1xuICByZWFkb25seSBhbGFybURlc2NyaXB0aW9uPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBhbGFybVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEF1dG9tYXRpY2FsbHkgZ2VuZXJhdGVkIG5hbWUuXG4gICAqL1xuICByZWFkb25seSBjb21wb3NpdGVBbGFybU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEV4cHJlc3Npb24gdGhhdCBzcGVjaWZpZXMgd2hpY2ggb3RoZXIgYWxhcm1zIGFyZSB0byBiZSBldmFsdWF0ZWQgdG8gZGV0ZXJtaW5lIHRoaXMgY29tcG9zaXRlIGFsYXJtJ3Mgc3RhdGUuXG4gICAqL1xuICByZWFkb25seSBhbGFybVJ1bGU6IElBbGFybVJ1bGU7XG5cbiAgLyoqXG4gICAqIEFjdGlvbnMgd2lsbCBiZSBzdXBwcmVzc2VkIGlmIHRoZSBzdXBwcmVzc29yIGFsYXJtIGlzIGluIHRoZSBBTEFSTSBzdGF0ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhbGFybSB3aWxsIG5vdCBiZSBzdXBwcmVzc2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgYWN0aW9uc1N1cHByZXNzb3I/OiBJQWxhcm07XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIGR1cmF0aW9uIHRoYXQgdGhlIGNvbXBvc2l0ZSBhbGFybSB3YWl0cyBhZnRlciBzdXBwcmVzc29yIGFsYXJtIGdvZXMgb3V0IG9mIHRoZSBBTEFSTSBzdGF0ZS5cbiAgICogQWZ0ZXIgdGhpcyB0aW1lLCB0aGUgY29tcG9zaXRlIGFsYXJtIHBlcmZvcm1zIGl0cyBhY3Rpb25zLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIDEgbWludXRlIGV4dGVuc2lvbiBwZXJpb2Qgd2lsbCBiZSBzZXQuXG4gICAqL1xuICByZWFkb25seSBhY3Rpb25zU3VwcHJlc3NvckV4dGVuc2lvblBlcmlvZD86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSBkdXJhdGlvbiB0aGF0IHRoZSBjb21wb3NpdGUgYWxhcm0gd2FpdHMgZm9yIHRoZSBzdXBwcmVzc29yIGFsYXJtIHRvIGdvIGludG8gdGhlIEFMQVJNIHN0YXRlLlxuICAgKiBBZnRlciB0aGlzIHRpbWUsIHRoZSBjb21wb3NpdGUgYWxhcm0gcGVyZm9ybXMgaXRzIGFjdGlvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gMSBtaW51dGUgd2FpdCBwZXJpb2Qgd2lsbCBiZSBzZXQuXG4gICAqL1xuICByZWFkb25seSBhY3Rpb25zU3VwcHJlc3NvcldhaXRQZXJpb2Q/OiBEdXJhdGlvbjtcbn1cblxuLyoqXG4gKiBBIENvbXBvc2l0ZSBBbGFybSBiYXNlZCBvbiBBbGFybSBSdWxlLlxuICovXG5leHBvcnQgY2xhc3MgQ29tcG9zaXRlQWxhcm0gZXh0ZW5kcyBBbGFybUJhc2Uge1xuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgQ2xvdWRXYXRjaCBjb21wb3NpdGUgYWxhcm0gcHJvdmlkZWQgYW4gTmFtZS5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY3JlYXRpbmcgY29uc3RydWN0ICh1c3VhbGx5IGB0aGlzYClcbiAgICogQHBhcmFtIGlkIFRoZSBjb25zdHJ1Y3QncyBuYW1lXG4gICAqIEBwYXJhbSBjb21wb3NpdGVBbGFybU5hbWUgQ29tcG9zaXRlIEFsYXJtIE5hbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUNvbXBvc2l0ZUFsYXJtTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBjb21wb3NpdGVBbGFybU5hbWU6IHN0cmluZyk6IElBbGFybSB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG5cbiAgICByZXR1cm4gdGhpcy5mcm9tQ29tcG9zaXRlQWxhcm1Bcm4oc2NvcGUsIGlkLCBzdGFjay5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2Nsb3Vkd2F0Y2gnLFxuICAgICAgcmVzb3VyY2U6ICdhbGFybScsXG4gICAgICByZXNvdXJjZU5hbWU6IGNvbXBvc2l0ZUFsYXJtTmFtZSxcbiAgICB9KSk7XG4gIH1cblxuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIENsb3VkV2F0Y2ggY29tcG9zaXRlIGFsYXJtIHByb3ZpZGVkIGFuIEFSTi5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFRoZSBwYXJlbnQgY3JlYXRpbmcgY29uc3RydWN0ICh1c3VhbGx5IGB0aGlzYClcbiAgICogQHBhcmFtIGlkIFRoZSBjb25zdHJ1Y3QncyBuYW1lXG4gICAqIEBwYXJhbSBjb21wb3NpdGVBbGFybUFybiBDb21wb3NpdGUgQWxhcm0gQVJOIChpLmUuIGFybjphd3M6Y2xvdWR3YXRjaDo8cmVnaW9uPjo8YWNjb3VudC1pZD46YWxhcm0vQ29tcG9zaXRlQWxhcm1OYW1lKVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQ29tcG9zaXRlQWxhcm1Bcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgY29tcG9zaXRlQWxhcm1Bcm46IHN0cmluZyk6IElBbGFybSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgQWxhcm1CYXNlIGltcGxlbWVudHMgSUFsYXJtIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhbGFybUFybiA9IGNvbXBvc2l0ZUFsYXJtQXJuO1xuICAgICAgcHVibGljIHJlYWRvbmx5IGFsYXJtTmFtZSA9IFN0YWNrLm9mKHNjb3BlKS5zcGxpdEFybihjb21wb3NpdGVBbGFybUFybiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpLnJlc291cmNlTmFtZSE7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogQVJOIG9mIHRoaXMgYWxhcm1cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFsYXJtQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhpcyBhbGFybS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFsYXJtTmFtZTogc3RyaW5nO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYWxhcm1SdWxlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IENvbXBvc2l0ZUFsYXJtUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuY29tcG9zaXRlQWxhcm1OYW1lID8/IExhenkuc3RyaW5nKHsgcHJvZHVjZTogKCkgPT4gdGhpcy5nZW5lcmF0ZVVuaXF1ZUlkKCkgfSksXG4gICAgfSk7XG5cbiAgICBpZiAocHJvcHMuYWxhcm1SdWxlLnJlbmRlckFsYXJtUnVsZSgpLmxlbmd0aCA+IDEwMjQwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FsYXJtIFJ1bGUgZXhwcmVzc2lvbiBjYW5ub3QgYmUgZ3JlYXRlciB0aGFuIDEwMjQwIGNoYXJhY3RlcnMsIHBsZWFzZSByZWR1Y2UgdGhlIGNvbmRpdGlvbnMgaW4gdGhlIEFsYXJtIFJ1bGUnKTtcbiAgICB9XG5cbiAgICBsZXQgZXh0ZW5zaW9uUGVyaW9kID0gcHJvcHMuYWN0aW9uc1N1cHByZXNzb3JFeHRlbnNpb25QZXJpb2Q7XG4gICAgbGV0IHdhaXRQZXJpb2QgPSBwcm9wcy5hY3Rpb25zU3VwcHJlc3NvcldhaXRQZXJpb2Q7XG4gICAgaWYgKHByb3BzLmFjdGlvbnNTdXBwcmVzc29yID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChleHRlbnNpb25QZXJpb2QgIT09IHVuZGVmaW5lZCB8fCB3YWl0UGVyaW9kICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBY3Rpb25zU3VwcHJlc3NvciBFeHRlbnNpb24vV2FpdCBQZXJpb2RzIHJlcXVpcmUgYW4gQWN0aW9uc1N1cHByZXNzb3IgdG8gYmUgc2V0LicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBleHRlbnNpb25QZXJpb2QgPSBleHRlbnNpb25QZXJpb2QgPz8gRHVyYXRpb24ubWludXRlcygxKTtcbiAgICAgIHdhaXRQZXJpb2QgPSB3YWl0UGVyaW9kID8/IER1cmF0aW9uLm1pbnV0ZXMoMSk7XG4gICAgfVxuXG4gICAgdGhpcy5hbGFybVJ1bGUgPSBwcm9wcy5hbGFybVJ1bGUucmVuZGVyQWxhcm1SdWxlKCk7XG5cbiAgICBjb25zdCBhbGFybSA9IG5ldyBDZm5Db21wb3NpdGVBbGFybSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBhbGFybU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgYWxhcm1SdWxlOiB0aGlzLmFsYXJtUnVsZSxcbiAgICAgIGFsYXJtRGVzY3JpcHRpb246IHByb3BzLmFsYXJtRGVzY3JpcHRpb24sXG4gICAgICBhY3Rpb25zRW5hYmxlZDogcHJvcHMuYWN0aW9uc0VuYWJsZWQsXG4gICAgICBhbGFybUFjdGlvbnM6IExhenkubGlzdCh7IHByb2R1Y2U6ICgpID0+IHRoaXMuYWxhcm1BY3Rpb25Bcm5zIH0pLFxuICAgICAgaW5zdWZmaWNpZW50RGF0YUFjdGlvbnM6IExhenkubGlzdCh7IHByb2R1Y2U6ICgoKSA9PiB0aGlzLmluc3VmZmljaWVudERhdGFBY3Rpb25Bcm5zKSB9KSxcbiAgICAgIG9rQWN0aW9uczogTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5va0FjdGlvbkFybnMgfSksXG4gICAgICBhY3Rpb25zU3VwcHJlc3NvcjogcHJvcHMuYWN0aW9uc1N1cHByZXNzb3I/LmFsYXJtQXJuLFxuICAgICAgYWN0aW9uc1N1cHByZXNzb3JFeHRlbnNpb25QZXJpb2Q6IGV4dGVuc2lvblBlcmlvZD8udG9TZWNvbmRzKCksXG4gICAgICBhY3Rpb25zU3VwcHJlc3NvcldhaXRQZXJpb2Q6IHdhaXRQZXJpb2Q/LnRvU2Vjb25kcygpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5hbGFybU5hbWUgPSB0aGlzLmdldFJlc291cmNlTmFtZUF0dHJpYnV0ZShhbGFybS5yZWYpO1xuICAgIHRoaXMuYWxhcm1Bcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKGFsYXJtLmF0dHJBcm4sIHtcbiAgICAgIHNlcnZpY2U6ICdjbG91ZHdhdGNoJyxcbiAgICAgIHJlc291cmNlOiAnYWxhcm0nLFxuICAgICAgcmVzb3VyY2VOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIGFybkZvcm1hdDogQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUsXG4gICAgfSk7XG5cbiAgfVxuXG4gIHByaXZhdGUgZ2VuZXJhdGVVbmlxdWVJZCgpOiBzdHJpbmcge1xuICAgIGNvbnN0IG5hbWUgPSBOYW1lcy51bmlxdWVJZCh0aGlzKTtcbiAgICBpZiAobmFtZS5sZW5ndGggPiAyNDApIHtcbiAgICAgIHJldHVybiBuYW1lLnN1YnN0cmluZygwLCAxMjApICsgbmFtZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggLSAxMjApO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZTtcbiAgfVxuXG59XG4iXX0=