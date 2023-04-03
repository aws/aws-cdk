"use strict";
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowLog = exports.LogFormat = exports.FlowLogMaxAggregationInterval = exports.FlowLogDestination = exports.FlowLogFileFormat = exports.FlowLogResourceType = exports.FlowLogDestinationType = exports.FlowLogTrafficType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const logs = require("@aws-cdk/aws-logs");
const s3 = require("@aws-cdk/aws-s3");
const core_1 = require("@aws-cdk/core");
const cx_api_1 = require("@aws-cdk/cx-api");
const ec2_generated_1 = require("./ec2.generated");
/**
 * The type of VPC traffic to log
 */
var FlowLogTrafficType;
(function (FlowLogTrafficType) {
    /**
     * Only log accepts
     */
    FlowLogTrafficType["ACCEPT"] = "ACCEPT";
    /**
     * Log all requests
     */
    FlowLogTrafficType["ALL"] = "ALL";
    /**
     * Only log rejects
     */
    FlowLogTrafficType["REJECT"] = "REJECT";
})(FlowLogTrafficType = exports.FlowLogTrafficType || (exports.FlowLogTrafficType = {}));
/**
 * The available destination types for Flow Logs
 */
var FlowLogDestinationType;
(function (FlowLogDestinationType) {
    /**
     * Send flow logs to CloudWatch Logs Group
     */
    FlowLogDestinationType["CLOUD_WATCH_LOGS"] = "cloud-watch-logs";
    /**
     * Send flow logs to S3 Bucket
     */
    FlowLogDestinationType["S3"] = "s3";
})(FlowLogDestinationType = exports.FlowLogDestinationType || (exports.FlowLogDestinationType = {}));
/**
 * The type of resource to create the flow log for
 */
class FlowLogResourceType {
    /**
     * The subnet to attach the Flow Log to
     */
    static fromSubnet(subnet) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ISubnet(subnet);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSubnet);
            }
            throw error;
        }
        return {
            resourceType: 'Subnet',
            resourceId: subnet.subnetId,
        };
    }
    /**
     * The VPC to attach the Flow Log to
     */
    static fromVpc(vpc) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_IVpc(vpc);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromVpc);
            }
            throw error;
        }
        return {
            resourceType: 'VPC',
            resourceId: vpc.vpcId,
        };
    }
    /**
     * The Network Interface to attach the Flow Log to
     */
    static fromNetworkInterfaceId(id) {
        return {
            resourceType: 'NetworkInterface',
            resourceId: id,
        };
    }
}
exports.FlowLogResourceType = FlowLogResourceType;
_a = JSII_RTTI_SYMBOL_1;
FlowLogResourceType[_a] = { fqn: "@aws-cdk/aws-ec2.FlowLogResourceType", version: "0.0.0" };
/**
 * The file format for flow logs written to an S3 bucket destination
 */
var FlowLogFileFormat;
(function (FlowLogFileFormat) {
    /**
     * File will be written as plain text
     *
     * This is the default value
     */
    FlowLogFileFormat["PLAIN_TEXT"] = "plain-text";
    /**
     * File will be written in parquet format
     */
    FlowLogFileFormat["PARQUET"] = "parquet";
})(FlowLogFileFormat = exports.FlowLogFileFormat || (exports.FlowLogFileFormat = {}));
/**
 * The destination type for the flow log
 */
class FlowLogDestination {
    /**
     * Use CloudWatch logs as the destination
     */
    static toCloudWatchLogs(logGroup, iamRole) {
        return new CloudWatchLogsDestination({
            logDestinationType: FlowLogDestinationType.CLOUD_WATCH_LOGS,
            logGroup,
            iamRole,
        });
    }
    /**
     * Use S3 as the destination
     *
     * @param bucket optional s3 bucket to publish logs to. If one is not provided
     * a default bucket will be created
     * @param keyPrefix optional prefix within the bucket to write logs to
     * @param options additional s3 destination options
     */
    static toS3(bucket, keyPrefix, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_S3DestinationOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.toS3);
            }
            throw error;
        }
        return new S3Destination({
            logDestinationType: FlowLogDestinationType.S3,
            s3Bucket: bucket,
            keyPrefix,
            destinationOptions: options,
        });
    }
}
exports.FlowLogDestination = FlowLogDestination;
_b = JSII_RTTI_SYMBOL_1;
FlowLogDestination[_b] = { fqn: "@aws-cdk/aws-ec2.FlowLogDestination", version: "0.0.0" };
/**
 *
 */
class S3Destination extends FlowLogDestination {
    constructor(props) {
        super();
        this.props = props;
    }
    bind(scope, _flowLog) {
        let s3Bucket;
        if (this.props.s3Bucket === undefined) {
            s3Bucket = new s3.Bucket(scope, 'Bucket', {
                encryption: s3.BucketEncryption.UNENCRYPTED,
                removalPolicy: core_1.RemovalPolicy.RETAIN,
            });
        }
        else {
            s3Bucket = this.props.s3Bucket;
        }
        // https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html#flow-logs-s3-permissions
        if (core_1.FeatureFlags.of(scope).isEnabled(cx_api_1.S3_CREATE_DEFAULT_LOGGING_POLICY)) {
            const stack = core_1.Stack.of(scope);
            let keyPrefix = this.props.keyPrefix ?? '';
            if (keyPrefix && !keyPrefix.endsWith('/')) {
                keyPrefix = keyPrefix + '/';
            }
            const prefix = this.props.destinationOptions?.hiveCompatiblePartitions
                ? s3Bucket.arnForObjects(`${keyPrefix}AWSLogs/aws-account-id=${stack.account}/*`)
                : s3Bucket.arnForObjects(`${keyPrefix}AWSLogs/${stack.account}/*`);
            s3Bucket.addToResourcePolicy(new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                principals: [
                    new iam.ServicePrincipal('delivery.logs.amazonaws.com'),
                ],
                resources: [
                    prefix,
                ],
                actions: ['s3:PutObject'],
                conditions: {
                    StringEquals: {
                        's3:x-amz-acl': 'bucket-owner-full-control',
                        'aws:SourceAccount': stack.account,
                    },
                    ArnLike: {
                        'aws:SourceArn': stack.formatArn({
                            service: 'logs',
                            resource: '*',
                        }),
                    },
                },
            }));
            s3Bucket.addToResourcePolicy(new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                principals: [
                    new iam.ServicePrincipal('delivery.logs.amazonaws.com'),
                ],
                resources: [s3Bucket.bucketArn],
                actions: [
                    's3:GetBucketAcl',
                    's3:ListBucket',
                ],
                conditions: {
                    StringEquals: {
                        'aws:SourceAccount': stack.account,
                    },
                    ArnLike: {
                        'aws:SourceArn': stack.formatArn({
                            service: 'logs',
                            resource: '*',
                        }),
                    },
                },
            }));
        }
        return {
            logDestinationType: FlowLogDestinationType.S3,
            s3Bucket,
            keyPrefix: this.props.keyPrefix,
            destinationOptions: (this.props.destinationOptions?.fileFormat || this.props.destinationOptions?.perHourPartition
                || this.props.destinationOptions?.hiveCompatiblePartitions)
                ? {
                    fileFormat: this.props.destinationOptions.fileFormat ?? FlowLogFileFormat.PLAIN_TEXT,
                    perHourPartition: this.props.destinationOptions.perHourPartition ?? false,
                    hiveCompatiblePartitions: this.props.destinationOptions.hiveCompatiblePartitions ?? false,
                } : undefined,
        };
    }
}
/**
 *
 */
class CloudWatchLogsDestination extends FlowLogDestination {
    constructor(props) {
        super();
        this.props = props;
    }
    bind(scope, _flowLog) {
        let iamRole;
        let logGroup;
        if (this.props.iamRole === undefined) {
            iamRole = new iam.Role(scope, 'IAMRole', {
                roleName: core_1.PhysicalName.GENERATE_IF_NEEDED,
                assumedBy: new iam.ServicePrincipal('vpc-flow-logs.amazonaws.com'),
            });
        }
        else {
            iamRole = this.props.iamRole;
        }
        if (this.props.logGroup === undefined) {
            logGroup = new logs.LogGroup(scope, 'LogGroup');
        }
        else {
            logGroup = this.props.logGroup;
        }
        iamRole.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: [
                'logs:CreateLogStream',
                'logs:PutLogEvents',
                'logs:DescribeLogStreams',
            ],
            effect: iam.Effect.ALLOW,
            resources: [logGroup.logGroupArn],
        }));
        iamRole.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['iam:PassRole'],
            effect: iam.Effect.ALLOW,
            resources: [iamRole.roleArn],
        }));
        return {
            logDestinationType: FlowLogDestinationType.CLOUD_WATCH_LOGS,
            logGroup,
            iamRole,
        };
    }
}
/**
 * The maximum interval of time during which a flow of packets
 * is captured and aggregated into a flow log record.
 *
 */
