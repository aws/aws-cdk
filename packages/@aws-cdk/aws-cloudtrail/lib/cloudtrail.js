"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataResourceType = exports.ManagementEventSources = exports.Trail = exports.InsightType = exports.ReadWriteType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const events = require("@aws-cdk/aws-events");
const iam = require("@aws-cdk/aws-iam");
const logs = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const cloudtrail_generated_1 = require("./cloudtrail.generated");
/**
 * Types of events that CloudTrail can log
 */
var ReadWriteType;
(function (ReadWriteType) {
    /**
     * Read-only events include API operations that read your resources,
     * but don't make changes.
     * For example, read-only events include the Amazon EC2 DescribeSecurityGroups
     * and DescribeSubnets API operations.
     */
    ReadWriteType["READ_ONLY"] = "ReadOnly";
    /**
     * Write-only events include API operations that modify (or might modify)
     * your resources.
     * For example, the Amazon EC2 RunInstances and TerminateInstances API
     * operations modify your instances.
     */
    ReadWriteType["WRITE_ONLY"] = "WriteOnly";
    /**
     * All events
     */
    ReadWriteType["ALL"] = "All";
    /**
     * No events
     */
    ReadWriteType["NONE"] = "None";
})(ReadWriteType = exports.ReadWriteType || (exports.ReadWriteType = {}));
/**
 * Util element for InsightSelector
 */
class InsightType {
    constructor(value) {
        this.value = value;
    }
}
exports.InsightType = InsightType;
_a = JSII_RTTI_SYMBOL_1;
InsightType[_a] = { fqn: "@aws-cdk/aws-cloudtrail.InsightType", version: "0.0.0" };
/**
 * The type of insights to log on a trail. (API Call Rate)
 */
InsightType.API_CALL_RATE = new InsightType('ApiCallRateInsight');
/**
 * The type of insights to log on a trail. (API Error Rate)
 */
InsightType.API_ERROR_RATE = new InsightType('ApiErrorRateInsight');
/**
 * Cloud trail allows you to log events that happen in your AWS account
 * For example:
 *
 * import { CloudTrail } from '@aws-cdk/aws-cloudtrail'
 *
 * const cloudTrail = new CloudTrail(this, 'MyTrail');
 *
 * NOTE the above example creates an UNENCRYPTED bucket by default,
 * If you are required to use an Encrypted bucket you can supply a preconfigured bucket
 * via TrailProps
 *
 */
class Trail extends core_1.Resource {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.trailName,
        });
        this.eventSelectors = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudtrail_TrailProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Trail);
            }
            throw error;
        }
        const cloudTrailPrincipal = new iam.ServicePrincipal('cloudtrail.amazonaws.com');
        this.s3bucket = props.bucket || new s3.Bucket(this, 'S3', { encryption: s3.BucketEncryption.UNENCRYPTED, enforceSSL: true });
        this.s3bucket.addToResourcePolicy(new iam.PolicyStatement({
            resources: [this.s3bucket.bucketArn],
            actions: ['s3:GetBucketAcl'],
            principals: [cloudTrailPrincipal],
        }));
        this.s3bucket.addToResourcePolicy(new iam.PolicyStatement({
            resources: [this.s3bucket.arnForObjects(`${props.s3KeyPrefix ? `${props.s3KeyPrefix}/` : ''}AWSLogs/${core_1.Stack.of(this).account}/*`)],
            actions: ['s3:PutObject'],
            principals: [cloudTrailPrincipal],
            conditions: {
                StringEquals: { 's3:x-amz-acl': 'bucket-owner-full-control' },
            },
        }));
        this.topic = props.snsTopic;
        if (this.topic) {
            this.topic.grantPublish(cloudTrailPrincipal);
        }
        let logsRole;
        if (props.sendToCloudWatchLogs) {
            if (props.cloudWatchLogGroup) {
                this.logGroup = props.cloudWatchLogGroup;
            }
            else {
                this.logGroup = new logs.LogGroup(this, 'LogGroup', {
                    retention: props.cloudWatchLogsRetention ?? logs.RetentionDays.ONE_YEAR,
                });
            }
            logsRole = new iam.Role(this, 'LogsRole', { assumedBy: cloudTrailPrincipal });
            logsRole.addToPrincipalPolicy(new iam.PolicyStatement({
                actions: ['logs:PutLogEvents', 'logs:CreateLogStream'],
                resources: [this.logGroup.logGroupArn],
            }));
        }
        this.managementEvents = props.managementEvents;
        if (this.managementEvents && this.managementEvents !== ReadWriteType.NONE) {
            this.eventSelectors.push({
                includeManagementEvents: true,
                readWriteType: props.managementEvents,
            });
        }
        this.node.addValidation({ validate: () => this.validateEventSelectors() });
        if (props.kmsKey && props.encryptionKey) {
            throw new Error('Both kmsKey and encryptionKey must not be specified. Use only encryptionKey');
        }
        if (props.insightTypes) {
            this.insightTypeValues = props.insightTypes.map(function (t) {
                return { insightType: t.value };
            });
        }
        // TODO: not all regions support validation. Use service configuration data to fail gracefully
        const trail = new cloudtrail_generated_1.CfnTrail(this, 'Resource', {
            isLogging: true,
            enableLogFileValidation: props.enableFileValidation == null ? true : props.enableFileValidation,
            isMultiRegionTrail: props.isMultiRegionTrail == null ? true : props.isMultiRegionTrail,
            includeGlobalServiceEvents: props.includeGlobalServiceEvents == null ? true : props.includeGlobalServiceEvents,
            trailName: this.physicalName,
            kmsKeyId: props.encryptionKey?.keyArn ?? props.kmsKey?.keyArn,
            s3BucketName: this.s3bucket.bucketName,
            s3KeyPrefix: props.s3KeyPrefix,
            cloudWatchLogsLogGroupArn: this.logGroup?.logGroupArn,
            cloudWatchLogsRoleArn: logsRole?.roleArn,
            snsTopicName: this.topic?.topicName,
            eventSelectors: this.eventSelectors,
            isOrganizationTrail: props.isOrganizationTrail,
            insightSelectors: this.insightTypeValues,
        });
        this.trailArn = this.getResourceArnAttribute(trail.attrArn, {
            service: 'cloudtrail',
            resource: 'trail',
            resourceName: this.physicalName,
        });
        this.trailSnsTopicArn = trail.attrSnsTopicArn;
        // Add a dependency on the bucket policy being updated, CloudTrail will test this upon creation.
        if (this.s3bucket.policy) {
            trail.node.addDependency(this.s3bucket.policy);
        }
        // If props.sendToCloudWatchLogs is set to true then the trail needs to depend on the created logsRole
        // so that it can create the log stream for the log group. This ensures the logsRole is created and propagated
        // before the trail tries to create the log stream.
        if (logsRole !== undefined) {
            trail.node.addDependency(logsRole);
        }
    }
    /**
     * Create an event rule for when an event is recorded by any Trail in the account.
     *
     * Note that the event doesn't necessarily have to come from this Trail, it can
     * be captured from any one.
     *
     * Be sure to filter the event further down using an event pattern.
     */
    static onEvent(scope, id, options = {}) {
        const rule = new events.Rule(scope, id, options);
        rule.addTarget(options.target);
        rule.addEventPattern({
            detailType: ['AWS API Call via CloudTrail'],
        });
        return rule;
    }
    /**
     * When an event occurs in your account, CloudTrail evaluates whether the event matches the settings for your trails.
     * Only events that match your trail settings are delivered to your Amazon S3 bucket and Amazon CloudWatch Logs log group.
     *
     * This method adds an Event Selector for filtering events that match either S3 or Lambda function operations.
     *
     * Data events: These events provide insight into the resource operations performed on or within a resource.
     * These are also known as data plane operations.
     *
     * @param dataResourceValues the list of data resource ARNs to include in logging (maximum 250 entries).
     * @param options the options to configure logging of management and data events.
     */
    addEventSelector(dataResourceType, dataResourceValues, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudtrail_DataResourceType(dataResourceType);
            jsiiDeprecationWarnings._aws_cdk_aws_cloudtrail_AddEventSelectorOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addEventSelector);
            }
            throw error;
        }
        if (dataResourceValues.length > 250) {
            throw new Error('A maximum of 250 data elements can be in one event selector');
        }
        if (this.eventSelectors.length > 5) {
            throw new Error('A maximum of 5 event selectors are supported per trail.');
        }
        let includeAllManagementEvents;
        if (this.managementEvents === ReadWriteType.NONE) {
            includeAllManagementEvents = false;
        }
        this.eventSelectors.push({
            dataResources: [{
                    type: dataResourceType,
                    values: dataResourceValues,
                }],
            includeManagementEvents: options.includeManagementEvents ?? includeAllManagementEvents,
            excludeManagementEventSources: options.excludeManagementEventSources,
            readWriteType: options.readWriteType,
        });
    }
    /**
     * When an event occurs in your account, CloudTrail evaluates whether the event matches the settings for your trails.
     * Only events that match your trail settings are delivered to your Amazon S3 bucket and Amazon CloudWatch Logs log group.
     *
     * This method adds a Lambda Data Event Selector for filtering events that match Lambda function operations.
     *
     * Data events: These events provide insight into the resource operations performed on or within a resource.
     * These are also known as data plane operations.
     *
     * @param handlers the list of lambda function handlers whose data events should be logged (maximum 250 entries).
     * @param options the options to configure logging of management and data events.
     */
    addLambdaEventSelector(handlers, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudtrail_AddEventSelectorOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addLambdaEventSelector);
            }
            throw error;
        }
        if (handlers.length === 0) {
            return;
        }
        const dataResourceValues = handlers.map((h) => h.functionArn);
        return this.addEventSelector(DataResourceType.LAMBDA_FUNCTION, dataResourceValues, options);
    }
    /**
     * Log all Lambda data events for all lambda functions the account.
     * @see https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html
     * @default false
     */
    logAllLambdaDataEvents(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudtrail_AddEventSelectorOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.logAllLambdaDataEvents);
            }
            throw error;
        }
        return this.addEventSelector(DataResourceType.LAMBDA_FUNCTION, [`arn:${this.stack.partition}:lambda`], options);
    }
    /**
     * When an event occurs in your account, CloudTrail evaluates whether the event matches the settings for your trails.
     * Only events that match your trail settings are delivered to your Amazon S3 bucket and Amazon CloudWatch Logs log group.
     *
     * This method adds an S3 Data Event Selector for filtering events that match S3 operations.
     *
     * Data events: These events provide insight into the resource operations performed on or within a resource.
     * These are also known as data plane operations.
     *
     * @param s3Selector the list of S3 bucket with optional prefix to include in logging (maximum 250 entries).
     * @param options the options to configure logging of management and data events.
     */
    addS3EventSelector(s3Selector, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudtrail_AddEventSelectorOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addS3EventSelector);
            }
            throw error;
        }
        if (s3Selector.length === 0) {
            return;
        }
        const dataResourceValues = s3Selector.map((sel) => `${sel.bucket.bucketArn}/${sel.objectPrefix ?? ''}`);
        return this.addEventSelector(DataResourceType.S3_OBJECT, dataResourceValues, options);
    }
    /**
     * Log all S3 data events for all objects for all buckets in the account.
     * @see https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html
     * @default false
     */
    logAllS3DataEvents(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudtrail_AddEventSelectorOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.logAllS3DataEvents);
            }
            throw error;
        }
        return this.addEventSelector(DataResourceType.S3_OBJECT, [`arn:${this.stack.partition}:s3:::`], options);
    }
    /**
     * Create an event rule for when an event is recorded by any Trail in the account.
     *
     * Note that the event doesn't necessarily have to come from this Trail, it can
     * be captured from any one.
     *
     * Be sure to filter the event further down using an event pattern.
     *
     * @deprecated - use Trail.onEvent()
     */
    onCloudTrailEvent(id, options = {}) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-cloudtrail.Trail#onCloudTrailEvent", "- use Trail.onEvent()");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.onCloudTrailEvent);
            }
            throw error;
        }
        return Trail.onEvent(this, id, options);
    }
    validateEventSelectors() {
        const errors = [];
        // Ensure that there is at least one event selector when management events are set to None
        if (this.managementEvents === ReadWriteType.NONE && this.eventSelectors.length === 0) {
            errors.push('At least one event selector must be added when management event recording is set to None');
        }
        return errors;
    }
}
exports.Trail = Trail;
_b = JSII_RTTI_SYMBOL_1;
Trail[_b] = { fqn: "@aws-cdk/aws-cloudtrail.Trail", version: "0.0.0" };
/**
 * Types of management event sources that can be excluded
 */
