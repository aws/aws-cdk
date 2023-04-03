"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Volume = exports.EbsDeviceVolumeType = exports.BlockDeviceVolume = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const aws_iam_1 = require("@aws-cdk/aws-iam");
const aws_kms_1 = require("@aws-cdk/aws-kms");
const core_1 = require("@aws-cdk/core");
const helpers_internal_1 = require("@aws-cdk/core/lib/helpers-internal");
const ec2_generated_1 = require("./ec2.generated");
/**
 * Describes a block device mapping for an EC2 instance or Auto Scaling group.
 */
class BlockDeviceVolume {
    /**
     * Creates a new Elastic Block Storage device
     *
     * @param volumeSize The volume size, in Gibibytes (GiB)
     * @param options additional device options
     */
    static ebs(volumeSize, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_EbsDeviceOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.ebs);
            }
            throw error;
        }
        return new this({ ...options, volumeSize });
    }
    /**
     * Creates a new Elastic Block Storage device from an existing snapshot
     *
     * @param snapshotId The snapshot ID of the volume to use
     * @param options additional device options
     */
    static ebsFromSnapshot(snapshotId, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_EbsDeviceSnapshotOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.ebsFromSnapshot);
            }
            throw error;
        }
        return new this({ ...options, snapshotId });
    }
    /**
     * Creates a virtual, ephemeral device.
     * The name will be in the form ephemeral{volumeIndex}.
     *
     * @param volumeIndex the volume index. Must be equal or greater than 0
     */
    static ephemeral(volumeIndex) {
        if (volumeIndex < 0) {
            throw new Error(`volumeIndex must be a number starting from 0, got "${volumeIndex}"`);
        }
        return new this(undefined, `ephemeral${volumeIndex}`);
    }
    /**
     * @param ebsDevice EBS device info
     * @param virtualName Virtual device name
     */
    constructor(ebsDevice, virtualName) {
        this.ebsDevice = ebsDevice;
        this.virtualName = virtualName;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_EbsDeviceProps(ebsDevice);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BlockDeviceVolume);
            }
            throw error;
        }
    }
}
_a = JSII_RTTI_SYMBOL_1;
BlockDeviceVolume[_a] = { fqn: "@aws-cdk/aws-ec2.BlockDeviceVolume", version: "0.0.0" };
exports.BlockDeviceVolume = BlockDeviceVolume;
/**
 * Supported EBS volume types for blockDevices
 */
var EbsDeviceVolumeType;
(function (EbsDeviceVolumeType) {
    /**
     * Magnetic
     */
    EbsDeviceVolumeType["STANDARD"] = "standard";
    /**
     *  Provisioned IOPS SSD - IO1
     */
    EbsDeviceVolumeType["IO1"] = "io1";
    /**
     *  Provisioned IOPS SSD - IO2
     */
    EbsDeviceVolumeType["IO2"] = "io2";
    /**
     * General Purpose SSD - GP2
     */
    EbsDeviceVolumeType["GP2"] = "gp2";
    /**
     * General Purpose SSD - GP3
     */
    EbsDeviceVolumeType["GP3"] = "gp3";
    /**
     * Throughput Optimized HDD
     */
    EbsDeviceVolumeType["ST1"] = "st1";
    /**
     * Cold HDD
     */
    EbsDeviceVolumeType["SC1"] = "sc1";
    /**
     * General purpose SSD volume (GP2) that balances price and performance for a wide variety of workloads.
     */
    EbsDeviceVolumeType["GENERAL_PURPOSE_SSD"] = "gp2";
    /**
     * General purpose SSD volume (GP3) that balances price and performance for a wide variety of workloads.
     */
    EbsDeviceVolumeType["GENERAL_PURPOSE_SSD_GP3"] = "gp3";
    /**
     * Highest-performance SSD volume (IO1) for mission-critical low-latency or high-throughput workloads.
     */
    EbsDeviceVolumeType["PROVISIONED_IOPS_SSD"] = "io1";
    /**
     * Highest-performance SSD volume (IO2) for mission-critical low-latency or high-throughput workloads.
     */
    EbsDeviceVolumeType["PROVISIONED_IOPS_SSD_IO2"] = "io2";
    /**
     * Low-cost HDD volume designed for frequently accessed, throughput-intensive workloads.
     */
    EbsDeviceVolumeType["THROUGHPUT_OPTIMIZED_HDD"] = "st1";
    /**
     * Lowest cost HDD volume designed for less frequently accessed workloads.
     */
    EbsDeviceVolumeType["COLD_HDD"] = "sc1";
    /**
     * Magnetic volumes are backed by magnetic drives and are suited for workloads where data is accessed infrequently, and scenarios where low-cost
     * storage for small volume sizes is important.
     */
    EbsDeviceVolumeType["MAGNETIC"] = "standard";
})(EbsDeviceVolumeType = exports.EbsDeviceVolumeType || (exports.EbsDeviceVolumeType = {}));
/**
 * Common behavior of Volumes. Users should not use this class directly, and instead use ``Volume``.
 */
class VolumeBase extends core_1.Resource {
    grantAttachVolume(grantee, instances) {
        const result = aws_iam_1.Grant.addToPrincipal({
            grantee,
            actions: ['ec2:AttachVolume'],
            resourceArns: this.collectGrantResourceArns(instances),
        });
        if (this.encryptionKey) {
            // When attaching a volume, the EC2 Service will need to grant to itself permission
            // to be able to decrypt the encryption key. We restrict the CreateGrant for principle
            // of least privilege, in accordance with best practices.
            // See: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#ebs-encryption-permissions
            const kmsGrant = this.encryptionKey.grant(grantee, 'kms:CreateGrant');
            kmsGrant.principalStatement.addConditions({
                Bool: { 'kms:GrantIsForAWSResource': true },
                StringEquals: {
                    'kms:ViaService': `ec2.${core_1.Stack.of(this).region}.amazonaws.com`,
                    'kms:GrantConstraintType': 'EncryptionContextSubset',
                },
            });
        }
        return result;
    }
    grantAttachVolumeByResourceTag(grantee, constructs, tagKeySuffix) {
        const tagValue = this.calculateResourceTagValue([this, ...constructs]);
        const tagKey = `VolumeGrantAttach-${tagKeySuffix ?? tagValue.slice(0, 10).toUpperCase()}`;
        const grantCondition = {};
        grantCondition[`ec2:ResourceTag/${tagKey}`] = tagValue;
        const result = this.grantAttachVolume(grantee);
        result.principalStatement.addCondition('ForAnyValue:StringEquals', grantCondition);
        // The ResourceTag condition requires that all resources involved in the operation have
        // the given tag, so we tag this and all constructs given.
        core_1.Tags.of(this).add(tagKey, tagValue);
        constructs.forEach(construct => core_1.Tags.of(construct).add(tagKey, tagValue));
        return result;
    }
    grantDetachVolume(grantee, instances) {
        const result = aws_iam_1.Grant.addToPrincipal({
            grantee,
            actions: ['ec2:DetachVolume'],
            resourceArns: this.collectGrantResourceArns(instances),
        });
        // Note: No encryption key permissions are required to detach an encrypted volume.
        return result;
    }
    grantDetachVolumeByResourceTag(grantee, constructs, tagKeySuffix) {
        const tagValue = this.calculateResourceTagValue([this, ...constructs]);
        const tagKey = `VolumeGrantDetach-${tagKeySuffix ?? tagValue.slice(0, 10).toUpperCase()}`;
        const grantCondition = {};
        grantCondition[`ec2:ResourceTag/${tagKey}`] = tagValue;
        const result = this.grantDetachVolume(grantee);
        result.principalStatement.addCondition('ForAnyValue:StringEquals', grantCondition);
        // The ResourceTag condition requires that all resources involved in the operation have
        // the given tag, so we tag this and all constructs given.
        core_1.Tags.of(this).add(tagKey, tagValue);
        constructs.forEach(construct => core_1.Tags.of(construct).add(tagKey, tagValue));
        return result;
    }
    collectGrantResourceArns(instances) {
        const stack = core_1.Stack.of(this);
        const resourceArns = [
            `arn:${stack.partition}:ec2:${stack.region}:${stack.account}:volume/${this.volumeId}`,
        ];
        const instanceArnPrefix = `arn:${stack.partition}:ec2:${stack.region}:${stack.account}:instance`;
        if (instances) {
            instances.forEach(instance => resourceArns.push(`${instanceArnPrefix}/${instance?.instanceId}`));
        }
        else {
            resourceArns.push(`${instanceArnPrefix}/*`);
        }
        return resourceArns;
    }
    calculateResourceTagValue(constructs) {
        return (0, helpers_internal_1.md5hash)(constructs.map(c => core_1.Names.uniqueId(c)).join(''));
    }
}
/**
 * Creates a new EBS Volume in AWS EC2.
 */
