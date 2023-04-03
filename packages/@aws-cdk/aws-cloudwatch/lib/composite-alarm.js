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
    generateUniqueId() {
        const name = core_1.Names.uniqueId(this);
        if (name.length > 240) {
            return name.substring(0, 120) + name.substring(name.length - 120);
        }
        return name;
    }
}
_a = JSII_RTTI_SYMBOL_1;
CompositeAlarm[_a] = { fqn: "@aws-cdk/aws-cloudwatch.CompositeAlarm", version: "0.0.0" };
exports.CompositeAlarm = CompositeAlarm;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9zaXRlLWFsYXJtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tcG9zaXRlLWFsYXJtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3RTtBQUV4RSw2Q0FBNkQ7QUFDN0QsaUVBQTJEO0FBeUQzRDs7R0FFRztBQUNILE1BQWEsY0FBZSxTQUFRLHNCQUFTO0lBRTNDOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxrQkFBMEI7UUFDM0YsTUFBTSxLQUFLLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUU5QixPQUFPLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUM7WUFDM0QsT0FBTyxFQUFFLFlBQVk7WUFDckIsUUFBUSxFQUFFLE9BQU87WUFDakIsWUFBWSxFQUFFLGtCQUFrQjtTQUNqQyxDQUFDLENBQUMsQ0FBQztLQUNMO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLHFCQUFxQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLGlCQUF5QjtRQUN6RixNQUFNLE1BQU8sU0FBUSxzQkFBUztZQUE5Qjs7Z0JBQ2tCLGFBQVEsR0FBRyxpQkFBaUIsQ0FBQztnQkFDN0IsY0FBUyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxDQUFDLGlCQUFpQixFQUFFLGdCQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxZQUFhLENBQUM7WUFDdkgsQ0FBQztTQUFBO1FBQ0QsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7SUFrQkQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLENB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QUNiOzs7O0FBckdVLHdDQUFjIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXJuRm9ybWF0LCBMYXp5LCBOYW1lcywgU3RhY2ssIER1cmF0aW9uIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEFsYXJtQmFzZSwgSUFsYXJtLCBJQWxhcm1SdWxlIH0gZnJvbSAnLi9hbGFybS1iYXNlJztcbmltcG9ydCB7IENmbkNvbXBvc2l0ZUFsYXJtIH0gZnJvbSAnLi9jbG91ZHdhdGNoLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgY3JlYXRpbmcgYSBDb21wb3NpdGUgQWxhcm1cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBDb21wb3NpdGVBbGFybVByb3BzIHtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgYWN0aW9ucyBmb3IgdGhpcyBhbGFybSBhcmUgZW5hYmxlZFxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBhY3Rpb25zRW5hYmxlZD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIERlc2NyaXB0aW9uIGZvciB0aGUgYWxhcm1cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBkZXNjcmlwdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGFsYXJtRGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIGFsYXJtXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQXV0b21hdGljYWxseSBnZW5lcmF0ZWQgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IGNvbXBvc2l0ZUFsYXJtTmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogRXhwcmVzc2lvbiB0aGF0IHNwZWNpZmllcyB3aGljaCBvdGhlciBhbGFybXMgYXJlIHRvIGJlIGV2YWx1YXRlZCB0byBkZXRlcm1pbmUgdGhpcyBjb21wb3NpdGUgYWxhcm0ncyBzdGF0ZS5cbiAgICovXG4gIHJlYWRvbmx5IGFsYXJtUnVsZTogSUFsYXJtUnVsZTtcblxuICAvKipcbiAgICogQWN0aW9ucyB3aWxsIGJlIHN1cHByZXNzZWQgaWYgdGhlIHN1cHByZXNzb3IgYWxhcm0gaXMgaW4gdGhlIEFMQVJNIHN0YXRlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGFsYXJtIHdpbGwgbm90IGJlIHN1cHByZXNzZWQuXG4gICAqL1xuICByZWFkb25seSBhY3Rpb25zU3VwcHJlc3Nvcj86IElBbGFybTtcblxuICAvKipcbiAgICogVGhlIG1heGltdW0gZHVyYXRpb24gdGhhdCB0aGUgY29tcG9zaXRlIGFsYXJtIHdhaXRzIGFmdGVyIHN1cHByZXNzb3IgYWxhcm0gZ29lcyBvdXQgb2YgdGhlIEFMQVJNIHN0YXRlLlxuICAgKiBBZnRlciB0aGlzIHRpbWUsIHRoZSBjb21wb3NpdGUgYWxhcm0gcGVyZm9ybXMgaXRzIGFjdGlvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gMSBtaW51dGUgZXh0ZW5zaW9uIHBlcmlvZCB3aWxsIGJlIHNldC5cbiAgICovXG4gIHJlYWRvbmx5IGFjdGlvbnNTdXBwcmVzc29yRXh0ZW5zaW9uUGVyaW9kPzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIGR1cmF0aW9uIHRoYXQgdGhlIGNvbXBvc2l0ZSBhbGFybSB3YWl0cyBmb3IgdGhlIHN1cHByZXNzb3IgYWxhcm0gdG8gZ28gaW50byB0aGUgQUxBUk0gc3RhdGUuXG4gICAqIEFmdGVyIHRoaXMgdGltZSwgdGhlIGNvbXBvc2l0ZSBhbGFybSBwZXJmb3JtcyBpdHMgYWN0aW9ucy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSAxIG1pbnV0ZSB3YWl0IHBlcmlvZCB3aWxsIGJlIHNldC5cbiAgICovXG4gIHJlYWRvbmx5IGFjdGlvbnNTdXBwcmVzc29yV2FpdFBlcmlvZD86IER1cmF0aW9uO1xufVxuXG4vKipcbiAqIEEgQ29tcG9zaXRlIEFsYXJtIGJhc2VkIG9uIEFsYXJtIFJ1bGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb3NpdGVBbGFybSBleHRlbmRzIEFsYXJtQmFzZSB7XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBDbG91ZFdhdGNoIGNvbXBvc2l0ZSBhbGFybSBwcm92aWRlZCBhbiBOYW1lLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjcmVhdGluZyBjb25zdHJ1Y3QgKHVzdWFsbHkgYHRoaXNgKVxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCdzIG5hbWVcbiAgICogQHBhcmFtIGNvbXBvc2l0ZUFsYXJtTmFtZSBDb21wb3NpdGUgQWxhcm0gTmFtZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tQ29tcG9zaXRlQWxhcm1OYW1lKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGNvbXBvc2l0ZUFsYXJtTmFtZTogc3RyaW5nKTogSUFsYXJtIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcblxuICAgIHJldHVybiB0aGlzLmZyb21Db21wb3NpdGVBbGFybUFybihzY29wZSwgaWQsIHN0YWNrLmZvcm1hdEFybih7XG4gICAgICBzZXJ2aWNlOiAnY2xvdWR3YXRjaCcsXG4gICAgICByZXNvdXJjZTogJ2FsYXJtJyxcbiAgICAgIHJlc291cmNlTmFtZTogY29tcG9zaXRlQWxhcm1OYW1lLFxuICAgIH0pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgQ2xvdWRXYXRjaCBjb21wb3NpdGUgYWxhcm0gcHJvdmlkZWQgYW4gQVJOLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjcmVhdGluZyBjb25zdHJ1Y3QgKHVzdWFsbHkgYHRoaXNgKVxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCdzIG5hbWVcbiAgICogQHBhcmFtIGNvbXBvc2l0ZUFsYXJtQXJuIENvbXBvc2l0ZSBBbGFybSBBUk4gKGkuZS4gYXJuOmF3czpjbG91ZHdhdGNoOjxyZWdpb24+OjxhY2NvdW50LWlkPjphbGFybS9Db21wb3NpdGVBbGFybU5hbWUpXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Db21wb3NpdGVBbGFybUFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBjb21wb3NpdGVBbGFybUFybjogc3RyaW5nKTogSUFsYXJtIHtcbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBBbGFybUJhc2UgaW1wbGVtZW50cyBJQWxhcm0ge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGFsYXJtQXJuID0gY29tcG9zaXRlQWxhcm1Bcm47XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYWxhcm1OYW1lID0gU3RhY2sub2Yoc2NvcGUpLnNwbGl0QXJuKGNvbXBvc2l0ZUFsYXJtQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSkucmVzb3VyY2VOYW1lITtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBUk4gb2YgdGhpcyBhbGFybVxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWxhcm1Bcm46IHN0cmluZztcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGlzIGFsYXJtLlxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgYWxhcm1OYW1lOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSBhbGFybVJ1bGU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQ29tcG9zaXRlQWxhcm1Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5jb21wb3NpdGVBbGFybU5hbWUgPz8gTGF6eS5zdHJpbmcoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLmdlbmVyYXRlVW5pcXVlSWQoKSB9KSxcbiAgICB9KTtcblxuICAgIGlmIChwcm9wcy5hbGFybVJ1bGUucmVuZGVyQWxhcm1SdWxlKCkubGVuZ3RoID4gMTAyNDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQWxhcm0gUnVsZSBleHByZXNzaW9uIGNhbm5vdCBiZSBncmVhdGVyIHRoYW4gMTAyNDAgY2hhcmFjdGVycywgcGxlYXNlIHJlZHVjZSB0aGUgY29uZGl0aW9ucyBpbiB0aGUgQWxhcm0gUnVsZScpO1xuICAgIH1cblxuICAgIGxldCBleHRlbnNpb25QZXJpb2QgPSBwcm9wcy5hY3Rpb25zU3VwcHJlc3NvckV4dGVuc2lvblBlcmlvZDtcbiAgICBsZXQgd2FpdFBlcmlvZCA9IHByb3BzLmFjdGlvbnNTdXBwcmVzc29yV2FpdFBlcmlvZDtcbiAgICBpZiAocHJvcHMuYWN0aW9uc1N1cHByZXNzb3IgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKGV4dGVuc2lvblBlcmlvZCAhPT0gdW5kZWZpbmVkIHx8IHdhaXRQZXJpb2QgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FjdGlvbnNTdXBwcmVzc29yIEV4dGVuc2lvbi9XYWl0IFBlcmlvZHMgcmVxdWlyZSBhbiBBY3Rpb25zU3VwcHJlc3NvciB0byBiZSBzZXQuJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4dGVuc2lvblBlcmlvZCA9IGV4dGVuc2lvblBlcmlvZCA/PyBEdXJhdGlvbi5taW51dGVzKDEpO1xuICAgICAgd2FpdFBlcmlvZCA9IHdhaXRQZXJpb2QgPz8gRHVyYXRpb24ubWludXRlcygxKTtcbiAgICB9XG5cbiAgICB0aGlzLmFsYXJtUnVsZSA9IHByb3BzLmFsYXJtUnVsZS5yZW5kZXJBbGFybVJ1bGUoKTtcblxuICAgIGNvbnN0IGFsYXJtID0gbmV3IENmbkNvbXBvc2l0ZUFsYXJtKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGFsYXJtTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBhbGFybVJ1bGU6IHRoaXMuYWxhcm1SdWxlLFxuICAgICAgYWxhcm1EZXNjcmlwdGlvbjogcHJvcHMuYWxhcm1EZXNjcmlwdGlvbixcbiAgICAgIGFjdGlvbnNFbmFibGVkOiBwcm9wcy5hY3Rpb25zRW5hYmxlZCxcbiAgICAgIGFsYXJtQWN0aW9uczogTGF6eS5saXN0KHsgcHJvZHVjZTogKCkgPT4gdGhpcy5hbGFybUFjdGlvbkFybnMgfSksXG4gICAgICBpbnN1ZmZpY2llbnREYXRhQWN0aW9uczogTGF6eS5saXN0KHsgcHJvZHVjZTogKCgpID0+IHRoaXMuaW5zdWZmaWNpZW50RGF0YUFjdGlvbkFybnMpIH0pLFxuICAgICAgb2tBY3Rpb25zOiBMYXp5Lmxpc3QoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLm9rQWN0aW9uQXJucyB9KSxcbiAgICAgIGFjdGlvbnNTdXBwcmVzc29yOiBwcm9wcy5hY3Rpb25zU3VwcHJlc3Nvcj8uYWxhcm1Bcm4sXG4gICAgICBhY3Rpb25zU3VwcHJlc3NvckV4dGVuc2lvblBlcmlvZDogZXh0ZW5zaW9uUGVyaW9kPy50b1NlY29uZHMoKSxcbiAgICAgIGFjdGlvbnNTdXBwcmVzc29yV2FpdFBlcmlvZDogd2FpdFBlcmlvZD8udG9TZWNvbmRzKCksXG4gICAgfSk7XG5cbiAgICB0aGlzLmFsYXJtTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKGFsYXJtLnJlZik7XG4gICAgdGhpcy5hbGFybUFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUoYWxhcm0uYXR0ckFybiwge1xuICAgICAgc2VydmljZTogJ2Nsb3Vkd2F0Y2gnLFxuICAgICAgcmVzb3VyY2U6ICdhbGFybScsXG4gICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICB9KTtcblxuICB9XG5cbiAgcHJpdmF0ZSBnZW5lcmF0ZVVuaXF1ZUlkKCk6IHN0cmluZyB7XG4gICAgY29uc3QgbmFtZSA9IE5hbWVzLnVuaXF1ZUlkKHRoaXMpO1xuICAgIGlmIChuYW1lLmxlbmd0aCA+IDI0MCkge1xuICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyaW5nKDAsIDEyMCkgKyBuYW1lLnN1YnN0cmluZyhuYW1lLmxlbmd0aCAtIDEyMCk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lO1xuICB9XG5cbn1cbiJdfQ==