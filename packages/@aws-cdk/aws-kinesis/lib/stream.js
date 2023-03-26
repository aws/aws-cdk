"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamMode = exports.StreamEncryption = exports.Stream = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cloudwatch = require("@aws-cdk/aws-cloudwatch");
const iam = require("@aws-cdk/aws-iam");
const kms = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const kinesis_fixed_canned_metrics_1 = require("./kinesis-fixed-canned-metrics");
const kinesis_generated_1 = require("./kinesis.generated");
const READ_OPERATIONS = [
    'kinesis:DescribeStreamSummary',
    'kinesis:GetRecords',
    'kinesis:GetShardIterator',
    'kinesis:ListShards',
    'kinesis:SubscribeToShard',
    'kinesis:DescribeStream',
    'kinesis:ListStreams',
    'kinesis:DescribeStreamConsumer',
];
const WRITE_OPERATIONS = [
    'kinesis:ListShards',
    'kinesis:PutRecord',
    'kinesis:PutRecords',
];
/**
 * Represents a Kinesis Stream.
 */
class StreamBase extends core_1.Resource {
    /**
     * Grant read permissions for this stream and its contents to an IAM
     * principal (Role/Group/User).
     *
     * If an encryption key is used, permission to ues the key to decrypt the
     * contents of the stream will also be granted.
     */
    grantRead(grantee) {
        const ret = this.grant(grantee, ...READ_OPERATIONS);
        if (this.encryptionKey) {
            this.encryptionKey.grantDecrypt(grantee);
        }
        return ret;
    }
    /**
     * Grant write permissions for this stream and its contents to an IAM
     * principal (Role/Group/User).
     *
     * If an encryption key is used, permission to ues the key to encrypt the
     * contents of the stream will also be granted.
     */
    grantWrite(grantee) {
        const ret = this.grant(grantee, ...WRITE_OPERATIONS);
        this.encryptionKey?.grantEncrypt(grantee);
        return ret;
    }
    /**
     * Grants read/write permissions for this stream and its contents to an IAM
     * principal (Role/Group/User).
     *
     * If an encryption key is used, permission to use the key for
     * encrypt/decrypt will also be granted.
     */
    grantReadWrite(grantee) {
        const ret = this.grant(grantee, ...Array.from(new Set([...READ_OPERATIONS, ...WRITE_OPERATIONS])));
        this.encryptionKey?.grantEncryptDecrypt(grantee);
        return ret;
    }
    /**
     * Grant the indicated permissions on this stream to the given IAM principal (Role/Group/User).
     */
    grant(grantee, ...actions) {
        return iam.Grant.addToPrincipal({
            grantee,
            actions,
            resourceArns: [this.streamArn],
            scope: this,
        });
    }
    /**
     * Return stream metric based from its metric name
     *
     * @param metricName name of the stream metric
     * @param props properties of the metric
     */
    metric(metricName, props) {
        return new cloudwatch.Metric({
            namespace: 'AWS/Kinesis',
            metricName,
            dimensionsMap: {
                StreamName: this.streamName,
            },
            ...props,
        }).attachTo(this);
    }
    /**
     * The number of bytes retrieved from the Kinesis stream, measured over the specified time period. Minimum, Maximum,
     * and Average statistics represent the bytes in a single GetRecords operation for the stream in the specified time
     * period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricGetRecordsBytes(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.getRecordsBytesAverage, props);
    }
    /**
     * The age of the last record in all GetRecords calls made against a Kinesis stream, measured over the specified time
     * period. Age is the difference between the current time and when the last record of the GetRecords call was written
     * to the stream. The Minimum and Maximum statistics can be used to track the progress of Kinesis consumer
     * applications. A value of zero indicates that the records being read are completely caught up with the stream.
     *
     * The metric defaults to maximum over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricGetRecordsIteratorAgeMilliseconds(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.getRecordsIteratorAgeMillisecondsMaximum, props);
    }
    /**
     * The number of successful GetRecords operations per stream, measured over the specified time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricGetRecordsSuccess(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.getRecordsSuccessAverage, props);
    }
    /**
     * The number of records retrieved from the shard, measured over the specified time period. Minimum, Maximum, and
     * Average statistics represent the records in a single GetRecords operation for the stream in the specified time
     * period.
     *
     * average
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricGetRecords(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.getRecordsRecordsAverage, props);
    }
    /**
     * The number of successful GetRecords operations per stream, measured over the specified time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricGetRecordsLatency(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.getRecordsLatencyAverage, props);
    }
    /**
     * The number of bytes put to the Kinesis stream using the PutRecord operation over the specified time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricPutRecordBytes(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.putRecordBytesAverage, props);
    }
    /**
     * The time taken per PutRecord operation, measured over the specified time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricPutRecordLatency(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.putRecordLatencyAverage, props);
    }
    /**
     * The number of successful PutRecord operations per Kinesis stream, measured over the specified time period. Average
     * reflects the percentage of successful writes to a stream.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricPutRecordSuccess(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.putRecordSuccessAverage, props);
    }
    /**
     * The number of bytes put to the Kinesis stream using the PutRecords operation over the specified time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricPutRecordsBytes(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.putRecordsBytesAverage, props);
    }
    /**
     * The time taken per PutRecords operation, measured over the specified time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricPutRecordsLatency(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.putRecordsLatencyAverage, props);
    }
    /**
     *  The number of PutRecords operations where at least one record succeeded, per Kinesis stream, measured over the
     *  specified time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricPutRecordsSuccess(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.putRecordsSuccessAverage, props);
    }
    /**
     * The total number of records sent in a PutRecords operation per Kinesis data stream, measured over the specified
     * time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricPutRecordsTotalRecords(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.putRecordsTotalRecordsAverage, props);
    }
    /**
     * The number of successful records in a PutRecords operation per Kinesis data stream, measured over the specified
     * time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricPutRecordsSuccessfulRecords(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.putRecordsSuccessfulRecordsAverage, props);
    }
    /**
     * The number of records rejected due to internal failures in a PutRecords operation per Kinesis data stream,
     * measured over the specified time period. Occasional internal failures are to be expected and should be retried.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricPutRecordsFailedRecords(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.putRecordsFailedRecordsAverage, props);
    }
    /**
     * The number of records rejected due to throttling in a PutRecords operation per Kinesis data stream, measured over
     * the specified time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricPutRecordsThrottledRecords(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.putRecordsThrottledRecordsAverage, props);
    }
    /**
     * The number of bytes successfully put to the Kinesis stream over the specified time period. This metric includes
     * bytes from PutRecord and PutRecords operations. Minimum, Maximum, and Average statistics represent the bytes in a
     * single put operation for the stream in the specified time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricIncomingBytes(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.incomingBytesAverage, props);
    }
    /**
     * The number of records successfully put to the Kinesis stream over the specified time period. This metric includes
     * record counts from PutRecord and PutRecords operations. Minimum, Maximum, and Average statistics represent the
     * records in a single put operation for the stream in the specified time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricIncomingRecords(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.incomingRecordsAverage, props);
    }
    /**
     * The number of GetRecords calls throttled for the stream over the specified time period. The most commonly used
     * statistic for this metric is Average.
     *
     * When the Minimum statistic has a value of 1, all records were throttled for the stream during the specified time
     * period.
     *
     * When the Maximum statistic has a value of 0 (zero), no records were throttled for the stream during the specified
     * time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties
     *
     * @param props properties of the metric
     *
     */
    metricReadProvisionedThroughputExceeded(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.readProvisionedThroughputExceededAverage, props);
    }
    /**
     * The number of records rejected due to throttling for the stream over the specified time period. This metric
     * includes throttling from PutRecord and PutRecords operations.
     *
     * When the Minimum statistic has a non-zero value, records were being throttled for the stream during the specified
     * time period.
     *
     * When the Maximum statistic has a value of 0 (zero), no records were being throttled for the stream during the
     * specified time period.
     *
     * The metric defaults to average over 5 minutes, it can be changed by passing `statistic` and `period` properties.
     *
     * @param props properties of the metric
     */
    metricWriteProvisionedThroughputExceeded(props) {
        return this.metricFromCannedFunction(kinesis_fixed_canned_metrics_1.KinesisMetrics.writeProvisionedThroughputExceededAverage, props);
    }
    // create metrics based on generated KinesisMetrics static methods
    metricFromCannedFunction(createCannedProps, props) {
        return new cloudwatch.Metric({
            ...createCannedProps({ StreamName: this.streamName }),
            ...props,
        }).attachTo(this);
    }
}
/**
 * A Kinesis stream. Can be encrypted with a KMS key.
 */
class Stream extends StreamBase {
    constructor(scope, id, props = {}) {
        super(scope, id, {
            physicalName: props.streamName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_kinesis_StreamProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Stream);
            }
            throw error;
        }
        let shardCount = props.shardCount;
        const streamMode = props.streamMode ?? StreamMode.PROVISIONED;
        if (streamMode === StreamMode.ON_DEMAND && shardCount !== undefined) {
            throw new Error(`streamMode must be set to ${StreamMode.PROVISIONED} (default) when specifying shardCount`);
        }
        if (streamMode === StreamMode.PROVISIONED && shardCount === undefined) {
            shardCount = 1;
        }
        const retentionPeriodHours = props.retentionPeriod?.toHours() ?? 24;
        if (!core_1.Token.isUnresolved(retentionPeriodHours)) {
            if (retentionPeriodHours < 24 || retentionPeriodHours > 8760) {
                throw new Error(`retentionPeriod must be between 24 and 8760 hours. Received ${retentionPeriodHours}`);
            }
        }
        const { streamEncryption, encryptionKey } = this.parseEncryption(props);
        this.stream = new kinesis_generated_1.CfnStream(this, 'Resource', {
            name: this.physicalName,
            retentionPeriodHours,
            shardCount,
            streamEncryption,
            streamModeDetails: streamMode ? { streamMode } : undefined,
        });
        this.streamArn = this.getResourceArnAttribute(this.stream.attrArn, {
            service: 'kinesis',
            resource: 'stream',
            resourceName: this.physicalName,
        });
        this.streamName = this.getResourceNameAttribute(this.stream.ref);
        this.encryptionKey = encryptionKey;
    }
    /**
     * Import an existing Kinesis Stream provided an ARN
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name
     * @param streamArn Stream ARN (i.e. arn:aws:kinesis:<region>:<account-id>:stream/Foo)
     */
    static fromStreamArn(scope, id, streamArn) {
        return Stream.fromStreamAttributes(scope, id, { streamArn });
    }
    /**
     * Creates a Stream construct that represents an external stream.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param attrs Stream import properties
     */
    static fromStreamAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_kinesis_StreamAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromStreamAttributes);
            }
            throw error;
        }
        class Import extends StreamBase {
            constructor() {
                super(...arguments);
                this.streamArn = attrs.streamArn;
                this.streamName = core_1.Stack.of(scope).splitArn(attrs.streamArn, core_1.ArnFormat.SLASH_RESOURCE_NAME).resourceName;
                this.encryptionKey = attrs.encryptionKey;
            }
        }
        return new Import(scope, id);
    }
    /**
     * Set up key properties and return the Stream encryption property from the
     * user's configuration.
     */
    parseEncryption(props) {
        // if encryption properties are not set, default to KMS in regions where KMS is available
        if (!props.encryption && !props.encryptionKey) {
            const conditionName = 'AwsCdkKinesisEncryptedStreamsUnsupportedRegions';
            const existing = core_1.Stack.of(this).node.tryFindChild(conditionName);
            // create a single condition for the Stack
            if (!existing) {
                new core_1.CfnCondition(core_1.Stack.of(this), conditionName, {
                    expression: core_1.Fn.conditionOr(core_1.Fn.conditionEquals(core_1.Aws.REGION, 'cn-north-1'), core_1.Fn.conditionEquals(core_1.Aws.REGION, 'cn-northwest-1')),
                });
            }
            return {
                streamEncryption: core_1.Fn.conditionIf(conditionName, core_1.Aws.NO_VALUE, { EncryptionType: 'KMS', KeyId: 'alias/aws/kinesis' }),
            };
        }
        // default based on whether encryption key is specified
        const encryptionType = props.encryption ??
            (props.encryptionKey ? StreamEncryption.KMS : StreamEncryption.UNENCRYPTED);
        // if encryption key is set, encryption must be set to KMS.
        if (encryptionType !== StreamEncryption.KMS && props.encryptionKey) {
            throw new Error(`encryptionKey is specified, so 'encryption' must be set to KMS (value: ${encryptionType})`);
        }
        if (encryptionType === StreamEncryption.UNENCRYPTED) {
            return {};
        }
        if (encryptionType === StreamEncryption.MANAGED) {
            const encryption = { encryptionType: 'KMS', keyId: 'alias/aws/kinesis' };
            return { streamEncryption: encryption };
        }
        if (encryptionType === StreamEncryption.KMS) {
            const encryptionKey = props.encryptionKey || new kms.Key(this, 'Key', {
                description: `Created by ${this.node.path}`,
            });
            const streamEncryption = {
                encryptionType: 'KMS',
                keyId: encryptionKey.keyArn,
            };
            return { encryptionKey, streamEncryption };
        }
        throw new Error(`Unexpected 'encryptionType': ${encryptionType}`);
    }
}
exports.Stream = Stream;
_a = JSII_RTTI_SYMBOL_1;
Stream[_a] = { fqn: "@aws-cdk/aws-kinesis.Stream", version: "0.0.0" };
/**
 * What kind of server-side encryption to apply to this stream
 */
