"use strict";
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LookupMachineImage = exports.OperatingSystemType = exports.GenericWindowsImage = exports.GenericLinuxImage = exports.AmazonLinuxStorage = exports.AmazonLinuxVirt = exports.AmazonLinuxEdition = exports.AmazonLinuxKernel = exports.AmazonLinuxGeneration = exports.AmazonLinuxImage = exports.AmazonLinuxCpuType = exports.WindowsImage = exports.GenericSSMParameterImage = exports.MachineImage = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const ssm = require("@aws-cdk/aws-ssm");
const cxschema = require("@aws-cdk/cloud-assembly-schema");
const core_1 = require("@aws-cdk/core");
const user_data_1 = require("./user-data");
const windows_versions_1 = require("./windows-versions");
/**
 * Factory functions for standard Amazon Machine Image objects.
 */
class MachineImage {
    /**
     * A Windows image that is automatically kept up-to-date
     *
     * This Machine Image automatically updates to the latest version on every
     * deployment. Be aware this will cause your instances to be replaced when a
     * new version of the image becomes available. Do not store stateful information
     * on the instance if you are using this image.
     */
    static latestWindows(version, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_WindowsVersion(version);
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_WindowsImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.latestWindows);
            }
            throw error;
        }
        return new WindowsImage(version, props);
    }
    /**
     * An Amazon Linux image that is automatically kept up-to-date
     *
     * This Machine Image automatically updates to the latest version on every
     * deployment. Be aware this will cause your instances to be replaced when a
     * new version of the image becomes available. Do not store stateful information
     * on the instance if you are using this image.
     *
     * N.B.: "latest" in the name of this function indicates that it always uses the most recent
     * image of a particular generation of Amazon Linux, not that it uses the "latest generation".
     * For backwards compatibility, this function uses Amazon Linux 1 if no generation
     * is specified.
     *
     * Specify the desired generation using the `generation` property:
     *
     * ```ts
     * ec2.MachineImage.latestAmazonLinux({
     *   // Use Amazon Linux 2
     *   generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
     * })
     * ```
     */
    static latestAmazonLinux(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_AmazonLinuxImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.latestAmazonLinux);
            }
            throw error;
        }
        return new AmazonLinuxImage(props);
    }
    /**
     * A Linux image where you specify the AMI ID for every region
     *
     * @param amiMap For every region where you are deploying the stack,
     * specify the AMI ID for that region.
     * @param props Customize the image by supplying additional props
     */
    static genericLinux(amiMap, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_GenericLinuxImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.genericLinux);
            }
            throw error;
        }
        return new GenericLinuxImage(amiMap, props);
    }
    /**
     * A Windows image where you specify the AMI ID for every region
     *
     * @param amiMap For every region where you are deploying the stack,
     * specify the AMI ID for that region.
     * @param props Customize the image by supplying additional props
     */
    static genericWindows(amiMap, props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_GenericWindowsImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.genericWindows);
            }
            throw error;
        }
        return new GenericWindowsImage(amiMap, props);
    }
    /**
     * An image specified in SSM parameter store that is automatically kept up-to-date
     *
     * This Machine Image automatically updates to the latest version on every
     * deployment. Be aware this will cause your instances to be replaced when a
     * new version of the image becomes available. Do not store stateful information
     * on the instance if you are using this image.
     *
     * @param parameterName The name of SSM parameter containing the AMi id
     * @param os The operating system type of the AMI
     * @param userData optional user data for the given image
     * @deprecated Use `MachineImage.fromSsmParameter()` instead
     */
    static fromSSMParameter(parameterName, os, userData) {
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-ec2.MachineImage#fromSSMParameter", "Use `MachineImage.fromSsmParameter()` instead");
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_OperatingSystemType(os);
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_UserData(userData);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSSMParameter);
            }
            throw error;
        }
        return new GenericSSMParameterImage(parameterName, os, userData);
    }
    /**
     * An image specified in SSM parameter store
     *
     * By default, the SSM parameter is refreshed at every deployment,
     * causing your instances to be replaced whenever a new version of the AMI
     * is released.
     *
     * Pass `{ cachedInContext: true }` to keep the AMI ID stable. If you do, you
     * will have to remember to periodically invalidate the context to refresh
     * to the newest AMI ID.
     */
    static fromSsmParameter(parameterName, options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_SsmParameterImageOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromSsmParameter);
            }
            throw error;
        }
        return new GenericSsmParameterImage(parameterName, options);
    }
    /**
     * Look up a shared Machine Image using DescribeImages
     *
     * The most recent, available, launchable image matching the given filter
     * criteria will be used. Looking up AMIs may take a long time; specify
     * as many filter criteria as possible to narrow down the search.
     *
     * The AMI selected will be cached in `cdk.context.json` and the same value
     * will be used on future runs. To refresh the AMI lookup, you will have to
     * evict the value from the cache using the `cdk context` command. See
     * https://docs.aws.amazon.com/cdk/latest/guide/context.html for more information.
     *
     * This function can not be used in environment-agnostic stacks.
     */
    static lookup(props) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_LookupMachineImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.lookup);
            }
            throw error;
        }
        return new LookupMachineImage(props);
    }
}
_a = JSII_RTTI_SYMBOL_1;
MachineImage[_a] = { fqn: "@aws-cdk/aws-ec2.MachineImage", version: "0.0.0" };
exports.MachineImage = MachineImage;
/**
 * Select the image based on a given SSM parameter
 *
 * This Machine Image automatically updates to the latest version on every
 * deployment. Be aware this will cause your instances to be replaced when a
 * new version of the image becomes available. Do not store stateful information
 * on the instance if you are using this image.
 *
 * The AMI ID is selected using the values published to the SSM parameter store.
 */
class GenericSSMParameterImage {
    constructor(parameterName, os, userData) {
        this.os = os;
        this.userData = userData;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_OperatingSystemType(os);
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_UserData(userData);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, GenericSSMParameterImage);
            }
            throw error;
        }
        this.parameterName = parameterName;
    }
    /**
     * Return the image to use in the given context
     */
    getImage(scope) {
        const ami = ssm.StringParameter.valueForTypedStringParameterV2(scope, this.parameterName, ssm.ParameterValueType.AWS_EC2_IMAGE_ID);
        return {
            imageId: ami,
            osType: this.os,
            userData: this.userData ?? (this.os === OperatingSystemType.WINDOWS ? user_data_1.UserData.forWindows() : user_data_1.UserData.forLinux()),
        };
    }
}
_b = JSII_RTTI_SYMBOL_1;
GenericSSMParameterImage[_b] = { fqn: "@aws-cdk/aws-ec2.GenericSSMParameterImage", version: "0.0.0" };
exports.GenericSSMParameterImage = GenericSSMParameterImage;
/**
 * Select the image based on a given SSM parameter
 *
 * This Machine Image automatically updates to the latest version on every
 * deployment. Be aware this will cause your instances to be replaced when a
 * new version of the image becomes available. Do not store stateful information
 * on the instance if you are using this image.
 *
 * The AMI ID is selected using the values published to the SSM parameter store.
 */
class GenericSsmParameterImage {
    constructor(parameterName, props = {}) {
        this.parameterName = parameterName;
        this.props = props;
    }
    /**
     * Return the image to use in the given context
     */
    getImage(scope) {
        const imageId = lookupImage(scope, this.props.cachedInContext, this.parameterName);
        const osType = this.props.os ?? OperatingSystemType.LINUX;
        return {
            imageId,
            osType,
            userData: this.props.userData ?? (osType === OperatingSystemType.WINDOWS ? user_data_1.UserData.forWindows() : user_data_1.UserData.forLinux()),
        };
    }
}
/**
 * Select the latest version of the indicated Windows version
 *
 * This Machine Image automatically updates to the latest version on every
 * deployment. Be aware this will cause your instances to be replaced when a
 * new version of the image becomes available. Do not store stateful information
 * on the instance if you are using this image.
 *
 * The AMI ID is selected using the values published to the SSM parameter store.
 *
 * https://aws.amazon.com/blogs/mt/query-for-the-latest-windows-ami-using-systems-manager-parameter-store/
 */
class WindowsImage extends GenericSSMParameterImage {
    constructor(version, props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_WindowsVersion(version);
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_WindowsImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, WindowsImage);
            }
            throw error;
        }
        const nonDeprecatedVersionName = WindowsImage.DEPRECATED_VERSION_NAME_MAP[version] ?? version;
        super('/aws/service/ami-windows-latest/' + nonDeprecatedVersionName, OperatingSystemType.WINDOWS, props.userData);
    }
}
_c = JSII_RTTI_SYMBOL_1;
WindowsImage[_c] = { fqn: "@aws-cdk/aws-ec2.WindowsImage", version: "0.0.0" };
WindowsImage.DEPRECATED_VERSION_NAME_MAP = {
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2016_GERMAL_FULL_BASE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2016_GERMAN_FULL_BASE,
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2012_R2_SP1_PORTUGESE_BRAZIL_64BIT_CORE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2012_R2_SP1_PORTUGUESE_BRAZIL_64BIT_CORE,
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2016_PORTUGESE_PORTUGAL_FULL_BASE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2016_PORTUGUESE_PORTUGAL_FULL_BASE,
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2012_R2_RTM_PORTUGESE_BRAZIL_64BIT_BASE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2012_R2_RTM_PORTUGUESE_BRAZIL_64BIT_BASE,
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2012_R2_RTM_PORTUGESE_PORTUGAL_64BIT_BASE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2012_R2_RTM_PORTUGUESE_PORTUGAL_64BIT_BASE,
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2016_PORTUGESE_BRAZIL_FULL_BASE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2016_PORTUGUESE_BRAZIL_FULL_BASE,
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2012_SP2_PORTUGESE_BRAZIL_64BIT_BASE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2012_SP2_PORTUGUESE_BRAZIL_64BIT_BASE,
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2012_RTM_PORTUGESE_BRAZIL_64BIT_BASE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2012_RTM_PORTUGUESE_BRAZIL_64BIT_BASE,
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2008_R2_SP1_PORTUGESE_BRAZIL_64BIT_BASE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2008_R2_SP1_PORTUGUESE_BRAZIL_64BIT_BASE,
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2008_SP2_PORTUGESE_BRAZIL_32BIT_BASE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2008_SP2_PORTUGUESE_BRAZIL_32BIT_BASE,
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2012_RTM_PORTUGESE_PORTUGAL_64BIT_BASE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2012_RTM_PORTUGUESE_PORTUGAL_64BIT_BASE,
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2019_PORTUGESE_BRAZIL_FULL_BASE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2019_PORTUGUESE_BRAZIL_FULL_BASE,
    [windows_versions_1.WindowsVersion.WINDOWS_SERVER_2019_PORTUGESE_PORTUGAL_FULL_BASE]: windows_versions_1.WindowsVersion.WINDOWS_SERVER_2019_PORTUGUESE_PORTUGAL_FULL_BASE,
};
exports.WindowsImage = WindowsImage;
/**
 * CPU type
 */
