"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogGroup = exports.RetentionDays = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
const log_stream_1 = require("./log-stream");
const logs_generated_1 = require("./logs.generated");
const metric_filter_1 = require("./metric-filter");
const pattern_1 = require("./pattern");
const policy_1 = require("./policy");
const subscription_filter_1 = require("./subscription-filter");
/**
 * An CloudWatch Log Group
 */
class LogGroupBase extends core_1.Resource {
    /**
     * Create a new Log Stream for this Log Group
     *
     * @param id Unique identifier for the construct in its parent
     * @param props Properties for creating the LogStream
     */
    addStream(id, props = {}) {
        return new log_stream_1.LogStream(this, id, {
            logGroup: this,
            ...props,
        });
    }
    /**
     * Create a new Subscription Filter on this Log Group
     *
     * @param id Unique identifier for the construct in its parent
     * @param props Properties for creating the SubscriptionFilter
     */
    addSubscriptionFilter(id, props) {
        return new subscription_filter_1.SubscriptionFilter(this, id, {
            logGroup: this,
            ...props,
        });
    }
    /**
     * Create a new Metric Filter on this Log Group
     *
     * @param id Unique identifier for the construct in its parent
     * @param props Properties for creating the MetricFilter
     */
    addMetricFilter(id, props) {
        return new metric_filter_1.MetricFilter(this, id, {
            logGroup: this,
            ...props,
        });
    }
    /**
     * Extract a metric from structured log events in the LogGroup
     *
     * Creates a MetricFilter on this LogGroup that will extract the value
     * of the indicated JSON field in all records where it occurs.
     *
     * The metric will be available in CloudWatch Metrics under the
     * indicated namespace and name.
     *
     * @param jsonField JSON field to extract (example: '$.myfield')
     * @param metricNamespace Namespace to emit the metric under
     * @param metricName Name to emit the metric under
     * @returns A Metric object representing the extracted metric
     */
    extractMetric(jsonField, metricNamespace, metricName) {
        new metric_filter_1.MetricFilter(this, `${metricNamespace}_${metricName}`, {
            logGroup: this,
            metricNamespace,
            metricName,
            filterPattern: pattern_1.FilterPattern.exists(jsonField),
            metricValue: jsonField,
        });
        return new cloudwatch.Metric({ metricName, namespace: metricNamespace }).attachTo(this);
    }
    /**
     * Give permissions to create and write to streams in this log group
     */
    grantWrite(grantee) {
        return this.grant(grantee, 'logs:CreateLogStream', 'logs:PutLogEvents');
    }
    /**
     * Give permissions to read and filter events from this log group
     */
    grantRead(grantee) {
        return this.grant(grantee, 'logs:FilterLogEvents', 'logs:GetLogEvents', 'logs:GetLogGroupFields', 'logs:DescribeLogGroups', 'logs:DescribeLogStreams');
    }
    /**
     * Give the indicated permissions on this log group and all streams
     */
    grant(grantee, ...actions) {
        return iam.Grant.addToPrincipalOrResource({
            grantee,
            actions,
            // A LogGroup ARN out of CloudFormation already includes a ':*' at the end to include the log streams under the group.
            // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#w2ab1c21c10c63c43c11
            resourceArns: [this.logGroupArn],
            resource: this,
        });
    }
    /**
     * Public method to get the physical name of this log group
     * @returns Physical name of log group
     */
    logGroupPhysicalName() {
        return this.physicalName;
    }
    /**
     * Adds a statement to the resource policy associated with this log group.
     * A resource policy will be automatically created upon the first call to `addToResourcePolicy`.
     *
     * Any ARN Principals inside of the statement will be converted into AWS Account ID strings
     * because CloudWatch Logs Resource Policies do not accept ARN principals.
     *
     * @param statement The policy statement to add
     */
    addToResourcePolicy(statement) {
        if (!this.policy) {
            this.policy = new policy_1.ResourcePolicy(this, 'Policy');
        }
        this.policy.document.addStatements(statement.copy({
            principals: statement.principals.map(p => this.convertArnPrincpalToAccountId(p)),
        }));
        return { statementAdded: true, policyDependable: this.policy };
    }
    convertArnPrincpalToAccountId(principal) {
        if (principal.principalAccount) {
            // we use ArnPrincipal here because the constructor inserts the argument
            // into the template without mutating it, which means that there is no
            // ARN created by this call.
            return new iam.ArnPrincipal(principal.principalAccount);
        }
        if (principal instanceof iam.ArnPrincipal) {
            const parsedArn = core_1.Arn.split(principal.arn, core_1.ArnFormat.SLASH_RESOURCE_NAME);
            if (parsedArn.account) {
                return new iam.ArnPrincipal(parsedArn.account);
            }
        }
        return principal;
    }
}
/**
 * How long, in days, the log contents will be retained.
 */