class Volume extends VolumeBase {
    /**
     * Import an existing EBS Volume into the Stack.
     *
     * @param scope the scope of the import.
     * @param id    the ID of the imported Volume in the construct tree.
     * @param attrs the attributes of the imported Volume
     */
    static fromVolumeAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_VolumeAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromVolumeAttributes);
            }
            throw error;
        }
        class Import extends VolumeBase {
            constructor() {
                super(...arguments);
                this.volumeId = attrs.volumeId;
                this.availabilityZone = attrs.availabilityZone;
                this.encryptionKey = attrs.encryptionKey;
            }
        }
        // Check that the provided volumeId looks like it could be valid.
        if (!core_1.Token.isUnresolved(attrs.volumeId) && !/^vol-[0-9a-fA-F]+$/.test(attrs.volumeId)) {
            throw new Error('`volumeId` does not match expected pattern. Expected `vol-<hexadecmial value>` (ex: `vol-05abe246af`) or a Token');
        }
        return new Import(scope, id);
    }
    constructor(scope, id, props) {
        super(scope, id, {
            physicalName: props.volumeName,
        });
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_VolumeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Volume);
            }
            throw error;
        }
        this.validateProps(props);
        const resource = new ec2_generated_1.CfnVolume(this, 'Resource', {
            availabilityZone: props.availabilityZone,
            autoEnableIo: props.autoEnableIo,
            encrypted: props.encrypted,
            kmsKeyId: props.encryptionKey?.keyArn,
            iops: props.iops,
            multiAttachEnabled: props.enableMultiAttach ?? false,
            size: props.size?.toGibibytes({ rounding: core_1.SizeRoundingBehavior.FAIL }),
            snapshotId: props.snapshotId,
            throughput: props.throughput,
            volumeType: props.volumeType ?? EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
        });
        resource.applyRemovalPolicy(props.removalPolicy);
        if (props.volumeName)
            core_1.Tags.of(resource).add('Name', props.volumeName);
        this.volumeId = resource.ref;
        this.availabilityZone = props.availabilityZone;
        this.encryptionKey = props.encryptionKey;
        if (this.encryptionKey) {
            // Per: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html#ebs-encryption-requirements
            const principal = new aws_kms_1.ViaServicePrincipal(`ec2.${core_1.Stack.of(this).region}.amazonaws.com`, new aws_iam_1.AccountRootPrincipal()).withConditions({
                StringEquals: {
                    'kms:CallerAccount': core_1.Stack.of(this).account,
                },
            });
            const grant = this.encryptionKey.grant(principal, 
            // Describe & Generate are required to be able to create the CMK-encrypted Volume.
            'kms:DescribeKey', 'kms:GenerateDataKeyWithoutPlainText');
            if (props.snapshotId) {
                // ReEncrypt is required for when re-encrypting from an encrypted snapshot.
                grant.principalStatement?.addActions('kms:ReEncrypt*');
            }
        }
    }
    validateProps(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_VolumeProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.validateProps);
            }
            throw error;
        }
        if (!(props.size || props.snapshotId)) {
            throw new Error('Must provide at least one of `size` or `snapshotId`');
        }
        if (props.snapshotId && !core_1.Token.isUnresolved(props.snapshotId) && !/^snap-[0-9a-fA-F]+$/.test(props.snapshotId)) {
            throw new Error('`snapshotId` does match expected pattern. Expected `snap-<hexadecmial value>` (ex: `snap-05abe246af`) or Token');
        }
        if (props.encryptionKey && !props.encrypted) {
            throw new Error('`encrypted` must be true when providing an `encryptionKey`.');
        }
        if (props.volumeType &&
            [
                EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
                EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
            ].includes(props.volumeType) &&
            !props.iops) {
            throw new Error('`iops` must be specified if the `volumeType` is `PROVISIONED_IOPS_SSD` or `PROVISIONED_IOPS_SSD_IO2`.');
        }
        if (props.iops) {
            const volumeType = props.volumeType ?? EbsDeviceVolumeType.GENERAL_PURPOSE_SSD;
            if (![
                EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
                EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
                EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3,
            ].includes(volumeType)) {
                throw new Error('`iops` may only be specified if the `volumeType` is `PROVISIONED_IOPS_SSD`, `PROVISIONED_IOPS_SSD_IO2` or `GENERAL_PURPOSE_SSD_GP3`.');
            }
            // Enforce minimum & maximum IOPS:
            // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-ebs-volume.html
            const iopsRanges = {};
            iopsRanges[EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3] = { Min: 3000, Max: 16000 };
            iopsRanges[EbsDeviceVolumeType.PROVISIONED_IOPS_SSD] = { Min: 100, Max: 64000 };
            iopsRanges[EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2] = { Min: 100, Max: 64000 };
            const { Min, Max } = iopsRanges[volumeType];
            if (props.iops < Min || props.iops > Max) {
                throw new Error(`\`${volumeType}\` volumes iops must be between ${Min} and ${Max}.`);
            }
            // Enforce maximum ratio of IOPS/GiB:
            // https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-volume-types.html
            const maximumRatios = {};
            maximumRatios[EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3] = 500;
            maximumRatios[EbsDeviceVolumeType.PROVISIONED_IOPS_SSD] = 50;
            maximumRatios[EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2] = 500;
            const maximumRatio = maximumRatios[volumeType];
            if (props.size && (props.iops > maximumRatio * props.size.toGibibytes({ rounding: core_1.SizeRoundingBehavior.FAIL }))) {
                throw new Error(`\`${volumeType}\` volumes iops has a maximum ratio of ${maximumRatio} IOPS/GiB.`);
            }
            const maximumThroughputRatios = {};
            maximumThroughputRatios[EbsDeviceVolumeType.GP3] = 0.25;
            const maximumThroughputRatio = maximumThroughputRatios[volumeType];
            if (props.throughput && props.iops) {
                const iopsRatio = (props.throughput / props.iops);
                if (iopsRatio > maximumThroughputRatio) {
                    throw new Error(`Throughput (MiBps) to iops ratio of ${iopsRatio} is too high; maximum is ${maximumThroughputRatio} MiBps per iops`);
                }
            }
        }
        if (props.enableMultiAttach) {
            const volumeType = props.volumeType ?? EbsDeviceVolumeType.GENERAL_PURPOSE_SSD;
            if (![
                EbsDeviceVolumeType.PROVISIONED_IOPS_SSD,
                EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2,
            ].includes(volumeType)) {
                throw new Error('multi-attach is supported exclusively on `PROVISIONED_IOPS_SSD` and `PROVISIONED_IOPS_SSD_IO2` volumes.');
            }
        }
        if (props.size) {
            const size = props.size.toGibibytes({ rounding: core_1.SizeRoundingBehavior.FAIL });
            // Enforce minimum & maximum volume size:
            // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-ebs-volume.html
            const sizeRanges = {};
            sizeRanges[EbsDeviceVolumeType.GENERAL_PURPOSE_SSD] = { Min: 1, Max: 16384 };
            sizeRanges[EbsDeviceVolumeType.GENERAL_PURPOSE_SSD_GP3] = { Min: 1, Max: 16384 };
            sizeRanges[EbsDeviceVolumeType.PROVISIONED_IOPS_SSD] = { Min: 4, Max: 16384 };
            sizeRanges[EbsDeviceVolumeType.PROVISIONED_IOPS_SSD_IO2] = { Min: 4, Max: 16384 };
            sizeRanges[EbsDeviceVolumeType.THROUGHPUT_OPTIMIZED_HDD] = { Min: 125, Max: 16384 };
            sizeRanges[EbsDeviceVolumeType.COLD_HDD] = { Min: 125, Max: 16384 };
            sizeRanges[EbsDeviceVolumeType.MAGNETIC] = { Min: 1, Max: 1024 };
            const volumeType = props.volumeType ?? EbsDeviceVolumeType.GENERAL_PURPOSE_SSD;
            const { Min, Max } = sizeRanges[volumeType];
            if (size < Min || size > Max) {
                throw new Error(`\`${volumeType}\` volumes must be between ${Min} GiB and ${Max} GiB in size.`);
            }
        }
        if (props.throughput) {
            const throughputRange = { Min: 125, Max: 1000 };
            const { Min, Max } = throughputRange;
            if (props.volumeType != EbsDeviceVolumeType.GP3) {
                throw new Error('throughput property requires volumeType: EbsDeviceVolumeType.GP3');
            }
            if (props.throughput < Min || props.throughput > Max) {
                throw new Error(`throughput property takes a minimum of ${Min} and a maximum of ${Max}`);
            }
        }
    }
}
_b = JSII_RTTI_SYMBOL_1;
Volume[_b] = { fqn: "@aws-cdk/aws-ec2.Volume", version: "0.0.0" };
exports.Volume = Volume;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm9sdW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidm9sdW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLDhDQUEyRTtBQUMzRSw4Q0FBNkQ7QUFDN0Qsd0NBQTBIO0FBQzFILHlFQUE2RDtBQUU3RCxtREFBNEM7QUF1SDVDOztHQUVHO0FBQ0gsTUFBYSxpQkFBaUI7SUFDNUI7Ozs7O09BS0c7SUFDSSxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQWtCLEVBQUUsVUFBNEIsRUFBRTs7Ozs7Ozs7OztRQUNsRSxPQUFPLElBQUksSUFBSSxDQUFDLEVBQUUsR0FBRyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztLQUM3QztJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLGVBQWUsQ0FBQyxVQUFrQixFQUFFLFVBQW9DLEVBQUU7Ozs7Ozs7Ozs7UUFDdEYsT0FBTyxJQUFJLElBQUksQ0FBQyxFQUFFLEdBQUcsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDN0M7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsV0FBbUI7UUFDekMsSUFBSSxXQUFXLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsc0RBQXNELFdBQVcsR0FBRyxDQUFDLENBQUM7U0FDdkY7UUFFRCxPQUFPLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRSxZQUFZLFdBQVcsRUFBRSxDQUFDLENBQUM7S0FDdkQ7SUFFRDs7O09BR0c7SUFDSCxZQUFzQyxTQUEwQixFQUFrQixXQUFvQjtRQUFoRSxjQUFTLEdBQVQsU0FBUyxDQUFpQjtRQUFrQixnQkFBVyxHQUFYLFdBQVcsQ0FBUzs7Ozs7OytDQXZDM0YsaUJBQWlCOzs7O0tBd0MzQjs7OztBQXhDVSw4Q0FBaUI7QUEyQzlCOztHQUVHO0FBQ0gsSUFBWSxtQkF1RVg7QUF2RUQsV0FBWSxtQkFBbUI7SUFDN0I7O09BRUc7SUFDSCw0Q0FBcUIsQ0FBQTtJ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QWUsQ0FBQyxDQUFDO2FBQ2pHO1NBQ0Y7UUFFRCxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDcEIsTUFBTSxlQUFlLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUNoRCxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLGVBQWUsQ0FBQztZQUNyQyxJQUFJLEtBQUssQ0FBQyxVQUFVLElBQUksbUJBQW1CLENBQUMsR0FBRyxFQUFFO2dCQUMvQyxNQUFNLElBQUksS0FBSyxDQUNiLGtFQUFrRSxDQUNuRSxDQUFDO2FBQ0g7WUFDRCxJQUFJLEtBQUssQ0FBQyxVQUFVLEdBQUcsR0FBRyxJQUFJLEtBQUssQ0FBQyxVQUFVLEdBQUcsR0FBRyxFQUFFO2dCQUNwRCxNQUFNLElBQUksS0FBSyxDQUNiLDBDQUEwQyxHQUFHLHFCQUFxQixHQUFHLEVBQUUsQ0FDeEUsQ0FBQzthQUNIO1NBQ0Y7S0FDRjs7OztBQTlMVSx3QkFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjY291bnRSb290UHJpbmNpcGFsLCBHcmFudCwgSUdyYW50YWJsZSB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgSUtleSwgVmlhU2VydmljZVByaW5jaXBhbCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1rbXMnO1xuaW1wb3J0IHsgSVJlc291cmNlLCBSZXNvdXJjZSwgU2l6ZSwgU2l6ZVJvdW5kaW5nQmVoYXZpb3IsIFN0YWNrLCBUb2tlbiwgVGFncywgTmFtZXMsIFJlbW92YWxQb2xpY3kgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IG1kNWhhc2ggfSBmcm9tICdAYXdzLWNkay9jb3JlL2xpYi9oZWxwZXJzLWludGVybmFsJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgQ2ZuVm9sdW1lIH0gZnJvbSAnLi9lYzIuZ2VuZXJhdGVkJztcbmltcG9ydCB7IElJbnN0YW5jZSB9IGZyb20gJy4vaW5zdGFuY2UnO1xuXG4vKipcbiAqIEJsb2NrIGRldmljZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJsb2NrRGV2aWNlIHtcbiAgLyoqXG4gICAqIFRoZSBkZXZpY2UgbmFtZSBleHBvc2VkIHRvIHRoZSBFQzIgaW5zdGFuY2VcbiAgICpcbiAgICogRm9yIGV4YW1wbGUsIGEgdmFsdWUgbGlrZSBgL2Rldi9zZGhgLCBgeHZkaGAuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL2RldmljZV9uYW1pbmcuaHRtbFxuICAgKi9cbiAgcmVhZG9ubHkgZGV2aWNlTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBEZWZpbmVzIHRoZSBibG9jayBkZXZpY2Ugdm9sdW1lLCB0byBiZSBlaXRoZXIgYW4gQW1hem9uIEVCUyB2b2x1bWUgb3IgYW4gZXBoZW1lcmFsIGluc3RhbmNlIHN0b3JlIHZvbHVtZVxuICAgKlxuICAgKiBGb3IgZXhhbXBsZSwgYSB2YWx1ZSBsaWtlIGBCbG9ja0RldmljZVZvbHVtZS5lYnMoMTUpYCwgYEJsb2NrRGV2aWNlVm9sdW1lLmVwaGVtZXJhbCgwKWAuXG4gICAqL1xuICByZWFkb25seSB2b2x1bWU6IEJsb2NrRGV2aWNlVm9sdW1lO1xuXG4gIC8qKlxuICAgKiBJZiBmYWxzZSwgdGhlIGRldmljZSBtYXBwaW5nIHdpbGwgYmUgc3VwcHJlc3NlZC5cbiAgICogSWYgc2V0IHRvIGZhbHNlIGZvciB0aGUgcm9vdCBkZXZpY2UsIHRoZSBpbnN0YW5jZSBtaWdodCBmYWlsIHRoZSBBbWF6b24gRUMyIGhlYWx0aCBjaGVjay5cbiAgICogQW1hem9uIEVDMiBBdXRvIFNjYWxpbmcgbGF1bmNoZXMgYSByZXBsYWNlbWVudCBpbnN0YW5jZSBpZiB0aGUgaW5zdGFuY2UgZmFpbHMgdGhlIGhlYWx0aCBjaGVjay5cbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZSAtIGRldmljZSBtYXBwaW5nIGlzIGxlZnQgdW50b3VjaGVkXG4gICAqL1xuICByZWFkb25seSBtYXBwaW5nRW5hYmxlZD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQmFzZSBibG9jayBkZXZpY2Ugb3B0aW9ucyBmb3IgYW4gRUJTIHZvbHVtZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVic0RldmljZU9wdGlvbnNCYXNlIHtcbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRvIGRlbGV0ZSB0aGUgdm9sdW1lIHdoZW4gdGhlIGluc3RhbmNlIGlzIHRlcm1pbmF0ZWQuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gdHJ1ZSBmb3IgQW1hem9uIEVDMiBBdXRvIFNjYWxpbmcsIGZhbHNlIG90aGVyd2lzZSAoZS5nLiBFQlMpXG4gICAqL1xuICByZWFkb25seSBkZWxldGVPblRlcm1pbmF0aW9uPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIG51bWJlciBvZiBJL08gb3BlcmF0aW9ucyBwZXIgc2Vjb25kIChJT1BTKSB0byBwcm92aXNpb24gZm9yIHRoZSB2b2x1bWUuXG4gICAqXG4gICAqIE11c3Qgb25seSBiZSBzZXQgZm9yIGB2b2x1bWVUeXBlYDogYEVic0RldmljZVZvbHVtZVR5cGUuSU8xYFxuICAgKlxuICAgKiBUaGUgbWF4aW11bSByYXRpbyBvZiBJT1BTIHRvIHZvbHVtZSBzaXplIChpbiBHaUIpIGlzIDUwOjEsIHNvIGZvciA1LDAwMCBwcm92aXNpb25lZCBJT1BTLFxuICAgKiB5b3UgbmVlZCBhdCBsZWFzdCAxMDAgR2lCIHN0b3JhZ2Ugb24gdGhlIHZvbHVtZS5cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvRUJTVm9sdW1lVHlwZXMuaHRtbFxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmUsIHJlcXVpcmVkIGZvciBgRWJzRGV2aWNlVm9sdW1lVHlwZS5JTzFgXG4gICAqL1xuICByZWFkb25seSBpb3BzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBUaGUgRUJTIHZvbHVtZSB0eXBlXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL0VCU1ZvbHVtZVR5cGVzLmh0bWxcbiAgICpcbiAgICogQGRlZmF1bHQgYEVic0RldmljZVZvbHVtZVR5cGUuR1AyYFxuICAgKi9cbiAgcmVhZG9ubHkgdm9sdW1lVHlwZT86IEVic0RldmljZVZvbHVtZVR5cGU7XG59XG5cbi8qKlxuICogQmxvY2sgZGV2aWNlIG9wdGlvbnMgZm9yIGFuIEVCUyB2b2x1bWVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFYnNEZXZpY2VPcHRpb25zIGV4dGVuZHMgRWJzRGV2aWNlT3B0aW9uc0Jhc2Uge1xuICAvKipcbiAgICogU3BlY2lmaWVzIHdoZXRoZXIgdGhlIEVCUyB2b2x1bWUgaXMgZW5jcnlwdGVkLlxuICAgKiBFbmNyeXB0ZWQgRUJTIHZvbHVtZXMgY2FuIG9ubHkgYmUgYXR0YWNoZWQgdG8gaW5zdGFuY2VzIHRoYXQgc3VwcG9ydCBBbWF6b24gRUJTIGVuY3J5cHRpb25cbiAgICpcbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvRUJTRW5jcnlwdGlvbi5odG1sI0VCU0VuY3J5cHRpb25fc3VwcG9ydGVkX2luc3RhbmNlc1xuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5jcnlwdGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIEFSTiBvZiB0aGUgQVdTIEtleSBNYW5hZ2VtZW50IFNlcnZpY2UgKEFXUyBLTVMpIENNSyB1c2VkIGZvciBlbmNyeXB0aW9uLlxuICAgKlxuICAgKiBZb3UgaGF2ZSB0byBlbnN1cmUgdGhhdCB0aGUgS01TIENNSyBoYXMgdGhlIGNvcnJlY3QgcGVybWlzc2lvbnMgdG8gYmUgdXNlZCBieSB0aGUgc2VydmljZSBsYXVuY2hpbmcgdGhlIGVjMiBpbnN0YW5jZXMuXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL0VCU0VuY3J5cHRpb24uaHRtbCNlYnMtZW5jcnlwdGlvbi1yZXF1aXJlbWVudHNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBJZiBlbmNyeXB0ZWQgaXMgdHJ1ZSwgdGhlIGRlZmF1bHQgYXdzL2VicyBLTVMga2V5IHdpbGwgYmUgdXNlZC5cbiAgICovXG4gIHJlYWRvbmx5IGttc0tleT86IElLZXk7XG59XG5cbi8qKlxuICogQmxvY2sgZGV2aWNlIG9wdGlvbnMgZm9yIGFuIEVCUyB2b2x1bWUgY3JlYXRlZCBmcm9tIGEgc25hcHNob3RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFYnNEZXZpY2VTbmFwc2hvdE9wdGlvbnMgZXh0ZW5kcyBFYnNEZXZpY2VPcHRpb25zQmFzZSB7XG4gIC8qKlxuICAgKiBUaGUgdm9sdW1lIHNpemUsIGluIEdpYmlieXRlcyAoR2lCKVxuICAgKlxuICAgKiBJZiB5b3Ugc3BlY2lmeSB2b2x1bWVTaXplLCBpdCBtdXN0IGJlIGVxdWFsIG9yIGdyZWF0ZXIgdGhhbiB0aGUgc2l6ZSBvZiB0aGUgc25hcHNob3QuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVGhlIHNuYXBzaG90IHNpemVcbiAgICovXG4gIHJlYWRvbmx5IHZvbHVtZVNpemU/OiBudW1iZXI7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBvZiBhbiBFQlMgYmxvY2sgZGV2aWNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWJzRGV2aWNlUHJvcHMgZXh0ZW5kcyBFYnNEZXZpY2VTbmFwc2hvdE9wdGlvbnMsIEVic0RldmljZU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHNuYXBzaG90IElEIG9mIHRoZSB2b2x1bWUgdG8gdXNlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gTm8gc25hcHNob3Qgd2lsbCBiZSB1c2VkXG4gICAqL1xuICByZWFkb25seSBzbmFwc2hvdElkPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIERlc2NyaWJlcyBhIGJsb2NrIGRldmljZSBtYXBwaW5nIGZvciBhbiBFQzIgaW5zdGFuY2Ugb3IgQXV0byBTY2FsaW5nIGdyb3VwLlxuICovXG5leHBvcnQgY2xhc3MgQmxvY2tEZXZpY2VWb2x1bWUge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBFbGFzdGljIEJsb2NrIFN0b3JhZ2UgZGV2aWNlXG4gICAqXG4gICAqIEBwYXJhbSB2b2x1bWVTaXplIFRoZSB2b2x1bWUgc2l6ZSwgaW4gR2liaWJ5dGVzIChHaUIpXG4gICAqIEBwYXJhbSBvcHRpb25zIGFkZGl0aW9uYWwgZGV2aWNlIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZWJzKHZvbHVtZVNpemU6IG51bWJlciwgb3B0aW9uczogRWJzRGV2aWNlT3B0aW9ucyA9IHt9KTogQmxvY2tEZXZpY2VWb2x1bWUge1xuICAgIHJldHVybiBuZXcgdGhpcyh7IC4uLm9wdGlvbnMsIHZvbHVtZVNpemUgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBFbGFzdGljIEJsb2NrIFN0b3JhZ2UgZGV2aWNlIGZyb20gYW4gZXhpc3Rpbmcgc25hcHNob3RcbiAgICpcbiAgICogQHBhcmFtIHNuYXBzaG90SWQgVGhlIHNuYXBzaG90IElEIG9mIHRoZSB2b2x1bWUgdG8gdXNlXG4gICAqIEBwYXJhbSBvcHRpb25zIGFkZGl0aW9uYWwgZGV2aWNlIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZWJzRnJvbVNuYXBzaG90KHNuYXBzaG90SWQ6IHN0cmluZywgb3B0aW9uczogRWJzRGV2aWNlU25hcHNob3RPcHRpb25zID0ge30pOiBCbG9ja0RldmljZVZvbHVtZSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKHsgLi4ub3B0aW9ucywgc25hcHNob3RJZCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgdmlydHVhbCwgZXBoZW1lcmFsIGRldmljZS5cbiAgICogVGhlIG5hbWUgd2lsbCBiZSBpbiB0aGUgZm9ybSBlcGhlbWVyYWx7dm9sdW1lSW5kZXh9LlxuICAgKlxuICAgKiBAcGFyYW0gdm9sdW1lSW5kZXggdGhlIHZvbHVtZSBpbmRleC4gTXVzdCBiZSBlcXVhbCBvciBncmVhdGVyIHRoYW4gMFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBlcGhlbWVyYWwodm9sdW1lSW5kZXg6IG51bWJlcikge1xuICAgIGlmICh2b2x1bWVJbmRleCA8IDApIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdm9sdW1lSW5kZXggbXVzdCBiZSBhIG51bWJlciBzdGFydGluZyBmcm9tIDAsIGdvdCBcIiR7dm9sdW1lSW5kZXh9XCJgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IHRoaXModW5kZWZpbmVkLCBgZXBoZW1lcmFsJHt2b2x1bWVJbmRleH1gKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gZWJzRGV2aWNlIEVCUyBkZXZpY2UgaW5mb1xuICAgKiBAcGFyYW0gdmlydHVhbE5hbWUgVmlydHVhbCBkZXZpY2UgbmFtZVxuICAgKi9cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBlYnNEZXZpY2U/OiBFYnNEZXZpY2VQcm9wcywgcHVibGljIHJlYWRvbmx5IHZpcnR1YWxOYW1lPzogc3RyaW5nKSB7XG4gIH1cbn1cblxuLyoqXG4gKiBTdXBwb3J0ZWQgRUJTIHZvbHVtZSB0eXBlcyBmb3IgYmxvY2tEZXZpY2VzXG4gKi9cbmV4cG9ydCBlbnVtIEVic0RldmljZVZvbHVtZVR5cGUge1xuICAvKipcbiAgICogTWFnbmV0aWNcbiAgICovXG4gIFNUQU5EQVJEID0gJ3N0YW5kYXJkJyxcblxuICAvKipcbiAgICogIFByb3Zpc2lvbmVkIElPUFMgU1NEIC0gSU8xXG4gICAqL1xuICBJTzEgPSAnaW8xJyxcblxuICAvKipcbiAgICogIFByb3Zpc2lvbmVkIElPUFMgU1NEIC0gSU8yXG4gICAqL1xuICBJTzIgPSAnaW8yJyxcblxuICAvKipcbiAgICogR2VuZXJhbCBQdXJwb3NlIFNTRCAtIEdQMlxuICAgKi9cbiAgR1AyID0gJ2dwMicsXG5cbiAgLyoqXG4gICAqIEdlbmVyYWwgUHVycG9zZSBTU0QgLSBHUDNcbiAgICovXG4gIEdQMyA9ICdncDMnLFxuXG4gIC8qKlxuICAgKiBUaHJvdWdocHV0IE9wdGltaXplZCBIRERcbiAgICovXG4gIFNUMSA9ICdzdDEnLFxuXG4gIC8qKlxuICAgKiBDb2xkIEhERFxuICAgKi9cbiAgU0MxID0gJ3NjMScsXG5cbiAgLyoqXG4gICAqIEdlbmVyYWwgcHVycG9zZSBTU0Qgdm9sdW1lIChHUDIpIHRoYXQgYmFsYW5jZXMgcHJpY2UgYW5kIHBlcmZvcm1hbmNlIGZvciBhIHdpZGUgdmFyaWV0eSBvZiB3b3JrbG9hZHMuXG4gICAqL1xuICBHRU5FUkFMX1BVUlBPU0VfU1NEID0gR1AyLFxuXG4gIC8qKlxuICAgKiBHZW5lcmFsIHB1cnBvc2UgU1NEIHZvbHVtZSAoR1AzKSB0aGF0IGJhbGFuY2VzIHByaWNlIGFuZCBwZXJmb3JtYW5jZSBmb3IgYSB3aWRlIHZhcmlldHkgb2Ygd29ya2xvYWRzLlxuICAgKi9cbiAgR0VORVJBTF9QVVJQT1NFX1NTRF9HUDMgPSBHUDMsXG5cbiAgLyoqXG4gICAqIEhpZ2hlc3QtcGVyZm9ybWFuY2UgU1NEIHZvbHVtZSAoSU8xKSBmb3IgbWlzc2lvbi1jcml0aWNhbCBsb3ctbGF0ZW5jeSBvciBoaWdoLXRocm91Z2hwdXQgd29ya2xvYWRzLlxuICAgKi9cbiAgUFJPVklTSU9ORURfSU9QU19TU0QgPSBJTzEsXG5cbiAgLyoqXG4gICAqIEhpZ2hlc3QtcGVyZm9ybWFuY2UgU1NEIHZvbHVtZSAoSU8yKSBmb3IgbWlzc2lvbi1jcml0aWNhbCBsb3ctbGF0ZW5jeSBvciBoaWdoLXRocm91Z2hwdXQgd29ya2xvYWRzLlxuICAgKi9cbiAgUFJPVklTSU9ORURfSU9QU19TU0RfSU8yID0gSU8yLFxuXG4gIC8qKlxuICAgKiBMb3ctY29zdCBIREQgdm9sdW1lIGRlc2lnbmVkIGZvciBmcmVxdWVudGx5IGFjY2Vzc2VkLCB0aHJvdWdocHV0LWludGVuc2l2ZSB3b3JrbG9hZHMuXG4gICAqL1xuICBUSFJPVUdIUFVUX09QVElNSVpFRF9IREQgPSBTVDEsXG5cbiAgLyoqXG4gICAqIExvd2VzdCBjb3N0IEhERCB2b2x1bWUgZGVzaWduZWQgZm9yIGxlc3MgZnJlcXVlbnRseSBhY2Nlc3NlZCB3b3JrbG9hZHMuXG4gICAqL1xuICBDT0xEX0hERCA9IFNDMSxcblxuICAvKipcbiAgICogTWFnbmV0aWMgdm9sdW1lcyBhcmUgYmFja2VkIGJ5IG1hZ25ldGljIGRyaXZlcyBhbmQgYXJlIHN1aXRlZCBmb3Igd29ya2xvYWRzIHdoZXJlIGRhdGEgaXMgYWNjZXNzZWQgaW5mcmVxdWVudGx5LCBhbmQgc2NlbmFyaW9zIHdoZXJlIGxvdy1jb3N0XG4gICAqIHN0b3JhZ2UgZm9yIHNtYWxsIHZvbHVtZSBzaXplcyBpcyBpbXBvcnRhbnQuXG4gICAqL1xuICBNQUdORVRJQyA9IFNUQU5EQVJELFxufVxuXG4vKipcbiAqIEFuIEVCUyBWb2x1bWUgaW4gQVdTIEVDMi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJVm9sdW1lIGV4dGVuZHMgSVJlc291cmNlIHtcbiAgLyoqXG4gICAqIFRoZSBFQlMgVm9sdW1lJ3MgSURcbiAgICpcbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgdm9sdW1lSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGF2YWlsYWJpbGl0eSB6b25lIHRoYXQgdGhlIEVCUyBWb2x1bWUgaXMgY29udGFpbmVkIHdpdGhpbiAoZXg6IHVzLXdlc3QtMmEpXG4gICAqL1xuICByZWFkb25seSBhdmFpbGFiaWxpdHlab25lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXN0b21lci1tYW5hZ2VkIGVuY3J5cHRpb24ga2V5IHRoYXQgaXMgdXNlZCB0byBlbmNyeXB0IHRoZSBWb2x1bWUuXG4gICAqXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBJS2V5O1xuXG4gIC8qKlxuICAgKiBHcmFudHMgcGVybWlzc2lvbiB0byBhdHRhY2ggdGhpcyBWb2x1bWUgdG8gYW4gaW5zdGFuY2UuXG4gICAqIENBVVRJT046IEdyYW50aW5nIGFuIGluc3RhbmNlIHBlcm1pc3Npb24gdG8gYXR0YWNoIHRvIGl0c2VsZiB1c2luZyB0aGlzIG1ldGhvZCB3aWxsIGxlYWQgdG9cbiAgICogYW4gdW5yZXNvbHZhYmxlIGNpcmN1bGFyIHJlZmVyZW5jZSBiZXR3ZWVuIHRoZSBpbnN0YW5jZSByb2xlIGFuZCB0aGUgaW5zdGFuY2UuXG4gICAqIFVzZSBgSVZvbHVtZS5ncmFudEF0dGFjaFZvbHVtZVRvU2VsZmAgdG8gZ3JhbnQgYW4gaW5zdGFuY2UgcGVybWlzc2lvbiB0byBhdHRhY2ggdGhpc1xuICAgKiB2b2x1bWUgdG8gaXRzZWxmLlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhbnRlZSAgdGhlIHByaW5jaXBhbCBiZWluZyBncmFudGVkIHBlcm1pc3Npb24uXG4gICAqIEBwYXJhbSBpbnN0YW5jZXMgdGhlIGluc3RhbmNlcyB0byB3aGljaCBwZXJtaXNzaW9uIGlzIGJlaW5nIGdyYW50ZWQgdG8gYXR0YWNoIHRoaXNcbiAgICogICAgICAgICAgICAgICAgIHZvbHVtZSB0by4gSWYgbm90IHNwZWNpZmllZCwgdGhlbiBwZXJtaXNzaW9uIGlzIGdyYW50ZWQgdG8gYXR0YWNoXG4gICAqICAgICAgICAgICAgICAgICB0byBhbGwgaW5zdGFuY2VzIGluIHRoaXMgYWNjb3VudC5cbiAgICovXG4gIGdyYW50QXR0YWNoVm9sdW1lKGdyYW50ZWU6IElHcmFudGFibGUsIGluc3RhbmNlcz86IElJbnN0YW5jZVtdKTogR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50cyBwZXJtaXNzaW9uIHRvIGF0dGFjaCB0aGUgVm9sdW1lIGJ5IGEgUmVzb3VyY2VUYWcgY29uZGl0aW9uLiBJZiB5b3UgYXJlIGxvb2tpbmcgdG9cbiAgICogZ3JhbnQgYW4gSW5zdGFuY2UsIEF1dG9TY2FsaW5nR3JvdXAsIEVDMi1GbGVldCwgU3BvdEZsZWV0LCBFQ1MgaG9zdCwgZXRjIHRoZSBhYmlsaXR5IHRvIGF0dGFjaFxuICAgKiB0aGlzIHZvbHVtZSB0byAqKml0c2VsZioqIHRoZW4gdGhpcyBpcyB0aGUgbWV0aG9kIHlvdSB3YW50IHRvIHVzZS5cbiAgICpcbiAgICogVGhpcyBpcyBpbXBsZW1lbnRlZCBieSBhZGRpbmcgYSBUYWcgd2l0aCBrZXkgYFZvbHVtZUdyYW50QXR0YWNoLTxzdWZmaXg+YCB0byB0aGUgZ2l2ZW5cbiAgICogY29uc3RydWN0cyBhbmQgdGhpcyBWb2x1bWUsIGFuZCB0aGVuIGNvbmRpdGlvbmluZyB0aGUgR3JhbnQgc3VjaCB0aGF0IHRoZSBncmFudGVlIGlzIG9ubHlcbiAgICogZ2l2ZW4gdGhlIGFiaWxpdHkgdG8gQXR0YWNoVm9sdW1lIGlmIGJvdGggdGhlIFZvbHVtZSBhbmQgdGhlIGRlc3RpbmF0aW9uIEluc3RhbmNlIGhhdmUgdGhhdFxuICAgKiB0YWcgYXBwbGllZCB0byB0aGVtLlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhbnRlZSAgICB0aGUgcHJpbmNpcGFsIGJlaW5nIGdyYW50ZWQgcGVybWlzc2lvbi5cbiAgICogQHBhcmFtIGNvbnN0cnVjdHMgVGhlIGxpc3Qgb2YgY29uc3RydWN0cyB0aGF0IHdpbGwgaGF2ZSB0aGUgZ2VuZXJhdGVkIHJlc291cmNlIHRhZyBhcHBsaWVkIHRvIHRoZW0uXG4gICAqIEBwYXJhbSB0YWdLZXlTdWZmaXggQSBzdWZmaXggdG8gdXNlIG9uIHRoZSBnZW5lcmF0ZWQgVGFnIGtleSBpbiBwbGFjZSBvZiB0aGUgZ2VuZXJhdGVkIGhhc2ggdmFsdWUuXG4gICAqICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdHMgdG8gYSBoYXNoIGNhbGN1bGF0ZWQgZnJvbSB0aGlzIHZvbHVtZSBhbmQgbGlzdCBvZiBjb25zdHJ1Y3RzLiAoREVQUkVDQVRFRClcbiAgICovXG4gIGdyYW50QXR0YWNoVm9sdW1lQnlSZXNvdXJjZVRhZyhncmFudGVlOiBJR3JhbnRhYmxlLCBjb25zdHJ1Y3RzOiBDb25zdHJ1Y3RbXSwgdGFnS2V5U3VmZml4Pzogc3RyaW5nKTogR3JhbnQ7XG5cbiAgLyoqXG4gICAqIEdyYW50cyBwZXJtaXNzaW9uIHRvIGRldGFjaCB0aGlzIFZvbHVtZSBmcm9tIGFuIGluc3RhbmNlXG4gICAqIENBVVRJT046IEdyYW50aW5nIGFuIGluc3RhbmNlIHBlcm1pc3Npb24gdG8gZGV0YWNoIGZyb20gaXRzZWxmIHVzaW5nIHRoaXMgbWV0aG9kIHdpbGwgbGVhZCB0b1xuICAgKiBhbiB1bnJlc29sdmFibGUgY2lyY3VsYXIgcmVmZXJlbmNlIGJldHdlZW4gdGhlIGluc3RhbmNlIHJvbGUgYW5kIHRoZSBpbnN0YW5jZS5cbiAgICogVXNlIGBJVm9sdW1lLmdyYW50RGV0YWNoVm9sdW1lRnJvbVNlbGZgIHRvIGdyYW50IGFuIGluc3RhbmNlIHBlcm1pc3Npb24gdG8gZGV0YWNoIHRoaXNcbiAgICogdm9sdW1lIGZyb20gaXRzZWxmLlxuICAgKlxuICAgKiBAcGFyYW0gZ3JhbnRlZSAgdGhlIHByaW5jaXBhbCBiZWluZyBncmFudGVkIHBlcm1pc3Npb24uXG4gICAqIEBwYXJhbSBpbnN0YW5jZXMgdGhlIGluc3RhbmNlcyB0byB3aGljaCBwZXJtaXNzaW9uIGlzIGJlaW5nIGdyYW50ZWQgdG8gZGV0YWNoIHRoaXNcbiAgICogICAgICAgICAgICAgICAgIHZvbHVtZSBmcm9tLiBJZiBub3Qgc3BlY2lmaWVkLCB0aGVuIHBlcm1pc3Npb24gaXMgZ3JhbnRlZCB0byBkZXRhY2hcbiAgICogICAgICAgICAgICAgICAgIGZyb20gYWxsIGluc3RhbmNlcyBpbiB0aGlzIGFjY291bnQuXG4gICAqL1xuICBncmFudERldGFjaFZvbHVtZShncmFudGVlOiBJR3JhbnRhYmxlLCBpbnN0YW5jZXM/OiBJSW5zdGFuY2VbXSk6IEdyYW50O1xuXG4gIC8qKlxuICAgKiBHcmFudHMgcGVybWlzc2lvbiB0byBkZXRhY2ggdGhlIFZvbHVtZSBieSBhIFJlc291cmNlVGFnIGNvbmRpdGlvbi5cbiAgICpcbiAgICogVGhpcyBpcyBpbXBsZW1lbnRlZCB2aWEgdGhlIHNhbWUgbWVjaGFuaXNtIGFzIGBJVm9sdW1lLmdyYW50QXR0YWNoVm9sdW1lQnlSZXNvdXJjZVRhZ2AsXG4gICAqIGFuZCBpcyBzdWJqZWN0IHRvIHRoZSBzYW1lIGNvbmRpdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSBncmFudGVlICAgIHRoZSBwcmluY2lwYWwgYmVpbmcgZ3JhbnRlZCBwZXJtaXNzaW9uLlxuICAgKiBAcGFyYW0gY29uc3RydWN0cyBUaGUgbGlzdCBvZiBjb25zdHJ1Y3RzIHRoYXQgd2lsbCBoYXZlIHRoZSBnZW5lcmF0ZWQgcmVzb3VyY2UgdGFnIGFwcGxpZWQgdG8gdGhlbS5cbiAgICogQHBhcmFtIHRhZ0tleVN1ZmZpeCBBIHN1ZmZpeCB0byB1c2Ugb24gdGhlIGdlbmVyYXRlZCBUYWcga2V5IGluIHBsYWNlIG9mIHRoZSBnZW5lcmF0ZWQgaGFzaCB2YWx1ZS5cbiAgICogICAgICAgICAgICAgICAgICAgICBEZWZhdWx0cyB0byBhIGhhc2ggY2FsY3VsYXRlZCBmcm9tIHRoaXMgdm9sdW1lIGFuZCBsaXN0IG9mIGNvbnN0cnVjdHMuIChERVBSRUNBVEVEKVxuICAgKi9cbiAgZ3JhbnREZXRhY2hWb2x1bWVCeVJlc291cmNlVGFnKGdyYW50ZWU6IElHcmFudGFibGUsIGNvbnN0cnVjdHM6IENvbnN0cnVjdFtdLCB0YWdLZXlTdWZmaXg/OiBzdHJpbmcpOiBHcmFudDtcbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIG9mIGFuIEVCUyBWb2x1bWVcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBWb2x1bWVQcm9wcyB7XG4gIC8qKlxuICAgKiBUaGUgdmFsdWUgb2YgdGhlIHBoeXNpY2FsTmFtZSBwcm9wZXJ0eSBvZiB0aGlzIHJlc291cmNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBUaGUgcGh5c2ljYWwgbmFtZSB3aWxsIGJlIGFsbG9jYXRlZCBieSBDbG91ZEZvcm1hdGlvbiBhdCBkZXBsb3ltZW50IHRpbWVcbiAgICovXG4gIHJlYWRvbmx5IHZvbHVtZU5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBBdmFpbGFiaWxpdHkgWm9uZSBpbiB3aGljaCB0byBjcmVhdGUgdGhlIHZvbHVtZS5cbiAgICovXG4gIHJlYWRvbmx5IGF2YWlsYWJpbGl0eVpvbmU6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHNpemUgb2YgdGhlIHZvbHVtZSwgaW4gR2lCcy4gWW91IG11c3Qgc3BlY2lmeSBlaXRoZXIgYSBzbmFwc2hvdCBJRCBvciBhIHZvbHVtZSBzaXplLlxuICAgKiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvYXdzLXByb3BlcnRpZXMtZWMyLWVicy12b2x1bWUuaHRtbFxuICAgKiBmb3IgZGV0YWlscyBvbiB0aGUgYWxsb3dhYmxlIHNpemUgZm9yIGVhY2ggdHlwZSBvZiB2b2x1bWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IElmIHlvdSdyZSBjcmVhdGluZyB0aGUgdm9sdW1lIGZyb20gYSBzbmFwc2hvdCBhbmQgZG9uJ3Qgc3BlY2lmeSBhIHZvbHVtZSBzaXplLCB0aGUgZGVmYXVsdCBpcyB0aGUgc25hcHNob3Qgc2l6ZS5cbiAgICovXG4gIHJlYWRvbmx5IHNpemU/OiBTaXplO1xuXG4gIC8qKlxuICAgKiBUaGUgc25hcHNob3QgZnJvbSB3aGljaCB0byBjcmVhdGUgdGhlIHZvbHVtZS4gWW91IG11c3Qgc3BlY2lmeSBlaXRoZXIgYSBzbmFwc2hvdCBJRCBvciBhIHZvbHVtZSBzaXplLlxuICAgKlxuICAgKiBAZGVmYXVsdCBUaGUgRUJTIHZvbHVtZSBpcyBub3QgY3JlYXRlZCBmcm9tIGEgc25hcHNob3QuXG4gICAqL1xuICByZWFkb25seSBzbmFwc2hvdElkPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciBBbWF6b24gRUJTIE11bHRpLUF0dGFjaCBpcyBlbmFibGVkLlxuICAgKiBTZWUgW0NvbnNpZGVyYXRpb25zIGFuZCBsaW1pdGF0aW9uc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL2Vicy12b2x1bWVzLW11bHRpLmh0bWwjY29uc2lkZXJhdGlvbnMpXG4gICAqIGZvciB0aGUgY29uc3RyYWludHMgb2YgbXVsdGktYXR0YWNoLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5hYmxlTXVsdGlBdHRhY2g/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBTcGVjaWZpZXMgd2hldGhlciB0aGUgdm9sdW1lIHNob3VsZCBiZSBlbmNyeXB0ZWQuIFRoZSBlZmZlY3Qgb2Ygc2V0dGluZyB0aGUgZW5jcnlwdGlvbiBzdGF0ZSB0byB0cnVlIGRlcGVuZHMgb24gdGhlIHZvbHVtZSBvcmlnaW5cbiAgICogKG5ldyBvciBmcm9tIGEgc25hcHNob3QpLCBzdGFydGluZyBlbmNyeXB0aW9uIHN0YXRlLCBvd25lcnNoaXAsIGFuZCB3aGV0aGVyIGVuY3J5cHRpb24gYnkgZGVmYXVsdCBpcyBlbmFibGVkLiBGb3IgbW9yZSBpbmZvcm1hdGlvbixcbiAgICogc2VlIFtFbmNyeXB0aW9uIGJ5IERlZmF1bHRdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS9FQlNFbmNyeXB0aW9uLmh0bWwjZW5jcnlwdGlvbi1ieS1kZWZhdWx0KVxuICAgKiBpbiB0aGUgQW1hem9uIEVsYXN0aWMgQ29tcHV0ZSBDbG91ZCBVc2VyIEd1aWRlLlxuICAgKlxuICAgKiBFbmNyeXB0ZWQgQW1hem9uIEVCUyB2b2x1bWVzIG11c3QgYmUgYXR0YWNoZWQgdG8gaW5zdGFuY2VzIHRoYXQgc3VwcG9ydCBBbWF6b24gRUJTIGVuY3J5cHRpb24uIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWVcbiAgICogW1N1cHBvcnRlZCBJbnN0YW5jZSBUeXBlc10oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL0VCU0VuY3J5cHRpb24uaHRtbCNFQlNFbmNyeXB0aW9uX3N1cHBvcnRlZF9pbnN0YW5jZXMpLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgZW5jcnlwdGVkPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGN1c3RvbWVyLW1hbmFnZWQgZW5jcnlwdGlvbiBrZXkgdGhhdCBpcyB1c2VkIHRvIGVuY3J5cHQgdGhlIFZvbHVtZS4gVGhlIGVuY3J5cHRlZCBwcm9wZXJ0eSBtdXN0XG4gICAqIGJlIHRydWUgaWYgdGhpcyBpcyBwcm92aWRlZC5cbiAgICpcbiAgICogTm90ZTogSWYgdXNpbmcgYW4gYGF3cy1rbXMuSUtleWAgY3JlYXRlZCBmcm9tIGEgYGF3cy1rbXMuS2V5LmZyb21LZXlBcm4oKWAgaGVyZSxcbiAgICogdGhlbiB0aGUgS01TIGtleSAqKm11c3QqKiBoYXZlIHRoZSBmb2xsb3dpbmcgaW4gaXRzIEtleSBwb2xpY3k7IG90aGVyd2lzZSwgdGhlIFZvbHVtZVxuICAgKiB3aWxsIGZhaWwgdG8gY3JlYXRlLlxuICAgKlxuICAgKiAgICAge1xuICAgKiAgICAgICBcIkVmZmVjdFwiOiBcIkFsbG93XCIsXG4gICAqICAgICAgIFwiUHJpbmNpcGFsXCI6IHsgXCJBV1NcIjogXCI8YXJuIGZvciB5b3VyIGFjY291bnQtdXNlcj4gZXg6IGFybjphd3M6aWFtOjowMDAwMDAwMDAwMDpyb290XCIgfSxcbiAgICogICAgICAgXCJSZXNvdXJjZVwiOiBcIipcIixcbiAgICogICAgICAgXCJBY3Rpb25cIjogW1xuICAgKiAgICAgICAgIFwia21zOkRlc2NyaWJlS2V5XCIsXG4gICAqICAgICAgICAgXCJrbXM6R2VuZXJhdGVEYXRhS2V5V2l0aG91dFBsYWluVGV4dFwiLFxuICAgKiAgICAgICBdLFxuICAgKiAgICAgICBcIkNvbmRpdGlvblwiOiB7XG4gICAqICAgICAgICAgXCJTdHJpbmdFcXVhbHNcIjoge1xuICAgKiAgICAgICAgICAgXCJrbXM6VmlhU2VydmljZVwiOiBcImVjMi48UmVnaW9uPi5hbWF6b25hd3MuY29tXCIsIChlZzogZWMyLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tKVxuICAgKiAgICAgICAgICAgXCJrbXM6Q2FsbGVyQWNjb3VudFwiOiBcIjAwMDAwMDAwMDBcIiAoeW91ciBhY2NvdW50IElEKVxuICAgKiAgICAgICAgIH1cbiAgICogICAgICAgfVxuICAgKiAgICAgfVxuICAgKlxuICAgKiBAZGVmYXVsdCBUaGUgZGVmYXVsdCBLTVMga2V5IGZvciB0aGUgYWNjb3VudCwgcmVnaW9uLCBhbmQgRUMyIHNlcnZpY2UgaXMgdXNlZC5cbiAgICovXG4gIHJlYWRvbmx5IGVuY3J5cHRpb25LZXk/OiBJS2V5O1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdm9sdW1lIGlzIGF1dG8tZW5hYmxlZCBmb3IgSS9PIG9wZXJhdGlvbnMuIEJ5IGRlZmF1bHQsIEFtYXpvbiBFQlMgZGlzYWJsZXMgSS9PIHRvIHRoZSB2b2x1bWUgZnJvbSBhdHRhY2hlZCBFQzJcbiAgICogaW5zdGFuY2VzIHdoZW4gaXQgZGV0ZXJtaW5lcyB0aGF0IGEgdm9sdW1lJ3MgZGF0YSBpcyBwb3RlbnRpYWxseSBpbmNvbnNpc3RlbnQuIElmIHRoZSBjb25zaXN0ZW5jeSBvZiB0aGUgdm9sdW1lIGlzIG5vdCBhIGNvbmNlcm4sIGFuZFxuICAgKiB5b3UgcHJlZmVyIHRoYXQgdGhlIHZvbHVtZSBiZSBtYWRlIGF2YWlsYWJsZSBpbW1lZGlhdGVseSBpZiBpdCdzIGltcGFpcmVkLCB5b3UgY2FuIGNvbmZpZ3VyZSB0aGUgdm9sdW1lIHRvIGF1dG9tYXRpY2FsbHkgZW5hYmxlIEkvTy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGF1dG9FbmFibGVJbz86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoZSB0eXBlIG9mIHRoZSB2b2x1bWU7IHdoYXQgdHlwZSBvZiBzdG9yYWdlIHRvIHVzZSB0byBmb3JtIHRoZSBFQlMgVm9sdW1lLlxuICAgKlxuICAgKiBAZGVmYXVsdCBgRWJzRGV2aWNlVm9sdW1lVHlwZS5HRU5FUkFMX1BVUlBPU0VfU1NEYFxuICAgKi9cbiAgcmVhZG9ubHkgdm9sdW1lVHlwZT86IEVic0RldmljZVZvbHVtZVR5cGU7XG5cbiAgLyoqXG4gICAqIFRoZSBudW1iZXIgb2YgSS9PIG9wZXJhdGlvbnMgcGVyIHNlY29uZCAoSU9QUykgdG8gcHJvdmlzaW9uIGZvciB0aGUgdm9sdW1lLiBUaGUgbWF4aW11bSByYXRpbyBpcyA1MCBJT1BTL0dpQiBmb3IgUFJPVklTSU9ORURfSU9QU19TU0QsXG4gICAqIGFuZCA1MDAgSU9QUy9HaUIgZm9yIGJvdGggUFJPVklTSU9ORURfSU9QU19TU0RfSU8yIGFuZCBHRU5FUkFMX1BVUlBPU0VfU1NEX0dQMy5cbiAgICogU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjMi1lYnMtdm9sdW1lLmh0bWxcbiAgICogZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gICAqXG4gICAqIFRoaXMgcGFyYW1ldGVyIGlzIHZhbGlkIG9ubHkgZm9yIFBST1ZJU0lPTkVEX0lPUFNfU1NELCBQUk9WSVNJT05FRF9JT1BTX1NTRF9JTzIgYW5kIEdFTkVSQUxfUFVSUE9TRV9TU0RfR1AzIHZvbHVtZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vbmUgLS0gUmVxdWlyZWQgZm9yIGlvMSBhbmQgaW8yIHZvbHVtZXMuIFRoZSBkZWZhdWx0IGZvciBncDMgdm9sdW1lcyBpcyAzLDAwMCBJT1BTIGlmIG9taXR0ZWQuXG4gICAqL1xuICByZWFkb25seSBpb3BzPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBQb2xpY3kgdG8gYXBwbHkgd2hlbiB0aGUgdm9sdW1lIGlzIHJlbW92ZWQgZnJvbSB0aGUgc3RhY2tcbiAgICpcbiAgICogQGRlZmF1bHQgUmVtb3ZhbFBvbGljeS5SRVRBSU5cbiAgICovXG4gIHJlYWRvbmx5IHJlbW92YWxQb2xpY3k/OiBSZW1vdmFsUG9saWN5O1xuXG4gIC8qKlxuICAgKiBUaGUgdGhyb3VnaHB1dCB0aGF0IHRoZSB2b2x1bWUgc3VwcG9ydHMsIGluIE1pQi9zXG4gICAqIFRha2VzIGEgbWluaW11bSBvZiAxMjUgYW5kIG1heGltdW0gb2YgMTAwMC5cbiAgICogQHNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS9hd3MtcHJvcGVydGllcy1lYzItZWJzLXZvbHVtZS5odG1sI2Nmbi1lYzItZWJzLXZvbHVtZS10aHJvdWdocHV0XG4gICAqIEBkZWZhdWx0IC0gMTI1IE1pQi9zLiBPbmx5IHZhbGlkIG9uIGdwMyB2b2x1bWVzLlxuICAgKi9cbiAgcmVhZG9ubHkgdGhyb3VnaHB1dD86IG51bWJlcjtcbn1cblxuLyoqXG4gKiBBdHRyaWJ1dGVzIHJlcXVpcmVkIHRvIGltcG9ydCBhbiBleGlzdGluZyBFQlMgVm9sdW1lIGludG8gdGhlIFN0YWNrLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFZvbHVtZUF0dHJpYnV0ZXMge1xuICAvKipcbiAgICogVGhlIEVCUyBWb2x1bWUncyBJRFxuICAgKi9cbiAgcmVhZG9ubHkgdm9sdW1lSWQ6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGF2YWlsYWJpbGl0eSB6b25lIHRoYXQgdGhlIEVCUyBWb2x1bWUgaXMgY29udGFpbmVkIHdpdGhpbiAoZXg6IHVzLXdlc3QtMmEpXG4gICAqL1xuICByZWFkb25seSBhdmFpbGFiaWxpdHlab25lOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBjdXN0b21lci1tYW5hZ2VkIGVuY3J5cHRpb24ga2V5IHRoYXQgaXMgdXNlZCB0byBlbmNyeXB0IHRoZSBWb2x1bWUuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vbmUgLS0gVGhlIEVCUyBWb2x1bWUgaXMgbm90IHVzaW5nIGEgY3VzdG9tZXItbWFuYWdlZCBLTVMga2V5IGZvciBlbmNyeXB0aW9uLlxuICAgKi9cbiAgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IElLZXk7XG59XG5cbi8qKlxuICogQ29tbW9uIGJlaGF2aW9yIG9mIFZvbHVtZXMuIFVzZXJzIHNob3VsZCBub3QgdXNlIHRoaXMgY2xhc3MgZGlyZWN0bHksIGFuZCBpbnN0ZWFkIHVzZSBgYFZvbHVtZWBgLlxuICovXG5hYnN0cmFjdCBjbGFzcyBWb2x1bWVCYXNlIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJVm9sdW1lIHtcbiAgcHVibGljIGFic3RyYWN0IHJlYWRvbmx5IHZvbHVtZUlkOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBhdmFpbGFiaWxpdHlab25lOiBzdHJpbmc7XG4gIHB1YmxpYyBhYnN0cmFjdCByZWFkb25seSBlbmNyeXB0aW9uS2V5PzogSUtleTtcblxuICBwdWJsaWMgZ3JhbnRBdHRhY2hWb2x1bWUoZ3JhbnRlZTogSUdyYW50YWJsZSwgaW5zdGFuY2VzPzogSUluc3RhbmNlW10pOiBHcmFudCB7XG4gICAgY29uc3QgcmVzdWx0ID0gR3JhbnQuYWRkVG9QcmluY2lwYWwoe1xuICAgICAgZ3JhbnRlZSxcbiAgICAgIGFjdGlvbnM6IFsnZWMyOkF0dGFjaFZvbHVtZSddLFxuICAgICAgcmVzb3VyY2VBcm5zOiB0aGlzLmNvbGxlY3RHcmFudFJlc291cmNlQXJucyhpbnN0YW5jZXMpLFxuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuZW5jcnlwdGlvbktleSkge1xuICAgICAgLy8gV2hlbiBhdHRhY2hpbmcgYSB2b2x1bWUsIHRoZSBFQzIgU2VydmljZSB3aWxsIG5lZWQgdG8gZ3JhbnQgdG8gaXRzZWxmIHBlcm1pc3Npb25cbiAgICAgIC8vIHRvIGJlIGFibGUgdG8gZGVjcnlwdCB0aGUgZW5jcnlwdGlvbiBrZXkuIFdlIHJlc3RyaWN0IHRoZSBDcmVhdGVHcmFudCBmb3IgcHJpbmNpcGxlXG4gICAgICAvLyBvZiBsZWFzdCBwcml2aWxlZ2UsIGluIGFjY29yZGFuY2Ugd2l0aCBiZXN0IHByYWN0aWNlcy5cbiAgICAgIC8vIFNlZTogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvVXNlckd1aWRlL0VCU0VuY3J5cHRpb24uaHRtbCNlYnMtZW5jcnlwdGlvbi1wZXJtaXNzaW9uc1xuICAgICAgY29uc3Qga21zR3JhbnQ6IEdyYW50ID0gdGhpcy5lbmNyeXB0aW9uS2V5LmdyYW50KGdyYW50ZWUsICdrbXM6Q3JlYXRlR3JhbnQnKTtcbiAgICAgIGttc0dyYW50LnByaW5jaXBhbFN0YXRlbWVudCEuYWRkQ29uZGl0aW9ucyhcbiAgICAgICAge1xuICAgICAgICAgIEJvb2w6IHsgJ2ttczpHcmFudElzRm9yQVdTUmVzb3VyY2UnOiB0cnVlIH0sXG4gICAgICAgICAgU3RyaW5nRXF1YWxzOiB7XG4gICAgICAgICAgICAna21zOlZpYVNlcnZpY2UnOiBgZWMyLiR7U3RhY2sub2YodGhpcykucmVnaW9ufS5hbWF6b25hd3MuY29tYCxcbiAgICAgICAgICAgICdrbXM6R3JhbnRDb25zdHJhaW50VHlwZSc6ICdFbmNyeXB0aW9uQ29udGV4dFN1YnNldCcsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBncmFudEF0dGFjaFZvbHVtZUJ5UmVzb3VyY2VUYWcoZ3JhbnRlZTogSUdyYW50YWJsZSwgY29uc3RydWN0czogQ29uc3RydWN0W10sIHRhZ0tleVN1ZmZpeD86IHN0cmluZyk6IEdyYW50IHtcbiAgICBjb25zdCB0YWdWYWx1ZSA9IHRoaXMuY2FsY3VsYXRlUmVzb3VyY2VUYWdWYWx1ZShbdGhpcywgLi4uY29uc3RydWN0c10pO1xuICAgIGNvbnN0IHRhZ0tleSA9IGBWb2x1bWVHcmFudEF0dGFjaC0ke3RhZ0tleVN1ZmZpeCA/PyB0YWdWYWx1ZS5zbGljZSgwLCAxMCkudG9VcHBlckNhc2UoKX1gO1xuICAgIGNvbnN0IGdyYW50Q29uZGl0aW9uOiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9ID0ge307XG4gICAgZ3JhbnRDb25kaXRpb25bYGVjMjpSZXNvdXJjZVRhZy8ke3RhZ0tleX1gXSA9IHRhZ1ZhbHVlO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5ncmFudEF0dGFjaFZvbHVtZShncmFudGVlKTtcbiAgICByZXN1bHQucHJpbmNpcGFsU3RhdGVtZW50IS5hZGRDb25kaXRpb24oXG4gICAgICAnRm9yQW55VmFsdWU6U3RyaW5nRXF1YWxzJywgZ3JhbnRDb25kaXRpb24sXG4gICAgKTtcblxuICAgIC8vIFRoZSBSZXNvdXJjZVRhZyBjb25kaXRpb24gcmVxdWlyZXMgdGhhdCBhbGwgcmVzb3VyY2VzIGludm9sdmVkIGluIHRoZSBvcGVyYXRpb24gaGF2ZVxuICAgIC8vIHRoZSBnaXZlbiB0YWcsIHNvIHdlIHRhZyB0aGlzIGFuZCBhbGwgY29uc3RydWN0cyBnaXZlbi5cbiAgICBUYWdzLm9mKHRoaXMpLmFkZCh0YWdLZXksIHRhZ1ZhbHVlKTtcbiAgICBjb25zdHJ1Y3RzLmZvckVhY2goY29uc3RydWN0ID0+IFRhZ3Mub2YoY29uc3RydWN0KS5hZGQodGFnS2V5LCB0YWdWYWx1ZSkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHB1YmxpYyBncmFudERldGFjaFZvbHVtZShncmFudGVlOiBJR3JhbnRhYmxlLCBpbnN0YW5jZXM/OiBJSW5zdGFuY2VbXSk6IEdyYW50IHtcbiAgICBjb25zdCByZXN1bHQgPSBHcmFudC5hZGRUb1ByaW5jaXBhbCh7XG4gICAgICBncmFudGVlLFxuICAgICAgYWN0aW9uczogWydlYzI6RGV0YWNoVm9sdW1lJ10sXG4gICAgICByZXNvdXJjZUFybnM6IHRoaXMuY29sbGVjdEdyYW50UmVzb3VyY2VBcm5zKGluc3RhbmNlcyksXG4gICAgfSk7XG4gICAgLy8gTm90ZTogTm8gZW5jcnlwdGlvbiBrZXkgcGVybWlzc2lvbnMgYXJlIHJlcXVpcmVkIHRvIGRldGFjaCBhbiBlbmNyeXB0ZWQgdm9sdW1lLlxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgZ3JhbnREZXRhY2hWb2x1bWVCeVJlc291cmNlVGFnKGdyYW50ZWU6IElHcmFudGFibGUsIGNvbnN0cnVjdHM6IENvbnN0cnVjdFtdLCB0YWdLZXlTdWZmaXg/OiBzdHJpbmcpOiBHcmFudCB7XG4gICAgY29uc3QgdGFnVmFsdWUgPSB0aGlzLmNhbGN1bGF0ZVJlc291cmNlVGFnVmFsdWUoW3RoaXMsIC4uLmNvbnN0cnVjdHNdKTtcbiAgICBjb25zdCB0YWdLZXkgPSBgVm9sdW1lR3JhbnREZXRhY2gtJHt0YWdLZXlTdWZmaXggPz8gdGFnVmFsdWUuc2xpY2UoMCwgMTApLnRvVXBwZXJDYXNlKCl9YDtcbiAgICBjb25zdCBncmFudENvbmRpdGlvbjogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgIGdyYW50Q29uZGl0aW9uW2BlYzI6UmVzb3VyY2VUYWcvJHt0YWdLZXl9YF0gPSB0YWdWYWx1ZTtcblxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZ3JhbnREZXRhY2hWb2x1bWUoZ3JhbnRlZSk7XG4gICAgcmVzdWx0LnByaW5jaXBhbFN0YXRlbWVudCEuYWRkQ29uZGl0aW9uKFxuICAgICAgJ0ZvckFueVZhbHVlOlN0cmluZ0VxdWFscycsIGdyYW50Q29uZGl0aW9uLFxuICAgICk7XG5cbiAgICAvLyBUaGUgUmVzb3VyY2VUYWcgY29uZGl0aW9uIHJlcXVpcmVzIHRoYXQgYWxsIHJlc291cmNlcyBpbnZvbHZlZCBpbiB0aGUgb3BlcmF0aW9uIGhhdmVcbiAgICAvLyB0aGUgZ2l2ZW4gdGFnLCBzbyB3ZSB0YWcgdGhpcyBhbmQgYWxsIGNvbnN0cnVjdHMgZ2l2ZW4uXG4gICAgVGFncy5vZih0aGlzKS5hZGQodGFnS2V5LCB0YWdWYWx1ZSk7XG4gICAgY29uc3RydWN0cy5mb3JFYWNoKGNvbnN0cnVjdCA9PiBUYWdzLm9mKGNvbnN0cnVjdCkuYWRkKHRhZ0tleSwgdGFnVmFsdWUpKTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGNvbGxlY3RHcmFudFJlc291cmNlQXJucyhpbnN0YW5jZXM/OiBJSW5zdGFuY2VbXSk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCBzdGFjayA9IFN0YWNrLm9mKHRoaXMpO1xuICAgIGNvbnN0IHJlc291cmNlQXJuczogc3RyaW5nW10gPSBbXG4gICAgICBgYXJuOiR7c3RhY2sucGFydGl0aW9ufTplYzI6JHtzdGFjay5yZWdpb259OiR7c3RhY2suYWNjb3VudH06dm9sdW1lLyR7dGhpcy52b2x1bWVJZH1gLFxuICAgIF07XG4gICAgY29uc3QgaW5zdGFuY2VBcm5QcmVmaXggPSBgYXJuOiR7c3RhY2sucGFydGl0aW9ufTplYzI6JHtzdGFjay5yZWdpb259OiR7c3RhY2suYWNjb3VudH06aW5zdGFuY2VgO1xuICAgIGlmIChpbnN0YW5jZXMpIHtcbiAgICAgIGluc3RhbmNlcy5mb3JFYWNoKGluc3RhbmNlID0+IHJlc291cmNlQXJucy5wdXNoKGAke2luc3RhbmNlQXJuUHJlZml4fS8ke2luc3RhbmNlPy5pbnN0YW5jZUlkfWApKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVzb3VyY2VBcm5zLnB1c2goYCR7aW5zdGFuY2VBcm5QcmVmaXh9LypgKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc291cmNlQXJucztcbiAgfVxuXG4gIHByaXZhdGUgY2FsY3VsYXRlUmVzb3VyY2VUYWdWYWx1ZShjb25zdHJ1Y3RzOiBDb25zdHJ1Y3RbXSk6IHN0cmluZyB7XG4gICAgcmV0dXJuIG1kNWhhc2goY29uc3RydWN0cy5tYXAoYyA9PiBOYW1lcy51bmlxdWVJZChjKSkuam9pbignJykpO1xuICB9XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBFQlMgVm9sdW1lIGluIEFXUyBFQzIuXG4gKi9cbmV4cG9ydCBjbGFzcyBWb2x1bWUgZXh0ZW5kcyBWb2x1bWVCYXNlIHtcbiAgLyoqXG4gICAqIEltcG9ydCBhbiBleGlzdGluZyBFQlMgVm9sdW1lIGludG8gdGhlIFN0YWNrLlxuICAgKlxuICAgKiBAcGFyYW0gc2NvcGUgdGhlIHNjb3BlIG9mIHRoZSBpbXBvcnQuXG4gICAqIEBwYXJhbSBpZCAgICB0aGUgSUQgb2YgdGhlIGltcG9ydGVkIFZvbHVtZSBpbiB0aGUgY29uc3RydWN0IHRyZWUuXG4gICAqIEBwYXJhbSBhdHRycyB0aGUgYXR0cmlidXRlcyBvZiB0aGUgaW1wb3J0ZWQgVm9sdW1lXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Wb2x1bWVBdHRyaWJ1dGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIGF0dHJzOiBWb2x1bWVBdHRyaWJ1dGVzKTogSVZvbHVtZSB7XG4gICAgY2xhc3MgSW1wb3J0IGV4dGVuZHMgVm9sdW1lQmFzZSB7XG4gICAgICBwdWJsaWMgcmVhZG9ubHkgdm9sdW1lSWQgPSBhdHRycy52b2x1bWVJZDtcbiAgICAgIHB1YmxpYyByZWFkb25seSBhdmFpbGFiaWxpdHlab25lID0gYXR0cnMuYXZhaWxhYmlsaXR5Wm9uZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBlbmNyeXB0aW9uS2V5ID0gYXR0cnMuZW5jcnlwdGlvbktleTtcbiAgICB9XG4gICAgLy8gQ2hlY2sgdGhhdCB0aGUgcHJvdmlkZWQgdm9sdW1lSWQgbG9va3MgbGlrZSBpdCBjb3VsZCBiZSB2YWxpZC5cbiAgICBpZiAoIVRva2VuLmlzVW5yZXNvbHZlZChhdHRycy52b2x1bWVJZCkgJiYgIS9edm9sLVswLTlhLWZBLUZdKyQvLnRlc3QoYXR0cnMudm9sdW1lSWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2B2b2x1bWVJZGAgZG9lcyBub3QgbWF0Y2ggZXhwZWN0ZWQgcGF0dGVybi4gRXhwZWN0ZWQgYHZvbC08aGV4YWRlY21pYWwgdmFsdWU+YCAoZXg6IGB2b2wtMDVhYmUyNDZhZmApIG9yIGEgVG9rZW4nKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBJbXBvcnQoc2NvcGUsIGlkKTtcbiAgfVxuXG4gIHB1YmxpYyByZWFkb25seSB2b2x1bWVJZDogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgYXZhaWxhYmlsaXR5Wm9uZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgZW5jcnlwdGlvbktleT86IElLZXk7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFZvbHVtZVByb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCB7XG4gICAgICBwaHlzaWNhbE5hbWU6IHByb3BzLnZvbHVtZU5hbWUsXG4gICAgfSk7XG5cbiAgICB0aGlzLnZhbGlkYXRlUHJvcHMocHJvcHMpO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuVm9sdW1lKHRoaXMsICdSZXNvdXJjZScsIHtcbiAgICAgIGF2YWlsYWJpbGl0eVpvbmU6IHByb3BzLmF2YWlsYWJpbGl0eVpvbmUsXG4gICAgICBhdXRvRW5hYmxlSW86IHByb3BzLmF1dG9FbmFibGVJbyxcbiAgICAgIGVuY3J5cHRlZDogcHJvcHMuZW5jcnlwdGVkLFxuICAgICAga21zS2V5SWQ6IHByb3BzLmVuY3J5cHRpb25LZXk/LmtleUFybixcbiAgICAgIGlvcHM6IHByb3BzLmlvcHMsXG4gICAgICBtdWx0aUF0dGFjaEVuYWJsZWQ6IHByb3BzLmVuYWJsZU11bHRpQXR0YWNoID8/IGZhbHNlLFxuICAgICAgc2l6ZTogcHJvcHMuc2l6ZT8udG9HaWJpYnl0ZXMoeyByb3VuZGluZzogU2l6ZVJvdW5kaW5nQmVoYXZpb3IuRkFJTCB9KSxcbiAgICAgIHNuYXBzaG90SWQ6IHByb3BzLnNuYXBzaG90SWQsXG4gICAgICB0aHJvdWdocHV0OiBwcm9wcy50aHJvdWdocHV0LFxuICAgICAgdm9sdW1lVHlwZTogcHJvcHMudm9sdW1lVHlwZSA/PyBFYnNEZXZpY2VWb2x1bWVUeXBlLkdFTkVSQUxfUFVSUE9TRV9TU0QsXG4gICAgfSk7XG4gICAgcmVzb3VyY2UuYXBwbHlSZW1vdmFsUG9saWN5KHByb3BzLnJlbW92YWxQb2xpY3kpO1xuXG4gICAgaWYgKHByb3BzLnZvbHVtZU5hbWUpIFRhZ3Mub2YocmVzb3VyY2UpLmFkZCgnTmFtZScsIHByb3BzLnZvbHVtZU5hbWUpO1xuXG4gICAgdGhpcy52b2x1bWVJZCA9IHJlc291cmNlLnJlZjtcbiAgICB0aGlzLmF2YWlsYWJpbGl0eVpvbmUgPSBwcm9wcy5hdmFpbGFiaWxpdHlab25lO1xuICAgIHRoaXMuZW5jcnlwdGlvbktleSA9IHByb3BzLmVuY3J5cHRpb25LZXk7XG5cbiAgICBpZiAodGhpcy5lbmNyeXB0aW9uS2V5KSB7XG4gICAgICAvLyBQZXI6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1VzZXJHdWlkZS9FQlNFbmNyeXB0aW9uLmh0bWwjZWJzLWVuY3J5cHRpb24tcmVxdWlyZW1lbnRzXG4gICAgICBjb25zdCBwcmluY2lwYWwgPVxuICAgICAgICBuZXcgVmlhU2VydmljZVByaW5jaXBhbChgZWMyLiR7U3RhY2sub2YodGhpcykucmVnaW9ufS5hbWF6b25hd3MuY29tYCwgbmV3IEFjY291bnRSb290UHJpbmNpcGFsKCkpLndpdGhDb25kaXRpb25zKHtcbiAgICAgICAgICBTdHJpbmdFcXVhbHM6IHtcbiAgICAgICAgICAgICdrbXM6Q2FsbGVyQWNjb3VudCc6IFN0YWNrLm9mKHRoaXMpLmFjY291bnQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICBjb25zdCBncmFudCA9IHRoaXMuZW5jcnlwdGlvbktleS5ncmFudChwcmluY2lwYWwsXG4gICAgICAgIC8vIERlc2NyaWJlICYgR2VuZXJhdGUgYXJlIHJlcXVpcmVkIHRvIGJlIGFibGUgdG8gY3JlYXRlIHRoZSBDTUstZW5jcnlwdGVkIFZvbHVtZS5cbiAgICAgICAgJ2ttczpEZXNjcmliZUtleScsXG4gICAgICAgICdrbXM6R2VuZXJhdGVEYXRhS2V5V2l0aG91dFBsYWluVGV4dCcsXG4gICAgICApO1xuICAgICAgaWYgKHByb3BzLnNuYXBzaG90SWQpIHtcbiAgICAgICAgLy8gUmVFbmNyeXB0IGlzIHJlcXVpcmVkIGZvciB3aGVuIHJlLWVuY3J5cHRpbmcgZnJvbSBhbiBlbmNyeXB0ZWQgc25hcHNob3QuXG4gICAgICAgIGdyYW50LnByaW5jaXBhbFN0YXRlbWVudD8uYWRkQWN0aW9ucygna21zOlJlRW5jcnlwdConKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgdmFsaWRhdGVQcm9wcyhwcm9wczogVm9sdW1lUHJvcHMpIHtcbiAgICBpZiAoIShwcm9wcy5zaXplIHx8IHByb3BzLnNuYXBzaG90SWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ011c3QgcHJvdmlkZSBhdCBsZWFzdCBvbmUgb2YgYHNpemVgIG9yIGBzbmFwc2hvdElkYCcpO1xuICAgIH1cblxuICAgIGlmIChwcm9wcy5zbmFwc2hvdElkICYmICFUb2tlbi5pc1VucmVzb2x2ZWQocHJvcHMuc25hcHNob3RJZCkgJiYgIS9ec25hcC1bMC05YS1mQS1GXSskLy50ZXN0KHByb3BzLnNuYXBzaG90SWQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2BzbmFwc2hvdElkYCBkb2VzIG1hdGNoIGV4cGVjdGVkIHBhdHRlcm4uIEV4cGVjdGVkIGBzbmFwLTxoZXhhZGVjbWlhbCB2YWx1ZT5gIChleDogYHNuYXAtMDVhYmUyNDZhZmApIG9yIFRva2VuJyk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmVuY3J5cHRpb25LZXkgJiYgIXByb3BzLmVuY3J5cHRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdgZW5jcnlwdGVkYCBtdXN0IGJlIHRydWUgd2hlbiBwcm92aWRpbmcgYW4gYGVuY3J5cHRpb25LZXlgLicpO1xuICAgIH1cblxuICAgIGlmIChcbiAgICAgIHByb3BzLnZvbHVtZVR5cGUgJiZcbiAgICAgIFtcbiAgICAgICAgRWJzRGV2aWNlVm9sdW1lVHlwZS5QUk9WSVNJT05FRF9JT1BTX1NTRCxcbiAgICAgICAgRWJzRGV2aWNlVm9sdW1lVHlwZS5QUk9WSVNJT05FRF9JT1BTX1NTRF9JTzIsXG4gICAgICBdLmluY2x1ZGVzKHByb3BzLnZvbHVtZVR5cGUpICYmXG4gICAgICAhcHJvcHMuaW9wc1xuICAgICkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAnYGlvcHNgIG11c3QgYmUgc3BlY2lmaWVkIGlmIHRoZSBgdm9sdW1lVHlwZWAgaXMgYFBST1ZJU0lPTkVEX0lPUFNfU1NEYCBvciBgUFJPVklTSU9ORURfSU9QU19TU0RfSU8yYC4nLFxuICAgICAgKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMuaW9wcykge1xuICAgICAgY29uc3Qgdm9sdW1lVHlwZSA9IHByb3BzLnZvbHVtZVR5cGUgPz8gRWJzRGV2aWNlVm9sdW1lVHlwZS5HRU5FUkFMX1BVUlBPU0VfU1NEO1xuICAgICAgaWYgKFxuICAgICAgICAhW1xuICAgICAgICAgIEVic0RldmljZVZvbHVtZVR5cGUuUFJPVklTSU9ORURfSU9QU19TU0QsXG4gICAgICAgICAgRWJzRGV2aWNlVm9sdW1lVHlwZS5QUk9WSVNJT05FRF9JT1BTX1NTRF9JTzIsXG4gICAgICAgICAgRWJzRGV2aWNlVm9sdW1lVHlwZS5HRU5FUkFMX1BVUlBPU0VfU1NEX0dQMyxcbiAgICAgICAgXS5pbmNsdWRlcyh2b2x1bWVUeXBlKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnYGlvcHNgIG1heSBvbmx5IGJlIHNwZWNpZmllZCBpZiB0aGUgYHZvbHVtZVR5cGVgIGlzIGBQUk9WSVNJT05FRF9JT1BTX1NTRGAsIGBQUk9WSVNJT05FRF9JT1BTX1NTRF9JTzJgIG9yIGBHRU5FUkFMX1BVUlBPU0VfU1NEX0dQM2AuJyxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIC8vIEVuZm9yY2UgbWluaW11bSAmIG1heGltdW0gSU9QUzpcbiAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjMi1lYnMtdm9sdW1lLmh0bWxcbiAgICAgIGNvbnN0IGlvcHNSYW5nZXM6IHsgW2tleTogc3RyaW5nXTogeyBNaW46IG51bWJlciwgTWF4OiBudW1iZXIgfSB9ID0ge307XG4gICAgICBpb3BzUmFuZ2VzW0Vic0RldmljZVZvbHVtZVR5cGUuR0VORVJBTF9QVVJQT1NFX1NTRF9HUDNdID0geyBNaW46IDMwMDAsIE1heDogMTYwMDAgfTtcbiAgICAgIGlvcHNSYW5nZXNbRWJzRGV2aWNlVm9sdW1lVHlwZS5QUk9WSVNJT05FRF9JT1BTX1NTRF0gPSB7IE1pbjogMTAwLCBNYXg6IDY0MDAwIH07XG4gICAgICBpb3BzUmFuZ2VzW0Vic0RldmljZVZvbHVtZVR5cGUuUFJPVklTSU9ORURfSU9QU19TU0RfSU8yXSA9IHsgTWluOiAxMDAsIE1heDogNjQwMDAgfTtcbiAgICAgIGNvbnN0IHsgTWluLCBNYXggfSA9IGlvcHNSYW5nZXNbdm9sdW1lVHlwZV07XG4gICAgICBpZiAocHJvcHMuaW9wcyA8IE1pbiB8fCBwcm9wcy5pb3BzID4gTWF4KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgXFxgJHt2b2x1bWVUeXBlfVxcYCB2b2x1bWVzIGlvcHMgbXVzdCBiZSBiZXR3ZWVuICR7TWlufSBhbmQgJHtNYXh9LmApO1xuICAgICAgfVxuXG4gICAgICAvLyBFbmZvcmNlIG1heGltdW0gcmF0aW8gb2YgSU9QUy9HaUI6XG4gICAgICAvLyBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTRUMyL2xhdGVzdC9Vc2VyR3VpZGUvZWJzLXZvbHVtZS10eXBlcy5odG1sXG4gICAgICBjb25zdCBtYXhpbXVtUmF0aW9zOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge307XG4gICAgICBtYXhpbXVtUmF0aW9zW0Vic0RldmljZVZvbHVtZVR5cGUuR0VORVJBTF9QVVJQT1NFX1NTRF9HUDNdID0gNTAwO1xuICAgICAgbWF4aW11bVJhdGlvc1tFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NEXSA9IDUwO1xuICAgICAgbWF4aW11bVJhdGlvc1tFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NEX0lPMl0gPSA1MDA7XG4gICAgICBjb25zdCBtYXhpbXVtUmF0aW8gPSBtYXhpbXVtUmF0aW9zW3ZvbHVtZVR5cGVdO1xuICAgICAgaWYgKHByb3BzLnNpemUgJiYgKHByb3BzLmlvcHMgPiBtYXhpbXVtUmF0aW8gKiBwcm9wcy5zaXplLnRvR2liaWJ5dGVzKHsgcm91bmRpbmc6IFNpemVSb3VuZGluZ0JlaGF2aW9yLkZBSUwgfSkpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgXFxgJHt2b2x1bWVUeXBlfVxcYCB2b2x1bWVzIGlvcHMgaGFzIGEgbWF4aW11bSByYXRpbyBvZiAke21heGltdW1SYXRpb30gSU9QUy9HaUIuYCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG1heGltdW1UaHJvdWdocHV0UmF0aW9zOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge307XG4gICAgICBtYXhpbXVtVGhyb3VnaHB1dFJhdGlvc1tFYnNEZXZpY2VWb2x1bWVUeXBlLkdQM10gPSAwLjI1O1xuICAgICAgY29uc3QgbWF4aW11bVRocm91Z2hwdXRSYXRpbyA9IG1heGltdW1UaHJvdWdocHV0UmF0aW9zW3ZvbHVtZVR5cGVdO1xuICAgICAgaWYgKHByb3BzLnRocm91Z2hwdXQgJiYgcHJvcHMuaW9wcykge1xuICAgICAgICBjb25zdCBpb3BzUmF0aW8gPSAocHJvcHMudGhyb3VnaHB1dCAvIHByb3BzLmlvcHMpO1xuICAgICAgICBpZiAoaW9wc1JhdGlvID4gbWF4aW11bVRocm91Z2hwdXRSYXRpbykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVGhyb3VnaHB1dCAoTWlCcHMpIHRvIGlvcHMgcmF0aW8gb2YgJHtpb3BzUmF0aW99IGlzIHRvbyBoaWdoOyBtYXhpbXVtIGlzICR7bWF4aW11bVRocm91Z2hwdXRSYXRpb30gTWlCcHMgcGVyIGlvcHNgKTtcbiAgICAgICAgfVxuXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmVuYWJsZU11bHRpQXR0YWNoKSB7XG4gICAgICBjb25zdCB2b2x1bWVUeXBlID0gcHJvcHMudm9sdW1lVHlwZSA/PyBFYnNEZXZpY2VWb2x1bWVUeXBlLkdFTkVSQUxfUFVSUE9TRV9TU0Q7XG4gICAgICBpZiAoXG4gICAgICAgICFbXG4gICAgICAgICAgRWJzRGV2aWNlVm9sdW1lVHlwZS5QUk9WSVNJT05FRF9JT1BTX1NTRCxcbiAgICAgICAgICBFYnNEZXZpY2VWb2x1bWVUeXBlLlBST1ZJU0lPTkVEX0lPUFNfU1NEX0lPMixcbiAgICAgICAgXS5pbmNsdWRlcyh2b2x1bWVUeXBlKVxuICAgICAgKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbXVsdGktYXR0YWNoIGlzIHN1cHBvcnRlZCBleGNsdXNpdmVseSBvbiBgUFJPVklTSU9ORURfSU9QU19TU0RgIGFuZCBgUFJPVklTSU9ORURfSU9QU19TU0RfSU8yYCB2b2x1bWVzLicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5zaXplKSB7XG4gICAgICBjb25zdCBzaXplID0gcHJvcHMuc2l6ZS50b0dpYmlieXRlcyh7IHJvdW5kaW5nOiBTaXplUm91bmRpbmdCZWhhdmlvci5GQUlMIH0pO1xuICAgICAgLy8gRW5mb3JjZSBtaW5pbXVtICYgbWF4aW11bSB2b2x1bWUgc2l6ZTpcbiAgICAgIC8vIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL2F3cy1wcm9wZXJ0aWVzLWVjMi1lYnMtdm9sdW1lLmh0bWxcbiAgICAgIGNvbnN0IHNpemVSYW5nZXM6IHsgW2tleTogc3RyaW5nXTogeyBNaW46IG51bWJlciwgTWF4OiBudW1iZXIgfSB9ID0ge307XG4gICAgICBzaXplUmFuZ2VzW0Vic0RldmljZVZvbHVtZVR5cGUuR0VORVJBTF9QVVJQT1NFX1NTRF0gPSB7IE1pbjogMSwgTWF4OiAxNjM4NCB9O1xuICAgICAgc2l6ZVJhbmdlc1tFYnNEZXZpY2VWb2x1bWVUeXBlLkdFTkVSQUxfUFVSUE9TRV9TU0RfR1AzXSA9IHsgTWluOiAxLCBNYXg6IDE2Mzg0IH07XG4gICAgICBzaXplUmFuZ2VzW0Vic0RldmljZVZvbHVtZVR5cGUuUFJPVklTSU9ORURfSU9QU19TU0RdID0geyBNaW46IDQsIE1heDogMTYzODQgfTtcbiAgICAgIHNpemVSYW5nZXNbRWJzRGV2aWNlVm9sdW1lVHlwZS5QUk9WSVNJT05FRF9JT1BTX1NTRF9JTzJdID0geyBNaW46IDQsIE1heDogMTYzODQgfTtcbiAgICAgIHNpemVSYW5nZXNbRWJzRGV2aWNlVm9sdW1lVHlwZS5USFJPVUdIUFVUX09QVElNSVpFRF9IRERdID0geyBNaW46IDEyNSwgTWF4OiAxNjM4NCB9O1xuICAgICAgc2l6ZVJhbmdlc1tFYnNEZXZpY2VWb2x1bWVUeXBlLkNPTERfSEREXSA9IHsgTWluOiAxMjUsIE1heDogMTYzODQgfTtcbiAgICAgIHNpemVSYW5nZXNbRWJzRGV2aWNlVm9sdW1lVHlwZS5NQUdORVRJQ10gPSB7IE1pbjogMSwgTWF4OiAxMDI0IH07XG4gICAgICBjb25zdCB2b2x1bWVUeXBlID0gcHJvcHMudm9sdW1lVHlwZSA/PyBFYnNEZXZpY2VWb2x1bWVUeXBlLkdFTkVSQUxfUFVSUE9TRV9TU0Q7XG4gICAgICBjb25zdCB7IE1pbiwgTWF4IH0gPSBzaXplUmFuZ2VzW3ZvbHVtZVR5cGVdO1xuICAgICAgaWYgKHNpemUgPCBNaW4gfHwgc2l6ZSA+IE1heCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFxcYCR7dm9sdW1lVHlwZX1cXGAgdm9sdW1lcyBtdXN0IGJlIGJldHdlZW4gJHtNaW59IEdpQiBhbmQgJHtNYXh9IEdpQiBpbiBzaXplLmApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9wcy50aHJvdWdocHV0KSB7XG4gICAgICBjb25zdCB0aHJvdWdocHV0UmFuZ2UgPSB7IE1pbjogMTI1LCBNYXg6IDEwMDAgfTtcbiAgICAgIGNvbnN0IHsgTWluLCBNYXggfSA9IHRocm91Z2hwdXRSYW5nZTtcbiAgICAgIGlmIChwcm9wcy52b2x1bWVUeXBlICE9IEVic0RldmljZVZvbHVtZVR5cGUuR1AzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAndGhyb3VnaHB1dCBwcm9wZXJ0eSByZXF1aXJlcyB2b2x1bWVUeXBlOiBFYnNEZXZpY2VWb2x1bWVUeXBlLkdQMycsXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICBpZiAocHJvcHMudGhyb3VnaHB1dCA8IE1pbiB8fCBwcm9wcy50aHJvdWdocHV0ID4gTWF4KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICBgdGhyb3VnaHB1dCBwcm9wZXJ0eSB0YWtlcyBhIG1pbmltdW0gb2YgJHtNaW59IGFuZCBhIG1heGltdW0gb2YgJHtNYXh9YCxcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==