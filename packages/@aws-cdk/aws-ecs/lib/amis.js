"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BottleRocketImage = exports.BottlerocketEcsVariant = exports.EcsOptimizedImage = exports.EcsOptimizedAmi = exports.WindowsOptimizedVersion = exports.AmiHardwareType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const ec2 = require("@aws-cdk/aws-ec2");
const ssm = require("@aws-cdk/aws-ssm");
/**
 * The ECS-optimized AMI variant to use. For more information, see
 * [Amazon ECS-optimized AMIs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html).
 */
var AmiHardwareType;
(function (AmiHardwareType) {
    /**
     * Use the standard Amazon ECS-optimized AMI.
     */
    AmiHardwareType["STANDARD"] = "Standard";
    /**
     * Use the Amazon ECS GPU-optimized AMI.
     */
    AmiHardwareType["GPU"] = "GPU";
    /**
     * Use the Amazon ECS-optimized Amazon Linux 2 (arm64) AMI.
     */
    AmiHardwareType["ARM"] = "ARM64";
})(AmiHardwareType = exports.AmiHardwareType || (exports.AmiHardwareType = {}));
/**
 * ECS-optimized Windows version list
 */
var WindowsOptimizedVersion;
(function (WindowsOptimizedVersion) {
    WindowsOptimizedVersion["SERVER_2019"] = "2019";
    WindowsOptimizedVersion["SERVER_2016"] = "2016";
})(WindowsOptimizedVersion = exports.WindowsOptimizedVersion || (exports.WindowsOptimizedVersion = {}));
/*
 * TODO:v2.0.0 remove EcsOptimizedAmi
 */
/**
 * Construct a Linux or Windows machine image from the latest ECS Optimized AMI published in SSM
 *
 * @deprecated see `EcsOptimizedImage#amazonLinux`, `EcsOptimizedImage#amazonLinux` and `EcsOptimizedImage#windows`
 */
class EcsOptimizedAmi {
    /**
     * Constructs a new instance of the EcsOptimizedAmi class.
     */
    constructor(props) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-ecs.EcsOptimizedAmi", "see `EcsOptimizedImage#amazonLinux`, `EcsOptimizedImage#amazonLinux` and `EcsOptimizedImage#windows`");
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_EcsOptimizedAmiProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EcsOptimizedAmi);
            }
            throw error;
        }
        this.hwType = (props && props.hardwareType) || AmiHardwareType.STANDARD;
        if (props && props.generation) { // generation defined in the props object
            if (props.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX && this.hwType !== AmiHardwareType.STANDARD) {
                throw new Error('Amazon Linux does not support special hardware type. Use Amazon Linux 2 instead');
            }
            else if (props.windowsVersion) {
                throw new Error('"windowsVersion" and Linux image "generation" cannot be both set');
            }
            else {
                this.generation = props.generation;
            }
        }
        else if (props && props.windowsVersion) {
            if (this.hwType !== AmiHardwareType.STANDARD) {
                throw new Error('Windows Server does not support special hardware type');
            }
            else {
                this.windowsVersion = props.windowsVersion;
            }
        }
        else { // generation not defined in props object
            // always default to Amazon Linux v2 regardless of HW
            this.generation = ec2.AmazonLinuxGeneration.AMAZON_LINUX_2;
        }
        // set the SSM parameter name
        this.amiParameterName = '/aws/service/ecs/optimized-ami/'
            + (this.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX ? 'amazon-linux/' : '')
            + (this.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 ? 'amazon-linux-2/' : '')
            + (this.windowsVersion ? `windows_server/${this.windowsVersion}/english/full/` : '')
            + (this.hwType === AmiHardwareType.GPU ? 'gpu/' : '')
            + (this.hwType === AmiHardwareType.ARM ? 'arm64/' : '')
            + 'recommended/image_id';
        this.cachedInContext = props?.cachedInContext ?? false;
    }
    /**
     * Return the correct image
     */
    getImage(scope) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-ecs.EcsOptimizedAmi#getImage", "see `EcsOptimizedImage#amazonLinux`, `EcsOptimizedImage#amazonLinux` and `EcsOptimizedImage#windows`");
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.getImage);
            }
            throw error;
        }
        const ami = lookupImage(scope, this.cachedInContext, this.amiParameterName);
        const osType = this.windowsVersion ? ec2.OperatingSystemType.WINDOWS : ec2.OperatingSystemType.LINUX;
        return {
            imageId: ami,
            osType,
            userData: ec2.UserData.forOperatingSystem(osType),
        };
    }
}
exports.EcsOptimizedAmi = EcsOptimizedAmi;
_a = JSII_RTTI_SYMBOL_1;
EcsOptimizedAmi[_a] = { fqn: "@aws-cdk/aws-ecs.EcsOptimizedAmi", version: "0.0.0" };
/**
 * Construct a Linux or Windows machine image from the latest ECS Optimized AMI published in SSM
 */