var FlowLogMaxAggregationInterval;
(function (FlowLogMaxAggregationInterval) {
    /**
     * 1 minute (60 seconds)
     */
    FlowLogMaxAggregationInterval[FlowLogMaxAggregationInterval["ONE_MINUTE"] = 60] = "ONE_MINUTE";
    /**
     * 10 minutes (600 seconds)
     */
    FlowLogMaxAggregationInterval[FlowLogMaxAggregationInterval["TEN_MINUTES"] = 600] = "TEN_MINUTES";
})(FlowLogMaxAggregationInterval = exports.FlowLogMaxAggregationInterval || (exports.FlowLogMaxAggregationInterval = {}));
/**
 * The following table describes all of the available fields for a flow log record.
 */
class LogFormat {
    constructor(value) {
        this.value = value;
    }
    /**
     * A custom format string.
     *
     * Gives full control over the format string fragment.
     */
    static custom(formatString) {
        return new LogFormat(formatString);
    }
    /**
     * A custom field name.
     *
     * If there is no ready-made constant for a new field yet, you can use this.
     * The field name will automatically be wrapped in `${ ... }`.
     */
    static field(field) {
        return new LogFormat(`\${${field}}`);
    }
}
exports.LogFormat = LogFormat;
_c = JSII_RTTI_SYMBOL_1;
LogFormat[_c] = { fqn: "@aws-cdk/aws-ec2.LogFormat", version: "0.0.0" };
/**
 * The VPC Flow Logs version.
 */
LogFormat.VERSION = new LogFormat('${version}');
/**
 * The AWS account ID of the owner of the source network interface for which traffic is recorded.
 */
LogFormat.ACCOUNT_ID = new LogFormat('${account-id}');
/**
 * The ID of the network interface for which the traffic is recorded.
 */
LogFormat.INTERFACE_ID = new LogFormat('${interface-id');
/**
 * The source address for incoming traffic, or the IPv4 or IPv6 address of the network interface
 * for outgoing traffic on the network interface.
 */
LogFormat.SRC_ADDR = new LogFormat('${srcaddr}');
/**
 * The destination address for outgoing traffic, or the IPv4 or IPv6 address of the network interface
 * for incoming traffic on the network interface.
 */
LogFormat.DST_ADDR = new LogFormat('${dstaddr}');
/**
 * The source port of the traffic.
 */
LogFormat.SRC_PORT = new LogFormat('${srcport}');
/**
 * The destination port of the traffic.
 */
LogFormat.DST_PORT = new LogFormat('${dstport}');
/**
 * The IANA protocol number of the traffic.
 */
LogFormat.PROTOCOL = new LogFormat('${protocol}');
/**
 * The number of packets transferred during the flow.
 */
LogFormat.PACKETS = new LogFormat('${packets}');
/**
 * The number of bytes transferred during the flow.
 */
LogFormat.BYTES = new LogFormat('${bytes}');
/**
 * The packet-level (original) source IP address of the traffic.
 */
LogFormat.PKT_SRC_ADDR = new LogFormat('${pkt-srcaddr}');
/**
 * The packet-level (original) destination IP address for the traffic.
 */
LogFormat.PKT_DST_ADDR = new LogFormat('${pkt-dstaddr}');
/**
 * The Region that contains the network interface for which traffic is recorded.
 */
LogFormat.REGION = new LogFormat('${region}');
/**
 * The ID of the Availability Zone that contains the network interface for which traffic is recorded.
 */
LogFormat.AZ_ID = new LogFormat('${az-id}');
/**
 * The type of sublocation that's returned in the sublocation-id field.
 */
LogFormat.SUBLOCATION_TYPE = new LogFormat('${sublocation-type}');
/**
 * The ID of the sublocation that contains the network interface for which traffic is recorded.
 */
LogFormat.SUBLOCATION_ID = new LogFormat('${sublocation-id}');
/**
 * The name of the subset of IP address ranges for the pkt-srcaddr field,
 * if the source IP address is for an AWS service.
 */
LogFormat.PKT_SRC_AWS_SERVICE = new LogFormat('${pkt-src-aws-service}');
/**
 * The name of the subset of IP address ranges for the pkt-dstaddr field,
 * if the destination IP address is for an AWS service.
 */
LogFormat.PKT_DST_AWS_SERVICE = new LogFormat('${pkt-dst-aws-service}');
/**
 * The direction of the flow with respect to the interface where traffic is captured.
 */
LogFormat.FLOW_DIRECTION = new LogFormat('${flow-direction}');
/**
 * The path that egress traffic takes to the destination.
 */
LogFormat.TRAFFIC_PATH = new LogFormat('${traffic-path}');
/**
 * The default format.
 */
LogFormat.ALL_DEFAULT_FIELDS = new LogFormat('${version} ${account-id} ${interface-id} ${srcaddr} ${dstaddr} ${srcport} ${dstport} ${protocol} ${packets} ${bytes} ${start} ${end} ${action} ${log-status}');
/**
 * The base class for a Flow Log
 */
class FlowLogBase extends core_1.Resource {
}
/**
 * A VPC flow log.
 * @resource AWS::EC2::FlowLog
 */
