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
_a = JSII_RTTI_SYMBOL_1;
FlowLogResourceType[_a] = { fqn: "@aws-cdk/aws-ec2.FlowLogResourceType", version: "0.0.0" };
exports.FlowLogResourceType = FlowLogResourceType;
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
_b = JSII_RTTI_SYMBOL_1;
FlowLogDestination[_b] = { fqn: "@aws-cdk/aws-ec2.FlowLogDestination", version: "0.0.0" };
exports.FlowLogDestination = FlowLogDestination;
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
    constructor(value) {
        this.value = value;
    }
}
_c = JSII_RTTI_SYMBOL_1;
LogFormat[_c] = { fqn: "@aws-cdk/aws-ec2.LogFormat", version: "0.0.0" };
/**
 * The VPC Flow Logs version.
 */
LogFormat.VERSION = LogFormat.field('version');
/**
 * The AWS account ID of the owner of the source network interface for which traffic is recorded.
 */
LogFormat.ACCOUNT_ID = LogFormat.field('account-id');
/**
 * The ID of the network interface for which the traffic is recorded.
 */
LogFormat.INTERFACE_ID = LogFormat.field('interface-id');
/**
 * The source address for incoming traffic, or the IPv4 or IPv6 address of the network interface
 * for outgoing traffic on the network interface.
 */
LogFormat.SRC_ADDR = LogFormat.field('srcaddr');
/**
 * The destination address for outgoing traffic, or the IPv4 or IPv6 address of the network interface
 * for incoming traffic on the network interface.
 */
LogFormat.DST_ADDR = LogFormat.field('dstaddr');
/**
 * The source port of the traffic.
 */
LogFormat.SRC_PORT = LogFormat.field('srcport');
/**
 * The destination port of the traffic.
 */
LogFormat.DST_PORT = LogFormat.field('dstport');
/**
 * The IANA protocol number of the traffic.
 */
LogFormat.PROTOCOL = LogFormat.field('protocol');
/**
 * The number of packets transferred during the flow.
 */
LogFormat.PACKETS = LogFormat.field('packets');
/**
 * The number of bytes transferred during the flow.
 */
LogFormat.BYTES = LogFormat.field('bytes');
/**
 * The time, in Unix seconds, when the first packet of the flow was received within
 * the aggregation interval.
 *
 * This might be up to 60 seconds after the packet was transmitted or received on
 * the network interface.
 */
LogFormat.START_TIMESTAMP = LogFormat.field('start');
/**
 * The time, in Unix seconds, when the last packet of the flow was received within
 * the aggregation interval.
 *
 * This might be up to 60 seconds after the packet was transmitted or received on
 * the network interface.
 */
LogFormat.END_TIMESTAMP = LogFormat.field('end');
/**
 * The action that is associated with the traffic.
 */
LogFormat.ACTION = LogFormat.field('action');
/**
 * The logging status of the flow log.
 */
LogFormat.LOG_STATUS = LogFormat.field('log-status');
/**
 * The ID of the VPC that contains the network interface for which the traffic is recorded.
 */
LogFormat.VPC_ID = LogFormat.field('vpc-id');
/**
 * The ID of the subnet that contains the network interface for which the traffic is recorded.
 */
LogFormat.SUBNET_ID = LogFormat.field('subnet-id');
/**
 * The ID of the instance that's associated with network interface for which the traffic is
 * recorded, if the instance is owned by you.
 *
 * Returns a '-' symbol for a requester-managed network interface; for example, the
 * network interface for a NAT gateway
 */
LogFormat.INSTANCE_ID = LogFormat.field('instance-id');
/**
 * The bitmask value for TCP flags.
 *
 * - FIN -- 1
 * - SYN -- 2
 * - RST -- 4
 * - SYN-ACK -- 18
 *
 * If no supported flags are recorded, the TCP flag value is 0.
 *
 * TCP flags can be OR-ed during the aggregation interval. For short connections,
 * the flags might be set on the same line in the flow log record, for example,
 * 19 for SYN-ACK and FIN, and 3 for SYN and FIN.
 */
LogFormat.TCP_FLAGS = LogFormat.field('tcp-flags');
/**
 * The type of traffic.
 *
 * The possible values are IPv4, IPv6, or EFA.
 */
LogFormat.TRAFFIC_TYPE = LogFormat.field('type');
/**
 * The packet-level (original) source IP address of the traffic.
 */
LogFormat.PKT_SRC_ADDR = LogFormat.field('pkt-srcaddr');
/**
 * The packet-level (original) destination IP address for the traffic.
 */
LogFormat.PKT_DST_ADDR = LogFormat.field('pkt-dstaddr');
/**
 * The Region that contains the network interface for which traffic is recorded.
 */
LogFormat.REGION = LogFormat.field('region');
/**
 * The ID of the Availability Zone that contains the network interface for which traffic is recorded.
 */
LogFormat.AZ_ID = LogFormat.field('az-id');
/**
 * The type of sublocation that's returned in the sublocation-id field.
 */
LogFormat.SUBLOCATION_TYPE = LogFormat.field('sublocation-type');
/**
 * The ID of the sublocation that contains the network interface for which traffic is recorded.
 */
LogFormat.SUBLOCATION_ID = LogFormat.field('sublocation-id');
/**
 * The name of the subset of IP address ranges for the pkt-srcaddr field,
 * if the source IP address is for an AWS service.
 */
LogFormat.PKT_SRC_AWS_SERVICE = LogFormat.field('pkt-src-aws-service');
/**
 * The name of the subset of IP address ranges for the pkt-dstaddr field,
 * if the destination IP address is for an AWS service.
 */
LogFormat.PKT_DST_AWS_SERVICE = LogFormat.field('pkt-dst-aws-service');
/**
 * The direction of the flow with respect to the interface where traffic is captured.
 */
LogFormat.FLOW_DIRECTION = LogFormat.field('flow-direction');
/**
 * The path that egress traffic takes to the destination.
 */
LogFormat.TRAFFIC_PATH = LogFormat.field('traffic-path');
/**
 * The default format.
 */