var StreamEncryption;
(function (StreamEncryption) {
    /**
     * Records in the stream are not encrypted.
     */
    StreamEncryption["UNENCRYPTED"] = "NONE";
    /**
     * Server-side encryption with a KMS key managed by the user.
     * If `encryptionKey` is specified, this key will be used, otherwise, one will be defined.
     */
    StreamEncryption["KMS"] = "KMS";
    /**
     * Server-side encryption with a master key managed by Amazon Kinesis
     */
    StreamEncryption["MANAGED"] = "MANAGED";
})(StreamEncryption = exports.StreamEncryption || (exports.StreamEncryption = {}));
/**
 * Specifies the capacity mode to apply to this stream.
 */
var StreamMode;
(function (StreamMode) {
    /**
     * Specify the provisioned capacity mode. The stream will have `shardCount` shards unless
     * modified and will be billed according to the provisioned capacity.
     */
    StreamMode["PROVISIONED"] = "PROVISIONED";
    /**
     * Specify the on-demand capacity mode. The stream will autoscale and be billed according to the
     * volume of data ingested and retrieved.
     */
    StreamMode["ON_DEMAND"] = "ON_DEMAND";
})(StreamMode = exports.StreamMode || (exports.StreamMode = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyZWFtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RyZWFtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHNEQUFzRDtBQUN0RCx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLHdDQUEySDtBQUUzSCxpRkFBZ0U7QUFDaEUsMkRBQWdEO0FBRWhELE1BQU0sZUFBZSxHQUFHO0lBQ3RCLCtCQUErQjtJQUMvQixvQkFBb0I7SUFDcEIsMEJBQTBCO0lBQzFCLG9CQUFvQjtJQUNwQiwwQkFBMEI7SUFDMUIsd0JBQXdCO0lBQ3hCLHFCQUFxQjtJQUNyQixnQ0FBZ0M7Q0FDakMsQ0FBQztBQUVGLE1BQU0sZ0JBQWdCLEdBQUc7SUFDdkIsb0JBQW9CO0lBQ3BCLG1CQUFtQjtJQUNuQixvQkFBb0I7Q0FDckIsQ0FBQztBQWdTRjs7R0FFRztBQUNILE1BQWUsVUFBVyxTQUFRLGVBQVE7SUFnQnhDOzs7Ozs7T0FNRztJQUNJLFNBQVMsQ0FBQyxPQUF1QjtRQUN0QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxHQUFHLGVBQWUsQ0FBQyxDQUFDO1FBRXBELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUMxQztRQUVELE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFRDs7Ozs7O09BTUc7SUFDSSxVQUFVLENBQUMsT0FBdUI7UUFDdkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3JELElBQUksQ0FBQyxhQUFhLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFDLE9BQU8sR0FBRyxDQUFDO0tBQ1o7SUFFRDs7Ozs7O09BTUc7SUFDSSxjQUFjLENBQUMsT0FBdUI7UUFDM0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtB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QXVDO2dCQUMzRCxjQUFjLEVBQUUsS0FBSztnQkFDckIsS0FBSyxFQUFFLGFBQWEsQ0FBQyxNQUFNO2FBQzVCLENBQUM7WUFDRixPQUFPLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixFQUFFLENBQUM7U0FDNUM7UUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLGdDQUFnQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO0tBQ25FOztBQTdJSCx3QkE4SUM7OztBQUVEOztHQUVHO0FBQ0gsSUFBWSxnQkFnQlg7QUFoQkQsV0FBWSxnQkFBZ0I7SUFDMUI7O09BRUc7SUFDSCx3Q0FBb0IsQ0FBQTtJQUVwQjs7O09BR0c7SUFDSCwrQkFBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCx1Q0FBbUIsQ0FBQTtBQUNyQixDQUFDLEVBaEJXLGdCQUFnQixHQUFoQix3QkFBZ0IsS0FBaEIsd0JBQWdCLFFBZ0IzQjtBQUVEOztHQUVHO0FBQ0gsSUFBWSxVQVlYO0FBWkQsV0FBWSxVQUFVO0lBQ3BCOzs7T0FHRztJQUNILHlDQUEyQixDQUFBO0lBRTNCOzs7T0FHRztJQUNILHFDQUF1QixDQUFBO0FBQ3pCLENBQUMsRUFaVyxVQUFVLEdBQVYsa0JBQVUsS0FBVixrQkFBVSxRQVlyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNsb3Vkd2F0Y2ggZnJvbSAnQGF3cy1jZGsvYXdzLWNsb3Vkd2F0Y2gnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0IHsgQXJuRm9ybWF0LCBBd3MsIENmbkNvbmRpdGlvbiwgRHVyYXRpb24sIEZuLCBJUmVzb2x2YWJsZSwgSVJlc291cmNlLCBSZXNvdXJjZSwgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IEtpbmVzaXNNZXRyaWNzIH0gZnJvbSAnLi9raW5lc2lzLWZpeGVkLWNhbm5lZC1tZXRyaWNzJztcbmltcG9ydCB7IENmblN0cmVhbSB9IGZyb20gJy4va2luZXNpcy5nZW5lcmF0ZWQnO1xuXG5jb25zdCBSRUFEX09QRVJBVElPTlMgPSBbXG4gICdraW5lc2lzOkRlc2NyaWJlU3RyZWFtU3VtbWFyeScsXG4gICdraW5lc2lzOkdldFJlY29yZHMnLFxuICAna2luZXNpczpHZXRTaGFyZEl0ZXJhdG9yJyxcbiAgJ2tpbmVzaXM6TGlzdFNoYXJkcycsXG4gICdraW5lc2lzOlN1YnNjcmliZVRvU2hhcmQnLFxuICAna2luZXNpczpEZXNjcmliZVN0cmVhbScsXG4gICdraW5lc2lzOkxpc3RTdHJlYW1zJyxcbiAgJ2tpbmVzaXM6RGVzY3JpYmVTdHJlYW1Db25zdW1lcicsXG5dO1xuXG5jb25zdCBXUklURV9PUEVSQVRJT05TID0gW1xuICAna2luZXNpczpMaXN0U2hhcmRzJyxcbiAgJ2tpbmVzaXM6UHV0UmVjb3JkJyxcbiAgJ2tpbmVzaXM6UHV0UmVjb3JkcycsXG5dO1xuXG4vKipcbiAqIEEgS2luZXNpcyBTdHJlYW1cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJU3RyZWFtIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIHN0cmVhbS5cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RyZWFtQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzdHJlYW1cbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RyZWFtTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBPcHRpb25hbCBLTVMgZW5jcnlwdGlvbiBrZXkgYXNzb2NpYXRlZCB3aXRoIHRoaXMgc3RyZWFtLlxuICAgKi9cbiAgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuXG4gIC8qKlxuICAgKiBHcmFudCByZWFkIHBlcm1pc3Npb25zIGZvciB0aGlzIHN0cmVhbSBhbmQgaXRzIGNvbnRlbnRzIHRvIGFuIElBTVxuICAgKiBwcmluY2lwYWwgKFJvbGUvR3JvdXAvVXNlcikuXG4gICAqXG4gICAqIElmIGFuIGVuY3J5cHRpb24ga2V5IGlzIHVzZWQsIHBlcm1pc3Npb24gdG8gdWVzIHRoZSBrZXkgdG8gZGVjcnlwdCB0aGVcbiAgICogY29udGVudHMgb2YgdGhlIHN0cmVhbSB3aWxsIGFsc28gYmUgZ3JhbnRlZC5cbiAgICovXG4gIGdyYW50UmVhZChncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnQgd3JpdGUgcGVybWlzc2lvbnMgZm9yIHRoaXMgc3RyZWFtIGFuZCBpdHMgY29udGVudHMgdG8gYW4gSUFNXG4gICAqIHByaW5jaXBhbCAoUm9sZS9Hcm91cC9Vc2VyKS5cbiAgICpcbiAgICogSWYgYW4gZW5jcnlwdGlvbiBrZXkgaXMgdXNlZCwgcGVybWlzc2lvbiB0byB1ZXMgdGhlIGtleSB0byBlbmNyeXB0IHRoZVxuICAgKiBjb250ZW50cyBvZiB0aGUgc3RyZWFtIHdpbGwgYWxzbyBiZSBncmFudGVkLlxuICAgKi9cbiAgZ3JhbnRXcml0ZShncmFudGVlOiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudDtcblxuICAvKipcbiAgICogR3JhbnRzIHJlYWQvd3JpdGUgcGVybWlzc2lvbnMgZm9yIHRoaXMgc3RyZWFtIGFuZCBpdHMgY29udGVudHMgdG8gYW4gSUFNXG4gICAqIHByaW5jaXBhbCAoUm9sZS9Hcm91cC9Vc2VyKS5cbiAgICpcbiAgICogSWYgYW4gZW5jcnlwdGlvbiBrZXkgaXMgdXNlZCwgcGVybWlzc2lvbiB0byB1c2UgdGhlIGtleSBmb3JcbiAgICogZW5jcnlwdC9kZWNyeXB0IHdpbGwgYWxzbyBiZSBncmFudGVkLlxuICAgKi9cbiAgZ3JhbnRSZWFkV3JpdGUoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBpbmRpY2F0ZWQgcGVybWlzc2lvbnMgb24gdGhpcyBzdHJlYW0gdG8gdGhlIHByb3ZpZGVkIElBTSBwcmluY2lwYWwuXG4gICAqL1xuICBncmFudChncmFudGVlOiBpYW0uSUdyYW50YWJsZSwgLi4uYWN0aW9uczogc3RyaW5nW10pOiBpYW0uR3JhbnQ7XG5cbiAgLyoqXG4gICAqIFJldHVybiBzdHJlYW0gbWV0cmljIGJhc2VkIGZyb20gaXRzIG1ldHJpYyBuYW1lXG4gICAqXG4gICAqIEBwYXJhbSBtZXRyaWNOYW1lIG5hbWUgb2YgdGhlIHN0cmVhbSBtZXRyaWNcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgbWV0cmljKG1ldHJpY05hbWU6IHN0cmluZywgcHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBieXRlcyByZXRyaWV2ZWQgZnJvbSB0aGUgS2luZXNpcyBzdHJlYW0sIG1lYXN1cmVkIG92ZXIgdGhlIHNwZWNpZmllZCB0aW1lIHBlcmlvZC4gTWluaW11bSwgTWF4aW11bSxcbiAgICogYW5kIEF2ZXJhZ2Ugc3RhdGlzdGljcyByZXByZXNlbnQgdGhlIGJ5dGVzIGluIGEgc2luZ2xlIEdldFJlY29yZHMgb3BlcmF0aW9uIGZvciB0aGUgc3RyZWFtIGluIHRoZSBzcGVjaWZpZWQgdGltZVxuICAgKiBwZXJpb2QuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgbWV0cmljR2V0UmVjb3Jkc0J5dGVzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBhZ2Ugb2YgdGhlIGxhc3QgcmVjb3JkIGluIGFsbCBHZXRSZWNvcmRzIGNhbGxzIG1hZGUgYWdhaW5zdCBhIEtpbmVzaXMgc3RyZWFtLCBtZWFzdXJlZCBvdmVyIHRoZSBzcGVjaWZpZWQgdGltZVxuICAgKiBwZXJpb2QuIEFnZSBpcyB0aGUgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSBjdXJyZW50IHRpbWUgYW5kIHdoZW4gdGhlIGxhc3QgcmVjb3JkIG9mIHRoZSBHZXRSZWNvcmRzIGNhbGwgd2FzIHdyaXR0ZW5cbiAgICogdG8gdGhlIHN0cmVhbS4gVGhlIE1pbmltdW0gYW5kIE1heGltdW0gc3RhdGlzdGljcyBjYW4gYmUgdXNlZCB0byB0cmFjayB0aGUgcHJvZ3Jlc3Mgb2YgS2luZXNpcyBjb25zdW1lclxuICAgKiBhcHBsaWNhdGlvbnMuIEEgdmFsdWUgb2YgemVybyBpbmRpY2F0ZXMgdGhhdCB0aGUgcmVjb3JkcyBiZWluZyByZWFkIGFyZSBjb21wbGV0ZWx5IGNhdWdodCB1cCB3aXRoIHRoZSBzdHJlYW0uXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gbWF4aW11bSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgbWV0cmljR2V0UmVjb3Jkc0l0ZXJhdG9yQWdlTWlsbGlzZWNvbmRzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIHRha2VuIHBlciBHZXRSZWNvcmRzIG9wZXJhdGlvbiwgbWVhc3VyZWQgb3ZlciB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBUaGUgbWV0cmljIGRlZmF1bHRzIHRvIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMsIGl0IGNhbiBiZSBjaGFuZ2VkIGJ5IHBhc3NpbmcgYHN0YXRpc3RpY2AgYW5kIGBwZXJpb2RgIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wZXJ0aWVzIG9mIHRoZSBtZXRyaWNcbiAgICovXG4gIG1ldHJpY0dldFJlY29yZHNMYXRlbmN5KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgcmVjb3JkcyByZXRyaWV2ZWQgZnJvbSB0aGUgc2hhcmQsIG1lYXN1cmVkIG92ZXIgdGhlIHNwZWNpZmllZCB0aW1lIHBlcmlvZC4gTWluaW11bSwgTWF4aW11bSwgYW5kXG4gICAqIEF2ZXJhZ2Ugc3RhdGlzdGljcyByZXByZXNlbnQgdGhlIHJlY29yZHMgaW4gYSBzaW5nbGUgR2V0UmVjb3JkcyBvcGVyYXRpb24gZm9yIHRoZSBzdHJlYW0gaW4gdGhlIHNwZWNpZmllZCB0aW1lXG4gICAqIHBlcmlvZC5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBhdmVyYWdlIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqL1xuICBtZXRyaWNHZXRSZWNvcmRzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2Ygc3VjY2Vzc2Z1bCBHZXRSZWNvcmRzIG9wZXJhdGlvbnMgcGVyIHN0cmVhbSwgbWVhc3VyZWQgb3ZlciB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBUaGUgbWV0cmljIGRlZmF1bHRzIHRvIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMsIGl0IGNhbiBiZSBjaGFuZ2VkIGJ5IHBhc3NpbmcgYHN0YXRpc3RpY2AgYW5kIGBwZXJpb2RgIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wZXJ0aWVzIG9mIHRoZSBtZXRyaWNcbiAgICovXG4gIG1ldHJpY0dldFJlY29yZHNTdWNjZXNzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgYnl0ZXMgc3VjY2Vzc2Z1bGx5IHB1dCB0byB0aGUgS2luZXNpcyBzdHJlYW0gb3ZlciB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLiBUaGlzIG1ldHJpYyBpbmNsdWRlc1xuICAgKiBieXRlcyBmcm9tIFB1dFJlY29yZCBhbmQgUHV0UmVjb3JkcyBvcGVyYXRpb25zLiBNaW5pbXVtLCBNYXhpbXVtLCBhbmQgQXZlcmFnZSBzdGF0aXN0aWNzIHJlcHJlc2VudCB0aGUgYnl0ZXMgaW4gYVxuICAgKiBzaW5nbGUgcHV0IG9wZXJhdGlvbiBmb3IgdGhlIHN0cmVhbSBpbiB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBUaGUgbWV0cmljIGRlZmF1bHRzIHRvIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMsIGl0IGNhbiBiZSBjaGFuZ2VkIGJ5IHBhc3NpbmcgYHN0YXRpc3RpY2AgYW5kIGBwZXJpb2RgIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wZXJ0aWVzIG9mIHRoZSBtZXRyaWNcbiAgICovXG4gIG1ldHJpY0luY29taW5nQnl0ZXMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiByZWNvcmRzIHN1Y2Nlc3NmdWxseSBwdXQgdG8gdGhlIEtpbmVzaXMgc3RyZWFtIG92ZXIgdGhlIHNwZWNpZmllZCB0aW1lIHBlcmlvZC4gVGhpcyBtZXRyaWMgaW5jbHVkZXNcbiAgICogcmVjb3JkIGNvdW50cyBmcm9tIFB1dFJlY29yZCBhbmQgUHV0UmVjb3JkcyBvcGVyYXRpb25zLiBNaW5pbXVtLCBNYXhpbXVtLCBhbmQgQXZlcmFnZSBzdGF0aXN0aWNzIHJlcHJlc2VudCB0aGVcbiAgICogcmVjb3JkcyBpbiBhIHNpbmdsZSBwdXQgb3BlcmF0aW9uIGZvciB0aGUgc3RyZWFtIGluIHRoZSBzcGVjaWZpZWQgdGltZSBwZXJpb2QuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgbWV0cmljSW5jb21pbmdSZWNvcmRzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgYnl0ZXMgcHV0IHRvIHRoZSBLaW5lc2lzIHN0cmVhbSB1c2luZyB0aGUgUHV0UmVjb3JkIG9wZXJhdGlvbiBvdmVyIHRoZSBzcGVjaWZpZWQgdGltZSBwZXJpb2QuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgbWV0cmljUHV0UmVjb3JkQnl0ZXMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIHRpbWUgdGFrZW4gcGVyIFB1dFJlY29yZCBvcGVyYXRpb24sIG1lYXN1cmVkIG92ZXIgdGhlIHNwZWNpZmllZCB0aW1lIHBlcmlvZC5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBhdmVyYWdlIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqL1xuICBtZXRyaWNQdXRSZWNvcmRMYXRlbmN5KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2Ygc3VjY2Vzc2Z1bCBQdXRSZWNvcmQgb3BlcmF0aW9ucyBwZXIgS2luZXNpcyBzdHJlYW0sIG1lYXN1cmVkIG92ZXIgdGhlIHNwZWNpZmllZCB0aW1lIHBlcmlvZC4gQXZlcmFnZVxuICAgKiByZWZsZWN0cyB0aGUgcGVyY2VudGFnZSBvZiBzdWNjZXNzZnVsIHdyaXRlcyB0byBhIHN0cmVhbS5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBhdmVyYWdlIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqL1xuICBtZXRyaWNQdXRSZWNvcmRTdWNjZXNzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgYnl0ZXMgcHV0IHRvIHRoZSBLaW5lc2lzIHN0cmVhbSB1c2luZyB0aGUgUHV0UmVjb3JkcyBvcGVyYXRpb24gb3ZlciB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBUaGUgbWV0cmljIGRlZmF1bHRzIHRvIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMsIGl0IGNhbiBiZSBjaGFuZ2VkIGJ5IHBhc3NpbmcgYHN0YXRpc3RpY2AgYW5kIGBwZXJpb2RgIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wZXJ0aWVzIG9mIHRoZSBtZXRyaWNcbiAgICovXG4gIG1ldHJpY1B1dFJlY29yZHNCeXRlcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgdGltZSB0YWtlbiBwZXIgUHV0UmVjb3JkcyBvcGVyYXRpb24sIG1lYXN1cmVkIG92ZXIgdGhlIHNwZWNpZmllZCB0aW1lIHBlcmlvZC5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBhdmVyYWdlIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqL1xuICBtZXRyaWNQdXRSZWNvcmRzTGF0ZW5jeShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiAgVGhlIG51bWJlciBvZiBQdXRSZWNvcmRzIG9wZXJhdGlvbnMgd2hlcmUgYXQgbGVhc3Qgb25lIHJlY29yZCBzdWNjZWVkZWQsIHBlciBLaW5lc2lzIHN0cmVhbSwgbWVhc3VyZWQgb3ZlciB0aGVcbiAgICogIHNwZWNpZmllZCB0aW1lIHBlcmlvZC5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBhdmVyYWdlIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqL1xuICBtZXRyaWNQdXRSZWNvcmRzU3VjY2Vzcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgdG90YWwgbnVtYmVyIG9mIHJlY29yZHMgc2VudCBpbiBhIFB1dFJlY29yZHMgb3BlcmF0aW9uIHBlciBLaW5lc2lzIGRhdGEgc3RyZWFtLCBtZWFzdXJlZCBvdmVyIHRoZSBzcGVjaWZpZWRcbiAgICogdGltZSBwZXJpb2QuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgbWV0cmljUHV0UmVjb3Jkc1RvdGFsUmVjb3Jkcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHN1Y2Nlc3NmdWwgcmVjb3JkcyBpbiBhIFB1dFJlY29yZHMgb3BlcmF0aW9uIHBlciBLaW5lc2lzIGRhdGEgc3RyZWFtLCBtZWFzdXJlZCBvdmVyIHRoZSBzcGVjaWZpZWRcbiAgICogdGltZSBwZXJpb2QuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgbWV0cmljUHV0UmVjb3Jkc1N1Y2Nlc3NmdWxSZWNvcmRzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgcmVjb3JkcyByZWplY3RlZCBkdWUgdG8gaW50ZXJuYWwgZmFpbHVyZXMgaW4gYSBQdXRSZWNvcmRzIG9wZXJhdGlvbiBwZXIgS2luZXNpcyBkYXRhIHN0cmVhbSxcbiAgICogbWVhc3VyZWQgb3ZlciB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLiBPY2Nhc2lvbmFsIGludGVybmFsIGZhaWx1cmVzIGFyZSB0byBiZSBleHBlY3RlZCBhbmQgc2hvdWxkIGJlIHJldHJpZWQuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgbWV0cmljUHV0UmVjb3Jkc0ZhaWxlZFJlY29yZHMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpOiBjbG91ZHdhdGNoLk1ldHJpYztcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiByZWNvcmRzIHJlamVjdGVkIGR1ZSB0byB0aHJvdHRsaW5nIGluIGEgUHV0UmVjb3JkcyBvcGVyYXRpb24gcGVyIEtpbmVzaXMgZGF0YSBzdHJlYW0sIG1lYXN1cmVkIG92ZXJcbiAgICogdGhlIHNwZWNpZmllZCB0aW1lIHBlcmlvZC5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBhdmVyYWdlIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqL1xuICBtZXRyaWNQdXRSZWNvcmRzVGhyb3R0bGVkUmVjb3Jkcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIEdldFJlY29yZHMgY2FsbHMgdGhyb3R0bGVkIGZvciB0aGUgc3RyZWFtIG92ZXIgdGhlIHNwZWNpZmllZCB0aW1lIHBlcmlvZC4gVGhlIG1vc3QgY29tbW9ubHkgdXNlZFxuICAgKiBzdGF0aXN0aWMgZm9yIHRoaXMgbWV0cmljIGlzIEF2ZXJhZ2UuXG4gICAqXG4gICAqIFdoZW4gdGhlIE1pbmltdW0gc3RhdGlzdGljIGhhcyBhIHZhbHVlIG9mIDEsIGFsbCByZWNvcmRzIHdlcmUgdGhyb3R0bGVkIGZvciB0aGUgc3RyZWFtIGR1cmluZyB0aGUgc3BlY2lmaWVkIHRpbWVcbiAgICogcGVyaW9kLlxuICAgKlxuICAgKiBXaGVuIHRoZSBNYXhpbXVtIHN0YXRpc3RpYyBoYXMgYSB2YWx1ZSBvZiAwICh6ZXJvKSwgbm8gcmVjb3JkcyB3ZXJlIHRocm90dGxlZCBmb3IgdGhlIHN0cmVhbSBkdXJpbmcgdGhlIHNwZWNpZmllZFxuICAgKiB0aW1lIHBlcmlvZC5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBhdmVyYWdlIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wZXJ0aWVzIG9mIHRoZSBtZXRyaWNcbiAgICpcbiAgICovXG4gIG1ldHJpY1JlYWRQcm92aXNpb25lZFRocm91Z2hwdXRFeGNlZWRlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHJlY29yZHMgcmVqZWN0ZWQgZHVlIHRvIHRocm90dGxpbmcgZm9yIHRoZSBzdHJlYW0gb3ZlciB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLiBUaGlzIG1ldHJpY1xuICAgKiBpbmNsdWRlcyB0aHJvdHRsaW5nIGZyb20gUHV0UmVjb3JkIGFuZCBQdXRSZWNvcmRzIG9wZXJhdGlvbnMuXG4gICAqXG4gICAqIFdoZW4gdGhlIE1pbmltdW0gc3RhdGlzdGljIGhhcyBhIG5vbi16ZXJvIHZhbHVlLCByZWNvcmRzIHdlcmUgYmVpbmcgdGhyb3R0bGVkIGZvciB0aGUgc3RyZWFtIGR1cmluZyB0aGUgc3BlY2lmaWVkXG4gICAqIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBXaGVuIHRoZSBNYXhpbXVtIHN0YXRpc3RpYyBoYXMgYSB2YWx1ZSBvZiAwICh6ZXJvKSwgbm8gcmVjb3JkcyB3ZXJlIGJlaW5nIHRocm90dGxlZCBmb3IgdGhlIHN0cmVhbSBkdXJpbmcgdGhlXG4gICAqIHNwZWNpZmllZCB0aW1lIHBlcmlvZC5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBhdmVyYWdlIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqL1xuICBtZXRyaWNXcml0ZVByb3Zpc2lvbmVkVGhyb3VnaHB1dEV4Y2VlZGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKTogY2xvdWR3YXRjaC5NZXRyaWM7XG59XG5cbi8qKlxuICogQSByZWZlcmVuY2UgdG8gYSBzdHJlYW0uIFRoZSBlYXNpZXN0IHdheSB0byBpbnN0YW50aWF0ZSBpcyB0byBjYWxsXG4gKiBgc3RyZWFtLmV4cG9ydCgpYC4gVGhlbiwgdGhlIGNvbnN1bWVyIGNhbiB1c2UgYFN0cmVhbS5pbXBvcnQodGhpcywgcmVmKWAgYW5kXG4gKiBnZXQgYSBgU3RyZWFtYC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdHJlYW1BdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBBUk4gb2YgdGhlIHN0cmVhbS5cbiAgICovXG4gIHJlYWRvbmx5IHN0cmVhbUFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgS01TIGtleSBzZWN1cmluZyB0aGUgY29udGVudHMgb2YgdGhlIHN0cmVhbSBpZiBlbmNyeXB0aW9uIGlzIGVuYWJsZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gZW5jcnlwdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBLaW5lc2lzIFN0cmVhbS5cbiAqL1xuYWJzdHJhY3QgY2xhc3MgU3RyZWFtQmFzZSBleHRlbmRzIFJlc291cmNlIGltcGxlbWVudHMgSVN0cmVhbSB7XG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBzdHJlYW0uXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgc3RyZWFtQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBzdHJlYW1cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBzdHJlYW1OYW1lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE9wdGlvbmFsIEtNUyBlbmNyeXB0aW9uIGtleSBhc3NvY2lhdGVkIHdpdGggdGhpcyBzdHJlYW0uXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuXG4gIC8qKlxuICAgKiBHcmFudCByZWFkIHBlcm1pc3Npb25zIGZvciB0aGlzIHN0cmVhbSBhbmQgaXRzIGNvbnRlbnRzIHRvIGFuIElBTVxuICAgKiBwcmluY2lwYWwgKFJvbGUvR3JvdXAvVXNlcikuXG4gICAqXG4gICAqIElmIGFuIGVuY3J5cHRpb24ga2V5IGlzIHVzZWQsIHBlcm1pc3Npb24gdG8gdWVzIHRoZSBrZXkgdG8gZGVjcnlwdCB0aGVcbiAgICogY29udGVudHMgb2YgdGhlIHN0cmVhbSB3aWxsIGFsc28gYmUgZ3JhbnRlZC5cbiAgICovXG4gIHB1YmxpYyBncmFudFJlYWQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpIHtcbiAgICBjb25zdCByZXQgPSB0aGlzLmdyYW50KGdyYW50ZWUsIC4uLlJFQURfT1BFUkFUSU9OUyk7XG5cbiAgICBpZiAodGhpcy5lbmNyeXB0aW9uS2V5KSB7XG4gICAgICB0aGlzLmVuY3J5cHRpb25LZXkuZ3JhbnREZWNyeXB0KGdyYW50ZWUpO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvKipcbiAgICogR3JhbnQgd3JpdGUgcGVybWlzc2lvbnMgZm9yIHRoaXMgc3RyZWFtIGFuZCBpdHMgY29udGVudHMgdG8gYW4gSUFNXG4gICAqIHByaW5jaXBhbCAoUm9sZS9Hcm91cC9Vc2VyKS5cbiAgICpcbiAgICogSWYgYW4gZW5jcnlwdGlvbiBrZXkgaXMgdXNlZCwgcGVybWlzc2lvbiB0byB1ZXMgdGhlIGtleSB0byBlbmNyeXB0IHRoZVxuICAgKiBjb250ZW50cyBvZiB0aGUgc3RyZWFtIHdpbGwgYWxzbyBiZSBncmFudGVkLlxuICAgKi9cbiAgcHVibGljIGdyYW50V3JpdGUoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpIHtcbiAgICBjb25zdCByZXQgPSB0aGlzLmdyYW50KGdyYW50ZWUsIC4uLldSSVRFX09QRVJBVElPTlMpO1xuICAgIHRoaXMuZW5jcnlwdGlvbktleT8uZ3JhbnRFbmNyeXB0KGdyYW50ZWUpO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHcmFudHMgcmVhZC93cml0ZSBwZXJtaXNzaW9ucyBmb3IgdGhpcyBzdHJlYW0gYW5kIGl0cyBjb250ZW50cyB0byBhbiBJQU1cbiAgICogcHJpbmNpcGFsIChSb2xlL0dyb3VwL1VzZXIpLlxuICAgKlxuICAgKiBJZiBhbiBlbmNyeXB0aW9uIGtleSBpcyB1c2VkLCBwZXJtaXNzaW9uIHRvIHVzZSB0aGUga2V5IGZvclxuICAgKiBlbmNyeXB0L2RlY3J5cHQgd2lsbCBhbHNvIGJlIGdyYW50ZWQuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnRSZWFkV3JpdGUoZ3JhbnRlZTogaWFtLklHcmFudGFibGUpIHtcbiAgICBjb25zdCByZXQgPSB0aGlzLmdyYW50KGdyYW50ZWUsIC4uLkFycmF5LmZyb20obmV3IFNldChbLi4uUkVBRF9PUEVSQVRJT05TLCAuLi5XUklURV9PUEVSQVRJT05TXSkpKTtcbiAgICB0aGlzLmVuY3J5cHRpb25LZXk/LmdyYW50RW5jcnlwdERlY3J5cHQoZ3JhbnRlZSk7XG5cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHRoZSBpbmRpY2F0ZWQgcGVybWlzc2lvbnMgb24gdGhpcyBzdHJlYW0gdG8gdGhlIGdpdmVuIElBTSBwcmluY2lwYWwgKFJvbGUvR3JvdXAvVXNlcikuXG4gICAqL1xuICBwdWJsaWMgZ3JhbnQoZ3JhbnRlZTogaWFtLklHcmFudGFibGUsIC4uLmFjdGlvbnM6IHN0cmluZ1tdKSB7XG4gICAgcmV0dXJuIGlhbS5HcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9ucyxcbiAgICAgIHJlc291cmNlQXJuczogW3RoaXMuc3RyZWFtQXJuXSxcbiAgICAgIHNjb3BlOiB0aGlzLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBzdHJlYW0gbWV0cmljIGJhc2VkIGZyb20gaXRzIG1ldHJpYyBuYW1lXG4gICAqXG4gICAqIEBwYXJhbSBtZXRyaWNOYW1lIG5hbWUgb2YgdGhlIHN0cmVhbSBtZXRyaWNcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgcHVibGljIG1ldHJpYyhtZXRyaWNOYW1lOiBzdHJpbmcsIHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIG5ldyBjbG91ZHdhdGNoLk1ldHJpYyh7XG4gICAgICBuYW1lc3BhY2U6ICdBV1MvS2luZXNpcycsXG4gICAgICBtZXRyaWNOYW1lLFxuICAgICAgZGltZW5zaW9uc01hcDoge1xuICAgICAgICBTdHJlYW1OYW1lOiB0aGlzLnN0cmVhbU5hbWUsXG4gICAgICB9LFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSkuYXR0YWNoVG8odGhpcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBieXRlcyByZXRyaWV2ZWQgZnJvbSB0aGUgS2luZXNpcyBzdHJlYW0sIG1lYXN1cmVkIG92ZXIgdGhlIHNwZWNpZmllZCB0aW1lIHBlcmlvZC4gTWluaW11bSwgTWF4aW11bSxcbiAgICogYW5kIEF2ZXJhZ2Ugc3RhdGlzdGljcyByZXByZXNlbnQgdGhlIGJ5dGVzIGluIGEgc2luZ2xlIEdldFJlY29yZHMgb3BlcmF0aW9uIGZvciB0aGUgc3RyZWFtIGluIHRoZSBzcGVjaWZpZWQgdGltZVxuICAgKiBwZXJpb2QuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0dldFJlY29yZHNCeXRlcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY0Zyb21DYW5uZWRGdW5jdGlvbihLaW5lc2lzTWV0cmljcy5nZXRSZWNvcmRzQnl0ZXNBdmVyYWdlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGFnZSBvZiB0aGUgbGFzdCByZWNvcmQgaW4gYWxsIEdldFJlY29yZHMgY2FsbHMgbWFkZSBhZ2FpbnN0IGEgS2luZXNpcyBzdHJlYW0sIG1lYXN1cmVkIG92ZXIgdGhlIHNwZWNpZmllZCB0aW1lXG4gICAqIHBlcmlvZC4gQWdlIGlzIHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGN1cnJlbnQgdGltZSBhbmQgd2hlbiB0aGUgbGFzdCByZWNvcmQgb2YgdGhlIEdldFJlY29yZHMgY2FsbCB3YXMgd3JpdHRlblxuICAgKiB0byB0aGUgc3RyZWFtLiBUaGUgTWluaW11bSBhbmQgTWF4aW11bSBzdGF0aXN0aWNzIGNhbiBiZSB1c2VkIHRvIHRyYWNrIHRoZSBwcm9ncmVzcyBvZiBLaW5lc2lzIGNvbnN1bWVyXG4gICAqIGFwcGxpY2F0aW9ucy4gQSB2YWx1ZSBvZiB6ZXJvIGluZGljYXRlcyB0aGF0IHRoZSByZWNvcmRzIGJlaW5nIHJlYWQgYXJlIGNvbXBsZXRlbHkgY2F1Z2h0IHVwIHdpdGggdGhlIHN0cmVhbS5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBtYXhpbXVtIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqL1xuICBwdWJsaWMgbWV0cmljR2V0UmVjb3Jkc0l0ZXJhdG9yQWdlTWlsbGlzZWNvbmRzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljRnJvbUNhbm5lZEZ1bmN0aW9uKEtpbmVzaXNNZXRyaWNzLmdldFJlY29yZHNJdGVyYXRvckFnZU1pbGxpc2Vjb25kc01heGltdW0sIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHN1Y2Nlc3NmdWwgR2V0UmVjb3JkcyBvcGVyYXRpb25zIHBlciBzdHJlYW0sIG1lYXN1cmVkIG92ZXIgdGhlIHNwZWNpZmllZCB0aW1lIHBlcmlvZC5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBhdmVyYWdlIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqL1xuICBwdWJsaWMgbWV0cmljR2V0UmVjb3Jkc1N1Y2Nlc3MocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNGcm9tQ2FubmVkRnVuY3Rpb24oS2luZXNpc01ldHJpY3MuZ2V0UmVjb3Jkc1N1Y2Nlc3NBdmVyYWdlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiByZWNvcmRzIHJldHJpZXZlZCBmcm9tIHRoZSBzaGFyZCwgbWVhc3VyZWQgb3ZlciB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLiBNaW5pbXVtLCBNYXhpbXVtLCBhbmRcbiAgICogQXZlcmFnZSBzdGF0aXN0aWNzIHJlcHJlc2VudCB0aGUgcmVjb3JkcyBpbiBhIHNpbmdsZSBHZXRSZWNvcmRzIG9wZXJhdGlvbiBmb3IgdGhlIHN0cmVhbSBpbiB0aGUgc3BlY2lmaWVkIHRpbWVcbiAgICogcGVyaW9kLlxuICAgKlxuICAgKiBhdmVyYWdlXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0dldFJlY29yZHMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNGcm9tQ2FubmVkRnVuY3Rpb24oS2luZXNpc01ldHJpY3MuZ2V0UmVjb3Jkc1JlY29yZHNBdmVyYWdlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBzdWNjZXNzZnVsIEdldFJlY29yZHMgb3BlcmF0aW9ucyBwZXIgc3RyZWFtLCBtZWFzdXJlZCBvdmVyIHRoZSBzcGVjaWZpZWQgdGltZSBwZXJpb2QuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0dldFJlY29yZHNMYXRlbmN5KHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljRnJvbUNhbm5lZEZ1bmN0aW9uKEtpbmVzaXNNZXRyaWNzLmdldFJlY29yZHNMYXRlbmN5QXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgYnl0ZXMgcHV0IHRvIHRoZSBLaW5lc2lzIHN0cmVhbSB1c2luZyB0aGUgUHV0UmVjb3JkIG9wZXJhdGlvbiBvdmVyIHRoZSBzcGVjaWZpZWQgdGltZSBwZXJpb2QuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1B1dFJlY29yZEJ5dGVzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljRnJvbUNhbm5lZEZ1bmN0aW9uKEtpbmVzaXNNZXRyaWNzLnB1dFJlY29yZEJ5dGVzQXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIHRha2VuIHBlciBQdXRSZWNvcmQgb3BlcmF0aW9uLCBtZWFzdXJlZCBvdmVyIHRoZSBzcGVjaWZpZWQgdGltZSBwZXJpb2QuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgbWV0cmljUHV0UmVjb3JkTGF0ZW5jeShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY0Zyb21DYW5uZWRGdW5jdGlvbihLaW5lc2lzTWV0cmljcy5wdXRSZWNvcmRMYXRlbmN5QXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2Ygc3VjY2Vzc2Z1bCBQdXRSZWNvcmQgb3BlcmF0aW9ucyBwZXIgS2luZXNpcyBzdHJlYW0sIG1lYXN1cmVkIG92ZXIgdGhlIHNwZWNpZmllZCB0aW1lIHBlcmlvZC4gQXZlcmFnZVxuICAgKiByZWZsZWN0cyB0aGUgcGVyY2VudGFnZSBvZiBzdWNjZXNzZnVsIHdyaXRlcyB0byBhIHN0cmVhbS5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBhdmVyYWdlIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqL1xuICBwdWJsaWMgbWV0cmljUHV0UmVjb3JkU3VjY2Vzcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY0Zyb21DYW5uZWRGdW5jdGlvbihLaW5lc2lzTWV0cmljcy5wdXRSZWNvcmRTdWNjZXNzQXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgYnl0ZXMgcHV0IHRvIHRoZSBLaW5lc2lzIHN0cmVhbSB1c2luZyB0aGUgUHV0UmVjb3JkcyBvcGVyYXRpb24gb3ZlciB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBUaGUgbWV0cmljIGRlZmF1bHRzIHRvIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMsIGl0IGNhbiBiZSBjaGFuZ2VkIGJ5IHBhc3NpbmcgYHN0YXRpc3RpY2AgYW5kIGBwZXJpb2RgIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wZXJ0aWVzIG9mIHRoZSBtZXRyaWNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNQdXRSZWNvcmRzQnl0ZXMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNGcm9tQ2FubmVkRnVuY3Rpb24oS2luZXNpc01ldHJpY3MucHV0UmVjb3Jkc0J5dGVzQXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSB0aW1lIHRha2VuIHBlciBQdXRSZWNvcmRzIG9wZXJhdGlvbiwgbWVhc3VyZWQgb3ZlciB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBUaGUgbWV0cmljIGRlZmF1bHRzIHRvIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMsIGl0IGNhbiBiZSBjaGFuZ2VkIGJ5IHBhc3NpbmcgYHN0YXRpc3RpY2AgYW5kIGBwZXJpb2RgIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wZXJ0aWVzIG9mIHRoZSBtZXRyaWNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNQdXRSZWNvcmRzTGF0ZW5jeShwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY0Zyb21DYW5uZWRGdW5jdGlvbihLaW5lc2lzTWV0cmljcy5wdXRSZWNvcmRzTGF0ZW5jeUF2ZXJhZ2UsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiAgVGhlIG51bWJlciBvZiBQdXRSZWNvcmRzIG9wZXJhdGlvbnMgd2hlcmUgYXQgbGVhc3Qgb25lIHJlY29yZCBzdWNjZWVkZWQsIHBlciBLaW5lc2lzIHN0cmVhbSwgbWVhc3VyZWQgb3ZlciB0aGVcbiAgICogIHNwZWNpZmllZCB0aW1lIHBlcmlvZC5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBhdmVyYWdlIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqL1xuICBwdWJsaWMgbWV0cmljUHV0UmVjb3Jkc1N1Y2Nlc3MocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNGcm9tQ2FubmVkRnVuY3Rpb24oS2luZXNpc01ldHJpY3MucHV0UmVjb3Jkc1N1Y2Nlc3NBdmVyYWdlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIHRvdGFsIG51bWJlciBvZiByZWNvcmRzIHNlbnQgaW4gYSBQdXRSZWNvcmRzIG9wZXJhdGlvbiBwZXIgS2luZXNpcyBkYXRhIHN0cmVhbSwgbWVhc3VyZWQgb3ZlciB0aGUgc3BlY2lmaWVkXG4gICAqIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBUaGUgbWV0cmljIGRlZmF1bHRzIHRvIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMsIGl0IGNhbiBiZSBjaGFuZ2VkIGJ5IHBhc3NpbmcgYHN0YXRpc3RpY2AgYW5kIGBwZXJpb2RgIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wZXJ0aWVzIG9mIHRoZSBtZXRyaWNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNQdXRSZWNvcmRzVG90YWxSZWNvcmRzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljRnJvbUNhbm5lZEZ1bmN0aW9uKEtpbmVzaXNNZXRyaWNzLnB1dFJlY29yZHNUb3RhbFJlY29yZHNBdmVyYWdlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBzdWNjZXNzZnVsIHJlY29yZHMgaW4gYSBQdXRSZWNvcmRzIG9wZXJhdGlvbiBwZXIgS2luZXNpcyBkYXRhIHN0cmVhbSwgbWVhc3VyZWQgb3ZlciB0aGUgc3BlY2lmaWVkXG4gICAqIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBUaGUgbWV0cmljIGRlZmF1bHRzIHRvIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMsIGl0IGNhbiBiZSBjaGFuZ2VkIGJ5IHBhc3NpbmcgYHN0YXRpc3RpY2AgYW5kIGBwZXJpb2RgIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wZXJ0aWVzIG9mIHRoZSBtZXRyaWNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNQdXRSZWNvcmRzU3VjY2Vzc2Z1bFJlY29yZHMocHJvcHM/OiBjbG91ZHdhdGNoLk1ldHJpY09wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5tZXRyaWNGcm9tQ2FubmVkRnVuY3Rpb24oS2luZXNpc01ldHJpY3MucHV0UmVjb3Jkc1N1Y2Nlc3NmdWxSZWNvcmRzQXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgcmVjb3JkcyByZWplY3RlZCBkdWUgdG8gaW50ZXJuYWwgZmFpbHVyZXMgaW4gYSBQdXRSZWNvcmRzIG9wZXJhdGlvbiBwZXIgS2luZXNpcyBkYXRhIHN0cmVhbSxcbiAgICogbWVhc3VyZWQgb3ZlciB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLiBPY2Nhc2lvbmFsIGludGVybmFsIGZhaWx1cmVzIGFyZSB0byBiZSBleHBlY3RlZCBhbmQgc2hvdWxkIGJlIHJldHJpZWQuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1B1dFJlY29yZHNGYWlsZWRSZWNvcmRzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljRnJvbUNhbm5lZEZ1bmN0aW9uKEtpbmVzaXNNZXRyaWNzLnB1dFJlY29yZHNGYWlsZWRSZWNvcmRzQXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgcmVjb3JkcyByZWplY3RlZCBkdWUgdG8gdGhyb3R0bGluZyBpbiBhIFB1dFJlY29yZHMgb3BlcmF0aW9uIHBlciBLaW5lc2lzIGRhdGEgc3RyZWFtLCBtZWFzdXJlZCBvdmVyXG4gICAqIHRoZSBzcGVjaWZpZWQgdGltZSBwZXJpb2QuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgcHVibGljIG1ldHJpY1B1dFJlY29yZHNUaHJvdHRsZWRSZWNvcmRzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljRnJvbUNhbm5lZEZ1bmN0aW9uKEtpbmVzaXNNZXRyaWNzLnB1dFJlY29yZHNUaHJvdHRsZWRSZWNvcmRzQXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgYnl0ZXMgc3VjY2Vzc2Z1bGx5IHB1dCB0byB0aGUgS2luZXNpcyBzdHJlYW0gb3ZlciB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLiBUaGlzIG1ldHJpYyBpbmNsdWRlc1xuICAgKiBieXRlcyBmcm9tIFB1dFJlY29yZCBhbmQgUHV0UmVjb3JkcyBvcGVyYXRpb25zLiBNaW5pbXVtLCBNYXhpbXVtLCBhbmQgQXZlcmFnZSBzdGF0aXN0aWNzIHJlcHJlc2VudCB0aGUgYnl0ZXMgaW4gYVxuICAgKiBzaW5nbGUgcHV0IG9wZXJhdGlvbiBmb3IgdGhlIHN0cmVhbSBpbiB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBUaGUgbWV0cmljIGRlZmF1bHRzIHRvIGF2ZXJhZ2Ugb3ZlciA1IG1pbnV0ZXMsIGl0IGNhbiBiZSBjaGFuZ2VkIGJ5IHBhc3NpbmcgYHN0YXRpc3RpY2AgYW5kIGBwZXJpb2RgIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIEBwYXJhbSBwcm9wcyBwcm9wZXJ0aWVzIG9mIHRoZSBtZXRyaWNcbiAgICovXG4gIHB1YmxpYyBtZXRyaWNJbmNvbWluZ0J5dGVzKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljRnJvbUNhbm5lZEZ1bmN0aW9uKEtpbmVzaXNNZXRyaWNzLmluY29taW5nQnl0ZXNBdmVyYWdlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiByZWNvcmRzIHN1Y2Nlc3NmdWxseSBwdXQgdG8gdGhlIEtpbmVzaXMgc3RyZWFtIG92ZXIgdGhlIHNwZWNpZmllZCB0aW1lIHBlcmlvZC4gVGhpcyBtZXRyaWMgaW5jbHVkZXNcbiAgICogcmVjb3JkIGNvdW50cyBmcm9tIFB1dFJlY29yZCBhbmQgUHV0UmVjb3JkcyBvcGVyYXRpb25zLiBNaW5pbXVtLCBNYXhpbXVtLCBhbmQgQXZlcmFnZSBzdGF0aXN0aWNzIHJlcHJlc2VudCB0aGVcbiAgICogcmVjb3JkcyBpbiBhIHNpbmdsZSBwdXQgb3BlcmF0aW9uIGZvciB0aGUgc3RyZWFtIGluIHRoZSBzcGVjaWZpZWQgdGltZSBwZXJpb2QuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllcy5cbiAgICpcbiAgICogQHBhcmFtIHByb3BzIHByb3BlcnRpZXMgb2YgdGhlIG1ldHJpY1xuICAgKi9cbiAgcHVibGljIG1ldHJpY0luY29taW5nUmVjb3Jkcyhwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY0Zyb21DYW5uZWRGdW5jdGlvbihLaW5lc2lzTWV0cmljcy5pbmNvbWluZ1JlY29yZHNBdmVyYWdlLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBHZXRSZWNvcmRzIGNhbGxzIHRocm90dGxlZCBmb3IgdGhlIHN0cmVhbSBvdmVyIHRoZSBzcGVjaWZpZWQgdGltZSBwZXJpb2QuIFRoZSBtb3N0IGNvbW1vbmx5IHVzZWRcbiAgICogc3RhdGlzdGljIGZvciB0aGlzIG1ldHJpYyBpcyBBdmVyYWdlLlxuICAgKlxuICAgKiBXaGVuIHRoZSBNaW5pbXVtIHN0YXRpc3RpYyBoYXMgYSB2YWx1ZSBvZiAxLCBhbGwgcmVjb3JkcyB3ZXJlIHRocm90dGxlZCBmb3IgdGhlIHN0cmVhbSBkdXJpbmcgdGhlIHNwZWNpZmllZCB0aW1lXG4gICAqIHBlcmlvZC5cbiAgICpcbiAgICogV2hlbiB0aGUgTWF4aW11bSBzdGF0aXN0aWMgaGFzIGEgdmFsdWUgb2YgMCAoemVybyksIG5vIHJlY29yZHMgd2VyZSB0aHJvdHRsZWQgZm9yIHRoZSBzdHJlYW0gZHVyaW5nIHRoZSBzcGVjaWZpZWRcbiAgICogdGltZSBwZXJpb2QuXG4gICAqXG4gICAqIFRoZSBtZXRyaWMgZGVmYXVsdHMgdG8gYXZlcmFnZSBvdmVyIDUgbWludXRlcywgaXQgY2FuIGJlIGNoYW5nZWQgYnkgcGFzc2luZyBgc3RhdGlzdGljYCBhbmQgYHBlcmlvZGAgcHJvcGVydGllc1xuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqXG4gICAqL1xuICBwdWJsaWMgbWV0cmljUmVhZFByb3Zpc2lvbmVkVGhyb3VnaHB1dEV4Y2VlZGVkKHByb3BzPzogY2xvdWR3YXRjaC5NZXRyaWNPcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMubWV0cmljRnJvbUNhbm5lZEZ1bmN0aW9uKEtpbmVzaXNNZXRyaWNzLnJlYWRQcm92aXNpb25lZFRocm91Z2hwdXRFeGNlZWRlZEF2ZXJhZ2UsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIHJlY29yZHMgcmVqZWN0ZWQgZHVlIHRvIHRocm90dGxpbmcgZm9yIHRoZSBzdHJlYW0gb3ZlciB0aGUgc3BlY2lmaWVkIHRpbWUgcGVyaW9kLiBUaGlzIG1ldHJpY1xuICAgKiBpbmNsdWRlcyB0aHJvdHRsaW5nIGZyb20gUHV0UmVjb3JkIGFuZCBQdXRSZWNvcmRzIG9wZXJhdGlvbnMuXG4gICAqXG4gICAqIFdoZW4gdGhlIE1pbmltdW0gc3RhdGlzdGljIGhhcyBhIG5vbi16ZXJvIHZhbHVlLCByZWNvcmRzIHdlcmUgYmVpbmcgdGhyb3R0bGVkIGZvciB0aGUgc3RyZWFtIGR1cmluZyB0aGUgc3BlY2lmaWVkXG4gICAqIHRpbWUgcGVyaW9kLlxuICAgKlxuICAgKiBXaGVuIHRoZSBNYXhpbXVtIHN0YXRpc3RpYyBoYXMgYSB2YWx1ZSBvZiAwICh6ZXJvKSwgbm8gcmVjb3JkcyB3ZXJlIGJlaW5nIHRocm90dGxlZCBmb3IgdGhlIHN0cmVhbSBkdXJpbmcgdGhlXG4gICAqIHNwZWNpZmllZCB0aW1lIHBlcmlvZC5cbiAgICpcbiAgICogVGhlIG1ldHJpYyBkZWZhdWx0cyB0byBhdmVyYWdlIG92ZXIgNSBtaW51dGVzLCBpdCBjYW4gYmUgY2hhbmdlZCBieSBwYXNzaW5nIGBzdGF0aXN0aWNgIGFuZCBgcGVyaW9kYCBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvcHMgcHJvcGVydGllcyBvZiB0aGUgbWV0cmljXG4gICAqL1xuICBwdWJsaWMgbWV0cmljV3JpdGVQcm92aXNpb25lZFRocm91Z2hwdXRFeGNlZWRlZChwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucykge1xuICAgIHJldHVybiB0aGlzLm1ldHJpY0Zyb21DYW5uZWRGdW5jdGlvbihLaW5lc2lzTWV0cmljcy53cml0ZVByb3Zpc2lvbmVkVGhyb3VnaHB1dEV4Y2VlZGVkQXZlcmFnZSwgcHJvcHMpO1xuICB9XG5cbiAgLy8gY3JlYXRlIG1ldHJpY3MgYmFzZWQgb24gZ2VuZXJhdGVkIEtpbmVzaXNNZXRyaWNzIHN0YXRpYyBtZXRob2RzXG4gIHByaXZhdGUgbWV0cmljRnJvbUNhbm5lZEZ1bmN0aW9uKFxuICAgIGNyZWF0ZUNhbm5lZFByb3BzOiAoZGltZW5zaW9uczogeyBTdHJlYW1OYW1lOiBzdHJpbmcgfSkgPT4gY2xvdWR3YXRjaC5NZXRyaWNQcm9wcyxcbiAgICBwcm9wcz86IGNsb3Vkd2F0Y2guTWV0cmljT3B0aW9ucyk6IGNsb3Vkd2F0Y2guTWV0cmljIHtcbiAgICByZXR1cm4gbmV3IGNsb3Vkd2F0Y2guTWV0cmljKHtcbiAgICAgIC4uLmNyZWF0ZUNhbm5lZFByb3BzKHsgU3RyZWFtTmFtZTogdGhpcy5zdHJlYW1OYW1lIH0pLFxuICAgICAgLi4ucHJvcHMsXG4gICAgfSkuYXR0YWNoVG8odGhpcyk7XG4gIH1cblxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGEgS2luZXNpcyBTdHJlYW1cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdHJlYW1Qcm9wcyB7XG4gIC8qKlxuICAgKiBFbmZvcmNlcyBhIHBhcnRpY3VsYXIgcGh5c2ljYWwgc3RyZWFtIG5hbWUuXG4gICAqIEBkZWZhdWx0IDxnZW5lcmF0ZWQ+XG4gICAqL1xuICByZWFkb25seSBzdHJlYW1OYW1lPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbnVtYmVyIG9mIGhvdXJzIGZvciB0aGUgZGF0YSByZWNvcmRzIHRoYXQgYXJlIHN0b3JlZCBpbiBzaGFyZHMgdG8gcmVtYWluIGFjY2Vzc2libGUuXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLmhvdXJzKDI0KVxuICAgKi9cbiAgcmVhZG9ubHkgcmV0ZW50aW9uUGVyaW9kPzogRHVyYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2Ygc2hhcmRzIGZvciB0aGUgc3RyZWFtLlxuICAgKlxuICAgKiBDYW4gb25seSBiZSBwcm92aWRlZCBpZiBzdHJlYW1Nb2RlIGlzIFByb3Zpc2lvbmVkLlxuICAgKlxuICAgKiBAZGVmYXVsdCAxXG4gICAqL1xuICByZWFkb25seSBzaGFyZENvdW50PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUga2luZCBvZiBzZXJ2ZXItc2lkZSBlbmNyeXB0aW9uIHRvIGFwcGx5IHRvIHRoaXMgc3RyZWFtLlxuICAgKlxuICAgKiBJZiB5b3UgY2hvb3NlIEtNUywgeW91IGNhbiBzcGVjaWZ5IGEgS01TIGtleSB2aWEgYGVuY3J5cHRpb25LZXlgLiBJZlxuICAgKiBlbmNyeXB0aW9uIGtleSBpcyBub3Qgc3BlY2lmaWVkLCBhIGtleSB3aWxsIGF1dG9tYXRpY2FsbHkgYmUgY3JlYXRlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBTdHJlYW1FbmNyeXB0aW9uLktNUyBpZiBlbmNyeXB0ZWQgU3RyZWFtcyBhcmUgc3VwcG9ydGVkIGluIHRoZSByZWdpb25cbiAgICogICBvciBTdHJlYW1FbmNyeXB0aW9uLlVORU5DUllQVEVEIG90aGVyd2lzZS5cbiAgICogICBTdHJlYW1FbmNyeXB0aW9uLktNUyBpZiBhbiBlbmNyeXB0aW9uIGtleSBpcyBzdXBwbGllZCB0aHJvdWdoIHRoZSBlbmNyeXB0aW9uS2V5IHByb3BlcnR5XG4gICAqL1xuICByZWFkb25seSBlbmNyeXB0aW9uPzogU3RyZWFtRW5jcnlwdGlvbjtcblxuICAvKipcbiAgICogRXh0ZXJuYWwgS01TIGtleSB0byB1c2UgZm9yIHN0cmVhbSBlbmNyeXB0aW9uLlxuICAgKlxuICAgKiBUaGUgJ2VuY3J5cHRpb24nIHByb3BlcnR5IG11c3QgYmUgc2V0IHRvIFwiS21zXCIuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gS2luZXNpcyBEYXRhIFN0cmVhbXMgbWFzdGVyIGtleSAoJy9hbGlhcy9hd3Mva2luZXNpcycpLlxuICAgKiAgIElmIGVuY3J5cHRpb24gaXMgc2V0IHRvIFN0cmVhbUVuY3J5cHRpb24uS01TIGFuZCB0aGlzIHByb3BlcnR5IGlzIHVuZGVmaW5lZCwgYSBuZXcgS01TIGtleVxuICAgKiAgIHdpbGwgYmUgY3JlYXRlZCBhbmQgYXNzb2NpYXRlZCB3aXRoIHRoaXMgc3RyZWFtLlxuICAgKi9cbiAgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuXG4gIC8qKlxuICAgKiBUaGUgY2FwYWNpdHkgbW9kZSBvZiB0aGlzIHN0cmVhbS5cbiAgICpcbiAgICogQGRlZmF1bHQgU3RyZWFtTW9kZS5QUk9WSVNJT05FRFxuICAgKi9cbiAgcmVhZG9ubHkgc3RyZWFtTW9kZT86IFN0cmVhbU1vZGU7XG59XG5cbi8qKlxuICogQSBLaW5lc2lzIHN0cmVhbS4gQ2FuIGJlIGVuY3J5cHRlZCB3aXRoIGEgS01TIGtleS5cbiAqL1xuZXhwb3J0IGNsYXNzIFN0cmVhbSBleHRlbmRzIFN0cmVhbUJhc2Uge1xuXG4gIC8qKlxuICAgKiBJbXBvcnQgYW4gZXhpc3RpbmcgS2luZXNpcyBTdHJlYW0gcHJvdmlkZWQgYW4gQVJOXG4gICAqXG4gICAqIEBwYXJhbSBzY29wZSBUaGUgcGFyZW50IGNyZWF0aW5nIGNvbnN0cnVjdCAodXN1YWxseSBgdGhpc2ApLlxuICAgKiBAcGFyYW0gaWQgVGhlIGNvbnN0cnVjdCdzIG5hbWVcbiAgICogQHBhcmFtIHN0cmVhbUFybiBTdHJlYW0gQVJOIChpLmUuIGFybjphd3M6a2luZXNpczo8cmVnaW9uPjo8YWNjb3VudC1pZD46c3RyZWFtL0ZvbylcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVN0cmVhbUFybihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBzdHJlYW1Bcm46IHN0cmluZyk6IElTdHJlYW0ge1xuICAgIHJldHVybiBTdHJlYW0uZnJvbVN0cmVhbUF0dHJpYnV0ZXMoc2NvcGUsIGlkLCB7IHN0cmVhbUFybiB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgU3RyZWFtIGNvbnN0cnVjdCB0aGF0IHJlcHJlc2VudHMgYW4gZXh0ZXJuYWwgc3RyZWFtLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgVGhlIHBhcmVudCBjcmVhdGluZyBjb25zdHJ1Y3QgKHVzdWFsbHkgYHRoaXNgKS5cbiAgICogQHBhcmFtIGlkIFRoZSBjb25zdHJ1Y3QncyBuYW1lLlxuICAgKiBAcGFyYW0gYXR0cnMgU3RyZWFtIGltcG9ydCBwcm9wZXJ0aWVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TdHJlYW1BdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBTdHJlYW1BdHRyaWJ1dGVzKTogSVN0cmVhbSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgU3RyZWFtQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgc3RyZWFtQXJuID0gYXR0cnMuc3RyZWFtQXJuO1xuICAgICAgcHVibGljIHJlYWRvbmx5IHN0cmVhbU5hbWUgPSBTdGFjay5vZihzY29wZSkuc3BsaXRBcm4oYXR0cnMuc3RyZWFtQXJuLCBBcm5Gb3JtYXQuU0xBU0hfUkVTT1VSQ0VfTkFNRSkucmVzb3VyY2VOYW1lITtcbiAgICAgIHB1YmxpYyByZWFkb25seSBlbmNyeXB0aW9uS2V5ID0gYXR0cnMuZW5jcnlwdGlvbktleTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEltcG9ydChzY29wZSwgaWQpO1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IHN0cmVhbUFybjogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgc3RyZWFtTmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IGttcy5JS2V5O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgc3RyZWFtOiBDZm5TdHJlYW07XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0cmVhbVByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHBoeXNpY2FsTmFtZTogcHJvcHMuc3RyZWFtTmFtZSxcbiAgICB9KTtcblxuICAgIGxldCBzaGFyZENvdW50ID0gcHJvcHMuc2hhcmRDb3VudDtcbiAgICBjb25zdCBzdHJlYW1Nb2RlID0gcHJvcHMuc3RyZWFtTW9kZSA/PyBTdHJlYW1Nb2RlLlBST1ZJU0lPTkVEO1xuXG4gICAgaWYgKHN0cmVhbU1vZGUgPT09IFN0cmVhbU1vZGUuT05fREVNQU5EICYmIHNoYXJkQ291bnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBzdHJlYW1Nb2RlIG11c3QgYmUgc2V0IHRvICR7U3RyZWFtTW9kZS5QUk9WSVNJT05FRH0gKGRlZmF1bHQpIHdoZW4gc3BlY2lmeWluZyBzaGFyZENvdW50YCk7XG4gICAgfVxuICAgIGlmIChzdHJlYW1Nb2RlID09PSBTdHJlYW1Nb2RlLlBST1ZJU0lPTkVEICYmIHNoYXJkQ291bnQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgc2hhcmRDb3VudCA9IDE7XG4gICAgfVxuXG4gICAgY29uc3QgcmV0ZW50aW9uUGVyaW9kSG91cnMgPSBwcm9wcy5yZXRlbnRpb25QZXJpb2Q/LnRvSG91cnMoKSA/PyAyNDtcbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChyZXRlbnRpb25QZXJpb2RIb3VycykpIHtcbiAgICAgIGlmIChyZXRlbnRpb25QZXJpb2RIb3VycyA8IDI0IHx8IHJldGVudGlvblBlcmlvZEhvdXJzID4gODc2MCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYHJldGVudGlvblBlcmlvZCBtdXN0IGJlIGJldHdlZW4gMjQgYW5kIDg3NjAgaG91cnMuIFJlY2VpdmVkICR7cmV0ZW50aW9uUGVyaW9kSG91cnN9YCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgeyBzdHJlYW1FbmNyeXB0aW9uLCBlbmNyeXB0aW9uS2V5IH0gPSB0aGlzLnBhcnNlRW5jcnlwdGlvbihwcm9wcyk7XG5cbiAgICB0aGlzLnN0cmVhbSA9IG5ldyBDZm5TdHJlYW0odGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgbmFtZTogdGhpcy5waHlzaWNhbE5hbWUsXG4gICAgICByZXRlbnRpb25QZXJpb2RIb3VycyxcbiAgICAgIHNoYXJkQ291bnQsXG4gICAgICBzdHJlYW1FbmNyeXB0aW9uLFxuICAgICAgc3RyZWFtTW9kZURldGFpbHM6IHN0cmVhbU1vZGUgPyB7IHN0cmVhbU1vZGUgfSA6IHVuZGVmaW5lZCxcbiAgICB9KTtcblxuICAgIHRoaXMuc3RyZWFtQXJuID0gdGhpcy5nZXRSZXNvdXJjZUFybkF0dHJpYnV0ZSh0aGlzLnN0cmVhbS5hdHRyQXJuLCB7XG4gICAgICBzZXJ2aWNlOiAna2luZXNpcycsXG4gICAgICByZXNvdXJjZTogJ3N0cmVhbScsXG4gICAgICByZXNvdXJjZU5hbWU6IHRoaXMucGh5c2ljYWxOYW1lLFxuICAgIH0pO1xuICAgIHRoaXMuc3RyZWFtTmFtZSA9IHRoaXMuZ2V0UmVzb3VyY2VOYW1lQXR0cmlidXRlKHRoaXMuc3RyZWFtLnJlZik7XG5cbiAgICB0aGlzLmVuY3J5cHRpb25LZXkgPSBlbmNyeXB0aW9uS2V5O1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB1cCBrZXkgcHJvcGVydGllcyBhbmQgcmV0dXJuIHRoZSBTdHJlYW0gZW5jcnlwdGlvbiBwcm9wZXJ0eSBmcm9tIHRoZVxuICAgKiB1c2VyJ3MgY29uZmlndXJhdGlvbi5cbiAgICovXG4gIHByaXZhdGUgcGFyc2VFbmNyeXB0aW9uKHByb3BzOiBTdHJlYW1Qcm9wcyk6IHtcbiAgICBzdHJlYW1FbmNyeXB0aW9uPzogQ2ZuU3RyZWFtLlN0cmVhbUVuY3J5cHRpb25Qcm9wZXJ0eSB8IElSZXNvbHZhYmxlXG4gICAgZW5jcnlwdGlvbktleT86IGttcy5JS2V5XG4gIH0ge1xuXG4gICAgLy8gaWYgZW5jcnlwdGlvbiBwcm9wZXJ0aWVzIGFyZSBub3Qgc2V0LCBkZWZhdWx0IHRvIEtNUyBpbiByZWdpb25zIHdoZXJlIEtNUyBpcyBhdmFpbGFibGVcbiAgICBpZiAoIXByb3BzLmVuY3J5cHRpb24gJiYgIXByb3BzLmVuY3J5cHRpb25LZXkpIHtcblxuICAgICAgY29uc3QgY29uZGl0aW9uTmFtZSA9ICdBd3NDZGtLaW5lc2lzRW5jcnlwdGVkU3RyZWFtc1Vuc3VwcG9ydGVkUmVnaW9ucyc7XG4gICAgICBjb25zdCBleGlzdGluZyA9IFN0YWNrLm9mKHRoaXMpLm5vZGUudHJ5RmluZENoaWxkKGNvbmRpdGlvbk5hbWUpO1xuXG4gICAgICAvLyBjcmVhdGUgYSBzaW5nbGUgY29uZGl0aW9uIGZvciB0aGUgU3RhY2tcbiAgICAgIGlmICghZXhpc3RpbmcpIHtcbiAgICAgICAgbmV3IENmbkNvbmRpdGlvbihTdGFjay5vZih0aGlzKSwgY29uZGl0aW9uTmFtZSwge1xuICAgICAgICAgIGV4cHJlc3Npb246IEZuLmNvbmRpdGlvbk9yKFxuICAgICAgICAgICAgRm4uY29uZGl0aW9uRXF1YWxzKEF3cy5SRUdJT04sICdjbi1ub3J0aC0xJyksXG4gICAgICAgICAgICBGbi5jb25kaXRpb25FcXVhbHMoQXdzLlJFR0lPTiwgJ2NuLW5vcnRod2VzdC0xJyksXG4gICAgICAgICAgKSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0cmVhbUVuY3J5cHRpb246IEZuLmNvbmRpdGlvbklmKGNvbmRpdGlvbk5hbWUsXG4gICAgICAgICAgQXdzLk5PX1ZBTFVFLFxuICAgICAgICAgIHsgRW5jcnlwdGlvblR5cGU6ICdLTVMnLCBLZXlJZDogJ2FsaWFzL2F3cy9raW5lc2lzJyB9KSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gZGVmYXVsdCBiYXNlZCBvbiB3aGV0aGVyIGVuY3J5cHRpb24ga2V5IGlzIHNwZWNpZmllZFxuICAgIGNvbnN0IGVuY3J5cHRpb25UeXBlID0gcHJvcHMuZW5jcnlwdGlvbiA/P1xuICAgICAgKHByb3BzLmVuY3J5cHRpb25LZXkgPyBTdHJlYW1FbmNyeXB0aW9uLktNUyA6IFN0cmVhbUVuY3J5cHRpb24uVU5FTkNSWVBURUQpO1xuXG4gICAgLy8gaWYgZW5jcnlwdGlvbiBrZXkgaXMgc2V0LCBlbmNyeXB0aW9uIG11c3QgYmUgc2V0IHRvIEtNUy5cbiAgICBpZiAoZW5jcnlwdGlvblR5cGUgIT09IFN0cmVhbUVuY3J5cHRpb24uS01TICYmIHByb3BzLmVuY3J5cHRpb25LZXkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgZW5jcnlwdGlvbktleSBpcyBzcGVjaWZpZWQsIHNvICdlbmNyeXB0aW9uJyBtdXN0IGJlIHNldCB0byBLTVMgKHZhbHVlOiAke2VuY3J5cHRpb25UeXBlfSlgKTtcbiAgICB9XG5cbiAgICBpZiAoZW5jcnlwdGlvblR5cGUgPT09IFN0cmVhbUVuY3J5cHRpb24uVU5FTkNSWVBURUQpIHtcbiAgICAgIHJldHVybiB7IH07XG4gICAgfVxuXG4gICAgaWYgKGVuY3J5cHRpb25UeXBlID09PSBTdHJlYW1FbmNyeXB0aW9uLk1BTkFHRUQpIHtcbiAgICAgIGNvbnN0IGVuY3J5cHRpb24gPSB7IGVuY3J5cHRpb25UeXBlOiAnS01TJywga2V5SWQ6ICdhbGlhcy9hd3Mva2luZXNpcycgfTtcbiAgICAgIHJldHVybiB7IHN0cmVhbUVuY3J5cHRpb246IGVuY3J5cHRpb24gfTtcbiAgICB9XG5cbiAgICBpZiAoZW5jcnlwdGlvblR5cGUgPT09IFN0cmVhbUVuY3J5cHRpb24uS01TKSB7XG4gICAgICBjb25zdCBlbmNyeXB0aW9uS2V5ID0gcHJvcHMuZW5jcnlwdGlvbktleSB8fCBuZXcga21zLktleSh0aGlzLCAnS2V5Jywge1xuICAgICAgICBkZXNjcmlwdGlvbjogYENyZWF0ZWQgYnkgJHt0aGlzLm5vZGUucGF0aH1gLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHN0cmVhbUVuY3J5cHRpb246IENmblN0cmVhbS5TdHJlYW1FbmNyeXB0aW9uUHJvcGVydHkgPSB7XG4gICAgICAgIGVuY3J5cHRpb25UeXBlOiAnS01TJyxcbiAgICAgICAga2V5SWQ6IGVuY3J5cHRpb25LZXkua2V5QXJuLFxuICAgICAgfTtcbiAgICAgIHJldHVybiB7IGVuY3J5cHRpb25LZXksIHN0cmVhbUVuY3J5cHRpb24gfTtcbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoYFVuZXhwZWN0ZWQgJ2VuY3J5cHRpb25UeXBlJzogJHtlbmNyeXB0aW9uVHlwZX1gKTtcbiAgfVxufVxuXG4vKipcbiAqIFdoYXQga2luZCBvZiBzZXJ2ZXItc2lkZSBlbmNyeXB0aW9uIHRvIGFwcGx5IHRvIHRoaXMgc3RyZWFtXG4gKi9cbmV4cG9ydCBlbnVtIFN0cmVhbUVuY3J5cHRpb24ge1xuICAvKipcbiAgICogUmVjb3JkcyBpbiB0aGUgc3RyZWFtIGFyZSBub3QgZW5jcnlwdGVkLlxuICAgKi9cbiAgVU5FTkNSWVBURUQgPSAnTk9ORScsXG5cbiAgLyoqXG4gICAqIFNlcnZlci1zaWRlIGVuY3J5cHRpb24gd2l0aCBhIEtNUyBrZXkgbWFuYWdlZCBieSB0aGUgdXNlci5cbiAgICogSWYgYGVuY3J5cHRpb25LZXlgIGlzIHNwZWNpZmllZCwgdGhpcyBrZXkgd2lsbCBiZSB1c2VkLCBvdGhlcndpc2UsIG9uZSB3aWxsIGJlIGRlZmluZWQuXG4gICAqL1xuICBLTVMgPSAnS01TJyxcblxuICAvKipcbiAgICogU2VydmVyLXNpZGUgZW5jcnlwdGlvbiB3aXRoIGEgbWFzdGVyIGtleSBtYW5hZ2VkIGJ5IEFtYXpvbiBLaW5lc2lzXG4gICAqL1xuICBNQU5BR0VEID0gJ01BTkFHRUQnXG59XG5cbi8qKlxuICogU3BlY2lmaWVzIHRoZSBjYXBhY2l0eSBtb2RlIHRvIGFwcGx5IHRvIHRoaXMgc3RyZWFtLlxuICovXG5leHBvcnQgZW51bSBTdHJlYW1Nb2RlIHtcbiAgLyoqXG4gICAqIFNwZWNpZnkgdGhlIHByb3Zpc2lvbmVkIGNhcGFjaXR5IG1vZGUuIFRoZSBzdHJlYW0gd2lsbCBoYXZlIGBzaGFyZENvdW50YCBzaGFyZHMgdW5sZXNzXG4gICAqIG1vZGlmaWVkIGFuZCB3aWxsIGJlIGJpbGxlZCBhY2NvcmRpbmcgdG8gdGhlIHByb3Zpc2lvbmVkIGNhcGFjaXR5LlxuICAgKi9cbiAgUFJPVklTSU9ORUQgPSAnUFJPVklTSU9ORUQnLFxuXG4gIC8qKlxuICAgKiBTcGVjaWZ5IHRoZSBvbi1kZW1hbmQgY2FwYWNpdHkgbW9kZS4gVGhlIHN0cmVhbSB3aWxsIGF1dG9zY2FsZSBhbmQgYmUgYmlsbGVkIGFjY29yZGluZyB0byB0aGVcbiAgICogdm9sdW1lIG9mIGRhdGEgaW5nZXN0ZWQgYW5kIHJldHJpZXZlZC5cbiAgICovXG4gIE9OX0RFTUFORCA9ICdPTl9ERU1BTkQnXG59XG4iXX0=