class FlowLog extends FlowLogBase {
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.flowLogName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_FlowLogProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, FlowLog);
            }
            throw error;
        }
        const destination = props.destination || FlowLogDestination.toCloudWatchLogs();
        const destinationConfig = destination.bind(this, this);
        this.logGroup = destinationConfig.logGroup;
        this.bucket = destinationConfig.s3Bucket;
        this.iamRole = destinationConfig.iamRole;
        this.keyPrefix = destinationConfig.keyPrefix;
        let logDestination = undefined;
        if (this.bucket) {
            logDestination = this.keyPrefix ? this.bucket.arnForObjects(this.keyPrefix) : this.bucket.bucketArn;
        }
        let customLogFormat = undefined;
        if (props.logFormat) {
            customLogFormat = props.logFormat.map(elm => {
                return elm.value;
            }).join(' ');
        }
        const flowLog = new ec2_generated_1.CfnFlowLog(this, 'FlowLog', {
            destinationOptions: destinationConfig.destinationOptions,
            deliverLogsPermissionArn: this.iamRole ? this.iamRole.roleArn : undefined,
            logDestinationType: destinationConfig.logDestinationType,
            logGroupName: this.logGroup ? this.logGroup.logGroupName : undefined,
            maxAggregationInterval: props.maxAggregationInterval,
            resourceId: props.resourceType.resourceId,
            resourceType: props.resourceType.resourceType,
            trafficType: props.trafficType
                ? props.trafficType
                : FlowLogTrafficType.ALL,
            logFormat: customLogFormat,
            logDestination,
        });
        // VPC service implicitly tries to create a bucket policy when adding a vpc flow log.
        // To avoid the race condition, we add an explicit dependency here.
        if (this.bucket?.policy?.node.defaultChild instanceof core_1.CfnResource) {
            flowLog.addDependency(this.bucket?.policy.node.defaultChild);
        }
        // we must remove a flow log configuration first before deleting objects.
        const deleteObjects = this.bucket?.node.tryFindChild('AutoDeleteObjectsCustomResource')?.node.defaultChild;
        if (deleteObjects instanceof core_1.CfnResource) {
            flowLog.addDependency(deleteObjects);
        }
        this.flowLogId = flowLog.ref;
        this.node.defaultChild = flowLog;
    }
    /**
     * Import a Flow Log by it's Id
     */
    static fromFlowLogId(scope, id, flowLogId) {
        class Import extends FlowLogBase {
            constructor() {
                super(...arguments);
                this.flowLogId = flowLogId;
            }
        }
        return new Import(scope, id);
    }
}
exports.FlowLog = FlowLog;
_d = JSII_RTTI_SYMBOL_1;
FlowLog[_d] = { fqn: "@aws-cdk/aws-ec2.FlowLog", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLWZsb3ctbG9ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZwYy1mbG93LWxvZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdDO0FBQ3hDLDBDQUEwQztBQUMxQyxzQ0FBc0M7QUFDdEMsd0NBQW1IO0FBQ25ILDRDQUFtRTtBQUVuRSxtREFBNkM7QUFlN0M7O0dBRUc7QUFDSCxJQUFZLGtCQWVYO0FBZkQsV0FBWSxrQkFBa0I7SUFDNUI7O09BRUc7SUFDSCx1Q0FBaUIsQ0FBQTtJQUVqQjs7T0FFRztJQUNILGlDQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILHVDQUFpQixDQUFBO0FBQ25CLENBQUMsRUFmVyxrQkFBa0IsR0FBbEIsMEJBQWtCLEtBQWxCLDBCQUFrQixRQWU3QjtBQUVEOztHQUVHO0FBQ0gsSUFBWSxzQkFVWDtBQVZELFdBQVksc0JBQXNCO0lBQ2hDOztPQUVHO0lBQ0gsK0RBQXFDLENBQUE7SUFFckM7O09BRUc7SUFDSCxtQ0FBUyxDQUFBO0FBQ1gsQ0FBQyxFQVZXLHNCQUFzQixHQUF0Qiw4QkFBc0IsS0FBdEIsOEJBQXNCLFFBVWpDO0FBRUQ7O0dBRUc7QUFDSCxNQUFzQixtQkFBbUI7SUFDdkM7O09BRUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQWU7Ozs7Ozs7Ozs7UUFDdEMsT0FBTztZQUNMLFlBQVksRUFBRSxRQUFRO1lBQ3RCLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUTtTQUM1QixDQUFDO0tBQ0g7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBUzs7Ozs7Ozs7OztRQUM3QixPQUFPO1lBQ0wsWUFBWSxFQUFFLEtBQUs7WUFDbkIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxLQUFLO1NBQ3RCLENBQUM7S0FDSDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLHNCQUFzQixDQUFDLEVBQVU7UUFDN0MsT0FBTztZQUNMLFlBQVksRUFBRSxrQkFBa0I7WUFDaEMs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MEJBNkZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgbG9ncyBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdAYXdzLWNkay9hd3MtczMnO1xuaW1wb3J0IHsgSVJlc291cmNlLCBQaHlzaWNhbE5hbWUsIFJlbW92YWxQb2xpY3ksIFJlc291cmNlLCBGZWF0dXJlRmxhZ3MsIFN0YWNrLCBDZm5SZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgUzNfQ1JFQVRFX0RFRkFVTFRfTE9HR0lOR19QT0xJQ1kgfSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBDZm5GbG93TG9nIH0gZnJvbSAnLi9lYzIuZ2VuZXJhdGVkJztcbmltcG9ydCB7IElTdWJuZXQsIElWcGMgfSBmcm9tICcuL3ZwYyc7XG5cbi8qKlxuICogQSBGbG93TG9nXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSUZsb3dMb2cgZXh0ZW5kcyBJUmVzb3VyY2Uge1xuICAvKipcbiAgICogVGhlIElkIG9mIHRoZSBWUEMgRmxvdyBMb2dcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZmxvd0xvZ0lkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIHR5cGUgb2YgVlBDIHRyYWZmaWMgdG8gbG9nXG4gKi9cbmV4cG9ydCBlbnVtIEZsb3dMb2dUcmFmZmljVHlwZSB7XG4gIC8qKlxuICAgKiBPbmx5IGxvZyBhY2NlcHRzXG4gICAqL1xuICBBQ0NFUFQgPSAnQUNDRVBUJyxcblxuICAvKipcbiAgICogTG9nIGFsbCByZXF1ZXN0c1xuICAgKi9cbiAgQUxMID0gJ0FMTCcsXG5cbiAgLyoqXG4gICAqIE9ubHkgbG9nIHJlamVjdHNcbiAgICovXG4gIFJFSkVDVCA9ICdSRUpFQ1QnXG59XG5cbi8qKlxuICogVGhlIGF2YWlsYWJsZSBkZXN0aW5hdGlvbiB0eXBlcyBmb3IgRmxvdyBMb2dzXG4gKi9cbmV4cG9ydCBlbnVtIEZsb3dMb2dEZXN0aW5hdGlvblR5cGUge1xuICAvKipcbiAgICogU2VuZCBmbG93IGxvZ3MgdG8gQ2xvdWRXYXRjaCBMb2dzIEdyb3VwXG4gICAqL1xuICBDTE9VRF9XQVRDSF9MT0dTID0gJ2Nsb3VkLXdhdGNoLWxvZ3MnLFxuXG4gIC8qKlxuICAgKiBTZW5kIGZsb3cgbG9ncyB0byBTMyBCdWNrZXRcbiAgICovXG4gIFMzID0gJ3MzJ1xufVxuXG4vKipcbiAqIFRoZSB0eXBlIG9mIHJlc291cmNlIHRvIGNyZWF0ZSB0aGUgZmxvdyBsb2cgZm9yXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBGbG93TG9nUmVzb3VyY2VUeXBlIHtcbiAgLyoqXG4gICAqIFRoZSBzdWJuZXQgdG8gYXR0YWNoIHRoZSBGbG93IExvZyB0b1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU3VibmV0KHN1Ym5ldDogSVN1Ym5ldCk6IEZsb3dMb2dSZXNvdXJjZVR5cGUge1xuICAgIHJldHVybiB7XG4gICAgICByZXNvdXJjZVR5cGU6ICdTdWJuZXQnLFxuICAgICAgcmVzb3VyY2VJZDogc3VibmV0LnN1Ym5ldElkLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGhlIFZQQyB0byBhdHRhY2ggdGhlIEZsb3cgTG9nIHRvXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21WcGModnBjOiBJVnBjKTogRmxvd0xvZ1Jlc291cmNlVHlwZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc291cmNlVHlwZTogJ1ZQQycsXG4gICAgICByZXNvdXJjZUlkOiB2cGMudnBjSWQsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgTmV0d29yayBJbnRlcmZhY2UgdG8gYXR0YWNoIHRoZSBGbG93IExvZyB0b1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tTmV0d29ya0ludGVyZmFjZUlkKGlkOiBzdHJpbmcpOiBGbG93TG9nUmVzb3VyY2VUeXBlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzb3VyY2VUeXBlOiAnTmV0d29ya0ludGVyZmFjZScsXG4gICAgICByZXNvdXJjZUlkOiBpZCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHJlc291cmNlIHRvIGF0dGFjaCBhIGZsb3cgbG9nIHRvLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlc291cmNlVHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgSWQgb2YgdGhlIHJlc291cmNlIHRoYXQgdGhlIGZsb3cgbG9nIHNob3VsZCBiZSBhdHRhY2hlZCB0by5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZXNvdXJjZUlkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogVGhlIGZpbGUgZm9ybWF0IGZvciBmbG93IGxvZ3Mgd3JpdHRlbiB0byBhbiBTMyBidWNrZXQgZGVzdGluYXRpb25cbiAqL1xuZXhwb3J0IGVudW0gRmxvd0xvZ0ZpbGVGb3JtYXQge1xuICAvKipcbiAgICogRmlsZSB3aWxsIGJlIHdyaXR0ZW4gYXMgcGxhaW4gdGV4dFxuICAgKlxuICAgKiBUaGlzIGlzIHRoZSBkZWZhdWx0IHZhbHVlXG4gICAqL1xuICBQTEFJTl9URVhUID0gJ3BsYWluLXRleHQnLFxuXG4gIC8qKlxuICAgKiBGaWxlIHdpbGwgYmUgd3JpdHRlbiBpbiBwYXJxdWV0IGZvcm1hdFxuICAgKi9cbiAgUEFSUVVFVCA9ICdwYXJxdWV0Jyxcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciB3cml0aW5nIGxvZ3MgdG8gYSBTMyBkZXN0aW5hdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIFMzRGVzdGluYXRpb25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFVzZSBIaXZlLWNvbXBhdGlibGUgcHJlZml4ZXMgZm9yIGZsb3cgbG9nc1xuICAgKiBzdG9yZWQgaW4gQW1hem9uIFMzXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBoaXZlQ29tcGF0aWJsZVBhcnRpdGlvbnM/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgZm9ybWF0IGZvciB0aGUgZmxvdyBsb2dcbiAgICpcbiAgICogQGRlZmF1bHQgRmxvd0xvZ0ZpbGVGb3JtYXQuUExBSU5fVEVYVFxuICAgKi9cbiAgcmVhZG9ubHkgZmlsZUZvcm1hdD86IEZsb3dMb2dGaWxlRm9ybWF0O1xuXG4gIC8qKlxuICAgKiBQYXJ0aXRpb24gdGhlIGZsb3cgbG9nIHBlciBob3VyXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwZXJIb3VyUGFydGl0aW9uPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIGZvciB3cml0aW5nIGxvZ3MgdG8gYSBkZXN0aW5hdGlvblxuICpcbiAqIFRPRE86IHRoZXJlIGFyZSBvdGhlciBkZXN0aW5hdGlvbiBvcHRpb25zLCBjdXJyZW50bHkgdGhleSBhcmVcbiAqIG9ubHkgZm9yIHMzIGRlc3RpbmF0aW9ucyAobm90IHN1cmUgaWYgdGhhdCB3aWxsIGNoYW5nZSlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBEZXN0aW5hdGlvbk9wdGlvbnMgZXh0ZW5kcyBTM0Rlc3RpbmF0aW9uT3B0aW9ucyB7IH1cblxuXG4vKipcbiAqIFRoZSBkZXN0aW5hdGlvbiB0eXBlIGZvciB0aGUgZmxvdyBsb2dcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEZsb3dMb2dEZXN0aW5hdGlvbiB7XG4gIC8qKlxuICAgKiBVc2UgQ2xvdWRXYXRjaCBsb2dzIGFzIHRoZSBkZXN0aW5hdGlvblxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0b0Nsb3VkV2F0Y2hMb2dzKGxvZ0dyb3VwPzogbG9ncy5JTG9nR3JvdXAsIGlhbVJvbGU/OiBpYW0uSVJvbGUpOiBGbG93TG9nRGVzdGluYXRpb24ge1xuICAgIHJldHVybiBuZXcgQ2xvdWRXYXRjaExvZ3NEZXN0aW5hdGlvbih7XG4gICAgICBsb2dEZXN0aW5hdGlvblR5cGU6IEZsb3dMb2dEZXN0aW5hdGlvblR5cGUuQ0xPVURfV0FUQ0hfTE9HUyxcbiAgICAgIGxvZ0dyb3VwLFxuICAgICAgaWFtUm9sZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBVc2UgUzMgYXMgdGhlIGRlc3RpbmF0aW9uXG4gICAqXG4gICAqIEBwYXJhbSBidWNrZXQgb3B0aW9uYWwgczMgYnVja2V0IHRvIHB1Ymxpc2ggbG9ncyB0by4gSWYgb25lIGlzIG5vdCBwcm92aWRlZFxuICAgKiBhIGRlZmF1bHQgYnVja2V0IHdpbGwgYmUgY3JlYXRlZFxuICAgKiBAcGFyYW0ga2V5UHJlZml4IG9wdGlvbmFsIHByZWZpeCB3aXRoaW4gdGhlIGJ1Y2tldCB0byB3cml0ZSBsb2dzIHRvXG4gICAqIEBwYXJhbSBvcHRpb25zIGFkZGl0aW9uYWwgczMgZGVzdGluYXRpb24gb3B0aW9uc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyB0b1MzKGJ1Y2tldD86IHMzLklCdWNrZXQsIGtleVByZWZpeD86IHN0cmluZywgb3B0aW9ucz86IFMzRGVzdGluYXRpb25PcHRpb25zKTogRmxvd0xvZ0Rlc3RpbmF0aW9uIHtcbiAgICByZXR1cm4gbmV3IFMzRGVzdGluYXRpb24oe1xuICAgICAgbG9nRGVzdGluYXRpb25UeXBlOiBGbG93TG9nRGVzdGluYXRpb25UeXBlLlMzLFxuICAgICAgczNCdWNrZXQ6IGJ1Y2tldCxcbiAgICAgIGtleVByZWZpeCxcbiAgICAgIGRlc3RpbmF0aW9uT3B0aW9uczogb3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYSBmbG93IGxvZyBkZXN0aW5hdGlvbiBjb25maWd1cmF0aW9uXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgYmluZChzY29wZTogQ29uc3RydWN0LCBmbG93TG9nOiBGbG93TG9nKTogRmxvd0xvZ0Rlc3RpbmF0aW9uQ29uZmlnO1xufVxuXG4vKipcbiAqIEZsb3cgTG9nIERlc3RpbmF0aW9uIGNvbmZpZ3VyYXRpb25cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGbG93TG9nRGVzdGluYXRpb25Db25maWcge1xuICAvKipcbiAgICogVGhlIHR5cGUgb2YgZGVzdGluYXRpb24gdG8gcHVibGlzaCB0aGUgZmxvdyBsb2dzIHRvLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIENMT1VEX1dBVENIX0xPR1NcbiAgICovXG4gIHJlYWRvbmx5IGxvZ0Rlc3RpbmF0aW9uVHlwZTogRmxvd0xvZ0Rlc3RpbmF0aW9uVHlwZTtcblxuICAvKipcbiAgICogVGhlIElBTSBSb2xlIHRoYXQgaGFzIGFjY2VzcyB0byBwdWJsaXNoIHRvIENsb3VkV2F0Y2ggbG9nc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRlZmF1bHQgSUFNIHJvbGUgaXMgY3JlYXRlZCBmb3IgeW91XG4gICAqL1xuICByZWFkb25seSBpYW1Sb2xlPzogaWFtLklSb2xlO1xuXG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRXYXRjaCBMb2dzIExvZyBHcm91cCB0byBwdWJsaXNoIHRoZSBmbG93IGxvZ3MgdG9cbiAgICpcbiAgICogQGRlZmF1bHQgLSBkZWZhdWx0IGxvZyBncm91cCBpcyBjcmVhdGVkIGZvciB5b3VcbiAgICovXG4gIHJlYWRvbmx5IGxvZ0dyb3VwPzogbG9ncy5JTG9nR3JvdXA7XG5cbiAgLyoqXG4gICAqIFMzIGJ1Y2tldCB0byBwdWJsaXNoIHRoZSBmbG93IGxvZ3MgdG9cbiAgICpcbiAgICogQGRlZmF1bHQgLSB1bmRlZmluZWRcbiAgICovXG4gIHJlYWRvbmx5IHMzQnVja2V0PzogczMuSUJ1Y2tldDtcblxuICAvKipcbiAgICogUzMgYnVja2V0IGtleSBwcmVmaXggdG8gcHVibGlzaCB0aGUgZmxvdyBsb2dzIHRvXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdW5kZWZpbmVkXG4gICAqL1xuICByZWFkb25seSBrZXlQcmVmaXg/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE9wdGlvbnMgZm9yIHdyaXRpbmcgZmxvdyBsb2dzIHRvIGEgc3VwcG9ydGVkIGRlc3RpbmF0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdW5kZWZpbmVkXG4gICAqL1xuICByZWFkb25seSBkZXN0aW5hdGlvbk9wdGlvbnM/OiBEZXN0aW5hdGlvbk9wdGlvbnM7XG59XG5cbi8qKlxuICpcbiAqL1xuY2xhc3MgUzNEZXN0aW5hdGlvbiBleHRlbmRzIEZsb3dMb2dEZXN0aW5hdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEZsb3dMb2dEZXN0aW5hdGlvbkNvbmZpZykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgYmluZChzY29wZTogQ29uc3RydWN0LCBfZmxvd0xvZzogRmxvd0xvZyk6IEZsb3dMb2dEZXN0aW5hdGlvbkNvbmZpZyB7XG4gICAgbGV0IHMzQnVja2V0OiBzMy5JQnVja2V0O1xuICAgIGlmICh0aGlzLnByb3BzLnMzQnVja2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHMzQnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzY29wZSwgJ0J1Y2tldCcsIHtcbiAgICAgICAgZW5jcnlwdGlvbjogczMuQnVja2V0RW5jcnlwdGlvbi5VTkVOQ1JZUFRFRCxcbiAgICAgICAgcmVtb3ZhbFBvbGljeTogUmVtb3ZhbFBvbGljeS5SRVRBSU4sXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgczNCdWNrZXQgPSB0aGlzLnByb3BzLnMzQnVja2V0O1xuICAgIH1cblxuICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS92cGMvbGF0ZXN0L3VzZXJndWlkZS9mbG93LWxvZ3MtczMuaHRtbCNmbG93LWxvZ3MtczMtcGVybWlzc2lvbnNcbiAgICBpZiAoRmVhdHVyZUZsYWdzLm9mKHNjb3BlKS5pc0VuYWJsZWQoUzNfQ1JFQVRFX0RFRkFVTFRfTE9HR0lOR19QT0xJQ1kpKSB7XG4gICAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHNjb3BlKTtcbiAgICAgIGxldCBrZXlQcmVmaXggPSB0aGlzLnByb3BzLmtleVByZWZpeCA/PyAnJztcbiAgICAgIGlmIChrZXlQcmVmaXggJiYgIWtleVByZWZpeC5lbmRzV2l0aCgnLycpKSB7XG4gICAgICAgIGtleVByZWZpeCA9IGtleVByZWZpeCArICcvJztcbiAgICAgIH1cbiAgICAgIGNvbnN0IHByZWZpeCA9IHRoaXMucHJvcHMuZGVzdGluYXRpb25PcHRpb25zPy5oaXZlQ29tcGF0aWJsZVBhcnRpdGlvbnNcbiAgICAgICAgPyBzM0J1Y2tldC5hcm5Gb3JPYmplY3RzKGAke2tleVByZWZpeH1BV1NMb2dzL2F3cy1hY2NvdW50LWlkPSR7c3RhY2suYWNjb3VudH0vKmApXG4gICAgICAgIDogczNCdWNrZXQuYXJuRm9yT2JqZWN0cyhgJHtrZXlQcmVmaXh9QVdTTG9ncy8ke3N0YWNrLmFjY291bnR9LypgKTtcblxuICAgICAgczNCdWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgcHJpbmNpcGFsczogW1xuICAgICAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZGVsaXZlcnkubG9ncy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogW1xuICAgICAgICAgIHByZWZpeCxcbiAgICAgICAgXSxcbiAgICAgICAgYWN0aW9uczogWydzMzpQdXRPYmplY3QnXSxcbiAgICAgICAgY29uZGl0aW9uczoge1xuICAgICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICAgJ3MzOngtYW16LWFjbCc6ICdidWNrZXQtb3duZXItZnVsbC1jb250cm9sJyxcbiAgICAgICAgICAgICdhd3M6U291cmNlQWNjb3VudCc6IHN0YWNrLmFjY291bnQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBBcm5MaWtlOiB7XG4gICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHN0YWNrLmZvcm1hdEFybih7XG4gICAgICAgICAgICAgIHNlcnZpY2U6ICdsb2dzJyxcbiAgICAgICAgICAgICAgcmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSk7XG5cbiAgICAgIHMzQnVja2V0LmFkZFRvUmVzb3VyY2VQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIHByaW5jaXBhbHM6IFtcbiAgICAgICAgICBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ2RlbGl2ZXJ5LmxvZ3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgICBdLFxuICAgICAgICByZXNvdXJjZXM6IFtzM0J1Y2tldC5idWNrZXRBcm5dLFxuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgJ3MzOkdldEJ1Y2tldEFjbCcsXG4gICAgICAgICAgJ3MzOkxpc3RCdWNrZXQnLFxuICAgICAgICBdLFxuICAgICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAnYXdzOlNvdXJjZUFjY291bnQnOiBzdGFjay5hY2NvdW50LFxuICAgICAgICAgIH0sXG4gICAgICAgICAgQXJuTGlrZToge1xuICAgICAgICAgICAgJ2F3czpTb3VyY2VBcm4nOiBzdGFjay5mb3JtYXRBcm4oe1xuICAgICAgICAgICAgICBzZXJ2aWNlOiAnbG9ncycsXG4gICAgICAgICAgICAgIHJlc291cmNlOiAnKicsXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSkpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgbG9nRGVzdGluYXRpb25UeXBlOiBGbG93TG9nRGVzdGluYXRpb25UeXBlLlMzLFxuICAgICAgczNCdWNrZXQsXG4gICAgICBrZXlQcmVmaXg6IHRoaXMucHJvcHMua2V5UHJlZml4LFxuICAgICAgZGVzdGluYXRpb25PcHRpb25zOiAodGhpcy5wcm9wcy5kZXN0aW5hdGlvbk9wdGlvbnM/LmZpbGVGb3JtYXQgfHwgdGhpcy5wcm9wcy5kZXN0aW5hdGlvbk9wdGlvbnM/LnBlckhvdXJQYXJ0aXRpb25cbiAgICAgIHx8IHRoaXMucHJvcHMuZGVzdGluYXRpb25PcHRpb25zPy5oaXZlQ29tcGF0aWJsZVBhcnRpdGlvbnMpXG4gICAgICAgID8ge1xuICAgICAgICAgIGZpbGVGb3JtYXQ6IHRoaXMucHJvcHMuZGVzdGluYXRpb25PcHRpb25zLmZpbGVGb3JtYXQgPz8gRmxvd0xvZ0ZpbGVGb3JtYXQuUExBSU5fVEVYVCxcbiAgICAgICAgICBwZXJIb3VyUGFydGl0aW9uOiB0aGlzLnByb3BzLmRlc3RpbmF0aW9uT3B0aW9ucy5wZXJIb3VyUGFydGl0aW9uID8/IGZhbHNlLFxuICAgICAgICAgIGhpdmVDb21wYXRpYmxlUGFydGl0aW9uczogdGhpcy5wcm9wcy5kZXN0aW5hdGlvbk9wdGlvbnMuaGl2ZUNvbXBhdGlibGVQYXJ0aXRpb25zID8/IGZhbHNlLFxuICAgICAgICB9IDogdW5kZWZpbmVkLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKlxuICovXG5jbGFzcyBDbG91ZFdhdGNoTG9nc0Rlc3RpbmF0aW9uIGV4dGVuZHMgRmxvd0xvZ0Rlc3RpbmF0aW9uIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogRmxvd0xvZ0Rlc3RpbmF0aW9uQ29uZmlnKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QsIF9mbG93TG9nOiBGbG93TG9nKTogRmxvd0xvZ0Rlc3RpbmF0aW9uQ29uZmlnIHtcbiAgICBsZXQgaWFtUm9sZTogaWFtLklSb2xlO1xuICAgIGxldCBsb2dHcm91cDogbG9ncy5JTG9nR3JvdXA7XG4gICAgaWYgKHRoaXMucHJvcHMuaWFtUm9sZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBpYW1Sb2xlID0gbmV3IGlhbS5Sb2xlKHNjb3BlLCAnSUFNUm9sZScsIHtcbiAgICAgICAgcm9sZU5hbWU6IFBoeXNpY2FsTmFtZS5HRU5FUkFURV9JRl9ORUVERUQsXG4gICAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCd2cGMtZmxvdy1sb2dzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpYW1Sb2xlID0gdGhpcy5wcm9wcy5pYW1Sb2xlO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByb3BzLmxvZ0dyb3VwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGxvZ0dyb3VwID0gbmV3IGxvZ3MuTG9nR3JvdXAoc2NvcGUsICdMb2dHcm91cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2dHcm91cCA9IHRoaXMucHJvcHMubG9nR3JvdXA7XG4gICAgfVxuXG4gICAgaWFtUm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShcbiAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICdsb2dzOkNyZWF0ZUxvZ1N0cmVhbScsXG4gICAgICAgICAgJ2xvZ3M6UHV0TG9nRXZlbnRzJyxcbiAgICAgICAgICAnbG9nczpEZXNjcmliZUxvZ1N0cmVhbXMnLFxuICAgICAgICBdLFxuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIHJlc291cmNlczogW2xvZ0dyb3VwLmxvZ0dyb3VwQXJuXSxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICBpYW1Sb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbJ2lhbTpQYXNzUm9sZSddLFxuICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgIHJlc291cmNlczogW2lhbVJvbGUucm9sZUFybl0sXG4gICAgICB9KSxcbiAgICApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGxvZ0Rlc3RpbmF0aW9uVHlwZTogRmxvd0xvZ0Rlc3RpbmF0aW9uVHlwZS5DTE9VRF9XQVRDSF9MT0dTLFxuICAgICAgbG9nR3JvdXAsXG4gICAgICBpYW1Sb2xlLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgbWF4aW11bSBpbnRlcnZhbCBvZiB0aW1lIGR1cmluZyB3aGljaCBhIGZsb3cgb2YgcGFja2V0c1xuICogaXMgY2FwdHVyZWQgYW5kIGFnZ3JlZ2F0ZWQgaW50byBhIGZsb3cgbG9nIHJlY29yZC5cbiAqXG4gKi9cbmV4cG9ydCBlbnVtIEZsb3dMb2dNYXhBZ2dyZWdhdGlvbkludGVydmFsIHtcbiAgLyoqXG4gICAqIDEgbWludXRlICg2MCBzZWNvbmRzKVxuICAgKi9cbiAgT05FX01JTlVURSA9IDYwLFxuXG4gIC8qKlxuICAgKiAxMCBtaW51dGVzICg2MDAgc2Vjb25kcylcbiAgICovXG4gIFRFTl9NSU5VVEVTID0gNjAwLFxuXG59XG5cbi8qKlxuICogVGhlIGZvbGxvd2luZyB0YWJsZSBkZXNjcmliZXMgYWxsIG9mIHRoZSBhdmFpbGFibGUgZmllbGRzIGZvciBhIGZsb3cgbG9nIHJlY29yZC5cbiAqL1xuZXhwb3J0IGNsYXNzIExvZ0Zvcm1hdCB7XG4gIC8qKlxuICAgKiBUaGUgVlBDIEZsb3cgTG9ncyB2ZXJzaW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBWRVJTSU9OID0gbmV3IExvZ0Zvcm1hdCgnJHt2ZXJzaW9ufScpO1xuXG4gIC8qKlxuICAgKiBUaGUgQVdTIGFjY291bnQgSUQgb2YgdGhlIG93bmVyIG9mIHRoZSBzb3VyY2UgbmV0d29yayBpbnRlcmZhY2UgZm9yIHdoaWNoIHRyYWZmaWMgaXMgcmVjb3JkZWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFDQ09VTlRfSUQgPSBuZXcgTG9nRm9ybWF0KCcke2FjY291bnQtaWR9Jyk7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgbmV0d29yayBpbnRlcmZhY2UgZm9yIHdoaWNoIHRoZSB0cmFmZmljIGlzIHJlY29yZGVkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBJTlRFUkZBQ0VfSUQgPSBuZXcgTG9nRm9ybWF0KCcke2ludGVyZmFjZS1pZCcpO1xuXG4gIC8qKlxuICAgKiBUaGUgc291cmNlIGFkZHJlc3MgZm9yIGluY29taW5nIHRyYWZmaWMsIG9yIHRoZSBJUHY0IG9yIElQdjYgYWRkcmVzcyBvZiB0aGUgbmV0d29yayBpbnRlcmZhY2VcbiAgICogZm9yIG91dGdvaW5nIHRyYWZmaWMgb24gdGhlIG5ldHdvcmsgaW50ZXJmYWNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTUkNfQUREUiA9IG5ldyBMb2dGb3JtYXQoJyR7c3JjYWRkcn0nKTtcblxuICAvKipcbiAgICogVGhlIGRlc3RpbmF0aW9uIGFkZHJlc3MgZm9yIG91dGdvaW5nIHRyYWZmaWMsIG9yIHRoZSBJUHY0IG9yIElQdjYgYWRkcmVzcyBvZiB0aGUgbmV0d29yayBpbnRlcmZhY2VcbiAgICogZm9yIGluY29taW5nIHRyYWZmaWMgb24gdGhlIG5ldHdvcmsgaW50ZXJmYWNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBEU1RfQUREUiA9IG5ldyBMb2dGb3JtYXQoJyR7ZHN0YWRkcn0nKTtcblxuICAvKipcbiAgICogVGhlIHNvdXJjZSBwb3J0IG9mIHRoZSB0cmFmZmljLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTUkNfUE9SVCA9IG5ldyBMb2dGb3JtYXQoJyR7c3JjcG9ydH0nKTtcblxuICAvKipcbiAgICogVGhlIGRlc3RpbmF0aW9uIHBvcnQgb2YgdGhlIHRyYWZmaWMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERTVF9QT1JUID0gbmV3IExvZ0Zvcm1hdCgnJHtkc3Rwb3J0fScpO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFOQSBwcm90b2NvbCBudW1iZXIgb2YgdGhlIHRyYWZmaWMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBST1RPQ09MID0gbmV3IExvZ0Zvcm1hdCgnJHtwcm90b2NvbH0nKTtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBwYWNrZXRzIHRyYW5zZmVycmVkIGR1cmluZyB0aGUgZmxvdy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUEFDS0VUUyA9IG5ldyBMb2dGb3JtYXQoJyR7cGFja2V0c30nKTtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBieXRlcyB0cmFuc2ZlcnJlZCBkdXJpbmcgdGhlIGZsb3cuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJZVEVTID0gbmV3IExvZ0Zvcm1hdCgnJHtieXRlc30nKTtcblxuICAvKipcbiAgICogVGhlIHBhY2tldC1sZXZlbCAob3JpZ2luYWwpIHNvdXJjZSBJUCBhZGRyZXNzIG9mIHRoZSB0cmFmZmljLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBQS1RfU1JDX0FERFIgPSBuZXcgTG9nRm9ybWF0KCcke3BrdC1zcmNhZGRyfScpO1xuXG4gIC8qKlxuICAgKiBUaGUgcGFja2V0LWxldmVsIChvcmlnaW5hbCkgZGVzdGluYXRpb24gSVAgYWRkcmVzcyBmb3IgdGhlIHRyYWZmaWMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBLVF9EU1RfQUREUiA9IG5ldyBMb2dGb3JtYXQoJyR7cGt0LWRzdGFkZHJ9Jyk7XG5cbiAgLyoqXG4gICAqIFRoZSBSZWdpb24gdGhhdCBjb250YWlucyB0aGUgbmV0d29yayBpbnRlcmZhY2UgZm9yIHdoaWNoIHRyYWZmaWMgaXMgcmVjb3JkZWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFR0lPTiA9IG5ldyBMb2dGb3JtYXQoJyR7cmVnaW9ufScpO1xuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIEF2YWlsYWJpbGl0eSBab25lIHRoYXQgY29udGFpbnMgdGhlIG5ldHdvcmsgaW50ZXJmYWNlIGZvciB3aGljaCB0cmFmZmljIGlzIHJlY29yZGVkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBWl9JRCA9IG5ldyBMb2dGb3JtYXQoJyR7YXotaWR9Jyk7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHN1YmxvY2F0aW9uIHRoYXQncyByZXR1cm5lZCBpbiB0aGUgc3VibG9jYXRpb24taWQgZmllbGQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFNVQkxPQ0FUSU9OX1RZUEUgPSBuZXcgTG9nRm9ybWF0KCcke3N1YmxvY2F0aW9uLXR5cGV9Jyk7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgc3VibG9jYXRpb24gdGhhdCBjb250YWlucyB0aGUgbmV0d29yayBpbnRlcmZhY2UgZm9yIHdoaWNoIHRyYWZmaWMgaXMgcmVjb3JkZWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFNVQkxPQ0FUSU9OX0lEID0gbmV3IExvZ0Zvcm1hdCgnJHtzdWJsb2NhdGlvbi1pZH0nKTtcblxuICAvKipcbiAgICogVGhlIG5hbWUgb2YgdGhlIHN1YnNldCBvZiBJUCBhZGRyZXNzIHJhbmdlcyBmb3IgdGhlIHBrdC1zcmNhZGRyIGZpZWxkLFxuICAgKiBpZiB0aGUgc291cmNlIElQIGFkZHJlc3MgaXMgZm9yIGFuIEFXUyBzZXJ2aWNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBQS1RfU1JDX0FXU19TRVJWSUNFID0gbmV3IExvZ0Zvcm1hdCgnJHtwa3Qtc3JjLWF3cy1zZXJ2aWNlfScpO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc3Vic2V0IG9mIElQIGFkZHJlc3MgcmFuZ2VzIGZvciB0aGUgcGt0LWRzdGFkZHIgZmllbGQsXG4gICAqIGlmIHRoZSBkZXN0aW5hdGlvbiBJUCBhZGRyZXNzIGlzIGZvciBhbiBBV1Mgc2VydmljZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUEtUX0RTVF9BV1NfU0VSVklDRSA9IG5ldyBMb2dGb3JtYXQoJyR7cGt0LWRzdC1hd3Mtc2VydmljZX0nKTtcblxuICAvKipcbiAgICogVGhlIGRpcmVjdGlvbiBvZiB0aGUgZmxvdyB3aXRoIHJlc3BlY3QgdG8gdGhlIGludGVyZmFjZSB3aGVyZSB0cmFmZmljIGlzIGNhcHR1cmVkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBGTE9XX0RJUkVDVElPTiA9IG5ldyBMb2dGb3JtYXQoJyR7Zmxvdy1kaXJlY3Rpb259Jyk7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXRoIHRoYXQgZWdyZXNzIHRyYWZmaWMgdGFrZXMgdG8gdGhlIGRlc3RpbmF0aW9uLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBUUkFGRklDX1BBVEggPSBuZXcgTG9nRm9ybWF0KCcke3RyYWZmaWMtcGF0aH0nKTtcblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgZm9ybWF0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTExfREVGQVVMVF9GSUVMRFMgPSBuZXcgTG9nRm9ybWF0KCcke3ZlcnNpb259ICR7YWNjb3VudC1pZH0gJHtpbnRlcmZhY2UtaWR9ICR7c3JjYWRkcn0gJHtkc3RhZGRyfSAke3NyY3BvcnR9ICR7ZHN0cG9ydH0gJHtwcm90b2NvbH0gJHtwYWNrZXRzfSAke2J5dGVzfSAke3N0YXJ0fSAke2VuZH0gJHthY3Rpb259ICR7bG9nLXN0YXR1c30nKTtcblxuICAvKipcbiAgICogQSBjdXN0b20gZm9ybWF0IHN0cmluZy5cbiAgICpcbiAgICogR2l2ZXMgZnVsbCBjb250cm9sIG92ZXIgdGhlIGZvcm1hdCBzdHJpbmcgZnJhZ21lbnQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGN1c3RvbShmb3JtYXRTdHJpbmc6IHN0cmluZyk6IExvZ0Zvcm1hdCB7XG4gICAgcmV0dXJuIG5ldyBMb2dGb3JtYXQoZm9ybWF0U3RyaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSBmaWVsZCBuYW1lLlxuICAgKlxuICAgKiBJZiB0aGVyZSBpcyBubyByZWFkeS1tYWRlIGNvbnN0YW50IGZvciBhIG5ldyBmaWVsZCB5ZXQsIHlvdSBjYW4gdXNlIHRoaXMuXG4gICAqIFRoZSBmaWVsZCBuYW1lIHdpbGwgYXV0b21hdGljYWxseSBiZSB3cmFwcGVkIGluIGAkeyAuLi4gfWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZpZWxkKGZpZWxkOiBzdHJpbmcpOiBMb2dGb3JtYXQge1xuICAgIHJldHVybiBuZXcgTG9nRm9ybWF0KGBcXCR7JHtmaWVsZH19YCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHZhbHVlOiBzdHJpbmcpIHt9XG59XG5cbi8qKlxuICogT3B0aW9ucyB0byBhZGQgYSBmbG93IGxvZyB0byBhIFZQQ1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEZsb3dMb2dPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRyYWZmaWMgdG8gbG9nLiBZb3UgY2FuIGxvZyB0cmFmZmljIHRoYXQgdGhlIHJlc291cmNlIGFjY2VwdHMgb3IgcmVqZWN0cywgb3IgYWxsIHRyYWZmaWMuXG4gICAqXG4gICAqIEBkZWZhdWx0IEFMTFxuICAgKi9cbiAgcmVhZG9ubHkgdHJhZmZpY1R5cGU/OiBGbG93TG9nVHJhZmZpY1R5cGU7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgdHlwZSBvZiBkZXN0aW5hdGlvbiB0byB3aGljaCB0aGUgZmxvdyBsb2cgZGF0YSBpcyB0byBiZSBwdWJsaXNoZWQuXG4gICAqIEZsb3cgbG9nIGRhdGEgY2FuIGJlIHB1Ymxpc2hlZCB0byBDbG91ZFdhdGNoIExvZ3Mgb3IgQW1hem9uIFMzXG4gICAqXG4gICAqIEBkZWZhdWx0IEZsb3dMb2dEZXN0aW5hdGlvblR5cGUudG9DbG91ZFdhdGNoTG9ncygpXG4gICAqL1xuICByZWFkb25seSBkZXN0aW5hdGlvbj86IEZsb3dMb2dEZXN0aW5hdGlvbjtcblxuICAvKipcbiAgICogVGhlIGZpZWxkcyB0byBpbmNsdWRlIGluIHRoZSBmbG93IGxvZyByZWNvcmQsIGluIHRoZSBvcmRlciBpbiB3aGljaCB0aGV5IHNob3VsZCBhcHBlYXIuXG4gICAqXG4gICAqIElmIG11bHRpcGxlIGZpZWxkcyBhcmUgc3BlY2lmaWVkLCB0aGV5IHdpbGwgYmUgc2VwYXJhdGVkIGJ5IHNwYWNlcy4gRm9yIGZ1bGwgY29udHJvbCBvdmVyIHRoZSBsaXRlcmFsIGxvZyBmb3JtYXRcbiAgICogc3RyaW5nLCBwYXNzIGEgc2luZ2xlIGZpZWxkIGNvbnN0cnVjdGVkIHdpdGggYExvZ0Zvcm1hdC5jdXN0b20oKWAuXG4gICAqXG4gICAqIFNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vdnBjL2xhdGVzdC91c2VyZ3VpZGUvZmxvdy1sb2dzLmh0bWwjZmxvdy1sb2ctcmVjb3Jkc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRlZmF1bHQgbG9nIGZvcm1hdCBpcyB1c2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9nRm9ybWF0PzogTG9nRm9ybWF0W107XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIGludGVydmFsIG9mIHRpbWUgZHVyaW5nIHdoaWNoIGEgZmxvdyBvZiBwYWNrZXRzIGlzIGNhcHR1cmVkXG4gICAqIGFuZCBhZ2dyZWdhdGVkIGludG8gYSBmbG93IGxvZyByZWNvcmQuXG4gICAqXG4gICAqIEBkZWZhdWx0IEZsb3dMb2dNYXhBZ2dyZWdhdGlvbkludGVydmFsLlRFTl9NSU5VVEVTXG4gICAqL1xuICByZWFkb25seSBtYXhBZ2dyZWdhdGlvbkludGVydmFsPzogRmxvd0xvZ01heEFnZ3JlZ2F0aW9uSW50ZXJ2YWw7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBvZiBhIFZQQyBGbG93IExvZ1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEZsb3dMb2dQcm9wcyBleHRlbmRzIEZsb3dMb2dPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBGbG93TG9nXG4gICAqXG4gICAqIEl0IGlzIG5vdCByZWNvbW1lbmRlZCB0byB1c2UgYW4gZXhwbGljaXQgbmFtZS5cbiAgICpcbiAgICogQGRlZmF1bHQgSWYgeW91IGRvbid0IHNwZWNpZnkgYSBmbG93TG9nTmFtZSwgQVdTIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlcyBhXG4gICAqIHVuaXF1ZSBwaHlzaWNhbCBJRCBhbmQgdXNlcyB0aGF0IElEIGZvciB0aGUgZ3JvdXAgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IGZsb3dMb2dOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiByZXNvdXJjZSBmb3Igd2hpY2ggdG8gY3JlYXRlIHRoZSBmbG93IGxvZ1xuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGNsYXNzIGZvciBhIEZsb3cgTG9nXG4gKi9cbmFic3RyYWN0IGNsYXNzIEZsb3dMb2dCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJRmxvd0xvZyB7XG4gIC8qKlxuICAgKiBUaGUgSWQgb2YgdGhlIFZQQyBGbG93IExvZ1xuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZmxvd0xvZ0lkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBWUEMgZmxvdyBsb2cuXG4gKiBAcmVzb3VyY2UgQVdTOjpFQzI6OkZsb3dMb2dcbiAqL1xuZXhwb3J0IGNsYXNzIEZsb3dMb2cgZXh0ZW5kcyBGbG93TG9nQmFzZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYSBGbG93IExvZyBieSBpdCdzIElkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21GbG93TG9nSWQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgZmxvd0xvZ0lkOiBzdHJpbmcpOiBJRmxvd0xvZyB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgRmxvd0xvZ0Jhc2Uge1xuICAgICAgcHVibGljIGZsb3dMb2dJZCA9IGZsb3dMb2dJZDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBJZCBvZiB0aGUgVlBDIEZsb3cgTG9nXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBmbG93TG9nSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFMzIGJ1Y2tldCB0byBwdWJsaXNoIGZsb3cgbG9ncyB0b1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldD86IHMzLklCdWNrZXQ7XG5cbiAgLyoqXG4gICAqIFMzIGJ1Y2tldCBrZXkgcHJlZml4IHRvIHB1Ymxpc2ggdGhlIGZsb3cgbG9ncyB1bmRlclxuICAgKi9cbiAgcmVhZG9ubHkga2V5UHJlZml4Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaWFtIHJvbGUgdXNlZCB0byBwdWJsaXNoIGxvZ3MgdG8gQ2xvdWRXYXRjaFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGlhbVJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFRoZSBDbG91ZFdhdGNoIExvZ3MgTG9nR3JvdXAgdG8gcHVibGlzaCBmbG93IGxvZ3MgdG9cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBsb2dHcm91cD86IGxvZ3MuSUxvZ0dyb3VwO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBGbG93TG9nUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuZmxvd0xvZ05hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHByb3BzLmRlc3RpbmF0aW9uIHx8IEZsb3dMb2dEZXN0aW5hdGlvbi50b0Nsb3VkV2F0Y2hMb2dzKCk7XG5cbiAgICBjb25zdCBkZXN0aW5hdGlvbkNvbmZpZyA9IGRlc3RpbmF0aW9uLmJpbmQodGhpcywgdGhpcyk7XG4gICAgdGhpcy5sb2dHcm91cCA9IGRlc3RpbmF0aW9uQ29uZmlnLmxvZ0dyb3VwO1xuICAgIHRoaXMuYnVja2V0ID0gZGVzdGluYXRpb25Db25maWcuczNCdWNrZXQ7XG4gICAgdGhpcy5pYW1Sb2xlID0gZGVzdGluYXRpb25Db25maWcuaWFtUm9sZTtcbiAgICB0aGlzLmtleVByZWZpeCA9IGRlc3RpbmF0aW9uQ29uZmlnLmtleVByZWZpeDtcblxuICAgIGxldCBsb2dEZXN0aW5hdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLmJ1Y2tldCkge1xuICAgICAgbG9nRGVzdGluYXRpb24gPSB0aGlzLmtleVByZWZpeCA/IHRoaXMuYnVja2V0LmFybkZvck9iamVjdHModGhpcy5rZXlQcmVmaXgpIDogdGhpcy5idWNrZXQuYnVja2V0QXJuO1xuICAgIH1cbiAgICBsZXQgY3VzdG9tTG9nRm9ybWF0OiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHByb3BzLmxvZ0Zvcm1hdCkge1xuICAgICAgY3VzdG9tTG9nRm9ybWF0ID0gcHJvcHMubG9nRm9ybWF0Lm1hcChlbG0gPT4ge1xuICAgICAgICByZXR1cm4gZWxtLnZhbHVlO1xuICAgICAgfSkuam9pbignICcpO1xuICAgIH1cblxuICAgIGNvbnN0IGZsb3dMb2cgPSBuZXcgQ2ZuRmxvd0xvZyh0aGlzLCAnRmxvd0xvZycsIHtcbiAgICAgIGRlc3RpbmF0aW9uT3B0aW9uczogZGVzdGluYXRpb25Db25maWcuZGVzdGluYXRpb25PcHRpb25zLFxuICAgICAgZGVsaXZlckxvZ3NQZXJtaXNzaW9uQXJuOiB0aGlzLmlhbVJvbGUgPyB0aGlzLmlhbVJvbGUucm9sZUFybiA6IHVuZGVmaW5lZCxcbiAgICAgIGxvZ0Rlc3RpbmF0aW9uVHlwZTogZGVzdGluYXRpb25Db25maWcubG9nRGVzdGluYXRpb25UeXBlLFxuICAgICAgbG9nR3JvdXBOYW1lOiB0aGlzLmxvZ0dyb3VwID8gdGhpcy5sb2dHcm91cC5sb2dHcm91cE5hbWUgOiB1bmRlZmluZWQsXG4gICAgICBtYXhBZ2dyZWdhdGlvbkludGVydmFsOiBwcm9wcy5tYXhBZ2dyZWdhdGlvbkludGVydmFsLFxuICAgICAgcmVzb3VyY2VJZDogcHJvcHMucmVzb3VyY2VUeXBlLnJlc291cmNlSWQsXG4gICAgICByZXNvdXJjZVR5cGU6IHByb3BzLnJlc291cmNlVHlwZS5yZXNvdXJjZVR5cGUsXG4gICAgICB0cmFmZmljVHlwZTogcHJvcHMudHJhZmZpY1R5cGVcbiAgICAgICAgPyBwcm9wcy50cmFmZmljVHlwZVxuICAgICAgICA6IEZsb3dMb2dUcmFmZmljVHlwZS5BTEwsXG4gICAgICBsb2dGb3JtYXQ6IGN1c3RvbUxvZ0Zvcm1hdCxcbiAgICAgIGxvZ0Rlc3RpbmF0aW9uLFxuICAgIH0pO1xuXG4gICAgLy8gVlBDIHNlcnZpY2UgaW1wbGljaXRseSB0cmllcyB0byBjcmVhdGUgYSBidWNrZXQgcG9saWN5IHdoZW4gYWRkaW5nIGEgdnBjIGZsb3cgbG9nLlxuICAgIC8vIFRvIGF2b2lkIHRoZSByYWNlIGNvbmRpdGlvbiwgd2UgYWRkIGFuIGV4cGxpY2l0IGRlcGVuZGVuY3kgaGVyZS5cbiAgICBpZiAodGhpcy5idWNrZXQ/LnBvbGljeT8ubm9kZS5kZWZhdWx0Q2hpbGQgaW5zdGFuY2VvZiBDZm5SZXNvdXJjZSkge1xuICAgICAgZmxvd0xvZy5hZGREZXBlbmRlbmN5KHRoaXMuYnVja2V0Py5wb2xpY3kubm9kZS5kZWZhdWx0Q2hpbGQpO1xuICAgIH1cblxuICAgIC8vIHdlIG11c3QgcmVtb3ZlIGEgZmxvdyBsb2cgY29uZmlndXJhdGlvbiBmaXJzdCBiZWZvcmUgZGVsZXRpbmcgb2JqZWN0cy5cbiAgICBjb25zdCBkZWxldGVPYmplY3RzID0gdGhpcy5idWNrZXQ/Lm5vZGUudHJ5RmluZENoaWxkKCdBdXRvRGVsZXRlT2JqZWN0c0N1c3RvbVJlc291cmNlJyk/Lm5vZGUuZGVmYXVsdENoaWxkO1xuICAgIGlmIChkZWxldGVPYmplY3RzIGluc3RhbmNlb2YgQ2ZuUmVzb3VyY2UpIHtcbiAgICAgIGZsb3dMb2cuYWRkRGVwZW5kZW5jeShkZWxldGVPYmplY3RzKTtcbiAgICB9XG5cbiAgICB0aGlzLmZsb3dMb2dJZCA9IGZsb3dMb2cucmVmO1xuICAgIHRoaXMubm9kZS5kZWZhdWx0Q2hpbGQgPSBmbG93TG9nO1xuICB9XG59XG4iXX0=