var AmazonLinuxCpuType;
(function (AmazonLinuxCpuType) {
    /**
     * arm64 CPU type
     */
    AmazonLinuxCpuType["ARM_64"] = "arm64";
    /**
     * x86_64 CPU type
     */
    AmazonLinuxCpuType["X86_64"] = "x86_64";
})(AmazonLinuxCpuType = exports.AmazonLinuxCpuType || (exports.AmazonLinuxCpuType = {}));
/**
 * Selects the latest version of Amazon Linux
 *
 * This Machine Image automatically updates to the latest version on every
 * deployment. Be aware this will cause your instances to be replaced when a
 * new version of the image becomes available. Do not store stateful information
 * on the instance if you are using this image.
 *
 * The AMI ID is selected using the values published to the SSM parameter store.
 */
class AmazonLinuxImage extends GenericSSMParameterImage {
    /**
     * Return the SSM parameter name that will contain the Amazon Linux image with the given attributes
     */
    static ssmParameterName(props = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_AmazonLinuxImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.ssmParameterName);
            }
            throw error;
        }
        const generation = (props && props.generation) || AmazonLinuxGeneration.AMAZON_LINUX;
        const edition = (props && props.edition) || AmazonLinuxEdition.STANDARD;
        const cpu = (props && props.cpuType) || AmazonLinuxCpuType.X86_64;
        let kernel = (props && props.kernel) || undefined;
        let virtualization;
        let storage;
        if (generation === AmazonLinuxGeneration.AMAZON_LINUX_2022) {
            kernel = AmazonLinuxKernel.KERNEL5_X;
            if (props && props.storage) {
                throw new Error('Storage parameter does not exist in smm parameter name for Amazon Linux 2022.');
            }
            if (props && props.virtualization) {
                throw new Error('Virtualization parameter does not exist in smm parameter name for Amazon Linux 2022.');
            }
        }
        else {
            virtualization = (props && props.virtualization) || AmazonLinuxVirt.HVM;
            storage = (props && props.storage) || AmazonLinuxStorage.GENERAL_PURPOSE;
        }
        const parts = [
            generation,
            'ami',
            edition !== AmazonLinuxEdition.STANDARD ? edition : undefined,
            kernel,
            virtualization,
            cpu,
            storage,
        ].filter(x => x !== undefined); // Get rid of undefineds
        return '/aws/service/ami-amazon-linux-latest/' + parts.join('-');
    }
    constructor(props = {}) {
        super(AmazonLinuxImage.ssmParameterName(props), OperatingSystemType.LINUX, props.userData);
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_AmazonLinuxImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, AmazonLinuxImage);
            }
            throw error;
        }
        this.cachedInContext = props.cachedInContext ?? false;
    }
    /**
     * Return the image to use in the given context
     */
    getImage(scope) {
        const imageId = lookupImage(scope, this.cachedInContext, this.parameterName);
        const osType = OperatingSystemType.LINUX;
        return {
            imageId,
            osType,
            userData: this.props.userData ?? user_data_1.UserData.forLinux(),
        };
    }
}
_d = JSII_RTTI_SYMBOL_1;
AmazonLinuxImage[_d] = { fqn: "@aws-cdk/aws-ec2.AmazonLinuxImage", version: "0.0.0" };
exports.AmazonLinuxImage = AmazonLinuxImage;
/**
 * What generation of Amazon Linux to use
 */
var AmazonLinuxGeneration;
(function (AmazonLinuxGeneration) {
    /**
     * Amazon Linux
     */
    AmazonLinuxGeneration["AMAZON_LINUX"] = "amzn";
    /**
     * Amazon Linux 2
     */
    AmazonLinuxGeneration["AMAZON_LINUX_2"] = "amzn2";
    /**
     * Amazon Linux 2022
     */
    AmazonLinuxGeneration["AMAZON_LINUX_2022"] = "al2022";
})(AmazonLinuxGeneration = exports.AmazonLinuxGeneration || (exports.AmazonLinuxGeneration = {}));
/**
 * Amazon Linux Kernel
 */
var AmazonLinuxKernel;
(function (AmazonLinuxKernel) {
    /**
     * Standard edition
     */
    AmazonLinuxKernel["KERNEL5_X"] = "kernel-5.10";
})(AmazonLinuxKernel = exports.AmazonLinuxKernel || (exports.AmazonLinuxKernel = {}));
/**
 * Amazon Linux edition
 */
var AmazonLinuxEdition;
(function (AmazonLinuxEdition) {
    /**
     * Standard edition
     */
    AmazonLinuxEdition["STANDARD"] = "standard";
    /**
     * Minimal edition
     */
    AmazonLinuxEdition["MINIMAL"] = "minimal";
})(AmazonLinuxEdition = exports.AmazonLinuxEdition || (exports.AmazonLinuxEdition = {}));
/**
 * Virtualization type for Amazon Linux
 */
var AmazonLinuxVirt;
(function (AmazonLinuxVirt) {
    /**
     * HVM virtualization (recommended)
     */
    AmazonLinuxVirt["HVM"] = "hvm";
    /**
     * PV virtualization
     */
    AmazonLinuxVirt["PV"] = "pv";
})(AmazonLinuxVirt = exports.AmazonLinuxVirt || (exports.AmazonLinuxVirt = {}));
var AmazonLinuxStorage;
(function (AmazonLinuxStorage) {
    /**
     * EBS-backed storage
     */
    AmazonLinuxStorage["EBS"] = "ebs";
    /**
     * S3-backed storage
     */
    AmazonLinuxStorage["S3"] = "s3";
    /**
     * General Purpose-based storage (recommended)
     */
    AmazonLinuxStorage["GENERAL_PURPOSE"] = "gp2";
})(AmazonLinuxStorage = exports.AmazonLinuxStorage || (exports.AmazonLinuxStorage = {}));
/**
 * Construct a Linux machine image from an AMI map
 *
 * Linux images IDs are not published to SSM parameter store yet, so you'll have to
 * manually specify an AMI map.
 */
class GenericLinuxImage {
    constructor(amiMap, props = {}) {
        this.amiMap = amiMap;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_GenericLinuxImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, GenericLinuxImage);
            }
            throw error;
        }
    }
    getImage(scope) {
        const userData = this.props.userData ?? user_data_1.UserData.forLinux();
        const osType = OperatingSystemType.LINUX;
        const region = core_1.Stack.of(scope).region;
        if (core_1.Token.isUnresolved(region)) {
            const mapping = {};
            for (const [rgn, ami] of Object.entries(this.amiMap)) {
                mapping[rgn] = { ami };
            }
            const amiMap = new core_1.CfnMapping(scope, 'AmiMap', { mapping });
            return {
                imageId: amiMap.findInMap(core_1.Aws.REGION, 'ami'),
                userData,
                osType,
            };
        }
        const imageId = region !== 'test-region' ? this.amiMap[region] : 'ami-12345';
        if (!imageId) {
            throw new Error(`Unable to find AMI in AMI map: no AMI specified for region '${region}'`);
        }
        return {
            imageId,
            userData,
            osType,
        };
    }
}
_e = JSII_RTTI_SYMBOL_1;
GenericLinuxImage[_e] = { fqn: "@aws-cdk/aws-ec2.GenericLinuxImage", version: "0.0.0" };
exports.GenericLinuxImage = GenericLinuxImage;
/**
 * Construct a Windows machine image from an AMI map
 *
 * Allows you to create a generic Windows EC2 , manually specify an AMI map.
 */
class GenericWindowsImage {
    constructor(amiMap, props = {}) {
        this.amiMap = amiMap;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_GenericWindowsImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, GenericWindowsImage);
            }
            throw error;
        }
    }
    getImage(scope) {
        const userData = this.props.userData ?? user_data_1.UserData.forWindows();
        const osType = OperatingSystemType.WINDOWS;
        const region = core_1.Stack.of(scope).region;
        if (core_1.Token.isUnresolved(region)) {
            const mapping = {};
            for (const [rgn, ami] of Object.entries(this.amiMap)) {
                mapping[rgn] = { ami };
            }
            const amiMap = new core_1.CfnMapping(scope, 'AmiMap', { mapping });
            return {
                imageId: amiMap.findInMap(core_1.Aws.REGION, 'ami'),
                userData,
                osType,
            };
        }
        const imageId = region !== 'test-region' ? this.amiMap[region] : 'ami-12345';
        if (!imageId) {
            throw new Error(`Unable to find AMI in AMI map: no AMI specified for region '${region}'`);
        }
        return {
            imageId,
            userData,
            osType,
        };
    }
}
_f = JSII_RTTI_SYMBOL_1;
GenericWindowsImage[_f] = { fqn: "@aws-cdk/aws-ec2.GenericWindowsImage", version: "0.0.0" };
exports.GenericWindowsImage = GenericWindowsImage;
/**
 * The OS type of a particular image
 */
var OperatingSystemType;
(function (OperatingSystemType) {
    OperatingSystemType[OperatingSystemType["LINUX"] = 0] = "LINUX";
    OperatingSystemType[OperatingSystemType["WINDOWS"] = 1] = "WINDOWS";
    /**
     * Used when the type of the operating system is not known
     * (for example, for imported Auto-Scaling Groups).
     */
    OperatingSystemType[OperatingSystemType["UNKNOWN"] = 2] = "UNKNOWN";
})(OperatingSystemType = exports.OperatingSystemType || (exports.OperatingSystemType = {}));
/**
 * A machine image whose AMI ID will be searched using DescribeImages.
 *
 * The most recent, available, launchable image matching the given filter
 * criteria will be used. Looking up AMIs may take a long time; specify
 * as many filter criteria as possible to narrow down the search.
 *
 * The AMI selected will be cached in `cdk.context.json` and the same value
 * will be used on future runs. To refresh the AMI lookup, you will have to
 * evict the value from the cache using the `cdk context` command. See
 * https://docs.aws.amazon.com/cdk/latest/guide/context.html for more information.
 */
