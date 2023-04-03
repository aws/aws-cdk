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
     * 3 years
     */
    RetentionDays[RetentionDays["THREE_YEARS"] = 1096] = "THREE_YEARS";
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
}
_a = JSII_RTTI_SYMBOL_1;
LogGroup[_a] = { fqn: "@aws-cdk/aws-logs.LogGroup", version: "0.0.0" };
exports.LogGroup = LogGroup;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLWdyb3VwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nLWdyb3VwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNEQUFzRDtBQUN0RCx3Q0FBd0M7QUFFeEMsd0NBQXNGO0FBRXRGLDZDQUF5QztBQUN6QyxxREFBK0M7QUFDL0MsbURBQStDO0FBQy9DLHVDQUEwRDtBQUMxRCxxQ0FBMEM7QUFDMUMsK0RBQXdGO0FBNkV4Rjs7R0FFRztBQUNILE1BQWUsWUFBYSxTQUFRLGVBQVE7SUFjMUM7Ozs7O09BS0c7SUFDSSxTQUFTLENBQUMsRUFBVSxFQUFFLFFBQXVCLEVBQUU7UUFDcEQsT0FBTyxJQUFJLHNCQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRTtZQUM3QixRQUFRLEVBQUUsSUFBSTtZQUNkLEdBQUcsS0FBSztTQUNULENBQUMsQ0FBQztLQUNKO0lBRUQ7Ozs7O09BS0c7SUFDSSxxQkFBcUIsQ0FBQyxFQUFVLEVBQUUsS0FBZ0M7UUFDdkUsT0FBTyxJQUFJLHdDQUFrQixDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDdEMsUUFBUSxFQUFFLElBQUk7WUFDZCxHQUFHLEtBQUs7U0FDVCxDQUFDLENBQUM7S0FDSjtJQUVEOzs7OztPQUtHO0lBQ0ksZUFBZSxDQUFDLEVBQVUsRUFBRSxLQUEwQjtRQUMzRCxPQUFPLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFO1lBQ2hDLFFBQVEsRUFBRSxJQUFJO1lBQ2QsR0FBRyxLQUFLO1NBQ1QsQ0FBQyxDQUFDO0tBQ0o7SUFFRDs7Ozs7Ozs7Ozs7OztPQWFHO0lBQ0ksYUFBYSxDQUFDLFNBQWlCLEVBQUUsZUFBdUIsRUFBRSxVQUFrQjtRQUNqRixJQUFJLDRCQUFZLENBQUMsSUFBSSxFQUFFLEdBQUcsZUFBZSxJQUFJLFVBQVUsRUFBRSxFQUFFO1lBQ3pELFFBQVEsRUFBRSxJQUFJO1lBQ2QsZUFBZTtZQUNmLFVBQVU7WUFDVixhQUFhLEVBQUUsdUJBQWEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDO1lBQzlDLFdBQVcsRUFBRSxTQUFTO1NBQ3ZCLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBSSxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN6RjtJQUVEOztPQUVHO0lBQ0ksVUFBVSxDQUFDLE9BQXVCO1FBQ3ZDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztLQUN6RTtJQUVEOztPQUVHO0lBQ0ksU0FBUyxDQUFDLE9BQXVCO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQ3ZCLHNCQUFzQixFQUN0QixtQkFBbUIsRUFDbkIsd0JBQXdCLEVBQ3hCLHdCQUF3QixFQUN4Qix5QkFBeUIsQ0FDMUIsQ0FBQztLQUNIO0lBRUQ7O09BRUc7SUFDSSxLQUFLLENBQUMsT0FBdUIsRUFBRSxHQUFHLE9BQWlCO1FBQ3hELE9BQU8sR0FBRyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQztZQUN4QyxPQUFPO1lBQ1AsT0FBTztZQUNQLHNIQUFzSDtZQUN0SCwwSEFBMEg7WUFDMUgsWUFBWSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUNoQyxRQUFRLEVBQUUsSUFBSTtTQUNmLENBQUMsQ0FBQztLQUNKO0lBRUQ7OztPQUdHO0lBQ0ksb0JBQW9CO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztLQUMxQjtJQUVEOzs7Ozs7OztPQVFHO0lBQ0ksbUJBQW1CLENBQUMsU0FBOEI7UUFDdkQsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHVCQUFjLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDaEQsVUFBVSxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pGLENBQUMsQ0FBQyxDQUFDO1FBQ0osT0FBTyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2hFO0lBRU8sNkJBQTZCLENBQUMsU0FBeUI7UUFDN0QsSUFBSSxTQUFTLENBQUMsZ0JBQWdCLEVBQUU7WUFDOUIsd0VBQXdFO1lBQ3hFLHNFQUFzRTtZQUN0RSw0QkFBNEI7WUFDNUIsT0FBTyxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7U0FDekQ7UUFFRCxJQUFJLFNBQVMsWUFBWSxHQUFHLENBQUMsWUFBWSxFQUFFO1lBQ3pDLE1BQU0sU0FBUyxHQUFHLFVBQUcsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDMUUsSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFO2dCQUNyQixPQUFPLElBQUksR0FBRyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDaEQ7U0FDRjtRQUVELE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0NBQ0Y7QUFFRDs7R0FFRztBQUNILElBQVksYUFtSFg7QUFuSEQsV0FBWSxhQUFhO0lBQ3ZCOztPQUVHO0lBQ0gsdURBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsNkRBQWMsQ0FBQTtJQUVkOztPQUVHO0lBQ0gsMkRBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gseURBQVksQ0FBQTtJQUVaOztPQUVHO0lBQ0gsNERBQWMsQ0FBQTtJQUVkOztPQUVHO0lBQ0gsNERBQWMsQ0FBQTtJQUVkOztPQUVHO0lBQ0gsOERBQWUsQ0FBQTtJQUVmOztPQUVHO0lBQ0gsa0VBQWlCLENBQUE7SUFFakI7O09BRUc7SUFDSCxpRUFBaUIsQ0FBQTtJQUVqQjs7T0FFRztJQUNILGlFQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsK0RBQWdCLENBQUE7SUFFaEI7O09BRUc7SUFDSCwyREFBYyxDQUFBO0lBRWQ7O09BRUc7SUFDSCx5RUFBcUIsQ0FBQTtJQUVyQjs7T0FFRztJQUNILHlFQUFxQixDQUFBO0lBRXJCOztPQUVHO0lBQ0gsNkRBQWUsQ0FBQTtJQUVmOztPQUVHO0lBQ0gsa0VBQWtCLENBQUE7SUFFbEI7O09BRUc7SUFDSCxnRUFBaUIsQ0FBQTtJQUVqQjs7T0FFRztJQUNILDhEQUFnQixDQUFBO0lBRWhCOztPQUVHO0lBQ0gsa0VBQWtCLENBQUE7SUFFbEI7O09BRUc7SUFDSCxrRUFBa0IsQ0FBQTtJQUVsQjs7T0FFRztJQUNILGdFQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsOERBQWdCLENBQUE7SUFFaEI7O09BRUc7SUFDSCw0REFBZSxDQUFBO0FBQ2pCLENBQUMsRUFuSFcsYUFBYSxHQUFiLHFCQUFhLEtBQWIscUJBQWEsUUFtSHhCO0FBMENEOztHQUVHO0FBQ0gsTUFBYSxRQUFTLFNBQVEsWUFBWTtJQUN4Qzs7T0FFRztJQUNJLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBZ0IsRUFBRSxFQUFVLEVBQUUsV0FBbUI7UUFDN0UsTUFBTSxlQUFlLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFeEQsTUFBTSxNQUFPLFNBQVEsWUFBWTtZQUFqQzs7Z0JBQ2tCLGdCQUFXLEdBQUcsR0FBRyxlQUFlLElBQUksQ0FBQztnQkFDckMsaUJBQVksR0FBRyxZQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxlQUFlLEVBQUUsZ0JBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLFlBQWEsQ0FBQztZQUN4SCxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUU7WUFDM0Isa0JBQWtCLEVBQUUsZUFBZTtTQUNwQyxDQUFDLENBQUM7S0FDSjtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQWdCLEVBQUUsRUFBVSxFQUFFLFlBQW9CO1FBQy9FLE1BQU0sZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFMUQsTUFBTSxNQUFPLFNBQVEsWUFBWTtZQUFqQzs7Z0JBQ2tCLGlCQUFZLEdBQUcsZ0JBQWdCLENBQUM7Z0JBQ2hDLGdCQUFXLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUM7b0JBQ3RELE9BQU8sRUFBRSxNQUFNO29CQUNmLFFBQVEsRUFBRSxXQUFXO29CQUNyQixTQUFTLEVBQUUsZ0JBQVMsQ0FBQyxtQkFBbUI7b0JBQ3hDLFlBQVksRUFBRSxnQkFBZ0IsR0FBRyxJQUFJO2lCQUN0QyxDQUFDLENBQUM7WUFDTCxDQUFDO1NBQUE7UUFFRCxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM5QjtJQVlELFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsUUFBdUIsRUFBRTtRQUNqRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRTtZQUNmLFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtTQUNqQyxDQUFDLENBQUM7Ozs7OzsrQ0FqRE0sUUFBUTs7OztRQW1EakIsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUN0QyxJQUFJLGVBQWUsS0FBSyxTQUFTLEVBQUU7WUFBRSxlQUFlLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQztTQUFFO1FBQ2pGLElBQUksZUFBZSxLQUFLLFFBQVEsSUFBSSxlQUFlLEtBQUssYUFBYSxDQUFDLFFBQVEsRUFBRTtZQUFFLGVBQWUsR0FBRyxTQUFTLENBQUM7U0FBRTtRQUVoSCxJQUFJLGVBQWUsS0FBSyxTQUFTLElBQUksQ0FBQyxZQUFLLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxJQUFJLGVBQWUsSUFBSSxDQUFDLEVBQUU7WUFDakcsTUFBTSxJQUFJLEtBQUssQ0FBQyx5Q0FBeUMsZUFBZSxFQUFFLENBQUMsQ0FBQztTQUM3RTtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksNEJBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO1lBQ2pELFFBQVEsRUFBRSxLQUFLLENBQUMsYUFBYSxFQUFFLE1BQU07WUFDckMsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLGVBQWU7U0FDaEIsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFO1lBQ2hFLE9BQU8sRUFBRSxNQUFNO1lBQ2YsUUFBUSxFQUFFLFdBQVc7WUFDckIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLFNBQVMsRUFBRSxnQkFBUyxDQUFDLG1CQUFtQjtTQUN6QyxDQUFDLENBQUM7UUFDSCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDakU7Ozs7QUExRVUsNEJBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjbG91ZHdhdGNoIGZyb20gJ0Bhd3MtY2RrL2F3cy1jbG91ZHdhdGNoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGttcyBmcm9tICdAYXdzLWNkay9hd3Mta21zJztcbmltcG9ydCB7IEFybiwgQXJuRm9ybWF0LCBSZW1vdmFsUG9saWN5LCBSZXNvdXJjZSwgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IExvZ1N0cmVhbSB9IGZyb20gJy4vbG9nLXN0cmVhbSc7XG5pbXBvcnQgeyBDZm5Mb2dHcm91cCB9IGZyb20gJy4vbG9ncy5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgTWV0cmljRmlsdGVyIH0gZnJvbSAnLi9tZXRyaWMtZmlsdGVyJztcbmltcG9ydCB7IEZpbHRlclBhdHRlcm4sIElGaWx0ZXJQYXR0ZXJuIH0gZnJvbSAnLi9wYXR0ZXJuJztcbmltcG9ydCB7IFJlc291cmNlUG9saWN5IH0gZnJvbSAnLi9wb2xpY3knO1xuaW1wb3J0IHsgSUxvZ1N1YnNjcmlwdGlvbkRlc3RpbmF0aW9uLCBTdWJzY3JpcHRpb25GaWx0ZXIgfSBmcm9tICcuL3N1YnNjcmlwdGlvbi1maWx0ZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIElMb2dHcm91cCBleHRlbmRzIGlhbS5JUmVzb3VyY2VXaXRoUG9saWN5IHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhpcyBsb2cgZ3JvdXAsIHdpdGggJzoqJyBhcHBlbmRlZFxuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBsb2dHcm91cEFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGlzIGxvZyBncm91cFxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBsb2dHcm91cE5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IExvZyBTdHJlYW0gZm9yIHRoaXMgTG9nIEdyb3VwXG4gICAqXG4gICAqIEBwYXJhbSBpZCBVbmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNvbnN0cnVjdCBpbiBpdHMgcGFyZW50XG4gICAqIEBwYXJhbSBwcm9wcyBQcm9wZXJ0aWVzIGZvciBjcmVhdGluZyB0aGUgTG9nU3RyZWFtXG4gICAqL1xuICBhZGRTdHJlYW0oaWQ6IHN0cmluZywgcHJvcHM/OiBTdHJlYW1PcHRpb25zKTogTG9nU3RyZWFtO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgU3Vic2NyaXB0aW9uIEZpbHRlciBvbiB0aGlzIExvZyBHcm91cFxuICAgKlxuICAgKiBAcGFyYW0gaWQgVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBjb25zdHJ1Y3QgaW4gaXRzIHBhcmVudFxuICAgKiBAcGFyYW0gcHJvcHMgUHJvcGVydGllcyBmb3IgY3JlYXRpbmcgdGhlIFN1YnNjcmlwdGlvbkZpbHRlclxuICAgKi9cbiAgYWRkU3Vic2NyaXB0aW9uRmlsdGVyKGlkOiBzdHJpbmcsIHByb3BzOiBTdWJzY3JpcHRpb25GaWx0ZXJPcHRpb25zKTogU3Vic2NyaXB0aW9uRmlsdGVyO1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgTWV0cmljIEZpbHRlciBvbiB0aGlzIExvZyBHcm91cFxuICAgKlxuICAgKiBAcGFyYW0gaWQgVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBjb25zdHJ1Y3QgaW4gaXRzIHBhcmVudFxuICAgKiBAcGFyYW0gcHJvcHMgUHJvcGVydGllcyBmb3IgY3JlYXRpbmcgdGhlIE1ldHJpY0ZpbHRlclxuICAgKi9cbiAgYWRkTWV0cmljRmlsdGVyKGlkOiBzdHJpbmcsIHByb3BzOiBNZXRyaWNGaWx0ZXJPcHRpb25zKTogTWV0cmljRmlsdGVyO1xuXG4gIC8qKlxuICAgKiBFeHRyYWN0IGEgbWV0cmljIGZyb20gc3RydWN0dXJlZCBsb2cgZXZlbnRzIGluIHRoZSBMb2dHcm91cFxuICAgKlxuICAgKiBDcmVhdGVzIGEgTWV0cmljRmlsdGVyIG9uIHRoaXMgTG9nR3JvdXAgdGhhdCB3aWxsIGV4dHJhY3QgdGhlIHZhbHVlXG4gICAqIG9mIHRoZSBpbmRpY2F0ZWQgSlNPTiBmaWVsZCBpbiBhbGwgcmVjb3JkcyB3aGVyZSBpdCBvY2N1cnMuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgd2lsbCBiZSBhdmFpbGFibGUgaW4gQ2xvdWRXYXRjaCBNZXRyaWNzIHVuZGVyIHRoZVxuICAgKiBpbmRpY2F0ZWQgbmFtZXNwYWNlIGFuZCBuYW1lLlxuICAgKlxuICAgKiBAcGFyYW0ganNvbkZpZWxkIEpTT04gZmllbGQgdG8gZXh0cmFjdCAoZXhhbXBsZTogJyQubXlmaWVsZCcpXG4gICAqIEBwYXJhbSBtZXRyaWNOYW1lc3BhY2UgTmFtZXNwYWNlIHRvIGVtaXQgdGhlIG1ldHJpYyB1bmRlclxuICAgKiBAcGFyYW0gbWV0cmljTmFtZSBOYW1lIHRvIGVtaXQgdGhlIG1ldHJpYyB1bmRlclxuICAgKiBAcmV0dXJucyBBIE1ldHJpYyBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBleHRyYWN0ZWQgbWV0cmljXG4gICAqL1xuICBleHRyYWN0TWV0cmljKGpzb25GaWVsZDogc3RyaW5nLCBtZXRyaWNOYW1lc3BhY2U6IHN0cmluZywgbWV0cmljTmFtZTogc3RyaW5nKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIEdpdmUgcGVybWlzc2lvbnMgdG8gd3JpdGUgdG8gY3JlYXRlIGFuZCB3cml0ZSB0byBzdHJlYW1zIGluIHRoaXMgbG9nIGdyb3VwXG4gICAqL1xuICBncmFudFdyaXRlKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHaXZlIHBlcm1pc3Npb25zIHRvIHJlYWQgZnJvbSB0aGlzIGxvZyBncm91cCBhbmQgc3RyZWFtc1xuICAgKi9cbiAgZ3JhbnRSZWFkKGdyYW50ZWU6IGlhbS5JR3JhbnRhYmxlKTogaWFtLkdyYW50O1xuXG4gIC8qKlxuICAgKiBHaXZlIHRoZSBpbmRpY2F0ZWQgcGVybWlzc2lvbnMgb24gdGhpcyBsb2cgZ3JvdXAgYW5kIGFsbCBzdHJlYW1zXG4gICAqL1xuICBncmFudChncmFudGVlOiBpYW0uSUdyYW50YWJsZSwgLi4uYWN0aW9uczogc3RyaW5nW10pOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBtZXRob2QgdG8gZ2V0IHRoZSBwaHlzaWNhbCBuYW1lIG9mIHRoaXMgbG9nIGdyb3VwXG4gICAqL1xuICBsb2dHcm91cFBoeXNpY2FsTmFtZSgpOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQW4gQ2xvdWRXYXRjaCBMb2cgR3JvdXBcbiAqL1xuYWJzdHJhY3QgY2xhc3MgTG9nR3JvdXBCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJTG9nR3JvdXAge1xuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGlzIGxvZyBncm91cCwgd2l0aCAnOionIGFwcGVuZGVkXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgbG9nR3JvdXBBcm46IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhpcyBsb2cgZ3JvdXBcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBsb2dHcm91cE5hbWU6IHN0cmluZztcblxuXG4gIHByaXZhdGUgcG9saWN5PzogUmVzb3VyY2VQb2xpY3k7XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBMb2cgU3RyZWFtIGZvciB0aGlzIExvZyBHcm91cFxuICAgKlxuICAgKiBAcGFyYW0gaWQgVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBjb25zdHJ1Y3QgaW4gaXRzIHBhcmVudFxuICAgKiBAcGFyYW0gcHJvcHMgUHJvcGVydGllcyBmb3IgY3JlYXRpbmcgdGhlIExvZ1N0cmVhbVxuICAgKi9cbiAgcHVibGljIGFkZFN0cmVhbShpZDogc3RyaW5nLCBwcm9wczogU3RyZWFtT3B0aW9ucyA9IHt9KTogTG9nU3RyZWFtIHtcbiAgICByZXR1cm4gbmV3IExvZ1N0cmVhbSh0aGlzLCBpZCwge1xuICAgICAgbG9nR3JvdXA6IHRoaXMsXG4gICAgICAuLi5wcm9wcyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgU3Vic2NyaXB0aW9uIEZpbHRlciBvbiB0aGlzIExvZyBHcm91cFxuICAgKlxuICAgKiBAcGFyYW0gaWQgVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBjb25zdHJ1Y3QgaW4gaXRzIHBhcmVudFxuICAgKiBAcGFyYW0gcHJvcHMgUHJvcGVydGllcyBmb3IgY3JlYXRpbmcgdGhlIFN1YnNjcmlwdGlvbkZpbHRlclxuICAgKi9cbiAgcHVibGljIGFkZFN1YnNjcmlwdGlvbkZpbHRlcihpZDogc3RyaW5nLCBwcm9wczogU3Vic2NyaXB0aW9uRmlsdGVyT3B0aW9ucyk6IFN1YnNjcmlwdGlvbkZpbHRlciB7XG4gICAgcmV0dXJuIG5ldyBTdWJzY3JpcHRpb25GaWx0ZXIodGhpcywgaWQsIHtcbiAgICAgIGxvZ0dyb3VwOiB0aGlzLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IE1ldHJpYyBGaWx0ZXIgb24gdGhpcyBMb2cgR3JvdXBcbiAgICpcbiAgICogQHBhcmFtIGlkIFVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGUgY29uc3RydWN0IGluIGl0cyBwYXJlbnRcbiAgICogQHBhcmFtIHByb3BzIFByb3BlcnRpZXMgZm9yIGNyZWF0aW5nIHRoZSBNZXRyaWNGaWx0ZXJcbiAgICovXG4gIHB1YmxpYyBhZGRNZXRyaWNGaWx0ZXIoaWQ6IHN0cmluZywgcHJvcHM6IE1ldHJpY0ZpbHRlck9wdGlvbnMpOiBNZXRyaWNGaWx0ZXIge1xuICAgIHJldHVybiBuZXcgTWV0cmljRmlsdGVyKHRoaXMsIGlkLCB7XG4gICAgICBsb2dHcm91cDogdGhpcyxcbiAgICAgIC4uLnByb3BzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4dHJhY3QgYSBtZXRyaWMgZnJvbSBzdHJ1Y3R1cmVkIGxvZyBldmVudHMgaW4gdGhlIExvZ0dyb3VwXG4gICAqXG4gICAqIENyZWF0ZXMgYSBNZXRyaWNGaWx0ZXIgb24gdGhpcyBMb2dHcm91cCB0aGF0IHdpbGwgZXh0cmFjdCB0aGUgdmFsdWVcbiAgICogb2YgdGhlIGluZGljYXRlZCBKU09OIGZpZWxkIGluIGFsbCByZWNvcmRzIHdoZXJlIGl0IG9jY3Vycy5cbiAgICpcbiAgICogVGhlIG1ldHJpYyB3aWxsIGJlIGF2YWlsYWJsZSBpbiBDbG91ZFdhdGNoIE1ldHJpY3MgdW5kZXIgdGhlXG4gICAqIGluZGljYXRlZCBuYW1lc3BhY2UgYW5kIG5hbWUuXG4gICAqXG4gICAqIEBwYXJhbSBqc29uRmllbGQgSlNPTiBmaWVsZCB0byBleHRyYWN0IChleGFtcGxlOiAnJC5teWZpZWxkJylcbiAgICogQHBhcmFtIG1ldHJpY05hbWVzcGFjZSBOYW1lc3BhY2UgdG8gZW1pdCB0aGUgbWV0cmljIHVuZGVyXG4gICAqIEBwYXJhbSBtZXRyaWNOYW1lIE5hbWUgdG8gZW1pdCB0aGUgbWV0cmljIHVuZGVyXG4gICAqIEByZXR1cm5zIEEgTWV0cmljIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGV4dHJhY3RlZCBtZXRyaWNcbiAgICovXG4gIHB1YmxpYyBleHRyYWN0TWV0cmljKGpzb25GaWVsZDogc3RyaW5nLCBtZXRyaWNOYW1lc3BhY2U6IHN0cmluZywgbWV0cmljTmFtZTogc3RyaW5nKSB7XG4gICAgbmV3IE1ldHJpY0ZpbHRlcih0aGlzLCBgJHttZXRyaWNOYW1lc3BhY2V9XyR7bWV0cmljTmFtZX1gLCB7XG4gICAgICBsb2dHcm91cDogdGhpcyxcbiAgICAgIG1ldHJpY05hbWVzcGFjZSxcbiAgICAgIG1ldHJpY05hbWUsXG4gICAgICBmaWx0ZXJQYXR0ZXJuOiBGaWx0ZXJQYXR0ZXJuLmV4aXN0cyhqc29uRmllbGQpLFxuICAgICAgbWV0cmljVmFsdWU6IGpzb25GaWVsZCxcbiAgICB9KTtcblxuICAgIHJldHVybiBuZXcgY2xvdWR3YXRjaC5NZXRyaWMoeyBtZXRyaWNOYW1lLCBuYW1lc3BhY2U6IG1ldHJpY05hbWVzcGFjZSB9KS5hdHRhY2hUbyh0aGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlIHBlcm1pc3Npb25zIHRvIGNyZWF0ZSBhbmQgd3JpdGUgdG8gc3RyZWFtcyBpbiB0aGlzIGxvZyBncm91cFxuICAgKi9cbiAgcHVibGljIGdyYW50V3JpdGUoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpIHtcbiAgICByZXR1cm4gdGhpcy5ncmFudChncmFudGVlLCAnbG9nczpDcmVhdGVMb2dTdHJlYW0nLCAnbG9nczpQdXRMb2dFdmVudHMnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlIHBlcm1pc3Npb25zIHRvIHJlYWQgYW5kIGZpbHRlciBldmVudHMgZnJvbSB0aGlzIGxvZyBncm91cFxuICAgKi9cbiAgcHVibGljIGdyYW50UmVhZChncmFudGVlOiBpYW0uSUdyYW50YWJsZSkge1xuICAgIHJldHVybiB0aGlzLmdyYW50KGdyYW50ZWUsXG4gICAgICAnbG9nczpGaWx0ZXJMb2dFdmVudHMnLFxuICAgICAgJ2xvZ3M6R2V0TG9nRXZlbnRzJyxcbiAgICAgICdsb2dzOkdldExvZ0dyb3VwRmllbGRzJyxcbiAgICAgICdsb2dzOkRlc2NyaWJlTG9nR3JvdXBzJyxcbiAgICAgICdsb2dzOkRlc2NyaWJlTG9nU3RyZWFtcycsXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHaXZlIHRoZSBpbmRpY2F0ZWQgcGVybWlzc2lvbnMgb24gdGhpcyBsb2cgZ3JvdXAgYW5kIGFsbCBzdHJlYW1zXG4gICAqL1xuICBwdWJsaWMgZ3JhbnQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbE9yUmVzb3VyY2Uoe1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnMsXG4gICAgICAvLyBBIExvZ0dyb3VwIEFSTiBvdXQgb2YgQ2xvdWRGb3JtYXRpb24gYWxyZWFkeSBpbmNsdWRlcyBhICc6KicgYXQgdGhlIGVuZCB0byBpbmNsdWRlIHRoZSBsb2cgc3RyZWFtcyB1bmRlciB0aGUgZ3JvdXAuXG4gICAgICAvLyBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXJlc291cmNlLWxvZ3MtbG9nZ3JvdXAuaHRtbCN3MmFiMWMyMWMxMGM2M2M0M2MxMVxuICAgICAgcmVzb3VyY2VBcm5zOiBbdGhpcy5sb2dHcm91cEFybl0sXG4gICAgICByZXNvdXJjZTogdGhpcyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgbWV0aG9kIHRvIGdldCB0aGUgcGh5c2ljYWwgbmFtZSBvZiB0aGlzIGxvZyBncm91cFxuICAgKiBAcmV0dXJucyBQaHlzaWNhbCBuYW1lIG9mIGxvZyBncm91cFxuICAgKi9cbiAgcHVibGljIGxvZ0dyb3VwUGh5c2ljYWxOYW1lKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMucGh5c2ljYWxOYW1lO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBzdGF0ZW1lbnQgdG8gdGhlIHJlc291cmNlIHBvbGljeSBhc3NvY2lhdGVkIHdpdGggdGhpcyBsb2cgZ3JvdXAuXG4gICAqIEEgcmVzb3VyY2UgcG9saWN5IHdpbGwgYmUgYXV0b21hdGljYWxseSBjcmVhdGVkIHVwb24gdGhlIGZpcnN0IGNhbGwgdG8gYGFkZFRvUmVzb3VyY2VQb2xpY3lgLlxuICAgKlxuICAgKiBBbnkgQVJOIFByaW5jaXBhbHMgaW5zaWRlIG9mIHRoZSBzdGF0ZW1lbnQgd2lsbCBiZSBjb252ZXJ0ZWQgaW50byBBV1MgQWNjb3VudCBJRCBzdHJpbmdzXG4gICAqIGJlY2F1c2UgQ2xvdWRXYXRjaCBMb2dzIFJlc291cmNlIFBvbGljaWVzIGRvIG5vdCBhY2NlcHQgQVJOIHByaW5jaXBhbHMuXG4gICAqXG4gICAqIEBwYXJhbSBzdGF0ZW1lbnQgVGhlIHBvbGljeSBzdGF0ZW1lbnQgdG8gYWRkXG4gICAqL1xuICBwdWJsaWMgYWRkVG9SZXNvdXJjZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpOiBpYW0uQWRkVG9SZXNvdXJjZVBvbGljeVJlc3VsdCB7XG4gICAgaWYgKCF0aGlzLnBvbGljeSkge1xuICAgICAgdGhpcy5wb2xpY3kgPSBuZXcgUmVzb3VyY2VQb2xpY3kodGhpcywgJ1BvbGljeScpO1xuICAgIH1cbiAgICB0aGlzLnBvbGljeS5kb2N1bWVudC5hZGRTdGF0ZW1lbnRzKHN0YXRlbWVudC5jb3B5KHtcbiAgICAgIHByaW5jaXBhbHM6IHN0YXRlbWVudC5wcmluY2lwYWxzLm1hcChwID0+IHRoaXMuY29udmVydEFyblByaW5jcGFsVG9BY2NvdW50SWQocCkpLFxuICAgIH0pKTtcbiAgICByZXR1cm4geyBzdGF0ZW1lbnRBZGRlZDogdHJ1ZSwgcG9saWN5RGVwZW5kYWJsZTogdGhpcy5wb2xpY3kgfTtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydEFyblByaW5jcGFsVG9BY2NvdW50SWQocHJpbmNpcGFsOiBpYW0uSVByaW5jaXBhbCkge1xuICAgIGlmIChwcmluY2lwYWwucHJpbmNpcGFsQWNjb3VudCkge1xuICAgICAgLy8gd2UgdXNlIEFyblByaW5jaXBhbCBoZXJlIGJlY2F1c2UgdGhlIGNvbnN0cnVjdG9yIGluc2VydHMgdGhlIGFyZ3VtZW50XG4gICAgICAvLyBpbnRvIHRoZSB0ZW1wbGF0ZSB3aXRob3V0IG11dGF0aW5nIGl0LCB3aGljaCBtZWFucyB0aGF0IHRoZXJlIGlzIG5vXG4gICAgICAvLyBBUk4gY3JlYXRlZCBieSB0aGlzIGNhbGwuXG4gICAgICByZXR1cm4gbmV3IGlhbS5Bcm5QcmluY2lwYWwocHJpbmNpcGFsLnByaW5jaXBhbEFjY291bnQpO1xuICAgIH1cblxuICAgIGlmIChwcmluY2lwYWwgaW5zdGFuY2VvZiBpYW0uQXJuUHJpbmNpcGFsKSB7XG4gICAgICBjb25zdCBwYXJzZWRBcm4gPSBBcm4uc3BsaXQocHJpbmNpcGFsLmFybiwgQXJuRm9ybWF0LlNMQVNIX1JFU09VUkNFX05BTUUpO1xuICAgICAgaWYgKHBhcnNlZEFybi5hY2NvdW50KSB7XG4gICAgICAgIHJldHVybiBuZXcgaWFtLkFyblByaW5jaXBhbChwYXJzZWRBcm4uYWNjb3VudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHByaW5jaXBhbDtcbiAgfVxufVxuXG4vKipcbiAqIEhvdyBsb25nLCBpbiBkYXlzLCB0aGUgbG9nIGNvbnRlbnRzIHdpbGwgYmUgcmV0YWluZWQuXG4gKi9cbmV4cG9ydCBlbnVtIFJldGVudGlvbkRheXMge1xuICAvKipcbiAgICogMSBkYXlcbiAgICovXG4gIE9ORV9EQVkgPSAxLFxuXG4gIC8qKlxuICAgKiAzIGRheXNcbiAgICovXG4gIFRIUkVFX0RBWVMgPSAzLFxuXG4gIC8qKlxuICAgKiA1IGRheXNcbiAgICovXG4gIEZJVkVfREFZUyA9IDUsXG5cbiAgLyoqXG4gICAqIDEgd2Vla1xuICAgKi9cbiAgT05FX1dFRUsgPSA3LFxuXG4gIC8qKlxuICAgKiAyIHdlZWtzXG4gICAqL1xuICBUV09fV0VFS1MgPSAxNCxcblxuICAvKipcbiAgICogMSBtb250aFxuICAgKi9cbiAgT05FX01PTlRIID0gMzAsXG5cbiAgLyoqXG4gICAqIDIgbW9udGhzXG4gICAqL1xuICBUV09fTU9OVEhTID0gNjAsXG5cbiAgLyoqXG4gICAqIDMgbW9udGhzXG4gICAqL1xuICBUSFJFRV9NT05USFMgPSA5MCxcblxuICAvKipcbiAgICogNCBtb250aHNcbiAgICovXG4gIEZPVVJfTU9OVEhTID0gMTIwLFxuXG4gIC8qKlxuICAgKiA1IG1vbnRoc1xuICAgKi9cbiAgRklWRV9NT05USFMgPSAxNTAsXG5cbiAgLyoqXG4gICAqIDYgbW9udGhzXG4gICAqL1xuICBTSVhfTU9OVEhTID0gMTgwLFxuXG4gIC8qKlxuICAgKiAxIHllYXJcbiAgICovXG4gIE9ORV9ZRUFSID0gMzY1LFxuXG4gIC8qKlxuICAgKiAxMyBtb250aHNcbiAgICovXG4gIFRISVJURUVOX01PTlRIUyA9IDQwMCxcblxuICAvKipcbiAgICogMTggbW9udGhzXG4gICAqL1xuICBFSUdIVEVFTl9NT05USFMgPSA1NDUsXG5cbiAgLyoqXG4gICAqIDIgeWVhcnNcbiAgICovXG4gIFRXT19ZRUFSUyA9IDczMSxcblxuICAvKipcbiAgICogMyB5ZWFyc1xuICAgKi9cbiAgVEhSRUVfWUVBUlMgPSAxMDk2LFxuXG4gIC8qKlxuICAgKiA1IHllYXJzXG4gICAqL1xuICBGSVZFX1lFQVJTID0gMTgyNyxcblxuICAvKipcbiAgICogNiB5ZWFyc1xuICAgKi9cbiAgU0lYX1lFQVJTID0gMjE5MixcblxuICAvKipcbiAgICogNyB5ZWFyc1xuICAgKi9cbiAgU0VWRU5fWUVBUlMgPSAyNTU3LFxuXG4gIC8qKlxuICAgKiA4IHllYXJzXG4gICAqL1xuICBFSUdIVF9ZRUFSUyA9IDI5MjIsXG5cbiAgLyoqXG4gICAqIDkgeWVhcnNcbiAgICovXG4gIE5JTkVfWUVBUlMgPSAzMjg4LFxuXG4gIC8qKlxuICAgKiAxMCB5ZWFyc1xuICAgKi9cbiAgVEVOX1lFQVJTID0gMzY1MyxcblxuICAvKipcbiAgICogUmV0YWluIGxvZ3MgZm9yZXZlclxuICAgKi9cbiAgSU5GSU5JVEUgPSA5OTk5LFxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgTG9nR3JvdXBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2dHcm91cFByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBLTVMgY3VzdG9tZXIgbWFuYWdlZCBrZXkgdG8gZW5jcnlwdCB0aGUgbG9nIGdyb3VwIHdpdGguXG4gICAqXG4gICAqIEBkZWZhdWx0IFNlcnZlci1zaWRlIGVuY3JweXRpb24gbWFuYWdlZCBieSB0aGUgQ2xvdWRXYXRjaCBMb2dzIHNlcnZpY2VcbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBrbXMuSUtleTtcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgbG9nIGdyb3VwLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBdXRvbWF0aWNhbGx5IGdlbmVyYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgbG9nR3JvdXBOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBIb3cgbG9uZywgaW4gZGF5cywgdGhlIGxvZyBjb250ZW50cyB3aWxsIGJlIHJldGFpbmVkLlxuICAgKlxuICAgKiBUbyByZXRhaW4gYWxsIGxvZ3MsIHNldCB0aGlzIHZhbHVlIHRvIFJldGVudGlvbkRheXMuSU5GSU5JVEUuXG4gICAqXG4gICAqIEBkZWZhdWx0IFJldGVudGlvbkRheXMuVFdPX1lFQVJTXG4gICAqL1xuICByZWFkb25seSByZXRlbnRpb24/OiBSZXRlbnRpb25EYXlzO1xuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIHJlbW92YWwgcG9saWN5IG9mIHRoaXMgbG9nIGdyb3VwLlxuICAgKlxuICAgKiBOb3JtYWxseSB5b3Ugd2FudCB0byByZXRhaW4gdGhlIGxvZyBncm91cCBzbyB5b3UgY2FuIGRpYWdub3NlIGlzc3Vlc1xuICAgKiBmcm9tIGxvZ3MgZXZlbiBhZnRlciBhIGRlcGxveW1lbnQgdGhhdCBubyBsb25nZXIgaW5jbHVkZXMgdGhlIGxvZyBncm91cC5cbiAgICogSW4gdGhhdCBjYXNlLCB1c2UgdGhlIG5vcm1hbCBkYXRlLWJhc2VkIHJldGVudGlvbiBwb2xpY3kgdG8gYWdlIG91dCB5b3VyXG4gICAqIGxvZ3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IFJlbW92YWxQb2xpY3kuUmV0YWluXG4gICAqL1xuICByZWFkb25seSByZW1vdmFsUG9saWN5PzogUmVtb3ZhbFBvbGljeTtcbn1cblxuLyoqXG4gKiBEZWZpbmUgYSBDbG91ZFdhdGNoIExvZyBHcm91cFxuICovXG5leHBvcnQgY2xhc3MgTG9nR3JvdXAgZXh0ZW5kcyBMb2dHcm91cEJhc2Uge1xuICAvKipcbiAgICogSW1wb3J0IGFuIGV4aXN0aW5nIExvZ0dyb3VwIGdpdmVuIGl0cyBBUk5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxvZ0dyb3VwQXJuKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGxvZ0dyb3VwQXJuOiBzdHJpbmcpOiBJTG9nR3JvdXAge1xuICAgIGNvbnN0IGJhc2VMb2dHcm91cEFybiA9IGxvZ0dyb3VwQXJuLnJlcGxhY2UoLzpcXCokLywgJycpO1xuXG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgTG9nR3JvdXBCYXNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSBsb2dHcm91cEFybiA9IGAke2Jhc2VMb2dHcm91cEFybn06KmA7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbG9nR3JvdXBOYW1lID0gU3RhY2sub2Yoc2NvcGUpLnNwbGl0QXJuKGJhc2VMb2dHcm91cEFybiwgQXJuRm9ybWF0LkNPTE9OX1JFU09VUkNFX05BTUUpLnJlc291cmNlTmFtZSE7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkLCB7XG4gICAgICBlbnZpcm9ubWVudEZyb21Bcm46IGJhc2VMb2dHcm91cEFybixcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgTG9nR3JvdXAgZ2l2ZW4gaXRzIG5hbWVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUxvZ0dyb3VwTmFtZShzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBsb2dHcm91cE5hbWU6IHN0cmluZyk6IElMb2dHcm91cCB7XG4gICAgY29uc3QgYmFzZUxvZ0dyb3VwTmFtZSA9IGxvZ0dyb3VwTmFtZS5yZXBsYWNlKC86XFwqJC8sICcnKTtcblxuICAgIGNsYXNzIEltcG9ydCBleHRlbmRzIExvZ0dyb3VwQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgbG9nR3JvdXBOYW1lID0gYmFzZUxvZ0dyb3VwTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBsb2dHcm91cEFybiA9IFN0YWNrLm9mKHNjb3BlKS5mb3JtYXRBcm4oe1xuICAgICAgICBzZXJ2aWNlOiAnbG9ncycsXG4gICAgICAgIHJlc291cmNlOiAnbG9nLWdyb3VwJyxcbiAgICAgICAgYXJuRm9ybWF0OiBBcm5Gb3JtYXQuQ09MT05fUkVTT1VSQ0VfTkFNRSxcbiAgICAgICAgcmVzb3VyY2VOYW1lOiBiYXNlTG9nR3JvdXBOYW1lICsgJzoqJyxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgSW1wb3J0KHNjb3BlLCBpZCk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGlzIGxvZyBncm91cFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGxvZ0dyb3VwQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoaXMgbG9nIGdyb3VwXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgbG9nR3JvdXBOYW1lOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExvZ0dyb3VwUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgcGh5c2ljYWxOYW1lOiBwcm9wcy5sb2dHcm91cE5hbWUsXG4gICAgfSk7XG5cbiAgICBsZXQgcmV0ZW50aW9uSW5EYXlzID0gcHJvcHMucmV0ZW50aW9uO1xuICAgIGlmIChyZXRlbnRpb25JbkRheXMgPT09IHVuZGVmaW5lZCkgeyByZXRlbnRpb25JbkRheXMgPSBSZXRlbnRpb25EYXlzLlRXT19ZRUFSUzsgfVxuICAgIGlmIChyZXRlbnRpb25JbkRheXMgPT09IEluZmluaXR5IHx8IHJldGVudGlvbkluRGF5cyA9PT0gUmV0ZW50aW9uRGF5cy5JTkZJTklURSkgeyByZXRlbnRpb25JbkRheXMgPSB1bmRlZmluZWQ7IH1cblxuICAgIGlmIChyZXRlbnRpb25JbkRheXMgIT09IHVuZGVmaW5lZCAmJiAhVG9rZW4uaXNVbnJlc29sdmVkKHJldGVudGlvbkluRGF5cykgJiYgcmV0ZW50aW9uSW5EYXlzIDw9IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgcmV0ZW50aW9uSW5EYXlzIG11c3QgYmUgcG9zaXRpdmUsIGdvdCAke3JldGVudGlvbkluRGF5c31gKTtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvdXJjZSA9IG5ldyBDZm5Mb2dHcm91cCh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICBrbXNLZXlJZDogcHJvcHMuZW5jcnlwdGlvbktleT8ua2V5QXJuLFxuICAgICAgbG9nR3JvdXBOYW1lOiB0aGlzLnBoeXNpY2FsTmFtZSxcbiAgICAgIHJldGVudGlvbkluRGF5cyxcbiAgICB9KTtcblxuICAgIHJlc291cmNlLmFwcGx5UmVtb3ZhbFBvbGljeShwcm9wcy5yZW1vdmFsUG9saWN5KTtcblxuICAgIHRoaXMubG9nR3JvdXBBcm4gPSB0aGlzLmdldFJlc291cmNlQXJuQXR0cmlidXRlKHJlc291cmNlLmF0dHJBcm4sIHtcbiAgICAgIHNlcnZpY2U6ICdsb2dzJyxcbiAgICAgIHJlc291cmNlOiAnbG9nLWdyb3VwJyxcbiAgICAgIHJlc291cmNlTmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICBhcm5Gb3JtYXQ6IEFybkZvcm1hdC5DT0xPTl9SRVNPVVJDRV9OQU1FLFxuICAgIH0pO1xuICAgIHRoaXMubG9nR3JvdXBOYW1lID0gdGhpcy5nZXRSZXNvdXJjZU5hbWVBdHRyaWJ1dGUocmVzb3VyY2UucmVmKTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgbmV3IExvZ1N0cmVhbSBjcmVhdGVkIGZyb20gYSBMb2dHcm91cFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0cmVhbU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIGxvZyBzdHJlYW0gdG8gY3JlYXRlLlxuICAgKlxuICAgKiBUaGUgbmFtZSBtdXN0IGJlIHVuaXF1ZSB3aXRoaW4gdGhlIGxvZyBncm91cC5cbiAgICpcbiAgICogQGRlZmF1bHQgQXV0b21hdGljYWxseSBnZW5lcmF0ZWRcbiAgICovXG4gIHJlYWRvbmx5IGxvZ1N0cmVhbU5hbWU/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYSBuZXcgU3Vic2NyaXB0aW9uRmlsdGVyIGNyZWF0ZWQgZnJvbSBhIExvZ0dyb3VwXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3Vic2NyaXB0aW9uRmlsdGVyT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgZGVzdGluYXRpb24gdG8gc2VuZCB0aGUgZmlsdGVyZWQgZXZlbnRzIHRvLlxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgYSBLaW5lc2lzIHN0cmVhbSBvciBhIExhbWJkYSBmdW5jdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGRlc3RpbmF0aW9uOiBJTG9nU3Vic2NyaXB0aW9uRGVzdGluYXRpb247XG5cbiAgLyoqXG4gICAqIExvZyBldmVudHMgbWF0Y2hpbmcgdGhpcyBwYXR0ZXJuIHdpbGwgYmUgc2VudCB0byB0aGUgZGVzdGluYXRpb24uXG4gICAqL1xuICByZWFkb25seSBmaWx0ZXJQYXR0ZXJuOiBJRmlsdGVyUGF0dGVybjtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBhIE1ldHJpY0ZpbHRlciBjcmVhdGVkIGZyb20gYSBMb2dHcm91cFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE1ldHJpY0ZpbHRlck9wdGlvbnMge1xuICAvKipcbiAgICogUGF0dGVybiB0byBzZWFyY2ggZm9yIGxvZyBldmVudHMuXG4gICAqL1xuICByZWFkb25seSBmaWx0ZXJQYXR0ZXJuOiBJRmlsdGVyUGF0dGVybjtcblxuICAvKipcbiAgICogVGhlIG5hbWVzcGFjZSBvZiB0aGUgbWV0cmljIHRvIGVtaXQuXG4gICAqL1xuICByZWFkb25seSBtZXRyaWNOYW1lc3BhY2U6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIG1ldHJpYyB0byBlbWl0LlxuICAgKi9cbiAgcmVhZG9ubHkgbWV0cmljTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgdG8gZW1pdCBmb3IgdGhlIG1ldHJpYy5cbiAgICpcbiAgICogQ2FuIGVpdGhlciBiZSBhIGxpdGVyYWwgbnVtYmVyICh0eXBpY2FsbHkgXCIxXCIpLCBvciB0aGUgbmFtZSBvZiBhIGZpZWxkIGluIHRoZSBzdHJ1Y3R1cmVcbiAgICogdG8gdGFrZSB0aGUgdmFsdWUgZnJvbSB0aGUgbWF0Y2hlZCBldmVudC4gSWYgeW91IGFyZSB1c2luZyBhIGZpZWxkIHZhbHVlLCB0aGUgZmllbGRcbiAgICogdmFsdWUgbXVzdCBoYXZlIGJlZW4gbWF0Y2hlZCB1c2luZyB0aGUgcGF0dGVybi5cbiAgICpcbiAgICogSWYgeW91IHdhbnQgdG8gc3BlY2lmeSBhIGZpZWxkIGZyb20gYSBtYXRjaGVkIEpTT04gc3RydWN0dXJlLCB1c2UgJyQuZmllbGROYW1lJyxcbiAgICogYW5kIG1ha2Ugc3VyZSB0aGUgZmllbGQgaXMgaW4gdGhlIHBhdHRlcm4gKGlmIG9ubHkgYXMgJyQuZmllbGROYW1lID0gKicpLlxuICAgKlxuICAgKiBJZiB5b3Ugd2FudCB0byBzcGVjaWZ5IGEgZmllbGQgZnJvbSBhIG1hdGNoZWQgc3BhY2UtZGVsaW1pdGVkIHN0cnVjdHVyZSxcbiAgICogdXNlICckZmllbGROYW1lJy5cbiAgICpcbiAgICogQGRlZmF1bHQgXCIxXCJcbiAgICovXG4gIHJlYWRvbmx5IG1ldHJpY1ZhbHVlPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgdG8gZW1pdCBpZiB0aGUgcGF0dGVybiBkb2VzIG5vdCBtYXRjaCBhIHBhcnRpY3VsYXIgZXZlbnQuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIG1ldHJpYyBlbWl0dGVkLlxuICAgKi9cbiAgcmVhZG9ubHkgZGVmYXVsdFZhbHVlPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgZmllbGRzIHRvIHVzZSBhcyBkaW1lbnNpb25zIGZvciB0aGUgbWV0cmljLiBPbmUgbWV0cmljIGZpbHRlciBjYW4gaW5jbHVkZSBhcyBtYW55IGFzIHRocmVlIGRpbWVuc2lvbnMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtbG9ncy1tZXRyaWNmaWx0ZXItbWV0cmljdHJhbnNmb3JtYXRpb24uaHRtbCNjZm4tbG9ncy1tZXRyaWNmaWx0ZXItbWV0cmljdHJhbnNmb3JtYXRpb24tZGltZW5zaW9uc1xuICAgKiBAZGVmYXVsdCAtIE5vIGRpbWVuc2lvbnMgYXR0YWNoZWQgdG8gbWV0cmljcy5cbiAgICovXG4gIHJlYWRvbmx5IGRpbWVuc2lvbnM/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBUaGUgdW5pdCB0byBhc3NpZ24gdG8gdGhlIG1ldHJpYy5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbi5odG1sI2Nmbi1sb2dzLW1ldHJpY2ZpbHRlci1tZXRyaWN0cmFuc2Zvcm1hdGlvbi11bml0XG4gICAqIEBkZWZhdWx0IC0gTm8gdW5pdCBhdHRhY2hlZCB0byBtZXRyaWNzLlxuICAgKi9cbiAgcmVhZG9ubHkgdW5pdD86IGNsb3Vkd2F0Y2guVW5pdDtcbn1cbiJdfQ==