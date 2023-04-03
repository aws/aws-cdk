"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceNamespace = exports.ScalableTarget = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const applicationautoscaling_generated_1 = require("./applicationautoscaling.generated");
const step_scaling_policy_1 = require("./step-scaling-policy");
const target_tracking_scaling_policy_1 = require("./target-tracking-scaling-policy");
/**
 * Define a scalable target
 */
class ScalableTarget extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        this.actions = new Array();
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_applicationautoscaling_ScalableTargetProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ScalableTarget);
            }
            throw error;
        }
        core_1.withResolved(props.maxCapacity, max => {
            if (max < 0) {
                throw new RangeError(`maxCapacity cannot be negative, got: ${props.maxCapacity}`);
            }
        });
        core_1.withResolved(props.minCapacity, min => {
            if (min < 0) {
                throw new RangeError(`minCapacity cannot be negative, got: ${props.minCapacity}`);
            }
        });
        core_1.withResolved(props.minCapacity, props.maxCapacity, (min, max) => {
            if (max < min) {
                throw new RangeError(`minCapacity (${props.minCapacity}) should be lower than maxCapacity (${props.maxCapacity})`);
            }
        });
        this.role = props.role || new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal('application-autoscaling.amazonaws.com'),
        });
        const resource = new applicationautoscaling_generated_1.CfnScalableTarget(this, 'Resource', {
            maxCapacity: props.maxCapacity,
            minCapacity: props.minCapacity,
            resourceId: props.resourceId,
            roleArn: this.role.roleArn,
            scalableDimension: props.scalableDimension,
            scheduledActions: core_1.Lazy.any({ produce: () => this.actions }, { omitEmptyArray: true }),
            serviceNamespace: props.serviceNamespace,
        });
        this.scalableTargetId = resource.ref;
    }
    static fromScalableTargetId(scope, id, scalableTargetId) {
        class Import extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.scalableTargetId = scalableTargetId;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Add a policy statement to the role's policy
     */
    addToRolePolicy(statement) {
        this.role.addToPrincipalPolicy(statement);
    }
    /**
     * Scale out or in based on time
     */
    scaleOnSchedule(id, action) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_applicationautoscaling_ScalingSchedule(action);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.scaleOnSchedule);
            }
            throw error;
        }
        if (action.minCapacity === undefined && action.maxCapacity === undefined) {
            throw new Error(`You must supply at least one of minCapacity or maxCapacity, got ${JSON.stringify(action)}`);
        }
        // add a warning on synth when minute is not defined in a cron schedule
        action.schedule._bind(this);
        this.actions.push({
            scheduledActionName: id,
            schedule: action.schedule.expressionString,
            startTime: action.startTime,
            endTime: action.endTime,
            scalableTargetAction: {
                maxCapacity: action.maxCapacity,
                minCapacity: action.minCapacity,
            },
        });
    }
    /**
     * Scale out or in, in response to a metric
     */
    scaleOnMetric(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_applicationautoscaling_BasicStepScalingPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.scaleOnMetric);
            }
            throw error;
        }
        return new step_scaling_policy_1.StepScalingPolicy(this, id, { ...props, scalingTarget: this });
    }
    /**
     * Scale out or in in order to keep a metric around a target value
     */
    scaleToTrackMetric(id, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_applicationautoscaling_BasicTargetTrackingScalingPolicyProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.scaleToTrackMetric);
            }
            throw error;
        }
        return new target_tracking_scaling_policy_1.TargetTrackingScalingPolicy(this, id, { ...props, scalingTarget: this });
    }
}
exports.ScalableTarget = ScalableTarget;
_a = JSII_RTTI_SYMBOL_1;
ScalableTarget[_a] = { fqn: "@aws-cdk/aws-applicationautoscaling.ScalableTarget", version: "0.0.0" };
/**
 * The service that supports Application AutoScaling
 */