class LookupMachineImage {
    constructor(props) {
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_LookupMachineImageProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LookupMachineImage);
            }
            throw error;
        }
    }
    getImage(scope) {
        // Need to know 'windows' or not before doing the query to return the right
        // osType for the dummy value, so might as well add it to the filter.
        const filters = {
            'name': [this.props.name],
            'state': ['available'],
            'image-type': ['machine'],
            'platform': this.props.windows ? ['windows'] : undefined,
        };
        Object.assign(filters, this.props.filters);
        const value = core_1.ContextProvider.getValue(scope, {
            provider: cxschema.ContextProvider.AMI_PROVIDER,
            props: {
                owners: this.props.owners,
                filters,
            },
            dummyValue: 'ami-1234',
        }).value;
        if (typeof value !== 'string') {
            throw new Error(`Response to AMI lookup invalid, got: ${value}`);
        }
        const osType = this.props.windows ? OperatingSystemType.WINDOWS : OperatingSystemType.LINUX;
        return {
            imageId: value,
            osType,
            userData: this.props.userData ?? user_data_1.UserData.forOperatingSystem(osType),
        };
    }
}
_g = JSII_RTTI_SYMBOL_1;
LookupMachineImage[_g] = { fqn: "@aws-cdk/aws-ec2.LookupMachineImage", version: "0.0.0" };
exports.LookupMachineImage = LookupMachineImage;
function lookupImage(scope, cachedInContext, parameterName) {
    return cachedInContext
        ? ssm.StringParameter.valueFromLookup(scope, parameterName)
        : ssm.StringParameter.valueForTypedStringParameterV2(scope, parameterName, ssm.ParameterValueType.AWS_EC2_IMAGE_ID);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFjaGluZS1pbWFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hY2hpbmUtaW1hZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdDO0FBQ3hDLDJEQUEyRDtBQUMzRCx3Q0FBK0U7QUFHL0UsMkNBQXVDO0FBQ3ZDLHlEQUFvRDtBQVlwRDs7R0FFRztBQUNILE1BQXNCLFlBQVk7SUFDaEM7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBdUIsRUFBRSxLQUF5Qjs7Ozs7Ozs7Ozs7UUFDNUUsT0FBTyxJQUFJLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDekM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BcUJHO0lBQ0ksTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQTZCOzs7Ozs7Ozs7O1FBQzNELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwQztJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBOEIsRUFBRSxLQUE4Qjs7Ozs7Ozs7OztRQUN2RixPQUFPLElBQUksaUJBQWlCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzdDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUE4QixFQUFFLEtBQWdDOzs7Ozs7Ozs7O1FBQzNGLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDL0M7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBcUIsRUFBRSxFQUF1QixFQUFFLFFBQW1COzs7Ozs7Ozs7Ozs7UUFDaEcsT0FBTyxJQUFJLHdCQUF3QixDQUFDLGFBQWEsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDbEU7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksTUFBTSxDQUFDLGdCQUFn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RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUM7UUFFNUYsT0FBTztZQUNMLE9BQU8sRUFBRSxLQUFLO1lBQ2QsTUFBTTtZQUNOLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxvQkFBUSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztTQUNyRSxDQUFDO0tBQ0g7Ozs7QUFuQ1UsZ0RBQWtCO0FBNkUvQixTQUFTLFdBQVcsQ0FBQyxLQUFnQixFQUFFLGVBQW9DLEVBQUUsYUFBcUI7SUFDaEcsT0FBTyxlQUFlO1FBQ3BCLENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDO1FBQzNELENBQUMsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLDhCQUE4QixDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsR0FBRyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDeEgsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHNzbSBmcm9tICdAYXdzLWNkay9hd3Mtc3NtJztcbmltcG9ydCAqIGFzIGN4c2NoZW1hIGZyb20gJ0Bhd3MtY2RrL2Nsb3VkLWFzc2VtYmx5LXNjaGVtYSc7XG5pbXBvcnQgeyBDb250ZXh0UHJvdmlkZXIsIENmbk1hcHBpbmcsIEF3cywgU3RhY2ssIFRva2VuIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgKiBhcyBjeGFwaSBmcm9tICdAYXdzLWNkay9jeC1hcGknO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgeyBVc2VyRGF0YSB9IGZyb20gJy4vdXNlci1kYXRhJztcbmltcG9ydCB7IFdpbmRvd3NWZXJzaW9uIH0gZnJvbSAnLi93aW5kb3dzLXZlcnNpb25zJztcblxuLyoqXG4gKiBJbnRlcmZhY2UgZm9yIGNsYXNzZXMgdGhhdCBjYW4gc2VsZWN0IGFuIGFwcHJvcHJpYXRlIG1hY2hpbmUgaW1hZ2UgdG8gdXNlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSU1hY2hpbmVJbWFnZSB7XG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGltYWdlIHRvIHVzZSBpbiB0aGUgZ2l2ZW4gY29udGV4dFxuICAgKi9cbiAgZ2V0SW1hZ2Uoc2NvcGU6IENvbnN0cnVjdCk6IE1hY2hpbmVJbWFnZUNvbmZpZztcbn1cblxuLyoqXG4gKiBGYWN0b3J5IGZ1bmN0aW9ucyBmb3Igc3RhbmRhcmQgQW1hem9uIE1hY2hpbmUgSW1hZ2Ugb2JqZWN0cy5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE1hY2hpbmVJbWFnZSB7XG4gIC8qKlxuICAgKiBBIFdpbmRvd3MgaW1hZ2UgdGhhdCBpcyBhdXRvbWF0aWNhbGx5IGtlcHQgdXAtdG8tZGF0ZVxuICAgKlxuICAgKiBUaGlzIE1hY2hpbmUgSW1hZ2UgYXV0b21hdGljYWxseSB1cGRhdGVzIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvbiBldmVyeVxuICAgKiBkZXBsb3ltZW50LiBCZSBhd2FyZSB0aGlzIHdpbGwgY2F1c2UgeW91ciBpbnN0YW5jZXMgdG8gYmUgcmVwbGFjZWQgd2hlbiBhXG4gICAqIG5ldyB2ZXJzaW9uIG9mIHRoZSBpbWFnZSBiZWNvbWVzIGF2YWlsYWJsZS4gRG8gbm90IHN0b3JlIHN0YXRlZnVsIGluZm9ybWF0aW9uXG4gICAqIG9uIHRoZSBpbnN0YW5jZSBpZiB5b3UgYXJlIHVzaW5nIHRoaXMgaW1hZ2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxhdGVzdFdpbmRvd3ModmVyc2lvbjogV2luZG93c1ZlcnNpb24sIHByb3BzPzogV2luZG93c0ltYWdlUHJvcHMpOiBJTWFjaGluZUltYWdlIHtcbiAgICByZXR1cm4gbmV3IFdpbmRvd3NJbWFnZSh2ZXJzaW9uLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogQW4gQW1hem9uIExpbnV4IGltYWdlIHRoYXQgaXMgYXV0b21hdGljYWxseSBrZXB0IHVwLXRvLWRhdGVcbiAgICpcbiAgICogVGhpcyBNYWNoaW5lIEltYWdlIGF1dG9tYXRpY2FsbHkgdXBkYXRlcyB0byB0aGUgbGF0ZXN0IHZlcnNpb24gb24gZXZlcnlcbiAgICogZGVwbG95bWVudC4gQmUgYXdhcmUgdGhpcyB3aWxsIGNhdXNlIHlvdXIgaW5zdGFuY2VzIHRvIGJlIHJlcGxhY2VkIHdoZW4gYVxuICAgKiBuZXcgdmVyc2lvbiBvZiB0aGUgaW1hZ2UgYmVjb21lcyBhdmFpbGFibGUuIERvIG5vdCBzdG9yZSBzdGF0ZWZ1bCBpbmZvcm1hdGlvblxuICAgKiBvbiB0aGUgaW5zdGFuY2UgaWYgeW91IGFyZSB1c2luZyB0aGlzIGltYWdlLlxuICAgKlxuICAgKiBOLkIuOiBcImxhdGVzdFwiIGluIHRoZSBuYW1lIG9mIHRoaXMgZnVuY3Rpb24gaW5kaWNhdGVzIHRoYXQgaXQgYWx3YXlzIHVzZXMgdGhlIG1vc3QgcmVjZW50XG4gICAqIGltYWdlIG9mIGEgcGFydGljdWxhciBnZW5lcmF0aW9uIG9mIEFtYXpvbiBMaW51eCwgbm90IHRoYXQgaXQgdXNlcyB0aGUgXCJsYXRlc3QgZ2VuZXJhdGlvblwiLlxuICAgKiBGb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHksIHRoaXMgZnVuY3Rpb24gdXNlcyBBbWF6b24gTGludXggMSBpZiBubyBnZW5lcmF0aW9uXG4gICAqIGlzIHNwZWNpZmllZC5cbiAgICpcbiAgICogU3BlY2lmeSB0aGUgZGVzaXJlZCBnZW5lcmF0aW9uIHVzaW5nIHRoZSBgZ2VuZXJhdGlvbmAgcHJvcGVydHk6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGVjMi5NYWNoaW5lSW1hZ2UubGF0ZXN0QW1hem9uTGludXgoe1xuICAgKiAgIC8vIFVzZSBBbWF6b24gTGludXggMlxuICAgKiAgIGdlbmVyYXRpb246IGVjMi5BbWF6b25MaW51eEdlbmVyYXRpb24uQU1BWk9OX0xJTlVYXzIsXG4gICAqIH0pXG4gICAqIGBgYFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBsYXRlc3RBbWF6b25MaW51eChwcm9wcz86IEFtYXpvbkxpbnV4SW1hZ2VQcm9wcyk6IElNYWNoaW5lSW1hZ2Uge1xuICAgIHJldHVybiBuZXcgQW1hem9uTGludXhJbWFnZShwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogQSBMaW51eCBpbWFnZSB3aGVyZSB5b3Ugc3BlY2lmeSB0aGUgQU1JIElEIGZvciBldmVyeSByZWdpb25cbiAgICpcbiAgICogQHBhcmFtIGFtaU1hcCBGb3IgZXZlcnkgcmVnaW9uIHdoZXJlIHlvdSBhcmUgZGVwbG95aW5nIHRoZSBzdGFjayxcbiAgICogc3BlY2lmeSB0aGUgQU1JIElEIGZvciB0aGF0IHJlZ2lvbi5cbiAgICogQHBhcmFtIHByb3BzIEN1c3RvbWl6ZSB0aGUgaW1hZ2UgYnkgc3VwcGx5aW5nIGFkZGl0aW9uYWwgcHJvcHNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2VuZXJpY0xpbnV4KGFtaU1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiwgcHJvcHM/OiBHZW5lcmljTGludXhJbWFnZVByb3BzKTogSU1hY2hpbmVJbWFnZSB7XG4gICAgcmV0dXJuIG5ldyBHZW5lcmljTGludXhJbWFnZShhbWlNYXAsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIFdpbmRvd3MgaW1hZ2Ugd2hlcmUgeW91IHNwZWNpZnkgdGhlIEFNSSBJRCBmb3IgZXZlcnkgcmVnaW9uXG4gICAqXG4gICAqIEBwYXJhbSBhbWlNYXAgRm9yIGV2ZXJ5IHJlZ2lvbiB3aGVyZSB5b3UgYXJlIGRlcGxveWluZyB0aGUgc3RhY2ssXG4gICAqIHNwZWNpZnkgdGhlIEFNSSBJRCBmb3IgdGhhdCByZWdpb24uXG4gICAqIEBwYXJhbSBwcm9wcyBDdXN0b21pemUgdGhlIGltYWdlIGJ5IHN1cHBseWluZyBhZGRpdGlvbmFsIHByb3BzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGdlbmVyaWNXaW5kb3dzKGFtaU1hcDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiwgcHJvcHM/OiBHZW5lcmljV2luZG93c0ltYWdlUHJvcHMpOiBJTWFjaGluZUltYWdlIHtcbiAgICByZXR1cm4gbmV3IEdlbmVyaWNXaW5kb3dzSW1hZ2UoYW1pTWFwLCBwcm9wcyk7XG4gIH1cblxuICAvKipcbiAgICogQW4gaW1hZ2Ugc3BlY2lmaWVkIGluIFNTTSBwYXJhbWV0ZXIgc3RvcmUgdGhhdCBpcyBhdXRvbWF0aWNhbGx5IGtlcHQgdXAtdG8tZGF0ZVxuICAgKlxuICAgKiBUaGlzIE1hY2hpbmUgSW1hZ2UgYXV0b21hdGljYWxseSB1cGRhdGVzIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvbiBldmVyeVxuICAgKiBkZXBsb3ltZW50LiBCZSBhd2FyZSB0aGlzIHdpbGwgY2F1c2UgeW91ciBpbnN0YW5jZXMgdG8gYmUgcmVwbGFjZWQgd2hlbiBhXG4gICAqIG5ldyB2ZXJzaW9uIG9mIHRoZSBpbWFnZSBiZWNvbWVzIGF2YWlsYWJsZS4gRG8gbm90IHN0b3JlIHN0YXRlZnVsIGluZm9ybWF0aW9uXG4gICAqIG9uIHRoZSBpbnN0YW5jZSBpZiB5b3UgYXJlIHVzaW5nIHRoaXMgaW1hZ2UuXG4gICAqXG4gICAqIEBwYXJhbSBwYXJhbWV0ZXJOYW1lIFRoZSBuYW1lIG9mIFNTTSBwYXJhbWV0ZXIgY29udGFpbmluZyB0aGUgQU1pIGlkXG4gICAqIEBwYXJhbSBvcyBUaGUgb3BlcmF0aW5nIHN5c3RlbSB0eXBlIG9mIHRoZSBBTUlcbiAgICogQHBhcmFtIHVzZXJEYXRhIG9wdGlvbmFsIHVzZXIgZGF0YSBmb3IgdGhlIGdpdmVuIGltYWdlXG4gICAqIEBkZXByZWNhdGVkIFVzZSBgTWFjaGluZUltYWdlLmZyb21Tc21QYXJhbWV0ZXIoKWAgaW5zdGVhZFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tU1NNUGFyYW1ldGVyKHBhcmFtZXRlck5hbWU6IHN0cmluZywgb3M6IE9wZXJhdGluZ1N5c3RlbVR5cGUsIHVzZXJEYXRhPzogVXNlckRhdGEpOiBJTWFjaGluZUltYWdlIHtcbiAgICByZXR1cm4gbmV3IEdlbmVyaWNTU01QYXJhbWV0ZXJJbWFnZShwYXJhbWV0ZXJOYW1lLCBvcywgdXNlckRhdGEpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFuIGltYWdlIHNwZWNpZmllZCBpbiBTU00gcGFyYW1ldGVyIHN0b3JlXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSBTU00gcGFyYW1ldGVyIGlzIHJlZnJlc2hlZCBhdCBldmVyeSBkZXBsb3ltZW50LFxuICAgKiBjYXVzaW5nIHlvdXIgaW5zdGFuY2VzIHRvIGJlIHJlcGxhY2VkIHdoZW5ldmVyIGEgbmV3IHZlcnNpb24gb2YgdGhlIEFNSVxuICAgKiBpcyByZWxlYXNlZC5cbiAgICpcbiAgICogUGFzcyBgeyBjYWNoZWRJbkNvbnRleHQ6IHRydWUgfWAgdG8ga2VlcCB0aGUgQU1JIElEIHN0YWJsZS4gSWYgeW91IGRvLCB5b3VcbiAgICogd2lsbCBoYXZlIHRvIHJlbWVtYmVyIHRvIHBlcmlvZGljYWxseSBpbnZhbGlkYXRlIHRoZSBjb250ZXh0IHRvIHJlZnJlc2hcbiAgICogdG8gdGhlIG5ld2VzdCBBTUkgSUQuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Tc21QYXJhbWV0ZXIocGFyYW1ldGVyTmFtZTogc3RyaW5nLCBvcHRpb25zPzogU3NtUGFyYW1ldGVySW1hZ2VPcHRpb25zKTogSU1hY2hpbmVJbWFnZSB7XG4gICAgcmV0dXJuIG5ldyBHZW5lcmljU3NtUGFyYW1ldGVySW1hZ2UocGFyYW1ldGVyTmFtZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogTG9vayB1cCBhIHNoYXJlZCBNYWNoaW5lIEltYWdlIHVzaW5nIERlc2NyaWJlSW1hZ2VzXG4gICAqXG4gICAqIFRoZSBtb3N0IHJlY2VudCwgYXZhaWxhYmxlLCBsYXVuY2hhYmxlIGltYWdlIG1hdGNoaW5nIHRoZSBnaXZlbiBmaWx0ZXJcbiAgICogY3JpdGVyaWEgd2lsbCBiZSB1c2VkLiBMb29raW5nIHVwIEFNSXMgbWF5IHRha2UgYSBsb25nIHRpbWU7IHNwZWNpZnlcbiAgICogYXMgbWFueSBmaWx0ZXIgY3JpdGVyaWEgYXMgcG9zc2libGUgdG8gbmFycm93IGRvd24gdGhlIHNlYXJjaC5cbiAgICpcbiAgICogVGhlIEFNSSBzZWxlY3RlZCB3aWxsIGJlIGNhY2hlZCBpbiBgY2RrLmNvbnRleHQuanNvbmAgYW5kIHRoZSBzYW1lIHZhbHVlXG4gICAqIHdpbGwgYmUgdXNlZCBvbiBmdXR1cmUgcnVucy4gVG8gcmVmcmVzaCB0aGUgQU1JIGxvb2t1cCwgeW91IHdpbGwgaGF2ZSB0b1xuICAgKiBldmljdCB0aGUgdmFsdWUgZnJvbSB0aGUgY2FjaGUgdXNpbmcgdGhlIGBjZGsgY29udGV4dGAgY29tbWFuZC4gU2VlXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvbGF0ZXN0L2d1aWRlL2NvbnRleHQuaHRtbCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAgICpcbiAgICogVGhpcyBmdW5jdGlvbiBjYW4gbm90IGJlIHVzZWQgaW4gZW52aXJvbm1lbnQtYWdub3N0aWMgc3RhY2tzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBsb29rdXAocHJvcHM6IExvb2t1cE1hY2hpbmVJbWFnZVByb3BzKTogSU1hY2hpbmVJbWFnZSB7XG4gICAgcmV0dXJuIG5ldyBMb29rdXBNYWNoaW5lSW1hZ2UocHJvcHMpO1xuICB9XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBmb3IgYSBtYWNoaW5lIGltYWdlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTWFjaGluZUltYWdlQ29uZmlnIHtcbiAgLyoqXG4gICAqIFRoZSBBTUkgSUQgb2YgdGhlIGltYWdlIHRvIHVzZVxuICAgKi9cbiAgcmVhZG9ubHkgaW1hZ2VJZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBPcGVyYXRpbmcgc3lzdGVtIHR5cGUgZm9yIHRoaXMgaW1hZ2VcbiAgICovXG4gIHJlYWRvbmx5IG9zVHlwZTogT3BlcmF0aW5nU3lzdGVtVHlwZTtcblxuICAvKipcbiAgICogSW5pdGlhbCBVc2VyRGF0YSBmb3IgdGhpcyBpbWFnZVxuICAgKi9cbiAgcmVhZG9ubHkgdXNlckRhdGE6IFVzZXJEYXRhO1xufVxuXG4vKipcbiAqIFNlbGVjdCB0aGUgaW1hZ2UgYmFzZWQgb24gYSBnaXZlbiBTU00gcGFyYW1ldGVyXG4gKlxuICogVGhpcyBNYWNoaW5lIEltYWdlIGF1dG9tYXRpY2FsbHkgdXBkYXRlcyB0byB0aGUgbGF0ZXN0IHZlcnNpb24gb24gZXZlcnlcbiAqIGRlcGxveW1lbnQuIEJlIGF3YXJlIHRoaXMgd2lsbCBjYXVzZSB5b3VyIGluc3RhbmNlcyB0byBiZSByZXBsYWNlZCB3aGVuIGFcbiAqIG5ldyB2ZXJzaW9uIG9mIHRoZSBpbWFnZSBiZWNvbWVzIGF2YWlsYWJsZS4gRG8gbm90IHN0b3JlIHN0YXRlZnVsIGluZm9ybWF0aW9uXG4gKiBvbiB0aGUgaW5zdGFuY2UgaWYgeW91IGFyZSB1c2luZyB0aGlzIGltYWdlLlxuICpcbiAqIFRoZSBBTUkgSUQgaXMgc2VsZWN0ZWQgdXNpbmcgdGhlIHZhbHVlcyBwdWJsaXNoZWQgdG8gdGhlIFNTTSBwYXJhbWV0ZXIgc3RvcmUuXG4gKi9cbmV4cG9ydCBjbGFzcyBHZW5lcmljU1NNUGFyYW1ldGVySW1hZ2UgaW1wbGVtZW50cyBJTWFjaGluZUltYWdlIHtcbiAgLy8gRklYTUU6IHRoaXMgY2xhc3Mgb3VnaHQgdG8gYmUgYEBkZXByZWNhdGVkYCBhbmQgcmVtb3ZlZCBmcm9tIHYyLCBidXQgdGhhdFxuICAvLyBpcyBjYXVzaW5nIGJ1aWxkIGZhaWx1cmUgcmlnaHQgbm93LiBSZWY6IGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvanNpaS9pc3N1ZXMvMzAyNVxuICAvLyBALWRlcHJlY2F0ZWQgVXNlIGBNYWNoaW5lSW1hZ2UuZnJvbVNzbVBhcmFtZXRlcigpYCBpbnN0ZWFkXG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIFNTTSBwYXJhbWV0ZXIgd2UncmUgbG9va2luZyB1cFxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHBhcmFtZXRlck5hbWU6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihwYXJhbWV0ZXJOYW1lOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgb3M6IE9wZXJhdGluZ1N5c3RlbVR5cGUsIHByaXZhdGUgcmVhZG9ubHkgdXNlckRhdGE/OiBVc2VyRGF0YSkge1xuICAgIHRoaXMucGFyYW1ldGVyTmFtZSA9IHBhcmFtZXRlck5hbWU7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBpbWFnZSB0byB1c2UgaW4gdGhlIGdpdmVuIGNvbnRleHRcbiAgICovXG4gIHB1YmxpYyBnZXRJbWFnZShzY29wZTogQ29uc3RydWN0KTogTWFjaGluZUltYWdlQ29uZmlnIHtcbiAgICBjb25zdCBhbWkgPSBzc20uU3RyaW5nUGFyYW1ldGVyLnZhbHVlRm9yVHlwZWRTdHJpbmdQYXJhbWV0ZXJWMihzY29wZSwgdGhpcy5wYXJhbWV0ZXJOYW1lLCBzc20uUGFyYW1ldGVyVmFsdWVUeXBlLkFXU19FQzJfSU1BR0VfSUQpO1xuICAgIHJldHVybiB7XG4gICAgICBpbWFnZUlkOiBhbWksXG4gICAgICBvc1R5cGU6IHRoaXMub3MsXG4gICAgICB1c2VyRGF0YTogdGhpcy51c2VyRGF0YSA/PyAodGhpcy5vcyA9PT0gT3BlcmF0aW5nU3lzdGVtVHlwZS5XSU5ET1dTID8gVXNlckRhdGEuZm9yV2luZG93cygpIDogVXNlckRhdGEuZm9yTGludXgoKSksXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIEdlbmVyaWNTc21QYXJhbWV0ZXJJbWFnZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNzbVBhcmFtZXRlckltYWdlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBPcGVyYXRpbmcgc3lzdGVtXG4gICAqXG4gICAqIEBkZWZhdWx0IE9wZXJhdGluZ1N5c3RlbVR5cGUuTElOVVhcbiAgICovXG4gIHJlYWRvbmx5IG9zPzogT3BlcmF0aW5nU3lzdGVtVHlwZTtcblxuICAvKipcbiAgICogQ3VzdG9tIFVzZXJEYXRhXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gVXNlckRhdGEgYXBwcm9wcmlhdGUgZm9yIHRoZSBPU1xuICAgKi9cbiAgcmVhZG9ubHkgdXNlckRhdGE/OiBVc2VyRGF0YTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgQU1JIElEIGlzIGNhY2hlZCB0byBiZSBzdGFibGUgYmV0d2VlbiBkZXBsb3ltZW50c1xuICAgKlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgbmV3ZXN0IGltYWdlIGlzIHVzZWQgb24gZWFjaCBkZXBsb3ltZW50LiBUaGlzIHdpbGwgY2F1c2VcbiAgICogaW5zdGFuY2VzIHRvIGJlIHJlcGxhY2VkIHdoZW5ldmVyIGEgbmV3IHZlcnNpb24gaXMgcmVsZWFzZWQsIGFuZCBtYXkgY2F1c2VcbiAgICogZG93bnRpbWUgaWYgdGhlcmUgYXJlbid0IGVub3VnaCBydW5uaW5nIGluc3RhbmNlcyBpbiB0aGUgQXV0b1NjYWxpbmdHcm91cFxuICAgKiB0byByZXNjaGVkdWxlIHRoZSB0YXNrcyBvbi5cbiAgICpcbiAgICogSWYgc2V0IHRvIHRydWUsIHRoZSBBTUkgSUQgd2lsbCBiZSBjYWNoZWQgaW4gYGNkay5jb250ZXh0Lmpzb25gIGFuZCB0aGVcbiAgICogc2FtZSB2YWx1ZSB3aWxsIGJlIHVzZWQgb24gZnV0dXJlIHJ1bnMuIFlvdXIgaW5zdGFuY2VzIHdpbGwgbm90IGJlIHJlcGxhY2VkXG4gICAqIGJ1dCB5b3VyIEFNSSB2ZXJzaW9uIHdpbGwgZ3JvdyBvbGQgb3ZlciB0aW1lLiBUbyByZWZyZXNoIHRoZSBBTUkgbG9va3VwLFxuICAgKiB5b3Ugd2lsbCBoYXZlIHRvIGV2aWN0IHRoZSB2YWx1ZSBmcm9tIHRoZSBjYWNoZSB1c2luZyB0aGUgYGNkayBjb250ZXh0YFxuICAgKiBjb21tYW5kLiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9sYXRlc3QvZ3VpZGUvY29udGV4dC5odG1sIGZvclxuICAgKiBtb3JlIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBDYW4gbm90IGJlIHNldCB0byBgdHJ1ZWAgaW4gZW52aXJvbm1lbnQtYWdub3N0aWMgc3RhY2tzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgY2FjaGVkSW5Db250ZXh0PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBTZWxlY3QgdGhlIGltYWdlIGJhc2VkIG9uIGEgZ2l2ZW4gU1NNIHBhcmFtZXRlclxuICpcbiAqIFRoaXMgTWFjaGluZSBJbWFnZSBhdXRvbWF0aWNhbGx5IHVwZGF0ZXMgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIG9uIGV2ZXJ5XG4gKiBkZXBsb3ltZW50LiBCZSBhd2FyZSB0aGlzIHdpbGwgY2F1c2UgeW91ciBpbnN0YW5jZXMgdG8gYmUgcmVwbGFjZWQgd2hlbiBhXG4gKiBuZXcgdmVyc2lvbiBvZiB0aGUgaW1hZ2UgYmVjb21lcyBhdmFpbGFibGUuIERvIG5vdCBzdG9yZSBzdGF0ZWZ1bCBpbmZvcm1hdGlvblxuICogb24gdGhlIGluc3RhbmNlIGlmIHlvdSBhcmUgdXNpbmcgdGhpcyBpbWFnZS5cbiAqXG4gKiBUaGUgQU1JIElEIGlzIHNlbGVjdGVkIHVzaW5nIHRoZSB2YWx1ZXMgcHVibGlzaGVkIHRvIHRoZSBTU00gcGFyYW1ldGVyIHN0b3JlLlxuICovXG5jbGFzcyBHZW5lcmljU3NtUGFyYW1ldGVySW1hZ2UgaW1wbGVtZW50cyBJTWFjaGluZUltYWdlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwYXJhbWV0ZXJOYW1lOiBzdHJpbmcsIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IFNzbVBhcmFtZXRlckltYWdlT3B0aW9ucyA9IHt9KSB7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBpbWFnZSB0byB1c2UgaW4gdGhlIGdpdmVuIGNvbnRleHRcbiAgICovXG4gIHB1YmxpYyBnZXRJbWFnZShzY29wZTogQ29uc3RydWN0KTogTWFjaGluZUltYWdlQ29uZmlnIHtcbiAgICBjb25zdCBpbWFnZUlkID0gbG9va3VwSW1hZ2Uoc2NvcGUsIHRoaXMucHJvcHMuY2FjaGVkSW5Db250ZXh0LCB0aGlzLnBhcmFtZXRlck5hbWUpO1xuXG4gICAgY29uc3Qgb3NUeXBlID0gdGhpcy5wcm9wcy5vcyA/PyBPcGVyYXRpbmdTeXN0ZW1UeXBlLkxJTlVYO1xuICAgIHJldHVybiB7XG4gICAgICBpbWFnZUlkLFxuICAgICAgb3NUeXBlLFxuICAgICAgdXNlckRhdGE6IHRoaXMucHJvcHMudXNlckRhdGEgPz8gKG9zVHlwZSA9PT0gT3BlcmF0aW5nU3lzdGVtVHlwZS5XSU5ET1dTID8gVXNlckRhdGEuZm9yV2luZG93cygpIDogVXNlckRhdGEuZm9yTGludXgoKSksXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgV2luZG93c0ltYWdlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgV2luZG93c0ltYWdlUHJvcHMge1xuICAvKipcbiAgICogSW5pdGlhbCB1c2VyIGRhdGFcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFbXB0eSBVc2VyRGF0YSBmb3IgV2luZG93cyBtYWNoaW5lc1xuICAgKi9cbiAgcmVhZG9ubHkgdXNlckRhdGE/OiBVc2VyRGF0YTtcbn1cblxuLyoqXG4gKiBTZWxlY3QgdGhlIGxhdGVzdCB2ZXJzaW9uIG9mIHRoZSBpbmRpY2F0ZWQgV2luZG93cyB2ZXJzaW9uXG4gKlxuICogVGhpcyBNYWNoaW5lIEltYWdlIGF1dG9tYXRpY2FsbHkgdXBkYXRlcyB0byB0aGUgbGF0ZXN0IHZlcnNpb24gb24gZXZlcnlcbiAqIGRlcGxveW1lbnQuIEJlIGF3YXJlIHRoaXMgd2lsbCBjYXVzZSB5b3VyIGluc3RhbmNlcyB0byBiZSByZXBsYWNlZCB3aGVuIGFcbiAqIG5ldyB2ZXJzaW9uIG9mIHRoZSBpbWFnZSBiZWNvbWVzIGF2YWlsYWJsZS4gRG8gbm90IHN0b3JlIHN0YXRlZnVsIGluZm9ybWF0aW9uXG4gKiBvbiB0aGUgaW5zdGFuY2UgaWYgeW91IGFyZSB1c2luZyB0aGlzIGltYWdlLlxuICpcbiAqIFRoZSBBTUkgSUQgaXMgc2VsZWN0ZWQgdXNpbmcgdGhlIHZhbHVlcyBwdWJsaXNoZWQgdG8gdGhlIFNTTSBwYXJhbWV0ZXIgc3RvcmUuXG4gKlxuICogaHR0cHM6Ly9hd3MuYW1hem9uLmNvbS9ibG9ncy9tdC9xdWVyeS1mb3ItdGhlLWxhdGVzdC13aW5kb3dzLWFtaS11c2luZy1zeXN0ZW1zLW1hbmFnZXItcGFyYW1ldGVyLXN0b3JlL1xuICovXG5leHBvcnQgY2xhc3MgV2luZG93c0ltYWdlIGV4dGVuZHMgR2VuZXJpY1NTTVBhcmFtZXRlckltYWdlIHtcbiAgcHJpdmF0ZSBzdGF0aWMgREVQUkVDQVRFRF9WRVJTSU9OX05BTUVfTUFQOiBQYXJ0aWFsPFJlY29yZDxXaW5kb3dzVmVyc2lvbiwgV2luZG93c1ZlcnNpb24+PiA9IHtcbiAgICBbV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxNl9HRVJNQUxfRlVMTF9CQVNFXTogV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxNl9HRVJNQU5fRlVMTF9CQVNFLFxuICAgIFtXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDEyX1IyX1NQMV9QT1JUVUdFU0VfQlJBWklMXzY0QklUX0NPUkVdOiBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDEyX1IyX1NQMV9QT1JUVUdVRVNFX0JSQVpJTF82NEJJVF9DT1JFLFxuICAgIFtXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDE2X1BPUlRVR0VTRV9QT1JUVUdBTF9GVUxMX0JBU0VdOiBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDE2X1BPUlRVR1VFU0VfUE9SVFVHQUxfRlVMTF9CQVNFLFxuICAgIFtXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDEyX1IyX1JUTV9QT1JUVUdFU0VfQlJBWklMXzY0QklUX0JBU0VdOiBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDEyX1IyX1JUTV9QT1JUVUdVRVNFX0JSQVpJTF82NEJJVF9CQVNFLFxuICAgIFtXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDEyX1IyX1JUTV9QT1JUVUdFU0VfUE9SVFVHQUxfNjRCSVRfQkFTRV06XG4gICAgICBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDEyX1IyX1JUTV9QT1JUVUdVRVNFX1BPUlRVR0FMXzY0QklUX0JBU0UsXG4gICAgW1dpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTZfUE9SVFVHRVNFX0JSQVpJTF9GVUxMX0JBU0VdOiBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDE2X1BPUlRVR1VFU0VfQlJBWklMX0ZVTExfQkFTRSxcbiAgICBbV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxMl9TUDJfUE9SVFVHRVNFX0JSQVpJTF82NEJJVF9CQVNFXTogV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxMl9TUDJfUE9SVFVHVUVTRV9CUkFaSUxfNjRCSVRfQkFTRSxcbiAgICBbV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxMl9SVE1fUE9SVFVHRVNFX0JSQVpJTF82NEJJVF9CQVNFXTogV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxMl9SVE1fUE9SVFVHVUVTRV9CUkFaSUxfNjRCSVRfQkFTRSxcbiAgICBbV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAwOF9SMl9TUDFfUE9SVFVHRVNFX0JSQVpJTF82NEJJVF9CQVNFXTogV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAwOF9SMl9TUDFfUE9SVFVHVUVTRV9CUkFaSUxfNjRCSVRfQkFTRSxcbiAgICBbV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAwOF9TUDJfUE9SVFVHRVNFX0JSQVpJTF8zMkJJVF9CQVNFXTogV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAwOF9TUDJfUE9SVFVHVUVTRV9CUkFaSUxfMzJCSVRfQkFTRSxcbiAgICBbV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxMl9SVE1fUE9SVFVHRVNFX1BPUlRVR0FMXzY0QklUX0JBU0VdOiBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDEyX1JUTV9QT1JUVUdVRVNFX1BPUlRVR0FMXzY0QklUX0JBU0UsXG4gICAgW1dpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTlfUE9SVFVHRVNFX0JSQVpJTF9GVUxMX0JBU0VdOiBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDE5X1BPUlRVR1VFU0VfQlJBWklMX0ZVTExfQkFTRSxcbiAgICBbV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxOV9QT1JUVUdFU0VfUE9SVFVHQUxfRlVMTF9CQVNFXTogV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxOV9QT1JUVUdVRVNFX1BPUlRVR0FMX0ZVTExfQkFTRSxcbiAgfVxuICBjb25zdHJ1Y3Rvcih2ZXJzaW9uOiBXaW5kb3dzVmVyc2lvbiwgcHJvcHM6IFdpbmRvd3NJbWFnZVByb3BzID0ge30pIHtcbiAgICBjb25zdCBub25EZXByZWNhdGVkVmVyc2lvbk5hbWUgPSBXaW5kb3dzSW1hZ2UuREVQUkVDQVRFRF9WRVJTSU9OX05BTUVfTUFQW3ZlcnNpb25dID8/IHZlcnNpb247XG4gICAgc3VwZXIoJy9hd3Mvc2VydmljZS9hbWktd2luZG93cy1sYXRlc3QvJyArIG5vbkRlcHJlY2F0ZWRWZXJzaW9uTmFtZSwgT3BlcmF0aW5nU3lzdGVtVHlwZS5XSU5ET1dTLCBwcm9wcy51c2VyRGF0YSk7XG4gIH1cbn1cblxuLyoqXG4gKiBDUFUgdHlwZVxuICovXG5leHBvcnQgZW51bSBBbWF6b25MaW51eENwdVR5cGUge1xuICAvKipcbiAgICogYXJtNjQgQ1BVIHR5cGVcbiAgICovXG4gIEFSTV82NCA9ICdhcm02NCcsXG5cbiAgLyoqXG4gICAqIHg4Nl82NCBDUFUgdHlwZVxuICAgKi9cbiAgWDg2XzY0ID0gJ3g4Nl82NCcsXG59XG5cbi8qKlxuICogQW1hem9uIExpbnV4IGltYWdlIHByb3BlcnRpZXNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBbWF6b25MaW51eEltYWdlUHJvcHMge1xuICAvKipcbiAgICogV2hhdCBnZW5lcmF0aW9uIG9mIEFtYXpvbiBMaW51eCB0byB1c2VcbiAgICpcbiAgICogQGRlZmF1bHQgQW1hem9uTGludXhcbiAgICovXG4gIHJlYWRvbmx5IGdlbmVyYXRpb24/OiBBbWF6b25MaW51eEdlbmVyYXRpb247XG5cbiAgLyoqXG4gICAqIFdoYXQgZWRpdGlvbiBvZiBBbWF6b24gTGludXggdG8gdXNlXG4gICAqXG4gICAqIEBkZWZhdWx0IFN0YW5kYXJkXG4gICAqL1xuICByZWFkb25seSBlZGl0aW9uPzogQW1hem9uTGludXhFZGl0aW9uO1xuXG4gIC8qKlxuICAgKiBXaGF0IGtlcm5lbCB2ZXJzaW9uIG9mIEFtYXpvbiBMaW51eCB0byB1c2VcbiAgICpcbiAgICogQGRlZmF1bHQgLVxuICAgKi9cbiAgcmVhZG9ubHkga2VybmVsPzogQW1hem9uTGludXhLZXJuZWw7XG5cbiAgLyoqXG4gICAqIFZpcnR1YWxpemF0aW9uIHR5cGVcbiAgICpcbiAgICogQGRlZmF1bHQgSFZNXG4gICAqL1xuICByZWFkb25seSB2aXJ0dWFsaXphdGlvbj86IEFtYXpvbkxpbnV4VmlydDtcblxuICAvKipcbiAgICogV2hhdCBzdG9yYWdlIGJhY2tlZCBpbWFnZSB0byB1c2VcbiAgICpcbiAgICogQGRlZmF1bHQgR2VuZXJhbFB1cnBvc2VcbiAgICovXG4gIHJlYWRvbmx5IHN0b3JhZ2U/OiBBbWF6b25MaW51eFN0b3JhZ2U7XG5cbiAgLyoqXG4gICAqIEluaXRpYWwgdXNlciBkYXRhXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRW1wdHkgVXNlckRhdGEgZm9yIExpbnV4IG1hY2hpbmVzXG4gICAqL1xuICByZWFkb25seSB1c2VyRGF0YT86IFVzZXJEYXRhO1xuXG4gIC8qKlxuICAgKiBDUFUgVHlwZVxuICAgKlxuICAgKiBAZGVmYXVsdCBYODZfNjRcbiAgICovXG4gIHJlYWRvbmx5IGNwdVR5cGU/OiBBbWF6b25MaW51eENwdVR5cGU7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIEFNSSBJRCBpcyBjYWNoZWQgdG8gYmUgc3RhYmxlIGJldHdlZW4gZGVwbG95bWVudHNcbiAgICpcbiAgICogQnkgZGVmYXVsdCwgdGhlIG5ld2VzdCBpbWFnZSBpcyB1c2VkIG9uIGVhY2ggZGVwbG95bWVudC4gVGhpcyB3aWxsIGNhdXNlXG4gICAqIGluc3RhbmNlcyB0byBiZSByZXBsYWNlZCB3aGVuZXZlciBhIG5ldyB2ZXJzaW9uIGlzIHJlbGVhc2VkLCBhbmQgbWF5IGNhdXNlXG4gICAqIGRvd250aW1lIGlmIHRoZXJlIGFyZW4ndCBlbm91Z2ggcnVubmluZyBpbnN0YW5jZXMgaW4gdGhlIEF1dG9TY2FsaW5nR3JvdXBcbiAgICogdG8gcmVzY2hlZHVsZSB0aGUgdGFza3Mgb24uXG4gICAqXG4gICAqIElmIHNldCB0byB0cnVlLCB0aGUgQU1JIElEIHdpbGwgYmUgY2FjaGVkIGluIGBjZGsuY29udGV4dC5qc29uYCBhbmQgdGhlXG4gICAqIHNhbWUgdmFsdWUgd2lsbCBiZSB1c2VkIG9uIGZ1dHVyZSBydW5zLiBZb3VyIGluc3RhbmNlcyB3aWxsIG5vdCBiZSByZXBsYWNlZFxuICAgKiBidXQgeW91ciBBTUkgdmVyc2lvbiB3aWxsIGdyb3cgb2xkIG92ZXIgdGltZS4gVG8gcmVmcmVzaCB0aGUgQU1JIGxvb2t1cCxcbiAgICogeW91IHdpbGwgaGF2ZSB0byBldmljdCB0aGUgdmFsdWUgZnJvbSB0aGUgY2FjaGUgdXNpbmcgdGhlIGBjZGsgY29udGV4dGBcbiAgICogY29tbWFuZC4gU2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvbGF0ZXN0L2d1aWRlL2NvbnRleHQuaHRtbCBmb3JcbiAgICogbW9yZSBpbmZvcm1hdGlvbi5cbiAgICpcbiAgICogQ2FuIG5vdCBiZSBzZXQgdG8gYHRydWVgIGluIGVudmlyb25tZW50LWFnbm9zdGljIHN0YWNrcy5cbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGNhY2hlZEluQ29udGV4dD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogU2VsZWN0cyB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgQW1hem9uIExpbnV4XG4gKlxuICogVGhpcyBNYWNoaW5lIEltYWdlIGF1dG9tYXRpY2FsbHkgdXBkYXRlcyB0byB0aGUgbGF0ZXN0IHZlcnNpb24gb24gZXZlcnlcbiAqIGRlcGxveW1lbnQuIEJlIGF3YXJlIHRoaXMgd2lsbCBjYXVzZSB5b3VyIGluc3RhbmNlcyB0byBiZSByZXBsYWNlZCB3aGVuIGFcbiAqIG5ldyB2ZXJzaW9uIG9mIHRoZSBpbWFnZSBiZWNvbWVzIGF2YWlsYWJsZS4gRG8gbm90IHN0b3JlIHN0YXRlZnVsIGluZm9ybWF0aW9uXG4gKiBvbiB0aGUgaW5zdGFuY2UgaWYgeW91IGFyZSB1c2luZyB0aGlzIGltYWdlLlxuICpcbiAqIFRoZSBBTUkgSUQgaXMgc2VsZWN0ZWQgdXNpbmcgdGhlIHZhbHVlcyBwdWJsaXNoZWQgdG8gdGhlIFNTTSBwYXJhbWV0ZXIgc3RvcmUuXG4gKi9cbmV4cG9ydCBjbGFzcyBBbWF6b25MaW51eEltYWdlIGV4dGVuZHMgR2VuZXJpY1NTTVBhcmFtZXRlckltYWdlIHtcbiAgLyoqXG4gICAqIFJldHVybiB0aGUgU1NNIHBhcmFtZXRlciBuYW1lIHRoYXQgd2lsbCBjb250YWluIHRoZSBBbWF6b24gTGludXggaW1hZ2Ugd2l0aCB0aGUgZ2l2ZW4gYXR0cmlidXRlc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBzc21QYXJhbWV0ZXJOYW1lKHByb3BzOiBBbWF6b25MaW51eEltYWdlUHJvcHMgPSB7fSkge1xuICAgIGNvbnN0IGdlbmVyYXRpb24gPSAocHJvcHMgJiYgcHJvcHMuZ2VuZXJhdGlvbikgfHwgQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWDtcbiAgICBjb25zdCBlZGl0aW9uID0gKHByb3BzICYmIHByb3BzLmVkaXRpb24pIHx8IEFtYXpvbkxpbnV4RWRpdGlvbi5TVEFOREFSRDtcbiAgICBjb25zdCBjcHUgPSAocHJvcHMgJiYgcHJvcHMuY3B1VHlwZSkgfHwgQW1hem9uTGludXhDcHVUeXBlLlg4Nl82NDtcbiAgICBsZXQga2VybmVsID0gKHByb3BzICYmIHByb3BzLmtlcm5lbCkgfHwgdW5kZWZpbmVkO1xuICAgIGxldCB2aXJ0dWFsaXphdGlvbjogQW1hem9uTGludXhWaXJ0IHwgdW5kZWZpbmVkO1xuICAgIGxldCBzdG9yYWdlOiBBbWF6b25MaW51eFN0b3JhZ2UgfCB1bmRlZmluZWQ7XG5cbiAgICBpZiAoZ2VuZXJhdGlvbiA9PT0gQW1hem9uTGludXhHZW5lcmF0aW9uLkFNQVpPTl9MSU5VWF8yMDIyKSB7XG4gICAgICBrZXJuZWwgPSBBbWF6b25MaW51eEtlcm5lbC5LRVJORUw1X1g7XG4gICAgICBpZiAocHJvcHMgJiYgcHJvcHMuc3RvcmFnZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1N0b3JhZ2UgcGFyYW1ldGVyIGRvZXMgbm90IGV4aXN0IGluIHNtbSBwYXJhbWV0ZXIgbmFtZSBmb3IgQW1hem9uIExpbnV4IDIwMjIuJyk7XG4gICAgICB9XG4gICAgICBpZiAocHJvcHMgJiYgcHJvcHMudmlydHVhbGl6YXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdWaXJ0dWFsaXphdGlvbiBwYXJhbWV0ZXIgZG9lcyBub3QgZXhpc3QgaW4gc21tIHBhcmFtZXRlciBuYW1lIGZvciBBbWF6b24gTGludXggMjAyMi4nKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdmlydHVhbGl6YXRpb24gPSAocHJvcHMgJiYgcHJvcHMudmlydHVhbGl6YXRpb24pIHx8IEFtYXpvbkxpbnV4VmlydC5IVk07XG4gICAgICBzdG9yYWdlID0gKHByb3BzICYmIHByb3BzLnN0b3JhZ2UpIHx8IEFtYXpvbkxpbnV4U3RvcmFnZS5HRU5FUkFMX1BVUlBPU0U7XG4gICAgfVxuXG4gICAgY29uc3QgcGFydHM6IEFycmF5PHN0cmluZ3x1bmRlZmluZWQ+ID0gW1xuICAgICAgZ2VuZXJhdGlvbixcbiAgICAgICdhbWknLFxuICAgICAgZWRpdGlvbiAhPT0gQW1hem9uTGludXhFZGl0aW9uLlNUQU5EQVJEID8gZWRpdGlvbiA6IHVuZGVmaW5lZCxcbiAgICAgIGtlcm5lbCxcbiAgICAgIHZpcnR1YWxpemF0aW9uLFxuICAgICAgY3B1LFxuICAgICAgc3RvcmFnZSxcbiAgICBdLmZpbHRlcih4ID0+IHggIT09IHVuZGVmaW5lZCk7IC8vIEdldCByaWQgb2YgdW5kZWZpbmVkc1xuXG4gICAgcmV0dXJuICcvYXdzL3NlcnZpY2UvYW1pLWFtYXpvbi1saW51eC1sYXRlc3QvJyArIHBhcnRzLmpvaW4oJy0nKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgY2FjaGVkSW5Db250ZXh0OiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEFtYXpvbkxpbnV4SW1hZ2VQcm9wcyA9IHt9KSB7XG4gICAgc3VwZXIoQW1hem9uTGludXhJbWFnZS5zc21QYXJhbWV0ZXJOYW1lKHByb3BzKSwgT3BlcmF0aW5nU3lzdGVtVHlwZS5MSU5VWCwgcHJvcHMudXNlckRhdGEpO1xuXG4gICAgdGhpcy5jYWNoZWRJbkNvbnRleHQgPSBwcm9wcy5jYWNoZWRJbkNvbnRleHQgPz8gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBpbWFnZSB0byB1c2UgaW4gdGhlIGdpdmVuIGNvbnRleHRcbiAgICovXG4gIHB1YmxpYyBnZXRJbWFnZShzY29wZTogQ29uc3RydWN0KTogTWFjaGluZUltYWdlQ29uZmlnIHtcbiAgICBjb25zdCBpbWFnZUlkID0gbG9va3VwSW1hZ2Uoc2NvcGUsIHRoaXMuY2FjaGVkSW5Db250ZXh0LCB0aGlzLnBhcmFtZXRlck5hbWUpO1xuXG4gICAgY29uc3Qgb3NUeXBlID0gT3BlcmF0aW5nU3lzdGVtVHlwZS5MSU5VWDtcbiAgICByZXR1cm4ge1xuICAgICAgaW1hZ2VJZCxcbiAgICAgIG9zVHlwZSxcbiAgICAgIHVzZXJEYXRhOiB0aGlzLnByb3BzLnVzZXJEYXRhID8/IFVzZXJEYXRhLmZvckxpbnV4KCksXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFdoYXQgZ2VuZXJhdGlvbiBvZiBBbWF6b24gTGludXggdG8gdXNlXG4gKi9cbmV4cG9ydCBlbnVtIEFtYXpvbkxpbnV4R2VuZXJhdGlvbiB7XG4gIC8qKlxuICAgKiBBbWF6b24gTGludXhcbiAgICovXG4gIEFNQVpPTl9MSU5VWCA9ICdhbXpuJyxcblxuICAvKipcbiAgICogQW1hem9uIExpbnV4IDJcbiAgICovXG4gIEFNQVpPTl9MSU5VWF8yID0gJ2Ftem4yJyxcblxuICAvKipcbiAgICogQW1hem9uIExpbnV4IDIwMjJcbiAgICovXG4gIEFNQVpPTl9MSU5VWF8yMDIyID0gJ2FsMjAyMicsXG59XG5cbi8qKlxuICogQW1hem9uIExpbnV4IEtlcm5lbFxuICovXG5leHBvcnQgZW51bSBBbWF6b25MaW51eEtlcm5lbCB7XG4gIC8qKlxuICAgKiBTdGFuZGFyZCBlZGl0aW9uXG4gICAqL1xuICBLRVJORUw1X1ggPSAna2VybmVsLTUuMTAnLFxufVxuXG4vKipcbiAqIEFtYXpvbiBMaW51eCBlZGl0aW9uXG4gKi9cbmV4cG9ydCBlbnVtIEFtYXpvbkxpbnV4RWRpdGlvbiB7XG4gIC8qKlxuICAgKiBTdGFuZGFyZCBlZGl0aW9uXG4gICAqL1xuICBTVEFOREFSRCA9ICdzdGFuZGFyZCcsXG5cbiAgLyoqXG4gICAqIE1pbmltYWwgZWRpdGlvblxuICAgKi9cbiAgTUlOSU1BTCA9ICdtaW5pbWFsJyxcbn1cblxuLyoqXG4gKiBWaXJ0dWFsaXphdGlvbiB0eXBlIGZvciBBbWF6b24gTGludXhcbiAqL1xuZXhwb3J0IGVudW0gQW1hem9uTGludXhWaXJ0IHtcbiAgLyoqXG4gICAqIEhWTSB2aXJ0dWFsaXphdGlvbiAocmVjb21tZW5kZWQpXG4gICAqL1xuICBIVk0gPSAnaHZtJyxcblxuICAvKipcbiAgICogUFYgdmlydHVhbGl6YXRpb25cbiAgICovXG4gIFBWID0gJ3B2Jyxcbn1cblxuZXhwb3J0IGVudW0gQW1hem9uTGludXhTdG9yYWdlIHtcbiAgLyoqXG4gICAqIEVCUy1iYWNrZWQgc3RvcmFnZVxuICAgKi9cbiAgRUJTID0gJ2VicycsXG5cbiAgLyoqXG4gICAqIFMzLWJhY2tlZCBzdG9yYWdlXG4gICAqL1xuICBTMyA9ICdzMycsXG5cbiAgLyoqXG4gICAqIEdlbmVyYWwgUHVycG9zZS1iYXNlZCBzdG9yYWdlIChyZWNvbW1lbmRlZClcbiAgICovXG4gIEdFTkVSQUxfUFVSUE9TRSA9ICdncDInLFxufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgR2VuZXJpY0xpbnV4SW1hZ2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBHZW5lcmljTGludXhJbWFnZVByb3BzIHtcbiAgLyoqXG4gICAqIEluaXRpYWwgdXNlciBkYXRhXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRW1wdHkgVXNlckRhdGEgZm9yIExpbnV4IG1hY2hpbmVzXG4gICAqL1xuICByZWFkb25seSB1c2VyRGF0YT86IFVzZXJEYXRhO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyYXRpb24gb3B0aW9ucyBmb3IgR2VuZXJpY1dpbmRvd3NJbWFnZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyaWNXaW5kb3dzSW1hZ2VQcm9wcyB7XG4gIC8qKlxuICAgKiBJbml0aWFsIHVzZXIgZGF0YVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEVtcHR5IFVzZXJEYXRhIGZvciBXaW5kb3dzIG1hY2hpbmVzXG4gICAqL1xuICByZWFkb25seSB1c2VyRGF0YT86IFVzZXJEYXRhO1xufVxuXG4vKipcbiAqIENvbnN0cnVjdCBhIExpbnV4IG1hY2hpbmUgaW1hZ2UgZnJvbSBhbiBBTUkgbWFwXG4gKlxuICogTGludXggaW1hZ2VzIElEcyBhcmUgbm90IHB1Ymxpc2hlZCB0byBTU00gcGFyYW1ldGVyIHN0b3JlIHlldCwgc28geW91J2xsIGhhdmUgdG9cbiAqIG1hbnVhbGx5IHNwZWNpZnkgYW4gQU1JIG1hcC5cbiAqL1xuZXhwb3J0IGNsYXNzIEdlbmVyaWNMaW51eEltYWdlIGltcGxlbWVudHMgSU1hY2hpbmVJbWFnZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYW1pTWFwOiB7IFtyZWdpb246IHN0cmluZ106IHN0cmluZyB9LCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBHZW5lcmljTGludXhJbWFnZVByb3BzID0ge30pIHtcbiAgfVxuXG4gIHB1YmxpYyBnZXRJbWFnZShzY29wZTogQ29uc3RydWN0KTogTWFjaGluZUltYWdlQ29uZmlnIHtcbiAgICBjb25zdCB1c2VyRGF0YSA9IHRoaXMucHJvcHMudXNlckRhdGEgPz8gVXNlckRhdGEuZm9yTGludXgoKTtcbiAgICBjb25zdCBvc1R5cGUgPSBPcGVyYXRpbmdTeXN0ZW1UeXBlLkxJTlVYO1xuICAgIGNvbnN0IHJlZ2lvbiA9IFN0YWNrLm9mKHNjb3BlKS5yZWdpb247XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChyZWdpb24pKSB7XG4gICAgICBjb25zdCBtYXBwaW5nOiB7IFtrMTogc3RyaW5nXTogeyBbazI6IHN0cmluZ106IGFueSB9IH0gPSB7fTtcbiAgICAgIGZvciAoY29uc3QgW3JnbiwgYW1pXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmFtaU1hcCkpIHtcbiAgICAgICAgbWFwcGluZ1tyZ25dID0geyBhbWkgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFtaU1hcCA9IG5ldyBDZm5NYXBwaW5nKHNjb3BlLCAnQW1pTWFwJywgeyBtYXBwaW5nIH0pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW1hZ2VJZDogYW1pTWFwLmZpbmRJbk1hcChBd3MuUkVHSU9OLCAnYW1pJyksXG4gICAgICAgIHVzZXJEYXRhLFxuICAgICAgICBvc1R5cGUsXG4gICAgICB9O1xuICAgIH1cbiAgICBjb25zdCBpbWFnZUlkID0gcmVnaW9uICE9PSAndGVzdC1yZWdpb24nID8gdGhpcy5hbWlNYXBbcmVnaW9uXSA6ICdhbWktMTIzNDUnO1xuICAgIGlmICghaW1hZ2VJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCBBTUkgaW4gQU1JIG1hcDogbm8gQU1JIHNwZWNpZmllZCBmb3IgcmVnaW9uICcke3JlZ2lvbn0nYCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBpbWFnZUlkLFxuICAgICAgdXNlckRhdGEsXG4gICAgICBvc1R5cGUsXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIENvbnN0cnVjdCBhIFdpbmRvd3MgbWFjaGluZSBpbWFnZSBmcm9tIGFuIEFNSSBtYXBcbiAqXG4gKiBBbGxvd3MgeW91IHRvIGNyZWF0ZSBhIGdlbmVyaWMgV2luZG93cyBFQzIgLCBtYW51YWxseSBzcGVjaWZ5IGFuIEFNSSBtYXAuXG4gKi9cbmV4cG9ydCBjbGFzcyBHZW5lcmljV2luZG93c0ltYWdlIGltcGxlbWVudHMgSU1hY2hpbmVJbWFnZSB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgYW1pTWFwOiB7W3JlZ2lvbjogc3RyaW5nXTogc3RyaW5nfSwgcHJpdmF0ZSByZWFkb25seSBwcm9wczogR2VuZXJpY1dpbmRvd3NJbWFnZVByb3BzID0ge30pIHtcbiAgfVxuXG4gIHB1YmxpYyBnZXRJbWFnZShzY29wZTogQ29uc3RydWN0KTogTWFjaGluZUltYWdlQ29uZmlnIHtcbiAgICBjb25zdCB1c2VyRGF0YSA9IHRoaXMucHJvcHMudXNlckRhdGEgPz8gVXNlckRhdGEuZm9yV2luZG93cygpO1xuICAgIGNvbnN0IG9zVHlwZSA9IE9wZXJhdGluZ1N5c3RlbVR5cGUuV0lORE9XUztcbiAgICBjb25zdCByZWdpb24gPSBTdGFjay5vZihzY29wZSkucmVnaW9uO1xuICAgIGlmIChUb2tlbi5pc1VucmVzb2x2ZWQocmVnaW9uKSkge1xuICAgICAgY29uc3QgbWFwcGluZzogeyBbazE6IHN0cmluZ106IHsgW2syOiBzdHJpbmddOiBhbnkgfSB9ID0ge307XG4gICAgICBmb3IgKGNvbnN0IFtyZ24sIGFtaV0gb2YgT2JqZWN0LmVudHJpZXModGhpcy5hbWlNYXApKSB7XG4gICAgICAgIG1hcHBpbmdbcmduXSA9IHsgYW1pIH07XG4gICAgICB9XG4gICAgICBjb25zdCBhbWlNYXAgPSBuZXcgQ2ZuTWFwcGluZyhzY29wZSwgJ0FtaU1hcCcsIHsgbWFwcGluZyB9KTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGltYWdlSWQ6IGFtaU1hcC5maW5kSW5NYXAoQXdzLlJFR0lPTiwgJ2FtaScpLFxuICAgICAgICB1c2VyRGF0YSxcbiAgICAgICAgb3NUeXBlLFxuICAgICAgfTtcbiAgICB9XG4gICAgY29uc3QgaW1hZ2VJZCA9IHJlZ2lvbiAhPT0gJ3Rlc3QtcmVnaW9uJyA/IHRoaXMuYW1pTWFwW3JlZ2lvbl0gOiAnYW1pLTEyMzQ1JztcbiAgICBpZiAoIWltYWdlSWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGZpbmQgQU1JIGluIEFNSSBtYXA6IG5vIEFNSSBzcGVjaWZpZWQgZm9yIHJlZ2lvbiAnJHtyZWdpb259J2ApO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgaW1hZ2VJZCxcbiAgICAgIHVzZXJEYXRhLFxuICAgICAgb3NUeXBlLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBUaGUgT1MgdHlwZSBvZiBhIHBhcnRpY3VsYXIgaW1hZ2VcbiAqL1xuZXhwb3J0IGVudW0gT3BlcmF0aW5nU3lzdGVtVHlwZSB7XG4gIExJTlVYLFxuICBXSU5ET1dTLFxuICAvKipcbiAgICogVXNlZCB3aGVuIHRoZSB0eXBlIG9mIHRoZSBvcGVyYXRpbmcgc3lzdGVtIGlzIG5vdCBrbm93blxuICAgKiAoZm9yIGV4YW1wbGUsIGZvciBpbXBvcnRlZCBBdXRvLVNjYWxpbmcgR3JvdXBzKS5cbiAgICovXG4gIFVOS05PV04sXG59XG5cbi8qKlxuICogQSBtYWNoaW5lIGltYWdlIHdob3NlIEFNSSBJRCB3aWxsIGJlIHNlYXJjaGVkIHVzaW5nIERlc2NyaWJlSW1hZ2VzLlxuICpcbiAqIFRoZSBtb3N0IHJlY2VudCwgYXZhaWxhYmxlLCBsYXVuY2hhYmxlIGltYWdlIG1hdGNoaW5nIHRoZSBnaXZlbiBmaWx0ZXJcbiAqIGNyaXRlcmlhIHdpbGwgYmUgdXNlZC4gTG9va2luZyB1cCBBTUlzIG1heSB0YWtlIGEgbG9uZyB0aW1lOyBzcGVjaWZ5XG4gKiBhcyBtYW55IGZpbHRlciBjcml0ZXJpYSBhcyBwb3NzaWJsZSB0byBuYXJyb3cgZG93biB0aGUgc2VhcmNoLlxuICpcbiAqIFRoZSBBTUkgc2VsZWN0ZWQgd2lsbCBiZSBjYWNoZWQgaW4gYGNkay5jb250ZXh0Lmpzb25gIGFuZCB0aGUgc2FtZSB2YWx1ZVxuICogd2lsbCBiZSB1c2VkIG9uIGZ1dHVyZSBydW5zLiBUbyByZWZyZXNoIHRoZSBBTUkgbG9va3VwLCB5b3Ugd2lsbCBoYXZlIHRvXG4gKiBldmljdCB0aGUgdmFsdWUgZnJvbSB0aGUgY2FjaGUgdXNpbmcgdGhlIGBjZGsgY29udGV4dGAgY29tbWFuZC4gU2VlXG4gKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2xhdGVzdC9ndWlkZS9jb250ZXh0Lmh0bWwgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKi9cbmV4cG9ydCBjbGFzcyBMb29rdXBNYWNoaW5lSW1hZ2UgaW1wbGVtZW50cyBJTWFjaGluZUltYWdlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogTG9va3VwTWFjaGluZUltYWdlUHJvcHMpIHtcbiAgfVxuXG4gIHB1YmxpYyBnZXRJbWFnZShzY29wZTogQ29uc3RydWN0KTogTWFjaGluZUltYWdlQ29uZmlnIHtcbiAgICAvLyBOZWVkIHRvIGtub3cgJ3dpbmRvd3MnIG9yIG5vdCBiZWZvcmUgZG9pbmcgdGhlIHF1ZXJ5IHRvIHJldHVybiB0aGUgcmlnaHRcbiAgICAvLyBvc1R5cGUgZm9yIHRoZSBkdW1teSB2YWx1ZSwgc28gbWlnaHQgYXMgd2VsbCBhZGQgaXQgdG8gdGhlIGZpbHRlci5cbiAgICBjb25zdCBmaWx0ZXJzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmdbXSB8IHVuZGVmaW5lZD4gPSB7XG4gICAgICAnbmFtZSc6IFt0aGlzLnByb3BzLm5hbWVdLFxuICAgICAgJ3N0YXRlJzogWydhdmFpbGFibGUnXSxcbiAgICAgICdpbWFnZS10eXBlJzogWydtYWNoaW5lJ10sXG4gICAgICAncGxhdGZvcm0nOiB0aGlzLnByb3BzLndpbmRvd3MgPyBbJ3dpbmRvd3MnXSA6IHVuZGVmaW5lZCxcbiAgICB9O1xuICAgIE9iamVjdC5hc3NpZ24oZmlsdGVycywgdGhpcy5wcm9wcy5maWx0ZXJzKTtcblxuICAgIGNvbnN0IHZhbHVlID0gQ29udGV4dFByb3ZpZGVyLmdldFZhbHVlKHNjb3BlLCB7XG4gICAgICBwcm92aWRlcjogY3hzY2hlbWEuQ29udGV4dFByb3ZpZGVyLkFNSV9QUk9WSURFUixcbiAgICAgIHByb3BzOiB7XG4gICAgICAgIG93bmVyczogdGhpcy5wcm9wcy5vd25lcnMsXG4gICAgICAgIGZpbHRlcnMsXG4gICAgICB9IGFzIGN4c2NoZW1hLkFtaUNvbnRleHRRdWVyeSxcbiAgICAgIGR1bW15VmFsdWU6ICdhbWktMTIzNCcsXG4gICAgfSkudmFsdWUgYXMgY3hhcGkuQW1pQ29udGV4dFJlc3BvbnNlO1xuXG4gICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUmVzcG9uc2UgdG8gQU1JIGxvb2t1cCBpbnZhbGlkLCBnb3Q6ICR7dmFsdWV9YCk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3NUeXBlID0gdGhpcy5wcm9wcy53aW5kb3dzID8gT3BlcmF0aW5nU3lzdGVtVHlwZS5XSU5ET1dTIDogT3BlcmF0aW5nU3lzdGVtVHlwZS5MSU5VWDtcblxuICAgIHJldHVybiB7XG4gICAgICBpbWFnZUlkOiB2YWx1ZSxcbiAgICAgIG9zVHlwZSxcbiAgICAgIHVzZXJEYXRhOiB0aGlzLnByb3BzLnVzZXJEYXRhID8/IFVzZXJEYXRhLmZvck9wZXJhdGluZ1N5c3RlbShvc1R5cGUpLFxuICAgIH07XG4gIH1cbn1cblxuLyoqXG4gKiBQcm9wZXJ0aWVzIGZvciBsb29raW5nIHVwIGFuIGltYWdlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9va3VwTWFjaGluZUltYWdlUHJvcHMge1xuICAvKipcbiAgICogTmFtZSBvZiB0aGUgaW1hZ2UgKG1heSBjb250YWluIHdpbGRjYXJkcylcbiAgICovXG4gIHJlYWRvbmx5IG5hbWU6IHN0cmluZztcblxuICAvKipcbiAgICogT3duZXIgYWNjb3VudCBJRHMgb3IgYWxpYXNlc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIEFsbCBvd25lcnNcbiAgICovXG4gIHJlYWRvbmx5IG93bmVycz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBBZGRpdGlvbmFsIGZpbHRlcnMgb24gdGhlIEFNSVxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L0FQSVJlZmVyZW5jZS9BUElfRGVzY3JpYmVJbWFnZXMuaHRtbFxuICAgKiBAZGVmYXVsdCAtIE5vIGFkZGl0aW9uYWwgZmlsdGVyc1xuICAgKi9cbiAgcmVhZG9ubHkgZmlsdGVycz86IHtba2V5OiBzdHJpbmddOiBzdHJpbmdbXX07XG5cbiAgLyoqXG4gICAqIExvb2sgZm9yIFdpbmRvd3MgaW1hZ2VzXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSB3aW5kb3dzPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogQ3VzdG9tIHVzZXJkYXRhIGZvciB0aGlzIGltYWdlXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRW1wdHkgdXNlciBkYXRhIGFwcHJvcHJpYXRlIGZvciB0aGUgcGxhdGZvcm0gdHlwZVxuICAgKi9cbiAgcmVhZG9ubHkgdXNlckRhdGE/OiBVc2VyRGF0YTtcbn1cblxuZnVuY3Rpb24gbG9va3VwSW1hZ2Uoc2NvcGU6IENvbnN0cnVjdCwgY2FjaGVkSW5Db250ZXh0OiBib29sZWFuIHwgdW5kZWZpbmVkLCBwYXJhbWV0ZXJOYW1lOiBzdHJpbmcpIHtcbiAgcmV0dXJuIGNhY2hlZEluQ29udGV4dFxuICAgID8gc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZyb21Mb29rdXAoc2NvcGUsIHBhcmFtZXRlck5hbWUpXG4gICAgOiBzc20uU3RyaW5nUGFyYW1ldGVyLnZhbHVlRm9yVHlwZWRTdHJpbmdQYXJhbWV0ZXJWMihzY29wZSwgcGFyYW1ldGVyTmFtZSwgc3NtLlBhcmFtZXRlclZhbHVlVHlwZS5BV1NfRUMyX0lNQUdFX0lEKTtcbn1cbiJdfQ==