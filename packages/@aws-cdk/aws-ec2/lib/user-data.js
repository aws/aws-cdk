"use strict";
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipartUserData = exports.MultipartBody = exports.UserData = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const machine_image_1 = require("./machine-image");
/**
 * Instance User Data
 */
class UserData {
    /**
     * Create a userdata object for Linux hosts
     */
    static forLinux(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_LinuxUserDataOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.forLinux);
            }
            throw error;
        }
        return new LinuxUserData(options);
    }
    /**
     * Create a userdata object for Windows hosts
     */
    static forWindows(options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_WindowsUserDataOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.forWindows);
            }
            throw error;
        }
        return new WindowsUserData(options);
    }
    /**
     * Create a userdata object with custom content
     */
    static custom(content) {
        const userData = new CustomUserData();
        userData.addCommands(content);
        return userData;
    }
    static forOperatingSystem(os) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_OperatingSystemType(os);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.forOperatingSystem);
            }
            throw error;
        }
        switch (os) {
            case machine_image_1.OperatingSystemType.LINUX: return UserData.forLinux();
            case machine_image_1.OperatingSystemType.WINDOWS: return UserData.forWindows();
            case machine_image_1.OperatingSystemType.UNKNOWN: throw new Error('Cannot determine UserData for unknown operating system type');
        }
    }
}
_a = JSII_RTTI_SYMBOL_1;
UserData[_a] = { fqn: "@aws-cdk/aws-ec2.UserData", version: "0.0.0" };
exports.UserData = UserData;
/**
 * Linux Instance User Data
 */
class LinuxUserData extends UserData {
    constructor(props = {}) {
        super();
        this.props = props;
        this.lines = [];
        this.onExitLines = [];
    }
    addCommands(...commands) {
        this.lines.push(...commands);
    }
    addOnExitCommands(...commands) {
        this.onExitLines.push(...commands);
    }
    render() {
        const shebang = this.props.shebang ?? '#!/bin/bash';
        return [shebang, ...(this.renderOnExitLines()), ...this.lines].join('\n');
    }
    addS3DownloadCommand(params) {
        const s3Path = `s3://${params.bucket.bucketName}/${params.bucketKey}`;
        const localPath = (params.localFile && params.localFile.length !== 0) ? params.localFile : `/tmp/${params.bucketKey}`;
        this.addCommands(`mkdir -p $(dirname '${localPath}')`, `aws s3 cp '${s3Path}' '${localPath}'` + (params.region !== undefined ? ` --region ${params.region}` : ''));
        return localPath;
    }
    addExecuteFileCommand(params) {
        this.addCommands('set -e', `chmod +x '${params.filePath}'`, `'${params.filePath}' ${params.arguments ?? ''}`.trim());
    }
    addSignalOnExitCommand(resource) {
        const stack = core_1.Stack.of(resource);
        const resourceID = resource.node.defaultChild.logicalId;
        this.addOnExitCommands(`/opt/aws/bin/cfn-signal --stack ${stack.stackName} --resource ${resourceID} --region ${stack.region} -e $exitCode || echo 'Failed to send Cloudformation Signal'`);
    }
    renderOnExitLines() {
        if (this.onExitLines.length > 0) {
            return ['function exitTrap(){', 'exitCode=$?', ...this.onExitLines, '}', 'trap exitTrap EXIT'];
        }
        return [];
    }
}
/**
 * Windows Instance User Data
 */
class WindowsUserData extends UserData {
    constructor(props = {}) {
        super();
        this.props = props;
        this.lines = [];
        this.onExitLines = [];
    }
    addCommands(...commands) {
        this.lines.push(...commands);
    }
    addOnExitCommands(...commands) {
        this.onExitLines.push(...commands);
    }
    render() {
        return `<powershell>${[...(this.renderOnExitLines()),
            ...this.lines,
            ...(this.onExitLines.length > 0 ? ['throw "Success"'] : [])].join('\n')}</powershell>${(this.props.persist ?? false) ? '<persist>true</persist>' : ''}`;
    }
    addS3DownloadCommand(params) {
        const localPath = (params.localFile && params.localFile.length !== 0) ? params.localFile : `C:/temp/${params.bucketKey}`;
        this.addCommands(`mkdir (Split-Path -Path '${localPath}' ) -ea 0`, `Read-S3Object -BucketName '${params.bucket.bucketName}' -key '${params.bucketKey}' -file '${localPath}' -ErrorAction Stop` + (params.region !== undefined ? ` -Region ${params.region}` : ''));
        return localPath;
    }
    addExecuteFileCommand(params) {
        this.addCommands(`&'${params.filePath}' ${params.arguments ?? ''}`.trim(), `if (!$?) { Write-Error 'Failed to execute the file "${params.filePath}"' -ErrorAction Stop }`);
    }
    addSignalOnExitCommand(resource) {
        const stack = core_1.Stack.of(resource);
        const resourceID = resource.node.defaultChild.logicalId;
        this.addOnExitCommands(`cfn-signal --stack ${stack.stackName} --resource ${resourceID} --region ${stack.region} --success ($success.ToString().ToLower())`);
    }
    renderOnExitLines() {
        if (this.onExitLines.length > 0) {
            return ['trap {', '$success=($PSItem.Exception.Message -eq "Success")', ...this.onExitLines, 'break', '}'];
        }
        return [];
    }
}
/**
 * Custom Instance User Data
 */
class CustomUserData extends UserData {
    constructor() {
        super();
        this.lines = [];
    }
    addCommands(...commands) {
        this.lines.push(...commands);
    }
    addOnExitCommands() {
        throw new Error('CustomUserData does not support addOnExitCommands, use UserData.forLinux() or UserData.forWindows() instead.');
    }
    render() {
        return this.lines.join('\n');
    }
    addS3DownloadCommand() {
        throw new Error('CustomUserData does not support addS3DownloadCommand, use UserData.forLinux() or UserData.forWindows() instead.');
    }
    addExecuteFileCommand() {
        throw new Error('CustomUserData does not support addExecuteFileCommand, use UserData.forLinux() or UserData.forWindows() instead.');
    }
    addSignalOnExitCommand() {
        throw new Error('CustomUserData does not support addSignalOnExitCommand, use UserData.forLinux() or UserData.forWindows() instead.');
    }
}
/**
 * The base class for all classes which can be used as `MultipartUserData`.
 */
class MultipartBody {
    /**
     * Constructs the new `MultipartBody` wrapping existing `UserData`. Modification to `UserData` are reflected
     * in subsequent renders of the part.
     *
     * For more information about content types see `MultipartBodyOptions.contentType`.
     *
     * @param userData user data to wrap into body part
     * @param contentType optional content type, if default one should not be used
     */
    static fromUserData(userData, contentType) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_UserData(userData);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromUserData);
            }
            throw error;
        }
        return new MultipartBodyUserDataWrapper(userData, contentType);
    }
    /**
     * Constructs the raw `MultipartBody` using specified body, content type and transfer encoding.
     *
     * When transfer encoding is specified (typically as Base64), it's caller responsibility to convert body to
     * Base64 either by wrapping with `Fn.base64` or by converting it by other converters.
     */
    static fromRawBody(opts) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_MultipartBodyOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromRawBody);
            }
            throw error;
        }
        return new MultipartBodyRaw(opts);
    }
    constructor() {
    }
}
_b = JSII_RTTI_SYMBOL_1;
MultipartBody[_b] = { fqn: "@aws-cdk/aws-ec2.MultipartBody", version: "0.0.0" };
/**
 * Content type for shell scripts
 */
MultipartBody.SHELL_SCRIPT = 'text/x-shellscript; charset="utf-8"';
/**
 * Content type for boot hooks
 */
MultipartBody.CLOUD_BOOTHOOK = 'text/cloud-boothook; charset="utf-8"';
exports.MultipartBody = MultipartBody;
/**
 * The raw part of multi-part user data, which can be added to `MultipartUserData`.
 */