var ServiceNamespace;
(function (ServiceNamespace) {
    /**
     * Elastic Container Service
     */
    ServiceNamespace["ECS"] = "ecs";
    /**
     * Elastic Map Reduce
     */
    ServiceNamespace["ELASTIC_MAP_REDUCE"] = "elasticmapreduce";
    /**
     * Elastic Compute Cloud
     */
    ServiceNamespace["EC2"] = "ec2";
    /**
     * App Stream
     */
    ServiceNamespace["APPSTREAM"] = "appstream";
    /**
     * Dynamo DB
     */
    ServiceNamespace["DYNAMODB"] = "dynamodb";
    /**
     * Relational Database Service
     */
    ServiceNamespace["RDS"] = "rds";
    /**
     * SageMaker
     */
    ServiceNamespace["SAGEMAKER"] = "sagemaker";
    /**
     * Custom Resource
     */
    ServiceNamespace["CUSTOM_RESOURCE"] = "custom-resource";
    /**
     * Lambda
     */
    ServiceNamespace["LAMBDA"] = "lambda";
    /**
     * Comprehend
     */
    ServiceNamespace["COMPREHEND"] = "comprehend";
    /**
     * Kafka
     */
    ServiceNamespace["KAFKA"] = "kafka";
    /**
     * ElastiCache
     */
    ServiceNamespace["ELASTICACHE"] = "elasticache";
    /**
     * Neptune
     */
    ServiceNamespace["NEPTUNE"] = "neptune";
})(ServiceNamespace = exports.ServiceNamespace || (exports.ServiceNamespace = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGFibGUtdGFyZ2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2NhbGFibGUtdGFyZ2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHdDQUF3QztBQUN4Qyx3Q0FBd0U7QUFFeEUseUZBQXVFO0FBRXZFLCtEQUF1RjtBQUN2RixxRkFBc0g7QUFnRXRIOztHQUVHO0FBQ0gsTUFBYSxjQUFlLFNBQVEsZUFBUTtJQXlCMUMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSEYsWUFBTyxHQUFHLElBQUksS0FBSyxFQUE2QyxDQUFDOzs7Ozs7K0NBdkJ2RSxjQUFjOzs7O1FBNEJ2QixtQkFBWSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO2dCQUNYLE1BQU0sSUFBSSxVQUFVLENBQUMsd0NBQXdDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2FBQ25GO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxtQkFBWSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDcEMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO2dCQUNYLE1BQU0sSUFBSSxVQUFVLENBQUMsd0NBQXdDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO2FBQ25GO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxtQkFBWSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUM5RCxJQUFJLEdBQUcsR0FBRyxHQUFHLEVBQUU7Z0JBQ2IsTUFBTSxJQUFJLFVBQVUsQ0FBQyxnQkFBZ0IsS0FBSyxDQUFDLFdBQVcsdUNBQXVDLEtBQUssQ0FBQyxXQUFXLEdBQUcsQ0FBQyxD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REQ7O0dBRUc7QUFDSCxJQUFZLGdCQWlFWDtBQWpFRCxXQUFZLGdCQUFnQjtJQUMxQjs7T0FFRztJQUNILCtCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILDJEQUF1QyxDQUFBO0lBRXZDOztPQUVHO0lBQ0gsK0JBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsMkNBQXVCLENBQUE7SUFFdkI7O09BRUc7SUFDSCx5Q0FBcUIsQ0FBQTtJQUVyQjs7T0FFRztJQUNILCtCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILDJDQUF1QixDQUFBO0lBRXZCOztPQUVHO0lBQ0gsdURBQW1DLENBQUE7SUFFbkM7O09BRUc7SUFDSCxxQ0FBaUIsQ0FBQTtJQUVqQjs7T0FFRztJQUNILDZDQUF5QixDQUFBO0lBRXpCOztPQUVHO0lBQ0gsbUNBQWUsQ0FBQTtJQUVmOztPQUVHO0lBQ0gsK0NBQTJCLENBQUE7SUFFM0I7O09BRUc7SUFDSCx1Q0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBakVXLGdCQUFnQixHQUFoQix3QkFBZ0IsS0FBaEIsd0JBQWdCLFFBaUUzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCB7IElSZXNvdXJjZSwgTGF6eSwgUmVzb3VyY2UsIHdpdGhSZXNvbHZlZCB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5TY2FsYWJsZVRhcmdldCB9IGZyb20gJy4vYXBwbGljYXRpb25hdXRvc2NhbGluZy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgU2NoZWR1bGUgfSBmcm9tICcuL3NjaGVkdWxlJztcbmltcG9ydCB7IEJhc2ljU3RlcFNjYWxpbmdQb2xpY3lQcm9wcywgU3RlcFNjYWxpbmdQb2xpY3kgfSBmcm9tICcuL3N0ZXAtc2NhbGluZy1wb2xpY3knO1xuaW1wb3J0IHsgQmFzaWNUYXJnZXRUcmFja2luZ1NjYWxpbmdQb2xpY3lQcm9wcywgVGFyZ2V0VHJhY2tpbmdTY2FsaW5nUG9saWN5IH0gZnJvbSAnLi90YXJnZXQtdHJhY2tpbmctc2NhbGluZy1wb2xpY3knO1xuXG5leHBvcnQgaW50ZXJmYWNlIElTY2FsYWJsZVRhcmdldCBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBzY2FsYWJsZVRhcmdldElkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBzY2FsYWJsZSB0YXJnZXRcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTY2FsYWJsZVRhcmdldFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBtaW5pbXVtIHZhbHVlIHRoYXQgQXBwbGljYXRpb24gQXV0byBTY2FsaW5nIGNhbiB1c2UgdG8gc2NhbGUgYSB0YXJnZXQgZHVyaW5nIGEgc2NhbGluZyBhY3Rpdml0eS5cbiAgICovXG4gIHJlYWRvbmx5IG1pbkNhcGFjaXR5OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIHZhbHVlIHRoYXQgQXBwbGljYXRpb24gQXV0byBTY2FsaW5nIGNhbiB1c2UgdG8gc2NhbGUgYSB0YXJnZXQgZHVyaW5nIGEgc2NhbGluZyBhY3Rpdml0eS5cbiAgICovXG4gIHJlYWRvbmx5IG1heENhcGFjaXR5OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFJvbGUgdGhhdCBhbGxvd3MgQXBwbGljYXRpb24gQXV0byBTY2FsaW5nIHRvIG1vZGlmeSB5b3VyIHNjYWxhYmxlIHRhcmdldC5cbiAgICpcbiAgICogQGRlZmF1bHQgQSByb2xlIGlzIGF1dG9tYXRpY2FsbHkgY3JlYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZT86IGlhbS5JUm9sZTtcblxuICAvKipcbiAgICogVGhlIHJlc291cmNlIGlkZW50aWZpZXIgdG8gYXNzb2NpYXRlIHdpdGggdGhpcyBzY2FsYWJsZSB0YXJnZXQuXG4gICAqXG4gICAqIFRoaXMgc3RyaW5nIGNvbnNpc3RzIG9mIHRoZSByZXNvdXJjZSB0eXBlIGFuZCB1bmlxdWUgaWRlbnRpZmllci5cbiAgICpcbiAgICogRXhhbXBsZSB2YWx1ZTogYHNlcnZpY2UvZWNzU3RhY2stTXlFQ1NDbHVzdGVyLUFCMTJDREUzRjRHSC9lY3NTdGFjay1NeUVDU1NlcnZpY2UtQUIxMkNERTNGNEdIYFxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hdXRvc2NhbGluZy9hcHBsaWNhdGlvbi9BUElSZWZlcmVuY2UvQVBJX1JlZ2lzdGVyU2NhbGFibGVUYXJnZXQuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgc2NhbGFibGUgZGltZW5zaW9uIHRoYXQncyBhc3NvY2lhdGVkIHdpdGggdGhlIHNjYWxhYmxlIHRhcmdldC5cbiAgICpcbiAgICogU3BlY2lmeSB0aGUgc2VydmljZSBuYW1lc3BhY2UsIHJlc291cmNlIHR5cGUsIGFuZCBzY2FsaW5nIHByb3BlcnR5LlxuICAgKlxuICAgKiBFeGFtcGxlIHZhbHVlOiBgZWNzOnNlcnZpY2U6RGVzaXJlZENvdW50YFxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hdXRvc2NhbGluZy9hcHBsaWNhdGlvbi9BUElSZWZlcmVuY2UvQVBJX1NjYWxpbmdQb2xpY3kuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgc2NhbGFibGVEaW1lbnNpb246IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWVzcGFjZSBvZiB0aGUgQVdTIHNlcnZpY2UgdGhhdCBwcm92aWRlcyB0aGUgcmVzb3VyY2Ugb3JcbiAgICogY3VzdG9tLXJlc291cmNlIGZvciBhIHJlc291cmNlIHByb3ZpZGVkIGJ5IHlvdXIgb3duIGFwcGxpY2F0aW9uIG9yXG4gICAqIHNlcnZpY2UuXG4gICAqXG4gICAqIEZvciB2YWxpZCBBV1Mgc2VydmljZSBuYW1lc3BhY2UgdmFsdWVzLCBzZWUgdGhlIFJlZ2lzdGVyU2NhbGFibGVUYXJnZXRcbiAgICogYWN0aW9uIGluIHRoZSBBcHBsaWNhdGlvbiBBdXRvIFNjYWxpbmcgQVBJIFJlZmVyZW5jZS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYXV0b3NjYWxpbmcvYXBwbGljYXRpb24vQVBJUmVmZXJlbmNlL0FQSV9SZWdpc3RlclNjYWxhYmxlVGFyZ2V0Lmh0bWxcbiAgICovXG4gIHJlYWRvbmx5IHNlcnZpY2VOYW1lc3BhY2U6IFNlcnZpY2VOYW1lc3BhY2U7XG59XG5cbi8qKlxuICogRGVmaW5lIGEgc2NhbGFibGUgdGFyZ2V0XG4gKi9cbmV4cG9ydCBjbGFzcyBTY2FsYWJsZVRhcmdldCBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVNjYWxhYmxlVGFyZ2V0IHtcblxuICBwdWJsaWMgc3RhdGljIGZyb21TY2FsYWJsZVRhcmdldElkKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHNjYWxhYmxlVGFyZ2V0SWQ6IHN0cmluZyk6IElTY2FsYWJsZVRhcmdldCB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJU2NhbGFibGVUYXJnZXQge1xuICAgICAgcHVibGljIHJlYWRvbmx5IHNjYWxhYmxlVGFyZ2V0SWQgPSBzY2FsYWJsZVRhcmdldElkO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIElEIG9mIHRoZSBTY2FsYWJsZSBUYXJnZXRcbiAgICpcbiAgICogRXhhbXBsZSB2YWx1ZTogYHNlcnZpY2UvZWNzU3RhY2stTXlFQ1NDbHVzdGVyLUFCMTJDREUzRjRHSC9lY3NTdGFjay1NeUVDU1NlcnZpY2UtQUIxMkNERTNGNEdIfGVjczpzZXJ2aWNlOkRlc2lyZWRDb3VudHxlY3NgXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBzY2FsYWJsZVRhcmdldElkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSByb2xlIHVzZWQgdG8gZ2l2ZSBBdXRvU2NhbGluZyBwZXJtaXNzaW9ucyB0byB5b3VyIHJlc291cmNlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcm9sZTogaWFtLklSb2xlO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYWN0aW9ucyA9IG5ldyBBcnJheTxDZm5TY2FsYWJsZVRhcmdldC5TY2hlZHVsZWRBY3Rpb25Qcm9wZXJ0eT4oKTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogU2NhbGFibGVUYXJnZXRQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB3aXRoUmVzb2x2ZWQocHJvcHMubWF4Q2FwYWNpdHksIG1heCA9PiB7XG4gICAgICBpZiAobWF4IDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihgbWF4Q2FwYWNpdHkgY2Fubm90IGJlIG5lZ2F0aXZlLCBnb3Q6ICR7cHJvcHMubWF4Q2FwYWNpdHl9YCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB3aXRoUmVzb2x2ZWQocHJvcHMubWluQ2FwYWNpdHksIG1pbiA9PiB7XG4gICAgICBpZiAobWluIDwgMCkge1xuICAgICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihgbWluQ2FwYWNpdHkgY2Fubm90IGJlIG5lZ2F0aXZlLCBnb3Q6ICR7cHJvcHMubWluQ2FwYWNpdHl9YCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB3aXRoUmVzb2x2ZWQocHJvcHMubWluQ2FwYWNpdHksIHByb3BzLm1heENhcGFjaXR5LCAobWluLCBtYXgpID0+IHtcbiAgICAgIGlmIChtYXggPCBtaW4pIHtcbiAgICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYG1pbkNhcGFjaXR5ICgke3Byb3BzLm1pbkNhcGFjaXR5fSkgc2hvdWxkIGJlIGxvd2VyIHRoYW4gbWF4Q2FwYWNpdHkgKCR7cHJvcHMubWF4Q2FwYWNpdHl9KWApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5yb2xlID0gcHJvcHMucm9sZSB8fCBuZXcgaWFtLlJvbGUodGhpcywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnYXBwbGljYXRpb24tYXV0b3NjYWxpbmcuYW1hem9uYXdzLmNvbScpLFxuICAgIH0pO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuU2NhbGFibGVUYXJnZXQodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbWF4Q2FwYWNpdHk6IHByb3BzLm1heENhcGFjaXR5LFxuICAgICAgbWluQ2FwYWNpdHk6IHByb3BzLm1pbkNhcGFjaXR5LFxuICAgICAgcmVzb3VyY2VJZDogcHJvcHMucmVzb3VyY2VJZCxcbiAgICAgIHJvbGVBcm46IHRoaXMucm9sZS5yb2xlQXJuLFxuICAgICAgc2NhbGFibGVEaW1lbnNpb246IHByb3BzLnNjYWxhYmxlRGltZW5zaW9uLFxuICAgICAgc2NoZWR1bGVkQWN0aW9uczogTGF6eS5hbnkoeyBwcm9kdWNlOiAoKSA9PiB0aGlzLmFjdGlvbnMgfSwgeyBvbWl0RW1wdHlBcnJheTogdHJ1ZSB9KSxcbiAgICAgIHNlcnZpY2VOYW1lc3BhY2U6IHByb3BzLnNlcnZpY2VOYW1lc3BhY2UsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNjYWxhYmxlVGFyZ2V0SWQgPSByZXNvdXJjZS5yZWY7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGEgcG9saWN5IHN0YXRlbWVudCB0byB0aGUgcm9sZSdzIHBvbGljeVxuICAgKi9cbiAgcHVibGljIGFkZFRvUm9sZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpIHtcbiAgICB0aGlzLnJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY2FsZSBvdXQgb3IgaW4gYmFzZWQgb24gdGltZVxuICAgKi9cbiAgcHVibGljIHNjYWxlT25TY2hlZHVsZShpZDogc3RyaW5nLCBhY3Rpb246IFNjYWxpbmdTY2hlZHVsZSkge1xuICAgIGlmIChhY3Rpb24ubWluQ2FwYWNpdHkgPT09IHVuZGVmaW5lZCAmJiBhY3Rpb24ubWF4Q2FwYWNpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBZb3UgbXVzdCBzdXBwbHkgYXQgbGVhc3Qgb25lIG9mIG1pbkNhcGFjaXR5IG9yIG1heENhcGFjaXR5LCBnb3QgJHtKU09OLnN0cmluZ2lmeShhY3Rpb24pfWApO1xuICAgIH1cblxuICAgIC8vIGFkZCBhIHdhcm5pbmcgb24gc3ludGggd2hlbiBtaW51dGUgaXMgbm90IGRlZmluZWQgaW4gYSBjcm9uIHNjaGVkdWxlXG4gICAgYWN0aW9uLnNjaGVkdWxlLl9iaW5kKHRoaXMpO1xuXG4gICAgdGhpcy5hY3Rpb25zLnB1c2goe1xuICAgICAgc2NoZWR1bGVkQWN0aW9uTmFtZTogaWQsXG4gICAgICBzY2hlZHVsZTogYWN0aW9uLnNjaGVkdWxlLmV4cHJlc3Npb25TdHJpbmcsXG4gICAgICBzdGFydFRpbWU6IGFjdGlvbi5zdGFydFRpbWUsXG4gICAgICBlbmRUaW1lOiBhY3Rpb24uZW5kVGltZSxcbiAgICAgIHNjYWxhYmxlVGFyZ2V0QWN0aW9uOiB7XG4gICAgICAgIG1heENhcGFjaXR5OiBhY3Rpb24ubWF4Q2FwYWNpdHksXG4gICAgICAgIG1pbkNhcGFjaXR5OiBhY3Rpb24ubWluQ2FwYWNpdHksXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlIG91dCBvciBpbiwgaW4gcmVzcG9uc2UgdG8gYSBtZXRyaWNcbiAgICovXG4gIHB1YmxpYyBzY2FsZU9uTWV0cmljKGlkOiBzdHJpbmcsIHByb3BzOiBCYXNpY1N0ZXBTY2FsaW5nUG9saWN5UHJvcHMpIHtcbiAgICByZXR1cm4gbmV3IFN0ZXBTY2FsaW5nUG9saWN5KHRoaXMsIGlkLCB7IC4uLnByb3BzLCBzY2FsaW5nVGFyZ2V0OiB0aGlzIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYWxlIG91dCBvciBpbiBpbiBvcmRlciB0byBrZWVwIGEgbWV0cmljIGFyb3VuZCBhIHRhcmdldCB2YWx1ZVxuICAgKi9cbiAgcHVibGljIHNjYWxlVG9UcmFja01ldHJpYyhpZDogc3RyaW5nLCBwcm9wczogQmFzaWNUYXJnZXRUcmFja2luZ1NjYWxpbmdQb2xpY3lQcm9wcykge1xuICAgIHJldHVybiBuZXcgVGFyZ2V0VHJhY2tpbmdTY2FsaW5nUG9saWN5KHRoaXMsIGlkLCB7IC4uLnByb3BzLCBzY2FsaW5nVGFyZ2V0OiB0aGlzIH0pO1xuICB9XG59XG5cbi8qKlxuICogQSBzY2hlZHVsZWQgc2NhbGluZyBhY3Rpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTY2FsaW5nU2NoZWR1bGUge1xuICAvKipcbiAgICogV2hlbiB0byBwZXJmb3JtIHRoaXMgYWN0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgc2NoZWR1bGU6IFNjaGVkdWxlO1xuXG4gIC8qKlxuICAgKiBXaGVuIHRoaXMgc2NoZWR1bGVkIGFjdGlvbiBiZWNvbWVzIGFjdGl2ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgVGhlIHJ1bGUgaXMgYWN0aXZhdGUgaW1tZWRpYXRlbHlcbiAgICovXG4gIHJlYWRvbmx5IHN0YXJ0VGltZT86IERhdGVcblxuICAvKipcbiAgICogV2hlbiB0aGlzIHNjaGVkdWxlZCBhY3Rpb24gZXhwaXJlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgVGhlIHJ1bGUgbmV2ZXIgZXhwaXJlcy5cbiAgICovXG4gIHJlYWRvbmx5IGVuZFRpbWU/OiBEYXRlO1xuXG4gIC8qKlxuICAgKiBUaGUgbmV3IG1pbmltdW0gY2FwYWNpdHkuXG4gICAqXG4gICAqIER1cmluZyB0aGUgc2NoZWR1bGVkIHRpbWUsIGlmIHRoZSBjdXJyZW50IGNhcGFjaXR5IGlzIGJlbG93IHRoZSBtaW5pbXVtXG4gICAqIGNhcGFjaXR5LCBBcHBsaWNhdGlvbiBBdXRvIFNjYWxpbmcgc2NhbGVzIG91dCB0byB0aGUgbWluaW11bSBjYXBhY2l0eS5cbiAgICpcbiAgICogQXQgbGVhc3Qgb25lIG9mIG1heENhcGFjaXR5IGFuZCBtaW5DYXBhY2l0eSBtdXN0IGJlIHN1cHBsaWVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCBObyBuZXcgbWluaW11bSBjYXBhY2l0eVxuICAgKi9cbiAgcmVhZG9ubHkgbWluQ2FwYWNpdHk/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBuZXcgbWF4aW11bSBjYXBhY2l0eS5cbiAgICpcbiAgICogRHVyaW5nIHRoZSBzY2hlZHVsZWQgdGltZSwgdGhlIGN1cnJlbnQgY2FwYWNpdHkgaXMgYWJvdmUgdGhlIG1heGltdW1cbiAgICogY2FwYWNpdHksIEFwcGxpY2F0aW9uIEF1dG8gU2NhbGluZyBzY2FsZXMgaW4gdG8gdGhlIG1heGltdW0gY2FwYWNpdHkuXG4gICAqXG4gICAqIEF0IGxlYXN0IG9uZSBvZiBtYXhDYXBhY2l0eSBhbmQgbWluQ2FwYWNpdHkgbXVzdCBiZSBzdXBwbGllZC5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gbmV3IG1heGltdW0gY2FwYWNpdHlcbiAgICovXG4gIHJlYWRvbmx5IG1heENhcGFjaXR5PzogbnVtYmVyO1xufVxuXG4vKipcbiAqIFRoZSBzZXJ2aWNlIHRoYXQgc3VwcG9ydHMgQXBwbGljYXRpb24gQXV0b1NjYWxpbmdcbiAqL1xuZXhwb3J0IGVudW0gU2VydmljZU5hbWVzcGFjZSB7XG4gIC8qKlxuICAgKiBFbGFzdGljIENvbnRhaW5lciBTZXJ2aWNlXG4gICAqL1xuICBFQ1MgPSAnZWNzJyxcblxuICAvKipcbiAgICogRWxhc3RpYyBNYXAgUmVkdWNlXG4gICAqL1xuICBFTEFTVElDX01BUF9SRURVQ0UgPSAnZWxhc3RpY21hcHJlZHVjZScsXG5cbiAgLyoqXG4gICAqIEVsYXN0aWMgQ29tcHV0ZSBDbG91ZFxuICAgKi9cbiAgRUMyID0gJ2VjMicsXG5cbiAgLyoqXG4gICAqIEFwcCBTdHJlYW1cbiAgICovXG4gIEFQUFNUUkVBTSA9ICdhcHBzdHJlYW0nLFxuXG4gIC8qKlxuICAgKiBEeW5hbW8gREJcbiAgICovXG4gIERZTkFNT0RCID0gJ2R5bmFtb2RiJyxcblxuICAvKipcbiAgICogUmVsYXRpb25hbCBEYXRhYmFzZSBTZXJ2aWNlXG4gICAqL1xuICBSRFMgPSAncmRzJyxcblxuICAvKipcbiAgICogU2FnZU1ha2VyXG4gICAqL1xuICBTQUdFTUFLRVIgPSAnc2FnZW1ha2VyJyxcblxuICAvKipcbiAgICogQ3VzdG9tIFJlc291cmNlXG4gICAqL1xuICBDVVNUT01fUkVTT1VSQ0UgPSAnY3VzdG9tLXJlc291cmNlJyxcblxuICAvKipcbiAgICogTGFtYmRhXG4gICAqL1xuICBMQU1CREEgPSAnbGFtYmRhJyxcblxuICAvKipcbiAgICogQ29tcHJlaGVuZFxuICAgKi9cbiAgQ09NUFJFSEVORCA9ICdjb21wcmVoZW5kJyxcblxuICAvKipcbiAgICogS2Fma2FcbiAgICovXG4gIEtBRktBID0gJ2thZmthJyxcblxuICAvKipcbiAgICogRWxhc3RpQ2FjaGVcbiAgICovXG4gIEVMQVNUSUNBQ0hFID0gJ2VsYXN0aWNhY2hlJyxcblxuICAvKipcbiAgICogTmVwdHVuZVxuICAgKi9cbiAgTkVQVFVORSA9ICduZXB0dW5lJyxcbn1cbiJdfQ==