var ManagementEventSources;
(function (ManagementEventSources) {
    /**
     * AWS Key Management Service (AWS KMS) events
     */
    ManagementEventSources["KMS"] = "kms.amazonaws.com";
    /**
     * Data API events
     */
    ManagementEventSources["RDS_DATA_API"] = "rdsdata.amazonaws.com";
})(ManagementEventSources = exports.ManagementEventSources || (exports.ManagementEventSources = {}));
/**
 * Resource type for a data event
 */
var DataResourceType;
(function (DataResourceType) {
    /**
     * Data resource type for Lambda function
     */
    DataResourceType["LAMBDA_FUNCTION"] = "AWS::Lambda::Function";
    /**
     * Data resource type for S3 objects
     */
    DataResourceType["S3_OBJECT"] = "AWS::S3::Object";
})(DataResourceType = exports.DataResourceType || (exports.DataResourceType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWR0cmFpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsb3VkdHJhaWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsOENBQThDO0FBQzlDLHdDQUF3QztBQUd4QywwQ0FBMEM7QUFDMUMsc0NBQXNDO0FBRXRDLHdDQUFnRDtBQUVoRCxpRUFBa0Q7QUFpSWxEOztHQUVHO0FBQ0gsSUFBWSxhQXdCWDtBQXhCRCxXQUFZLGFBQWE7SUFDdkI7Ozs7O09BS0c7SUFDSCx1Q0FBc0IsQ0FBQTtJQUN0Qjs7Ozs7T0FLRztJQUNILHlDQUF3QixDQUFBO0lBQ3hCOztPQUVHO0lBQ0gsNEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsOEJBQWEsQ0FBQTtBQUNmLENBQUMsRUF4QlcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUF3QnhCO0FBRUQ7O0dBRUc7QUFDSCxNQUFhLFdBQVc7SUFXdEIsWUFBc0MsS0FBYTtRQUFiLFVBQUssR0FBTCxLQUFLLENBQVE7S0FBSTs7QUFYekQsa0NBWUM7OztBQVhDOztHQUVHO0FBQ29CLHlCQUFhLEdBQUcsSUFBSSxXQUFXLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUU3RTs7R0FFRztBQUNvQiwwQkFBYyxHQUFHLElBQUksV0FBVyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFLakY7Ozs7Ozs7Ozs7OztHQVlHO0FBQ0gsTUFBYSxLQUFNLFNBQVEsZUFBUTtJQTZDakMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUFvQixFQUFFO1FBQzlELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsWUFBWSxFQUFFLEtBQUssQ0FBQyxTQUFTO1NBQzlCLENBQUMsQ0FBQztRQVBHLG1CQUFjLEdBQW9CLEVBQUUsQ0FBQzs7Ozs7OytDQXpDbEMsS0FBSzs7OztRQWtEZCxNQUFNLG1CQUFtQixHQUFHLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFF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SSxFQUFFLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztLQUN6QztJQUVPLHNCQUFzQjtRQUM1QixNQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDNUIsMEZBQTBGO1FBQzFGLElBQUksSUFBSSxDQUFDLGdCQUFnQixLQUFLLGFBQWEsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3BGLE1BQU0sQ0FBQyxJQUFJLENBQUMsMEZBQTBGLENBQUMsQ0FBQztTQUN6RztRQUNELE9BQU8sTUFBTSxDQUFDO0tBQ2Y7O0FBeFFILHNCQXlRQzs7O0FBNEJEOztHQUVHO0FBQ0gsSUFBWSxzQkFVWDtBQVZELFdBQVksc0JBQXNCO0lBQ2hDOztPQUVHO0lBQ0gsbURBQXlCLENBQUE7SUFFekI7O09BRUc7SUFDSCxnRUFBc0MsQ0FBQTtBQUN4QyxDQUFDLEVBVlcsc0JBQXNCLEdBQXRCLDhCQUFzQixLQUF0Qiw4QkFBc0IsUUFVakM7QUFnQkQ7O0dBRUc7QUFDSCxJQUFZLGdCQVVYO0FBVkQsV0FBWSxnQkFBZ0I7SUFDMUI7O09BRUc7SUFDSCw2REFBeUMsQ0FBQTtJQUV6Qzs7T0FFRztJQUNILGlEQUE2QixDQUFBO0FBQy9CLENBQUMsRUFWVyxnQkFBZ0IsR0FBaEIsd0JBQWdCLEtBQWhCLHdCQUFnQixRQVUzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV2ZW50cyBmcm9tICdAYXdzLWNkay9hd3MtZXZlbnRzJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCAqIGFzIGxhbWJkYSBmcm9tICdAYXdzLWNkay9hd3MtbGFtYmRhJztcbmltcG9ydCAqIGFzIGxvZ3MgZnJvbSAnQGF3cy1jZGsvYXdzLWxvZ3MnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCAqIGFzIHNucyBmcm9tICdAYXdzLWNkay9hd3Mtc25zJztcbmltcG9ydCB7IFJlc291cmNlLCBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5UcmFpbCB9IGZyb20gJy4vY2xvdWR0cmFpbC5nZW5lcmF0ZWQnO1xuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGFuIEFXUyBDbG91ZFRyYWlsIHRyYWlsXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVHJhaWxQcm9wcyB7XG4gIC8qKlxuICAgKiBGb3IgbW9zdCBzZXJ2aWNlcywgZXZlbnRzIGFyZSByZWNvcmRlZCBpbiB0aGUgcmVnaW9uIHdoZXJlIHRoZSBhY3Rpb24gb2NjdXJyZWQuXG4gICAqIEZvciBnbG9iYWwgc2VydmljZXMgc3VjaCBhcyBBV1MgSWRlbnRpdHkgYW5kIEFjY2VzcyBNYW5hZ2VtZW50IChJQU0pLCBBV1MgU1RTLCBBbWF6b24gQ2xvdWRGcm9udCwgYW5kIFJvdXRlIDUzLFxuICAgKiBldmVudHMgYXJlIGRlbGl2ZXJlZCB0byBhbnkgdHJhaWwgdGhhdCBpbmNsdWRlcyBnbG9iYWwgc2VydmljZXMsIGFuZCBhcmUgbG9nZ2VkIGFzIG9jY3VycmluZyBpbiBVUyBFYXN0IChOLiBWaXJnaW5pYSkgUmVnaW9uLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICByZWFkb25seSBpbmNsdWRlR2xvYmFsU2VydmljZUV2ZW50cz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgb3Igbm90IHRoaXMgdHJhaWwgZGVsaXZlcnMgbG9nIGZpbGVzIGZyb20gbXVsdGlwbGUgcmVnaW9ucyB0byBhIHNpbmdsZSBTMyBidWNrZXQgZm9yIGEgc2luZ2xlIGFjY291bnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIHJlYWRvbmx5IGlzTXVsdGlSZWdpb25UcmFpbD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZW4gYW4gZXZlbnQgb2NjdXJzIGluIHlvdXIgYWNjb3VudCwgQ2xvdWRUcmFpbCBldmFsdWF0ZXMgd2hldGhlciB0aGUgZXZlbnQgbWF0Y2hlcyB0aGUgc2V0dGluZ3MgZm9yIHlvdXIgdHJhaWxzLlxuICAgKiBPbmx5IGV2ZW50cyB0aGF0IG1hdGNoIHlvdXIgdHJhaWwgc2V0dGluZ3MgYXJlIGRlbGl2ZXJlZCB0byB5b3VyIEFtYXpvbiBTMyBidWNrZXQgYW5kIEFtYXpvbiBDbG91ZFdhdGNoIExvZ3MgbG9nIGdyb3VwLlxuICAgKlxuICAgKiBUaGlzIG1ldGhvZCBzZXRzIHRoZSBtYW5hZ2VtZW50IGNvbmZpZ3VyYXRpb24gZm9yIHRoaXMgdHJhaWwuXG4gICAqXG4gICAqIE1hbmFnZW1lbnQgZXZlbnRzIHByb3ZpZGUgaW5zaWdodCBpbnRvIG1hbmFnZW1lbnQgb3BlcmF0aW9ucyB0aGF0IGFyZSBwZXJmb3JtZWQgb24gcmVzb3VyY2VzIGluIHlvdXIgQVdTIGFjY291bnQuXG4gICAqIFRoZXNlIGFyZSBhbHNvIGtub3duIGFzIGNvbnRyb2wgcGxhbmUgb3BlcmF0aW9ucy5cbiAgICogTWFuYWdlbWVudCBldmVudHMgY2FuIGFsc28gaW5jbHVkZSBub24tQVBJIGV2ZW50cyB0aGF0IG9jY3VyIGluIHlvdXIgYWNjb3VudC5cbiAgICogRm9yIGV4YW1wbGUsIHdoZW4gYSB1c2VyIGxvZ3MgaW4gdG8geW91ciBhY2NvdW50LCBDbG91ZFRyYWlsIGxvZ3MgdGhlIENvbnNvbGVMb2dpbiBldmVudC5cbiAgICpcbiAgICogQHBhcmFtIG1hbmFnZW1lbnRFdmVudHMgdGhlIG1hbmFnZW1lbnQgY29uZmlndXJhdGlvbiB0eXBlIHRvIGxvZ1xuICAgKlxuICAgKiBAZGVmYXVsdCBSZWFkV3JpdGVUeXBlLkFMTFxuICAgKi9cbiAgcmVhZG9ubHkgbWFuYWdlbWVudEV2ZW50cz86IFJlYWRXcml0ZVR5cGU7XG5cbiAgLyoqXG4gICAqIFRvIGRldGVybWluZSB3aGV0aGVyIGEgbG9nIGZpbGUgd2FzIG1vZGlmaWVkLCBkZWxldGVkLCBvciB1bmNoYW5nZWQgYWZ0ZXIgQ2xvdWRUcmFpbCBkZWxpdmVyZWQgaXQsXG4gICAqIHlvdSBjYW4gdXNlIENsb3VkVHJhaWwgbG9nIGZpbGUgaW50ZWdyaXR5IHZhbGlkYXRpb24uXG4gICAqIFRoaXMgZmVhdHVyZSBpcyBidWlsdCB1c2luZyBpbmR1c3RyeSBzdGFuZGFyZCBhbGdvcml0aG1zOiBTSEEtMjU2IGZvciBoYXNoaW5nIGFuZCBTSEEtMjU2IHdpdGggUlNBIGZvciBkaWdpdGFsIHNpZ25pbmcuXG4gICAqIFRoaXMgbWFrZXMgaXQgY29tcHV0YXRpb25hbGx5IGluZmVhc2libGUgdG8gbW9kaWZ5LCBkZWxldGUgb3IgZm9yZ2UgQ2xvdWRUcmFpbCBsb2cgZmlsZXMgd2l0aG91dCBkZXRlY3Rpb24uXG4gICAqIFlvdSBjYW4gdXNlIHRoZSBBV1MgQ0xJIHRvIHZhbGlkYXRlIHRoZSBmaWxlcyBpbiB0aGUgbG9jYXRpb24gd2hlcmUgQ2xvdWRUcmFpbCBkZWxpdmVyZWQgdGhlbS5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlRmlsZVZhbGlkYXRpb24/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBJZiBDbG91ZFRyYWlsIHB1c2hlcyBsb2dzIHRvIENsb3VkV2F0Y2ggTG9ncyBpbiBhZGRpdGlvbiB0byBTMy5cbiAgICogRGlzYWJsZWQgZm9yIGNvc3Qgb3V0IG9mIHRoZSBib3guXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBzZW5kVG9DbG91ZFdhdGNoTG9ncz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEhvdyBsb25nIHRvIHJldGFpbiBsb2dzIGluIENsb3VkV2F0Y2hMb2dzLlxuICAgKiBJZ25vcmVkIGlmIHNlbmRUb0Nsb3VkV2F0Y2hMb2dzIGlzIGZhbHNlIG9yIGlmIGNsb3VkV2F0Y2hMb2dHcm91cCBpcyBzZXQuXG4gICAqXG4gICAqICBAZGVmYXVsdCBsb2dzLlJldGVudGlvbkRheXMuT05FX1lFQVJcbiAgICovXG4gIHJlYWRvbmx5IGNsb3VkV2F0Y2hMb2dzUmV0ZW50aW9uPzogbG9ncy5SZXRlbnRpb25EYXlzO1xuXG4gIC8qKlxuICAgKiBMb2cgR3JvdXAgdG8gd2hpY2ggQ2xvdWRUcmFpbCB0byBwdXNoIGxvZ3MgdG8uIElnbm9yZWQgaWYgc2VuZFRvQ2xvdWRXYXRjaExvZ3MgaXMgc2V0IHRvIGZhbHNlLlxuICAgKiBAZGVmYXVsdCAtIGEgbmV3IGxvZyBncm91cCBpcyBjcmVhdGVkIGFuZCB1c2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgY2xvdWRXYXRjaExvZ0dyb3VwPzogbG9ncy5JTG9nR3JvdXA7XG5cbiAgLyoqIFRoZSBBV1MgS2V5IE1hbmFnZW1lbnQgU2VydmljZSAoQVdTIEtNUykga2V5IElEIHRoYXQgeW91IHdhbnQgdG8gdXNlIHRvIGVuY3J5cHQgQ2xvdWRUcmFpbCBsb2dzLlxuICAgKiBAZGVmYXVsdCAtIE5vIGVuY3J5cHRpb24uXG4gICAqIEBkZXByZWNhdGVkIC0gdXNlIGVuY3J5cHRpb25LZXkgaW5zdGVhZC5cbiAgICovXG4gIHJlYWRvbmx5IGttc0tleT86IGttcy5JS2V5O1xuXG4gIC8qKiBUaGUgQVdTIEtleSBNYW5hZ2VtZW50IFNlcnZpY2UgKEFXUyBLTVMpIGtleSBJRCB0aGF0IHlvdSB3YW50IHRvIHVzZSB0byBlbmNyeXB0IENsb3VkVHJhaWwgbG9ncy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBlbmNyeXB0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuXG4gIC8qKiBTTlMgdG9waWMgdGhhdCBpcyBub3RpZmllZCB3aGVuIG5ldyBsb2cgZmlsZXMgYXJlIHB1Ymxpc2hlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBub3RpZmljYXRpb25zLlxuICAgKi9cbiAgcmVhZG9ubHkgc25zVG9waWM/OiBzbnMuSVRvcGljO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgdHJhaWwuIFdlIHJlY29tbWVuZCBjdXN0b21lcnMgZG8gbm90IHNldCBhbiBleHBsaWNpdCBuYW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFXUyBDbG91ZEZvcm1hdGlvbiBnZW5lcmF0ZWQgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IHRyYWlsTmFtZT86IHN0cmluZztcblxuICAvKiogQW4gQW1hem9uIFMzIG9iamVjdCBrZXkgcHJlZml4IHRoYXQgcHJlY2VkZXMgdGhlIG5hbWUgb2YgYWxsIGxvZyBmaWxlcy5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBwcmVmaXguXG4gICAqL1xuICByZWFkb25seSBzM0tleVByZWZpeD86IHN0cmluZztcblxuICAvKiogVGhlIEFtYXpvbiBTMyBidWNrZXRcbiAgICpcbiAgICogQGRlZmF1bHQgLSBpZiBub3Qgc3VwcGxpZWQgYSBidWNrZXQgd2lsbCBiZSBjcmVhdGVkIHdpdGggYWxsIHRoZSBjb3JyZWN0IHBlcm1pc2lvbnNcbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldD86IHMzLklCdWNrZXQ7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRoZSB0cmFpbCBpcyBhcHBsaWVkIHRvIGFsbCBhY2NvdW50cyBpbiBhbiBvcmdhbml6YXRpb24gaW4gQVdTIE9yZ2FuaXphdGlvbnMsIG9yIG9ubHkgZm9yIHRoZSBjdXJyZW50IEFXUyBhY2NvdW50LlxuICAgKlxuICAgKiBJZiB0aGlzIGlzIHNldCB0byB0cnVlIHRoZW4gdGhlIGN1cnJlbnQgYWNjb3VudCBfbXVzdF8gYmUgdGhlIG1hbmFnZW1lbnQgYWNjb3VudC4gSWYgaXQgaXMgbm90LCB0aGVuIENsb3VkRm9ybWF0aW9uIHdpbGwgdGhyb3cgYW4gZXJyb3IuXG4gICAqXG4gICAqIElmIHRoaXMgaXMgc2V0IHRvIHRydWUgYW5kIHRoZSBjdXJyZW50IGFjY291bnQgaXMgYSBtYW5hZ2VtZW50IGFjY291bnQgZm9yIGFuIG9yZ2FuaXphdGlvbiBpbiBBV1MgT3JnYW5pemF0aW9ucywgdGhlIHRyYWlsIHdpbGwgYmUgY3JlYXRlZCBpbiBhbGwgQVdTIGFjY291bnRzIHRoYXQgYmVsb25nIHRvIHRoZSBvcmdhbml6YXRpb24uXG4gICAqIElmIHRoaXMgaXMgc2V0IHRvIGZhbHNlLCB0aGUgdHJhaWwgd2lsbCByZW1haW4gaW4gdGhlIGN1cnJlbnQgQVdTIGFjY291bnQgYnV0IGJlIGRlbGV0ZWQgZnJvbSBhbGwgbWVtYmVyIGFjY291bnRzIGluIHRoZSBvcmdhbml6YXRpb24uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGlzT3JnYW5pemF0aW9uVHJhaWw/OiBib29sZWFuXG5cbiAgLyoqXG4gICAqIEEgSlNPTiBzdHJpbmcgdGhhdCBjb250YWlucyB0aGUgaW5zaWdodCB0eXBlcyB5b3Ugd2FudCB0byBsb2cgb24gYSB0cmFpbC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBObyBWYWx1ZS5cbiAgICovXG4gIHJlYWRvbmx5IGluc2lnaHRUeXBlcz86IEluc2lnaHRUeXBlW11cbn1cblxuLyoqXG4gKiBUeXBlcyBvZiBldmVudHMgdGhhdCBDbG91ZFRyYWlsIGNhbiBsb2dcbiAqL1xuZXhwb3J0IGVudW0gUmVhZFdyaXRlVHlwZSB7XG4gIC8qKlxuICAgKiBSZWFkLW9ubHkgZXZlbnRzIGluY2x1ZGUgQVBJIG9wZXJhdGlvbnMgdGhhdCByZWFkIHlvdXIgcmVzb3VyY2VzLFxuICAgKiBidXQgZG9uJ3QgbWFrZSBjaGFuZ2VzLlxuICAgKiBGb3IgZXhhbXBsZSwgcmVhZC1vbmx5IGV2ZW50cyBpbmNsdWRlIHRoZSBBbWF6b24gRUMyIERlc2NyaWJlU2VjdXJpdHlHcm91cHNcbiAgICogYW5kIERlc2NyaWJlU3VibmV0cyBBUEkgb3BlcmF0aW9ucy5cbiAgICovXG4gIFJFQURfT05MWSA9ICdSZWFkT25seScsXG4gIC8qKlxuICAgKiBXcml0ZS1vbmx5IGV2ZW50cyBpbmNsdWRlIEFQSSBvcGVyYXRpb25zIHRoYXQgbW9kaWZ5IChvciBtaWdodCBtb2RpZnkpXG4gICAqIHlvdXIgcmVzb3VyY2VzLlxuICAgKiBGb3IgZXhhbXBsZSwgdGhlIEFtYXpvbiBFQzIgUnVuSW5zdGFuY2VzIGFuZCBUZXJtaW5hdGVJbnN0YW5jZXMgQVBJXG4gICAqIG9wZXJhdGlvbnMgbW9kaWZ5IHlvdXIgaW5zdGFuY2VzLlxuICAgKi9cbiAgV1JJVEVfT05MWSA9ICdXcml0ZU9ubHknLFxuICAvKipcbiAgICogQWxsIGV2ZW50c1xuICAgKi9cbiAgQUxMID0gJ0FsbCcsXG5cbiAgLyoqXG4gICAqIE5vIGV2ZW50c1xuICAgKi9cbiAgTk9ORSA9ICdOb25lJyxcbn1cblxuLyoqXG4gKiBVdGlsIGVsZW1lbnQgZm9yIEluc2lnaHRTZWxlY3RvclxuICovXG5leHBvcnQgY2xhc3MgSW5zaWdodFR5cGUge1xuICAvKipcbiAgICogVGhlIHR5cGUgb2YgaW5zaWdodHMgdG8gbG9nIG9uIGEgdHJhaWwuIChBUEkgQ2FsbCBSYXRlKVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBUElfQ0FMTF9SQVRFID0gbmV3IEluc2lnaHRUeXBlKCdBcGlDYWxsUmF0ZUluc2lnaHQnKTtcblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgaW5zaWdodHMgdG8gbG9nIG9uIGEgdHJhaWwuIChBUEkgRXJyb3IgUmF0ZSlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQVBJX0VSUk9SX1JBVEUgPSBuZXcgSW5zaWdodFR5cGUoJ0FwaUVycm9yUmF0ZUluc2lnaHQnKTtcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHZhbHVlOiBzdHJpbmcpIHt9XG59XG5cbi8qKlxuICogQ2xvdWQgdHJhaWwgYWxsb3dzIHlvdSB0byBsb2cgZXZlbnRzIHRoYXQgaGFwcGVuIGluIHlvdXIgQVdTIGFjY291bnRcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqIGltcG9ydCB7IENsb3VkVHJhaWwgfSBmcm9tICdAYXdzLWNkay9hd3MtY2xvdWR0cmFpbCdcbiAqXG4gKiBjb25zdCBjbG91ZFRyYWlsID0gbmV3IENsb3VkVHJhaWwodGhpcywgJ015VHJhaWwnKTtcbiAqXG4gKiBOT1RFIHRoZSBhYm92ZSBleGFtcGxlIGNyZWF0ZXMgYW4gVU5FTkNSWVBURUQgYnVja2V0IGJ5IGRlZmF1bHQsXG4gKiBJZiB5b3UgYXJlIHJlcXVpcmVkIHRvIHVzZSBhbiBFbmNyeXB0ZWQgYnVja2V0IHlvdSBjYW4gc3VwcGx5IGEgcHJlY29uZmlndXJlZCBidWNrZXRcbiAqIHZpYSBUcmFpbFByb3BzXG4gKlxuICovXG5leHBvcnQgY2xhc3MgVHJhaWwgZXh0ZW5kcyBSZXNvdXJjZSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBldmVudCBydWxlIGZvciB3aGVuIGFuIGV2ZW50IGlzIHJlY29yZGVkIGJ5IGFueSBUcmFpbCBpbiB0aGUgYWNjb3VudC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBldmVudCBkb2Vzbid0IG5lY2Vzc2FyaWx5IGhhdmUgdG8gY29tZSBmcm9tIHRoaXMgVHJhaWwsIGl0IGNhblxuICAgKiBiZSBjYXB0dXJlZCBmcm9tIGFueSBvbmUuXG4gICAqXG4gICAqIEJlIHN1cmUgdG8gZmlsdGVyIHRoZSBldmVudCBmdXJ0aGVyIGRvd24gdXNpbmcgYW4gZXZlbnQgcGF0dGVybi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgb25FdmVudChzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBvcHRpb25zOiBldmVudHMuT25FdmVudE9wdGlvbnMgPSB7fSk6IGV2ZW50cy5SdWxlIHtcbiAgICBjb25zdCBydWxlID0gbmV3IGV2ZW50cy5SdWxlKHNjb3BlLCBpZCwgb3B0aW9ucyk7XG4gICAgcnVsZS5hZGRUYXJnZXQob3B0aW9ucy50YXJnZXQpO1xuICAgIHJ1bGUuYWRkRXZlbnRQYXR0ZXJuKHtcbiAgICAgIGRldGFpbFR5cGU6IFsnQVdTIEFQSSBDYWxsIHZpYSBDbG91ZFRyYWlsJ10sXG4gICAgfSk7XG4gICAgcmV0dXJuIHJ1bGU7XG4gIH1cblxuICAvKipcbiAgICogQVJOIG9mIHRoZSBDbG91ZFRyYWlsIHRyYWlsXG4gICAqIGkuZS4gYXJuOmF3czpjbG91ZHRyYWlsOnVzLWVhc3QtMjoxMjM0NTY3ODkwMTI6dHJhaWwvbXlDbG91ZFRyYWlsXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSB0cmFpbEFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBUk4gb2YgdGhlIEFtYXpvbiBTTlMgdG9waWMgdGhhdCdzIGFzc29jaWF0ZWQgd2l0aCB0aGUgQ2xvdWRUcmFpbCB0cmFpbCxcbiAgICogaS5lLiBhcm46YXdzOnNuczp1cy1lYXN0LTI6MTIzNDU2Nzg5MDEyOm15U05TVG9waWNcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHRyYWlsU25zVG9waWNBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIENsb3VkV2F0Y2ggbG9nIGdyb3VwIHRvIHdoaWNoIENsb3VkVHJhaWwgZXZlbnRzIGFyZSBzZW50LlxuICAgKiBgdW5kZWZpbmVkYCBpZiBgc2VuZFRvQ2xvdWRXYXRjaExvZ3NgIHByb3BlcnR5IGlzIGZhbHNlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxvZ0dyb3VwPzogbG9ncy5JTG9nR3JvdXA7XG5cbiAgcHJpdmF0ZSBzM2J1Y2tldDogczMuSUJ1Y2tldDtcbiAgcHJpdmF0ZSBtYW5hZ2VtZW50RXZlbnRzOiBSZWFkV3JpdGVUeXBlIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIGV2ZW50U2VsZWN0b3JzOiBFdmVudFNlbGVjdG9yW10gPSBbXTtcbiAgcHJpdmF0ZSB0b3BpYzogc25zLklUb3BpYyB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBpbnNpZ2h0VHlwZVZhbHVlczogSW5zaWdodFNlbGVjdG9yW10gfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFRyYWlsUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy50cmFpbE5hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBjbG91ZFRyYWlsUHJpbmNpcGFsID0gbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdjbG91ZHRyYWlsLmFtYXpvbmF3cy5jb20nKTtcblxuICAgIHRoaXMuczNidWNrZXQgPSBwcm9wcy5idWNrZXQgfHwgbmV3IHMzLkJ1Y2tldCh0aGlzLCAnUzMnLCB7IGVuY3J5cHRpb246IHMzLkJ1Y2tldEVuY3J5cHRpb24uVU5FTkNSWVBURUQsIGVuZm9yY2VTU0w6IHRydWUgfSk7XG5cbiAgICB0aGlzLnMzYnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbdGhpcy5zM2J1Y2tldC5idWNrZXRBcm5dLFxuICAgICAgYWN0aW9uczogWydzMzpHZXRCdWNrZXRBY2wnXSxcbiAgICAgIHByaW5jaXBhbHM6IFtjbG91ZFRyYWlsUHJpbmNpcGFsXSxcbiAgICB9KSk7XG5cbiAgICB0aGlzLnMzYnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgcmVzb3VyY2VzOiBbdGhpcy5zM2J1Y2tldC5hcm5Gb3JPYmplY3RzKFxuICAgICAgICBgJHtwcm9wcy5zM0tleVByZWZpeCA/IGAke3Byb3BzLnMzS2V5UHJlZml4fS9gIDogJyd9QVdTTG9ncy8ke1N0YWNrLm9mKHRoaXMpLmFjY291bnR9LypgLFxuICAgICAgKV0sXG4gICAgICBhY3Rpb25zOiBbJ3MzOlB1dE9iamVjdCddLFxuICAgICAgcHJpbmNpcGFsczogW2Nsb3VkVHJhaWxQcmluY2lwYWxdLFxuICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICBTdHJpbmdFcXVhbHM6IHsgJ3MzOngtYW16LWFjbCc6ICdidWNrZXQtb3duZXItZnVsbC1jb250cm9sJyB9LFxuICAgICAgfSxcbiAgICB9KSk7XG5cbiAgICB0aGlzLnRvcGljID0gcHJvcHMuc25zVG9waWM7XG4gICAgaWYgKHRoaXMudG9waWMpIHtcbiAgICAgIHRoaXMudG9waWMuZ3JhbnRQdWJsaXNoKGNsb3VkVHJhaWxQcmluY2lwYWwpO1xuICAgIH1cblxuICAgIGxldCBsb2dzUm9sZTogaWFtLklSb2xlIHwgdW5kZWZpbmVkO1xuXG4gICAgaWYgKHByb3BzLnNlbmRUb0Nsb3VkV2F0Y2hMb2dzKSB7XG4gICAgICBpZiAocHJvcHMuY2xvdWRXYXRjaExvZ0dyb3VwKSB7XG4gICAgICAgIHRoaXMubG9nR3JvdXAgPSBwcm9wcy5jbG91ZFdhdGNoTG9nR3JvdXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAodGhpcywgJ0xvZ0dyb3VwJywge1xuICAgICAgICAgIHJldGVudGlvbjogcHJvcHMuY2xvdWRXYXRjaExvZ3NSZXRlbnRpb24gPz8gbG9ncy5SZXRlbnRpb25EYXlzLk9ORV9ZRUFSLFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgbG9nc1JvbGUgPSBuZXcgaWFtLlJvbGUodGhpcywgJ0xvZ3NSb2xlJywgeyBhc3N1bWVkQnk6IGNsb3VkVHJhaWxQcmluY2lwYWwgfSk7XG5cbiAgICAgIGxvZ3NSb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogWydsb2dzOlB1dExvZ0V2ZW50cycsICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbSddLFxuICAgICAgICByZXNvdXJjZXM6IFt0aGlzLmxvZ0dyb3VwLmxvZ0dyb3VwQXJuXSxcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICB0aGlzLm1hbmFnZW1lbnRFdmVudHMgPSBwcm9wcy5tYW5hZ2VtZW50RXZlbnRzO1xuICAgIGlmICh0aGlzLm1hbmFnZW1lbnRFdmVudHMgJiYgdGhpcy5tYW5hZ2VtZW50RXZlbnRzICE9PSBSZWFkV3JpdGVUeXBlLk5PTkUpIHtcbiAgICAgIHRoaXMuZXZlbnRTZWxlY3RvcnMucHVzaCh7XG4gICAgICAgIGluY2x1ZGVNYW5hZ2VtZW50RXZlbnRzOiB0cnVlLFxuICAgICAgICByZWFkV3JpdGVUeXBlOiBwcm9wcy5tYW5hZ2VtZW50RXZlbnRzLFxuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMubm9kZS5hZGRWYWxpZGF0aW9uKHsgdmFsaWRhdGU6ICgpID0+IHRoaXMudmFsaWRhdGVFdmVudFNlbGVjdG9ycygpIH0pO1xuXG4gICAgaWYgKHByb3BzLmttc0tleSAmJiBwcm9wcy5lbmNyeXB0aW9uS2V5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JvdGgga21zS2V5IGFuZCBlbmNyeXB0aW9uS2V5IG11c3Qgbm90IGJlIHNwZWNpZmllZC4gVXNlIG9ubHkgZW5jcnlwdGlvbktleScpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5pbnNpZ2h0VHlwZXMpIHtcbiAgICAgIHRoaXMuaW5zaWdodFR5cGVWYWx1ZXMgPSBwcm9wcy5pbnNpZ2h0VHlwZXMubWFwKGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgcmV0dXJuIHsgaW5zaWdodFR5cGU6IHQudmFsdWUgfTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFRPRE86IG5vdCBhbGwgcmVnaW9ucyBzdXBwb3J0IHZhbGlkYXRpb24uIFVzZSBzZXJ2aWNlIGNvbmZpZ3VyYXRpb24gZGF0YSB0byBmYWlsIGdyYWNlZnVsbHlcbiAgICBjb25zdCB0cmFpbCA9IG5ldyBDZm5UcmFpbCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBpc0xvZ2dpbmc6IHRydWUsXG4gICAgICBlbmFibGVMb2dGaWxlVmFsaWRhdGlvbjogcHJvcHMuZW5hYmxlRmlsZVZhbGlkYXRpb24gPT0gbnVsbCA/IHRydWUgOiBwcm9wcy5lbmFibGVGaWxlVmFsaWRhdGlvbixcbiAgICAgIGlzTXVsdGlSZWdpb25UcmFpbDogcHJvcHMuaXNNdWx0aVJlZ2lvblRyYWlsID09IG51bGwgPyB0cnVlIDogcHJvcHMuaXNNdWx0aVJlZ2lvblRyYWlsLFxuICAgICAgaW5jbHVkZUdsb2JhbFNlcnZpY2VFdmVudHM6IHByb3BzLmluY2x1ZGVHbG9iYWxTZXJ2aWNlRXZlbnRzID09IG51bGwgPyB0cnVlIDogcHJvcHMuaW5jbHVkZUdsb2JhbFNlcnZpY2VFdmVudHMsXG4gICAgICB0cmFpbE5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgICAga21zS2V5SWQ6IHByb3BzLmVuY3J5cHRpb25LZXk/LmtleUFybiA/PyBwcm9wcy5rbXNLZXk/LmtleUFybixcbiAgICAgIHMzQnVja2V0TmFtZTogdGhpcy5zM2J1Y2tldC5idWNrZXROYW1lLFxuICAgICAgczNLZXlQcmVmaXg6IHByb3BzLnMzS2V5UHJlZml4LFxuICAgICAgY2xvdWRXYXRjaExvZ3NMb2dHcm91cEFybjogdGhpcy5sb2dHcm91cD8ubG9nR3JvdXBBcm4sXG4gICAgICBjbG91ZFdhdGNoTG9nc1JvbGVBcm46IGxvZ3NSb2xlPy5yb2xlQXJuLFxuICAgICAgc25zVG9waWNOYW1lOiB0aGlzLnRvcGljPy50b3BpY05hbWUsXG4gICAgICBldmVudFNlbGVjdG9yczogdGhpcy5ldmVudFNlbGVjdG9ycyxcbiAgICAgIGlzT3JnYW5pemF0aW9uVHJhaWw6IHByb3BzLmlzT3JnYW5pemF0aW9uVHJhaWwsXG4gICAgICBpbnNpZ2h0U2VsZWN0b3JzOiB0aGlzLmluc2lnaHRUeXBlVmFsdWVzLFxuICAgIH0pO1xuXG4gICAgdGhpcy50cmFpbEFybiA9IHRoaXMuZ2V0UmVzb3VyY2VBcm5BdHRyaWJ1dGUodHJhaWwuYXR0ckFybiwge1xuICAgICAgc2VydmljZTogJ2Nsb3VkdHJhaWwnLFxuICAgICAgcmVzb3VyY2U6ICd0cmFpbCcsXG4gICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgIH0pO1xuICAgIHRoaXMudHJhaWxTbnNUb3BpY0FybiA9IHRyYWlsLmF0dHJTbnNUb3BpY0FybjtcblxuICAgIC8vIEFkZCBhIGRlcGVuZGVuY3kgb24gdGhlIGJ1Y2tldCBwb2xpY3kgYmVpbmcgdXBkYXRlZCwgQ2xvdWRUcmFpbCB3aWxsIHRlc3QgdGhpcyB1cG9uIGNyZWF0aW9uLlxuICAgIGlmICh0aGlzLnMzYnVja2V0LnBvbGljeSkge1xuICAgICAgdHJhaWwubm9kZS5hZGREZXBlbmRlbmN5KHRoaXMuczNidWNrZXQucG9saWN5KTtcbiAgICB9XG5cbiAgICAvLyBJZiBwcm9wcy5zZW5kVG9DbG91ZFdhdGNoTG9ncyBpcyBzZXQgdG8gdHJ1ZSB0aGVuIHRoZSB0cmFpbCBuZWVkcyB0byBkZXBlbmQgb24gdGhlIGNyZWF0ZWQgbG9nc1JvbGVcbiAgICAvLyBzbyB0aGF0IGl0IGNhbiBjcmVhdGUgdGhlIGxvZyBzdHJlYW0gZm9yIHRoZSBsb2cgZ3JvdXAuIFRoaXMgZW5zdXJlcyB0aGUgbG9nc1JvbGUgaXMgY3JlYXRlZCBhbmQgcHJvcGFnYXRlZFxuICAgIC8vIGJlZm9yZSB0aGUgdHJhaWwgdHJpZXMgdG8gY3JlYXRlIHRoZSBsb2cgc3RyZWFtLlxuICAgIGlmIChsb2dzUm9sZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0cmFpbC5ub2RlLmFkZERlcGVuZGVuY3kobG9nc1JvbGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIGFuIGV2ZW50IG9jY3VycyBpbiB5b3VyIGFjY291bnQsIENsb3VkVHJhaWwgZXZhbHVhdGVzIHdoZXRoZXIgdGhlIGV2ZW50IG1hdGNoZXMgdGhlIHNldHRpbmdzIGZvciB5b3VyIHRyYWlscy5cbiAgICogT25seSBldmVudHMgdGhhdCBtYXRjaCB5b3VyIHRyYWlsIHNldHRpbmdzIGFyZSBkZWxpdmVyZWQgdG8geW91ciBBbWF6b24gUzMgYnVja2V0IGFuZCBBbWF6b24gQ2xvdWRXYXRjaCBMb2dzIGxvZyBncm91cC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYWRkcyBhbiBFdmVudCBTZWxlY3RvciBmb3IgZmlsdGVyaW5nIGV2ZW50cyB0aGF0IG1hdGNoIGVpdGhlciBTMyBvciBMYW1iZGEgZnVuY3Rpb24gb3BlcmF0aW9ucy5cbiAgICpcbiAgICogRGF0YSBldmVudHM6IFRoZXNlIGV2ZW50cyBwcm92aWRlIGluc2lnaHQgaW50byB0aGUgcmVzb3VyY2Ugb3BlcmF0aW9ucyBwZXJmb3JtZWQgb24gb3Igd2l0aGluIGEgcmVzb3VyY2UuXG4gICAqIFRoZXNlIGFyZSBhbHNvIGtub3duIGFzIGRhdGEgcGxhbmUgb3BlcmF0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIGRhdGFSZXNvdXJjZVZhbHVlcyB0aGUgbGlzdCBvZiBkYXRhIHJlc291cmNlIEFSTnMgdG8gaW5jbHVkZSBpbiBsb2dnaW5nIChtYXhpbXVtIDI1MCBlbnRyaWVzKS5cbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIG9wdGlvbnMgdG8gY29uZmlndXJlIGxvZ2dpbmcgb2YgbWFuYWdlbWVudCBhbmQgZGF0YSBldmVudHMuXG4gICAqL1xuICBwdWJsaWMgYWRkRXZlbnRTZWxlY3RvcihkYXRhUmVzb3VyY2VUeXBlOiBEYXRhUmVzb3VyY2VUeXBlLCBkYXRhUmVzb3VyY2VWYWx1ZXM6IHN0cmluZ1tdLCBvcHRpb25zOiBBZGRFdmVudFNlbGVjdG9yT3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKGRhdGFSZXNvdXJjZVZhbHVlcy5sZW5ndGggPiAyNTApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQSBtYXhpbXVtIG9mIDI1MCBkYXRhIGVsZW1lbnRzIGNhbiBiZSBpbiBvbmUgZXZlbnQgc2VsZWN0b3InKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ldmVudFNlbGVjdG9ycy5sZW5ndGggPiA1KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0EgbWF4aW11bSBvZiA1IGV2ZW50IHNlbGVjdG9ycyBhcmUgc3VwcG9ydGVkIHBlciB0cmFpbC4nKTtcbiAgICB9XG5cbiAgICBsZXQgaW5jbHVkZUFsbE1hbmFnZW1lbnRFdmVudHM7XG4gICAgaWYgKHRoaXMubWFuYWdlbWVudEV2ZW50cyA9PT0gUmVhZFdyaXRlVHlwZS5OT05FKSB7XG4gICAgICBpbmNsdWRlQWxsTWFuYWdlbWVudEV2ZW50cyA9IGZhbHNlO1xuICAgIH1cblxuICAgIHRoaXMuZXZlbnRTZWxlY3RvcnMucHVzaCh7XG4gICAgICBkYXRhUmVzb3VyY2VzOiBbe1xuICAgICAgICB0eXBlOiBkYXRhUmVzb3VyY2VUeXBlLFxuICAgICAgICB2YWx1ZXM6IGRhdGFSZXNvdXJjZVZhbHVlcyxcbiAgICAgIH1dLFxuICAgICAgaW5jbHVkZU1hbmFnZW1lbnRFdmVudHM6IG9wdGlvbnMuaW5jbHVkZU1hbmFnZW1lbnRFdmVudHMgPz8gaW5jbHVkZUFsbE1hbmFnZW1lbnRFdmVudHMsXG4gICAgICBleGNsdWRlTWFuYWdlbWVudEV2ZW50U291cmNlczogb3B0aW9ucy5leGNsdWRlTWFuYWdlbWVudEV2ZW50U291cmNlcyxcbiAgICAgIHJlYWRXcml0ZVR5cGU6IG9wdGlvbnMucmVhZFdyaXRlVHlwZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIGFuIGV2ZW50IG9jY3VycyBpbiB5b3VyIGFjY291bnQsIENsb3VkVHJhaWwgZXZhbHVhdGVzIHdoZXRoZXIgdGhlIGV2ZW50IG1hdGNoZXMgdGhlIHNldHRpbmdzIGZvciB5b3VyIHRyYWlscy5cbiAgICogT25seSBldmVudHMgdGhhdCBtYXRjaCB5b3VyIHRyYWlsIHNldHRpbmdzIGFyZSBkZWxpdmVyZWQgdG8geW91ciBBbWF6b24gUzMgYnVja2V0IGFuZCBBbWF6b24gQ2xvdWRXYXRjaCBMb2dzIGxvZyBncm91cC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgYWRkcyBhIExhbWJkYSBEYXRhIEV2ZW50IFNlbGVjdG9yIGZvciBmaWx0ZXJpbmcgZXZlbnRzIHRoYXQgbWF0Y2ggTGFtYmRhIGZ1bmN0aW9uIG9wZXJhdGlvbnMuXG4gICAqXG4gICAqIERhdGEgZXZlbnRzOiBUaGVzZSBldmVudHMgcHJvdmlkZSBpbnNpZ2h0IGludG8gdGhlIHJlc291cmNlIG9wZXJhdGlvbnMgcGVyZm9ybWVkIG9uIG9yIHdpdGhpbiBhIHJlc291cmNlLlxuICAgKiBUaGVzZSBhcmUgYWxzbyBrbm93biBhcyBkYXRhIHBsYW5lIG9wZXJhdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBoYW5kbGVycyB0aGUgbGlzdCBvZiBsYW1iZGEgZnVuY3Rpb24gaGFuZGxlcnMgd2hvc2UgZGF0YSBldmVudHMgc2hvdWxkIGJlIGxvZ2dlZCAobWF4aW11bSAyNTAgZW50cmllcykuXG4gICAqIEBwYXJhbSBvcHRpb25zIHRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSBsb2dnaW5nIG9mIG1hbmFnZW1lbnQgYW5kIGRhdGEgZXZlbnRzLlxuICAgKi9cbiAgcHVibGljIGFkZExhbWJkYUV2ZW50U2VsZWN0b3IoaGFuZGxlcnM6IGxhbWJkYS5JRnVuY3Rpb25bXSwgb3B0aW9uczogQWRkRXZlbnRTZWxlY3Rvck9wdGlvbnMgPSB7fSkge1xuICAgIGlmIChoYW5kbGVycy5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG4gICAgY29uc3QgZGF0YVJlc291cmNlVmFsdWVzID0gaGFuZGxlcnMubWFwKChoKSA9PiBoLmZ1bmN0aW9uQXJuKTtcbiAgICByZXR1cm4gdGhpcy5hZGRFdmVudFNlbGVjdG9yKERhdGFSZXNvdXJjZVR5cGUuTEFNQkRBX0ZVTkNUSU9OLCBkYXRhUmVzb3VyY2VWYWx1ZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvZyBhbGwgTGFtYmRhIGRhdGEgZXZlbnRzIGZvciBhbGwgbGFtYmRhIGZ1bmN0aW9ucyB0aGUgYWNjb3VudC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYXdzY2xvdWR0cmFpbC9sYXRlc3QvdXNlcmd1aWRlL2xvZ2dpbmctZGF0YS1ldmVudHMtd2l0aC1jbG91ZHRyYWlsLmh0bWxcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHB1YmxpYyBsb2dBbGxMYW1iZGFEYXRhRXZlbnRzKG9wdGlvbnM6IEFkZEV2ZW50U2VsZWN0b3JPcHRpb25zID0ge30pIHtcbiAgICByZXR1cm4gdGhpcy5hZGRFdmVudFNlbGVjdG9yKERhdGFSZXNvdXJjZVR5cGUuTEFNQkRBX0ZVTkNUSU9OLCBbYGFybjoke3RoaXMuc3RhY2sucGFydGl0aW9ufTpsYW1iZGFgXSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiBhbiBldmVudCBvY2N1cnMgaW4geW91ciBhY2NvdW50LCBDbG91ZFRyYWlsIGV2YWx1YXRlcyB3aGV0aGVyIHRoZSBldmVudCBtYXRjaGVzIHRoZSBzZXR0aW5ncyBmb3IgeW91ciB0cmFpbHMuXG4gICAqIE9ubHkgZXZlbnRzIHRoYXQgbWF0Y2ggeW91ciB0cmFpbCBzZXR0aW5ncyBhcmUgZGVsaXZlcmVkIHRvIHlvdXIgQW1hem9uIFMzIGJ1Y2tldCBhbmQgQW1hem9uIENsb3VkV2F0Y2ggTG9ncyBsb2cgZ3JvdXAuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFkZHMgYW4gUzMgRGF0YSBFdmVudCBTZWxlY3RvciBmb3IgZmlsdGVyaW5nIGV2ZW50cyB0aGF0IG1hdGNoIFMzIG9wZXJhdGlvbnMuXG4gICAqXG4gICAqIERhdGEgZXZlbnRzOiBUaGVzZSBldmVudHMgcHJvdmlkZSBpbnNpZ2h0IGludG8gdGhlIHJlc291cmNlIG9wZXJhdGlvbnMgcGVyZm9ybWVkIG9uIG9yIHdpdGhpbiBhIHJlc291cmNlLlxuICAgKiBUaGVzZSBhcmUgYWxzbyBrbm93biBhcyBkYXRhIHBsYW5lIG9wZXJhdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBzM1NlbGVjdG9yIHRoZSBsaXN0IG9mIFMzIGJ1Y2tldCB3aXRoIG9wdGlvbmFsIHByZWZpeCB0byBpbmNsdWRlIGluIGxvZ2dpbmcgKG1heGltdW0gMjUwIGVudHJpZXMpLlxuICAgKiBAcGFyYW0gb3B0aW9ucyB0aGUgb3B0aW9ucyB0byBjb25maWd1cmUgbG9nZ2luZyBvZiBtYW5hZ2VtZW50IGFuZCBkYXRhIGV2ZW50cy5cbiAgICovXG4gIHB1YmxpYyBhZGRTM0V2ZW50U2VsZWN0b3IoczNTZWxlY3RvcjogUzNFdmVudFNlbGVjdG9yW10sIG9wdGlvbnM6IEFkZEV2ZW50U2VsZWN0b3JPcHRpb25zID0ge30pIHtcbiAgICBpZiAoczNTZWxlY3Rvci5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XG4gICAgY29uc3QgZGF0YVJlc291cmNlVmFsdWVzID0gczNTZWxlY3Rvci5tYXAoKHNlbCkgPT4gYCR7c2VsLmJ1Y2tldC5idWNrZXRBcm59LyR7c2VsLm9iamVjdFByZWZpeCA/PyAnJ31gKTtcbiAgICByZXR1cm4gdGhpcy5hZGRFdmVudFNlbGVjdG9yKERhdGFSZXNvdXJjZVR5cGUuUzNfT0JKRUNULCBkYXRhUmVzb3VyY2VWYWx1ZXMsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvZyBhbGwgUzMgZGF0YSBldmVudHMgZm9yIGFsbCBvYmplY3RzIGZvciBhbGwgYnVja2V0cyBpbiB0aGUgYWNjb3VudC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vYXdzY2xvdWR0cmFpbC9sYXRlc3QvdXNlcmd1aWRlL2xvZ2dpbmctZGF0YS1ldmVudHMtd2l0aC1jbG91ZHRyYWlsLmh0bWxcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHB1YmxpYyBsb2dBbGxTM0RhdGFFdmVudHMob3B0aW9uczogQWRkRXZlbnRTZWxlY3Rvck9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLmFkZEV2ZW50U2VsZWN0b3IoRGF0YVJlc291cmNlVHlwZS5TM19PQkpFQ1QsIFtgYXJuOiR7dGhpcy5zdGFjay5wYXJ0aXRpb259OnMzOjo6YF0sIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhbiBldmVudCBydWxlIGZvciB3aGVuIGFuIGV2ZW50IGlzIHJlY29yZGVkIGJ5IGFueSBUcmFpbCBpbiB0aGUgYWNjb3VudC5cbiAgICpcbiAgICogTm90ZSB0aGF0IHRoZSBldmVudCBkb2Vzbid0IG5lY2Vzc2FyaWx5IGhhdmUgdG8gY29tZSBmcm9tIHRoaXMgVHJhaWwsIGl0IGNhblxuICAgKiBiZSBjYXB0dXJlZCBmcm9tIGFueSBvbmUuXG4gICAqXG4gICAqIEJlIHN1cmUgdG8gZmlsdGVyIHRoZSBldmVudCBmdXJ0aGVyIGRvd24gdXNpbmcgYW4gZXZlbnQgcGF0dGVybi5cbiAgICpcbiAgICogQGRlcHJlY2F0ZWQgLSB1c2UgVHJhaWwub25FdmVudCgpXG4gICAqL1xuICBwdWJsaWMgb25DbG91ZFRyYWlsRXZlbnQoaWQ6IHN0cmluZywgb3B0aW9uczogZXZlbnRzLk9uRXZlbnRPcHRpb25zID0ge30pOiBldmVudHMuUnVsZSB7XG4gICAgcmV0dXJuIFRyYWlsLm9uRXZlbnQodGhpcywgaWQsIG9wdGlvbnMpO1xuICB9XG5cbiAgcHJpdmF0ZSB2YWxpZGF0ZUV2ZW50U2VsZWN0b3JzKCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBlcnJvcnM6IHN0cmluZ1tdID0gW107XG4gICAgLy8gRW5zdXJlIHRoYXQgdGhlcmUgaXMgYXQgbGVhc3Qgb25lIGV2ZW50IHNlbGVjdG9yIHdoZW4gbWFuYWdlbWVudCBldmVudHMgYXJlIHNldCB0byBOb25lXG4gICAgaWYgKHRoaXMubWFuYWdlbWVudEV2ZW50cyA9PT0gUmVhZFdyaXRlVHlwZS5OT05FICYmIHRoaXMuZXZlbnRTZWxlY3RvcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBlcnJvcnMucHVzaCgnQXQgbGVhc3Qgb25lIGV2ZW50IHNlbGVjdG9yIG11c3QgYmUgYWRkZWQgd2hlbiBtYW5hZ2VtZW50IGV2ZW50IHJlY29yZGluZyBpcyBzZXQgdG8gTm9uZScpO1xuICAgIH1cbiAgICByZXR1cm4gZXJyb3JzO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgYWRkaW5nIGFuIGV2ZW50IHNlbGVjdG9yLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFkZEV2ZW50U2VsZWN0b3JPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNwZWNpZmllcyB3aGV0aGVyIHRvIGxvZyByZWFkLW9ubHkgZXZlbnRzLCB3cml0ZS1vbmx5IGV2ZW50cywgb3IgYWxsIGV2ZW50cy5cbiAgICpcbiAgICogQGRlZmF1bHQgUmVhZFdyaXRlVHlwZS5BbGxcbiAgICovXG4gIHJlYWRvbmx5IHJlYWRXcml0ZVR5cGU/OiBSZWFkV3JpdGVUeXBlO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0aGUgZXZlbnQgc2VsZWN0b3IgaW5jbHVkZXMgbWFuYWdlbWVudCBldmVudHMgZm9yIHRoZSB0cmFpbC5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgcmVhZG9ubHkgaW5jbHVkZU1hbmFnZW1lbnRFdmVudHM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBsaXN0IG9mIHNlcnZpY2UgZXZlbnQgc291cmNlcyBmcm9tIHdoaWNoIHlvdSBkbyBub3Qgd2FudCBtYW5hZ2VtZW50IGV2ZW50cyB0byBiZSBsb2dnZWQgb24geW91ciB0cmFpbC5cbiAgICpcbiAgICogQGRlZmF1bHQgW11cbiAgICovXG4gIHJlYWRvbmx5IGV4Y2x1ZGVNYW5hZ2VtZW50RXZlbnRTb3VyY2VzPzogTWFuYWdlbWVudEV2ZW50U291cmNlc1tdO1xufVxuXG4vKipcbiAqIFR5cGVzIG9mIG1hbmFnZW1lbnQgZXZlbnQgc291cmNlcyB0aGF0IGNhbiBiZSBleGNsdWRlZFxuICovXG5leHBvcnQgZW51bSBNYW5hZ2VtZW50RXZlbnRTb3VyY2VzIHtcbiAgLyoqXG4gICAqIEFXUyBLZXkgTWFuYWdlbWVudCBTZXJ2aWNlIChBV1MgS01TKSBldmVudHNcbiAgICovXG4gIEtNUyA9ICdrbXMuYW1hem9uYXdzLmNvbScsXG5cbiAgLyoqXG4gICAqIERhdGEgQVBJIGV2ZW50c1xuICAgKi9cbiAgUkRTX0RBVEFfQVBJID0gJ3Jkc2RhdGEuYW1hem9uYXdzLmNvbScsXG59XG5cbi8qKlxuICogU2VsZWN0aW5nIGFuIFMzIGJ1Y2tldCBhbmQgYW4gb3B0aW9uYWwgcHJlZml4IHRvIGJlIGxvZ2dlZCBmb3IgZGF0YSBldmVudHMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUzNFdmVudFNlbGVjdG9yIHtcbiAgLyoqIFMzIGJ1Y2tldCAqL1xuICByZWFkb25seSBidWNrZXQ6IHMzLklCdWNrZXQ7XG5cbiAgLyoqXG4gICAqIERhdGEgZXZlbnRzIGZvciBvYmplY3RzIHdob3NlIGtleSBtYXRjaGVzIHRoaXMgcHJlZml4IHdpbGwgYmUgbG9nZ2VkLlxuICAgKiBAZGVmYXVsdCAtIGFsbCBvYmplY3RzXG4gICAqL1xuICByZWFkb25seSBvYmplY3RQcmVmaXg/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUmVzb3VyY2UgdHlwZSBmb3IgYSBkYXRhIGV2ZW50XG4gKi9cbmV4cG9ydCBlbnVtIERhdGFSZXNvdXJjZVR5cGUge1xuICAvKipcbiAgICogRGF0YSByZXNvdXJjZSB0eXBlIGZvciBMYW1iZGEgZnVuY3Rpb25cbiAgICovXG4gIExBTUJEQV9GVU5DVElPTiA9ICdBV1M6OkxhbWJkYTo6RnVuY3Rpb24nLFxuXG4gIC8qKlxuICAgKiBEYXRhIHJlc291cmNlIHR5cGUgZm9yIFMzIG9iamVjdHNcbiAgICovXG4gIFMzX09CSkVDVCA9ICdBV1M6OlMzOjpPYmplY3QnLFxufVxuXG5pbnRlcmZhY2UgRXZlbnRTZWxlY3RvciB7XG4gIHJlYWRvbmx5IGluY2x1ZGVNYW5hZ2VtZW50RXZlbnRzPzogYm9vbGVhbjtcbiAgcmVhZG9ubHkgZXhjbHVkZU1hbmFnZW1lbnRFdmVudFNvdXJjZXM/OiBzdHJpbmdbXTtcbiAgcmVhZG9ubHkgcmVhZFdyaXRlVHlwZT86IFJlYWRXcml0ZVR5cGU7XG4gIHJlYWRvbmx5IGRhdGFSZXNvdXJjZXM/OiBFdmVudFNlbGVjdG9yRGF0YVtdO1xufVxuXG5pbnRlcmZhY2UgRXZlbnRTZWxlY3RvckRhdGEge1xuICByZWFkb25seSB0eXBlOiBzdHJpbmc7XG4gIHJlYWRvbmx5IHZhbHVlczogc3RyaW5nW107XG59XG5cbmludGVyZmFjZSBJbnNpZ2h0U2VsZWN0b3Ige1xuICByZWFkb25seSBpbnNpZ2h0VHlwZT86IHN0cmluZztcbn0iXX0=