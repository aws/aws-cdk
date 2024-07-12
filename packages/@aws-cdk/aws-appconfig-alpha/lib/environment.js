"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monitor = exports.MonitorType = exports.Environment = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_appconfig_1 = require("aws-cdk-lib/aws-appconfig");
const iam = require("aws-cdk-lib/aws-iam");
const extension_1 = require("./extension");
const hash_1 = require("./private/hash");
class EnvironmentBase extends aws_cdk_lib_1.Resource {
    on(actionPoint, eventDestination, options) {
        this.extensible.on(actionPoint, eventDestination, options);
    }
    preCreateHostedConfigurationVersion(eventDestination, options) {
        this.extensible.preCreateHostedConfigurationVersion(eventDestination, options);
    }
    preStartDeployment(eventDestination, options) {
        this.extensible.preStartDeployment(eventDestination, options);
    }
    onDeploymentStart(eventDestination, options) {
        this.extensible.onDeploymentStart(eventDestination, options);
    }
    onDeploymentStep(eventDestination, options) {
        this.extensible.onDeploymentStep(eventDestination, options);
    }
    onDeploymentBaking(eventDestination, options) {
        this.extensible.onDeploymentBaking(eventDestination, options);
    }
    onDeploymentComplete(eventDestination, options) {
        this.extensible.onDeploymentComplete(eventDestination, options);
    }
    onDeploymentRolledBack(eventDestination, options) {
        this.extensible.onDeploymentRolledBack(eventDestination, options);
    }
    addExtension(extension) {
        this.extensible.addExtension(extension);
    }
}
/**
 * An AWS AppConfig environment.
 *
 * @resource AWS::AppConfig::Environment
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-environment.html
 */
class Environment extends EnvironmentBase {
    /**
     * Imports an environment into the CDK using its Amazon Resource Name (ARN).
     *
     * @param scope The parent construct
     * @param id The name of the environment construct
     * @param environmentArn The Amazon Resource Name (ARN) of the environment
     */
    static fromEnvironmentArn(scope, id, environmentArn) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Environment#fromEnvironmentArn", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromEnvironmentArn);
            }
            throw error;
        }
        const parsedArn = aws_cdk_lib_1.Stack.of(scope).splitArn(environmentArn, aws_cdk_lib_1.ArnFormat.SLASH_RESOURCE_NAME);
        if (!parsedArn.resourceName) {
            throw new Error(`Missing required /$/{applicationId}/environment//$/{environmentId} from environment ARN: ${parsedArn.resourceName}`);
        }
        const resourceName = parsedArn.resourceName.split('/');
        if (resourceName.length != 3 || !resourceName[0] || !resourceName[2]) {
            throw new Error('Missing required parameters for environment ARN: format should be /$/{applicationId}/environment//$/{environmentId}');
        }
        const applicationId = resourceName[0];
        const environmentId = resourceName[2];
        class Import extends EnvironmentBase {
            constructor() {
                super(...arguments);
                this.applicationId = applicationId;
                this.environmentId = environmentId;
                this.environmentArn = environmentArn;
            }
        }
        return new Import(scope, id, {
            environmentFromArn: environmentArn,
        });
    }
    /**
     * Imports an environment into the CDK from its attributes.
     *
     * @param scope The parent construct
     * @param id The name of the environment construct
     * @param attrs The attributes of the environment
     */
    static fromEnvironmentAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Environment#fromEnvironmentAttributes", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_EnvironmentAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromEnvironmentAttributes);
            }
            throw error;
        }
        const applicationId = attrs.application.applicationId;
        const environmentId = attrs.environmentId;
        const stack = aws_cdk_lib_1.Stack.of(scope);
        const environmentArn = stack.formatArn({
            service: 'appconfig',
            resource: 'application',
            resourceName: `${applicationId}/environment/${environmentId}`,
        });
        class Import extends EnvironmentBase {
            constructor() {
                super(...arguments);
                this.application = attrs.application;
                this.applicationId = attrs.application.applicationId;
                this.name = attrs.name;
                this.environmentId = environmentId;
                this.environmentArn = environmentArn;
                this.description = attrs.description;
                this.monitors = attrs.monitors;
            }
        }
        return new Import(scope, id, {
            environmentFromArn: environmentArn,
        });
    }
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.environmentName,
        });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Environment", "");
            jsiiDeprecationWarnings._aws_cdk_aws_appconfig_alpha_EnvironmentProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Environment);
            }
            throw error;
        }
        this.name = props.environmentName || aws_cdk_lib_1.Names.uniqueResourceName(this, {
            maxLength: 64,
            separator: '-',
        });
        this.application = props.application;
        this.applicationId = this.application.applicationId;
        this.description = props.description;
        this.monitors = props.monitors;
        const resource = new aws_appconfig_1.CfnEnvironment(this, 'Resource', {
            applicationId: this.applicationId,
            name: this.name,
            description: this.description,
            monitors: this.monitors?.map((monitor) => {
                return {
                    alarmArn: monitor.alarmArn,
                    ...(monitor.monitorType === MonitorType.CLOUDWATCH
                        ? { alarmRoleArn: monitor.alarmRoleArn || this.createOrGetAlarmRole().roleArn }
                        : { alarmRoleArn: monitor.alarmRoleArn }),
                };
            }),
        });
        this._cfnEnvironment = resource;
        this.environmentId = this._cfnEnvironment.ref;
        this.environmentArn = this.stack.formatArn({
            service: 'appconfig',
            resource: 'application',
            resourceName: `${this.applicationId}/environment/${this.environmentId}`,
        });
        this.extensible = new extension_1.ExtensibleBase(this, this.environmentArn, this.name);
        this.application.addExistingEnvironment(this);
    }
    createOrGetAlarmRole() {
        // the name is guaranteed to be set in line 243
        const logicalId = `Role${(0, hash_1.getHash)(this.name)}`;
        const existingRole = this.node.tryFindChild(logicalId);
        if (existingRole) {
            return existingRole;
        }
        // this scope is fine for cloudwatch:DescribeAlarms since it is readonly
        // and it is required for composite alarms
        // https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DescribeAlarms.html
        const policy = new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['cloudwatch:DescribeAlarms'],
            resources: ['*'],
        });
        const document = new iam.PolicyDocument({
            statements: [policy],
        });
        const role = new iam.Role(this, logicalId, {
            roleName: aws_cdk_lib_1.PhysicalName.GENERATE_IF_NEEDED,
            assumedBy: new iam.ServicePrincipal('appconfig.amazonaws.com'),
            inlinePolicies: {
                ['AllowAppConfigMonitorAlarmPolicy']: document,
            },
        });
        return role;
    }
}
exports.Environment = Environment;
_a = JSII_RTTI_SYMBOL_1;
Environment[_a] = { fqn: "@aws-cdk/aws-appconfig-alpha.Environment", version: "0.0.0" };
/**
 * The type of Monitor.
 */