class EcsOptimizedImage {
    /**
     * Constructs a new instance of the EcsOptimizedAmi class.
     */
    constructor(props) {
        this.hwType = props && props.hardwareType;
        if (props.windowsVersion) {
            this.windowsVersion = props.windowsVersion;
        }
        else if (props.generation) {
            this.generation = props.generation;
        }
        else {
            throw new Error('This error should never be thrown');
        }
        // set the SSM parameter name
        this.amiParameterName = '/aws/service/ecs/optimized-ami/'
            + (this.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX ? 'amazon-linux/' : '')
            + (this.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 ? 'amazon-linux-2/' : '')
            + (this.windowsVersion ? `windows_server/${this.windowsVersion}/english/full/` : '')
            + (this.hwType === AmiHardwareType.GPU ? 'gpu/' : '')
            + (this.hwType === AmiHardwareType.ARM ? 'arm64/' : '')
            + 'recommended/image_id';
        this.cachedInContext = props?.cachedInContext ?? false;
    }
    /**
     * Construct an Amazon Linux 2 image from the latest ECS Optimized AMI published in SSM
     *
     * @param hardwareType ECS-optimized AMI variant to use
     */
    static amazonLinux2(hardwareType = AmiHardwareType.STANDARD, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_AmiHardwareType(hardwareType);
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_EcsOptimizedImageOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.amazonLinux2);
            }
            throw error;
        }
        return new EcsOptimizedImage({
            generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
            hardwareType,
            cachedInContext: options.cachedInContext,
        });
    }
    /**
     * Construct an Amazon Linux AMI image from the latest ECS Optimized AMI published in SSM
     */
    static amazonLinux(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_EcsOptimizedImageOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.amazonLinux);
            }
            throw error;
        }
        return new EcsOptimizedImage({
            generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX,
            cachedInContext: options.cachedInContext,
        });
    }
    /**
     * Construct a Windows image from the latest ECS Optimized AMI published in SSM
     *
     * @param windowsVersion Windows Version to use
     */
    static windows(windowsVersion, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_WindowsOptimizedVersion(windowsVersion);
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_EcsOptimizedImageOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.windows);
            }
            throw error;
        }
        return new EcsOptimizedImage({
            windowsVersion,
            cachedInContext: options.cachedInContext,
        });
    }
    /**
     * Return the correct image
     */
    getImage(scope) {
        const ami = lookupImage(scope, this.cachedInContext, this.amiParameterName);
        const osType = this.windowsVersion ? ec2.OperatingSystemType.WINDOWS : ec2.OperatingSystemType.LINUX;
        return {
            imageId: ami,
            osType,
            userData: ec2.UserData.forOperatingSystem(osType),
        };
    }
}
exports.EcsOptimizedImage = EcsOptimizedImage;
_b = JSII_RTTI_SYMBOL_1;
EcsOptimizedImage[_b] = { fqn: "@aws-cdk/aws-ecs.EcsOptimizedImage", version: "0.0.0" };
/**
 * Amazon ECS variant
 */
var BottlerocketEcsVariant;
(function (BottlerocketEcsVariant) {
    /**
     * aws-ecs-1 variant
     */
    BottlerocketEcsVariant["AWS_ECS_1"] = "aws-ecs-1";
})(BottlerocketEcsVariant = exports.BottlerocketEcsVariant || (exports.BottlerocketEcsVariant = {}));
/**
 * Construct an Bottlerocket image from the latest AMI published in SSM
 */