var RetentionDays;
(function (RetentionDays) {
    /**
     * 1 day
     */
    RetentionDays[RetentionDays["ONE_DAY"] = 1] = "ONE_DAY";
    /**
     * 3 days
     */
    RetentionDays[RetentionDays["THREE_DAYS"] = 3] = "THREE_DAYS";
    /**
     * 5 days
     */
    RetentionDays[RetentionDays["FIVE_DAYS"] = 5] = "FIVE_DAYS";
    /**
     * 1 week
     */
    RetentionDays[RetentionDays["ONE_WEEK"] = 7] = "ONE_WEEK";
    /**
     * 2 weeks
     */
    RetentionDays[RetentionDays["TWO_WEEKS"] = 14] = "TWO_WEEKS";
    /**
     * 1 month
     */
    RetentionDays[RetentionDays["ONE_MONTH"] = 30] = "ONE_MONTH";
    /**
     * 2 months
     */
    RetentionDays[RetentionDays["TWO_MONTHS"] = 60] = "TWO_MONTHS";
    /**
     * 3 months
     */
    RetentionDays[RetentionDays["THREE_MONTHS"] = 90] = "THREE_MONTHS";
    /**
     * 4 months
     */
    RetentionDays[RetentionDays["FOUR_MONTHS"] = 120] = "FOUR_MONTHS";
    /**
     * 5 months
     */
    RetentionDays[RetentionDays["FIVE_MONTHS"] = 150] = "FIVE_MONTHS";
    /**
     * 6 months
     */
    RetentionDays[RetentionDays["SIX_MONTHS"] = 180] = "SIX_MONTHS";
    /**
     * 1 year
     */
    RetentionDays[RetentionDays["ONE_YEAR"] = 365] = "ONE_YEAR";
    /**
     * 13 months
     */
    RetentionDays[RetentionDays["THIRTEEN_MONTHS"] = 400] = "THIRTEEN_MONTHS";
    /**
     * 18 months
     */
    RetentionDays[RetentionDays["EIGHTEEN_MONTHS"] = 545] = "EIGHTEEN_MONTHS";
    /**
     * 2 years
     */
    RetentionDays[RetentionDays["TWO_YEARS"] = 731] = "TWO_YEARS";
    /**
     * 5 years
     */
    RetentionDays[RetentionDays["FIVE_YEARS"] = 1827] = "FIVE_YEARS";
    /**
     * 6 years
     */
    RetentionDays[RetentionDays["SIX_YEARS"] = 2192] = "SIX_YEARS";
    /**
     * 7 years
     */
    RetentionDays[RetentionDays["SEVEN_YEARS"] = 2557] = "SEVEN_YEARS";
    /**
     * 8 years
     */
    RetentionDays[RetentionDays["EIGHT_YEARS"] = 2922] = "EIGHT_YEARS";
    /**
     * 9 years
     */
    RetentionDays[RetentionDays["NINE_YEARS"] = 3288] = "NINE_YEARS";
    /**
     * 10 years
     */
    RetentionDays[RetentionDays["TEN_YEARS"] = 3653] = "TEN_YEARS";
    /**
     * Retain logs forever
     */
    RetentionDays[RetentionDays["INFINITE"] = 9999] = "INFINITE";
})(RetentionDays = exports.RetentionDays || (exports.RetentionDays = {}));
/**
 * Define a CloudWatch Log Group
 */