LogFormat.ALL_DEFAULT_FIELDS = new LogFormat('${version} ${account-id} ${interface-id} ${srcaddr} ${dstaddr} ${srcport} ${dstport} ${protocol} ${packets} ${bytes} ${start} ${end} ${action} ${log-status}');
exports.LogFormat = LogFormat;
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
}
_d = JSII_RTTI_SYMBOL_1;
FlowLog[_d] = { fqn: "@aws-cdk/aws-ec2.FlowLog", version: "0.0.0" };
exports.FlowLog = FlowLog;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidnBjLWZsb3ctbG9ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInZwYy1mbG93LWxvZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdDO0FBQ3hDLDBDQUEwQztBQUMxQyxzQ0FBc0M7QUFDdEMsd0NBQW1IO0FBQ25ILDRDQUFtRTtBQUVuRSxtREFBNkM7QUFlN0M7O0dBRUc7QUFDSCxJQUFZLGtCQWVYO0FBZkQsV0FBWSxrQkFBa0I7SUFDNUI7O09BRUc7SUFDSCx1Q0FBaUIsQ0FBQTtJQUVqQjs7T0FFRztJQUNILGlDQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILHVDQUFpQixDQUFBO0FBQ25CLENBQUMsRUFmVyxrQkFBa0IsR0FBbEIsMEJBQWtCLEtBQWxCLDBCQUFrQixRQWU3QjtBQUVEOztHQUVHO0FBQ0gsSUFBWSxzQkFVWDtBQVZELFdBQVksc0JBQXNCO0lBQ2hDOztPQUVHO0lBQ0gsK0RBQXFDLENBQUE7SUFFckM7O09BRUc7SUFDSCxtQ0FBUyxDQUFBO0FBQ1gsQ0FBQyxFQVZXLHNCQUFzQixHQUF0Qiw4QkFBc0IsS0FBdEIsOEJBQXNCLFFBVWpDO0FBRUQ7O0dBRUc7QUFDSCxNQUFzQixtQkFBbUI7SUFDdkM7O09BRUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQWU7Ozs7Ozs7Ozs7UUFDdEMsT0FBTztZQUNMLFlBQVksRUFBRSxRQUFRO1lBQ3RCLFVBQVUsRUFBRSxNQUFNLENBQUMsUUFBUTtTQUM1QixDQUFDO0tBQ0g7SUFFRDs7T0FFRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBUzs7Ozs7Ozs7OztRQUM3QixPQUFPO1lBQ0wsWUFBWSxFQUFFLEtBQUs7WUFDbkIsVUFBVSxFQUFFLEdBQUcsQ0FBQyxLQUFLO1NBQ3RCLENBQUM7S0FDSDtJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLHNCQUFzQixDQUFDLEVBQVU7UUFDN0MsT0FBTztZQUNMLFlBQVksRUFBRSxrQkFBa0I7WUFDaEMs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VUFBVSxFQUFFLEtBQUssQ0FBQyxZQUFZLENBQUMsVUFBVTtZQUN6QyxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVksQ0FBQyxZQUFZO1lBQzdDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztnQkFDNUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXO2dCQUNuQixDQUFDLENBQUMsa0JBQWtCLENBQUMsR0FBRztZQUMxQixTQUFTLEVBQUUsZUFBZTtZQUMxQixjQUFjO1NBQ2YsQ0FBQyxDQUFDO1FBRUgscUZBQXFGO1FBQ3JGLG1FQUFtRTtRQUNuRSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLFlBQVksa0JBQVcsRUFBRTtZQUNqRSxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUM5RDtRQUVELHlFQUF5RTtRQUN6RSxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsaUNBQWlDLENBQUMsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDO1FBQzNHLElBQUksYUFBYSxZQUFZLGtCQUFXLEVBQUU7WUFDeEMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUN0QztRQUVELElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQztRQUM3QixJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxPQUFPLENBQUM7S0FDbEM7Ozs7QUE1RlUsMEJBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBsb2dzIGZyb20gJ0Bhd3MtY2RrL2F3cy1sb2dzJztcbmltcG9ydCAqIGFzIHMzIGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBJUmVzb3VyY2UsIFBoeXNpY2FsTmFtZSwgUmVtb3ZhbFBvbGljeSwgUmVzb3VyY2UsIEZlYXR1cmVGbGFncywgU3RhY2ssIENmblJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBTM19DUkVBVEVfREVGQVVMVF9MT0dHSU5HX1BPTElDWSB9IGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkZsb3dMb2cgfSBmcm9tICcuL2VjMi5nZW5lcmF0ZWQnO1xuaW1wb3J0IHsgSVN1Ym5ldCwgSVZwYyB9IGZyb20gJy4vdnBjJztcblxuLyoqXG4gKiBBIEZsb3dMb2dcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJRmxvd0xvZyBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgSWQgb2YgdGhlIFZQQyBGbG93IExvZ1xuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICByZWFkb25seSBmbG93TG9nSWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgdHlwZSBvZiBWUEMgdHJhZmZpYyB0byBsb2dcbiAqL1xuZXhwb3J0IGVudW0gRmxvd0xvZ1RyYWZmaWNUeXBlIHtcbiAgLyoqXG4gICAqIE9ubHkgbG9nIGFjY2VwdHNcbiAgICovXG4gIEFDQ0VQVCA9ICdBQ0NFUFQnLFxuXG4gIC8qKlxuICAgKiBMb2cgYWxsIHJlcXVlc3RzXG4gICAqL1xuICBBTEwgPSAnQUxMJyxcblxuICAvKipcbiAgICogT25seSBsb2cgcmVqZWN0c1xuICAgKi9cbiAgUkVKRUNUID0gJ1JFSkVDVCdcbn1cblxuLyoqXG4gKiBUaGUgYXZhaWxhYmxlIGRlc3RpbmF0aW9uIHR5cGVzIGZvciBGbG93IExvZ3NcbiAqL1xuZXhwb3J0IGVudW0gRmxvd0xvZ0Rlc3RpbmF0aW9uVHlwZSB7XG4gIC8qKlxuICAgKiBTZW5kIGZsb3cgbG9ncyB0byBDbG91ZFdhdGNoIExvZ3MgR3JvdXBcbiAgICovXG4gIENMT1VEX1dBVENIX0xPR1MgPSAnY2xvdWQtd2F0Y2gtbG9ncycsXG5cbiAgLyoqXG4gICAqIFNlbmQgZmxvdyBsb2dzIHRvIFMzIEJ1Y2tldFxuICAgKi9cbiAgUzMgPSAnczMnXG59XG5cbi8qKlxuICogVGhlIHR5cGUgb2YgcmVzb3VyY2UgdG8gY3JlYXRlIHRoZSBmbG93IGxvZyBmb3JcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEZsb3dMb2dSZXNvdXJjZVR5cGUge1xuICAvKipcbiAgICogVGhlIHN1Ym5ldCB0byBhdHRhY2ggdGhlIEZsb3cgTG9nIHRvXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TdWJuZXQoc3VibmV0OiBJU3VibmV0KTogRmxvd0xvZ1Jlc291cmNlVHlwZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc291cmNlVHlwZTogJ1N1Ym5ldCcsXG4gICAgICByZXNvdXJjZUlkOiBzdWJuZXQuc3VibmV0SWQsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgVlBDIHRvIGF0dGFjaCB0aGUgRmxvdyBMb2cgdG9cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVZwYyh2cGM6IElWcGMpOiBGbG93TG9nUmVzb3VyY2VUeXBlIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzb3VyY2VUeXBlOiAnVlBDJyxcbiAgICAgIHJlc291cmNlSWQ6IHZwYy52cGNJZCxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBOZXR3b3JrIEludGVyZmFjZSB0byBhdHRhY2ggdGhlIEZsb3cgTG9nIHRvXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21OZXR3b3JrSW50ZXJmYWNlSWQoaWQ6IHN0cmluZyk6IEZsb3dMb2dSZXNvdXJjZVR5cGUge1xuICAgIHJldHVybiB7XG4gICAgICByZXNvdXJjZVR5cGU6ICdOZXR3b3JrSW50ZXJmYWNlJyxcbiAgICAgIHJlc291cmNlSWQ6IGlkLFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVGhlIHR5cGUgb2YgcmVzb3VyY2UgdG8gYXR0YWNoIGEgZmxvdyBsb2cgdG8uXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVzb3VyY2VUeXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBJZCBvZiB0aGUgcmVzb3VyY2UgdGhhdCB0aGUgZmxvdyBsb2cgc2hvdWxkIGJlIGF0dGFjaGVkIHRvLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlc291cmNlSWQ6IHN0cmluZztcbn1cblxuLyoqXG4gKiBUaGUgZmlsZSBmb3JtYXQgZm9yIGZsb3cgbG9ncyB3cml0dGVuIHRvIGFuIFMzIGJ1Y2tldCBkZXN0aW5hdGlvblxuICovXG5leHBvcnQgZW51bSBGbG93TG9nRmlsZUZvcm1hdCB7XG4gIC8qKlxuICAgKiBGaWxlIHdpbGwgYmUgd3JpdHRlbiBhcyBwbGFpbiB0ZXh0XG4gICAqXG4gICAqIFRoaXMgaXMgdGhlIGRlZmF1bHQgdmFsdWVcbiAgICovXG4gIFBMQUlOX1RFWFQgPSAncGxhaW4tdGV4dCcsXG5cbiAgLyoqXG4gICAqIEZpbGUgd2lsbCBiZSB3cml0dGVuIGluIHBhcnF1ZXQgZm9ybWF0XG4gICAqL1xuICBQQVJRVUVUID0gJ3BhcnF1ZXQnLFxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHdyaXRpbmcgbG9ncyB0byBhIFMzIGRlc3RpbmF0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUzNEZXN0aW5hdGlvbk9wdGlvbnMge1xuICAvKipcbiAgICogVXNlIEhpdmUtY29tcGF0aWJsZSBwcmVmaXhlcyBmb3IgZmxvdyBsb2dzXG4gICAqIHN0b3JlZCBpbiBBbWF6b24gUzNcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGhpdmVDb21wYXRpYmxlUGFydGl0aW9ucz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSBmb3JtYXQgZm9yIHRoZSBmbG93IGxvZ1xuICAgKlxuICAgKiBAZGVmYXVsdCBGbG93TG9nRmlsZUZvcm1hdC5QTEFJTl9URVhUXG4gICAqL1xuICByZWFkb25seSBmaWxlRm9ybWF0PzogRmxvd0xvZ0ZpbGVGb3JtYXQ7XG5cbiAgLyoqXG4gICAqIFBhcnRpdGlvbiB0aGUgZmxvdyBsb2cgcGVyIGhvdXJcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHBlckhvdXJQYXJ0aXRpb24/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIHdyaXRpbmcgbG9ncyB0byBhIGRlc3RpbmF0aW9uXG4gKlxuICogVE9ETzogdGhlcmUgYXJlIG90aGVyIGRlc3RpbmF0aW9uIG9wdGlvbnMsIGN1cnJlbnRseSB0aGV5IGFyZVxuICogb25seSBmb3IgczMgZGVzdGluYXRpb25zIChub3Qgc3VyZSBpZiB0aGF0IHdpbGwgY2hhbmdlKVxuICovXG5leHBvcnQgaW50ZXJmYWNlIERlc3RpbmF0aW9uT3B0aW9ucyBleHRlbmRzIFMzRGVzdGluYXRpb25PcHRpb25zIHsgfVxuXG5cbi8qKlxuICogVGhlIGRlc3RpbmF0aW9uIHR5cGUgZm9yIHRoZSBmbG93IGxvZ1xuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRmxvd0xvZ0Rlc3RpbmF0aW9uIHtcbiAgLyoqXG4gICAqIFVzZSBDbG91ZFdhdGNoIGxvZ3MgYXMgdGhlIGRlc3RpbmF0aW9uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRvQ2xvdWRXYXRjaExvZ3MobG9nR3JvdXA/OiBsb2dzLklMb2dHcm91cCwgaWFtUm9sZT86IGlhbS5JUm9sZSk6IEZsb3dMb2dEZXN0aW5hdGlvbiB7XG4gICAgcmV0dXJuIG5ldyBDbG91ZFdhdGNoTG9nc0Rlc3RpbmF0aW9uKHtcbiAgICAgIGxvZ0Rlc3RpbmF0aW9uVHlwZTogRmxvd0xvZ0Rlc3RpbmF0aW9uVHlwZS5DTE9VRF9XQVRDSF9MT0dTLFxuICAgICAgbG9nR3JvdXAsXG4gICAgICBpYW1Sb2xlLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFVzZSBTMyBhcyB0aGUgZGVzdGluYXRpb25cbiAgICpcbiAgICogQHBhcmFtIGJ1Y2tldCBvcHRpb25hbCBzMyBidWNrZXQgdG8gcHVibGlzaCBsb2dzIHRvLiBJZiBvbmUgaXMgbm90IHByb3ZpZGVkXG4gICAqIGEgZGVmYXVsdCBidWNrZXQgd2lsbCBiZSBjcmVhdGVkXG4gICAqIEBwYXJhbSBrZXlQcmVmaXggb3B0aW9uYWwgcHJlZml4IHdpdGhpbiB0aGUgYnVja2V0IHRvIHdyaXRlIGxvZ3MgdG9cbiAgICogQHBhcmFtIG9wdGlvbnMgYWRkaXRpb25hbCBzMyBkZXN0aW5hdGlvbiBvcHRpb25zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHRvUzMoYnVja2V0PzogczMuSUJ1Y2tldCwga2V5UHJlZml4Pzogc3RyaW5nLCBvcHRpb25zPzogUzNEZXN0aW5hdGlvbk9wdGlvbnMpOiBGbG93TG9nRGVzdGluYXRpb24ge1xuICAgIHJldHVybiBuZXcgUzNEZXN0aW5hdGlvbih7XG4gICAgICBsb2dEZXN0aW5hdGlvblR5cGU6IEZsb3dMb2dEZXN0aW5hdGlvblR5cGUuUzMsXG4gICAgICBzM0J1Y2tldDogYnVja2V0LFxuICAgICAga2V5UHJlZml4LFxuICAgICAgZGVzdGluYXRpb25PcHRpb25zOiBvcHRpb25zLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhIGZsb3cgbG9nIGRlc3RpbmF0aW9uIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QsIGZsb3dMb2c6IEZsb3dMb2cpOiBGbG93TG9nRGVzdGluYXRpb25Db25maWc7XG59XG5cbi8qKlxuICogRmxvdyBMb2cgRGVzdGluYXRpb24gY29uZmlndXJhdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZsb3dMb2dEZXN0aW5hdGlvbkNvbmZpZyB7XG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiBkZXN0aW5hdGlvbiB0byBwdWJsaXNoIHRoZSBmbG93IGxvZ3MgdG8uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQ0xPVURfV0FUQ0hfTE9HU1xuICAgKi9cbiAgcmVhZG9ubHkgbG9nRGVzdGluYXRpb25UeXBlOiBGbG93TG9nRGVzdGluYXRpb25UeXBlO1xuXG4gIC8qKlxuICAgKiBUaGUgSUFNIFJvbGUgdGhhdCBoYXMgYWNjZXNzIHRvIHB1Ymxpc2ggdG8gQ2xvdWRXYXRjaCBsb2dzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZGVmYXVsdCBJQU0gcm9sZSBpcyBjcmVhdGVkIGZvciB5b3VcbiAgICovXG4gIHJlYWRvbmx5IGlhbVJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFRoZSBDbG91ZFdhdGNoIExvZ3MgTG9nIEdyb3VwIHRvIHB1Ymxpc2ggdGhlIGZsb3cgbG9ncyB0b1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRlZmF1bHQgbG9nIGdyb3VwIGlzIGNyZWF0ZWQgZm9yIHlvdVxuICAgKi9cbiAgcmVhZG9ubHkgbG9nR3JvdXA/OiBsb2dzLklMb2dHcm91cDtcblxuICAvKipcbiAgICogUzMgYnVja2V0IHRvIHB1Ymxpc2ggdGhlIGZsb3cgbG9ncyB0b1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIHVuZGVmaW5lZFxuICAgKi9cbiAgcmVhZG9ubHkgczNCdWNrZXQ/OiBzMy5JQnVja2V0O1xuXG4gIC8qKlxuICAgKiBTMyBidWNrZXQga2V5IHByZWZpeCB0byBwdWJsaXNoIHRoZSBmbG93IGxvZ3MgdG9cbiAgICpcbiAgICogQGRlZmF1bHQgLSB1bmRlZmluZWRcbiAgICovXG4gIHJlYWRvbmx5IGtleVByZWZpeD86IHN0cmluZztcblxuICAvKipcbiAgICogT3B0aW9ucyBmb3Igd3JpdGluZyBmbG93IGxvZ3MgdG8gYSBzdXBwb3J0ZWQgZGVzdGluYXRpb25cbiAgICpcbiAgICogQGRlZmF1bHQgLSB1bmRlZmluZWRcbiAgICovXG4gIHJlYWRvbmx5IGRlc3RpbmF0aW9uT3B0aW9ucz86IERlc3RpbmF0aW9uT3B0aW9ucztcbn1cblxuLyoqXG4gKlxuICovXG5jbGFzcyBTM0Rlc3RpbmF0aW9uIGV4dGVuZHMgRmxvd0xvZ0Rlc3RpbmF0aW9uIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogRmxvd0xvZ0Rlc3RpbmF0aW9uQ29uZmlnKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kKHNjb3BlOiBDb25zdHJ1Y3QsIF9mbG93TG9nOiBGbG93TG9nKTogRmxvd0xvZ0Rlc3RpbmF0aW9uQ29uZmlnIHtcbiAgICBsZXQgczNCdWNrZXQ6IHMzLklCdWNrZXQ7XG4gICAgaWYgKHRoaXMucHJvcHMuczNCdWNrZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgczNCdWNrZXQgPSBuZXcgczMuQnVja2V0KHNjb3BlLCAnQnVja2V0Jywge1xuICAgICAgICBlbmNyeXB0aW9uOiBzMy5CdWNrZXRFbmNyeXB0aW9uLlVORU5DUllQVEVELFxuICAgICAgICByZW1vdmFsUG9saWN5OiBSZW1vdmFsUG9saWN5LlJFVEFJTixcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBzM0J1Y2tldCA9IHRoaXMucHJvcHMuczNCdWNrZXQ7XG4gICAgfVxuXG4gICAgLy8gaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL3ZwYy9sYXRlc3QvdXNlcmd1aWRlL2Zsb3ctbG9ncy1zMy5odG1sI2Zsb3ctbG9ncy1zMy1wZXJtaXNzaW9uc1xuICAgIGlmIChGZWF0dXJlRmxhZ3Mub2Yoc2NvcGUpLmlzRW5hYmxlZChTM19DUkVBVEVfREVGQVVMVF9MT0dHSU5HX1BPTElDWSkpIHtcbiAgICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2Yoc2NvcGUpO1xuICAgICAgbGV0IGtleVByZWZpeCA9IHRoaXMucHJvcHMua2V5UHJlZml4ID8/ICcnO1xuICAgICAgaWYgKGtleVByZWZpeCAmJiAha2V5UHJlZml4LmVuZHNXaXRoKCcvJykpIHtcbiAgICAgICAga2V5UHJlZml4ID0ga2V5UHJlZml4ICsgJy8nO1xuICAgICAgfVxuICAgICAgY29uc3QgcHJlZml4ID0gdGhpcy5wcm9wcy5kZXN0aW5hdGlvbk9wdGlvbnM/LmhpdmVDb21wYXRpYmxlUGFydGl0aW9uc1xuICAgICAgICA/IHMzQnVja2V0LmFybkZvck9iamVjdHMoYCR7a2V5UHJlZml4fUFXU0xvZ3MvYXdzLWFjY291bnQtaWQ9JHtzdGFjay5hY2NvdW50fS8qYClcbiAgICAgICAgOiBzM0J1Y2tldC5hcm5Gb3JPYmplY3RzKGAke2tleVByZWZpeH1BV1NMb2dzLyR7c3RhY2suYWNjb3VudH0vKmApO1xuXG4gICAgICBzM0J1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICBwcmluY2lwYWxzOiBbXG4gICAgICAgICAgbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdkZWxpdmVyeS5sb2dzLmFtYXpvbmF3cy5jb20nKSxcbiAgICAgICAgXSxcbiAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgcHJlZml4LFxuICAgICAgICBdLFxuICAgICAgICBhY3Rpb25zOiBbJ3MzOlB1dE9iamVjdCddLFxuICAgICAgICBjb25kaXRpb25zOiB7XG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAnczM6eC1hbXotYWNsJzogJ2J1Y2tldC1vd25lci1mdWxsLWNvbnRyb2wnLFxuICAgICAgICAgICAgJ2F3czpTb3VyY2VBY2NvdW50Jzogc3RhY2suYWNjb3VudCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIEFybkxpa2U6IHtcbiAgICAgICAgICAgICdhd3M6U291cmNlQXJuJzogc3RhY2suZm9ybWF0QXJuKHtcbiAgICAgICAgICAgICAgc2VydmljZTogJ2xvZ3MnLFxuICAgICAgICAgICAgICByZXNvdXJjZTogJyonLFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pKTtcblxuICAgICAgczNCdWNrZXQuYWRkVG9SZXNvdXJjZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgcHJpbmNpcGFsczogW1xuICAgICAgICAgIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZGVsaXZlcnkubG9ncy5hbWF6b25hd3MuY29tJyksXG4gICAgICAgIF0sXG4gICAgICAgIHJlc291cmNlczogW3MzQnVja2V0LmJ1Y2tldEFybl0sXG4gICAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgICAnczM6R2V0QnVja2V0QWNsJyxcbiAgICAgICAgICAnczM6TGlzdEJ1Y2tldCcsXG4gICAgICAgIF0sXG4gICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICdhd3M6U291cmNlQWNjb3VudCc6IHN0YWNrLmFjY291bnQsXG4gICAgICAgICAgfSxcbiAgICAgICAgICBBcm5MaWtlOiB7XG4gICAgICAgICAgICAnYXdzOlNvdXJjZUFybic6IHN0YWNrLmZvcm1hdEFybih7XG4gICAgICAgICAgICAgIHNlcnZpY2U6ICdsb2dzJyxcbiAgICAgICAgICAgICAgcmVzb3VyY2U6ICcqJyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KSk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBsb2dEZXN0aW5hdGlvblR5cGU6IEZsb3dMb2dEZXN0aW5hdGlvblR5cGUuUzMsXG4gICAgICBzM0J1Y2tldCxcbiAgICAgIGtleVByZWZpeDogdGhpcy5wcm9wcy5rZXlQcmVmaXgsXG4gICAgICBkZXN0aW5hdGlvbk9wdGlvbnM6ICh0aGlzLnByb3BzLmRlc3RpbmF0aW9uT3B0aW9ucz8uZmlsZUZvcm1hdCB8fCB0aGlzLnByb3BzLmRlc3RpbmF0aW9uT3B0aW9ucz8ucGVySG91clBhcnRpdGlvblxuICAgICAgfHwgdGhpcy5wcm9wcy5kZXN0aW5hdGlvbk9wdGlvbnM/LmhpdmVDb21wYXRpYmxlUGFydGl0aW9ucylcbiAgICAgICAgPyB7XG4gICAgICAgICAgZmlsZUZvcm1hdDogdGhpcy5wcm9wcy5kZXN0aW5hdGlvbk9wdGlvbnMuZmlsZUZvcm1hdCA/PyBGbG93TG9nRmlsZUZvcm1hdC5QTEFJTl9URVhULFxuICAgICAgICAgIHBlckhvdXJQYXJ0aXRpb246IHRoaXMucHJvcHMuZGVzdGluYXRpb25PcHRpb25zLnBlckhvdXJQYXJ0aXRpb24gPz8gZmFsc2UsXG4gICAgICAgICAgaGl2ZUNvbXBhdGlibGVQYXJ0aXRpb25zOiB0aGlzLnByb3BzLmRlc3RpbmF0aW9uT3B0aW9ucy5oaXZlQ29tcGF0aWJsZVBhcnRpdGlvbnMgPz8gZmFsc2UsXG4gICAgICAgIH0gOiB1bmRlZmluZWQsXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqXG4gKi9cbmNsYXNzIENsb3VkV2F0Y2hMb2dzRGVzdGluYXRpb24gZXh0ZW5kcyBGbG93TG9nRGVzdGluYXRpb24ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBGbG93TG9nRGVzdGluYXRpb25Db25maWcpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGJpbmQoc2NvcGU6IENvbnN0cnVjdCwgX2Zsb3dMb2c6IEZsb3dMb2cpOiBGbG93TG9nRGVzdGluYXRpb25Db25maWcge1xuICAgIGxldCBpYW1Sb2xlOiBpYW0uSVJvbGU7XG4gICAgbGV0IGxvZ0dyb3VwOiBsb2dzLklMb2dHcm91cDtcbiAgICBpZiAodGhpcy5wcm9wcy5pYW1Sb2xlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlhbVJvbGUgPSBuZXcgaWFtLlJvbGUoc2NvcGUsICdJQU1Sb2xlJywge1xuICAgICAgICByb2xlTmFtZTogUGh5c2ljYWxOYW1lLkdFTkVSQVRFX0lGX05FRURFRCxcbiAgICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLlNlcnZpY2VQcmluY2lwYWwoJ3ZwYy1mbG93LWxvZ3MuYW1hem9uYXdzLmNvbScpLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlhbVJvbGUgPSB0aGlzLnByb3BzLmlhbVJvbGU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucHJvcHMubG9nR3JvdXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgbG9nR3JvdXAgPSBuZXcgbG9ncy5Mb2dHcm91cChzY29wZSwgJ0xvZ0dyb3VwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZ0dyb3VwID0gdGhpcy5wcm9wcy5sb2dHcm91cDtcbiAgICB9XG5cbiAgICBpYW1Sb2xlLmFkZFRvUHJpbmNpcGFsUG9saWN5KFxuICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgICAnbG9nczpQdXRMb2dFdmVudHMnLFxuICAgICAgICAgICdsb2dzOkRlc2NyaWJlTG9nU3RyZWFtcycsXG4gICAgICAgIF0sXG4gICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgcmVzb3VyY2VzOiBbbG9nR3JvdXAubG9nR3JvdXBBcm5dLFxuICAgICAgfSksXG4gICAgKTtcblxuICAgIGlhbVJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3koXG4gICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgIGFjdGlvbnM6IFsnaWFtOlBhc3NSb2xlJ10sXG4gICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcbiAgICAgICAgcmVzb3VyY2VzOiBbaWFtUm9sZS5yb2xlQXJuXSxcbiAgICAgIH0pLFxuICAgICk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbG9nRGVzdGluYXRpb25UeXBlOiBGbG93TG9nRGVzdGluYXRpb25UeXBlLkNMT1VEX1dBVENIX0xPR1MsXG4gICAgICBsb2dHcm91cCxcbiAgICAgIGlhbVJvbGUsXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBtYXhpbXVtIGludGVydmFsIG9mIHRpbWUgZHVyaW5nIHdoaWNoIGEgZmxvdyBvZiBwYWNrZXRzXG4gKiBpcyBjYXB0dXJlZCBhbmQgYWdncmVnYXRlZCBpbnRvIGEgZmxvdyBsb2cgcmVjb3JkLlxuICpcbiAqL1xuZXhwb3J0IGVudW0gRmxvd0xvZ01heEFnZ3JlZ2F0aW9uSW50ZXJ2YWwge1xuICAvKipcbiAgICogMSBtaW51dGUgKDYwIHNlY29uZHMpXG4gICAqL1xuICBPTkVfTUlOVVRFID0gNjAsXG5cbiAgLyoqXG4gICAqIDEwIG1pbnV0ZXMgKDYwMCBzZWNvbmRzKVxuICAgKi9cbiAgVEVOX01JTlVURVMgPSA2MDAsXG5cbn1cblxuLyoqXG4gKiBUaGUgZm9sbG93aW5nIHRhYmxlIGRlc2NyaWJlcyBhbGwgb2YgdGhlIGF2YWlsYWJsZSBmaWVsZHMgZm9yIGEgZmxvdyBsb2cgcmVjb3JkLlxuICovXG5leHBvcnQgY2xhc3MgTG9nRm9ybWF0IHtcbiAgLyoqXG4gICAqIFRoZSBWUEMgRmxvdyBMb2dzIHZlcnNpb24uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFZFUlNJT04gPSBMb2dGb3JtYXQuZmllbGQoJ3ZlcnNpb24nKTtcblxuICAvKipcbiAgICogVGhlIEFXUyBhY2NvdW50IElEIG9mIHRoZSBvd25lciBvZiB0aGUgc291cmNlIG5ldHdvcmsgaW50ZXJmYWNlIGZvciB3aGljaCB0cmFmZmljIGlzIHJlY29yZGVkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBQ0NPVU5UX0lEID0gTG9nRm9ybWF0LmZpZWxkKCdhY2NvdW50LWlkJyk7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgbmV0d29yayBpbnRlcmZhY2UgZm9yIHdoaWNoIHRoZSB0cmFmZmljIGlzIHJlY29yZGVkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBJTlRFUkZBQ0VfSUQgPSBMb2dGb3JtYXQuZmllbGQoJ2ludGVyZmFjZS1pZCcpO1xuXG4gIC8qKlxuICAgKiBUaGUgc291cmNlIGFkZHJlc3MgZm9yIGluY29taW5nIHRyYWZmaWMsIG9yIHRoZSBJUHY0IG9yIElQdjYgYWRkcmVzcyBvZiB0aGUgbmV0d29yayBpbnRlcmZhY2VcbiAgICogZm9yIG91dGdvaW5nIHRyYWZmaWMgb24gdGhlIG5ldHdvcmsgaW50ZXJmYWNlLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTUkNfQUREUiA9IExvZ0Zvcm1hdC5maWVsZCgnc3JjYWRkcicpO1xuXG4gIC8qKlxuICAgKiBUaGUgZGVzdGluYXRpb24gYWRkcmVzcyBmb3Igb3V0Z29pbmcgdHJhZmZpYywgb3IgdGhlIElQdjQgb3IgSVB2NiBhZGRyZXNzIG9mIHRoZSBuZXR3b3JrIGludGVyZmFjZVxuICAgKiBmb3IgaW5jb21pbmcgdHJhZmZpYyBvbiB0aGUgbmV0d29yayBpbnRlcmZhY2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERTVF9BRERSID0gTG9nRm9ybWF0LmZpZWxkKCdkc3RhZGRyJyk7XG5cbiAgLyoqXG4gICAqIFRoZSBzb3VyY2UgcG9ydCBvZiB0aGUgdHJhZmZpYy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU1JDX1BPUlQgPSBMb2dGb3JtYXQuZmllbGQoJ3NyY3BvcnQnKTtcblxuICAvKipcbiAgICogVGhlIGRlc3RpbmF0aW9uIHBvcnQgb2YgdGhlIHRyYWZmaWMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IERTVF9QT1JUID0gTG9nRm9ybWF0LmZpZWxkKCdkc3Rwb3J0Jyk7XG5cbiAgLyoqXG4gICAqIFRoZSBJQU5BIHByb3RvY29sIG51bWJlciBvZiB0aGUgdHJhZmZpYy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUFJPVE9DT0wgPSBMb2dGb3JtYXQuZmllbGQoJ3Byb3RvY29sJyk7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgcGFja2V0cyB0cmFuc2ZlcnJlZCBkdXJpbmcgdGhlIGZsb3cuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBBQ0tFVFMgPSBMb2dGb3JtYXQuZmllbGQoJ3BhY2tldHMnKTtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBieXRlcyB0cmFuc2ZlcnJlZCBkdXJpbmcgdGhlIGZsb3cuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEJZVEVTID0gTG9nRm9ybWF0LmZpZWxkKCdieXRlcycpO1xuXG4gIC8qKlxuICAgKiBUaGUgdGltZSwgaW4gVW5peCBzZWNvbmRzLCB3aGVuIHRoZSBmaXJzdCBwYWNrZXQgb2YgdGhlIGZsb3cgd2FzIHJlY2VpdmVkIHdpdGhpblxuICAgKiB0aGUgYWdncmVnYXRpb24gaW50ZXJ2YWwuXG4gICAqXG4gICAqIFRoaXMgbWlnaHQgYmUgdXAgdG8gNjAgc2Vjb25kcyBhZnRlciB0aGUgcGFja2V0IHdhcyB0cmFuc21pdHRlZCBvciByZWNlaXZlZCBvblxuICAgKiB0aGUgbmV0d29yayBpbnRlcmZhY2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFNUQVJUX1RJTUVTVEFNUCA9IExvZ0Zvcm1hdC5maWVsZCgnc3RhcnQnKTtcblxuICAvKipcbiAgICogVGhlIHRpbWUsIGluIFVuaXggc2Vjb25kcywgd2hlbiB0aGUgbGFzdCBwYWNrZXQgb2YgdGhlIGZsb3cgd2FzIHJlY2VpdmVkIHdpdGhpblxuICAgKiB0aGUgYWdncmVnYXRpb24gaW50ZXJ2YWwuXG4gICAqXG4gICAqIFRoaXMgbWlnaHQgYmUgdXAgdG8gNjAgc2Vjb25kcyBhZnRlciB0aGUgcGFja2V0IHdhcyB0cmFuc21pdHRlZCBvciByZWNlaXZlZCBvblxuICAgKiB0aGUgbmV0d29yayBpbnRlcmZhY2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEVORF9USU1FU1RBTVAgPSBMb2dGb3JtYXQuZmllbGQoJ2VuZCcpO1xuXG4gIC8qKlxuICAgKiBUaGUgYWN0aW9uIHRoYXQgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSB0cmFmZmljLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBQ1RJT04gPSBMb2dGb3JtYXQuZmllbGQoJ2FjdGlvbicpO1xuXG4gIC8qKlxuICAgKiBUaGUgbG9nZ2luZyBzdGF0dXMgb2YgdGhlIGZsb3cgbG9nLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBMT0dfU1RBVFVTID0gTG9nRm9ybWF0LmZpZWxkKCdsb2ctc3RhdHVzJyk7XG5cbiAgLyoqXG4gICAqIFRoZSBJRCBvZiB0aGUgVlBDIHRoYXQgY29udGFpbnMgdGhlIG5ldHdvcmsgaW50ZXJmYWNlIGZvciB3aGljaCB0aGUgdHJhZmZpYyBpcyByZWNvcmRlZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVlBDX0lEID0gTG9nRm9ybWF0LmZpZWxkKCd2cGMtaWQnKTtcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBzdWJuZXQgdGhhdCBjb250YWlucyB0aGUgbmV0d29yayBpbnRlcmZhY2UgZm9yIHdoaWNoIHRoZSB0cmFmZmljIGlzIHJlY29yZGVkLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTVUJORVRfSUQgPSBMb2dGb3JtYXQuZmllbGQoJ3N1Ym5ldC1pZCcpO1xuXG4gIC8qKlxuICAgKiBUaGUgSUQgb2YgdGhlIGluc3RhbmNlIHRoYXQncyBhc3NvY2lhdGVkIHdpdGggbmV0d29yayBpbnRlcmZhY2UgZm9yIHdoaWNoIHRoZSB0cmFmZmljIGlzXG4gICAqIHJlY29yZGVkLCBpZiB0aGUgaW5zdGFuY2UgaXMgb3duZWQgYnkgeW91LlxuICAgKlxuICAgKiBSZXR1cm5zIGEgJy0nIHN5bWJvbCBmb3IgYSByZXF1ZXN0ZXItbWFuYWdlZCBuZXR3b3JrIGludGVyZmFjZTsgZm9yIGV4YW1wbGUsIHRoZVxuICAgKiBuZXR3b3JrIGludGVyZmFjZSBmb3IgYSBOQVQgZ2F0ZXdheVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBJTlNUQU5DRV9JRCA9IExvZ0Zvcm1hdC5maWVsZCgnaW5zdGFuY2UtaWQnKTtcblxuICAvKipcbiAgICogVGhlIGJpdG1hc2sgdmFsdWUgZm9yIFRDUCBmbGFncy5cbiAgICpcbiAgICogLSBGSU4gLS0gMVxuICAgKiAtIFNZTiAtLSAyXG4gICAqIC0gUlNUIC0tIDRcbiAgICogLSBTWU4tQUNLIC0tIDE4XG4gICAqXG4gICAqIElmIG5vIHN1cHBvcnRlZCBmbGFncyBhcmUgcmVjb3JkZWQsIHRoZSBUQ1AgZmxhZyB2YWx1ZSBpcyAwLlxuICAgKlxuICAgKiBUQ1AgZmxhZ3MgY2FuIGJlIE9SLWVkIGR1cmluZyB0aGUgYWdncmVnYXRpb24gaW50ZXJ2YWwuIEZvciBzaG9ydCBjb25uZWN0aW9ucyxcbiAgICogdGhlIGZsYWdzIG1pZ2h0IGJlIHNldCBvbiB0aGUgc2FtZSBsaW5lIGluIHRoZSBmbG93IGxvZyByZWNvcmQsIGZvciBleGFtcGxlLFxuICAgKiAxOSBmb3IgU1lOLUFDSyBhbmQgRklOLCBhbmQgMyBmb3IgU1lOIGFuZCBGSU4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFRDUF9GTEFHUyA9IExvZ0Zvcm1hdC5maWVsZCgndGNwLWZsYWdzJyk7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRyYWZmaWMuXG4gICAqXG4gICAqIFRoZSBwb3NzaWJsZSB2YWx1ZXMgYXJlIElQdjQsIElQdjYsIG9yIEVGQS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVFJBRkZJQ19UWVBFID0gTG9nRm9ybWF0LmZpZWxkKCd0eXBlJyk7XG5cbiAgLyoqXG4gICAqIFRoZSBwYWNrZXQtbGV2ZWwgKG9yaWdpbmFsKSBzb3VyY2UgSVAgYWRkcmVzcyBvZiB0aGUgdHJhZmZpYy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUEtUX1NSQ19BRERSID0gTG9nRm9ybWF0LmZpZWxkKCdwa3Qtc3JjYWRkcicpO1xuXG4gIC8qKlxuICAgKiBUaGUgcGFja2V0LWxldmVsIChvcmlnaW5hbCkgZGVzdGluYXRpb24gSVAgYWRkcmVzcyBmb3IgdGhlIHRyYWZmaWMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFBLVF9EU1RfQUREUiA9IExvZ0Zvcm1hdC5maWVsZCgncGt0LWRzdGFkZHInKTtcblxuICAvKipcbiAgICogVGhlIFJlZ2lvbiB0aGF0IGNvbnRhaW5zIHRoZSBuZXR3b3JrIGludGVyZmFjZSBmb3Igd2hpY2ggdHJhZmZpYyBpcyByZWNvcmRlZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUkVHSU9OID0gTG9nRm9ybWF0LmZpZWxkKCdyZWdpb24nKTtcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBBdmFpbGFiaWxpdHkgWm9uZSB0aGF0IGNvbnRhaW5zIHRoZSBuZXR3b3JrIGludGVyZmFjZSBmb3Igd2hpY2ggdHJhZmZpYyBpcyByZWNvcmRlZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQVpfSUQgPSBMb2dGb3JtYXQuZmllbGQoJ2F6LWlkJyk7XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHN1YmxvY2F0aW9uIHRoYXQncyByZXR1cm5lZCBpbiB0aGUgc3VibG9jYXRpb24taWQgZmllbGQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFNVQkxPQ0FUSU9OX1RZUEUgPSBMb2dGb3JtYXQuZmllbGQoJ3N1YmxvY2F0aW9uLXR5cGUnKTtcblxuICAvKipcbiAgICogVGhlIElEIG9mIHRoZSBzdWJsb2NhdGlvbiB0aGF0IGNvbnRhaW5zIHRoZSBuZXR3b3JrIGludGVyZmFjZSBmb3Igd2hpY2ggdHJhZmZpYyBpcyByZWNvcmRlZC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU1VCTE9DQVRJT05fSUQgPSBMb2dGb3JtYXQuZmllbGQoJ3N1YmxvY2F0aW9uLWlkJyk7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzdWJzZXQgb2YgSVAgYWRkcmVzcyByYW5nZXMgZm9yIHRoZSBwa3Qtc3JjYWRkciBmaWVsZCxcbiAgICogaWYgdGhlIHNvdXJjZSBJUCBhZGRyZXNzIGlzIGZvciBhbiBBV1Mgc2VydmljZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUEtUX1NSQ19BV1NfU0VSVklDRSA9IExvZ0Zvcm1hdC5maWVsZCgncGt0LXNyYy1hd3Mtc2VydmljZScpO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgc3Vic2V0IG9mIElQIGFkZHJlc3MgcmFuZ2VzIGZvciB0aGUgcGt0LWRzdGFkZHIgZmllbGQsXG4gICAqIGlmIHRoZSBkZXN0aW5hdGlvbiBJUCBhZGRyZXNzIGlzIGZvciBhbiBBV1Mgc2VydmljZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgUEtUX0RTVF9BV1NfU0VSVklDRSA9IExvZ0Zvcm1hdC5maWVsZCgncGt0LWRzdC1hd3Mtc2VydmljZScpO1xuXG4gIC8qKlxuICAgKiBUaGUgZGlyZWN0aW9uIG9mIHRoZSBmbG93IHdpdGggcmVzcGVjdCB0byB0aGUgaW50ZXJmYWNlIHdoZXJlIHRyYWZmaWMgaXMgY2FwdHVyZWQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEZMT1dfRElSRUNUSU9OID0gTG9nRm9ybWF0LmZpZWxkKCdmbG93LWRpcmVjdGlvbicpO1xuXG4gIC8qKlxuICAgKiBUaGUgcGF0aCB0aGF0IGVncmVzcyB0cmFmZmljIHRha2VzIHRvIHRoZSBkZXN0aW5hdGlvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgVFJBRkZJQ19QQVRIID0gTG9nRm9ybWF0LmZpZWxkKCd0cmFmZmljLXBhdGgnKTtcblxuICAvKipcbiAgICogVGhlIGRlZmF1bHQgZm9ybWF0LlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBTExfREVGQVVMVF9GSUVMRFMgPSBuZXcgTG9nRm9ybWF0KCcke3ZlcnNpb259ICR7YWNjb3VudC1pZH0gJHtpbnRlcmZhY2UtaWR9ICR7c3JjYWRkcn0gJHtkc3RhZGRyfSAke3NyY3BvcnR9ICR7ZHN0cG9ydH0gJHtwcm90b2NvbH0gJHtwYWNrZXRzfSAke2J5dGVzfSAke3N0YXJ0fSAke2VuZH0gJHthY3Rpb259ICR7bG9nLXN0YXR1c30nKTtcblxuICAvKipcbiAgICogQSBjdXN0b20gZm9ybWF0IHN0cmluZy5cbiAgICpcbiAgICogR2l2ZXMgZnVsbCBjb250cm9sIG92ZXIgdGhlIGZvcm1hdCBzdHJpbmcgZnJhZ21lbnQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGN1c3RvbShmb3JtYXRTdHJpbmc6IHN0cmluZyk6IExvZ0Zvcm1hdCB7XG4gICAgcmV0dXJuIG5ldyBMb2dGb3JtYXQoZm9ybWF0U3RyaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGN1c3RvbSBmaWVsZCBuYW1lLlxuICAgKlxuICAgKiBJZiB0aGVyZSBpcyBubyByZWFkeS1tYWRlIGNvbnN0YW50IGZvciBhIG5ldyBmaWVsZCB5ZXQsIHlvdSBjYW4gdXNlIHRoaXMuXG4gICAqIFRoZSBmaWVsZCBuYW1lIHdpbGwgYXV0b21hdGljYWxseSBiZSB3cmFwcGVkIGluIGAkeyAuLi4gfWAuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZpZWxkKGZpZWxkOiBzdHJpbmcpOiBMb2dGb3JtYXQge1xuICAgIHJldHVybiBuZXcgTG9nRm9ybWF0KGBcXCR7JHtmaWVsZH19YCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHZhbHVlOiBzdHJpbmcpIHt9XG59XG5cbi8qKlxuICogT3B0aW9ucyB0byBhZGQgYSBmbG93IGxvZyB0byBhIFZQQ1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEZsb3dMb2dPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRyYWZmaWMgdG8gbG9nLiBZb3UgY2FuIGxvZyB0cmFmZmljIHRoYXQgdGhlIHJlc291cmNlIGFjY2VwdHMgb3IgcmVqZWN0cywgb3IgYWxsIHRyYWZmaWMuXG4gICAqXG4gICAqIEBkZWZhdWx0IEFMTFxuICAgKi9cbiAgcmVhZG9ubHkgdHJhZmZpY1R5cGU/OiBGbG93TG9nVHJhZmZpY1R5cGU7XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgdHlwZSBvZiBkZXN0aW5hdGlvbiB0byB3aGljaCB0aGUgZmxvdyBsb2cgZGF0YSBpcyB0byBiZSBwdWJsaXNoZWQuXG4gICAqIEZsb3cgbG9nIGRhdGEgY2FuIGJlIHB1Ymxpc2hlZCB0byBDbG91ZFdhdGNoIExvZ3Mgb3IgQW1hem9uIFMzXG4gICAqXG4gICAqIEBkZWZhdWx0IEZsb3dMb2dEZXN0aW5hdGlvblR5cGUudG9DbG91ZFdhdGNoTG9ncygpXG4gICAqL1xuICByZWFkb25seSBkZXN0aW5hdGlvbj86IEZsb3dMb2dEZXN0aW5hdGlvbjtcblxuICAvKipcbiAgICogVGhlIGZpZWxkcyB0byBpbmNsdWRlIGluIHRoZSBmbG93IGxvZyByZWNvcmQsIGluIHRoZSBvcmRlciBpbiB3aGljaCB0aGV5IHNob3VsZCBhcHBlYXIuXG4gICAqXG4gICAqIElmIG11bHRpcGxlIGZpZWxkcyBhcmUgc3BlY2lmaWVkLCB0aGV5IHdpbGwgYmUgc2VwYXJhdGVkIGJ5IHNwYWNlcy4gRm9yIGZ1bGwgY29udHJvbCBvdmVyIHRoZSBsaXRlcmFsIGxvZyBmb3JtYXRcbiAgICogc3RyaW5nLCBwYXNzIGEgc2luZ2xlIGZpZWxkIGNvbnN0cnVjdGVkIHdpdGggYExvZ0Zvcm1hdC5jdXN0b20oKWAuXG4gICAqXG4gICAqIFNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vdnBjL2xhdGVzdC91c2VyZ3VpZGUvZmxvdy1sb2dzLmh0bWwjZmxvdy1sb2ctcmVjb3Jkc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRlZmF1bHQgbG9nIGZvcm1hdCBpcyB1c2VkLlxuICAgKi9cbiAgcmVhZG9ubHkgbG9nRm9ybWF0PzogTG9nRm9ybWF0W107XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIGludGVydmFsIG9mIHRpbWUgZHVyaW5nIHdoaWNoIGEgZmxvdyBvZiBwYWNrZXRzIGlzIGNhcHR1cmVkXG4gICAqIGFuZCBhZ2dyZWdhdGVkIGludG8gYSBmbG93IGxvZyByZWNvcmQuXG4gICAqXG4gICAqIEBkZWZhdWx0IEZsb3dMb2dNYXhBZ2dyZWdhdGlvbkludGVydmFsLlRFTl9NSU5VVEVTXG4gICAqL1xuICByZWFkb25seSBtYXhBZ2dyZWdhdGlvbkludGVydmFsPzogRmxvd0xvZ01heEFnZ3JlZ2F0aW9uSW50ZXJ2YWw7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBvZiBhIFZQQyBGbG93IExvZ1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEZsb3dMb2dQcm9wcyBleHRlbmRzIEZsb3dMb2dPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBGbG93TG9nXG4gICAqXG4gICAqIEl0IGlzIG5vdCByZWNvbW1lbmRlZCB0byB1c2UgYW4gZXhwbGljaXQgbmFtZS5cbiAgICpcbiAgICogQGRlZmF1bHQgSWYgeW91IGRvbid0IHNwZWNpZnkgYSBmbG93TG9nTmFtZSwgQVdTIENsb3VkRm9ybWF0aW9uIGdlbmVyYXRlcyBhXG4gICAqIHVuaXF1ZSBwaHlzaWNhbCBJRCBhbmQgdXNlcyB0aGF0IElEIGZvciB0aGUgZ3JvdXAgbmFtZS5cbiAgICovXG4gIHJlYWRvbmx5IGZsb3dMb2dOYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgdHlwZSBvZiByZXNvdXJjZSBmb3Igd2hpY2ggdG8gY3JlYXRlIHRoZSBmbG93IGxvZ1xuICAgKi9cbiAgcmVhZG9ubHkgcmVzb3VyY2VUeXBlOiBGbG93TG9nUmVzb3VyY2VUeXBlO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGNsYXNzIGZvciBhIEZsb3cgTG9nXG4gKi9cbmFic3RyYWN0IGNsYXNzIEZsb3dMb2dCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJRmxvd0xvZyB7XG4gIC8qKlxuICAgKiBUaGUgSWQgb2YgdGhlIFZQQyBGbG93IExvZ1xuICAgKlxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZmxvd0xvZ0lkOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSBWUEMgZmxvdyBsb2cuXG4gKiBAcmVzb3VyY2UgQVdTOjpFQzI6OkZsb3dMb2dcbiAqL1xuZXhwb3J0IGNsYXNzIEZsb3dMb2cgZXh0ZW5kcyBGbG93TG9nQmFzZSB7XG4gIC8qKlxuICAgKiBJbXBvcnQgYSBGbG93IExvZyBieSBpdCdzIElkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21GbG93TG9nSWQoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgZmxvd0xvZ0lkOiBzdHJpbmcpOiBJRmxvd0xvZyB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgRmxvd0xvZ0Jhc2Uge1xuICAgICAgcHVibGljIGZsb3dMb2dJZCA9IGZsb3dMb2dJZDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBJZCBvZiB0aGUgVlBDIEZsb3cgTG9nXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBmbG93TG9nSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIFMzIGJ1Y2tldCB0byBwdWJsaXNoIGZsb3cgbG9ncyB0b1xuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldD86IHMzLklCdWNrZXQ7XG5cbiAgLyoqXG4gICAqIFMzIGJ1Y2tldCBrZXkgcHJlZml4IHRvIHB1Ymxpc2ggdGhlIGZsb3cgbG9ncyB1bmRlclxuICAgKi9cbiAgcmVhZG9ubHkga2V5UHJlZml4Pzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgaWFtIHJvbGUgdXNlZCB0byBwdWJsaXNoIGxvZ3MgdG8gQ2xvdWRXYXRjaFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGlhbVJvbGU/OiBpYW0uSVJvbGU7XG5cbiAgLyoqXG4gICAqIFRoZSBDbG91ZFdhdGNoIExvZ3MgTG9nR3JvdXAgdG8gcHVibGlzaCBmbG93IGxvZ3MgdG9cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBsb2dHcm91cD86IGxvZ3MuSUxvZ0dyb3VwO1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBGbG93TG9nUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuZmxvd0xvZ05hbWUsXG4gICAgfSk7XG5cbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHByb3BzLmRlc3RpbmF0aW9uIHx8IEZsb3dMb2dEZXN0aW5hdGlvbi50b0Nsb3VkV2F0Y2hMb2dzKCk7XG5cbiAgICBjb25zdCBkZXN0aW5hdGlvbkNvbmZpZyA9IGRlc3RpbmF0aW9uLmJpbmQodGhpcywgdGhpcyk7XG4gICAgdGhpcy5sb2dHcm91cCA9IGRlc3RpbmF0aW9uQ29uZmlnLmxvZ0dyb3VwO1xuICAgIHRoaXMuYnVja2V0ID0gZGVzdGluYXRpb25Db25maWcuczNCdWNrZXQ7XG4gICAgdGhpcy5pYW1Sb2xlID0gZGVzdGluYXRpb25Db25maWcuaWFtUm9sZTtcbiAgICB0aGlzLmtleVByZWZpeCA9IGRlc3RpbmF0aW9uQ29uZmlnLmtleVByZWZpeDtcblxuICAgIGxldCBsb2dEZXN0aW5hdGlvbjogc3RyaW5nIHwgdW5kZWZpbmVkID0gdW5kZWZpbmVkO1xuICAgIGlmICh0aGlzLmJ1Y2tldCkge1xuICAgICAgbG9nRGVzdGluYXRpb24gPSB0aGlzLmtleVByZWZpeCA/IHRoaXMuYnVja2V0LmFybkZvck9iamVjdHModGhpcy5rZXlQcmVmaXgpIDogdGhpcy5idWNrZXQuYnVja2V0QXJuO1xuICAgIH1cbiAgICBsZXQgY3VzdG9tTG9nRm9ybWF0OiBzdHJpbmcgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHByb3BzLmxvZ0Zvcm1hdCkge1xuICAgICAgY3VzdG9tTG9nRm9ybWF0ID0gcHJvcHMubG9nRm9ybWF0Lm1hcChlbG0gPT4ge1xuICAgICAgICByZXR1cm4gZWxtLnZhbHVlO1xuICAgICAgfSkuam9pbignICcpO1xuICAgIH1cblxuICAgIGNvbnN0IGZsb3dMb2cgPSBuZXcgQ2ZuRmxvd0xvZyh0aGlzLCAnRmxvd0xvZycsIHtcbiAgICAgIGRlc3RpbmF0aW9uT3B0aW9uczogZGVzdGluYXRpb25Db25maWcuZGVzdGluYXRpb25PcHRpb25zLFxuICAgICAgZGVsaXZlckxvZ3NQZXJtaXNzaW9uQXJuOiB0aGlzLmlhbVJvbGUgPyB0aGlzLmlhbVJvbGUucm9sZUFybiA6IHVuZGVmaW5lZCxcbiAgICAgIGxvZ0Rlc3RpbmF0aW9uVHlwZTogZGVzdGluYXRpb25Db25maWcubG9nRGVzdGluYXRpb25UeXBlLFxuICAgICAgbG9nR3JvdXBOYW1lOiB0aGlzLmxvZ0dyb3VwID8gdGhpcy5sb2dHcm91cC5sb2dHcm91cE5hbWUgOiB1bmRlZmluZWQsXG4gICAgICBtYXhBZ2dyZWdhdGlvbkludGVydmFsOiBwcm9wcy5tYXhBZ2dyZWdhdGlvbkludGVydmFsLFxuICAgICAgcmVzb3VyY2VJZDogcHJvcHMucmVzb3VyY2VUeXBlLnJlc291cmNlSWQsXG4gICAgICByZXNvdXJjZVR5cGU6IHByb3BzLnJlc291cmNlVHlwZS5yZXNvdXJjZVR5cGUsXG4gICAgICB0cmFmZmljVHlwZTogcHJvcHMudHJhZmZpY1R5cGVcbiAgICAgICAgPyBwcm9wcy50cmFmZmljVHlwZVxuICAgICAgICA6IEZsb3dMb2dUcmFmZmljVHlwZS5BTEwsXG4gICAgICBsb2dGb3JtYXQ6IGN1c3RvbUxvZ0Zvcm1hdCxcbiAgICAgIGxvZ0Rlc3RpbmF0aW9uLFxuICAgIH0pO1xuXG4gICAgLy8gVlBDIHNlcnZpY2UgaW1wbGljaXRseSB0cmllcyB0byBjcmVhdGUgYSBidWNrZXQgcG9saWN5IHdoZW4gYWRkaW5nIGEgdnBjIGZsb3cgbG9nLlxuICAgIC8vIFRvIGF2b2lkIHRoZSByYWNlIGNvbmRpdGlvbiwgd2UgYWRkIGFuIGV4cGxpY2l0IGRlcGVuZGVuY3kgaGVyZS5cbiAgICBpZiAodGhpcy5idWNrZXQ/LnBvbGljeT8ubm9kZS5kZWZhdWx0Q2hpbGQgaW5zdGFuY2VvZiBDZm5SZXNvdXJjZSkge1xuICAgICAgZmxvd0xvZy5hZGREZXBlbmRlbmN5KHRoaXMuYnVja2V0Py5wb2xpY3kubm9kZS5kZWZhdWx0Q2hpbGQpO1xuICAgIH1cblxuICAgIC8vIHdlIG11c3QgcmVtb3ZlIGEgZmxvdyBsb2cgY29uZmlndXJhdGlvbiBmaXJzdCBiZWZvcmUgZGVsZXRpbmcgb2JqZWN0cy5cbiAgICBjb25zdCBkZWxldGVPYmplY3RzID0gdGhpcy5idWNrZXQ/Lm5vZGUudHJ5RmluZENoaWxkKCdBdXRvRGVsZXRlT2JqZWN0c0N1c3RvbVJlc291cmNlJyk/Lm5vZGUuZGVmYXVsdENoaWxkO1xuICAgIGlmIChkZWxldGVPYmplY3RzIGluc3RhbmNlb2YgQ2ZuUmVzb3VyY2UpIHtcbiAgICAgIGZsb3dMb2cuYWRkRGVwZW5kZW5jeShkZWxldGVPYmplY3RzKTtcbiAgICB9XG5cbiAgICB0aGlzLmZsb3dMb2dJZCA9IGZsb3dMb2cucmVmO1xuICAgIHRoaXMubm9kZS5kZWZhdWx0Q2hpbGQgPSBmbG93TG9nO1xuICB9XG59XG4iXX0=