class BottleRocketImage {
    /**
     * Constructs a new instance of the BottleRocketImage class.
     */
    constructor(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_BottleRocketImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, BottleRocketImage);
            }
            throw error;
        }
        this.variant = props.variant ?? BottlerocketEcsVariant.AWS_ECS_1;
        this.architecture = props.architecture ?? ec2.InstanceArchitecture.X86_64;
        // set the SSM parameter name
        this.amiParameterName = `/aws/service/bottlerocket/${this.variant}/${this.architecture}/latest/image_id`;
        this.cachedInContext = props.cachedInContext ?? false;
    }
    /**
     * Return the correct image
     */
    getImage(scope) {
        const ami = lookupImage(scope, this.cachedInContext, this.amiParameterName);
        return {
            imageId: ami,
            osType: ec2.OperatingSystemType.LINUX,
            userData: ec2.UserData.custom(''),
        };
    }
}
exports.BottleRocketImage = BottleRocketImage;
_c = JSII_RTTI_SYMBOL_1;
BottleRocketImage[_c] = { fqn: "@aws-cdk/aws-ecs.BottleRocketImage", version: "0.0.0" };
function lookupImage(scope, cachedInContext, parameterName) {
    return cachedInContext
        ? ssm.StringParameter.valueFromLookup(scope, parameterName)
        : ssm.StringParameter.valueForTypedStringParameterV2(scope, parameterName, ssm.ParameterValueType.AWS_EC2_IMAGE_ID);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1pcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtaXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQU14Qzs7O0dBR0c7QUFDSCxJQUFZLGVBZ0JYO0FBaEJELFdBQVksZUFBZTtJQUV6Qjs7T0FFRztJQUNILHdDQUFxQixDQUFBO0lBRXJCOztPQUVHO0lBQ0gsOEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsZ0NBQWEsQ0FBQTtBQUNmLENBQUMsRUFoQlcsZUFBZSxHQUFmLHVCQUFlLEtBQWYsdUJBQWUsUUFnQjFCO0FBR0Q7O0dBRUc7QUFDSCxJQUFZLHVCQUdYO0FBSEQsV0FBWSx1QkFBdUI7SUFDakMsK0NBQW9CLENBQUE7SUFDcEIsK0NBQW9CLENBQUE7QUFDdEIsQ0FBQyxFQUhXLHVCQUF1QixHQUF2QiwrQkFBdUIsS0FBdkIsK0JBQXVCLFFBR2xDO0FBd0REOztHQUVHO0FBQ0g7Ozs7R0FJRztBQUNILE1BQWEsZUFBZTtJQVExQjs7T0FFRztJQUNILFlBQVksS0FBNEI7Ozs7Ozs7K0NBWDdCLGVBQWU7Ozs7UUFZeEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQztRQUN4RSxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsVUFBVSxFQUFFLEVBQUUseUNBQXlDO1lBQ3hFLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUMscUJBQXFCLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssZUFBZSxDQUFDLFFBQVEsRUFBRTtnQkFDM0csTUFBTSxJQUFJLEtBQUssQ0FBQyxpRkFBaUYsQ0FBQyxDQUFDO2FBQ3BHO2lCQUFNLElBQUksS0FBSyxDQUFDLGNBQWMsRUFBRTtnQkFDL0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO2FBQ3JGO2lC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QUUxRSw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLDZCQUE2QixJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxZQUFZLGtCQUFrQixDQUFDO1FBRXpHLElBQUksQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLGVBQWUsSUFBSSxLQUFLLENBQUM7S0FDdkQ7SUFFRDs7T0FFRztJQUNJLFFBQVEsQ0FBQyxLQUFnQjtRQUM5QixNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFNUUsT0FBTztZQUNMLE9BQU8sRUFBRSxHQUFHO1lBQ1osTUFBTSxFQUFFLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLO1lBQ3JDLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7U0FDbEMsQ0FBQztLQUNIOztBQXRDSCw4Q0F1Q0M7OztBQUVELFNBQVMsV0FBVyxDQUFDLEtBQWdCLEVBQUUsZUFBb0MsRUFBRSxhQUFxQjtJQUNoRyxPQUFPLGVBQWU7UUFDcEIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUM7UUFDM0QsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsOEJBQThCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4SCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZWMyIGZyb20gJ0Bhd3MtY2RrL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgc3NtIGZyb20gJ0Bhd3MtY2RrL2F3cy1zc20nO1xuXG4vLyB2MiAtIGtlZXAgdGhpcyBpbXBvcnQgYXMgYSBzZXBhcmF0ZSBzZWN0aW9uIHRvIHJlZHVjZSBtZXJnZSBjb25mbGljdCB3aGVuIGZvcndhcmQgbWVyZ2luZyB3aXRoIHRoZSB2MiBicmFuY2guXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG4vKipcbiAqIFRoZSBFQ1Mtb3B0aW1pemVkIEFNSSB2YXJpYW50IHRvIHVzZS4gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZVxuICogW0FtYXpvbiBFQ1Mtb3B0aW1pemVkIEFNSXNdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2Vjcy1vcHRpbWl6ZWRfQU1JLmh0bWwpLlxuICovXG5leHBvcnQgZW51bSBBbWlIYXJkd2FyZVR5cGUge1xuXG4gIC8qKlxuICAgKiBVc2UgdGhlIHN0YW5kYXJkIEFtYXpvbiBFQ1Mtb3B0aW1pemVkIEFNSS5cbiAgICovXG4gIFNUQU5EQVJEID0gJ1N0YW5kYXJkJyxcblxuICAvKipcbiAgICogVXNlIHRoZSBBbWF6b24gRUNTIEdQVS1vcHRpbWl6ZWQgQU1JLlxuICAgKi9cbiAgR1BVID0gJ0dQVScsXG5cbiAgLyoqXG4gICAqIFVzZSB0aGUgQW1hem9uIEVDUy1vcHRpbWl6ZWQgQW1hem9uIExpbnV4IDIgKGFybTY0KSBBTUkuXG4gICAqL1xuICBBUk0gPSAnQVJNNjQnLFxufVxuXG5cbi8qKlxuICogRUNTLW9wdGltaXplZCBXaW5kb3dzIHZlcnNpb24gbGlzdFxuICovXG5leHBvcnQgZW51bSBXaW5kb3dzT3B0aW1pemVkVmVyc2lvbiB7XG4gIFNFUlZFUl8yMDE5ID0gJzIwMTknLFxuICBTRVJWRVJfMjAxNiA9ICcyMDE2Jyxcbn1cblxuLypcbiAqIFRPRE86djIuMC4wXG4gKiAgKiByZW1vdmUgYGV4cG9ydGAga2V5d29yZFxuICogICogcmVtb3ZlIEBkZXByZWNhdGVkXG4gKi9cbi8qKlxuICogVGhlIHByb3BlcnRpZXMgdGhhdCBkZWZpbmUgd2hpY2ggRUNTLW9wdGltaXplZCBBTUkgaXMgdXNlZC5cbiAqXG4gKiBAZGVwcmVjYXRlZCBzZWUgYEVjc09wdGltaXplZEltYWdlYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEVjc09wdGltaXplZEFtaVByb3BzIHtcbiAgLyoqXG4gICAqIFRoZSBBbWF6b24gTGludXggZ2VuZXJhdGlvbiB0byB1c2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IEFtYXpvbkxpbnV4R2VuZXJhdGlvbi5BbWF6b25MaW51eDJcbiAgICovXG4gIHJlYWRvbmx5IGdlbmVyYXRpb24/OiBlYzIuQW1hem9uTGludXhHZW5lcmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgV2luZG93cyBTZXJ2ZXIgdmVyc2lvbiB0byB1c2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IG5vbmUsIHVzZXMgTGludXggZ2VuZXJhdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgd2luZG93c1ZlcnNpb24/OiBXaW5kb3dzT3B0aW1pemVkVmVyc2lvbjtcblxuICAvKipcbiAgICogVGhlIEVDUy1vcHRpbWl6ZWQgQU1JIHZhcmlhbnQgdG8gdXNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBBbWlIYXJkd2FyZVR5cGUuU3RhbmRhcmRcbiAgICovXG4gIHJlYWRvbmx5IGhhcmR3YXJlVHlwZT86IEFtaUhhcmR3YXJlVHlwZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgQU1JIElEIGlzIGNhY2hlZCB0byBiZSBzdGFibGUgYmV0d2VlbiBkZXBsb3ltZW50c1xuICAgKlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgbmV3ZXN0IGltYWdlIGlzIHVzZWQgb24gZWFjaCBkZXBsb3ltZW50LiBUaGlzIHdpbGwgY2F1c2VcbiAgICogaW5zdGFuY2VzIHRvIGJlIHJlcGxhY2VkIHdoZW5ldmVyIGEgbmV3IHZlcnNpb24gaXMgcmVsZWFzZWQsIGFuZCBtYXkgY2F1c2VcbiAgICogZG93bnRpbWUgaWYgdGhlcmUgYXJlbid0IGVub3VnaCBydW5uaW5nIGluc3RhbmNlcyBpbiB0aGUgQXV0b1NjYWxpbmdHcm91cFxuICAgKiB0byByZXNjaGVkdWxlIHRoZSB0YXNrcyBvbi5cbiAgICpcbiAgICogSWYgc2V0IHRvIHRydWUsIHRoZSBBTUkgSUQgd2lsbCBiZSBjYWNoZWQgaW4gYGNkay5jb250ZXh0Lmpzb25gIGFuZCB0aGVcbiAgICogc2FtZSB2YWx1ZSB3aWxsIGJlIHVzZWQgb24gZnV0dXJlIHJ1bnMuIFlvdXIgaW5zdGFuY2VzIHdpbGwgbm90IGJlIHJlcGxhY2VkXG4gICAqIGJ1dCB5b3VyIEFNSSB2ZXJzaW9uIHdpbGwgZ3JvdyBvbGQgb3ZlciB0aW1lLiBUbyByZWZyZXNoIHRoZSBBTUkgbG9va3VwLFxuICAgKiB5b3Ugd2lsbCBoYXZlIHRvIGV2aWN0IHRoZSB2YWx1ZSBmcm9tIHRoZSBjYWNoZSB1c2luZyB0aGUgYGNkayBjb250ZXh0YFxuICAgKiBjb21tYW5kLiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9sYXRlc3QvZ3VpZGUvY29udGV4dC5odG1sIGZvclxuICAgKiBtb3JlIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBDYW4gbm90IGJlIHNldCB0byBgdHJ1ZWAgaW4gZW52aXJvbm1lbnQtYWdub3N0aWMgc3RhY2tzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgY2FjaGVkSW5Db250ZXh0PzogYm9vbGVhbjtcbn1cblxuLypcbiAqIFRPRE86djIuMC4wIHJlbW92ZSBFY3NPcHRpbWl6ZWRBbWlcbiAqL1xuLyoqXG4gKiBDb25zdHJ1Y3QgYSBMaW51eCBvciBXaW5kb3dzIG1hY2hpbmUgaW1hZ2UgZnJvbSB0aGUgbGF0ZXN0IEVDUyBPcHRpbWl6ZWQgQU1JIHB1Ymxpc2hlZCBpbiBTU01cbiAqXG4gKiBAZGVwcmVjYXRlZCBzZWUgYEVjc09wdGltaXplZEltYWdlI2FtYXpvbkxpbnV4YCwgYEVjc09wdGltaXplZEltYWdlI2FtYXpvbkxpbnV4YCBhbmQgYEVjc09wdGltaXplZEltYWdlI3dpbmRvd3NgXG4gKi9cbmV4cG9ydCBjbGFzcyBFY3NPcHRpbWl6ZWRBbWkgaW1wbGVtZW50cyBlYzIuSU1hY2hpbmVJbWFnZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgZ2VuZXJhdGlvbj86IGVjMi5BbWF6b25MaW51eEdlbmVyYXRpb247XG4gIHByaXZhdGUgcmVhZG9ubHkgd2luZG93c1ZlcnNpb24/OiBXaW5kb3dzT3B0aW1pemVkVmVyc2lvbjtcbiAgcHJpdmF0ZSByZWFkb25seSBod1R5cGU6IEFtaUhhcmR3YXJlVHlwZTtcblxuICBwcml2YXRlIHJlYWRvbmx5IGFtaVBhcmFtZXRlck5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBjYWNoZWRJbkNvbnRleHQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEVjc09wdGltaXplZEFtaSBjbGFzcy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByb3BzPzogRWNzT3B0aW1pemVkQW1pUHJvcHMpIHtcbiAgICB0aGlzLmh3VHlwZSA9IChwcm9wcyAmJiBwcm9wcy5oYXJkd2FyZVR5cGUpIHx8IEFtaUhhcmR3YXJlVHlwZS5TVEFOREFSRDtcbiAgICBpZiAocHJvcHMgJiYgcHJvcHMuZ2VuZXJhdGlvbikgeyAvLyBnZW5lcmF0aW9uIGRlZmluZWQgaW4gdGhlIHByb3BzIG9iamVjdFxuICAgICAgaWYgKHByb3BzLmdlbmVyYXRpb24gPT09IGVjMi5BbWF6b25MaW51eEdlbmVyYXRpb24uQU1BWk9OX0xJTlVYICYmIHRoaXMuaHdUeXBlICE9PSBBbWlIYXJkd2FyZVR5cGUuU1RBTkRBUkQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBbWF6b24gTGludXggZG9lcyBub3Qgc3VwcG9ydCBzcGVjaWFsIGhhcmR3YXJlIHR5cGUuIFVzZSBBbWF6b24gTGludXggMiBpbnN0ZWFkJyk7XG4gICAgICB9IGVsc2UgaWYgKHByb3BzLndpbmRvd3NWZXJzaW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignXCJ3aW5kb3dzVmVyc2lvblwiIGFuZCBMaW51eCBpbWFnZSBcImdlbmVyYXRpb25cIiBjYW5ub3QgYmUgYm90aCBzZXQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZ2VuZXJhdGlvbiA9IHByb3BzLmdlbmVyYXRpb247XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChwcm9wcyAmJiBwcm9wcy53aW5kb3dzVmVyc2lvbikge1xuICAgICAgaWYgKHRoaXMuaHdUeXBlICE9PSBBbWlIYXJkd2FyZVR5cGUuU1RBTkRBUkQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdXaW5kb3dzIFNlcnZlciBkb2VzIG5vdCBzdXBwb3J0IHNwZWNpYWwgaGFyZHdhcmUgdHlwZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy53aW5kb3dzVmVyc2lvbiA9IHByb3BzLndpbmRvd3NWZXJzaW9uO1xuICAgICAgfVxuICAgIH0gZWxzZSB7IC8vIGdlbmVyYXRpb24gbm90IGRlZmluZWQgaW4gcHJvcHMgb2JqZWN0XG4gICAgICAvLyBhbHdheXMgZGVmYXVsdCB0byBBbWF6b24gTGludXggdjIgcmVnYXJkbGVzcyBvZiBIV1xuICAgICAgdGhpcy5nZW5lcmF0aW9uID0gZWMyLkFtYXpvbkxpbnV4R2VuZXJhdGlvbi5BTUFaT05fTElOVVhfMjtcbiAgICB9XG5cbiAgICAvLyBzZXQgdGhlIFNTTSBwYXJhbWV0ZXIgbmFtZVxuICAgIHRoaXMuYW1pUGFyYW1ldGVyTmFtZSA9ICcvYXdzL3NlcnZpY2UvZWNzL29wdGltaXplZC1hbWkvJ1xuICAgICAgKyAodGhpcy5nZW5lcmF0aW9uID09PSBlYzIuQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWCA/ICdhbWF6b24tbGludXgvJyA6ICcnKVxuICAgICAgKyAodGhpcy5nZW5lcmF0aW9uID09PSBlYzIuQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWF8yID8gJ2FtYXpvbi1saW51eC0yLycgOiAnJylcbiAgICAgICsgKHRoaXMud2luZG93c1ZlcnNpb24gPyBgd2luZG93c19zZXJ2ZXIvJHt0aGlzLndpbmRvd3NWZXJzaW9ufS9lbmdsaXNoL2Z1bGwvYCA6ICcnKVxuICAgICAgKyAodGhpcy5od1R5cGUgPT09IEFtaUhhcmR3YXJlVHlwZS5HUFUgPyAnZ3B1LycgOiAnJylcbiAgICAgICsgKHRoaXMuaHdUeXBlID09PSBBbWlIYXJkd2FyZVR5cGUuQVJNID8gJ2FybTY0LycgOiAnJylcbiAgICAgICsgJ3JlY29tbWVuZGVkL2ltYWdlX2lkJztcblxuICAgIHRoaXMuY2FjaGVkSW5Db250ZXh0ID0gcHJvcHM/LmNhY2hlZEluQ29udGV4dCA/PyBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGNvcnJlY3QgaW1hZ2VcbiAgICovXG4gIHB1YmxpYyBnZXRJbWFnZShzY29wZTogQ29uc3RydWN0KTogZWMyLk1hY2hpbmVJbWFnZUNvbmZpZyB7XG4gICAgY29uc3QgYW1pID0gbG9va3VwSW1hZ2Uoc2NvcGUsIHRoaXMuY2FjaGVkSW5Db250ZXh0LCB0aGlzLmFtaVBhcmFtZXRlck5hbWUpO1xuXG4gICAgY29uc3Qgb3NUeXBlID0gdGhpcy53aW5kb3dzVmVyc2lvbiA/IGVjMi5PcGVyYXRpbmdTeXN0ZW1UeXBlLldJTkRPV1MgOiBlYzIuT3BlcmF0aW5nU3lzdGVtVHlwZS5MSU5VWDtcbiAgICByZXR1cm4ge1xuICAgICAgaW1hZ2VJZDogYW1pLFxuICAgICAgb3NUeXBlLFxuICAgICAgdXNlckRhdGE6IGVjMi5Vc2VyRGF0YS5mb3JPcGVyYXRpbmdTeXN0ZW0ob3NUeXBlKSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQWRkaXRpb25hbCBjb25maWd1cmF0aW9uIHByb3BlcnRpZXMgZm9yIEVjc09wdGltaXplZEltYWdlIGZhY3RvcnkgZnVuY3Rpb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRWNzT3B0aW1pemVkSW1hZ2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIEFNSSBJRCBpcyBjYWNoZWQgdG8gYmUgc3RhYmxlIGJldHdlZW4gZGVwbG95bWVudHNcbiAgICpcbiAgICogQnkgZGVmYXVsdCwgdGhlIG5ld2VzdCBpbWFnZSBpcyB1c2VkIG9uIGVhY2ggZGVwbG95bWVudC4gVGhpcyB3aWxsIGNhdXNlXG4gICAqIGluc3RhbmNlcyB0byBiZSByZXBsYWNlZCB3aGVuZXZlciBhIG5ldyB2ZXJzaW9uIGlzIHJlbGVhc2VkLCBhbmQgbWF5IGNhdXNlXG4gICAqIGRvd250aW1lIGlmIHRoZXJlIGFyZW4ndCBlbm91Z2ggcnVubmluZyBpbnN0YW5jZXMgaW4gdGhlIEF1dG9TY2FsaW5nR3JvdXBcbiAgICogdG8gcmVzY2hlZHVsZSB0aGUgdGFza3Mgb24uXG4gICAqXG4gICAqIElmIHNldCB0byB0cnVlLCB0aGUgQU1JIElEIHdpbGwgYmUgY2FjaGVkIGluIGBjZGsuY29udGV4dC5qc29uYCBhbmQgdGhlXG4gICAqIHNhbWUgdmFsdWUgd2lsbCBiZSB1c2VkIG9uIGZ1dHVyZSBydW5zLiBZb3VyIGluc3RhbmNlcyB3aWxsIG5vdCBiZSByZXBsYWNlZFxuICAgKiBidXQgeW91ciBBTUkgdmVyc2lvbiB3aWxsIGdyb3cgb2xkIG92ZXIgdGltZS4gVG8gcmVmcmVzaCB0aGUgQU1JIGxvb2t1cCxcbiAgICogeW91IHdpbGwgaGF2ZSB0byBldmljdCB0aGUgdmFsdWUgZnJvbSB0aGUgY2FjaGUgdXNpbmcgdGhlIGBjZGsgY29udGV4dGBcbiAgICogY29tbWFuZC4gU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvbGF0ZXN0L2d1aWRlL2NvbnRleHQuaHRtbCBmb3JcbiAgICogbW9yZSBpbmZvcm1hdGlvbi5cbiAgICpcbiAgICogQ2FuIG5vdCBiZSBzZXQgdG8gYHRydWVgIGluIGVudmlyb25tZW50LWFnbm9zdGljIHN0YWNrcy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGNhY2hlZEluQ29udGV4dD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogQ29uc3RydWN0IGEgTGludXggb3IgV2luZG93cyBtYWNoaW5lIGltYWdlIGZyb20gdGhlIGxhdGVzdCBFQ1MgT3B0aW1pemVkIEFNSSBwdWJsaXNoZWQgaW4gU1NNXG4gKi9cbmV4cG9ydCBjbGFzcyBFY3NPcHRpbWl6ZWRJbWFnZSBpbXBsZW1lbnRzIGVjMi5JTWFjaGluZUltYWdlIHtcbiAgLyoqXG4gICAqIENvbnN0cnVjdCBhbiBBbWF6b24gTGludXggMiBpbWFnZSBmcm9tIHRoZSBsYXRlc3QgRUNTIE9wdGltaXplZCBBTUkgcHVibGlzaGVkIGluIFNTTVxuICAgKlxuICAgKiBAcGFyYW0gaGFyZHdhcmVUeXBlIEVDUy1vcHRpbWl6ZWQgQU1JIHZhcmlhbnQgdG8gdXNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGFtYXpvbkxpbnV4MihoYXJkd2FyZVR5cGUgPSBBbWlIYXJkd2FyZVR5cGUuU1RBTkRBUkQsIG9wdGlvbnM6IEVjc09wdGltaXplZEltYWdlT3B0aW9ucyA9IHt9KTogRWNzT3B0aW1pemVkSW1hZ2Uge1xuICAgIHJldHVybiBuZXcgRWNzT3B0aW1pemVkSW1hZ2Uoe1xuICAgICAgZ2VuZXJhdGlvbjogZWMyLkFtYXpvbkxpbnV4R2VuZXJhdGlvbi5BTUFaT05fTElOVVhfMixcbiAgICAgIGhhcmR3YXJlVHlwZSxcbiAgICAgIGNhY2hlZEluQ29udGV4dDogb3B0aW9ucy5jYWNoZWRJbkNvbnRleHQsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IGFuIEFtYXpvbiBMaW51eCBBTUkgaW1hZ2UgZnJvbSB0aGUgbGF0ZXN0IEVDUyBPcHRpbWl6ZWQgQU1JIHB1Ymxpc2hlZCBpbiBTU01cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgYW1hem9uTGludXgob3B0aW9uczogRWNzT3B0aW1pemVkSW1hZ2VPcHRpb25zID0ge30pOiBFY3NPcHRpbWl6ZWRJbWFnZSB7XG4gICAgcmV0dXJuIG5ldyBFY3NPcHRpbWl6ZWRJbWFnZSh7XG4gICAgICBnZW5lcmF0aW9uOiBlYzIuQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWCxcbiAgICAgIGNhY2hlZEluQ29udGV4dDogb3B0aW9ucy5jYWNoZWRJbkNvbnRleHQsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0IGEgV2luZG93cyBpbWFnZSBmcm9tIHRoZSBsYXRlc3QgRUNTIE9wdGltaXplZCBBTUkgcHVibGlzaGVkIGluIFNTTVxuICAgKlxuICAgKiBAcGFyYW0gd2luZG93c1ZlcnNpb24gV2luZG93cyBWZXJzaW9uIHRvIHVzZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyB3aW5kb3dzKHdpbmRvd3NWZXJzaW9uOiBXaW5kb3dzT3B0aW1pemVkVmVyc2lvbiwgb3B0aW9uczogRWNzT3B0aW1pemVkSW1hZ2VPcHRpb25zID0ge30pOiBFY3NPcHRpbWl6ZWRJbWFnZSB7XG4gICAgcmV0dXJuIG5ldyBFY3NPcHRpbWl6ZWRJbWFnZSh7XG4gICAgICB3aW5kb3dzVmVyc2lvbixcbiAgICAgIGNhY2hlZEluQ29udGV4dDogb3B0aW9ucy5jYWNoZWRJbkNvbnRleHQsXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlYWRvbmx5IGdlbmVyYXRpb24/OiBlYzIuQW1hem9uTGludXhHZW5lcmF0aW9uO1xuICBwcml2YXRlIHJlYWRvbmx5IHdpbmRvd3NWZXJzaW9uPzogV2luZG93c09wdGltaXplZFZlcnNpb247XG4gIHByaXZhdGUgcmVhZG9ubHkgaHdUeXBlPzogQW1pSGFyZHdhcmVUeXBlO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgYW1pUGFyYW1ldGVyTmFtZTogc3RyaW5nO1xuICBwcml2YXRlIHJlYWRvbmx5IGNhY2hlZEluQ29udGV4dDogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ29uc3RydWN0cyBhIG5ldyBpbnN0YW5jZSBvZiB0aGUgRWNzT3B0aW1pemVkQW1pIGNsYXNzLlxuICAgKi9cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcm9wczogRWNzT3B0aW1pemVkQW1pUHJvcHMpIHtcbiAgICB0aGlzLmh3VHlwZSA9IHByb3BzICYmIHByb3BzLmhhcmR3YXJlVHlwZTtcblxuICAgIGlmIChwcm9wcy53aW5kb3dzVmVyc2lvbikge1xuICAgICAgdGhpcy53aW5kb3dzVmVyc2lvbiA9IHByb3BzLndpbmRvd3NWZXJzaW9uO1xuICAgIH0gZWxzZSBpZiAocHJvcHMuZ2VuZXJhdGlvbikge1xuICAgICAgdGhpcy5nZW5lcmF0aW9uID0gcHJvcHMuZ2VuZXJhdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIGVycm9yIHNob3VsZCBuZXZlciBiZSB0aHJvd24nKTtcbiAgICB9XG5cbiAgICAvLyBzZXQgdGhlIFNTTSBwYXJhbWV0ZXIgbmFtZVxuICAgIHRoaXMuYW1pUGFyYW1ldGVyTmFtZSA9ICcvYXdzL3NlcnZpY2UvZWNzL29wdGltaXplZC1hbWkvJ1xuICAgICAgKyAodGhpcy5nZW5lcmF0aW9uID09PSBlYzIuQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWCA/ICdhbWF6b24tbGludXgvJyA6ICcnKVxuICAgICAgKyAodGhpcy5nZW5lcmF0aW9uID09PSBlYzIuQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWF8yID8gJ2FtYXpvbi1saW51eC0yLycgOiAnJylcbiAgICAgICsgKHRoaXMud2luZG93c1ZlcnNpb24gPyBgd2luZG93c19zZXJ2ZXIvJHt0aGlzLndpbmRvd3NWZXJzaW9ufS9lbmdsaXNoL2Z1bGwvYCA6ICcnKVxuICAgICAgKyAodGhpcy5od1R5cGUgPT09IEFtaUhhcmR3YXJlVHlwZS5HUFUgPyAnZ3B1LycgOiAnJylcbiAgICAgICsgKHRoaXMuaHdUeXBlID09PSBBbWlIYXJkd2FyZVR5cGUuQVJNID8gJ2FybTY0LycgOiAnJylcbiAgICAgICsgJ3JlY29tbWVuZGVkL2ltYWdlX2lkJztcblxuICAgIHRoaXMuY2FjaGVkSW5Db250ZXh0ID0gcHJvcHM/LmNhY2hlZEluQ29udGV4dCA/PyBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGNvcnJlY3QgaW1hZ2VcbiAgICovXG4gIHB1YmxpYyBnZXRJbWFnZShzY29wZTogQ29uc3RydWN0KTogZWMyLk1hY2hpbmVJbWFnZUNvbmZpZyB7XG4gICAgY29uc3QgYW1pID0gbG9va3VwSW1hZ2Uoc2NvcGUsIHRoaXMuY2FjaGVkSW5Db250ZXh0LCB0aGlzLmFtaVBhcmFtZXRlck5hbWUpO1xuXG4gICAgY29uc3Qgb3NUeXBlID0gdGhpcy53aW5kb3dzVmVyc2lvbiA/IGVjMi5PcGVyYXRpbmdTeXN0ZW1UeXBlLldJTkRPV1MgOiBlYzIuT3BlcmF0aW5nU3lzdGVtVHlwZS5MSU5VWDtcbiAgICByZXR1cm4ge1xuICAgICAgaW1hZ2VJZDogYW1pLFxuICAgICAgb3NUeXBlLFxuICAgICAgdXNlckRhdGE6IGVjMi5Vc2VyRGF0YS5mb3JPcGVyYXRpbmdTeXN0ZW0ob3NUeXBlKSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQW1hem9uIEVDUyB2YXJpYW50XG4gKi9cbmV4cG9ydCBlbnVtIEJvdHRsZXJvY2tldEVjc1ZhcmlhbnQge1xuICAvKipcbiAgICogYXdzLWVjcy0xIHZhcmlhbnRcbiAgICovXG4gIEFXU19FQ1NfMSA9ICdhd3MtZWNzLTEnXG5cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBCb3R0bGVSb2NrZXRJbWFnZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEJvdHRsZVJvY2tldEltYWdlUHJvcHMge1xuICAvKipcbiAgICogVGhlIEFtYXpvbiBFQ1MgdmFyaWFudCB0byB1c2UuXG4gICAqIE9ubHkgYGF3cy1lY3MtMWAgaXMgY3VycmVudGx5IGF2YWlsYWJsZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEJvdHRsZXJvY2tldEVjc1ZhcmlhbnQuQVdTX0VDU18xXG4gICAqL1xuICByZWFkb25seSB2YXJpYW50PzogQm90dGxlcm9ja2V0RWNzVmFyaWFudDtcblxuICAvKipcbiAgICogVGhlIENQVSBhcmNoaXRlY3R1cmVcbiAgICpcbiAgICogQGRlZmF1bHQgLSB4ODZfNjRcbiAgICovXG4gIHJlYWRvbmx5IGFyY2hpdGVjdHVyZT86IGVjMi5JbnN0YW5jZUFyY2hpdGVjdHVyZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgQU1JIElEIGlzIGNhY2hlZCB0byBiZSBzdGFibGUgYmV0d2VlbiBkZXBsb3ltZW50c1xuICAgKlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgbmV3ZXN0IGltYWdlIGlzIHVzZWQgb24gZWFjaCBkZXBsb3ltZW50LiBUaGlzIHdpbGwgY2F1c2VcbiAgICogaW5zdGFuY2VzIHRvIGJlIHJlcGxhY2VkIHdoZW5ldmVyIGEgbmV3IHZlcnNpb24gaXMgcmVsZWFzZWQsIGFuZCBtYXkgY2F1c2VcbiAgICogZG93bnRpbWUgaWYgdGhlcmUgYXJlbid0IGVub3VnaCBydW5uaW5nIGluc3RhbmNlcyBpbiB0aGUgQXV0b1NjYWxpbmdHcm91cFxuICAgKiB0byByZXNjaGVkdWxlIHRoZSB0YXNrcyBvbi5cbiAgICpcbiAgICogSWYgc2V0IHRvIHRydWUsIHRoZSBBTUkgSUQgd2lsbCBiZSBjYWNoZWQgaW4gYGNkay5jb250ZXh0Lmpzb25gIGFuZCB0aGVcbiAgICogc2FtZSB2YWx1ZSB3aWxsIGJlIHVzZWQgb24gZnV0dXJlIHJ1bnMuIFlvdXIgaW5zdGFuY2VzIHdpbGwgbm90IGJlIHJlcGxhY2VkXG4gICAqIGJ1dCB5b3VyIEFNSSB2ZXJzaW9uIHdpbGwgZ3JvdyBvbGQgb3ZlciB0aW1lLiBUbyByZWZyZXNoIHRoZSBBTUkgbG9va3VwLFxuICAgKiB5b3Ugd2lsbCBoYXZlIHRvIGV2aWN0IHRoZSB2YWx1ZSBmcm9tIHRoZSBjYWNoZSB1c2luZyB0aGUgYGNkayBjb250ZXh0YFxuICAgKiBjb21tYW5kLiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9sYXRlc3QvZ3VpZGUvY29udGV4dC5odG1sIGZvclxuICAgKiBtb3JlIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBDYW4gbm90IGJlIHNldCB0byBgdHJ1ZWAgaW4gZW52aXJvbm1lbnQtYWdub3N0aWMgc3RhY2tzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgY2FjaGVkSW5Db250ZXh0PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBDb25zdHJ1Y3QgYW4gQm90dGxlcm9ja2V0IGltYWdlIGZyb20gdGhlIGxhdGVzdCBBTUkgcHVibGlzaGVkIGluIFNTTVxuICovXG5leHBvcnQgY2xhc3MgQm90dGxlUm9ja2V0SW1hZ2UgaW1wbGVtZW50cyBlYzIuSU1hY2hpbmVJbWFnZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgYW1pUGFyYW1ldGVyTmFtZTogc3RyaW5nO1xuICAvKipcbiAgICogQW1hem9uIEVDUyB2YXJpYW50IGZvciBCb3R0bGVyb2NrZXQgQU1JXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IHZhcmlhbnQ6IHN0cmluZztcblxuICAvKipcbiAgICogSW5zdGFuY2UgYXJjaGl0ZWN0dXJlXG4gICAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGFyY2hpdGVjdHVyZTogZWMyLkluc3RhbmNlQXJjaGl0ZWN0dXJlO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgY2FjaGVkSW5Db250ZXh0OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBCb3R0bGVSb2NrZXRJbWFnZSBjbGFzcy5cbiAgICovXG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcm9wczogQm90dGxlUm9ja2V0SW1hZ2VQcm9wcyA9IHt9KSB7XG4gICAgdGhpcy52YXJpYW50ID0gcHJvcHMudmFyaWFudCA/PyBCb3R0bGVyb2NrZXRFY3NWYXJpYW50LkFXU19FQ1NfMTtcbiAgICB0aGlzLmFyY2hpdGVjdHVyZSA9IHByb3BzLmFyY2hpdGVjdHVyZSA/PyBlYzIuSW5zdGFuY2VBcmNoaXRlY3R1cmUuWDg2XzY0O1xuXG4gICAgLy8gc2V0IHRoZSBTU00gcGFyYW1ldGVyIG5hbWVcbiAgICB0aGlzLmFtaVBhcmFtZXRlck5hbWUgPSBgL2F3cy9zZXJ2aWNlL2JvdHRsZXJvY2tldC8ke3RoaXMudmFyaWFudH0vJHt0aGlzLmFyY2hpdGVjdHVyZX0vbGF0ZXN0L2ltYWdlX2lkYDtcblxuICAgIHRoaXMuY2FjaGVkSW5Db250ZXh0ID0gcHJvcHMuY2FjaGVkSW5Db250ZXh0ID8/IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgY29ycmVjdCBpbWFnZVxuICAgKi9cbiAgcHVibGljIGdldEltYWdlKHNjb3BlOiBDb25zdHJ1Y3QpOiBlYzIuTWFjaGluZUltYWdlQ29uZmlnIHtcbiAgICBjb25zdCBhbWkgPSBsb29rdXBJbWFnZShzY29wZSwgdGhpcy5jYWNoZWRJbkNvbnRleHQsIHRoaXMuYW1pUGFyYW1ldGVyTmFtZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgaW1hZ2VJZDogYW1pLFxuICAgICAgb3NUeXBlOiBlYzIuT3BlcmF0aW5nU3lzdGVtVHlwZS5MSU5VWCxcbiAgICAgIHVzZXJEYXRhOiBlYzIuVXNlckRhdGEuY3VzdG9tKCcnKSxcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGxvb2t1cEltYWdlKHNjb3BlOiBDb25zdHJ1Y3QsIGNhY2hlZEluQ29udGV4dDogYm9vbGVhbiB8IHVuZGVmaW5lZCwgcGFyYW1ldGVyTmFtZTogc3RyaW5nKSB7XG4gIHJldHVybiBjYWNoZWRJbkNvbnRleHRcbiAgICA/IHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGcm9tTG9va3VwKHNjb3BlLCBwYXJhbWV0ZXJOYW1lKVxuICAgIDogc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclR5cGVkU3RyaW5nUGFyYW1ldGVyVjIoc2NvcGUsIHBhcmFtZXRlck5hbWUsIHNzbS5QYXJhbWV0ZXJWYWx1ZVR5cGUuQVdTX0VDMl9JTUFHRV9JRCk7XG59XG4iXX0=