class MultipartBodyRaw extends MultipartBody {
    constructor(props) {
        super();
        this.props = props;
    }
    /**
     * Render body part as the string.
     */
    renderBodyPart() {
        const result = [];
        result.push(`Content-Type: ${this.props.contentType}`);
        if (this.props.transferEncoding != null) {
            result.push(`Content-Transfer-Encoding: ${this.props.transferEncoding}`);
        }
        // One line free after separator
        result.push('');
        if (this.props.body != null) {
            result.push(this.props.body);
            // The new line added after join will be consumed by encapsulating or closing boundary
        }
        return result;
    }
}
/**
 * Wrapper for `UserData`.
 */
class MultipartBodyUserDataWrapper extends MultipartBody {
    constructor(userData, contentType) {
        super();
        this.userData = userData;
        this.contentType = contentType || MultipartBody.SHELL_SCRIPT;
    }
    /**
     * Render body part as the string.
     */
    renderBodyPart() {
        const result = [];
        result.push(`Content-Type: ${this.contentType}`);
        result.push('Content-Transfer-Encoding: base64');
        result.push('');
        result.push(core_1.Fn.base64(this.userData.render()));
        return result;
    }
}
/**
 * Mime multipart user data.
 *
 * This class represents MIME multipart user data, as described in.
 * [Specifying Multiple User Data Blocks Using a MIME Multi Part Archive](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/bootstrap_container_instance.html#multi-part_user_data)
 *
 */
