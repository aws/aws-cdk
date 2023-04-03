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
exports.MachineImage = MachineImage;
_a = JSII_RTTI_SYMBOL_1;
MachineImage[_a] = { fqn: "@aws-cdk/aws-ec2.MachineImage", version: "0.0.0" };
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
exports.GenericSSMParameterImage = GenericSSMParameterImage;
_b = JSII_RTTI_SYMBOL_1;
GenericSSMParameterImage[_b] = { fqn: "@aws-cdk/aws-ec2.GenericSSMParameterImage", version: "0.0.0" };
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
exports.WindowsImage = WindowsImage;
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
exports.AmazonLinuxImage = AmazonLinuxImage;
_d = JSII_RTTI_SYMBOL_1;
AmazonLinuxImage[_d] = { fqn: "@aws-cdk/aws-ec2.AmazonLinuxImage", version: "0.0.0" };
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
exports.GenericLinuxImage = GenericLinuxImage;
_e = JSII_RTTI_SYMBOL_1;
GenericLinuxImage[_e] = { fqn: "@aws-cdk/aws-ec2.GenericLinuxImage", version: "0.0.0" };
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
exports.GenericWindowsImage = GenericWindowsImage;
_f = JSII_RTTI_SYMBOL_1;
GenericWindowsImage[_f] = { fqn: "@aws-cdk/aws-ec2.GenericWindowsImage", version: "0.0.0" };
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
exports.LookupMachineImage = LookupMachineImage;
_g = JSII_RTTI_SYMBOL_1;
LookupMachineImage[_g] = { fqn: "@aws-cdk/aws-ec2.LookupMachineImage", version: "0.0.0" };
function lookupImage(scope, cachedInContext, parameterName) {
    return cachedInContext
        ? ssm.StringParameter.valueFromLookup(scope, parameterName)
        : ssm.StringParameter.valueForTypedStringParameterV2(scope, parameterName, ssm.ParameterValueType.AWS_EC2_IMAGE_ID);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFjaGluZS1pbWFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1hY2hpbmUtaW1hZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdDO0FBQ3hDLDJEQUEyRDtBQUMzRCx3Q0FBK0U7QUFHL0UsMkNBQXVDO0FBQ3ZDLHlEQUFvRDtBQVlwRDs7R0FFRztBQUNILE1BQXNCLFlBQVk7SUFDaEM7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBdUIsRUFBRSxLQUF5Qjs7Ozs7Ozs7Ozs7UUFDNUUsT0FBTyxJQUFJLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDekM7SUFFRDs7Ozs7OztPQU9HO0lBQ0ksTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQTZCOzs7Ozs7Ozs7O1FBQzNELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNwQztJQUVEOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBOEIsRUFBRSxLQUE4Qjs7Ozs7Ozs7OztRQUN2RixPQUFPLElBQUksaUJBQWlCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzdDO0lBRUQ7Ozs7OztPQU1HO0lBQ0ksTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUE4QixFQUFFLEtBQWdDOzs7Ozs7Ozs7O1FBQzNGLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDL0M7SUFFRDs7Ozs7Ozs7Ozs7O09BWUc7SUFDSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsYUFBcUIsRUFBRSxFQUF1QixFQUFFLFFBQW1COzs7Ozs7Ozs7Ozs7UUFDaEcsT0FBTyxJQUFJLHdCQUF3QixDQUFDLGFBQWEsRUFBRSxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDbEU7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksTUFBTSxDQUFDLGdCQUFnQixDQUFDLGFBQXFCLEVB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LENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUM7UUFFNUYsT0FBTztZQUNMLE9BQU8sRUFBRSxLQUFLO1lBQ2QsTUFBTTtZQUNOLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsSUFBSSxvQkFBUSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztTQUNyRSxDQUFDO0tBQ0g7O0FBbkNILGdEQW9DQzs7O0FBeUNELFNBQVMsV0FBVyxDQUFDLEtBQWdCLEVBQUUsZUFBb0MsRUFBRSxhQUFxQjtJQUNoRyxPQUFPLGVBQWU7UUFDcEIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUM7UUFDM0QsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsOEJBQThCLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxHQUFHLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUN4SCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgc3NtIGZyb20gJ0Bhd3MtY2RrL2F3cy1zc20nO1xuaW1wb3J0ICogYXMgY3hzY2hlbWEgZnJvbSAnQGF3cy1jZGsvY2xvdWQtYXNzZW1ibHktc2NoZW1hJztcbmltcG9ydCB7IENvbnRleHRQcm92aWRlciwgQ2ZuTWFwcGluZywgQXdzLCBTdGFjaywgVG9rZW4gfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIGN4YXBpIGZyb20gJ0Bhd3MtY2RrL2N4LWFwaSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFVzZXJEYXRhIH0gZnJvbSAnLi91c2VyLWRhdGEnO1xuaW1wb3J0IHsgV2luZG93c1ZlcnNpb24gfSBmcm9tICcuL3dpbmRvd3MtdmVyc2lvbnMnO1xuXG4vKipcbiAqIEludGVyZmFjZSBmb3IgY2xhc3NlcyB0aGF0IGNhbiBzZWxlY3QgYW4gYXBwcm9wcmlhdGUgbWFjaGluZSBpbWFnZSB0byB1c2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBJTWFjaGluZUltYWdlIHtcbiAgLyoqXG4gICAqIFJldHVybiB0aGUgaW1hZ2UgdG8gdXNlIGluIHRoZSBnaXZlbiBjb250ZXh0XG4gICAqL1xuICBnZXRJbWFnZShzY29wZTogQ29uc3RydWN0KTogTWFjaGluZUltYWdlQ29uZmlnO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgZnVuY3Rpb25zIGZvciBzdGFuZGFyZCBBbWF6b24gTWFjaGluZSBJbWFnZSBvYmplY3RzLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWFjaGluZUltYWdlIHtcbiAgLyoqXG4gICAqIEEgV2luZG93cyBpbWFnZSB0aGF0IGlzIGF1dG9tYXRpY2FsbHkga2VwdCB1cC10by1kYXRlXG4gICAqXG4gICAqIFRoaXMgTWFjaGluZSBJbWFnZSBhdXRvbWF0aWNhbGx5IHVwZGF0ZXMgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIG9uIGV2ZXJ5XG4gICAqIGRlcGxveW1lbnQuIEJlIGF3YXJlIHRoaXMgd2lsbCBjYXVzZSB5b3VyIGluc3RhbmNlcyB0byBiZSByZXBsYWNlZCB3aGVuIGFcbiAgICogbmV3IHZlcnNpb24gb2YgdGhlIGltYWdlIGJlY29tZXMgYXZhaWxhYmxlLiBEbyBub3Qgc3RvcmUgc3RhdGVmdWwgaW5mb3JtYXRpb25cbiAgICogb24gdGhlIGluc3RhbmNlIGlmIHlvdSBhcmUgdXNpbmcgdGhpcyBpbWFnZS5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbGF0ZXN0V2luZG93cyh2ZXJzaW9uOiBXaW5kb3dzVmVyc2lvbiwgcHJvcHM/OiBXaW5kb3dzSW1hZ2VQcm9wcyk6IElNYWNoaW5lSW1hZ2Uge1xuICAgIHJldHVybiBuZXcgV2luZG93c0ltYWdlKHZlcnNpb24sIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBBbWF6b24gTGludXggaW1hZ2UgdGhhdCBpcyBhdXRvbWF0aWNhbGx5IGtlcHQgdXAtdG8tZGF0ZVxuICAgKlxuICAgKiBUaGlzIE1hY2hpbmUgSW1hZ2UgYXV0b21hdGljYWxseSB1cGRhdGVzIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvbiBldmVyeVxuICAgKiBkZXBsb3ltZW50LiBCZSBhd2FyZSB0aGlzIHdpbGwgY2F1c2UgeW91ciBpbnN0YW5jZXMgdG8gYmUgcmVwbGFjZWQgd2hlbiBhXG4gICAqIG5ldyB2ZXJzaW9uIG9mIHRoZSBpbWFnZSBiZWNvbWVzIGF2YWlsYWJsZS4gRG8gbm90IHN0b3JlIHN0YXRlZnVsIGluZm9ybWF0aW9uXG4gICAqIG9uIHRoZSBpbnN0YW5jZSBpZiB5b3UgYXJlIHVzaW5nIHRoaXMgaW1hZ2UuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxhdGVzdEFtYXpvbkxpbnV4KHByb3BzPzogQW1hem9uTGludXhJbWFnZVByb3BzKTogSU1hY2hpbmVJbWFnZSB7XG4gICAgcmV0dXJuIG5ldyBBbWF6b25MaW51eEltYWdlKHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIExpbnV4IGltYWdlIHdoZXJlIHlvdSBzcGVjaWZ5IHRoZSBBTUkgSUQgZm9yIGV2ZXJ5IHJlZ2lvblxuICAgKlxuICAgKiBAcGFyYW0gYW1pTWFwIEZvciBldmVyeSByZWdpb24gd2hlcmUgeW91IGFyZSBkZXBsb3lpbmcgdGhlIHN0YWNrLFxuICAgKiBzcGVjaWZ5IHRoZSBBTUkgSUQgZm9yIHRoYXQgcmVnaW9uLlxuICAgKiBAcGFyYW0gcHJvcHMgQ3VzdG9taXplIHRoZSBpbWFnZSBieSBzdXBwbHlpbmcgYWRkaXRpb25hbCBwcm9wc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZW5lcmljTGludXgoYW1pTWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCBwcm9wcz86IEdlbmVyaWNMaW51eEltYWdlUHJvcHMpOiBJTWFjaGluZUltYWdlIHtcbiAgICByZXR1cm4gbmV3IEdlbmVyaWNMaW51eEltYWdlKGFtaU1hcCwgcHJvcHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEEgV2luZG93cyBpbWFnZSB3aGVyZSB5b3Ugc3BlY2lmeSB0aGUgQU1JIElEIGZvciBldmVyeSByZWdpb25cbiAgICpcbiAgICogQHBhcmFtIGFtaU1hcCBGb3IgZXZlcnkgcmVnaW9uIHdoZXJlIHlvdSBhcmUgZGVwbG95aW5nIHRoZSBzdGFjayxcbiAgICogc3BlY2lmeSB0aGUgQU1JIElEIGZvciB0aGF0IHJlZ2lvbi5cbiAgICogQHBhcmFtIHByb3BzIEN1c3RvbWl6ZSB0aGUgaW1hZ2UgYnkgc3VwcGx5aW5nIGFkZGl0aW9uYWwgcHJvcHNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2VuZXJpY1dpbmRvd3MoYW1pTWFwOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCBwcm9wcz86IEdlbmVyaWNXaW5kb3dzSW1hZ2VQcm9wcyk6IElNYWNoaW5lSW1hZ2Uge1xuICAgIHJldHVybiBuZXcgR2VuZXJpY1dpbmRvd3NJbWFnZShhbWlNYXAsIHByb3BzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBpbWFnZSBzcGVjaWZpZWQgaW4gU1NNIHBhcmFtZXRlciBzdG9yZSB0aGF0IGlzIGF1dG9tYXRpY2FsbHkga2VwdCB1cC10by1kYXRlXG4gICAqXG4gICAqIFRoaXMgTWFjaGluZSBJbWFnZSBhdXRvbWF0aWNhbGx5IHVwZGF0ZXMgdG8gdGhlIGxhdGVzdCB2ZXJzaW9uIG9uIGV2ZXJ5XG4gICAqIGRlcGxveW1lbnQuIEJlIGF3YXJlIHRoaXMgd2lsbCBjYXVzZSB5b3VyIGluc3RhbmNlcyB0byBiZSByZXBsYWNlZCB3aGVuIGFcbiAgICogbmV3IHZlcnNpb24gb2YgdGhlIGltYWdlIGJlY29tZXMgYXZhaWxhYmxlLiBEbyBub3Qgc3RvcmUgc3RhdGVmdWwgaW5mb3JtYXRpb25cbiAgICogb24gdGhlIGluc3RhbmNlIGlmIHlvdSBhcmUgdXNpbmcgdGhpcyBpbWFnZS5cbiAgICpcbiAgICogQHBhcmFtIHBhcmFtZXRlck5hbWUgVGhlIG5hbWUgb2YgU1NNIHBhcmFtZXRlciBjb250YWluaW5nIHRoZSBBTWkgaWRcbiAgICogQHBhcmFtIG9zIFRoZSBvcGVyYXRpbmcgc3lzdGVtIHR5cGUgb2YgdGhlIEFNSVxuICAgKiBAcGFyYW0gdXNlckRhdGEgb3B0aW9uYWwgdXNlciBkYXRhIGZvciB0aGUgZ2l2ZW4gaW1hZ2VcbiAgICogQGRlcHJlY2F0ZWQgVXNlIGBNYWNoaW5lSW1hZ2UuZnJvbVNzbVBhcmFtZXRlcigpYCBpbnN0ZWFkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21TU01QYXJhbWV0ZXIocGFyYW1ldGVyTmFtZTogc3RyaW5nLCBvczogT3BlcmF0aW5nU3lzdGVtVHlwZSwgdXNlckRhdGE/OiBVc2VyRGF0YSk6IElNYWNoaW5lSW1hZ2Uge1xuICAgIHJldHVybiBuZXcgR2VuZXJpY1NTTVBhcmFtZXRlckltYWdlKHBhcmFtZXRlck5hbWUsIG9zLCB1c2VyRGF0YSk7XG4gIH1cblxuICAvKipcbiAgICogQW4gaW1hZ2Ugc3BlY2lmaWVkIGluIFNTTSBwYXJhbWV0ZXIgc3RvcmVcbiAgICpcbiAgICogQnkgZGVmYXVsdCwgdGhlIFNTTSBwYXJhbWV0ZXIgaXMgcmVmcmVzaGVkIGF0IGV2ZXJ5IGRlcGxveW1lbnQsXG4gICAqIGNhdXNpbmcgeW91ciBpbnN0YW5jZXMgdG8gYmUgcmVwbGFjZWQgd2hlbmV2ZXIgYSBuZXcgdmVyc2lvbiBvZiB0aGUgQU1JXG4gICAqIGlzIHJlbGVhc2VkLlxuICAgKlxuICAgKiBQYXNzIGB7IGNhY2hlZEluQ29udGV4dDogdHJ1ZSB9YCB0byBrZWVwIHRoZSBBTUkgSUQgc3RhYmxlLiBJZiB5b3UgZG8sIHlvdVxuICAgKiB3aWxsIGhhdmUgdG8gcmVtZW1iZXIgdG8gcGVyaW9kaWNhbGx5IGludmFsaWRhdGUgdGhlIGNvbnRleHQgdG8gcmVmcmVzaFxuICAgKiB0byB0aGUgbmV3ZXN0IEFNSSBJRC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVNzbVBhcmFtZXRlcihwYXJhbWV0ZXJOYW1lOiBzdHJpbmcsIG9wdGlvbnM/OiBTc21QYXJhbWV0ZXJJbWFnZU9wdGlvbnMpOiBJTWFjaGluZUltYWdlIHtcbiAgICByZXR1cm4gbmV3IEdlbmVyaWNTc21QYXJhbWV0ZXJJbWFnZShwYXJhbWV0ZXJOYW1lLCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rIHVwIGEgc2hhcmVkIE1hY2hpbmUgSW1hZ2UgdXNpbmcgRGVzY3JpYmVJbWFnZXNcbiAgICpcbiAgICogVGhlIG1vc3QgcmVjZW50LCBhdmFpbGFibGUsIGxhdW5jaGFibGUgaW1hZ2UgbWF0Y2hpbmcgdGhlIGdpdmVuIGZpbHRlclxuICAgKiBjcml0ZXJpYSB3aWxsIGJlIHVzZWQuIExvb2tpbmcgdXAgQU1JcyBtYXkgdGFrZSBhIGxvbmcgdGltZTsgc3BlY2lmeVxuICAgKiBhcyBtYW55IGZpbHRlciBjcml0ZXJpYSBhcyBwb3NzaWJsZSB0byBuYXJyb3cgZG93biB0aGUgc2VhcmNoLlxuICAgKlxuICAgKiBUaGUgQU1JIHNlbGVjdGVkIHdpbGwgYmUgY2FjaGVkIGluIGBjZGsuY29udGV4dC5qc29uYCBhbmQgdGhlIHNhbWUgdmFsdWVcbiAgICogd2lsbCBiZSB1c2VkIG9uIGZ1dHVyZSBydW5zLiBUbyByZWZyZXNoIHRoZSBBTUkgbG9va3VwLCB5b3Ugd2lsbCBoYXZlIHRvXG4gICAqIGV2aWN0IHRoZSB2YWx1ZSBmcm9tIHRoZSBjYWNoZSB1c2luZyB0aGUgYGNkayBjb250ZXh0YCBjb21tYW5kLiBTZWVcbiAgICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9sYXRlc3QvZ3VpZGUvY29udGV4dC5odG1sIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBUaGlzIGZ1bmN0aW9uIGNhbiBub3QgYmUgdXNlZCBpbiBlbnZpcm9ubWVudC1hZ25vc3RpYyBzdGFja3MuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGxvb2t1cChwcm9wczogTG9va3VwTWFjaGluZUltYWdlUHJvcHMpOiBJTWFjaGluZUltYWdlIHtcbiAgICByZXR1cm4gbmV3IExvb2t1cE1hY2hpbmVJbWFnZShwcm9wcyk7XG4gIH1cbn1cblxuLyoqXG4gKiBDb25maWd1cmF0aW9uIGZvciBhIG1hY2hpbmUgaW1hZ2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNYWNoaW5lSW1hZ2VDb25maWcge1xuICAvKipcbiAgICogVGhlIEFNSSBJRCBvZiB0aGUgaW1hZ2UgdG8gdXNlXG4gICAqL1xuICByZWFkb25seSBpbWFnZUlkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE9wZXJhdGluZyBzeXN0ZW0gdHlwZSBmb3IgdGhpcyBpbWFnZVxuICAgKi9cbiAgcmVhZG9ubHkgb3NUeXBlOiBPcGVyYXRpbmdTeXN0ZW1UeXBlO1xuXG4gIC8qKlxuICAgKiBJbml0aWFsIFVzZXJEYXRhIGZvciB0aGlzIGltYWdlXG4gICAqL1xuICByZWFkb25seSB1c2VyRGF0YTogVXNlckRhdGE7XG59XG5cbi8qKlxuICogU2VsZWN0IHRoZSBpbWFnZSBiYXNlZCBvbiBhIGdpdmVuIFNTTSBwYXJhbWV0ZXJcbiAqXG4gKiBUaGlzIE1hY2hpbmUgSW1hZ2UgYXV0b21hdGljYWxseSB1cGRhdGVzIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvbiBldmVyeVxuICogZGVwbG95bWVudC4gQmUgYXdhcmUgdGhpcyB3aWxsIGNhdXNlIHlvdXIgaW5zdGFuY2VzIHRvIGJlIHJlcGxhY2VkIHdoZW4gYVxuICogbmV3IHZlcnNpb24gb2YgdGhlIGltYWdlIGJlY29tZXMgYXZhaWxhYmxlLiBEbyBub3Qgc3RvcmUgc3RhdGVmdWwgaW5mb3JtYXRpb25cbiAqIG9uIHRoZSBpbnN0YW5jZSBpZiB5b3UgYXJlIHVzaW5nIHRoaXMgaW1hZ2UuXG4gKlxuICogVGhlIEFNSSBJRCBpcyBzZWxlY3RlZCB1c2luZyB0aGUgdmFsdWVzIHB1Ymxpc2hlZCB0byB0aGUgU1NNIHBhcmFtZXRlciBzdG9yZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEdlbmVyaWNTU01QYXJhbWV0ZXJJbWFnZSBpbXBsZW1lbnRzIElNYWNoaW5lSW1hZ2Uge1xuICAvLyBGSVhNRTogdGhpcyBjbGFzcyBvdWdodCB0byBiZSBgQGRlcHJlY2F0ZWRgIGFuZCByZW1vdmVkIGZyb20gdjIsIGJ1dCB0aGF0XG4gIC8vIGlzIGNhdXNpbmcgYnVpbGQgZmFpbHVyZSByaWdodCBub3cuIFJlZjogaHR0cHM6Ly9naXRodWIuY29tL2F3cy9qc2lpL2lzc3Vlcy8zMDI1XG4gIC8vIEAtZGVwcmVjYXRlZCBVc2UgYE1hY2hpbmVJbWFnZS5mcm9tU3NtUGFyYW1ldGVyKClgIGluc3RlYWRcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgU1NNIHBhcmFtZXRlciB3ZSdyZSBsb29raW5nIHVwXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgcGFyYW1ldGVyTmFtZTogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHBhcmFtZXRlck5hbWU6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBvczogT3BlcmF0aW5nU3lzdGVtVHlwZSwgcHJpdmF0ZSByZWFkb25seSB1c2VyRGF0YT86IFVzZXJEYXRhKSB7XG4gICAgdGhpcy5wYXJhbWV0ZXJOYW1lID0gcGFyYW1ldGVyTmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGltYWdlIHRvIHVzZSBpbiB0aGUgZ2l2ZW4gY29udGV4dFxuICAgKi9cbiAgcHVibGljIGdldEltYWdlKHNjb3BlOiBDb25zdHJ1Y3QpOiBNYWNoaW5lSW1hZ2VDb25maWcge1xuICAgIGNvbnN0IGFtaSA9IHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JUeXBlZFN0cmluZ1BhcmFtZXRlclYyKHNjb3BlLCB0aGlzLnBhcmFtZXRlck5hbWUsIHNzbS5QYXJhbWV0ZXJWYWx1ZVR5cGUuQVdTX0VDMl9JTUFHRV9JRCk7XG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlSWQ6IGFtaSxcbiAgICAgIG9zVHlwZTogdGhpcy5vcyxcbiAgICAgIHVzZXJEYXRhOiB0aGlzLnVzZXJEYXRhID8/ICh0aGlzLm9zID09PSBPcGVyYXRpbmdTeXN0ZW1UeXBlLldJTkRPV1MgPyBVc2VyRGF0YS5mb3JXaW5kb3dzKCkgOiBVc2VyRGF0YS5mb3JMaW51eCgpKSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgR2VuZXJpY1NzbVBhcmFtZXRlckltYWdlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3NtUGFyYW1ldGVySW1hZ2VPcHRpb25zIHtcbiAgLyoqXG4gICAqIE9wZXJhdGluZyBzeXN0ZW1cbiAgICpcbiAgICogQGRlZmF1bHQgT3BlcmF0aW5nU3lzdGVtVHlwZS5MSU5VWFxuICAgKi9cbiAgcmVhZG9ubHkgb3M/OiBPcGVyYXRpbmdTeXN0ZW1UeXBlO1xuXG4gIC8qKlxuICAgKiBDdXN0b20gVXNlckRhdGFcbiAgICpcbiAgICogQGRlZmF1bHQgLSBVc2VyRGF0YSBhcHByb3ByaWF0ZSBmb3IgdGhlIE9TXG4gICAqL1xuICByZWFkb25seSB1c2VyRGF0YT86IFVzZXJEYXRhO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBBTUkgSUQgaXMgY2FjaGVkIHRvIGJlIHN0YWJsZSBiZXR3ZWVuIGRlcGxveW1lbnRzXG4gICAqXG4gICAqIEJ5IGRlZmF1bHQsIHRoZSBuZXdlc3QgaW1hZ2UgaXMgdXNlZCBvbiBlYWNoIGRlcGxveW1lbnQuIFRoaXMgd2lsbCBjYXVzZVxuICAgKiBpbnN0YW5jZXMgdG8gYmUgcmVwbGFjZWQgd2hlbmV2ZXIgYSBuZXcgdmVyc2lvbiBpcyByZWxlYXNlZCwgYW5kIG1heSBjYXVzZVxuICAgKiBkb3dudGltZSBpZiB0aGVyZSBhcmVuJ3QgZW5vdWdoIHJ1bm5pbmcgaW5zdGFuY2VzIGluIHRoZSBBdXRvU2NhbGluZ0dyb3VwXG4gICAqIHRvIHJlc2NoZWR1bGUgdGhlIHRhc2tzIG9uLlxuICAgKlxuICAgKiBJZiBzZXQgdG8gdHJ1ZSwgdGhlIEFNSSBJRCB3aWxsIGJlIGNhY2hlZCBpbiBgY2RrLmNvbnRleHQuanNvbmAgYW5kIHRoZVxuICAgKiBzYW1lIHZhbHVlIHdpbGwgYmUgdXNlZCBvbiBmdXR1cmUgcnVucy4gWW91ciBpbnN0YW5jZXMgd2lsbCBub3QgYmUgcmVwbGFjZWRcbiAgICogYnV0IHlvdXIgQU1JIHZlcnNpb24gd2lsbCBncm93IG9sZCBvdmVyIHRpbWUuIFRvIHJlZnJlc2ggdGhlIEFNSSBsb29rdXAsXG4gICAqIHlvdSB3aWxsIGhhdmUgdG8gZXZpY3QgdGhlIHZhbHVlIGZyb20gdGhlIGNhY2hlIHVzaW5nIHRoZSBgY2RrIGNvbnRleHRgXG4gICAqIGNvbW1hbmQuIFNlZSBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vY2RrL2xhdGVzdC9ndWlkZS9jb250ZXh0Lmh0bWwgZm9yXG4gICAqIG1vcmUgaW5mb3JtYXRpb24uXG4gICAqXG4gICAqIENhbiBub3QgYmUgc2V0IHRvIGB0cnVlYCBpbiBlbnZpcm9ubWVudC1hZ25vc3RpYyBzdGFja3MuXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBjYWNoZWRJbkNvbnRleHQ/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFNlbGVjdCB0aGUgaW1hZ2UgYmFzZWQgb24gYSBnaXZlbiBTU00gcGFyYW1ldGVyXG4gKlxuICogVGhpcyBNYWNoaW5lIEltYWdlIGF1dG9tYXRpY2FsbHkgdXBkYXRlcyB0byB0aGUgbGF0ZXN0IHZlcnNpb24gb24gZXZlcnlcbiAqIGRlcGxveW1lbnQuIEJlIGF3YXJlIHRoaXMgd2lsbCBjYXVzZSB5b3VyIGluc3RhbmNlcyB0byBiZSByZXBsYWNlZCB3aGVuIGFcbiAqIG5ldyB2ZXJzaW9uIG9mIHRoZSBpbWFnZSBiZWNvbWVzIGF2YWlsYWJsZS4gRG8gbm90IHN0b3JlIHN0YXRlZnVsIGluZm9ybWF0aW9uXG4gKiBvbiB0aGUgaW5zdGFuY2UgaWYgeW91IGFyZSB1c2luZyB0aGlzIGltYWdlLlxuICpcbiAqIFRoZSBBTUkgSUQgaXMgc2VsZWN0ZWQgdXNpbmcgdGhlIHZhbHVlcyBwdWJsaXNoZWQgdG8gdGhlIFNTTSBwYXJhbWV0ZXIgc3RvcmUuXG4gKi9cbmNsYXNzIEdlbmVyaWNTc21QYXJhbWV0ZXJJbWFnZSBpbXBsZW1lbnRzIElNYWNoaW5lSW1hZ2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHBhcmFtZXRlck5hbWU6IHN0cmluZywgcHJpdmF0ZSByZWFkb25seSBwcm9wczogU3NtUGFyYW1ldGVySW1hZ2VPcHRpb25zID0ge30pIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGltYWdlIHRvIHVzZSBpbiB0aGUgZ2l2ZW4gY29udGV4dFxuICAgKi9cbiAgcHVibGljIGdldEltYWdlKHNjb3BlOiBDb25zdHJ1Y3QpOiBNYWNoaW5lSW1hZ2VDb25maWcge1xuICAgIGNvbnN0IGltYWdlSWQgPSBsb29rdXBJbWFnZShzY29wZSwgdGhpcy5wcm9wcy5jYWNoZWRJbkNvbnRleHQsIHRoaXMucGFyYW1ldGVyTmFtZSk7XG5cbiAgICBjb25zdCBvc1R5cGUgPSB0aGlzLnByb3BzLm9zID8/IE9wZXJhdGluZ1N5c3RlbVR5cGUuTElOVVg7XG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlSWQsXG4gICAgICBvc1R5cGUsXG4gICAgICB1c2VyRGF0YTogdGhpcy5wcm9wcy51c2VyRGF0YSA/PyAob3NUeXBlID09PSBPcGVyYXRpbmdTeXN0ZW1UeXBlLldJTkRPV1MgPyBVc2VyRGF0YS5mb3JXaW5kb3dzKCkgOiBVc2VyRGF0YS5mb3JMaW51eCgpKSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBvcHRpb25zIGZvciBXaW5kb3dzSW1hZ2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBXaW5kb3dzSW1hZ2VQcm9wcyB7XG4gIC8qKlxuICAgKiBJbml0aWFsIHVzZXIgZGF0YVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIEVtcHR5IFVzZXJEYXRhIGZvciBXaW5kb3dzIG1hY2hpbmVzXG4gICAqL1xuICByZWFkb25seSB1c2VyRGF0YT86IFVzZXJEYXRhO1xufVxuXG4vKipcbiAqIFNlbGVjdCB0aGUgbGF0ZXN0IHZlcnNpb24gb2YgdGhlIGluZGljYXRlZCBXaW5kb3dzIHZlcnNpb25cbiAqXG4gKiBUaGlzIE1hY2hpbmUgSW1hZ2UgYXV0b21hdGljYWxseSB1cGRhdGVzIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvbiBldmVyeVxuICogZGVwbG95bWVudC4gQmUgYXdhcmUgdGhpcyB3aWxsIGNhdXNlIHlvdXIgaW5zdGFuY2VzIHRvIGJlIHJlcGxhY2VkIHdoZW4gYVxuICogbmV3IHZlcnNpb24gb2YgdGhlIGltYWdlIGJlY29tZXMgYXZhaWxhYmxlLiBEbyBub3Qgc3RvcmUgc3RhdGVmdWwgaW5mb3JtYXRpb25cbiAqIG9uIHRoZSBpbnN0YW5jZSBpZiB5b3UgYXJlIHVzaW5nIHRoaXMgaW1hZ2UuXG4gKlxuICogVGhlIEFNSSBJRCBpcyBzZWxlY3RlZCB1c2luZyB0aGUgdmFsdWVzIHB1Ymxpc2hlZCB0byB0aGUgU1NNIHBhcmFtZXRlciBzdG9yZS5cbiAqXG4gKiBodHRwczovL2F3cy5hbWF6b24uY29tL2Jsb2dzL210L3F1ZXJ5LWZvci10aGUtbGF0ZXN0LXdpbmRvd3MtYW1pLXVzaW5nLXN5c3RlbXMtbWFuYWdlci1wYXJhbWV0ZXItc3RvcmUvXG4gKi9cbmV4cG9ydCBjbGFzcyBXaW5kb3dzSW1hZ2UgZXh0ZW5kcyBHZW5lcmljU1NNUGFyYW1ldGVySW1hZ2Uge1xuICBwcml2YXRlIHN0YXRpYyBERVBSRUNBVEVEX1ZFUlNJT05fTkFNRV9NQVA6IFBhcnRpYWw8UmVjb3JkPFdpbmRvd3NWZXJzaW9uLCBXaW5kb3dzVmVyc2lvbj4+ID0ge1xuICAgIFtXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDE2X0dFUk1BTF9GVUxMX0JBU0VdOiBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDE2X0dFUk1BTl9GVUxMX0JBU0UsXG4gICAgW1dpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTJfUjJfU1AxX1BPUlRVR0VTRV9CUkFaSUxfNjRCSVRfQ09SRV06IFdpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTJfUjJfU1AxX1BPUlRVR1VFU0VfQlJBWklMXzY0QklUX0NPUkUsXG4gICAgW1dpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTZfUE9SVFVHRVNFX1BPUlRVR0FMX0ZVTExfQkFTRV06IFdpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTZfUE9SVFVHVUVTRV9QT1JUVUdBTF9GVUxMX0JBU0UsXG4gICAgW1dpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTJfUjJfUlRNX1BPUlRVR0VTRV9CUkFaSUxfNjRCSVRfQkFTRV06IFdpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTJfUjJfUlRNX1BPUlRVR1VFU0VfQlJBWklMXzY0QklUX0JBU0UsXG4gICAgW1dpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTJfUjJfUlRNX1BPUlRVR0VTRV9QT1JUVUdBTF82NEJJVF9CQVNFXTpcbiAgICAgIFdpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTJfUjJfUlRNX1BPUlRVR1VFU0VfUE9SVFVHQUxfNjRCSVRfQkFTRSxcbiAgICBbV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxNl9QT1JUVUdFU0VfQlJBWklMX0ZVTExfQkFTRV06IFdpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTZfUE9SVFVHVUVTRV9CUkFaSUxfRlVMTF9CQVNFLFxuICAgIFtXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDEyX1NQMl9QT1JUVUdFU0VfQlJBWklMXzY0QklUX0JBU0VdOiBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDEyX1NQMl9QT1JUVUdVRVNFX0JSQVpJTF82NEJJVF9CQVNFLFxuICAgIFtXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDEyX1JUTV9QT1JUVUdFU0VfQlJBWklMXzY0QklUX0JBU0VdOiBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDEyX1JUTV9QT1JUVUdVRVNFX0JSQVpJTF82NEJJVF9CQVNFLFxuICAgIFtXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDA4X1IyX1NQMV9QT1JUVUdFU0VfQlJBWklMXzY0QklUX0JBU0VdOiBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDA4X1IyX1NQMV9QT1JUVUdVRVNFX0JSQVpJTF82NEJJVF9CQVNFLFxuICAgIFtXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDA4X1NQMl9QT1JUVUdFU0VfQlJBWklMXzMyQklUX0JBU0VdOiBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDA4X1NQMl9QT1JUVUdVRVNFX0JSQVpJTF8zMkJJVF9CQVNFLFxuICAgIFtXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDEyX1JUTV9QT1JUVUdFU0VfUE9SVFVHQUxfNjRCSVRfQkFTRV06IFdpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTJfUlRNX1BPUlRVR1VFU0VfUE9SVFVHQUxfNjRCSVRfQkFTRSxcbiAgICBbV2luZG93c1ZlcnNpb24uV0lORE9XU19TRVJWRVJfMjAxOV9QT1JUVUdFU0VfQlJBWklMX0ZVTExfQkFTRV06IFdpbmRvd3NWZXJzaW9uLldJTkRPV1NfU0VSVkVSXzIwMTlfUE9SVFVHVUVTRV9CUkFaSUxfRlVMTF9CQVNFLFxuICAgIFtXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDE5X1BPUlRVR0VTRV9QT1JUVUdBTF9GVUxMX0JBU0VdOiBXaW5kb3dzVmVyc2lvbi5XSU5ET1dTX1NFUlZFUl8yMDE5X1BPUlRVR1VFU0VfUE9SVFVHQUxfRlVMTF9CQVNFLFxuICB9XG4gIGNvbnN0cnVjdG9yKHZlcnNpb246IFdpbmRvd3NWZXJzaW9uLCBwcm9wczogV2luZG93c0ltYWdlUHJvcHMgPSB7fSkge1xuICAgIGNvbnN0IG5vbkRlcHJlY2F0ZWRWZXJzaW9uTmFtZSA9IFdpbmRvd3NJbWFnZS5ERVBSRUNBVEVEX1ZFUlNJT05fTkFNRV9NQVBbdmVyc2lvbl0gPz8gdmVyc2lvbjtcbiAgICBzdXBlcignL2F3cy9zZXJ2aWNlL2FtaS13aW5kb3dzLWxhdGVzdC8nICsgbm9uRGVwcmVjYXRlZFZlcnNpb25OYW1lLCBPcGVyYXRpbmdTeXN0ZW1UeXBlLldJTkRPV1MsIHByb3BzLnVzZXJEYXRhKTtcbiAgfVxufVxuXG4vKipcbiAqIENQVSB0eXBlXG4gKi9cbmV4cG9ydCBlbnVtIEFtYXpvbkxpbnV4Q3B1VHlwZSB7XG4gIC8qKlxuICAgKiBhcm02NCBDUFUgdHlwZVxuICAgKi9cbiAgQVJNXzY0ID0gJ2FybTY0JyxcblxuICAvKipcbiAgICogeDg2XzY0IENQVSB0eXBlXG4gICAqL1xuICBYODZfNjQgPSAneDg2XzY0Jyxcbn1cblxuLyoqXG4gKiBBbWF6b24gTGludXggaW1hZ2UgcHJvcGVydGllc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIEFtYXpvbkxpbnV4SW1hZ2VQcm9wcyB7XG4gIC8qKlxuICAgKiBXaGF0IGdlbmVyYXRpb24gb2YgQW1hem9uIExpbnV4IHRvIHVzZVxuICAgKlxuICAgKiBAZGVmYXVsdCBBbWF6b25MaW51eFxuICAgKi9cbiAgcmVhZG9ubHkgZ2VuZXJhdGlvbj86IEFtYXpvbkxpbnV4R2VuZXJhdGlvbjtcblxuICAvKipcbiAgICogV2hhdCBlZGl0aW9uIG9mIEFtYXpvbiBMaW51eCB0byB1c2VcbiAgICpcbiAgICogQGRlZmF1bHQgU3RhbmRhcmRcbiAgICovXG4gIHJlYWRvbmx5IGVkaXRpb24/OiBBbWF6b25MaW51eEVkaXRpb247XG5cbiAgLyoqXG4gICAqIFdoYXQga2VybmVsIHZlcnNpb24gb2YgQW1hem9uIExpbnV4IHRvIHVzZVxuICAgKlxuICAgKiBAZGVmYXVsdCAtXG4gICAqL1xuICByZWFkb25seSBrZXJuZWw/OiBBbWF6b25MaW51eEtlcm5lbDtcblxuICAvKipcbiAgICogVmlydHVhbGl6YXRpb24gdHlwZVxuICAgKlxuICAgKiBAZGVmYXVsdCBIVk1cbiAgICovXG4gIHJlYWRvbmx5IHZpcnR1YWxpemF0aW9uPzogQW1hem9uTGludXhWaXJ0O1xuXG4gIC8qKlxuICAgKiBXaGF0IHN0b3JhZ2UgYmFja2VkIGltYWdlIHRvIHVzZVxuICAgKlxuICAgKiBAZGVmYXVsdCBHZW5lcmFsUHVycG9zZVxuICAgKi9cbiAgcmVhZG9ubHkgc3RvcmFnZT86IEFtYXpvbkxpbnV4U3RvcmFnZTtcblxuICAvKipcbiAgICogSW5pdGlhbCB1c2VyIGRhdGFcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFbXB0eSBVc2VyRGF0YSBmb3IgTGludXggbWFjaGluZXNcbiAgICovXG4gIHJlYWRvbmx5IHVzZXJEYXRhPzogVXNlckRhdGE7XG5cbiAgLyoqXG4gICAqIENQVSBUeXBlXG4gICAqXG4gICAqIEBkZWZhdWx0IFg4Nl82NFxuICAgKi9cbiAgcmVhZG9ubHkgY3B1VHlwZT86IEFtYXpvbkxpbnV4Q3B1VHlwZTtcblxuICAvKipcbiAgICogV2hldGhlciB0aGUgQU1JIElEIGlzIGNhY2hlZCB0byBiZSBzdGFibGUgYmV0d2VlbiBkZXBsb3ltZW50c1xuICAgKlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgbmV3ZXN0IGltYWdlIGlzIHVzZWQgb24gZWFjaCBkZXBsb3ltZW50LiBUaGlzIHdpbGwgY2F1c2VcbiAgICogaW5zdGFuY2VzIHRvIGJlIHJlcGxhY2VkIHdoZW5ldmVyIGEgbmV3IHZlcnNpb24gaXMgcmVsZWFzZWQsIGFuZCBtYXkgY2F1c2VcbiAgICogZG93bnRpbWUgaWYgdGhlcmUgYXJlbid0IGVub3VnaCBydW5uaW5nIGluc3RhbmNlcyBpbiB0aGUgQXV0b1NjYWxpbmdHcm91cFxuICAgKiB0byByZXNjaGVkdWxlIHRoZSB0YXNrcyBvbi5cbiAgICpcbiAgICogSWYgc2V0IHRvIHRydWUsIHRoZSBBTUkgSUQgd2lsbCBiZSBjYWNoZWQgaW4gYGNkay5jb250ZXh0Lmpzb25gIGFuZCB0aGVcbiAgICogc2FtZSB2YWx1ZSB3aWxsIGJlIHVzZWQgb24gZnV0dXJlIHJ1bnMuIFlvdXIgaW5zdGFuY2VzIHdpbGwgbm90IGJlIHJlcGxhY2VkXG4gICAqIGJ1dCB5b3VyIEFNSSB2ZXJzaW9uIHdpbGwgZ3JvdyBvbGQgb3ZlciB0aW1lLiBUbyByZWZyZXNoIHRoZSBBTUkgbG9va3VwLFxuICAgKiB5b3Ugd2lsbCBoYXZlIHRvIGV2aWN0IHRoZSB2YWx1ZSBmcm9tIHRoZSBjYWNoZSB1c2luZyB0aGUgYGNkayBjb250ZXh0YFxuICAgKiBjb21tYW5kLiBTZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9sYXRlc3QvZ3VpZGUvY29udGV4dC5odG1sIGZvclxuICAgKiBtb3JlIGluZm9ybWF0aW9uLlxuICAgKlxuICAgKiBDYW4gbm90IGJlIHNldCB0byBgdHJ1ZWAgaW4gZW52aXJvbm1lbnQtYWdub3N0aWMgc3RhY2tzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgY2FjaGVkSW5Db250ZXh0PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBTZWxlY3RzIHRoZSBsYXRlc3QgdmVyc2lvbiBvZiBBbWF6b24gTGludXhcbiAqXG4gKiBUaGlzIE1hY2hpbmUgSW1hZ2UgYXV0b21hdGljYWxseSB1cGRhdGVzIHRvIHRoZSBsYXRlc3QgdmVyc2lvbiBvbiBldmVyeVxuICogZGVwbG95bWVudC4gQmUgYXdhcmUgdGhpcyB3aWxsIGNhdXNlIHlvdXIgaW5zdGFuY2VzIHRvIGJlIHJlcGxhY2VkIHdoZW4gYVxuICogbmV3IHZlcnNpb24gb2YgdGhlIGltYWdlIGJlY29tZXMgYXZhaWxhYmxlLiBEbyBub3Qgc3RvcmUgc3RhdGVmdWwgaW5mb3JtYXRpb25cbiAqIG9uIHRoZSBpbnN0YW5jZSBpZiB5b3UgYXJlIHVzaW5nIHRoaXMgaW1hZ2UuXG4gKlxuICogVGhlIEFNSSBJRCBpcyBzZWxlY3RlZCB1c2luZyB0aGUgdmFsdWVzIHB1Ymxpc2hlZCB0byB0aGUgU1NNIHBhcmFtZXRlciBzdG9yZS5cbiAqL1xuZXhwb3J0IGNsYXNzIEFtYXpvbkxpbnV4SW1hZ2UgZXh0ZW5kcyBHZW5lcmljU1NNUGFyYW1ldGVySW1hZ2Uge1xuICAvKipcbiAgICogUmV0dXJuIHRoZSBTU00gcGFyYW1ldGVyIG5hbWUgdGhhdCB3aWxsIGNvbnRhaW4gdGhlIEFtYXpvbiBMaW51eCBpbWFnZSB3aXRoIHRoZSBnaXZlbiBhdHRyaWJ1dGVzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHNzbVBhcmFtZXRlck5hbWUocHJvcHM6IEFtYXpvbkxpbnV4SW1hZ2VQcm9wcyA9IHt9KSB7XG4gICAgY29uc3QgZ2VuZXJhdGlvbiA9IChwcm9wcyAmJiBwcm9wcy5nZW5lcmF0aW9uKSB8fCBBbWF6b25MaW51eEdlbmVyYXRpb24uQU1BWk9OX0xJTlVYO1xuICAgIGNvbnN0IGVkaXRpb24gPSAocHJvcHMgJiYgcHJvcHMuZWRpdGlvbikgfHwgQW1hem9uTGludXhFZGl0aW9uLlNUQU5EQVJEO1xuICAgIGNvbnN0IGNwdSA9IChwcm9wcyAmJiBwcm9wcy5jcHVUeXBlKSB8fCBBbWF6b25MaW51eENwdVR5cGUuWDg2XzY0O1xuICAgIGxldCBrZXJuZWwgPSAocHJvcHMgJiYgcHJvcHMua2VybmVsKSB8fCB1bmRlZmluZWQ7XG4gICAgbGV0IHZpcnR1YWxpemF0aW9uOiBBbWF6b25MaW51eFZpcnQgfCB1bmRlZmluZWQ7XG4gICAgbGV0IHN0b3JhZ2U6IEFtYXpvbkxpbnV4U3RvcmFnZSB8IHVuZGVmaW5lZDtcblxuICAgIGlmIChnZW5lcmF0aW9uID09PSBBbWF6b25MaW51eEdlbmVyYXRpb24uQU1BWk9OX0xJTlVYXzIwMjIpIHtcbiAgICAgIGtlcm5lbCA9IEFtYXpvbkxpbnV4S2VybmVsLktFUk5FTDVfWDtcbiAgICAgIGlmIChwcm9wcyAmJiBwcm9wcy5zdG9yYWdlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3RvcmFnZSBwYXJhbWV0ZXIgZG9lcyBub3QgZXhpc3QgaW4gc21tIHBhcmFtZXRlciBuYW1lIGZvciBBbWF6b24gTGludXggMjAyMi4nKTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9wcyAmJiBwcm9wcy52aXJ0dWFsaXphdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZpcnR1YWxpemF0aW9uIHBhcmFtZXRlciBkb2VzIG5vdCBleGlzdCBpbiBzbW0gcGFyYW1ldGVyIG5hbWUgZm9yIEFtYXpvbiBMaW51eCAyMDIyLicpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB2aXJ0dWFsaXphdGlvbiA9IChwcm9wcyAmJiBwcm9wcy52aXJ0dWFsaXphdGlvbikgfHwgQW1hem9uTGludXhWaXJ0LkhWTTtcbiAgICAgIHN0b3JhZ2UgPSAocHJvcHMgJiYgcHJvcHMuc3RvcmFnZSkgfHwgQW1hem9uTGludXhTdG9yYWdlLkdFTkVSQUxfUFVSUE9TRTtcbiAgICB9XG5cbiAgICBjb25zdCBwYXJ0czogQXJyYXk8c3RyaW5nfHVuZGVmaW5lZD4gPSBbXG4gICAgICBnZW5lcmF0aW9uLFxuICAgICAgJ2FtaScsXG4gICAgICBlZGl0aW9uICE9PSBBbWF6b25MaW51eEVkaXRpb24uU1RBTkRBUkQgPyBlZGl0aW9uIDogdW5kZWZpbmVkLFxuICAgICAga2VybmVsLFxuICAgICAgdmlydHVhbGl6YXRpb24sXG4gICAgICBjcHUsXG4gICAgICBzdG9yYWdlLFxuICAgIF0uZmlsdGVyKHggPT4geCAhPT0gdW5kZWZpbmVkKTsgLy8gR2V0IHJpZCBvZiB1bmRlZmluZWRzXG5cbiAgICByZXR1cm4gJy9hd3Mvc2VydmljZS9hbWktYW1hem9uLWxpbnV4LWxhdGVzdC8nICsgcGFydHMuam9pbignLScpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBjYWNoZWRJbkNvbnRleHQ6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogQW1hem9uTGludXhJbWFnZVByb3BzID0ge30pIHtcbiAgICBzdXBlcihBbWF6b25MaW51eEltYWdlLnNzbVBhcmFtZXRlck5hbWUocHJvcHMpLCBPcGVyYXRpbmdTeXN0ZW1UeXBlLkxJTlVYLCBwcm9wcy51c2VyRGF0YSk7XG5cbiAgICB0aGlzLmNhY2hlZEluQ29udGV4dCA9IHByb3BzLmNhY2hlZEluQ29udGV4dCA/PyBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGltYWdlIHRvIHVzZSBpbiB0aGUgZ2l2ZW4gY29udGV4dFxuICAgKi9cbiAgcHVibGljIGdldEltYWdlKHNjb3BlOiBDb25zdHJ1Y3QpOiBNYWNoaW5lSW1hZ2VDb25maWcge1xuICAgIGNvbnN0IGltYWdlSWQgPSBsb29rdXBJbWFnZShzY29wZSwgdGhpcy5jYWNoZWRJbkNvbnRleHQsIHRoaXMucGFyYW1ldGVyTmFtZSk7XG5cbiAgICBjb25zdCBvc1R5cGUgPSBPcGVyYXRpbmdTeXN0ZW1UeXBlLkxJTlVYO1xuICAgIHJldHVybiB7XG4gICAgICBpbWFnZUlkLFxuICAgICAgb3NUeXBlLFxuICAgICAgdXNlckRhdGE6IHRoaXMucHJvcHMudXNlckRhdGEgPz8gVXNlckRhdGEuZm9yTGludXgoKSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogV2hhdCBnZW5lcmF0aW9uIG9mIEFtYXpvbiBMaW51eCB0byB1c2VcbiAqL1xuZXhwb3J0IGVudW0gQW1hem9uTGludXhHZW5lcmF0aW9uIHtcbiAgLyoqXG4gICAqIEFtYXpvbiBMaW51eFxuICAgKi9cbiAgQU1BWk9OX0xJTlVYID0gJ2Ftem4nLFxuXG4gIC8qKlxuICAgKiBBbWF6b24gTGludXggMlxuICAgKi9cbiAgQU1BWk9OX0xJTlVYXzIgPSAnYW16bjInLFxuXG4gIC8qKlxuICAgKiBBbWF6b24gTGludXggMjAyMlxuICAgKi9cbiAgQU1BWk9OX0xJTlVYXzIwMjIgPSAnYWwyMDIyJyxcbn1cblxuLyoqXG4gKiBBbWF6b24gTGludXggS2VybmVsXG4gKi9cbmV4cG9ydCBlbnVtIEFtYXpvbkxpbnV4S2VybmVsIHtcbiAgLyoqXG4gICAqIFN0YW5kYXJkIGVkaXRpb25cbiAgICovXG4gIEtFUk5FTDVfWCA9ICdrZXJuZWwtNS4xMCcsXG59XG5cbi8qKlxuICogQW1hem9uIExpbnV4IGVkaXRpb25cbiAqL1xuZXhwb3J0IGVudW0gQW1hem9uTGludXhFZGl0aW9uIHtcbiAgLyoqXG4gICAqIFN0YW5kYXJkIGVkaXRpb25cbiAgICovXG4gIFNUQU5EQVJEID0gJ3N0YW5kYXJkJyxcblxuICAvKipcbiAgICogTWluaW1hbCBlZGl0aW9uXG4gICAqL1xuICBNSU5JTUFMID0gJ21pbmltYWwnLFxufVxuXG4vKipcbiAqIFZpcnR1YWxpemF0aW9uIHR5cGUgZm9yIEFtYXpvbiBMaW51eFxuICovXG5leHBvcnQgZW51bSBBbWF6b25MaW51eFZpcnQge1xuICAvKipcbiAgICogSFZNIHZpcnR1YWxpemF0aW9uIChyZWNvbW1lbmRlZClcbiAgICovXG4gIEhWTSA9ICdodm0nLFxuXG4gIC8qKlxuICAgKiBQViB2aXJ0dWFsaXphdGlvblxuICAgKi9cbiAgUFYgPSAncHYnLFxufVxuXG5leHBvcnQgZW51bSBBbWF6b25MaW51eFN0b3JhZ2Uge1xuICAvKipcbiAgICogRUJTLWJhY2tlZCBzdG9yYWdlXG4gICAqL1xuICBFQlMgPSAnZWJzJyxcblxuICAvKipcbiAgICogUzMtYmFja2VkIHN0b3JhZ2VcbiAgICovXG4gIFMzID0gJ3MzJyxcblxuICAvKipcbiAgICogR2VuZXJhbCBQdXJwb3NlLWJhc2VkIHN0b3JhZ2UgKHJlY29tbWVuZGVkKVxuICAgKi9cbiAgR0VORVJBTF9QVVJQT1NFID0gJ2dwMicsXG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBvcHRpb25zIGZvciBHZW5lcmljTGludXhJbWFnZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyaWNMaW51eEltYWdlUHJvcHMge1xuICAvKipcbiAgICogSW5pdGlhbCB1c2VyIGRhdGFcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFbXB0eSBVc2VyRGF0YSBmb3IgTGludXggbWFjaGluZXNcbiAgICovXG4gIHJlYWRvbmx5IHVzZXJEYXRhPzogVXNlckRhdGE7XG59XG5cbi8qKlxuICogQ29uZmlndXJhdGlvbiBvcHRpb25zIGZvciBHZW5lcmljV2luZG93c0ltYWdlXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJpY1dpbmRvd3NJbWFnZVByb3BzIHtcbiAgLyoqXG4gICAqIEluaXRpYWwgdXNlciBkYXRhXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gRW1wdHkgVXNlckRhdGEgZm9yIFdpbmRvd3MgbWFjaGluZXNcbiAgICovXG4gIHJlYWRvbmx5IHVzZXJEYXRhPzogVXNlckRhdGE7XG59XG5cbi8qKlxuICogQ29uc3RydWN0IGEgTGludXggbWFjaGluZSBpbWFnZSBmcm9tIGFuIEFNSSBtYXBcbiAqXG4gKiBMaW51eCBpbWFnZXMgSURzIGFyZSBub3QgcHVibGlzaGVkIHRvIFNTTSBwYXJhbWV0ZXIgc3RvcmUgeWV0LCBzbyB5b3UnbGwgaGF2ZSB0b1xuICogbWFudWFsbHkgc3BlY2lmeSBhbiBBTUkgbWFwLlxuICovXG5leHBvcnQgY2xhc3MgR2VuZXJpY0xpbnV4SW1hZ2UgaW1wbGVtZW50cyBJTWFjaGluZUltYWdlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhbWlNYXA6IHsgW3JlZ2lvbjogc3RyaW5nXTogc3RyaW5nIH0sIHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IEdlbmVyaWNMaW51eEltYWdlUHJvcHMgPSB7fSkge1xuICB9XG5cbiAgcHVibGljIGdldEltYWdlKHNjb3BlOiBDb25zdHJ1Y3QpOiBNYWNoaW5lSW1hZ2VDb25maWcge1xuICAgIGNvbnN0IHVzZXJEYXRhID0gdGhpcy5wcm9wcy51c2VyRGF0YSA/PyBVc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgIGNvbnN0IG9zVHlwZSA9IE9wZXJhdGluZ1N5c3RlbVR5cGUuTElOVVg7XG4gICAgY29uc3QgcmVnaW9uID0gU3RhY2sub2Yoc2NvcGUpLnJlZ2lvbjtcbiAgICBpZiAoVG9rZW4uaXNVbnJlc29sdmVkKHJlZ2lvbikpIHtcbiAgICAgIGNvbnN0IG1hcHBpbmc6IHsgW2sxOiBzdHJpbmddOiB7IFtrMjogc3RyaW5nXTogYW55IH0gfSA9IHt9O1xuICAgICAgZm9yIChjb25zdCBbcmduLCBhbWldIG9mIE9iamVjdC5lbnRyaWVzKHRoaXMuYW1pTWFwKSkge1xuICAgICAgICBtYXBwaW5nW3Jnbl0gPSB7IGFtaSB9O1xuICAgICAgfVxuICAgICAgY29uc3QgYW1pTWFwID0gbmV3IENmbk1hcHBpbmcoc2NvcGUsICdBbWlNYXAnLCB7IG1hcHBpbmcgfSk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbWFnZUlkOiBhbWlNYXAuZmluZEluTWFwKEF3cy5SRUdJT04sICdhbWknKSxcbiAgICAgICAgdXNlckRhdGEsXG4gICAgICAgIG9zVHlwZSxcbiAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IGltYWdlSWQgPSByZWdpb24gIT09ICd0ZXN0LXJlZ2lvbicgPyB0aGlzLmFtaU1hcFtyZWdpb25dIDogJ2FtaS0xMjM0NSc7XG4gICAgaWYgKCFpbWFnZUlkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBmaW5kIEFNSSBpbiBBTUkgbWFwOiBubyBBTUkgc3BlY2lmaWVkIGZvciByZWdpb24gJyR7cmVnaW9ufSdgKTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlSWQsXG4gICAgICB1c2VyRGF0YSxcbiAgICAgIG9zVHlwZSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQ29uc3RydWN0IGEgV2luZG93cyBtYWNoaW5lIGltYWdlIGZyb20gYW4gQU1JIG1hcFxuICpcbiAqIEFsbG93cyB5b3UgdG8gY3JlYXRlIGEgZ2VuZXJpYyBXaW5kb3dzIEVDMiAsIG1hbnVhbGx5IHNwZWNpZnkgYW4gQU1JIG1hcC5cbiAqL1xuZXhwb3J0IGNsYXNzIEdlbmVyaWNXaW5kb3dzSW1hZ2UgaW1wbGVtZW50cyBJTWFjaGluZUltYWdlIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBhbWlNYXA6IHtbcmVnaW9uOiBzdHJpbmddOiBzdHJpbmd9LCBwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBHZW5lcmljV2luZG93c0ltYWdlUHJvcHMgPSB7fSkge1xuICB9XG5cbiAgcHVibGljIGdldEltYWdlKHNjb3BlOiBDb25zdHJ1Y3QpOiBNYWNoaW5lSW1hZ2VDb25maWcge1xuICAgIGNvbnN0IHVzZXJEYXRhID0gdGhpcy5wcm9wcy51c2VyRGF0YSA/PyBVc2VyRGF0YS5mb3JXaW5kb3dzKCk7XG4gICAgY29uc3Qgb3NUeXBlID0gT3BlcmF0aW5nU3lzdGVtVHlwZS5XSU5ET1dTO1xuICAgIGNvbnN0IHJlZ2lvbiA9IFN0YWNrLm9mKHNjb3BlKS5yZWdpb247XG4gICAgaWYgKFRva2VuLmlzVW5yZXNvbHZlZChyZWdpb24pKSB7XG4gICAgICBjb25zdCBtYXBwaW5nOiB7IFtrMTogc3RyaW5nXTogeyBbazI6IHN0cmluZ106IGFueSB9IH0gPSB7fTtcbiAgICAgIGZvciAoY29uc3QgW3JnbiwgYW1pXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmFtaU1hcCkpIHtcbiAgICAgICAgbWFwcGluZ1tyZ25dID0geyBhbWkgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFtaU1hcCA9IG5ldyBDZm5NYXBwaW5nKHNjb3BlLCAnQW1pTWFwJywgeyBtYXBwaW5nIH0pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW1hZ2VJZDogYW1pTWFwLmZpbmRJbk1hcChBd3MuUkVHSU9OLCAnYW1pJyksXG4gICAgICAgIHVzZXJEYXRhLFxuICAgICAgICBvc1R5cGUsXG4gICAgICB9O1xuICAgIH1cbiAgICBjb25zdCBpbWFnZUlkID0gcmVnaW9uICE9PSAndGVzdC1yZWdpb24nID8gdGhpcy5hbWlNYXBbcmVnaW9uXSA6ICdhbWktMTIzNDUnO1xuICAgIGlmICghaW1hZ2VJZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gZmluZCBBTUkgaW4gQU1JIG1hcDogbm8gQU1JIHNwZWNpZmllZCBmb3IgcmVnaW9uICcke3JlZ2lvbn0nYCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBpbWFnZUlkLFxuICAgICAgdXNlckRhdGEsXG4gICAgICBvc1R5cGUsXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSBPUyB0eXBlIG9mIGEgcGFydGljdWxhciBpbWFnZVxuICovXG5leHBvcnQgZW51bSBPcGVyYXRpbmdTeXN0ZW1UeXBlIHtcbiAgTElOVVgsXG4gIFdJTkRPV1MsXG4gIC8qKlxuICAgKiBVc2VkIHdoZW4gdGhlIHR5cGUgb2YgdGhlIG9wZXJhdGluZyBzeXN0ZW0gaXMgbm90IGtub3duXG4gICAqIChmb3IgZXhhbXBsZSwgZm9yIGltcG9ydGVkIEF1dG8tU2NhbGluZyBHcm91cHMpLlxuICAgKi9cbiAgVU5LTk9XTixcbn1cblxuLyoqXG4gKiBBIG1hY2hpbmUgaW1hZ2Ugd2hvc2UgQU1JIElEIHdpbGwgYmUgc2VhcmNoZWQgdXNpbmcgRGVzY3JpYmVJbWFnZXMuXG4gKlxuICogVGhlIG1vc3QgcmVjZW50LCBhdmFpbGFibGUsIGxhdW5jaGFibGUgaW1hZ2UgbWF0Y2hpbmcgdGhlIGdpdmVuIGZpbHRlclxuICogY3JpdGVyaWEgd2lsbCBiZSB1c2VkLiBMb29raW5nIHVwIEFNSXMgbWF5IHRha2UgYSBsb25nIHRpbWU7IHNwZWNpZnlcbiAqIGFzIG1hbnkgZmlsdGVyIGNyaXRlcmlhIGFzIHBvc3NpYmxlIHRvIG5hcnJvdyBkb3duIHRoZSBzZWFyY2guXG4gKlxuICogVGhlIEFNSSBzZWxlY3RlZCB3aWxsIGJlIGNhY2hlZCBpbiBgY2RrLmNvbnRleHQuanNvbmAgYW5kIHRoZSBzYW1lIHZhbHVlXG4gKiB3aWxsIGJlIHVzZWQgb24gZnV0dXJlIHJ1bnMuIFRvIHJlZnJlc2ggdGhlIEFNSSBsb29rdXAsIHlvdSB3aWxsIGhhdmUgdG9cbiAqIGV2aWN0IHRoZSB2YWx1ZSBmcm9tIHRoZSBjYWNoZSB1c2luZyB0aGUgYGNkayBjb250ZXh0YCBjb21tYW5kLiBTZWVcbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9jZGsvbGF0ZXN0L2d1aWRlL2NvbnRleHQuaHRtbCBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqL1xuZXhwb3J0IGNsYXNzIExvb2t1cE1hY2hpbmVJbWFnZSBpbXBsZW1lbnRzIElNYWNoaW5lSW1hZ2Uge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBMb29rdXBNYWNoaW5lSW1hZ2VQcm9wcykge1xuICB9XG5cbiAgcHVibGljIGdldEltYWdlKHNjb3BlOiBDb25zdHJ1Y3QpOiBNYWNoaW5lSW1hZ2VDb25maWcge1xuICAgIC8vIE5lZWQgdG8ga25vdyAnd2luZG93cycgb3Igbm90IGJlZm9yZSBkb2luZyB0aGUgcXVlcnkgdG8gcmV0dXJuIHRoZSByaWdodFxuICAgIC8vIG9zVHlwZSBmb3IgdGhlIGR1bW15IHZhbHVlLCBzbyBtaWdodCBhcyB3ZWxsIGFkZCBpdCB0byB0aGUgZmlsdGVyLlxuICAgIGNvbnN0IGZpbHRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdIHwgdW5kZWZpbmVkPiA9IHtcbiAgICAgICduYW1lJzogW3RoaXMucHJvcHMubmFtZV0sXG4gICAgICAnc3RhdGUnOiBbJ2F2YWlsYWJsZSddLFxuICAgICAgJ2ltYWdlLXR5cGUnOiBbJ21hY2hpbmUnXSxcbiAgICAgICdwbGF0Zm9ybSc6IHRoaXMucHJvcHMud2luZG93cyA/IFsnd2luZG93cyddIDogdW5kZWZpbmVkLFxuICAgIH07XG4gICAgT2JqZWN0LmFzc2lnbihmaWx0ZXJzLCB0aGlzLnByb3BzLmZpbHRlcnMpO1xuXG4gICAgY29uc3QgdmFsdWUgPSBDb250ZXh0UHJvdmlkZXIuZ2V0VmFsdWUoc2NvcGUsIHtcbiAgICAgIHByb3ZpZGVyOiBjeHNjaGVtYS5Db250ZXh0UHJvdmlkZXIuQU1JX1BST1ZJREVSLFxuICAgICAgcHJvcHM6IHtcbiAgICAgICAgb3duZXJzOiB0aGlzLnByb3BzLm93bmVycyxcbiAgICAgICAgZmlsdGVycyxcbiAgICAgIH0gYXMgY3hzY2hlbWEuQW1pQ29udGV4dFF1ZXJ5LFxuICAgICAgZHVtbXlWYWx1ZTogJ2FtaS0xMjM0JyxcbiAgICB9KS52YWx1ZSBhcyBjeGFwaS5BbWlDb250ZXh0UmVzcG9uc2U7XG5cbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZXNwb25zZSB0byBBTUkgbG9va3VwIGludmFsaWQsIGdvdDogJHt2YWx1ZX1gKTtcbiAgICB9XG5cbiAgICBjb25zdCBvc1R5cGUgPSB0aGlzLnByb3BzLndpbmRvd3MgPyBPcGVyYXRpbmdTeXN0ZW1UeXBlLldJTkRPV1MgOiBPcGVyYXRpbmdTeXN0ZW1UeXBlLkxJTlVYO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGltYWdlSWQ6IHZhbHVlLFxuICAgICAgb3NUeXBlLFxuICAgICAgdXNlckRhdGE6IHRoaXMucHJvcHMudXNlckRhdGEgPz8gVXNlckRhdGEuZm9yT3BlcmF0aW5nU3lzdGVtKG9zVHlwZSksXG4gICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIFByb3BlcnRpZXMgZm9yIGxvb2tpbmcgdXAgYW4gaW1hZ2VcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb29rdXBNYWNoaW5lSW1hZ2VQcm9wcyB7XG4gIC8qKlxuICAgKiBOYW1lIG9mIHRoZSBpbWFnZSAobWF5IGNvbnRhaW4gd2lsZGNhcmRzKVxuICAgKi9cbiAgcmVhZG9ubHkgbmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBPd25lciBhY2NvdW50IElEcyBvciBhbGlhc2VzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gQWxsIG93bmVyc1xuICAgKi9cbiAgcmVhZG9ubHkgb3duZXJzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEFkZGl0aW9uYWwgZmlsdGVycyBvbiB0aGUgQU1JXG4gICAqXG4gICAqIEBzZWUgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9EZXNjcmliZUltYWdlcy5odG1sXG4gICAqIEBkZWZhdWx0IC0gTm8gYWRkaXRpb25hbCBmaWx0ZXJzXG4gICAqL1xuICByZWFkb25seSBmaWx0ZXJzPzoge1trZXk6IHN0cmluZ106IHN0cmluZ1tdfTtcblxuICAvKipcbiAgICogTG9vayBmb3IgV2luZG93cyBpbWFnZXNcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IHdpbmRvd3M/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBDdXN0b20gdXNlcmRhdGEgZm9yIHRoaXMgaW1hZ2VcbiAgICpcbiAgICogQGRlZmF1bHQgLSBFbXB0eSB1c2VyIGRhdGEgYXBwcm9wcmlhdGUgZm9yIHRoZSBwbGF0Zm9ybSB0eXBlXG4gICAqL1xuICByZWFkb25seSB1c2VyRGF0YT86IFVzZXJEYXRhO1xufVxuXG5mdW5jdGlvbiBsb29rdXBJbWFnZShzY29wZTogQ29uc3RydWN0LCBjYWNoZWRJbkNvbnRleHQ6IGJvb2xlYW4gfCB1bmRlZmluZWQsIHBhcmFtZXRlck5hbWU6IHN0cmluZykge1xuICByZXR1cm4gY2FjaGVkSW5Db250ZXh0XG4gICAgPyBzc20uU3RyaW5nUGFyYW1ldGVyLnZhbHVlRnJvbUxvb2t1cChzY29wZSwgcGFyYW1ldGVyTmFtZSlcbiAgICA6IHNzbS5TdHJpbmdQYXJhbWV0ZXIudmFsdWVGb3JUeXBlZFN0cmluZ1BhcmFtZXRlclYyKHNjb3BlLCBwYXJhbWV0ZXJOYW1lLCBzc20uUGFyYW1ldGVyVmFsdWVUeXBlLkFXU19FQzJfSU1BR0VfSUQpO1xufVxuIl19