var MonitorType;
(function (MonitorType) {
    /**
     * A Monitor from a CloudWatch alarm.
     */
    MonitorType[MonitorType["CLOUDWATCH"] = 0] = "CLOUDWATCH";
    /**
     * A Monitor from a CfnEnvironment.MonitorsProperty construct.
     */
    MonitorType[MonitorType["CFN_MONITORS_PROPERTY"] = 1] = "CFN_MONITORS_PROPERTY";
})(MonitorType || (exports.MonitorType = MonitorType = {}));
/**
 * Defines monitors that will be associated with an AWS AppConfig environment.
 */
class Monitor {
    /**
     * Creates a Monitor from a CloudWatch alarm. If the alarm role is not specified, a role will
     * be generated.
     *
     * @param alarm The Amazon CloudWatch alarm.
     * @param alarmRole The IAM role for AWS AppConfig to view the alarm state.
     */
    static fromCloudWatchAlarm(alarm, alarmRole) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Monitor#fromCloudWatchAlarm", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromCloudWatchAlarm);
            }
            throw error;
        }
        return {
            alarmArn: alarm.alarmArn,
            alarmRoleArn: alarmRole?.roleArn,
            monitorType: MonitorType.CLOUDWATCH,
        };
    }
    /**
     * Creates a Monitor from a CfnEnvironment.MonitorsProperty construct.
     *
     * @param monitorsProperty The monitors property.
     */
    static fromCfnMonitorsProperty(monitorsProperty) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-appconfig-alpha.Monitor#fromCfnMonitorsProperty", "");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromCfnMonitorsProperty);
            }
            throw error;
        }
        if (monitorsProperty.alarmArn === undefined) {
            throw new Error('You must specify an alarmArn property to use "fromCfnMonitorsProperty".');
        }
        return {
            alarmArn: monitorsProperty.alarmArn,
            alarmRoleArn: monitorsProperty.alarmRoleArn,
            monitorType: MonitorType.CFN_MONITORS_PROPERTY,
        };
    }
}
exports.Monitor = Monitor;
_b = JSII_RTTI_SYMBOL_1;
Monitor[_b] = { fqn: "@aws-cdk/aws-appconfig-alpha.Monitor", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJlbnZpcm9ubWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSw2Q0FBeUY7QUFDekYsNkRBQTJEO0FBRTNELDJDQUEyQztBQUczQywyQ0FBd0g7QUFDeEgseUNBQXlDO0FBc0N6QyxNQUFlLGVBQWdCLFNBQVEsc0JBQVE7SUFNdEMsRUFBRSxDQUFDLFdBQXdCLEVBQUUsZ0JBQW1DLEVBQUUsT0FBMEI7UUFDakcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzVEO0lBRU0sbUNBQW1DLENBQUMsZ0JBQW1DLEVBQUUsT0FBMEI7UUFDeEcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxtQ0FBbUMsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUNoRjtJQUVNLGtCQUFrQixDQUFDLGdCQUFtQyxFQUFFLE9BQTBCO1FBQ3ZGLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDL0Q7SUFFTSxpQkFBaUIsQ0FBQyxnQkFBbUMsRUFBRSxPQUEwQjtRQUN0RixJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzlEO0lBRU0sZ0JBQWdCLENBQUMsZ0JBQW1DLEVBQUUsT0FBMEI7UUFDckYsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUM3RDtJQUVNLGtCQUFrQixDQUFDLGdCQUFtQyxFQUFFLE9BQTBCO1FBQ3ZGLElBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDL0Q7SUFFTSxvQkFBb0IsQ0FBQyxnQkFBbUMsRUFBRSxPQUEwQjtRQUN6RixJ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QUssU0FBUyxFQUFFLENBQUM7WUFDNUMsTUFBTSxJQUFJLEtBQUssQ0FBQyx5RUFBeUUsQ0FBQyxDQUFDO1FBQzdGLENBQUM7UUFDRCxPQUFPO1lBQ0wsUUFBUSxFQUFFLGdCQUFnQixDQUFDLFFBQVE7WUFDbkMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLFlBQVk7WUFDM0MsV0FBVyxFQUFFLFdBQVcsQ0FBQyxxQkFBcUI7U0FDL0MsQ0FBQztLQUNIOztBQTlCSCwwQkFtREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSZXNvdXJjZSwgSVJlc291cmNlLCBTdGFjaywgQXJuRm9ybWF0LCBQaHlzaWNhbE5hbWUsIE5hbWVzIH0gZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgQ2ZuRW52aXJvbm1lbnQgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBwY29uZmlnJztcbmltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnYXdzLWNkay1saWIvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBJQXBwbGljYXRpb24gfSBmcm9tICcuL2FwcGxpY2F0aW9uJztcbmltcG9ydCB7IEFjdGlvblBvaW50LCBJRXZlbnREZXN0aW5hdGlvbiwgRXh0ZW5zaW9uT3B0aW9ucywgSUV4dGVuc2lvbiwgSUV4dGVuc2libGUsIEV4dGVuc2libGVCYXNlIH0gZnJvbSAnLi9leHRlbnNpb24nO1xuaW1wb3J0IHsgZ2V0SGFzaCB9IGZyb20gJy4vcHJpdmF0ZS9oYXNoJztcblxuLyoqXG4gKiBBdHRyaWJ1dGVzIG9mIGFuIGV4aXN0aW5nIEFXUyBBcHBDb25maWcgZW52aXJvbm1lbnQgdG8gaW1wb3J0IGl0LlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVudmlyb25tZW50QXR0cmlidXRlcyB7XG4gIC8qKlxuICAgKiBUaGUgYXBwbGljYXRpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBlbnZpcm9ubWVudC5cbiAgICovXG4gIHJlYWRvbmx5IGFwcGxpY2F0aW9uOiBJQXBwbGljYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgZW52aXJvbm1lbnQuXG4gICAqL1xuICByZWFkb25seSBlbnZpcm9ubWVudElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBOb25lLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBtb25pdG9ycyBmb3IgdGhlIGVudmlyb25tZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vbmUuXG4gICAqL1xuICByZWFkb25seSBtb25pdG9ycz86IE1vbml0b3JbXTtcbn1cblxuYWJzdHJhY3QgY2xhc3MgRW52aXJvbm1lbnRCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJRW52aXJvbm1lbnQsIElFeHRlbnNpYmxlIHtcbiAgcHVibGljIGFic3RyYWN0IGFwcGxpY2F0aW9uSWQ6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IGVudmlyb25tZW50SWQ6IHN0cmluZztcbiAgcHVibGljIGFic3RyYWN0IGVudmlyb25tZW50QXJuOiBzdHJpbmc7XG4gIHByb3RlY3RlZCBleHRlbnNpYmxlITogRXh0ZW5zaWJsZUJhc2U7XG5cbiAgcHVibGljIG9uKGFjdGlvblBvaW50OiBBY3Rpb25Qb2ludCwgZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLm9uKGFjdGlvblBvaW50LCBldmVudERlc3RpbmF0aW9uLCBvcHRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBwcmVDcmVhdGVIb3N0ZWRDb25maWd1cmF0aW9uVmVyc2lvbihldmVudERlc3RpbmF0aW9uOiBJRXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucz86IEV4dGVuc2lvbk9wdGlvbnMpIHtcbiAgICB0aGlzLmV4dGVuc2libGUucHJlQ3JlYXRlSG9zdGVkQ29uZmlndXJhdGlvblZlcnNpb24oZXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgcHJlU3RhcnREZXBsb3ltZW50KGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucykge1xuICAgIHRoaXMuZXh0ZW5zaWJsZS5wcmVTdGFydERlcGxveW1lbnQoZXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgb25EZXBsb3ltZW50U3RhcnQoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLm9uRGVwbG95bWVudFN0YXJ0KGV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIG9uRGVwbG95bWVudFN0ZXAoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLm9uRGVwbG95bWVudFN0ZXAoZXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgb25EZXBsb3ltZW50QmFraW5nKGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucykge1xuICAgIHRoaXMuZXh0ZW5zaWJsZS5vbkRlcGxveW1lbnRCYWtpbmcoZXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgb25EZXBsb3ltZW50Q29tcGxldGUoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLm9uRGVwbG95bWVudENvbXBsZXRlKGV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIG9uRGVwbG95bWVudFJvbGxlZEJhY2soZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKSB7XG4gICAgdGhpcy5leHRlbnNpYmxlLm9uRGVwbG95bWVudFJvbGxlZEJhY2soZXZlbnREZXN0aW5hdGlvbiwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgYWRkRXh0ZW5zaW9uKGV4dGVuc2lvbjogSUV4dGVuc2lvbikge1xuICAgIHRoaXMuZXh0ZW5zaWJsZS5hZGRFeHRlbnNpb24oZXh0ZW5zaW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHRoZSBFbnZpcm9ubWVudCBjb25zdHJ1Y3QuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRW52aXJvbm1lbnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBBIG5hbWUgaXMgZ2VuZXJhdGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZW52aXJvbm1lbnROYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVzY3JpcHRpb24gb2YgdGhlIGVudmlyb25tZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIGRlc2NyaXB0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVzY3JpcHRpb24/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBtb25pdG9ycyBmb3IgdGhlIGVudmlyb25tZW50LlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIE5vIG1vbml0b3JzLlxuICAgKi9cbiAgcmVhZG9ubHkgbW9uaXRvcnM/OiBNb25pdG9yW107XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgdGhlIEVudmlyb25tZW50IGNvbnN0cnVjdC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbnZpcm9ubWVudFByb3BzIGV4dGVuZHMgRW52aXJvbm1lbnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBhcHBsaWNhdGlvbiB0byBiZSBhc3NvY2lhdGVkIHdpdGggdGhlIGVudmlyb25tZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgYXBwbGljYXRpb246IElBcHBsaWNhdGlvbjtcbn1cblxuLyoqXG4gKiBBbiBBV1MgQXBwQ29uZmlnIGVudmlyb25tZW50LlxuICpcbiAqIEByZXNvdXJjZSBBV1M6OkFwcENvbmZpZzo6RW52aXJvbm1lbnRcbiAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwcGNvbmZpZy9sYXRlc3QvdXNlcmd1aWRlL2FwcGNvbmZpZy1jcmVhdGluZy1lbnZpcm9ubWVudC5odG1sXG4gKi9cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudCBleHRlbmRzIEVudmlyb25tZW50QmFzZSB7XG4gIC8qKlxuICAgKiBJbXBvcnRzIGFuIGVudmlyb25tZW50IGludG8gdGhlIENESyB1c2luZyBpdHMgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikuXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgcGFyZW50IGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gaWQgVGhlIG5hbWUgb2YgdGhlIGVudmlyb25tZW50IGNvbnN0cnVjdFxuICAgKiBAcGFyYW0gZW52aXJvbm1lbnRBcm4gVGhlIEFtYXpvbiBSZXNvdXJjZSBOYW1lIChBUk4pIG9mIHRoZSBlbnZpcm9ubWVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRW52aXJvbm1lbnRBcm4oc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgZW52aXJvbm1lbnRBcm46IHN0cmluZyk6IElFbnZpcm9ubWVudCB7XG4gICAgY29uc3QgcGFyc2VkQXJuID0gU3RhY2sub2Yoc2NvcGUpLnNwbGl0QXJuKGVudmlyb25tZW50QXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSk7XG4gICAgaWYgKCFwYXJzZWRBcm4ucmVzb3VyY2VOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYE1pc3NpbmcgcmVxdWlyZWQgLyQve2FwcGxpY2F0aW9uSWR9L2Vudmlyb25tZW50Ly8kL3tlbnZpcm9ubWVudElkfSBmcm9tIGVudmlyb25tZW50IEFSTjogJHtwYXJzZWRBcm4ucmVzb3VyY2VOYW1lfWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlTmFtZSA9IHBhcnNlZEFybi5yZXNvdXJjZU5hbWUuc3BsaXQoJy8nKTtcbiAgICBpZiAocmVzb3VyY2VOYW1lLmxlbmd0aCAhPSAzIHx8ICFyZXNvdXJjZU5hbWVbMF0gfHwgIXJlc291cmNlTmFtZVsyXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHJlcXVpcmVkIHBhcmFtZXRlcnMgZm9yIGVudmlyb25tZW50IEFSTjogZm9ybWF0IHNob3VsZCBiZSAvJC97YXBwbGljYXRpb25JZH0vZW52aXJvbm1lbnQvLyQve2Vudmlyb25tZW50SWR9Jyk7XG4gICAgfVxuXG4gICAgY29uc3QgYXBwbGljYXRpb25JZCA9IHJlc291cmNlTmFtZVswXTtcbiAgICBjb25zdCBlbnZpcm9ubWVudElkID0gcmVzb3VyY2VOYW1lWzJdO1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgRW52aXJvbm1lbnRCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhcHBsaWNhdGlvbklkID0gYXBwbGljYXRpb25JZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBlbnZpcm9ubWVudElkID0gZW52aXJvbm1lbnRJZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBlbnZpcm9ubWVudEFybiA9IGVudmlyb25tZW50QXJuO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCwge1xuICAgICAgZW52aXJvbm1lbnRGcm9tQXJuOiBlbnZpcm9ubWVudEFybixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnRzIGFuIGVudmlyb25tZW50IGludG8gdGhlIENESyBmcm9tIGl0cyBhdHRyaWJ1dGVzLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIGlkIFRoZSBuYW1lIG9mIHRoZSBlbnZpcm9ubWVudCBjb25zdHJ1Y3RcbiAgICogQHBhcmFtIGF0dHJzIFRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBlbnZpcm9ubWVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRW52aXJvbm1lbnRBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBFbnZpcm9ubWVudEF0dHJpYnV0ZXMpOiBJRW52aXJvbm1lbnQge1xuICAgIGNvbnN0IGFwcGxpY2F0aW9uSWQgPSBhdHRycy5hcHBsaWNhdGlvbi5hcHBsaWNhdGlvbklkO1xuICAgIGNvbnN0IGVudmlyb25tZW50SWQgPSBhdHRycy5lbnZpcm9ubWVudElkO1xuXG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihzY29wZSk7XG4gICAgY29uc3QgZW52aXJvbm1lbnRBcm4gPSBzdGFjay5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2FwcGNvbmZpZycsXG4gICAgICByZXNvdXJjZTogJ2FwcGxpY2F0aW9uJyxcbiAgICAgIHJlc291cmNlTmFtZTogYCR7YXBwbGljYXRpb25JZH0vZW52aXJvbm1lbnQvJHtlbnZpcm9ubWVudElkfWAsXG4gICAgfSk7XG5cbiAgICBjbGFzcyBJbXBvcnQgZXh0ZW5kcyBFbnZpcm9ubWVudEJhc2Uge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGFwcGxpY2F0aW9uID0gYXR0cnMuYXBwbGljYXRpb247XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgYXBwbGljYXRpb25JZCA9IGF0dHJzLmFwcGxpY2F0aW9uLmFwcGxpY2F0aW9uSWQ7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbmFtZSA9IGF0dHJzLm5hbWU7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZW52aXJvbm1lbnRJZCA9IGVudmlyb25tZW50SWQ7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgZW52aXJvbm1lbnRBcm4gPSBlbnZpcm9ubWVudEFybjtcbiAgICAgIHB1YmxpYyByZWFkb25seSBkZXNjcmlwdGlvbiA9IGF0dHJzLmRlc2NyaXB0aW9uO1xuICAgICAgcHVibGljIHJlYWRvbmx5IG1vbml0b3JzID0gYXR0cnMubW9uaXRvcnM7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkLCB7XG4gICAgICBlbnZpcm9ubWVudEZyb21Bcm46IGVudmlyb25tZW50QXJuLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBhcHBsaWNhdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGVudmlyb25tZW50LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFwcGxpY2F0aW9uPzogSUFwcGxpY2F0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZW52aXJvbm1lbnQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbmFtZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRlc2NyaXB0aW9uIG9mIHRoZSBlbnZpcm9ubWVudC5cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG1vbml0b3JzIGZvciB0aGUgZW52aXJvbm1lbnQuXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbW9uaXRvcnM/OiBNb25pdG9yW107XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgZW52aXJvbm1lbnQuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBlbnZpcm9ubWVudElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gUmVzb3VyY2UgTmFtZSAoQVJOKSBvZiB0aGUgZW52aXJvbm1lbnQuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBlbnZpcm9ubWVudEFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIGVudmlyb25tZW50LlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGFwcGxpY2F0aW9uSWQ6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IF9jZm5FbnZpcm9ubWVudDogQ2ZuRW52aXJvbm1lbnQ7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEVudmlyb25tZW50UHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuZW52aXJvbm1lbnROYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5uYW1lID0gcHJvcHMuZW52aXJvbm1lbnROYW1lIHx8IE5hbWVzLnVuaXF1ZVJlc291cmNlTmFtZSh0aGlzLCB7XG4gICAgICBtYXhMZW5ndGg6IDY0LFxuICAgICAgc2VwYXJhdG9yOiAnLScsXG4gICAgfSk7XG4gICAgdGhpcy5hcHBsaWNhdGlvbiA9IHByb3BzLmFwcGxpY2F0aW9uO1xuICAgIHRoaXMuYXBwbGljYXRpb25JZCA9IHRoaXMuYXBwbGljYXRpb24uYXBwbGljYXRpb25JZDtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gcHJvcHMuZGVzY3JpcHRpb247XG4gICAgdGhpcy5tb25pdG9ycyA9IHByb3BzLm1vbml0b3JzO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuRW52aXJvbm1lbnQodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgYXBwbGljYXRpb25JZDogdGhpcy5hcHBsaWNhdGlvbklkLFxuICAgICAgbmFtZTogdGhpcy5uYW1lLFxuICAgICAgZGVzY3JpcHRpb246IHRoaXMuZGVzY3JpcHRpb24sXG4gICAgICBtb25pdG9yczogdGhpcy5tb25pdG9ycz8ubWFwKChtb25pdG9yKSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgYWxhcm1Bcm46IG1vbml0b3IuYWxhcm1Bcm4sXG4gICAgICAgICAgLi4uKG1vbml0b3IubW9uaXRvclR5cGUgPT09IE1vbml0b3JUeXBlLkNMT1VEV0FUQ0hcbiAgICAgICAgICAgID8geyBhbGFybVJvbGVBcm46IG1vbml0b3IuYWxhcm1Sb2xlQXJuIHx8IHRoaXMuY3JlYXRlT3JHZXRBbGFybVJvbGUoKS5yb2xlQXJuIH1cbiAgICAgICAgICAgIDogeyBhbGFybVJvbGVBcm46IG1vbml0b3IuYWxhcm1Sb2xlQXJuIH0pLFxuICAgICAgICB9O1xuICAgICAgfSksXG4gICAgfSk7XG4gICAgdGhpcy5fY2ZuRW52aXJvbm1lbnQgPSByZXNvdXJjZTtcblxuICAgIHRoaXMuZW52aXJvbm1lbnRJZCA9IHRoaXMuX2NmbkVudmlyb25tZW50LnJlZjtcbiAgICB0aGlzLmVudmlyb25tZW50QXJuID0gdGhpcy5zdGFjay5mb3JtYXRBcm4oe1xuICAgICAgc2VydmljZTogJ2FwcGNvbmZpZycsXG4gICAgICByZXNvdXJjZTogJ2FwcGxpY2F0aW9uJyxcbiAgICAgIHJlc291cmNlTmFtZTogYCR7dGhpcy5hcHBsaWNhdGlvbklkfS9lbnZpcm9ubWVudC8ke3RoaXMuZW52aXJvbm1lbnRJZH1gLFxuICAgIH0pO1xuICAgIHRoaXMuZXh0ZW5zaWJsZSA9IG5ldyBFeHRlbnNpYmxlQmFzZSh0aGlzLCB0aGlzLmVudmlyb25tZW50QXJuLCB0aGlzLm5hbWUpO1xuXG4gICAgdGhpcy5hcHBsaWNhdGlvbi5hZGRFeGlzdGluZ0Vudmlyb25tZW50KHRoaXMpO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVPckdldEFsYXJtUm9sZSgpOiBpYW0uSVJvbGUge1xuICAgIC8vIHRoZSBuYW1lIGlzIGd1YXJhbnRlZWQgdG8gYmUgc2V0IGluIGxpbmUgMjQzXG4gICAgY29uc3QgbG9naWNhbElkID0gYFJvbGUke2dldEhhc2godGhpcy5uYW1lISl9YDtcbiAgICBjb25zdCBleGlzdGluZ1JvbGUgPSB0aGlzLm5vZGUudHJ5RmluZENoaWxkKGxvZ2ljYWxJZCkgYXMgaWFtLklSb2xlO1xuICAgIGlmIChleGlzdGluZ1JvbGUpIHtcbiAgICAgIHJldHVybiBleGlzdGluZ1JvbGU7XG4gICAgfVxuICAgIC8vIHRoaXMgc2NvcGUgaXMgZmluZSBmb3IgY2xvdWR3YXRjaDpEZXNjcmliZUFsYXJtcyBzaW5jZSBpdCBpcyByZWFkb25seVxuICAgIC8vIGFuZCBpdCBpcyByZXF1aXJlZCBmb3IgY29tcG9zaXRlIGFsYXJtc1xuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25DbG91ZFdhdGNoL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX0Rlc2NyaWJlQWxhcm1zLmh0bWxcbiAgICBjb25zdCBwb2xpY3kgPSBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICBhY3Rpb25zOiBbJ2Nsb3Vkd2F0Y2g6RGVzY3JpYmVBbGFybXMnXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSk7XG4gICAgY29uc3QgZG9jdW1lbnQgPSBuZXcgaWFtLlBvbGljeURvY3VtZW50KHtcbiAgICAgIHN0YXRlbWVudHM6IFtwb2xpY3ldLFxuICAgIH0pO1xuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgbG9naWNhbElkLCB7XG4gICAgICByb2xlTmFtZTogUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRCxcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdhcHBjb25maWcuYW1hem9uYXdzLmNvbScpLFxuICAgICAgaW5saW5lUG9saWNpZXM6IHtcbiAgICAgICAgWydBbGxvd0FwcENvbmZpZ01vbml0b3JBbGFybVBvbGljeSddOiBkb2N1bWVudCxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJvbGU7XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgdHlwZSBvZiBNb25pdG9yLlxuICovXG5leHBvcnQgZW51bSBNb25pdG9yVHlwZSB7XG4gIC8qKlxuICAgKiBBIE1vbml0b3IgZnJvbSBhIENsb3VkV2F0Y2ggYWxhcm0uXG4gICAqL1xuICBDTE9VRFdBVENILFxuXG4gIC8qKlxuICAgKiBBIE1vbml0b3IgZnJvbSBhIENmbkVudmlyb25tZW50Lk1vbml0b3JzUHJvcGVydHkgY29uc3RydWN0LlxuICAgKi9cbiAgQ0ZOX01PTklUT1JTX1BST1BFUlRZLFxufVxuXG4vKipcbiAqIERlZmluZXMgbW9uaXRvcnMgdGhhdCB3aWxsIGJlIGFzc29jaWF0ZWQgd2l0aCBhbiBBV1MgQXBwQ29uZmlnIGVudmlyb25tZW50LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTW9uaXRvciB7XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgTW9uaXRvciBmcm9tIGEgQ2xvdWRXYXRjaCBhbGFybS4gSWYgdGhlIGFsYXJtIHJvbGUgaXMgbm90IHNwZWNpZmllZCwgYSByb2xlIHdpbGxcbiAgICogYmUgZ2VuZXJhdGVkLlxuICAgKlxuICAgKiBAcGFyYW0gYWxhcm0gVGhlIEFtYXpvbiBDbG91ZFdhdGNoIGFsYXJtLlxuICAgKiBAcGFyYW0gYWxhcm1Sb2xlIFRoZSBJQU0gcm9sZSBmb3IgQVdTIEFwcENvbmZpZyB0byB2aWV3IHRoZSBhbGFybSBzdGF0ZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUNsb3VkV2F0Y2hBbGFybShhbGFybTogY2xvdWR3YXRjaC5JQWxhcm0sIGFsYXJtUm9sZT86IGlhbS5JUm9sZSk6IE1vbml0b3Ige1xuICAgIHJldHVybiB7XG4gICAgICBhbGFybUFybjogYWxhcm0uYWxhcm1Bcm4sXG4gICAgICBhbGFybVJvbGVBcm46IGFsYXJtUm9sZT8ucm9sZUFybixcbiAgICAgIG1vbml0b3JUeXBlOiBNb25pdG9yVHlwZS5DTE9VRFdBVENILFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIE1vbml0b3IgZnJvbSBhIENmbkVudmlyb25tZW50Lk1vbml0b3JzUHJvcGVydHkgY29uc3RydWN0LlxuICAgKlxuICAgKiBAcGFyYW0gbW9uaXRvcnNQcm9wZXJ0eSBUaGUgbW9uaXRvcnMgcHJvcGVydHkuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21DZm5Nb25pdG9yc1Byb3BlcnR5KG1vbml0b3JzUHJvcGVydHk6IENmbkVudmlyb25tZW50Lk1vbml0b3JzUHJvcGVydHkpOiBNb25pdG9yIHtcbiAgICBpZiAobW9uaXRvcnNQcm9wZXJ0eS5hbGFybUFybiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IHNwZWNpZnkgYW4gYWxhcm1Bcm4gcHJvcGVydHkgdG8gdXNlIFwiZnJvbUNmbk1vbml0b3JzUHJvcGVydHlcIi4nKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGFsYXJtQXJuOiBtb25pdG9yc1Byb3BlcnR5LmFsYXJtQXJuLFxuICAgICAgYWxhcm1Sb2xlQXJuOiBtb25pdG9yc1Byb3BlcnR5LmFsYXJtUm9sZUFybixcbiAgICAgIG1vbml0b3JUeXBlOiBNb25pdG9yVHlwZS5DRk5fTU9OSVRPUlNfUFJPUEVSVFksXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgYWxhcm0gQVJOIGZvciBBV1MgQXBwQ29uZmlnIHRvIG1vbml0b3IuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYWxhcm1Bcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgbW9uaXRvci5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBtb25pdG9yVHlwZTogTW9uaXRvclR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBJQU0gcm9sZSBBUk4gZm9yIEFXUyBBcHBDb25maWcgdG8gdmlldyB0aGUgYWxhcm0gc3RhdGUuXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgYWxhcm1Sb2xlQXJuPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBhIENsb3VkV2F0Y2ggYWxhcm0gaXMgYSBjb21wb3NpdGUgYWxhcm0uXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgaXNDb21wb3NpdGVBbGFybT86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUVudmlyb25tZW50IGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBhcHBsaWNhdGlvbiBhc3NvY2lhdGVkIHdpdGggdGhlIGVudmlyb25tZW50LlxuICAgKi9cbiAgcmVhZG9ubHkgYXBwbGljYXRpb24/OiBJQXBwbGljYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgYXBwbGljYXRpb24gYXNzb2NpYXRlZCB0byB0aGUgZW52aXJvbm1lbnQuXG4gICAqL1xuICByZWFkb25seSBhcHBsaWNhdGlvbklkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBlbnZpcm9ubWVudC5cbiAgICovXG4gIHJlYWRvbmx5IG5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBkZXNjcmlwdGlvbiBvZiB0aGUgZW52aXJvbm1lbnQuXG4gICAqL1xuICByZWFkb25seSBkZXNjcmlwdGlvbj86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG1vbml0b3JzIGZvciB0aGUgZW52aXJvbm1lbnQuXG4gICAqL1xuICByZWFkb25seSBtb25pdG9ycz86IE1vbml0b3JbXTtcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBlbnZpcm9ubWVudC5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZW52aXJvbm1lbnRJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQW1hem9uIFJlc291cmNlIE5hbWUgKEFSTikgb2YgdGhlIGVudmlyb25tZW50LlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBlbnZpcm9ubWVudEFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRzIGFuIGV4dGVuc2lvbiBkZWZpbmVkIGJ5IHRoZSBhY3Rpb24gcG9pbnQgYW5kIGV2ZW50IGRlc3RpbmF0aW9uIGFuZCBhbHNvXG4gICAqIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIHRoZSBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQHBhcmFtIGFjdGlvblBvaW50IFRoZSBhY3Rpb24gcG9pbnQgd2hpY2ggdHJpZ2dlcnMgdGhlIGV2ZW50XG4gICAqIEBwYXJhbSBldmVudERlc3RpbmF0aW9uIFRoZSBldmVudCB0aGF0IG9jY3VycyBkdXJpbmcgdGhlIGV4dGVuc2lvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBvbihhY3Rpb25Qb2ludDogQWN0aW9uUG9pbnQsIGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBQUkVfQ1JFQVRFX0hPU1RFRF9DT05GSUdVUkFUSU9OX1ZFUlNJT04gZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uXG4gICAqIGFuZCBhbHNvIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIHRoZSBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50RGVzdGluYXRpb24gVGhlIGV2ZW50IHRoYXQgb2NjdXJzIGR1cmluZyB0aGUgZXh0ZW5zaW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBleHRlbnNpb25cbiAgICovXG4gIHByZUNyZWF0ZUhvc3RlZENvbmZpZ3VyYXRpb25WZXJzaW9uKGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBQUkVfU1RBUlRfREVQTE9ZTUVOVCBleHRlbnNpb24gd2l0aCB0aGUgcHJvdmlkZWQgZXZlbnQgZGVzdGluYXRpb24gYW5kIGFsc28gY3JlYXRlc1xuICAgKiBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gdGhlIGVudmlyb25tZW50LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgcHJlU3RhcnREZXBsb3ltZW50KGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gT05fREVQTE9ZTUVOVF9TVEFSVCBleHRlbnNpb24gd2l0aCB0aGUgcHJvdmlkZWQgZXZlbnQgZGVzdGluYXRpb24gYW5kIGFsc28gY3JlYXRlc1xuICAgKiBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gdGhlIGVudmlyb25tZW50LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgb25EZXBsb3ltZW50U3RhcnQoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkcyBhbiBPTl9ERVBMT1lNRU5UX1NURVAgZXh0ZW5zaW9uIHdpdGggdGhlIHByb3ZpZGVkIGV2ZW50IGRlc3RpbmF0aW9uIGFuZCBhbHNvXG4gICAqIGNyZWF0ZXMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIHRoZSBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQHBhcmFtIGV2ZW50RGVzdGluYXRpb24gVGhlIGV2ZW50IHRoYXQgb2NjdXJzIGR1cmluZyB0aGUgZXh0ZW5zaW9uXG4gICAqIEBwYXJhbSBvcHRpb25zIE9wdGlvbnMgZm9yIHRoZSBleHRlbnNpb25cbiAgICovXG4gIG9uRGVwbG95bWVudFN0ZXAoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkcyBhbiBPTl9ERVBMT1lNRU5UX0JBS0lORyBleHRlbnNpb24gd2l0aCB0aGUgcHJvdmlkZWQgZXZlbnQgZGVzdGluYXRpb24gYW5kXG4gICAqIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gdGhlIGVudmlyb25tZW50LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgb25EZXBsb3ltZW50QmFraW5nKGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gT05fREVQTE9ZTUVOVF9DT01QTEVURSBleHRlbnNpb24gd2l0aCB0aGUgcHJvdmlkZWQgZXZlbnQgZGVzdGluYXRpb24gYW5kXG4gICAqIGFsc28gY3JlYXRlcyBhbiBleHRlbnNpb24gYXNzb2NpYXRpb24gdG8gdGhlIGVudmlyb25tZW50LlxuICAgKlxuICAgKiBAcGFyYW0gZXZlbnREZXN0aW5hdGlvbiBUaGUgZXZlbnQgdGhhdCBvY2N1cnMgZHVyaW5nIHRoZSBleHRlbnNpb25cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyBmb3IgdGhlIGV4dGVuc2lvblxuICAgKi9cbiAgb25EZXBsb3ltZW50Q29tcGxldGUoZXZlbnREZXN0aW5hdGlvbjogSUV2ZW50RGVzdGluYXRpb24sIG9wdGlvbnM/OiBFeHRlbnNpb25PcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkcyBhbiBPTl9ERVBMT1lNRU5UX1JPTExFRF9CQUNLIGV4dGVuc2lvbiB3aXRoIHRoZSBwcm92aWRlZCBldmVudCBkZXN0aW5hdGlvbiBhbmRcbiAgICogYWxzbyBjcmVhdGVzIGFuIGV4dGVuc2lvbiBhc3NvY2lhdGlvbiB0byB0aGUgZW52aXJvbm1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSBldmVudERlc3RpbmF0aW9uIFRoZSBldmVudCB0aGF0IG9jY3VycyBkdXJpbmcgdGhlIGV4dGVuc2lvblxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIGZvciB0aGUgZXh0ZW5zaW9uXG4gICAqL1xuICBvbkRlcGxveW1lbnRSb2xsZWRCYWNrKGV2ZW50RGVzdGluYXRpb246IElFdmVudERlc3RpbmF0aW9uLCBvcHRpb25zPzogRXh0ZW5zaW9uT3B0aW9ucyk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZHMgYW4gZXh0ZW5zaW9uIGFzc29jaWF0aW9uIHRvIHRoZSBlbnZpcm9ubWVudC5cbiAgICpcbiAgICogQHBhcmFtIGV4dGVuc2lvbiBUaGUgZXh0ZW5zaW9uIHRvIGNyZWF0ZSBhbiBhc3NvY2lhdGlvbiBmb3JcbiAgICovXG4gIGFkZEV4dGVuc2lvbihleHRlbnNpb246IElFeHRlbnNpb24pOiB2b2lkO1xufSJdfQ==