class LogGroup extends LogGroupBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.logGroupName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_logs_LogGroupProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LogGroup);
            }
            throw error;
        }
        let retentionInDays = props.retention;
        if (retentionInDays === undefined) {
            retentionInDays = RetentionDays.TWO_YEARS;
        }
        if (retentionInDays === Infinity || retentionInDays === RetentionDays.INFINITE) {
            retentionInDays = undefined;
        }
        if (retentionInDays !== undefined && !core_1.Token.isUnresolved(retentionInDays) && retentionInDays <= 0) {
            throw new Error(`retentionInDays must be positive, got ${retentionInDays}`);
        }
        const resource = new logs_generated_1.CfnLogGroup(this, 'Resource', {
            kmsKeyId: props.encryptionKey?.keyArn,
            logGroupName: this.physicalName,
            retentionInDays,
        });
        resource.applyRemovalPolicy(props.removalPolicy);
        this.logGroupArn = this.getResourceArnAttribute(resource.attrArn, {
            service: 'logs',
            resource: 'log-group',
            resourceName: this.physicalName,
            arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
        });
        this.logGroupName = this.getResourceNameAttribute(resource.ref);
    }
    /**
     * Import an existing LogGroup given its ARN
     */
    static fromLogGroupArn(scope, id, logGroupArn) {
        const baseLogGroupArn = logGroupArn.replace(/:\*$/, '');
        class Import extends LogGroupBase {
            constructor() {
                super(...arguments);
                this.logGroupArn = `${baseLogGroupArn}:*`;
                this.logGroupName = core_1.Stack.of(scope).splitArn(baseLogGroupArn, core_1.ArnFormat.COLON_RESOURCE_NAME).resourceName;
            }
        }
        return new Import(scope, id, {
            environmentFromArn: baseLogGroupArn,
        });
    }
    /**
     * Import an existing LogGroup given its name
     */
    static fromLogGroupName(scope, id, logGroupName) {
        const baseLogGroupName = logGroupName.replace(/:\*$/, '');
        class Import extends LogGroupBase {
            constructor() {
                super(...arguments);
                this.logGroupName = baseLogGroupName;
                this.logGroupArn = core_1.Stack.of(scope).formatArn({
                    service: 'logs',
                    resource: 'log-group',
                    arnFormat: core_1.ArnFormat.COLON_RESOURCE_NAME,
                    resourceName: baseLogGroupName + ':*',
                });
            }
        }
        return new Import(scope, id);
    }
}
exports.LogGroup = LogGroup;
_a = JSII_RTTI_SYMBOL_1;
LogGroup[_a] = { fqn: "@aws-cdk/aws-logs.LogGroup", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nLWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNEQUFzRDtBQUN0RCx3Q0FBd0M7QUFFeEMsd0NBQXNGO0FBRXRGLDZDQUF5QztBQUN6QyxxREFBK0M7QUFDL0MsbURBQStDO0FBQy9DLHVDQUEwRDtBQUMxRCxxQ0FBMEM7QUFDMUMsK0RBQXdGO0FBNkV4Rjs7R0FFRztBQUNILE1BQWUsWUFBYSxTQUFRLGVBQVE7SUFjMUM7Ozs7O09BS0c7SUFDSSxTQUFTLENBQUMsRUFBVSxFQUFFLFFBQXVCLEVBQUU7UUFDcEQsT0FBTyxJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUM3QixRQUFRLEVBQUUsSUFBSTtZQUNkLEdBQUcsS0FBSztTQUNULENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7O09BS0c7SUFDSSxxQkFBcUIsQ0FBQyxFQUFVLEVBQUUsS0FBZ0M7UUFDdkUsT0FBTyxJQUFJLHdDQUFrQixDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDdEMsUUFBUSxFQUFFLElBQUk7WUFDZCxHQUFHLEtBQUs7U0FDVCxDQUFDLENBQUM7S0FDSjtJQUVEOzs7OztPQUtHO0lBQ0ksZUFBZSxDQUFDLEVBQVUsRUFBRSxLQUEwQjtRQUMzRCxPQUFPLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ2hDLFFBQVEsRUFBRSxJQUFJO1lBQ2QsR0FBRyxLQUFLO1NBQ1QsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0ksYUFBYSxDQUFDLFNBQWlCLEVBQUUsZUFBdUIsRUFBRSxVQUFrQjtRQUNqRixJQUFJLDRCQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsZUFBZSxJQUFJLFVBQVUsRUFBRSxFQUFFO1lBQ3pELFFBQVEsRUFBRSxJQUFJO1lBQ2QsZUFBZTtZQUNmLFVBQVU7WUFDVixhQUFhLEVBQUUsdUJB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Q0FBQztTQUFBO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQzNCLGtCQUFrQixFQUFFLGVBQWU7U0FDcEMsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxZQUFvQjtRQUMvRSxNQUFNLGdCQUFnQixHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBRTFELE1BQU0sTUFBTyxTQUFRLFlBQVk7WUFBakM7O2dCQUNrQixpQkFBWSxHQUFHLGdCQUFnQixDQUFDO2dCQUNoQyxnQkFBVyxHQUFHLFlBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDO29CQUN0RCxPQUFPLEVBQUUsTUFBTTtvQkFDZixRQUFRLEVBQUUsV0FBVztvQkFDckIsU0FBUyxFQUFFLGdCQUFTLENBQUMsbUJBQW1CO29CQUN4QyxZQUFZLEVBQUUsZ0JBQWdCLEdBQUcsSUFBSTtpQkFDdEMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQztTQUFBO1FBRUQsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDOUI7O0FBbENILDRCQTJFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0IHsgQXJuLCBBcm5Gb3JtYXQsIFJlbW92YWxQb2xpY3ksIFJlc291cmNlLCBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgTG9nU3RyZWFtIH0gZnJvbSAnLi9sb2ctc3RyZWFtJztcbmltcG9ydCB7IENmbkxvZ0dyb3VwIH0gZnJvbSAnLi9sb2dzLmdlbmVyYXRlZCc7XG5pbXBvcnQgeyBNZXRyaWNGaWx0ZXIgfSBmcm9tICcuL21ldHJpYy1maWx0ZXInO1xuaW1wb3J0IHsgRmlsdGVyUGF0dGVybiwgSUZpbHRlclBhdHRlcm4gfSBmcm9tICcuL3BhdHRlcm4nO1xuaW1wb3J0IHsgUmVzb3VyY2VQb2xpY3kgfSBmcm9tICcuL3BvbGljeSc7XG5pbXBvcnQgeyBJTG9nU3Vic2NyaXB0aW9uRGVzdGluYXRpb24sIFN1YnNjcmlwdGlvbkZpbHRlciB9IGZyb20gJy4vc3Vic2NyaXB0aW9uLWZpbHRlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUxvZ0dyb3VwIGV4dGVuZHMgaWFtLklSZXNvdXJjZVdpdGhQb2xpY3kge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGlzIGxvZyBncm91cCwgd2l0aCAnOionIGFwcGVuZGVkXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGxvZ0dyb3VwQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoaXMgbG9nIGdyb3VwXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGxvZ0dyb3VwTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgTG9nIFN0cmVhbSBmb3IgdGhpcyBMb2cgR3JvdXBcbiAgICpcbiAgICogQHBhcmFtIGlkIFVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgY29uc3RydWN0IGluIGl0cyBwYXJlbnRcbiAgICogQHBhcmFtIHByb3BzIFByb3BlcnRpZXMgZm9yIGNyZWF0aW5nIHRoZSBMb2dTdHJlYW1cbiAgICovXG4gIGFkZFN0cmVhbShpZDogc3RyaW5nLCBwcm9wcz86IFN0cmVhbU9wdGlvbnMpOiBMb2dTdHJlYW07XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBTdWJzY3JpcHRpb24gRmlsdGVyIG9uIHRoaXMgTG9nIEdyb3VwXG4gICAqXG4gICAqIEBwYXJhbSBpZCBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNvbnN0cnVjdCBpbiBpdHMgcGFyZW50XG4gICAqIEBwYXJhbSBwcm9wcyBQcm9wZXJ0aWVzIGZvciBjcmVhdGluZyB0aGUgU3Vic2NyaXB0aW9uRmlsdGVyXG4gICAqL1xuICBhZGRTdWJzY3JpcHRpb25GaWx0ZXIoaWQ6IHN0cmluZywgcHJvcHM6IFN1YnNjcmlwdGlvbkZpbHRlck9wdGlvbnMpOiBTdWJzY3JpcHRpb25GaWx0ZXI7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBNZXRyaWMgRmlsdGVyIG9uIHRoaXMgTG9nIEdyb3VwXG4gICAqXG4gICAqIEBwYXJhbSBpZCBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNvbnN0cnVjdCBpbiBpdHMgcGFyZW50XG4gICAqIEBwYXJhbSBwcm9wcyBQcm9wZXJ0aWVzIGZvciBjcmVhdGluZyB0aGUgTWV0cmljRmlsdGVyXG4gICAqL1xuICBhZGRNZXRyaWNGaWx0ZXIoaWQ6IHN0cmluZywgcHJvcHM6IE1ldHJpY0ZpbHRlck9wdGlvbnMpOiBNZXRyaWNGaWx0ZXI7XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgYSBtZXRyaWMgZnJvbSBzdHJ1Y3R1cmVkIGxvZyBldmVudHMgaW4gdGhlIExvZ0dyb3VwXG4gICAqXG4gICAqIENyZWF0ZXMgYSBNZXRyaWNGaWx0ZXIgb24gdGhpcyBMb2dHcm91cCB0aGF0IHdpbGwgZXh0cmFjdCB0aGUgdmFsdWVcbiAgICogb2YgdGhlIGluZGljYXRlZCBKU09OIGZpZWxkIGluIGFsbCByZWNvcmRzIHdoZXJlIGl0IG9jY3Vycy5cbiAgICpcbiAgICogVGhlIG1ldHJpYyB3aWxsIGJlIGF2YWlsYWJsZSBpbiBDbG91ZFdhdGNoIE1ldHJpY3MgdW5kZXIgdGhlXG4gICAqIGluZGljYXRlZCBuYW1lc3BhY2UgYW5kIG5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSBqc29uRmllbGQgSlNPTiBmaWVsZCB0byBleHRyYWN0IChleGFtcGxlOiAnJC5teWZpZWxkJylcbiAgICogQHBhcmFtIG1ldHJpY05hbWVzcGFjZSBOYW1lc3BhY2UgdG8gZW1pdCB0aGUgbWV0cmljIHVuZGVyXG4gICAqIEBwYXJhbSBtZXRyaWNOYW1lIE5hbWUgdG8gZW1pdCB0aGUgbWV0cmljIHVuZGVyXG4gICAqIEByZXR1cm5zIEEgTWV0cmljIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGV4dHJhY3RlZCBtZXRyaWNcbiAgICovXG4gIGV4dHJhY3RNZXRyaWMoanNvbkZpZWxkOiBzdHJpbmcsIG1ldHJpY05hbWVzcGFjZTogc3RyaW5nLCBtZXRyaWNOYW1lOiBzdHJpbmcpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogR2l2ZSBwZXJtaXNzaW9ucyB0byB3cml0ZSB0byBjcmVhdGUgYW5kIHdyaXRlIHRvIHN0cmVhbXMgaW4gdGhpcyBsb2cgZ3JvdXBcbiAgICovXG4gIGdyYW50V3JpdGUoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdpdmUgcGVybWlzc2lvbnMgdG8gcmVhZCBmcm9tIHRoaXMgbG9nIGdyb3VwIGFuZCBzdHJlYW1zXG4gICAqL1xuICBncmFudFJlYWQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdpdmUgdGhlIGluZGljYXRlZCBwZXJtaXNzaW9ucyBvbiB0aGlzIGxvZyBncm91cCBhbmQgYWxsIHN0cmVhbXNcbiAgICovXG4gIGdyYW50KGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlLCAuLi5hY3Rpb25zOiBzdHJpbmdbXSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogUHVibGljIG1ldGhvZCB0byBnZXQgdGhlIHBoeXNpY2FsIG5hbWUgb2YgdGhpcyBsb2cgZ3JvdXBcbiAgICovXG4gIGxvZ0dyb3VwUGh5c2ljYWxOYW1lKCk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBBbiBDbG91ZFdhdGNoIExvZyBHcm91cFxuICovXG5hYnN0cmFjdCBjbGFzcyBMb2dHcm91cEJhc2UgZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElMb2dHcm91cCB7XG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoaXMgbG9nIGdyb3VwLCB3aXRoICc6KicgYXBwZW5kZWRcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBsb2dHcm91cEFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGlzIGxvZyBncm91cFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IGxvZ0dyb3VwTmFtZTogc3RyaW5nO1xuXG5cbiAgcHJpdmF0ZSBwb2xpY3k/OiBSZXNvdXJjZVBvbGljeTtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IExvZyBTdHJlYW0gZm9yIHRoaXMgTG9nIEdyb3VwXG4gICAqXG4gICAqIEBwYXJhbSBpZCBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNvbnN0cnVjdCBpbiBpdHMgcGFyZW50XG4gICAqIEBwYXJhbSBwcm9wcyBQcm9wZXJ0aWVzIGZvciBjcmVhdGluZyB0aGUgTG9nU3RyZWFtXG4gICAqL1xuICBwdWJsaWMgYWRkU3RyZWFtKGlkOiBzdHJpbmcsIHByb3BzOiBTdHJlYW1PcHRpb25zID0ge30pOiBMb2dTdHJlYW0ge1xuICAgIHJldHVybiBuZXcgTG9nU3RyZWFtKHRoaXMsIGlkLCB7XG4gICAgICBsb2dHcm91cDogdGhpcyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBTdWJzY3JpcHRpb24gRmlsdGVyIG9uIHRoaXMgTG9nIEdyb3VwXG4gICAqXG4gICAqIEBwYXJhbSBpZCBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNvbnN0cnVjdCBpbiBpdHMgcGFyZW50XG4gICAqIEBwYXJhbSBwcm9wcyBQcm9wZXJ0aWVzIGZvciBjcmVhdGluZyB0aGUgU3Vic2NyaXB0aW9uRmlsdGVyXG4gICAqL1xuICBwdWJsaWMgYWRkU3Vic2NyaXB0aW9uRmlsdGVyKGlkOiBzdHJpbmcsIHByb3BzOiBTdWJzY3JpcHRpb25GaWx0ZXJPcHRpb25zKTogU3Vic2NyaXB0aW9uRmlsdGVyIHtcbiAgICByZXR1cm4gbmV3IFN1YnNjcmlwdGlvbkZpbHRlcih0aGlzLCBpZCwge1xuICAgICAgbG9nR3JvdXA6IHRoaXMsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgTWV0cmljIEZpbHRlciBvbiB0aGlzIExvZyBHcm91cFxuICAgKlxuICAgKiBAcGFyYW0gaWQgVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBjb25zdHJ1Y3QgaW4gaXRzIHBhcmVudFxuICAgKiBAcGFyYW0gcHJvcHMgUHJvcGVydGllcyBmb3IgY3JlYXRpbmcgdGhlIE1ldHJpY0ZpbHRlclxuICAgKi9cbiAgcHVibGljIGFkZE1ldHJpY0ZpbHRlcihpZDogc3RyaW5nLCBwcm9wczogTWV0cmljRmlsdGVyT3B0aW9ucyk6IE1ldHJpY0ZpbHRlciB7XG4gICAgcmV0dXJuIG5ldyBNZXRyaWNGaWx0ZXIodGhpcywgaWQsIHtcbiAgICAgIGxvZ0dyb3VwOiB0aGlzLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRXh0cmFjdCBhIG1ldHJpYyBmcm9tIHN0cnVjdHVyZWQgbG9nIGV2ZW50cyBpbiB0aGUgTG9nR3JvdXBcbiAgICpcbiAgICogQ3JlYXRlcyBhIE1ldHJpY0ZpbHRlciBvbiB0aGlzIExvZ0dyb3VwIHRoYXQgd2lsbCBleHRyYWN0IHRoZSB2YWx1ZVxuICAgKiBvZiB0aGUgaW5kaWNhdGVkIEpTT04gZmllbGQgaW4gYWxsIHJlY29yZHMgd2hlcmUgaXQgb2NjdXJzLlxuICAgKlxuICAgKiBUaGUgbWV0cmljIHdpbGwgYmUgYXZhaWxhYmxlIGluIENsb3VkV2F0Y2ggTWV0cmljcyB1bmRlciB0aGVcbiAgICogaW5kaWNhdGVkIG5hbWVzcGFjZSBhbmQgbmFtZS5cbiAgICpcbiAgICogQHBhcmFtIGpzb25GaWVsZCBKU09OIGZpZWxkIHRvIGV4dHJhY3QgKGV4YW1wbGU6ICckLm15ZmllbGQnKVxuICAgKiBAcGFyYW0gbWV0cmljTmFtZXNwYWNlIE5hbWVzcGFjZSB0byBlbWl0IHRoZSBtZXRyaWMgdW5kZXJcbiAgICogQHBhcmFtIG1ldHJpY05hbWUgTmFtZSB0byBlbWl0IHRoZSBtZXRyaWMgdW5kZXJcbiAgICogQHJldHVybnMgQSBNZXRyaWMgb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgZXh0cmFjdGVkIG1ldHJpY1xuICAgKi9cbiAgcHVibGljIGV4dHJhY3RNZXRyaWMoanNvbkZpZWxkOiBzdHJpbmcsIG1ldHJpY05hbWVzcGFjZTogc3RyaW5nLCBtZXRyaWNOYW1lOiBzdHJpbmcpIHtcbiAgICBuZXcgTWV0cmljRmlsdGVyKHRoaXMsIGAke21ldHJpY05hbWVzcGFjZX1fJHttZXRyaWNOYW1lfWAsIHtcbiAgICAgIGxvZ0dyb3VwOiB0aGlzLFxuICAgICAgbWV0cmljTmFtZXNwYWNlLFxuICAgICAgbWV0cmljTmFtZSxcbiAgICAgIGZpbHRlclBhdHRlcm46IEZpbHRlclBhdHRlcm4uZXhpc3RzKGpzb25GaWVsZCksXG4gICAgICBtZXRyaWNWYWx1ZToganNvbkZpZWxkLFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7IG1ldHJpY05hbWUsIG5hbWVzcGFjZTogbWV0cmljTmFtZXNwYWNlIH0pLmF0dGFjaFRvKHRoaXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmUgcGVybWlzc2lvbnMgdG8gY3JlYXRlIGFuZCB3cml0ZSB0byBzdHJlYW1zIGluIHRoaXMgbG9nIGdyb3VwXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRXcml0ZShncmFudGVlOiBpYW0uSUdyYW50YWJsZSkge1xuICAgIHJldHVybiB0aGlzLmdyYW50KGdyYW50ZWUsICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsICdsb2dzOlB1dExvZ0V2ZW50cycpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmUgcGVybWlzc2lvbnMgdG8gcmVhZCBhbmQgZmlsdGVyIGV2ZW50cyBmcm9tIHRoaXMgbG9nIGdyb3VwXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRSZWFkKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JhbnQoZ3JhbnRlZSxcbiAgICAgICdsb2dzOkZpbHRlckxvZ0V2ZW50cycsXG4gICAgICAnbG9nczpHZXRMb2dFdmVudHMnLFxuICAgICAgJ2xvZ3M6R2V0TG9nR3JvdXBGaWVsZHMnLFxuICAgICAgJ2xvZ3M6RGVzY3JpYmVMb2dHcm91cHMnLFxuICAgICAgJ2xvZ3M6RGVzY3JpYmVMb2dTdHJlYW1zJyxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEdpdmUgdGhlIGluZGljYXRlZCBwZXJtaXNzaW9ucyBvbiB0aGlzIGxvZyBncm91cCBhbmQgYWxsIHN0cmVhbXNcbiAgICovXG4gIHB1YmxpYyBncmFudChncmFudGVlOiBpYW0uSUdyYW50YWJsZSwgLi4uYWN0aW9uczogc3RyaW5nW10pIHtcbiAgICByZXR1cm4gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsT3JSZXNvdXJjZSh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9ucyxcbiAgICAgIC8vIEEgTG9nR3JvdXAgQVJOIG91dCBvZiBDbG91ZEZvcm1hdGlvbiBhbHJlYWR5IGluY2x1ZGVzIGEgJzoqJyBhdCB0aGUgZW5kIHRvIGluY2x1ZGUgdGhlIGxvZyBzdHJlYW1zIHVuZGVyIHRoZSBncm91cC5cbiAgICAgIC8vIFNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcmVzb3VyY2UtbG9ncy1sb2dncm91cC5odG1sI3cyYWIxYzIxYzEwYzYzYzQzYzExXG4gICAgICByZXNvdXJjZUFybnM6IFt0aGlzLmxvZ0dyb3VwQXJuXSxcbiAgICAgIHJlc291cmNlOiB0aGlzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBtZXRob2QgdG8gZ2V0IHRoZSBwaHlzaWNhbCBuYW1lIG9mIHRoaXMgbG9nIGdyb3VwXG4gICAqIEByZXR1cm5zIFBoeXNpY2FsIG5hbWUgb2YgbG9nIGdyb3VwXG4gICAqL1xuICBwdWJsaWMgbG9nR3JvdXBQaHlzaWNhbE5hbWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5waHlzaWNhbE5hbWU7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIHN0YXRlbWVudCB0byB0aGUgcmVzb3VyY2UgcG9saWN5IGFzc29jaWF0ZWQgd2l0aCB0aGlzIGxvZyBncm91cC5cbiAgICogQSByZXNvdXJjZSBwb2xpY3kgd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGNyZWF0ZWQgdXBvbiB0aGUgZmlyc3QgY2FsbCB0byBgYWRkVG9SZXNvdXJjZVBvbGljeWAuXG4gICAqXG4gICAqIEFueSBBUk4gUHJpbmNpcGFscyBpbnNpZGUgb2YgdGhlIHN0YXRlbWVudCB3aWxsIGJlIGNvbnZlcnRlZCBpbnRvIEFXUyBBY2NvdW50IElEIHN0cmluZ3NcbiAgICogYmVjYXVzZSBDbG91ZFdhdGNoIExvZ3MgUmVzb3VyY2UgUG9saWNpZXMgZG8gbm90IGFjY2VwdCBBUk4gcHJpbmNpcGFscy5cbiAgICpcbiAgICogQHBhcmFtIHN0YXRlbWVudCBUaGUgcG9saWN5IHN0YXRlbWVudCB0byBhZGRcbiAgICovXG4gIHB1YmxpYyBhZGRUb1Jlc291cmNlUG9saWN5KHN0YXRlbWVudDogaWFtLlBvbGljeVN0YXRlbWVudCk6IGlhbS5BZGRUb1Jlc291cmNlUG9saWN5UmVzdWx0IHtcbiAgICBpZiAoIXRoaXMucG9saWN5KSB7XG4gICAgICB0aGlzLnBvbGljeSA9IG5ldyBSZXNvdXJjZVBvbGljeSh0aGlzLCAnUG9saWN5Jyk7XG4gICAgfVxuICAgIHRoaXMucG9saWN5LmRvY3VtZW50LmFkZFN0YXRlbWVudHMoc3RhdGVtZW50LmNvcHkoe1xuICAgICAgcHJpbmNpcGFsczogc3RhdGVtZW50LnByaW5jaXBhbHMubWFwKHAgPT4gdGhpcy5jb252ZXJ0QXJuUHJpbmNwYWxUb0FjY291bnRJZChwKSksXG4gICAgfSkpO1xuICAgIHJldHVybiB7IHN0YXRlbWVudEFkZGVkOiB0cnVlLCBwb2xpY3lEZXBlbmRhYmxlOiB0aGlzLnBvbGljeSB9O1xuICB9XG5cbiAgcHJpdmF0ZSBjb252ZXJ0QXJuUHJpbmNwYWxUb0FjY291bnRJZChwcmluY2lwYWw6IGlhbS5JUHJpbmNpcGFsKSB7XG4gICAgaWYgKHByaW5jaXBhbC5wcmluY2lwYWxBY2NvdW50KSB7XG4gICAgICAvLyB3ZSB1c2UgQXJuUHJpbmNpcGFsIGhlcmUgYmVjYXVzZSB0aGUgY29uc3RydWN0b3IgaW5zZXJ0cyB0aGUgYXJndW1lbnRcbiAgICAgIC8vIGludG8gdGhlIHRlbXBsYXRlIHdpdGhvdXQgbXV0YXRpbmcgaXQsIHdoaWNoIG1lYW5zIHRoYXQgdGhlcmUgaXMgbm9cbiAgICAgIC8vIEFSTiBjcmVhdGVkIGJ5IHRoaXMgY2FsbC5cbiAgICAgIHJldHVybiBuZXcgaWFtLkFyblByaW5jaXBhbChwcmluY2lwYWwucHJpbmNpcGFsQWNjb3VudCk7XG4gICAgfVxuXG4gICAgaWYgKHByaW5jaXBhbCBpbnN0YW5jZW9mIGlhbS5Bcm5QcmluY2lwYWwpIHtcbiAgICAgIGNvbnN0IHBhcnNlZEFybiA9IEFybi5zcGxpdChwcmluY2lwYWwuYXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSk7XG4gICAgICBpZiAocGFyc2VkQXJuLmFjY291bnQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBpYW0uQXJuUHJpbmNpcGFsKHBhcnNlZEFybi5hY2NvdW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcHJpbmNpcGFsO1xuICB9XG59XG5cbi8qKlxuICogSG93IGxvbmcsIGluIGRheXMsIHRoZSBsb2cgY29udGVudHMgd2lsbCBiZSByZXRhaW5lZC5cbiAqL1xuZXhwb3J0IGVudW0gUmV0ZW50aW9uRGF5cyB7XG4gIC8qKlxuICAgKiAxIGRheVxuICAgKi9cbiAgT05FX0RBWSA9IDEsXG5cbiAgLyoqXG4gICAqIDMgZGF5c1xuICAgKi9cbiAgVEhSRUVfREFZUyA9IDMsXG5cbiAgLyoqXG4gICAqIDUgZGF5c1xuICAgKi9cbiAgRklWRV9EQVlTID0gNSxcblxuICAvKipcbiAgICogMSB3ZWVrXG4gICAqL1xuICBPTkVfV0VFSyA9IDcsXG5cbiAgLyoqXG4gICAqIDIgd2Vla3NcbiAgICovXG4gIFRXT19XRUVLUyA9IDE0LFxuXG4gIC8qKlxuICAgKiAxIG1vbnRoXG4gICAqL1xuICBPTkVfTU9OVEggPSAzMCxcblxuICAvKipcbiAgICogMiBtb250aHNcbiAgICovXG4gIFRXT19NT05USFMgPSA2MCxcblxuICAvKipcbiAgICogMyBtb250aHNcbiAgICovXG4gIFRIUkVFX01PTlRIUyA9IDkwLFxuXG4gIC8qKlxuICAgKiA0IG1vbnRoc1xuICAgKi9cbiAgRk9VUl9NT05USFMgPSAxMjAsXG5cbiAgLyoqXG4gICAqIDUgbW9udGhzXG4gICAqL1xuICBGSVZFX01PTlRIUyA9IDE1MCxcblxuICAvKipcbiAgICogNiBtb250aHNcbiAgICovXG4gIFNJWF9NT05USFMgPSAxODAsXG5cbiAgLyoqXG4gICAqIDEgeWVhclxuICAgKi9cbiAgT05FX1lFQVIgPSAzNjUsXG5cbiAgLyoqXG4gICAqIDEzIG1vbnRoc1xuICAgKi9cbiAgVEhJUlRFRU5fTU9OVEhTID0gNDAwLFxuXG4gIC8qKlxuICAgKiAxOCBtb250aHNcbiAgICovXG4gIEVJR0hURUVOX01PTlRIUyA9IDU0NSxcblxuICAvKipcbiAgICogMiB5ZWFyc1xuICAgKi9cbiAgVFdPX1lFQVJTID0gNzMxLFxuXG4gIC8qKlxuICAgKiA1IHllYXJzXG4gICAqL1xuICBGSVZFX1lFQVJTID0gMTgyNyxcblxuICAvKipcbiAgICogNiB5ZWFyc1xuICAgKi9cbiAgU0lYX1lFQVJTID0gMjE5MixcblxuICAvKipcbiAgICogNyB5ZWFyc1xuICAgKi9cbiAgU0VWRU5fWUVBUlMgPSAyNTU3LFxuXG4gIC8qKlxuICAgKiA4IHllYXJzXG4gICAqL1xuICBFSUdIVF9ZRUFSUyA9IDI5MjIsXG5cbiAgLyoqXG4gICAqIDkgeWVhcnNcbiAgICovXG4gIE5JTkVfWUVBUlMgPSAzMjg4LFxuXG4gIC8qKlxuICAgKiAxMCB5ZWFyc1xuICAgKi9cbiAgVEVOX1lFQVJTID0gMzY1MyxcblxuICAvKipcbiAgICogUmV0YWluIGxvZ3MgZm9yZXZlclxuICAgKi9cbiAgSU5GSU5JVEUgPSA5OTk5LFxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgTG9nR3JvdXBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2dHcm91cFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBLTVMgY3VzdG9tZXIgbWFuYWdlZCBrZXkgdG8gZW5jcnlwdCB0aGUgbG9nIGdyb3VwIHdpdGguXG4gICAqXG4gICAqIEBkZWZhdWx0IFNlcnZlci1zaWRlIGVuY3JweXRpb24gbWFuYWdlZCBieSB0aGUgQ2xvdWRXYXRjaCBMb2dzIHNlcnZpY2VcbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgbG9nIGdyb3VwLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgbG9nR3JvdXBOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBIb3cgbG9uZywgaW4gZGF5cywgdGhlIGxvZyBjb250ZW50cyB3aWxsIGJlIHJldGFpbmVkLlxuICAgKlxuICAgKiBUbyByZXRhaW4gYWxsIGxvZ3MsIHNldCB0aGlzIHZhbHVlIHRvIFJldGVudGlvbkRheXMuSU5GSU5JVEUuXG4gICAqXG4gICAqIEBkZWZhdWx0IFJldGVudGlvbkRheXMuVFdPX1lFQVJTXG4gICAqL1xuICByZWFkb25seSByZXRlbnRpb24/OiBSZXRlbnRpb25EYXlzO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIHJlbW92YWwgcG9saWN5IG9mIHRoaXMgbG9nIGdyb3VwLlxuICAgKlxuICAgKiBOb3JtYWxseSB5b3Ugd2FudCB0byByZXRhaW4gdGhlIGxvZyBncm91cCBzbyB5b3UgY2FuIGRpYWdub3NlIGlzc3Vlc1xuICAgKiBmcm9tIGxvZ3MgZXZlbiBhZnRlciBhIGRlcGxveW1lbnQgdGhhdCBubyBsb25nZXIgaW5jbHVkZXMgdGhlIGxvZyBncm91cC5cbiAgICogSW4gdGhhdCBjYXNlLCB1c2UgdGhlIG5vcm1hbCBkYXRlLWJhc2VkIHJldGVudGlvbiBwb2xpY3kgdG8gYWdlIG91dCB5b3VyXG4gICAqIGxvZ3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IFJlbW92YWxQb2xpY3kuUmV0YWluXG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogUmVtb3ZhbFBvbGljeTtcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBDbG91ZFdhdGNoIExvZyBHcm91cFxuICovXG5leHBvcnQgY2xhc3MgTG9nR3JvdXAgZXh0ZW5kcyBMb2dHcm91cEJhc2Uge1xuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIExvZ0dyb3VwIGdpdmVuIGl0cyBBUk5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxvZ0dyb3VwQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGxvZ0dyb3VwQXJuOiBzdHJpbmcpOiBJTG9nR3JvdXAge1xuICAgIGNvbnN0IGJhc2VMb2dHcm91cEFybiA9IGxvZ0dyb3VwQXJuLnJlcGxhY2UoLzpcXCokLywgJycpO1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgTG9nR3JvdXBCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBsb2dHcm91cEFybiA9IGAke2Jhc2VMb2dHcm91cEFybn06KmA7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbG9nR3JvdXBOYW1lID0gU3RhY2sub2Yoc2NvcGUpLnNwbGl0QXJuKGJhc2VMb2dHcm91cEFybiwgQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUpLnJlc291cmNlTmFtZSE7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkLCB7XG4gICAgICBlbnZpcm9ubWVudEZyb21Bcm46IGJhc2VMb2dHcm91cEFybixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgTG9nR3JvdXAgZ2l2ZW4gaXRzIG5hbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxvZ0dyb3VwTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBsb2dHcm91cE5hbWU6IHN0cmluZyk6IElMb2dHcm91cCB7XG4gICAgY29uc3QgYmFzZUxvZ0dyb3VwTmFtZSA9IGxvZ0dyb3VwTmFtZS5yZXBsYWNlKC86XFwqJC8sICcnKTtcblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIExvZ0dyb3VwQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbG9nR3JvdXBOYW1lID0gYmFzZUxvZ0dyb3VwTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBsb2dHcm91cEFybiA9IFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgICBzZXJ2aWNlOiAnbG9ncycsXG4gICAgICAgIHJlc291cmNlOiAnbG9nLWdyb3VwJyxcbiAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICAgICAgcmVzb3VyY2VOYW1lOiBiYXNlTG9nR3JvdXBOYW1lICsgJzoqJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGlzIGxvZyBncm91cFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxvZ0dyb3VwQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoaXMgbG9nIGdyb3VwXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbG9nR3JvdXBOYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExvZ0dyb3VwUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5sb2dHcm91cE5hbWUsXG4gICAgfSk7XG5cbiAgICBsZXQgcmV0ZW50aW9uSW5EYXlzID0gcHJvcHMucmV0ZW50aW9uO1xuICAgIGlmIChyZXRlbnRpb25JbkRheXMgPT09IHVuZGVmaW5lZCkgeyByZXRlbnRpb25JbkRheXMgPSBSZXRlbnRpb25EYXlzLlRXT19ZRUFSUzsgfVxuICAgIGlmIChyZXRlbnRpb25JbkRheXMgPT09IEluZmluaXR5IHx8IHJldGVudGlvbkluRGF5cyA9PT0gUmV0ZW50aW9uRGF5cy5JTkZJTklURSkgeyByZXRlbnRpb25JbkRheXMgPSB1bmRlZmluZWQ7IH1cblxuICAgIGlmIChyZXRlbnRpb25JbkRheXMgIT09IHVuZGVmaW5lZCAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKHJldGVudGlvbkluRGF5cykgJiYgcmV0ZW50aW9uSW5EYXlzIDw9IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgcmV0ZW50aW9uSW5EYXlzIG11c3QgYmUgcG9zaXRpdmUsIGdvdCAke3JldGVudGlvbkluRGF5c31gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5Mb2dHcm91cCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBrbXNLZXlJZDogcHJvcHMuZW5jcnlwdGlvbktleT8ua2V5QXJuLFxuICAgICAgbG9nR3JvdXBOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHJldGVudGlvbkluRGF5cyxcbiAgICB9KTtcblxuICAgIHJlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeShwcm9wcy5yZW1vdmFsUG9saWN5KTtcblxuICAgIHRoaXMubG9nR3JvdXBBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlc291cmNlLmF0dHJBcm4sIHtcbiAgICAgIHNlcnZpY2U6ICdsb2dzJyxcbiAgICAgIHJlc291cmNlOiAnbG9nLWdyb3VwJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FLFxuICAgIH0pO1xuICAgIHRoaXMubG9nR3JvdXBOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgbmV3IExvZ1N0cmVhbSBjcmVhdGVkIGZyb20gYSBMb2dHcm91cFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0cmVhbU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGxvZyBzdHJlYW0gdG8gY3JlYXRlLlxuICAgKlxuICAgKiBUaGUgbmFtZSBtdXN0IGJlIHVuaXF1ZSB3aXRoaW4gdGhlIGxvZyBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgQXV0b21hdGljYWxseSBnZW5lcmF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGxvZ1N0cmVhbU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBuZXcgU3Vic2NyaXB0aW9uRmlsdGVyIGNyZWF0ZWQgZnJvbSBhIExvZ0dyb3VwXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3Vic2NyaXB0aW9uRmlsdGVyT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgZGVzdGluYXRpb24gdG8gc2VuZCB0aGUgZmlsdGVyZWQgZXZlbnRzIHRvLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgYSBLaW5lc2lzIHN0cmVhbSBvciBhIExhbWJkYSBmdW5jdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlc3RpbmF0aW9uOiBJTG9nU3Vic2NyaXB0aW9uRGVzdGluYXRpb247XG5cbiAgLyoqXG4gICAqIExvZyBldmVudHMgbWF0Y2hpbmcgdGhpcyBwYXR0ZXJuIHdpbGwgYmUgc2VudCB0byB0aGUgZGVzdGluYXRpb24uXG4gICAqL1xuICByZWFkb25seSBmaWx0ZXJQYXR0ZXJuOiBJRmlsdGVyUGF0dGVybjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIE1ldHJpY0ZpbHRlciBjcmVhdGVkIGZyb20gYSBMb2dHcm91cFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1ldHJpY0ZpbHRlck9wdGlvbnMge1xuICAvKipcbiAgICogUGF0dGVybiB0byBzZWFyY2ggZm9yIGxvZyBldmVudHMuXG4gICAqL1xuICByZWFkb25seSBmaWx0ZXJQYXR0ZXJuOiBJRmlsdGVyUGF0dGVybjtcblxuICAvKipcbiAgICogVGhlIG5hbWVzcGFjZSBvZiB0aGUgbWV0cmljIHRvIGVtaXQuXG4gICAqL1xuICByZWFkb25seSBtZXRyaWNOYW1lc3BhY2U6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIG1ldHJpYyB0byBlbWl0LlxuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgdG8gZW1pdCBmb3IgdGhlIG1ldHJpYy5cbiAgICpcbiAgICogQ2FuIGVpdGhlciBiZSBhIGxpdGVyYWwgbnVtYmVyICh0eXBpY2FsbHkgXCIxXCIpLCBvciB0aGUgbmFtZSBvZiBhIGZpZWxkIGluIHRoZSBzdHJ1Y3R1cmVcbiAgICogdG8gdGFrZSB0aGUgdmFsdWUgZnJvbSB0aGUgbWF0Y2hlZCBldmVudC4gSWYgeW91IGFyZSB1c2luZyBhIGZpZWxkIHZhbHVlLCB0aGUgZmllbGRcbiAgICogdmFsdWUgbXVzdCBoYXZlIGJlZW4gbWF0Y2hlZCB1c2luZyB0aGUgcGF0dGVybi5cbiAgICpcbiAgICogSWYgeW91IHdhbnQgdG8gc3BlY2lmeSBhIGZpZWxkIGZyb20gYSBtYXRjaGVkIEpTT04gc3RydWN0dXJlLCB1c2UgJyQuZmllbGROYW1lJyxcbiAgICogYW5kIG1ha2Ugc3VyZSB0aGUgZmllbGQgaXMgaW4gdGhlIHBhdHRlcm4gKGlmIG9ubHkgYXMgJyQuZmllbGROYW1lID0gKicpLlxuICAgKlxuICAgKiBJZiB5b3Ugd2FudCB0byBzcGVjaWZ5IGEgZmllbGQgZnJvbSBhIG1hdGNoZWQgc3BhY2UtZGVsaW1pdGVkIHN0cnVjdHVyZSxcbiAgICogdXNlICckZmllbGROYW1lJy5cbiAgICpcbiAgICogQGRlZmF1bHQgXCIxXCJcbiAgICovXG4gIHJlYWRvbmx5IG1ldHJpY1ZhbHVlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgdG8gZW1pdCBpZiB0aGUgcGF0dGVybiBkb2VzIG5vdCBtYXRjaCBhIHBhcnRpY3VsYXIgZXZlbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIG1ldHJpYyBlbWl0dGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdFZhbHVlPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZmllbGRzIHRvIHVzZSBhcyBkaW1lbnNpb25zIGZvciB0aGUgbWV0cmljLiBPbmUgbWV0cmljIGZpbHRlciBjYW4gaW5jbHVkZSBhcyBtYW55IGFzIHRocmVlIGRpbWVuc2lvbnMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtbG9ncy1tZXRyaWNmaWx0ZXItbWV0cmljdHJhbnNmb3JtYXRpb24uaHRtbCNjZm4tbG9ncy1tZXRyaWNmaWx0ZXItbWV0cmljdHJhbnNmb3JtYXRpb24tZGltZW5zaW9uc1xuICAgKiBAZGVmYXVsdCAtIE5vIGRpbWVuc2lvbnMgYXR0YWNoZWQgdG8gbWV0cmljcy5cbiAgICovXG4gIHJlYWRvbmx5IGRpbWVuc2lvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBUaGUgdW5pdCB0byBhc3NpZ24gdG8gdGhlIG1ldHJpYy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbi5odG1sI2Nmbi1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbi11bml0XG4gICAqIEBkZWZhdWx0IC0gTm8gdW5pdCBhdHRhY2hlZCB0byBtZXRyaWNzLlxuICAgKi9cbiAgcmVhZG9ubHkgdW5pdD86IGNsb3Vkd2F0Y2guVW5pdDtcbn1cbiJdfQ==