class MultipartUserData extends UserData {
    constructor(opts) {
        super();
        this.parts = [];
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_MultipartUserDataOptions(opts);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, MultipartUserData);
            }
            throw error;
        }
        let partsSeparator;
        // Validate separator
        if (opts?.partsSeparator != null) {
            if (new RegExp(MultipartUserData.BOUNDRY_PATTERN).test(opts.partsSeparator)) {
                throw new Error(`Invalid characters in separator. Separator has to match pattern ${MultipartUserData.BOUNDRY_PATTERN}`);
            }
            else {
                partsSeparator = opts.partsSeparator;
            }
        }
        else {
            partsSeparator = '+AWS+CDK+User+Data+Separator==';
        }
        this.opts = {
            partsSeparator: partsSeparator,
        };
    }
    /**
     * Adds a part to the list of parts.
     */
    addPart(part) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_MultipartBody(part);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addPart);
            }
            throw error;
        }
        this.parts.push(part);
    }
    /**
     * Adds a multipart part based on a UserData object.
     *
     * If `makeDefault` is true, then the UserData added by this method
     * will also be the target of calls to the `add*Command` methods on
     * this MultipartUserData object.
     *
     * If `makeDefault` is false, then this is the same as calling:
     *
     * ```ts
     * declare const multiPart: ec2.MultipartUserData;
     * declare const userData: ec2.UserData;
     * declare const contentType: string;
     *
     * multiPart.addPart(ec2.MultipartBody.fromUserData(userData, contentType));
     * ```
     *
     * An undefined `makeDefault` defaults to either:
     * - `true` if no default UserData has been set yet; or
     * - `false` if there is no default UserData set.
     */
    addUserDataPart(userData, contentType, makeDefault) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_UserData(userData);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addUserDataPart);
            }
            throw error;
        }
        this.addPart(MultipartBody.fromUserData(userData, contentType));
        makeDefault = makeDefault ?? (this.defaultUserData === undefined ? true : false);
        if (makeDefault) {
            this.defaultUserData = userData;
        }
    }
    render() {
        const boundary = this.opts.partsSeparator;
        // Now build final MIME archive - there are few changes from MIME message which are accepted by cloud-init:
        // - MIME RFC uses CRLF to separate lines - cloud-init is fine with LF \n only
        // Note: new lines matters, matters a lot.
        var resultArchive = new Array();
        resultArchive.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
        resultArchive.push('MIME-Version: 1.0');
        // Add new line, the next one will be boundary (encapsulating or closing)
        // so this line will count into it.
        resultArchive.push('');
        // Add parts - each part starts with boundary
        this.parts.forEach(part => {
            resultArchive.push(`--${boundary}`);
            resultArchive.push(...part.renderBodyPart());
        });
        // Add closing boundary
        resultArchive.push(`--${boundary}--`);
        resultArchive.push(''); // Force new line at the end
        return resultArchive.join('\n');
    }
    addS3DownloadCommand(params) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_S3DownloadOptions(params);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addS3DownloadCommand);
            }
            throw error;
        }
        if (this.defaultUserData) {
            return this.defaultUserData.addS3DownloadCommand(params);
        }
        else {
            throw new Error(MultipartUserData.USE_PART_ERROR);
        }
    }
    addExecuteFileCommand(params) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_ExecuteFileOptions(params);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.addExecuteFileCommand);
            }
            throw error;
        }
        if (this.defaultUserData) {
            this.defaultUserData.addExecuteFileCommand(params);
        }
        else {
            throw new Error(MultipartUserData.USE_PART_ERROR);
        }
    }
    addSignalOnExitCommand(resource) {
        if (this.defaultUserData) {
            this.defaultUserData.addSignalOnExitCommand(resource);
        }
        else {
            throw new Error(MultipartUserData.USE_PART_ERROR);
        }
    }
    addCommands(...commands) {
        if (this.defaultUserData) {
            this.defaultUserData.addCommands(...commands);
        }
        else {
            throw new Error(MultipartUserData.USE_PART_ERROR);
        }
    }
    addOnExitCommands(...commands) {
        if (this.defaultUserData) {
            this.defaultUserData.addOnExitCommands(...commands);
        }
        else {
            throw new Error(MultipartUserData.USE_PART_ERROR);
        }
    }
}
_c = JSII_RTTI_SYMBOL_1;
MultipartUserData[_c] = { fqn: "@aws-cdk/aws-ec2.MultipartUserData", version: "0.0.0" };
MultipartUserData.USE_PART_ERROR = 'MultipartUserData only supports this operation if it has a default UserData. Call addUserDataPart with makeDefault=true.';
MultipartUserData.BOUNDRY_PATTERN = '[^a-zA-Z0-9()+,-./:=?]';
exports.MultipartUserData = MultipartUserData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1kYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci1kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdDQUFpRTtBQUNqRSxtREFBc0Q7QUFrRnREOztHQUVHO0FBQ0gsTUFBc0IsUUFBUTtJQUM1Qjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBZ0MsRUFBRTs7Ozs7Ozs7OztRQUN2RCxPQUFPLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ25DO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQWtDLEVBQUU7Ozs7Ozs7Ozs7UUFDM0QsT0FBTyxJQUFJLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNyQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFlO1FBQ2xDLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDdEMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixPQUFPLFFBQVEsQ0FBQztLQUNqQjtJQUVNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxFQUF1Qjs7Ozs7Ozs7OztRQUN0RCxRQUFRLEVBQUUsRUFBRTtZQUNWLEtBQUssbUNBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDM0QsS0FBSyxtQ0FBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUMvRCxLQUFLLG1DQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQztTQUNsSDtLQUNGOzs7O0FBOUJtQiw0QkFBUTtBQWtFOUI7O0dBRUc7QUFDSCxNQUFNLGFBQWMsU0FBUSxRQUFRO0lBSWxDLFlBQTZCLFFBQThCLEVBQUU7UUFDM0QsS0FBSyxFQUFFLENBQUM7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LENBQUMsQ0FBQztTQUNuRDtLQUNGO0lBRU0sc0JBQXNCLENBQUMsUUFBa0I7UUFDOUMsSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsc0JBQXNCLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdkQ7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDbkQ7S0FDRjtJQUVNLFdBQVcsQ0FBQyxHQUFHLFFBQWtCO1FBQ3RDLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1NBQy9DO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQ25EO0tBQ0Y7SUFFTSxpQkFBaUIsQ0FBQyxHQUFHLFFBQWtCO1FBQzVDLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUM7U0FDckQ7YUFBTTtZQUNMLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDLENBQUM7U0FDbkQ7S0FDRjs7OztBQWxJdUIsZ0NBQWMsR0FBRywwSEFBMEgsQUFBN0gsQ0FBOEg7QUFDNUksaUNBQWUsR0FBRyx3QkFBd0IsQUFBM0IsQ0FBNEI7QUFGeEQsOENBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUJ1Y2tldCB9IGZyb20gJ0Bhd3MtY2RrL2F3cy1zMyc7XG5pbXBvcnQgeyBGbiwgUmVzb3VyY2UsIFN0YWNrLCBDZm5SZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgT3BlcmF0aW5nU3lzdGVtVHlwZSB9IGZyb20gJy4vbWFjaGluZS1pbWFnZSc7XG5cbi8qKlxuICogT3B0aW9ucyB3aGVuIGNvbnN0cnVjdGluZyBVc2VyRGF0YSBmb3IgTGludXhcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMaW51eFVzZXJEYXRhT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTaGViYW5nIGZvciB0aGUgVXNlckRhdGEgc2NyaXB0XG4gICAqXG4gICAqIEBkZWZhdWx0IFwiIyEvYmluL2Jhc2hcIlxuICAgKi9cbiAgcmVhZG9ubHkgc2hlYmFuZz86IHN0cmluZztcbn1cblxuLyoqXG4gKiBPcHRpb25zIHdoZW4gY29uc3RydWN0aW5nIFVzZXJEYXRhIGZvciBXaW5kb3dzXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgV2luZG93c1VzZXJEYXRhT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBTZXQgdG8gdHJ1ZSB0byBzZXQgdGhpcyB1c2VyZGF0YSB0byBwZXJzaXN0IHRocm91Z2ggYW4gaW5zdGFuY2UgcmVib290OyBhbGxvd2luZ1xuICAgKiBpdCB0byBydW4gb24gZXZlcnkgaW5zdGFuY2Ugc3RhcnQuXG4gICAqIEJ5IGRlZmF1bHQsIFVzZXJEYXRhIGlzIHJ1biBvbmx5IG9uY2UgZHVyaW5nIHRoZSBmaXJzdCBpbnN0YW5jZSBsYXVuY2guXG4gICAqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWU6XG4gICAqIGh0dHBzOi8vYXdzLmFtYXpvbi5jb20vcHJlbWl1bXN1cHBvcnQva25vd2xlZGdlLWNlbnRlci9leGVjdXRlLXVzZXItZGF0YS1lYzIvXG4gICAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NFQzIvbGF0ZXN0L1dpbmRvd3NHdWlkZS9lYzItd2luZG93cy11c2VyLWRhdGEuaHRtbCN1c2VyLWRhdGEtc2NyaXB0c1xuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgcmVhZG9ubHkgcGVyc2lzdD86IGJvb2xlYW47XG59XG5cbi8qKlxuICogT3B0aW9ucyB3aGVuIGRvd25sb2FkaW5nIGZpbGVzIGZyb20gUzNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBTM0Rvd25sb2FkT3B0aW9ucyB7XG5cbiAgLyoqXG4gICAqIE5hbWUgb2YgdGhlIFMzIGJ1Y2tldCB0byBkb3dubG9hZCBmcm9tXG4gICAqL1xuICByZWFkb25seSBidWNrZXQ6IElCdWNrZXQ7XG5cbiAgLyoqXG4gICAqIFRoZSBrZXkgb2YgdGhlIGZpbGUgdG8gZG93bmxvYWRcbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldEtleTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgbG9jYWwgZmlsZS5cbiAgICpcbiAgICogQGRlZmF1bHQgTGludXggICAtIC90bXAvYnVja2V0S2V5XG4gICAqICAgICAgICAgIFdpbmRvd3MgLSAlVEVNUCUvYnVja2V0S2V5XG4gICAqL1xuICByZWFkb25seSBsb2NhbEZpbGU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSByZWdpb24gb2YgdGhlIFMzIEJ1Y2tldCAobmVlZGVkIGZvciBhY2Nlc3MgdmlhIFZQQyBHYXRld2F5KVxuICAgKiBAZGVmYXVsdCBub25lXG4gICAqL1xuICByZWFkb25seSByZWdpb24/OiBzdHJpbmdcblxufVxuXG4vKipcbiAqIE9wdGlvbnMgd2hlbiBleGVjdXRpbmcgYSBmaWxlLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEV4ZWN1dGVGaWxlT3B0aW9ucyB7XG5cbiAgLyoqXG4gICAqIFRoZSBwYXRoIHRvIHRoZSBmaWxlLlxuICAgKi9cbiAgcmVhZG9ubHkgZmlsZVBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gdGhlIGZpbGUuXG4gICAqXG4gICAqIEBkZWZhdWx0IE5vIGFyZ3VtZW50cyBhcmUgcGFzc2VkIHRvIHRoZSBmaWxlLlxuICAgKi9cbiAgcmVhZG9ubHkgYXJndW1lbnRzPzogc3RyaW5nO1xuXG59XG5cbi8qKlxuICogSW5zdGFuY2UgVXNlciBEYXRhXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBVc2VyRGF0YSB7XG4gIC8qKlxuICAgKiBDcmVhdGUgYSB1c2VyZGF0YSBvYmplY3QgZm9yIExpbnV4IGhvc3RzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZvckxpbnV4KG9wdGlvbnM6IExpbnV4VXNlckRhdGFPcHRpb25zID0ge30pOiBVc2VyRGF0YSB7XG4gICAgcmV0dXJuIG5ldyBMaW51eFVzZXJEYXRhKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHVzZXJkYXRhIG9iamVjdCBmb3IgV2luZG93cyBob3N0c1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmb3JXaW5kb3dzKG9wdGlvbnM6IFdpbmRvd3NVc2VyRGF0YU9wdGlvbnMgPSB7fSk6IFVzZXJEYXRhIHtcbiAgICByZXR1cm4gbmV3IFdpbmRvd3NVc2VyRGF0YShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSB1c2VyZGF0YSBvYmplY3Qgd2l0aCBjdXN0b20gY29udGVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjdXN0b20oY29udGVudDogc3RyaW5nKTogVXNlckRhdGEge1xuICAgIGNvbnN0IHVzZXJEYXRhID0gbmV3IEN1c3RvbVVzZXJEYXRhKCk7XG4gICAgdXNlckRhdGEuYWRkQ29tbWFuZHMoY29udGVudCk7XG4gICAgcmV0dXJuIHVzZXJEYXRhO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBmb3JPcGVyYXRpbmdTeXN0ZW0ob3M6IE9wZXJhdGluZ1N5c3RlbVR5cGUpOiBVc2VyRGF0YSB7XG4gICAgc3dpdGNoIChvcykge1xuICAgICAgY2FzZSBPcGVyYXRpbmdTeXN0ZW1UeXBlLkxJTlVYOiByZXR1cm4gVXNlckRhdGEuZm9yTGludXgoKTtcbiAgICAgIGNhc2UgT3BlcmF0aW5nU3lzdGVtVHlwZS5XSU5ET1dTOiByZXR1cm4gVXNlckRhdGEuZm9yV2luZG93cygpO1xuICAgICAgY2FzZSBPcGVyYXRpbmdTeXN0ZW1UeXBlLlVOS05PV046IHRocm93IG5ldyBFcnJvcignQ2Fubm90IGRldGVybWluZSBVc2VyRGF0YSBmb3IgdW5rbm93biBvcGVyYXRpbmcgc3lzdGVtIHR5cGUnKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9uZSBvciBtb3JlIGNvbW1hbmRzIHRvIHRoZSB1c2VyIGRhdGFcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBhZGRDb21tYW5kcyguLi5jb21tYW5kczogc3RyaW5nW10pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGQgb25lIG9yIG1vcmUgY29tbWFuZHMgdG8gdGhlIHVzZXIgZGF0YSB0aGF0IHdpbGwgcnVuIHdoZW4gdGhlIHNjcmlwdCBleGl0cy5cbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBhZGRPbkV4aXRDb21tYW5kcyguLi5jb21tYW5kczogc3RyaW5nW10pOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBSZW5kZXIgdGhlIFVzZXJEYXRhIGZvciB1c2UgaW4gYSBjb25zdHJ1Y3RcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZW5kZXIoKTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBBZGRzIGNvbW1hbmRzIHRvIGRvd25sb2FkIGEgZmlsZSBmcm9tIFMzXG4gICAqXG4gICAqIEByZXR1cm5zOiBUaGUgbG9jYWwgcGF0aCB0aGF0IHRoZSBmaWxlIHdpbGwgYmUgZG93bmxvYWRlZCB0b1xuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGFkZFMzRG93bmxvYWRDb21tYW5kKHBhcmFtczogUzNEb3dubG9hZE9wdGlvbnMpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFkZHMgY29tbWFuZHMgdG8gZXhlY3V0ZSBhIGZpbGVcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBhZGRFeGVjdXRlRmlsZUNvbW1hbmQoIHBhcmFtczogRXhlY3V0ZUZpbGVPcHRpb25zKTogdm9pZDtcblxuICAvKipcbiAgICogQWRkcyBhIGNvbW1hbmQgd2hpY2ggd2lsbCBzZW5kIGEgY2ZuLXNpZ25hbCB3aGVuIHRoZSB1c2VyIGRhdGEgc2NyaXB0IGVuZHNcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCBhZGRTaWduYWxPbkV4aXRDb21tYW5kKCByZXNvdXJjZTogUmVzb3VyY2UgKTogdm9pZDtcblxufVxuXG4vKipcbiAqIExpbnV4IEluc3RhbmNlIFVzZXIgRGF0YVxuICovXG5jbGFzcyBMaW51eFVzZXJEYXRhIGV4dGVuZHMgVXNlckRhdGEge1xuICBwcml2YXRlIHJlYWRvbmx5IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IG9uRXhpdExpbmVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IExpbnV4VXNlckRhdGFPcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGFkZENvbW1hbmRzKC4uLmNvbW1hbmRzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMubGluZXMucHVzaCguLi5jb21tYW5kcyk7XG4gIH1cblxuICBwdWJsaWMgYWRkT25FeGl0Q29tbWFuZHMoLi4uY29tbWFuZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5vbkV4aXRMaW5lcy5wdXNoKC4uLmNvbW1hbmRzKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKTogc3RyaW5nIHtcbiAgICBjb25zdCBzaGViYW5nID0gdGhpcy5wcm9wcy5zaGViYW5nID8/ICcjIS9iaW4vYmFzaCc7XG4gICAgcmV0dXJuIFtzaGViYW5nLCAuLi4odGhpcy5yZW5kZXJPbkV4aXRMaW5lcygpKSwgLi4udGhpcy5saW5lc10uam9pbignXFxuJyk7XG4gIH1cblxuICBwdWJsaWMgYWRkUzNEb3dubG9hZENvbW1hbmQocGFyYW1zOiBTM0Rvd25sb2FkT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgY29uc3QgczNQYXRoID0gYHMzOi8vJHtwYXJhbXMuYnVja2V0LmJ1Y2tldE5hbWV9LyR7cGFyYW1zLmJ1Y2tldEtleX1gO1xuICAgIGNvbnN0IGxvY2FsUGF0aCA9ICggcGFyYW1zLmxvY2FsRmlsZSAmJiBwYXJhbXMubG9jYWxGaWxlLmxlbmd0aCAhPT0gMCApID8gcGFyYW1zLmxvY2FsRmlsZSA6IGAvdG1wLyR7IHBhcmFtcy5idWNrZXRLZXkgfWA7XG4gICAgdGhpcy5hZGRDb21tYW5kcyhcbiAgICAgIGBta2RpciAtcCAkKGRpcm5hbWUgJyR7bG9jYWxQYXRofScpYCxcbiAgICAgIGBhd3MgczMgY3AgJyR7czNQYXRofScgJyR7bG9jYWxQYXRofSdgICsgKHBhcmFtcy5yZWdpb24gIT09IHVuZGVmaW5lZCA/IGAgLS1yZWdpb24gJHtwYXJhbXMucmVnaW9ufWAgOiAnJyksXG4gICAgKTtcblxuICAgIHJldHVybiBsb2NhbFBhdGg7XG4gIH1cblxuICBwdWJsaWMgYWRkRXhlY3V0ZUZpbGVDb21tYW5kKCBwYXJhbXM6IEV4ZWN1dGVGaWxlT3B0aW9ucyk6IHZvaWQge1xuICAgIHRoaXMuYWRkQ29tbWFuZHMoXG4gICAgICAnc2V0IC1lJyxcbiAgICAgIGBjaG1vZCAreCAnJHtwYXJhbXMuZmlsZVBhdGh9J2AsXG4gICAgICBgJyR7cGFyYW1zLmZpbGVQYXRofScgJHtwYXJhbXMuYXJndW1lbnRzID8/ICcnfWAudHJpbSgpLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYWRkU2lnbmFsT25FeGl0Q29tbWFuZCggcmVzb3VyY2U6IFJlc291cmNlICk6IHZvaWQge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YocmVzb3VyY2UpO1xuICAgIGNvbnN0IHJlc291cmNlSUQgPSAocmVzb3VyY2Uubm9kZS5kZWZhdWx0Q2hpbGQgYXMgQ2ZuUmVzb3VyY2UpLmxvZ2ljYWxJZDtcbiAgICB0aGlzLmFkZE9uRXhpdENvbW1hbmRzKGAvb3B0L2F3cy9iaW4vY2ZuLXNpZ25hbCAtLXN0YWNrICR7c3RhY2suc3RhY2tOYW1lfSAtLXJlc291cmNlICR7cmVzb3VyY2VJRH0gLS1yZWdpb24gJHtzdGFjay5yZWdpb259IC1lICRleGl0Q29kZSB8fCBlY2hvICdGYWlsZWQgdG8gc2VuZCBDbG91ZGZvcm1hdGlvbiBTaWduYWwnYCk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlck9uRXhpdExpbmVzKCk6IHN0cmluZ1tdIHtcbiAgICBpZiAoIHRoaXMub25FeGl0TGluZXMubGVuZ3RoID4gMCApIHtcbiAgICAgIHJldHVybiBbJ2Z1bmN0aW9uIGV4aXRUcmFwKCl7JywgJ2V4aXRDb2RlPSQ/JywgLi4udGhpcy5vbkV4aXRMaW5lcywgJ30nLCAndHJhcCBleGl0VHJhcCBFWElUJ107XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG4vKipcbiAqIFdpbmRvd3MgSW5zdGFuY2UgVXNlciBEYXRhXG4gKi9cbmNsYXNzIFdpbmRvd3NVc2VyRGF0YSBleHRlbmRzIFVzZXJEYXRhIHtcbiAgcHJpdmF0ZSByZWFkb25seSBsaW5lczogc3RyaW5nW10gPSBbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBvbkV4aXRMaW5lczogc3RyaW5nW10gPSBbXTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBXaW5kb3dzVXNlckRhdGFPcHRpb25zID0ge30pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGFkZENvbW1hbmRzKC4uLmNvbW1hbmRzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMubGluZXMucHVzaCguLi5jb21tYW5kcyk7XG4gIH1cblxuICBwdWJsaWMgYWRkT25FeGl0Q29tbWFuZHMoLi4uY29tbWFuZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5vbkV4aXRMaW5lcy5wdXNoKC4uLmNvbW1hbmRzKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gYDxwb3dlcnNoZWxsPiR7XG4gICAgICBbLi4uKHRoaXMucmVuZGVyT25FeGl0TGluZXMoKSksXG4gICAgICAgIC4uLnRoaXMubGluZXMsXG4gICAgICAgIC4uLiggdGhpcy5vbkV4aXRMaW5lcy5sZW5ndGggPiAwID8gWyd0aHJvdyBcIlN1Y2Nlc3NcIiddIDogW10gKV0uam9pbignXFxuJylcbiAgICB9PC9wb3dlcnNoZWxsPiR7KHRoaXMucHJvcHMucGVyc2lzdCA/PyBmYWxzZSkgPyAnPHBlcnNpc3Q+dHJ1ZTwvcGVyc2lzdD4nIDogJyd9YDtcbiAgfVxuXG4gIHB1YmxpYyBhZGRTM0Rvd25sb2FkQ29tbWFuZChwYXJhbXM6IFMzRG93bmxvYWRPcHRpb25zKTogc3RyaW5nIHtcbiAgICBjb25zdCBsb2NhbFBhdGggPSAoIHBhcmFtcy5sb2NhbEZpbGUgJiYgcGFyYW1zLmxvY2FsRmlsZS5sZW5ndGggIT09IDAgKSA/IHBhcmFtcy5sb2NhbEZpbGUgOiBgQzovdGVtcC8keyBwYXJhbXMuYnVja2V0S2V5IH1gO1xuICAgIHRoaXMuYWRkQ29tbWFuZHMoXG4gICAgICBgbWtkaXIgKFNwbGl0LVBhdGggLVBhdGggJyR7bG9jYWxQYXRofScgKSAtZWEgMGAsXG4gICAgICBgUmVhZC1TM09iamVjdCAtQnVja2V0TmFtZSAnJHtwYXJhbXMuYnVja2V0LmJ1Y2tldE5hbWV9JyAta2V5ICcke3BhcmFtcy5idWNrZXRLZXl9JyAtZmlsZSAnJHtsb2NhbFBhdGh9JyAtRXJyb3JBY3Rpb24gU3RvcGAgKyAocGFyYW1zLnJlZ2lvbiAhPT0gdW5kZWZpbmVkID8gYCAtUmVnaW9uICR7cGFyYW1zLnJlZ2lvbn1gIDogJycpLFxuICAgICk7XG4gICAgcmV0dXJuIGxvY2FsUGF0aDtcbiAgfVxuXG4gIHB1YmxpYyBhZGRFeGVjdXRlRmlsZUNvbW1hbmQoIHBhcmFtczogRXhlY3V0ZUZpbGVPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5hZGRDb21tYW5kcyhcbiAgICAgIGAmJyR7cGFyYW1zLmZpbGVQYXRofScgJHtwYXJhbXMuYXJndW1lbnRzID8/ICcnfWAudHJpbSgpLFxuICAgICAgYGlmICghJD8pIHsgV3JpdGUtRXJyb3IgJ0ZhaWxlZCB0byBleGVjdXRlIHRoZSBmaWxlIFwiJHtwYXJhbXMuZmlsZVBhdGh9XCInIC1FcnJvckFjdGlvbiBTdG9wIH1gLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgYWRkU2lnbmFsT25FeGl0Q29tbWFuZCggcmVzb3VyY2U6IFJlc291cmNlICk6IHZvaWQge1xuICAgIGNvbnN0IHN0YWNrID0gU3RhY2sub2YocmVzb3VyY2UpO1xuICAgIGNvbnN0IHJlc291cmNlSUQgPSAocmVzb3VyY2Uubm9kZS5kZWZhdWx0Q2hpbGQgYXMgQ2ZuUmVzb3VyY2UpLmxvZ2ljYWxJZDtcblxuICAgIHRoaXMuYWRkT25FeGl0Q29tbWFuZHMoYGNmbi1zaWduYWwgLS1zdGFjayAke3N0YWNrLnN0YWNrTmFtZX0gLS1yZXNvdXJjZSAke3Jlc291cmNlSUR9IC0tcmVnaW9uICR7c3RhY2sucmVnaW9ufSAtLXN1Y2Nlc3MgKCRzdWNjZXNzLlRvU3RyaW5nKCkuVG9Mb3dlcigpKWApO1xuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJPbkV4aXRMaW5lcygpOiBzdHJpbmdbXSB7XG4gICAgaWYgKCB0aGlzLm9uRXhpdExpbmVzLmxlbmd0aCA+IDAgKSB7XG4gICAgICByZXR1cm4gWyd0cmFwIHsnLCAnJHN1Y2Nlc3M9KCRQU0l0ZW0uRXhjZXB0aW9uLk1lc3NhZ2UgLWVxIFwiU3VjY2Vzc1wiKScsIC4uLnRoaXMub25FeGl0TGluZXMsICdicmVhaycsICd9J107XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxufVxuXG4vKipcbiAqIEN1c3RvbSBJbnN0YW5jZSBVc2VyIERhdGFcbiAqL1xuY2xhc3MgQ3VzdG9tVXNlckRhdGEgZXh0ZW5kcyBVc2VyRGF0YSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbGluZXM6IHN0cmluZ1tdID0gW107XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRDb21tYW5kcyguLi5jb21tYW5kczogc3RyaW5nW10pIHtcbiAgICB0aGlzLmxpbmVzLnB1c2goLi4uY29tbWFuZHMpO1xuICB9XG5cbiAgcHVibGljIGFkZE9uRXhpdENvbW1hbmRzKCk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcignQ3VzdG9tVXNlckRhdGEgZG9lcyBub3Qgc3VwcG9ydCBhZGRPbkV4aXRDb21tYW5kcywgdXNlIFVzZXJEYXRhLmZvckxpbnV4KCkgb3IgVXNlckRhdGEuZm9yV2luZG93cygpIGluc3RlYWQuJyk7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMubGluZXMuam9pbignXFxuJyk7XG4gIH1cblxuICBwdWJsaWMgYWRkUzNEb3dubG9hZENvbW1hbmQoKTogc3RyaW5nIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0N1c3RvbVVzZXJEYXRhIGRvZXMgbm90IHN1cHBvcnQgYWRkUzNEb3dubG9hZENvbW1hbmQsIHVzZSBVc2VyRGF0YS5mb3JMaW51eCgpIG9yIFVzZXJEYXRhLmZvcldpbmRvd3MoKSBpbnN0ZWFkLicpO1xuICB9XG5cbiAgcHVibGljIGFkZEV4ZWN1dGVGaWxlQ29tbWFuZCgpOiB2b2lkIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0N1c3RvbVVzZXJEYXRhIGRvZXMgbm90IHN1cHBvcnQgYWRkRXhlY3V0ZUZpbGVDb21tYW5kLCB1c2UgVXNlckRhdGEuZm9yTGludXgoKSBvciBVc2VyRGF0YS5mb3JXaW5kb3dzKCkgaW5zdGVhZC4nKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRTaWduYWxPbkV4aXRDb21tYW5kKCk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcignQ3VzdG9tVXNlckRhdGEgZG9lcyBub3Qgc3VwcG9ydCBhZGRTaWduYWxPbkV4aXRDb21tYW5kLCB1c2UgVXNlckRhdGEuZm9yTGludXgoKSBvciBVc2VyRGF0YS5mb3JXaW5kb3dzKCkgaW5zdGVhZC4nKTtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgd2hlbiBjcmVhdGluZyBgTXVsdGlwYXJ0Qm9keWAuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTXVsdGlwYXJ0Qm9keU9wdGlvbnMge1xuXG4gIC8qKlxuICAgKiBgQ29udGVudC1UeXBlYCBoZWFkZXIgb2YgdGhpcyBwYXJ0LlxuICAgKlxuICAgKiBTb21lIGV4YW1wbGVzIG9mIGNvbnRlbnQgdHlwZXM6XG4gICAqICogYHRleHQveC1zaGVsbHNjcmlwdDsgY2hhcnNldD1cInV0Zi04XCJgIChzaGVsbCBzY3JpcHQpXG4gICAqICogYHRleHQvY2xvdWQtYm9vdGhvb2s7IGNoYXJzZXQ9XCJ1dGYtOFwiYCAoc2hlbGwgc2NyaXB0IGV4ZWN1dGVkIGR1cmluZyBib290IHBoYXNlKVxuICAgKlxuICAgKiBGb3IgTGludXggc2hlbGwgc2NyaXB0cyB1c2UgYHRleHQveC1zaGVsbHNjcmlwdGAuXG4gICAqL1xuICByZWFkb25seSBjb250ZW50VHlwZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBgQ29udGVudC1UcmFuc2Zlci1FbmNvZGluZ2AgaGVhZGVyIHNwZWNpZnlpbmcgcGFydCBlbmNvZGluZy5cbiAgICpcbiAgICogQGRlZmF1bHQgdW5kZWZpbmVkIC0gYm9keSBpcyBub3QgZW5jb2RlZFxuICAgKi9cbiAgcmVhZG9ubHkgdHJhbnNmZXJFbmNvZGluZz86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGJvZHkgb2YgbWVzc2FnZS5cbiAgICpcbiAgICogQGRlZmF1bHQgdW5kZWZpbmVkIC0gYm9keSB3aWxsIG5vdCBiZSBhZGRlZCB0byBwYXJ0XG4gICAqL1xuICByZWFkb25seSBib2R5Pzogc3RyaW5nLFxufVxuXG4vKipcbiAqIFRoZSBiYXNlIGNsYXNzIGZvciBhbGwgY2xhc3NlcyB3aGljaCBjYW4gYmUgdXNlZCBhcyBgTXVsdGlwYXJ0VXNlckRhdGFgLlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTXVsdGlwYXJ0Qm9keSB7XG4gIC8qKlxuICAgKiBDb250ZW50IHR5cGUgZm9yIHNoZWxsIHNjcmlwdHNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgU0hFTExfU0NSSVBUID0gJ3RleHQveC1zaGVsbHNjcmlwdDsgY2hhcnNldD1cInV0Zi04XCInO1xuXG4gIC8qKlxuICAgKiBDb250ZW50IHR5cGUgZm9yIGJvb3QgaG9va3NcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgQ0xPVURfQk9PVEhPT0sgPSAndGV4dC9jbG91ZC1ib290aG9vazsgY2hhcnNldD1cInV0Zi04XCInO1xuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIHRoZSBuZXcgYE11bHRpcGFydEJvZHlgIHdyYXBwaW5nIGV4aXN0aW5nIGBVc2VyRGF0YWAuIE1vZGlmaWNhdGlvbiB0byBgVXNlckRhdGFgIGFyZSByZWZsZWN0ZWRcbiAgICogaW4gc3Vic2VxdWVudCByZW5kZXJzIG9mIHRoZSBwYXJ0LlxuICAgKlxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBjb250ZW50IHR5cGVzIHNlZSBgTXVsdGlwYXJ0Qm9keU9wdGlvbnMuY29udGVudFR5cGVgLlxuICAgKlxuICAgKiBAcGFyYW0gdXNlckRhdGEgdXNlciBkYXRhIHRvIHdyYXAgaW50byBib2R5IHBhcnRcbiAgICogQHBhcmFtIGNvbnRlbnRUeXBlIG9wdGlvbmFsIGNvbnRlbnQgdHlwZSwgaWYgZGVmYXVsdCBvbmUgc2hvdWxkIG5vdCBiZSB1c2VkXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21Vc2VyRGF0YSh1c2VyRGF0YTogVXNlckRhdGEsIGNvbnRlbnRUeXBlPzogc3RyaW5nKTogTXVsdGlwYXJ0Qm9keSB7XG4gICAgcmV0dXJuIG5ldyBNdWx0aXBhcnRCb2R5VXNlckRhdGFXcmFwcGVyKHVzZXJEYXRhLCBjb250ZW50VHlwZSk7XG4gIH1cblxuICAvKipcbiAgICogQ29uc3RydWN0cyB0aGUgcmF3IGBNdWx0aXBhcnRCb2R5YCB1c2luZyBzcGVjaWZpZWQgYm9keSwgY29udGVudCB0eXBlIGFuZCB0cmFuc2ZlciBlbmNvZGluZy5cbiAgICpcbiAgICogV2hlbiB0cmFuc2ZlciBlbmNvZGluZyBpcyBzcGVjaWZpZWQgKHR5cGljYWxseSBhcyBCYXNlNjQpLCBpdCdzIGNhbGxlciByZXNwb25zaWJpbGl0eSB0byBjb252ZXJ0IGJvZHkgdG9cbiAgICogQmFzZTY0IGVpdGhlciBieSB3cmFwcGluZyB3aXRoIGBGbi5iYXNlNjRgIG9yIGJ5IGNvbnZlcnRpbmcgaXQgYnkgb3RoZXIgY29udmVydGVycy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVJhd0JvZHkob3B0czogTXVsdGlwYXJ0Qm9keU9wdGlvbnMpOiBNdWx0aXBhcnRCb2R5IHtcbiAgICByZXR1cm4gbmV3IE11bHRpcGFydEJvZHlSYXcob3B0cyk7XG4gIH1cblxuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGJvZHkgcGFydCBhcyB0aGUgc3RyaW5nLlxuICAgKlxuICAgKiBTdWJjbGFzc2VzIHNob3VsZCBub3QgYWRkIGxlYWRpbmcgbm9yIHRyYWlsaW5nIG5ldyBsaW5lIGNoYXJhY3RlcnMgKFxcciBcXG4pXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVuZGVyQm9keVBhcnQoKTogc3RyaW5nW107XG59XG5cbi8qKlxuICogVGhlIHJhdyBwYXJ0IG9mIG11bHRpLXBhcnQgdXNlciBkYXRhLCB3aGljaCBjYW4gYmUgYWRkZWQgdG8gYE11bHRpcGFydFVzZXJEYXRhYC5cbiAqL1xuY2xhc3MgTXVsdGlwYXJ0Qm9keVJhdyBleHRlbmRzIE11bHRpcGFydEJvZHkge1xuICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogTXVsdGlwYXJ0Qm9keU9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbmRlciBib2R5IHBhcnQgYXMgdGhlIHN0cmluZy5cbiAgICovXG4gIHB1YmxpYyByZW5kZXJCb2R5UGFydCgpOiBzdHJpbmdbXSB7XG4gICAgY29uc3QgcmVzdWx0OiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgcmVzdWx0LnB1c2goYENvbnRlbnQtVHlwZTogJHt0aGlzLnByb3BzLmNvbnRlbnRUeXBlfWApO1xuXG4gICAgaWYgKHRoaXMucHJvcHMudHJhbnNmZXJFbmNvZGluZyAhPSBudWxsKSB7XG4gICAgICByZXN1bHQucHVzaChgQ29udGVudC1UcmFuc2Zlci1FbmNvZGluZzogJHt0aGlzLnByb3BzLnRyYW5zZmVyRW5jb2Rpbmd9YCk7XG4gICAgfVxuICAgIC8vIE9uZSBsaW5lIGZyZWUgYWZ0ZXIgc2VwYXJhdG9yXG4gICAgcmVzdWx0LnB1c2goJycpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuYm9keSAhPSBudWxsKSB7XG4gICAgICByZXN1bHQucHVzaCh0aGlzLnByb3BzLmJvZHkpO1xuICAgICAgLy8gVGhlIG5ldyBsaW5lIGFkZGVkIGFmdGVyIGpvaW4gd2lsbCBiZSBjb25zdW1lZCBieSBlbmNhcHN1bGF0aW5nIG9yIGNsb3NpbmcgYm91bmRhcnlcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogV3JhcHBlciBmb3IgYFVzZXJEYXRhYC5cbiAqL1xuY2xhc3MgTXVsdGlwYXJ0Qm9keVVzZXJEYXRhV3JhcHBlciBleHRlbmRzIE11bHRpcGFydEJvZHkge1xuICBwcml2YXRlIHJlYWRvbmx5IGNvbnRlbnRUeXBlOiBzdHJpbmc7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgdXNlckRhdGE6IFVzZXJEYXRhLCBjb250ZW50VHlwZT86IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmNvbnRlbnRUeXBlID0gY29udGVudFR5cGUgfHwgTXVsdGlwYXJ0Qm9keS5TSEVMTF9TQ1JJUFQ7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGJvZHkgcGFydCBhcyB0aGUgc3RyaW5nLlxuICAgKi9cbiAgcHVibGljIHJlbmRlckJvZHlQYXJ0KCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG5cbiAgICByZXN1bHQucHVzaChgQ29udGVudC1UeXBlOiAke3RoaXMuY29udGVudFR5cGV9YCk7XG4gICAgcmVzdWx0LnB1c2goJ0NvbnRlbnQtVHJhbnNmZXItRW5jb2Rpbmc6IGJhc2U2NCcpO1xuICAgIHJlc3VsdC5wdXNoKCcnKTtcbiAgICByZXN1bHQucHVzaChGbi5iYXNlNjQodGhpcy51c2VyRGF0YS5yZW5kZXIoKSkpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG4vKipcbiAqIE9wdGlvbnMgZm9yIGNyZWF0aW5nIGBNdWx0aXBhcnRVc2VyRGF0YWBcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNdWx0aXBhcnRVc2VyRGF0YU9wdGlvbnMge1xuICAvKipcbiAgICogVGhlIHN0cmluZyB1c2VkIHRvIHNlcGFyYXRlIHBhcnRzIGluIG11bHRpcGFydCB1c2VyIGRhdGEgYXJjaGl2ZSAoaXQncyBsaWtlIE1JTUUgYm91bmRhcnkpLlxuICAgKlxuICAgKiBUaGlzIHN0cmluZyBzaG91bGQgY29udGFpbiBbYS16QS1aMC05KCkrLC0uLzo9P10gY2hhcmFjdGVycyBvbmx5LCBhbmQgc2hvdWxkIG5vdCBiZSBwcmVzZW50IGluIGFueSBwYXJ0LCBvciBpbiB0ZXh0IGNvbnRlbnQgb2YgYXJjaGl2ZS5cbiAgICpcbiAgICogQGRlZmF1bHQgYCtBV1MrQ0RLK1VzZXIrRGF0YStTZXBhcmF0b3I9PWBcbiAgICovXG4gIHJlYWRvbmx5IHBhcnRzU2VwYXJhdG9yPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIE1pbWUgbXVsdGlwYXJ0IHVzZXIgZGF0YS5cbiAqXG4gKiBUaGlzIGNsYXNzIHJlcHJlc2VudHMgTUlNRSBtdWx0aXBhcnQgdXNlciBkYXRhLCBhcyBkZXNjcmliZWQgaW4uXG4gKiBbU3BlY2lmeWluZyBNdWx0aXBsZSBVc2VyIERhdGEgQmxvY2tzIFVzaW5nIGEgTUlNRSBNdWx0aSBQYXJ0IEFyY2hpdmVdKGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL2Jvb3RzdHJhcF9jb250YWluZXJfaW5zdGFuY2UuaHRtbCNtdWx0aS1wYXJ0X3VzZXJfZGF0YSlcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBNdWx0aXBhcnRVc2VyRGF0YSBleHRlbmRzIFVzZXJEYXRhIHtcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgVVNFX1BBUlRfRVJST1IgPSAnTXVsdGlwYXJ0VXNlckRhdGEgb25seSBzdXBwb3J0cyB0aGlzIG9wZXJhdGlvbiBpZiBpdCBoYXMgYSBkZWZhdWx0IFVzZXJEYXRhLiBDYWxsIGFkZFVzZXJEYXRhUGFydCB3aXRoIG1ha2VEZWZhdWx0PXRydWUuJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgQk9VTkRSWV9QQVRURVJOID0gJ1teYS16QS1aMC05KCkrLC0uLzo9P10nO1xuXG4gIHByaXZhdGUgcGFydHM6IE11bHRpcGFydEJvZHlbXSA9IFtdO1xuXG4gIHByaXZhdGUgb3B0czogTXVsdGlwYXJ0VXNlckRhdGFPcHRpb25zO1xuXG4gIHByaXZhdGUgZGVmYXVsdFVzZXJEYXRhPzogVXNlckRhdGE7XG5cbiAgY29uc3RydWN0b3Iob3B0cz86IE11bHRpcGFydFVzZXJEYXRhT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG5cbiAgICBsZXQgcGFydHNTZXBhcmF0b3I6IHN0cmluZztcblxuICAgIC8vIFZhbGlkYXRlIHNlcGFyYXRvclxuICAgIGlmIChvcHRzPy5wYXJ0c1NlcGFyYXRvciAhPSBudWxsKSB7XG4gICAgICBpZiAobmV3IFJlZ0V4cChNdWx0aXBhcnRVc2VyRGF0YS5CT1VORFJZX1BBVFRFUk4pLnRlc3Qob3B0cyEucGFydHNTZXBhcmF0b3IpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBjaGFyYWN0ZXJzIGluIHNlcGFyYXRvci4gU2VwYXJhdG9yIGhhcyB0byBtYXRjaCBwYXR0ZXJuICR7TXVsdGlwYXJ0VXNlckRhdGEuQk9VTkRSWV9QQVRURVJOfWApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGFydHNTZXBhcmF0b3IgPSBvcHRzIS5wYXJ0c1NlcGFyYXRvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcGFydHNTZXBhcmF0b3IgPSAnK0FXUytDREsrVXNlcitEYXRhK1NlcGFyYXRvcj09JztcbiAgICB9XG5cbiAgICB0aGlzLm9wdHMgPSB7XG4gICAgICBwYXJ0c1NlcGFyYXRvcjogcGFydHNTZXBhcmF0b3IsXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcGFydCB0byB0aGUgbGlzdCBvZiBwYXJ0cy5cbiAgICovXG4gIHB1YmxpYyBhZGRQYXJ0KHBhcnQ6IE11bHRpcGFydEJvZHkpIHtcbiAgICB0aGlzLnBhcnRzLnB1c2gocGFydCk7XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIG11bHRpcGFydCBwYXJ0IGJhc2VkIG9uIGEgVXNlckRhdGEgb2JqZWN0LlxuICAgKlxuICAgKiBJZiBgbWFrZURlZmF1bHRgIGlzIHRydWUsIHRoZW4gdGhlIFVzZXJEYXRhIGFkZGVkIGJ5IHRoaXMgbWV0aG9kXG4gICAqIHdpbGwgYWxzbyBiZSB0aGUgdGFyZ2V0IG9mIGNhbGxzIHRvIHRoZSBgYWRkKkNvbW1hbmRgIG1ldGhvZHMgb25cbiAgICogdGhpcyBNdWx0aXBhcnRVc2VyRGF0YSBvYmplY3QuXG4gICAqXG4gICAqIElmIGBtYWtlRGVmYXVsdGAgaXMgZmFsc2UsIHRoZW4gdGhpcyBpcyB0aGUgc2FtZSBhcyBjYWxsaW5nOlxuICAgKlxuICAgKiBgYGB0c1xuICAgKiBkZWNsYXJlIGNvbnN0IG11bHRpUGFydDogZWMyLk11bHRpcGFydFVzZXJEYXRhO1xuICAgKiBkZWNsYXJlIGNvbnN0IHVzZXJEYXRhOiBlYzIuVXNlckRhdGE7XG4gICAqIGRlY2xhcmUgY29uc3QgY29udGVudFR5cGU6IHN0cmluZztcbiAgICpcbiAgICogbXVsdGlQYXJ0LmFkZFBhcnQoZWMyLk11bHRpcGFydEJvZHkuZnJvbVVzZXJEYXRhKHVzZXJEYXRhLCBjb250ZW50VHlwZSkpO1xuICAgKiBgYGBcbiAgICpcbiAgICogQW4gdW5kZWZpbmVkIGBtYWtlRGVmYXVsdGAgZGVmYXVsdHMgdG8gZWl0aGVyOlxuICAgKiAtIGB0cnVlYCBpZiBubyBkZWZhdWx0IFVzZXJEYXRhIGhhcyBiZWVuIHNldCB5ZXQ7IG9yXG4gICAqIC0gYGZhbHNlYCBpZiB0aGVyZSBpcyBubyBkZWZhdWx0IFVzZXJEYXRhIHNldC5cbiAgICovXG4gIHB1YmxpYyBhZGRVc2VyRGF0YVBhcnQodXNlckRhdGE6IFVzZXJEYXRhLCBjb250ZW50VHlwZT86IHN0cmluZywgbWFrZURlZmF1bHQ/OiBib29sZWFuKSB7XG4gICAgdGhpcy5hZGRQYXJ0KE11bHRpcGFydEJvZHkuZnJvbVVzZXJEYXRhKHVzZXJEYXRhLCBjb250ZW50VHlwZSkpO1xuICAgIG1ha2VEZWZhdWx0ID0gbWFrZURlZmF1bHQgPz8gKHRoaXMuZGVmYXVsdFVzZXJEYXRhID09PSB1bmRlZmluZWQgPyB0cnVlIDogZmFsc2UpO1xuICAgIGlmIChtYWtlRGVmYXVsdCkge1xuICAgICAgdGhpcy5kZWZhdWx0VXNlckRhdGEgPSB1c2VyRGF0YTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyKCk6IHN0cmluZyB7XG4gICAgY29uc3QgYm91bmRhcnkgPSB0aGlzLm9wdHMucGFydHNTZXBhcmF0b3I7XG4gICAgLy8gTm93IGJ1aWxkIGZpbmFsIE1JTUUgYXJjaGl2ZSAtIHRoZXJlIGFyZSBmZXcgY2hhbmdlcyBmcm9tIE1JTUUgbWVzc2FnZSB3aGljaCBhcmUgYWNjZXB0ZWQgYnkgY2xvdWQtaW5pdDpcbiAgICAvLyAtIE1JTUUgUkZDIHVzZXMgQ1JMRiB0byBzZXBhcmF0ZSBsaW5lcyAtIGNsb3VkLWluaXQgaXMgZmluZSB3aXRoIExGIFxcbiBvbmx5XG4gICAgLy8gTm90ZTogbmV3IGxpbmVzIG1hdHRlcnMsIG1hdHRlcnMgYSBsb3QuXG4gICAgdmFyIHJlc3VsdEFyY2hpdmUgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuICAgIHJlc3VsdEFyY2hpdmUucHVzaChgQ29udGVudC1UeXBlOiBtdWx0aXBhcnQvbWl4ZWQ7IGJvdW5kYXJ5PVwiJHtib3VuZGFyeX1cImApO1xuICAgIHJlc3VsdEFyY2hpdmUucHVzaCgnTUlNRS1WZXJzaW9uOiAxLjAnKTtcblxuICAgIC8vIEFkZCBuZXcgbGluZSwgdGhlIG5leHQgb25lIHdpbGwgYmUgYm91bmRhcnkgKGVuY2Fwc3VsYXRpbmcgb3IgY2xvc2luZylcbiAgICAvLyBzbyB0aGlzIGxpbmUgd2lsbCBjb3VudCBpbnRvIGl0LlxuICAgIHJlc3VsdEFyY2hpdmUucHVzaCgnJyk7XG5cbiAgICAvLyBBZGQgcGFydHMgLSBlYWNoIHBhcnQgc3RhcnRzIHdpdGggYm91bmRhcnlcbiAgICB0aGlzLnBhcnRzLmZvckVhY2gocGFydCA9PiB7XG4gICAgICByZXN1bHRBcmNoaXZlLnB1c2goYC0tJHtib3VuZGFyeX1gKTtcbiAgICAgIHJlc3VsdEFyY2hpdmUucHVzaCguLi5wYXJ0LnJlbmRlckJvZHlQYXJ0KCkpO1xuICAgIH0pO1xuXG4gICAgLy8gQWRkIGNsb3NpbmcgYm91bmRhcnlcbiAgICByZXN1bHRBcmNoaXZlLnB1c2goYC0tJHtib3VuZGFyeX0tLWApO1xuICAgIHJlc3VsdEFyY2hpdmUucHVzaCgnJyk7IC8vIEZvcmNlIG5ldyBsaW5lIGF0IHRoZSBlbmRcblxuICAgIHJldHVybiByZXN1bHRBcmNoaXZlLmpvaW4oJ1xcbicpO1xuICB9XG5cbiAgcHVibGljIGFkZFMzRG93bmxvYWRDb21tYW5kKHBhcmFtczogUzNEb3dubG9hZE9wdGlvbnMpOiBzdHJpbmcge1xuICAgIGlmICh0aGlzLmRlZmF1bHRVc2VyRGF0YSkge1xuICAgICAgcmV0dXJuIHRoaXMuZGVmYXVsdFVzZXJEYXRhLmFkZFMzRG93bmxvYWRDb21tYW5kKHBhcmFtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihNdWx0aXBhcnRVc2VyRGF0YS5VU0VfUEFSVF9FUlJPUik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZEV4ZWN1dGVGaWxlQ29tbWFuZChwYXJhbXM6IEV4ZWN1dGVGaWxlT3B0aW9ucyk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRlZmF1bHRVc2VyRGF0YSkge1xuICAgICAgdGhpcy5kZWZhdWx0VXNlckRhdGEuYWRkRXhlY3V0ZUZpbGVDb21tYW5kKHBhcmFtcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihNdWx0aXBhcnRVc2VyRGF0YS5VU0VfUEFSVF9FUlJPUik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZFNpZ25hbE9uRXhpdENvbW1hbmQocmVzb3VyY2U6IFJlc291cmNlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGVmYXVsdFVzZXJEYXRhKSB7XG4gICAgICB0aGlzLmRlZmF1bHRVc2VyRGF0YS5hZGRTaWduYWxPbkV4aXRDb21tYW5kKHJlc291cmNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKE11bHRpcGFydFVzZXJEYXRhLlVTRV9QQVJUX0VSUk9SKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkQ29tbWFuZHMoLi4uY29tbWFuZHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGVmYXVsdFVzZXJEYXRhKSB7XG4gICAgICB0aGlzLmRlZmF1bHRVc2VyRGF0YS5hZGRDb21tYW5kcyguLi5jb21tYW5kcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihNdWx0aXBhcnRVc2VyRGF0YS5VU0VfUEFSVF9FUlJPUik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZE9uRXhpdENvbW1hbmRzKC4uLmNvbW1hbmRzOiBzdHJpbmdbXSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRlZmF1bHRVc2VyRGF0YSkge1xuICAgICAgdGhpcy5kZWZhdWx0VXNlckRhdGEuYWRkT25FeGl0Q29tbWFuZHMoLi4uY29tbWFuZHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoTXVsdGlwYXJ0VXNlckRhdGEuVVNFX1BBUlRfRVJST1IpO1xuICAgIH1cbiAgfVxufVxuIl19