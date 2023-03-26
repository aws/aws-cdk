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
exports.UserData = UserData;
_a = JSII_RTTI_SYMBOL_1;
UserData[_a] = { fqn: "@aws-cdk/aws-ec2.UserData", version: "0.0.0" };
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
    constructor() {
    }
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
}
exports.MultipartBody = MultipartBody;
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
exports.MultipartUserData = MultipartUserData;
_c = JSII_RTTI_SYMBOL_1;
MultipartUserData[_c] = { fqn: "@aws-cdk/aws-ec2.MultipartUserData", version: "0.0.0" };
MultipartUserData.USE_PART_ERROR = 'MultipartUserData only supports this operation if it has a default UserData. Call addUserDataPart with makeDefault=true.';
MultipartUserData.BOUNDRY_PATTERN = '[^a-zA-Z0-9()+,-./:=?]';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci1kYXRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci1kYXRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdDQUFpRTtBQUNqRSxtREFBc0Q7QUFrRnREOztHQUVHO0FBQ0gsTUFBc0IsUUFBUTtJQUM1Qjs7T0FFRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBZ0MsRUFBRTs7Ozs7Ozs7OztRQUN2RCxPQUFPLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQ25DO0lBRUQ7O09BRUc7SUFDSSxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQWtDLEVBQUU7Ozs7Ozs7Ozs7UUFDM0QsT0FBTyxJQUFJLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNyQztJQUVEOztPQUVHO0lBQ0ksTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFlO1FBQ2xDLE1BQU0sUUFBUSxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7UUFDdEMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5QixPQUFPLFFBQVEsQ0FBQztLQUNqQjtJQUVNLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxFQUF1Qjs7Ozs7Ozs7OztRQUN0RCxRQUFRLEVBQUUsRUFBRTtZQUNWLEtBQUssbUNBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDM0QsS0FBSyxtQ0FBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQztZQUMvRCxLQUFLLG1DQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQztTQUNsSDtLQUNGOztBQTlCSCw0QkFnRUM7OztBQUVEOztHQUVHO0FBQ0gsTUFBTSxhQUFjLFNBQVEsUUFBUTtJQUlsQyxZQUE2QixRQUE4QixFQUFFO1FBQzNELEtBQUssRUFBRSxDQUFDO1FB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YyxDQUFDLENBQUM7U0FDbkQ7S0FDRjtJQUVNLHNCQUFzQixDQUFDLFFBQWtCO1FBQzlDLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN4QixJQUFJLENBQUMsZUFBZSxDQUFDLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3ZEO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQ25EO0tBQ0Y7SUFFTSxXQUFXLENBQUMsR0FBRyxRQUFrQjtRQUN0QyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FBQztTQUMvQzthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUMsQ0FBQztTQUNuRDtLQUNGO0lBRU0saUJBQWlCLENBQUMsR0FBRyxRQUFrQjtRQUM1QyxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDeEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO1NBQ3JEO2FBQU07WUFDTCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1NBQ25EO0tBQ0Y7O0FBbklILDhDQW9JQzs7O0FBbkl5QixnQ0FBYyxHQUFHLDBIQUEwSCxDQUFDO0FBQzVJLGlDQUFlLEdBQUcsd0JBQXdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQnVja2V0IH0gZnJvbSAnQGF3cy1jZGsvYXdzLXMzJztcbmltcG9ydCB7IEZuLCBSZXNvdXJjZSwgU3RhY2ssIENmblJlc291cmNlIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBPcGVyYXRpbmdTeXN0ZW1UeXBlIH0gZnJvbSAnLi9tYWNoaW5lLWltYWdlJztcblxuLyoqXG4gKiBPcHRpb25zIHdoZW4gY29uc3RydWN0aW5nIFVzZXJEYXRhIGZvciBMaW51eFxuICovXG5leHBvcnQgaW50ZXJmYWNlIExpbnV4VXNlckRhdGFPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNoZWJhbmcgZm9yIHRoZSBVc2VyRGF0YSBzY3JpcHRcbiAgICpcbiAgICogQGRlZmF1bHQgXCIjIS9iaW4vYmFzaFwiXG4gICAqL1xuICByZWFkb25seSBzaGViYW5nPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgd2hlbiBjb25zdHJ1Y3RpbmcgVXNlckRhdGEgZm9yIFdpbmRvd3NcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBXaW5kb3dzVXNlckRhdGFPcHRpb25zIHtcbiAgLyoqXG4gICAqIFNldCB0byB0cnVlIHRvIHNldCB0aGlzIHVzZXJkYXRhIHRvIHBlcnNpc3QgdGhyb3VnaCBhbiBpbnN0YW5jZSByZWJvb3Q7IGFsbG93aW5nXG4gICAqIGl0IHRvIHJ1biBvbiBldmVyeSBpbnN0YW5jZSBzdGFydC5cbiAgICogQnkgZGVmYXVsdCwgVXNlckRhdGEgaXMgcnVuIG9ubHkgb25jZSBkdXJpbmcgdGhlIGZpcnN0IGluc3RhbmNlIGxhdW5jaC5cbiAgICpcbiAgICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZTpcbiAgICogaHR0cHM6Ly9hd3MuYW1hem9uLmNvbS9wcmVtaXVtc3VwcG9ydC9rbm93bGVkZ2UtY2VudGVyL2V4ZWN1dGUtdXNlci1kYXRhLWVjMi9cbiAgICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0VDMi9sYXRlc3QvV2luZG93c0d1aWRlL2VjMi13aW5kb3dzLXVzZXItZGF0YS5odG1sI3VzZXItZGF0YS1zY3JpcHRzXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICByZWFkb25seSBwZXJzaXN0PzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBPcHRpb25zIHdoZW4gZG93bmxvYWRpbmcgZmlsZXMgZnJvbSBTM1xuICovXG5leHBvcnQgaW50ZXJmYWNlIFMzRG93bmxvYWRPcHRpb25zIHtcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgUzMgYnVja2V0IHRvIGRvd25sb2FkIGZyb21cbiAgICovXG4gIHJlYWRvbmx5IGJ1Y2tldDogSUJ1Y2tldDtcblxuICAvKipcbiAgICogVGhlIGtleSBvZiB0aGUgZmlsZSB0byBkb3dubG9hZFxuICAgKi9cbiAgcmVhZG9ubHkgYnVja2V0S2V5OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBsb2NhbCBmaWxlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBMaW51eCAgIC0gL3RtcC9idWNrZXRLZXlcbiAgICogICAgICAgICAgV2luZG93cyAtICVURU1QJS9idWNrZXRLZXlcbiAgICovXG4gIHJlYWRvbmx5IGxvY2FsRmlsZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHJlZ2lvbiBvZiB0aGUgUzMgQnVja2V0IChuZWVkZWQgZm9yIGFjY2VzcyB2aWEgVlBDIEdhdGV3YXkpXG4gICAqIEBkZWZhdWx0IG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IHJlZ2lvbj86IHN0cmluZ1xuXG59XG5cbi8qKlxuICogT3B0aW9ucyB3aGVuIGV4ZWN1dGluZyBhIGZpbGUuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRXhlY3V0ZUZpbGVPcHRpb25zIHtcblxuICAvKipcbiAgICogVGhlIHBhdGggdG8gdGhlIGZpbGUuXG4gICAqL1xuICByZWFkb25seSBmaWxlUGF0aDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byB0aGUgZmlsZS5cbiAgICpcbiAgICogQGRlZmF1bHQgTm8gYXJndW1lbnRzIGFyZSBwYXNzZWQgdG8gdGhlIGZpbGUuXG4gICAqL1xuICByZWFkb25seSBhcmd1bWVudHM/OiBzdHJpbmc7XG5cbn1cblxuLyoqXG4gKiBJbnN0YW5jZSBVc2VyIERhdGFcbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFVzZXJEYXRhIHtcbiAgLyoqXG4gICAqIENyZWF0ZSBhIHVzZXJkYXRhIG9iamVjdCBmb3IgTGludXggaG9zdHNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZm9yTGludXgob3B0aW9uczogTGludXhVc2VyRGF0YU9wdGlvbnMgPSB7fSk6IFVzZXJEYXRhIHtcbiAgICByZXR1cm4gbmV3IExpbnV4VXNlckRhdGEob3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlIGEgdXNlcmRhdGEgb2JqZWN0IGZvciBXaW5kb3dzIGhvc3RzXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZvcldpbmRvd3Mob3B0aW9uczogV2luZG93c1VzZXJEYXRhT3B0aW9ucyA9IHt9KTogVXNlckRhdGEge1xuICAgIHJldHVybiBuZXcgV2luZG93c1VzZXJEYXRhKG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIHVzZXJkYXRhIG9iamVjdCB3aXRoIGN1c3RvbSBjb250ZW50XG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGN1c3RvbShjb250ZW50OiBzdHJpbmcpOiBVc2VyRGF0YSB7XG4gICAgY29uc3QgdXNlckRhdGEgPSBuZXcgQ3VzdG9tVXNlckRhdGEoKTtcbiAgICB1c2VyRGF0YS5hZGRDb21tYW5kcyhjb250ZW50KTtcbiAgICByZXR1cm4gdXNlckRhdGE7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGZvck9wZXJhdGluZ1N5c3RlbShvczogT3BlcmF0aW5nU3lzdGVtVHlwZSk6IFVzZXJEYXRhIHtcbiAgICBzd2l0Y2ggKG9zKSB7XG4gICAgICBjYXNlIE9wZXJhdGluZ1N5c3RlbVR5cGUuTElOVVg6IHJldHVybiBVc2VyRGF0YS5mb3JMaW51eCgpO1xuICAgICAgY2FzZSBPcGVyYXRpbmdTeXN0ZW1UeXBlLldJTkRPV1M6IHJldHVybiBVc2VyRGF0YS5mb3JXaW5kb3dzKCk7XG4gICAgICBjYXNlIE9wZXJhdGluZ1N5c3RlbVR5cGUuVU5LTk9XTjogdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgZGV0ZXJtaW5lIFVzZXJEYXRhIGZvciB1bmtub3duIG9wZXJhdGluZyBzeXN0ZW0gdHlwZScpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgb25lIG9yIG1vcmUgY29tbWFuZHMgdG8gdGhlIHVzZXIgZGF0YVxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGFkZENvbW1hbmRzKC4uLmNvbW1hbmRzOiBzdHJpbmdbXSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIEFkZCBvbmUgb3IgbW9yZSBjb21tYW5kcyB0byB0aGUgdXNlciBkYXRhIHRoYXQgd2lsbCBydW4gd2hlbiB0aGUgc2NyaXB0IGV4aXRzLlxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGFkZE9uRXhpdENvbW1hbmRzKC4uLmNvbW1hbmRzOiBzdHJpbmdbXSk6IHZvaWQ7XG5cbiAgLyoqXG4gICAqIFJlbmRlciB0aGUgVXNlckRhdGEgZm9yIHVzZSBpbiBhIGNvbnN0cnVjdFxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IHJlbmRlcigpOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEFkZHMgY29tbWFuZHMgdG8gZG93bmxvYWQgYSBmaWxlIGZyb20gUzNcbiAgICpcbiAgICogQHJldHVybnM6IFRoZSBsb2NhbCBwYXRoIHRoYXQgdGhlIGZpbGUgd2lsbCBiZSBkb3dubG9hZGVkIHRvXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgYWRkUzNEb3dubG9hZENvbW1hbmQocGFyYW1zOiBTM0Rvd25sb2FkT3B0aW9ucyk6IHN0cmluZztcblxuICAvKipcbiAgICogQWRkcyBjb21tYW5kcyB0byBleGVjdXRlIGEgZmlsZVxuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGFkZEV4ZWN1dGVGaWxlQ29tbWFuZCggcGFyYW1zOiBFeGVjdXRlRmlsZU9wdGlvbnMpOiB2b2lkO1xuXG4gIC8qKlxuICAgKiBBZGRzIGEgY29tbWFuZCB3aGljaCB3aWxsIHNlbmQgYSBjZm4tc2lnbmFsIHdoZW4gdGhlIHVzZXIgZGF0YSBzY3JpcHQgZW5kc1xuICAgKi9cbiAgcHVibGljIGFic3RyYWN0IGFkZFNpZ25hbE9uRXhpdENvbW1hbmQoIHJlc291cmNlOiBSZXNvdXJjZSApOiB2b2lkO1xuXG59XG5cbi8qKlxuICogTGludXggSW5zdGFuY2UgVXNlciBEYXRhXG4gKi9cbmNsYXNzIExpbnV4VXNlckRhdGEgZXh0ZW5kcyBVc2VyRGF0YSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbGluZXM6IHN0cmluZ1tdID0gW107XG4gIHByaXZhdGUgcmVhZG9ubHkgb25FeGl0TGluZXM6IHN0cmluZ1tdID0gW107XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSBwcm9wczogTGludXhVc2VyRGF0YU9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgYWRkQ29tbWFuZHMoLi4uY29tbWFuZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5saW5lcy5wdXNoKC4uLmNvbW1hbmRzKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRPbkV4aXRDb21tYW5kcyguLi5jb21tYW5kczogc3RyaW5nW10pIHtcbiAgICB0aGlzLm9uRXhpdExpbmVzLnB1c2goLi4uY29tbWFuZHMpO1xuICB9XG5cbiAgcHVibGljIHJlbmRlcigpOiBzdHJpbmcge1xuICAgIGNvbnN0IHNoZWJhbmcgPSB0aGlzLnByb3BzLnNoZWJhbmcgPz8gJyMhL2Jpbi9iYXNoJztcbiAgICByZXR1cm4gW3NoZWJhbmcsIC4uLih0aGlzLnJlbmRlck9uRXhpdExpbmVzKCkpLCAuLi50aGlzLmxpbmVzXS5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRTM0Rvd25sb2FkQ29tbWFuZChwYXJhbXM6IFMzRG93bmxvYWRPcHRpb25zKTogc3RyaW5nIHtcbiAgICBjb25zdCBzM1BhdGggPSBgczM6Ly8ke3BhcmFtcy5idWNrZXQuYnVja2V0TmFtZX0vJHtwYXJhbXMuYnVja2V0S2V5fWA7XG4gICAgY29uc3QgbG9jYWxQYXRoID0gKCBwYXJhbXMubG9jYWxGaWxlICYmIHBhcmFtcy5sb2NhbEZpbGUubGVuZ3RoICE9PSAwICkgPyBwYXJhbXMubG9jYWxGaWxlIDogYC90bXAvJHsgcGFyYW1zLmJ1Y2tldEtleSB9YDtcbiAgICB0aGlzLmFkZENvbW1hbmRzKFxuICAgICAgYG1rZGlyIC1wICQoZGlybmFtZSAnJHtsb2NhbFBhdGh9JylgLFxuICAgICAgYGF3cyBzMyBjcCAnJHtzM1BhdGh9JyAnJHtsb2NhbFBhdGh9J2AgKyAocGFyYW1zLnJlZ2lvbiAhPT0gdW5kZWZpbmVkID8gYCAtLXJlZ2lvbiAke3BhcmFtcy5yZWdpb259YCA6ICcnKSxcbiAgICApO1xuXG4gICAgcmV0dXJuIGxvY2FsUGF0aDtcbiAgfVxuXG4gIHB1YmxpYyBhZGRFeGVjdXRlRmlsZUNvbW1hbmQoIHBhcmFtczogRXhlY3V0ZUZpbGVPcHRpb25zKTogdm9pZCB7XG4gICAgdGhpcy5hZGRDb21tYW5kcyhcbiAgICAgICdzZXQgLWUnLFxuICAgICAgYGNobW9kICt4ICcke3BhcmFtcy5maWxlUGF0aH0nYCxcbiAgICAgIGAnJHtwYXJhbXMuZmlsZVBhdGh9JyAke3BhcmFtcy5hcmd1bWVudHMgPz8gJyd9YC50cmltKCksXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRTaWduYWxPbkV4aXRDb21tYW5kKCByZXNvdXJjZTogUmVzb3VyY2UgKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihyZXNvdXJjZSk7XG4gICAgY29uc3QgcmVzb3VyY2VJRCA9IChyZXNvdXJjZS5ub2RlLmRlZmF1bHRDaGlsZCBhcyBDZm5SZXNvdXJjZSkubG9naWNhbElkO1xuICAgIHRoaXMuYWRkT25FeGl0Q29tbWFuZHMoYC9vcHQvYXdzL2Jpbi9jZm4tc2lnbmFsIC0tc3RhY2sgJHtzdGFjay5zdGFja05hbWV9IC0tcmVzb3VyY2UgJHtyZXNvdXJjZUlEfSAtLXJlZ2lvbiAke3N0YWNrLnJlZ2lvbn0gLWUgJGV4aXRDb2RlIHx8IGVjaG8gJ0ZhaWxlZCB0byBzZW5kIENsb3VkZm9ybWF0aW9uIFNpZ25hbCdgKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVuZGVyT25FeGl0TGluZXMoKTogc3RyaW5nW10ge1xuICAgIGlmICggdGhpcy5vbkV4aXRMaW5lcy5sZW5ndGggPiAwICkge1xuICAgICAgcmV0dXJuIFsnZnVuY3Rpb24gZXhpdFRyYXAoKXsnLCAnZXhpdENvZGU9JD8nLCAuLi50aGlzLm9uRXhpdExpbmVzLCAnfScsICd0cmFwIGV4aXRUcmFwIEVYSVQnXTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cbi8qKlxuICogV2luZG93cyBJbnN0YW5jZSBVc2VyIERhdGFcbiAqL1xuY2xhc3MgV2luZG93c1VzZXJEYXRhIGV4dGVuZHMgVXNlckRhdGEge1xuICBwcml2YXRlIHJlYWRvbmx5IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIHJlYWRvbmx5IG9uRXhpdExpbmVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcHJvcHM6IFdpbmRvd3NVc2VyRGF0YU9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgYWRkQ29tbWFuZHMoLi4uY29tbWFuZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5saW5lcy5wdXNoKC4uLmNvbW1hbmRzKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRPbkV4aXRDb21tYW5kcyguLi5jb21tYW5kczogc3RyaW5nW10pIHtcbiAgICB0aGlzLm9uRXhpdExpbmVzLnB1c2goLi4uY29tbWFuZHMpO1xuICB9XG5cbiAgcHVibGljIHJlbmRlcigpOiBzdHJpbmcge1xuICAgIHJldHVybiBgPHBvd2Vyc2hlbGw+JHtcbiAgICAgIFsuLi4odGhpcy5yZW5kZXJPbkV4aXRMaW5lcygpKSxcbiAgICAgICAgLi4udGhpcy5saW5lcyxcbiAgICAgICAgLi4uKCB0aGlzLm9uRXhpdExpbmVzLmxlbmd0aCA+IDAgPyBbJ3Rocm93IFwiU3VjY2Vzc1wiJ10gOiBbXSApXS5qb2luKCdcXG4nKVxuICAgIH08L3Bvd2Vyc2hlbGw+JHsodGhpcy5wcm9wcy5wZXJzaXN0ID8/IGZhbHNlKSA/ICc8cGVyc2lzdD50cnVlPC9wZXJzaXN0PicgOiAnJ31gO1xuICB9XG5cbiAgcHVibGljIGFkZFMzRG93bmxvYWRDb21tYW5kKHBhcmFtczogUzNEb3dubG9hZE9wdGlvbnMpOiBzdHJpbmcge1xuICAgIGNvbnN0IGxvY2FsUGF0aCA9ICggcGFyYW1zLmxvY2FsRmlsZSAmJiBwYXJhbXMubG9jYWxGaWxlLmxlbmd0aCAhPT0gMCApID8gcGFyYW1zLmxvY2FsRmlsZSA6IGBDOi90ZW1wLyR7IHBhcmFtcy5idWNrZXRLZXkgfWA7XG4gICAgdGhpcy5hZGRDb21tYW5kcyhcbiAgICAgIGBta2RpciAoU3BsaXQtUGF0aCAtUGF0aCAnJHtsb2NhbFBhdGh9JyApIC1lYSAwYCxcbiAgICAgIGBSZWFkLVMzT2JqZWN0IC1CdWNrZXROYW1lICcke3BhcmFtcy5idWNrZXQuYnVja2V0TmFtZX0nIC1rZXkgJyR7cGFyYW1zLmJ1Y2tldEtleX0nIC1maWxlICcke2xvY2FsUGF0aH0nIC1FcnJvckFjdGlvbiBTdG9wYCArIChwYXJhbXMucmVnaW9uICE9PSB1bmRlZmluZWQgPyBgIC1SZWdpb24gJHtwYXJhbXMucmVnaW9ufWAgOiAnJyksXG4gICAgKTtcbiAgICByZXR1cm4gbG9jYWxQYXRoO1xuICB9XG5cbiAgcHVibGljIGFkZEV4ZWN1dGVGaWxlQ29tbWFuZCggcGFyYW1zOiBFeGVjdXRlRmlsZU9wdGlvbnMpOiB2b2lkIHtcbiAgICB0aGlzLmFkZENvbW1hbmRzKFxuICAgICAgYCYnJHtwYXJhbXMuZmlsZVBhdGh9JyAke3BhcmFtcy5hcmd1bWVudHMgPz8gJyd9YC50cmltKCksXG4gICAgICBgaWYgKCEkPykgeyBXcml0ZS1FcnJvciAnRmFpbGVkIHRvIGV4ZWN1dGUgdGhlIGZpbGUgXCIke3BhcmFtcy5maWxlUGF0aH1cIicgLUVycm9yQWN0aW9uIFN0b3AgfWAsXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRTaWduYWxPbkV4aXRDb21tYW5kKCByZXNvdXJjZTogUmVzb3VyY2UgKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhY2sgPSBTdGFjay5vZihyZXNvdXJjZSk7XG4gICAgY29uc3QgcmVzb3VyY2VJRCA9IChyZXNvdXJjZS5ub2RlLmRlZmF1bHRDaGlsZCBhcyBDZm5SZXNvdXJjZSkubG9naWNhbElkO1xuXG4gICAgdGhpcy5hZGRPbkV4aXRDb21tYW5kcyhgY2ZuLXNpZ25hbCAtLXN0YWNrICR7c3RhY2suc3RhY2tOYW1lfSAtLXJlc291cmNlICR7cmVzb3VyY2VJRH0gLS1yZWdpb24gJHtzdGFjay5yZWdpb259IC0tc3VjY2VzcyAoJHN1Y2Nlc3MuVG9TdHJpbmcoKS5Ub0xvd2VyKCkpYCk7XG4gIH1cblxuICBwcml2YXRlIHJlbmRlck9uRXhpdExpbmVzKCk6IHN0cmluZ1tdIHtcbiAgICBpZiAoIHRoaXMub25FeGl0TGluZXMubGVuZ3RoID4gMCApIHtcbiAgICAgIHJldHVybiBbJ3RyYXAgeycsICckc3VjY2Vzcz0oJFBTSXRlbS5FeGNlcHRpb24uTWVzc2FnZSAtZXEgXCJTdWNjZXNzXCIpJywgLi4udGhpcy5vbkV4aXRMaW5lcywgJ2JyZWFrJywgJ30nXTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG59XG5cbi8qKlxuICogQ3VzdG9tIEluc3RhbmNlIFVzZXIgRGF0YVxuICovXG5jbGFzcyBDdXN0b21Vc2VyRGF0YSBleHRlbmRzIFVzZXJEYXRhIHtcbiAgcHJpdmF0ZSByZWFkb25seSBsaW5lczogc3RyaW5nW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHVibGljIGFkZENvbW1hbmRzKC4uLmNvbW1hbmRzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMubGluZXMucHVzaCguLi5jb21tYW5kcyk7XG4gIH1cblxuICBwdWJsaWMgYWRkT25FeGl0Q29tbWFuZHMoKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDdXN0b21Vc2VyRGF0YSBkb2VzIG5vdCBzdXBwb3J0IGFkZE9uRXhpdENvbW1hbmRzLCB1c2UgVXNlckRhdGEuZm9yTGludXgoKSBvciBVc2VyRGF0YS5mb3JXaW5kb3dzKCkgaW5zdGVhZC4nKTtcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5saW5lcy5qb2luKCdcXG4nKTtcbiAgfVxuXG4gIHB1YmxpYyBhZGRTM0Rvd25sb2FkQ29tbWFuZCgpOiBzdHJpbmcge1xuICAgIHRocm93IG5ldyBFcnJvcignQ3VzdG9tVXNlckRhdGEgZG9lcyBub3Qgc3VwcG9ydCBhZGRTM0Rvd25sb2FkQ29tbWFuZCwgdXNlIFVzZXJEYXRhLmZvckxpbnV4KCkgb3IgVXNlckRhdGEuZm9yV2luZG93cygpIGluc3RlYWQuJyk7XG4gIH1cblxuICBwdWJsaWMgYWRkRXhlY3V0ZUZpbGVDb21tYW5kKCk6IHZvaWQge1xuICAgIHRocm93IG5ldyBFcnJvcignQ3VzdG9tVXNlckRhdGEgZG9lcyBub3Qgc3VwcG9ydCBhZGRFeGVjdXRlRmlsZUNvbW1hbmQsIHVzZSBVc2VyRGF0YS5mb3JMaW51eCgpIG9yIFVzZXJEYXRhLmZvcldpbmRvd3MoKSBpbnN0ZWFkLicpO1xuICB9XG5cbiAgcHVibGljIGFkZFNpZ25hbE9uRXhpdENvbW1hbmQoKTogdm9pZCB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDdXN0b21Vc2VyRGF0YSBkb2VzIG5vdCBzdXBwb3J0IGFkZFNpZ25hbE9uRXhpdENvbW1hbmQsIHVzZSBVc2VyRGF0YS5mb3JMaW51eCgpIG9yIFVzZXJEYXRhLmZvcldpbmRvd3MoKSBpbnN0ZWFkLicpO1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyB3aGVuIGNyZWF0aW5nIGBNdWx0aXBhcnRCb2R5YC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBNdWx0aXBhcnRCb2R5T3B0aW9ucyB7XG5cbiAgLyoqXG4gICAqIGBDb250ZW50LVR5cGVgIGhlYWRlciBvZiB0aGlzIHBhcnQuXG4gICAqXG4gICAqIFNvbWUgZXhhbXBsZXMgb2YgY29udGVudCB0eXBlczpcbiAgICogKiBgdGV4dC94LXNoZWxsc2NyaXB0OyBjaGFyc2V0PVwidXRmLThcImAgKHNoZWxsIHNjcmlwdClcbiAgICogKiBgdGV4dC9jbG91ZC1ib290aG9vazsgY2hhcnNldD1cInV0Zi04XCJgIChzaGVsbCBzY3JpcHQgZXhlY3V0ZWQgZHVyaW5nIGJvb3QgcGhhc2UpXG4gICAqXG4gICAqIEZvciBMaW51eCBzaGVsbCBzY3JpcHRzIHVzZSBgdGV4dC94LXNoZWxsc2NyaXB0YC5cbiAgICovXG4gIHJlYWRvbmx5IGNvbnRlbnRUeXBlOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIGBDb250ZW50LVRyYW5zZmVyLUVuY29kaW5nYCBoZWFkZXIgc3BlY2lmeWluZyBwYXJ0IGVuY29kaW5nLlxuICAgKlxuICAgKiBAZGVmYXVsdCB1bmRlZmluZWQgLSBib2R5IGlzIG5vdCBlbmNvZGVkXG4gICAqL1xuICByZWFkb25seSB0cmFuc2ZlckVuY29kaW5nPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYm9keSBvZiBtZXNzYWdlLlxuICAgKlxuICAgKiBAZGVmYXVsdCB1bmRlZmluZWQgLSBib2R5IHdpbGwgbm90IGJlIGFkZGVkIHRvIHBhcnRcbiAgICovXG4gIHJlYWRvbmx5IGJvZHk/OiBzdHJpbmcsXG59XG5cbi8qKlxuICogVGhlIGJhc2UgY2xhc3MgZm9yIGFsbCBjbGFzc2VzIHdoaWNoIGNhbiBiZSB1c2VkIGFzIGBNdWx0aXBhcnRVc2VyRGF0YWAuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBNdWx0aXBhcnRCb2R5IHtcbiAgLyoqXG4gICAqIENvbnRlbnQgdHlwZSBmb3Igc2hlbGwgc2NyaXB0c1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBTSEVMTF9TQ1JJUFQgPSAndGV4dC94LXNoZWxsc2NyaXB0OyBjaGFyc2V0PVwidXRmLThcIic7XG5cbiAgLyoqXG4gICAqIENvbnRlbnQgdHlwZSBmb3IgYm9vdCBob29rc1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBDTE9VRF9CT09USE9PSyA9ICd0ZXh0L2Nsb3VkLWJvb3Rob29rOyBjaGFyc2V0PVwidXRmLThcIic7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgdGhlIG5ldyBgTXVsdGlwYXJ0Qm9keWAgd3JhcHBpbmcgZXhpc3RpbmcgYFVzZXJEYXRhYC4gTW9kaWZpY2F0aW9uIHRvIGBVc2VyRGF0YWAgYXJlIHJlZmxlY3RlZFxuICAgKiBpbiBzdWJzZXF1ZW50IHJlbmRlcnMgb2YgdGhlIHBhcnQuXG4gICAqXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGNvbnRlbnQgdHlwZXMgc2VlIGBNdWx0aXBhcnRCb2R5T3B0aW9ucy5jb250ZW50VHlwZWAuXG4gICAqXG4gICAqIEBwYXJhbSB1c2VyRGF0YSB1c2VyIGRhdGEgdG8gd3JhcCBpbnRvIGJvZHkgcGFydFxuICAgKiBAcGFyYW0gY29udGVudFR5cGUgb3B0aW9uYWwgY29udGVudCB0eXBlLCBpZiBkZWZhdWx0IG9uZSBzaG91bGQgbm90IGJlIHVzZWRcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbVVzZXJEYXRhKHVzZXJEYXRhOiBVc2VyRGF0YSwgY29udGVudFR5cGU/OiBzdHJpbmcpOiBNdWx0aXBhcnRCb2R5IHtcbiAgICByZXR1cm4gbmV3IE11bHRpcGFydEJvZHlVc2VyRGF0YVdyYXBwZXIodXNlckRhdGEsIGNvbnRlbnRUeXBlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25zdHJ1Y3RzIHRoZSByYXcgYE11bHRpcGFydEJvZHlgIHVzaW5nIHNwZWNpZmllZCBib2R5LCBjb250ZW50IHR5cGUgYW5kIHRyYW5zZmVyIGVuY29kaW5nLlxuICAgKlxuICAgKiBXaGVuIHRyYW5zZmVyIGVuY29kaW5nIGlzIHNwZWNpZmllZCAodHlwaWNhbGx5IGFzIEJhc2U2NCksIGl0J3MgY2FsbGVyIHJlc3BvbnNpYmlsaXR5IHRvIGNvbnZlcnQgYm9keSB0b1xuICAgKiBCYXNlNjQgZWl0aGVyIGJ5IHdyYXBwaW5nIHdpdGggYEZuLmJhc2U2NGAgb3IgYnkgY29udmVydGluZyBpdCBieSBvdGhlciBjb252ZXJ0ZXJzLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tUmF3Qm9keShvcHRzOiBNdWx0aXBhcnRCb2R5T3B0aW9ucyk6IE11bHRpcGFydEJvZHkge1xuICAgIHJldHVybiBuZXcgTXVsdGlwYXJ0Qm9keVJhdyhvcHRzKTtcbiAgfVxuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcigpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYm9keSBwYXJ0IGFzIHRoZSBzdHJpbmcuXG4gICAqXG4gICAqIFN1YmNsYXNzZXMgc2hvdWxkIG5vdCBhZGQgbGVhZGluZyBub3IgdHJhaWxpbmcgbmV3IGxpbmUgY2hhcmFjdGVycyAoXFxyIFxcbilcbiAgICovXG4gIHB1YmxpYyBhYnN0cmFjdCByZW5kZXJCb2R5UGFydCgpOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBUaGUgcmF3IHBhcnQgb2YgbXVsdGktcGFydCB1c2VyIGRhdGEsIHdoaWNoIGNhbiBiZSBhZGRlZCB0byBgTXVsdGlwYXJ0VXNlckRhdGFgLlxuICovXG5jbGFzcyBNdWx0aXBhcnRCb2R5UmF3IGV4dGVuZHMgTXVsdGlwYXJ0Qm9keSB7XG4gIHB1YmxpYyBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IHByb3BzOiBNdWx0aXBhcnRCb2R5T3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIGJvZHkgcGFydCBhcyB0aGUgc3RyaW5nLlxuICAgKi9cbiAgcHVibGljIHJlbmRlckJvZHlQYXJ0KCk6IHN0cmluZ1tdIHtcbiAgICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG5cbiAgICByZXN1bHQucHVzaChgQ29udGVudC1UeXBlOiAke3RoaXMucHJvcHMuY29udGVudFR5cGV9YCk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy50cmFuc2ZlckVuY29kaW5nICE9IG51bGwpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGBDb250ZW50LVRyYW5zZmVyLUVuY29kaW5nOiAke3RoaXMucHJvcHMudHJhbnNmZXJFbmNvZGluZ31gKTtcbiAgICB9XG4gICAgLy8gT25lIGxpbmUgZnJlZSBhZnRlciBzZXBhcmF0b3JcbiAgICByZXN1bHQucHVzaCgnJyk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5ib2R5ICE9IG51bGwpIHtcbiAgICAgIHJlc3VsdC5wdXNoKHRoaXMucHJvcHMuYm9keSk7XG4gICAgICAvLyBUaGUgbmV3IGxpbmUgYWRkZWQgYWZ0ZXIgam9pbiB3aWxsIGJlIGNvbnN1bWVkIGJ5IGVuY2Fwc3VsYXRpbmcgb3IgY2xvc2luZyBib3VuZGFyeVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuLyoqXG4gKiBXcmFwcGVyIGZvciBgVXNlckRhdGFgLlxuICovXG5jbGFzcyBNdWx0aXBhcnRCb2R5VXNlckRhdGFXcmFwcGVyIGV4dGVuZHMgTXVsdGlwYXJ0Qm9keSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgY29udGVudFR5cGU6IHN0cmluZztcblxuICBwdWJsaWMgY29uc3RydWN0b3IocHJpdmF0ZSByZWFkb25seSB1c2VyRGF0YTogVXNlckRhdGEsIGNvbnRlbnRUeXBlPzogc3RyaW5nKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuY29udGVudFR5cGUgPSBjb250ZW50VHlwZSB8fCBNdWx0aXBhcnRCb2R5LlNIRUxMX1NDUklQVDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW5kZXIgYm9keSBwYXJ0IGFzIHRoZSBzdHJpbmcuXG4gICAqL1xuICBwdWJsaWMgcmVuZGVyQm9keVBhcnQoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHJlc3VsdDogc3RyaW5nW10gPSBbXTtcblxuICAgIHJlc3VsdC5wdXNoKGBDb250ZW50LVR5cGU6ICR7dGhpcy5jb250ZW50VHlwZX1gKTtcbiAgICByZXN1bHQucHVzaCgnQ29udGVudC1UcmFuc2Zlci1FbmNvZGluZzogYmFzZTY0Jyk7XG4gICAgcmVzdWx0LnB1c2goJycpO1xuICAgIHJlc3VsdC5wdXNoKEZuLmJhc2U2NCh0aGlzLnVzZXJEYXRhLnJlbmRlcigpKSk7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8qKlxuICogT3B0aW9ucyBmb3IgY3JlYXRpbmcgYE11bHRpcGFydFVzZXJEYXRhYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIE11bHRpcGFydFVzZXJEYXRhT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgc3RyaW5nIHVzZWQgdG8gc2VwYXJhdGUgcGFydHMgaW4gbXVsdGlwYXJ0IHVzZXIgZGF0YSBhcmNoaXZlIChpdCdzIGxpa2UgTUlNRSBib3VuZGFyeSkuXG4gICAqXG4gICAqIFRoaXMgc3RyaW5nIHNob3VsZCBjb250YWluIFthLXpBLVowLTkoKSssLS4vOj0/XSBjaGFyYWN0ZXJzIG9ubHksIGFuZCBzaG91bGQgbm90IGJlIHByZXNlbnQgaW4gYW55IHBhcnQsIG9yIGluIHRleHQgY29udGVudCBvZiBhcmNoaXZlLlxuICAgKlxuICAgKiBAZGVmYXVsdCBgK0FXUytDREsrVXNlcitEYXRhK1NlcGFyYXRvcj09YFxuICAgKi9cbiAgcmVhZG9ubHkgcGFydHNTZXBhcmF0b3I/OiBzdHJpbmc7XG59XG5cbi8qKlxuICogTWltZSBtdWx0aXBhcnQgdXNlciBkYXRhLlxuICpcbiAqIFRoaXMgY2xhc3MgcmVwcmVzZW50cyBNSU1FIG11bHRpcGFydCB1c2VyIGRhdGEsIGFzIGRlc2NyaWJlZCBpbi5cbiAqIFtTcGVjaWZ5aW5nIE11bHRpcGxlIFVzZXIgRGF0YSBCbG9ja3MgVXNpbmcgYSBNSU1FIE11bHRpIFBhcnQgQXJjaGl2ZV0oaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvYm9vdHN0cmFwX2NvbnRhaW5lcl9pbnN0YW5jZS5odG1sI211bHRpLXBhcnRfdXNlcl9kYXRhKVxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIE11bHRpcGFydFVzZXJEYXRhIGV4dGVuZHMgVXNlckRhdGEge1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBVU0VfUEFSVF9FUlJPUiA9ICdNdWx0aXBhcnRVc2VyRGF0YSBvbmx5IHN1cHBvcnRzIHRoaXMgb3BlcmF0aW9uIGlmIGl0IGhhcyBhIGRlZmF1bHQgVXNlckRhdGEuIENhbGwgYWRkVXNlckRhdGFQYXJ0IHdpdGggbWFrZURlZmF1bHQ9dHJ1ZS4nO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBCT1VORFJZX1BBVFRFUk4gPSAnW15hLXpBLVowLTkoKSssLS4vOj0/XSc7XG5cbiAgcHJpdmF0ZSBwYXJ0czogTXVsdGlwYXJ0Qm9keVtdID0gW107XG5cbiAgcHJpdmF0ZSBvcHRzOiBNdWx0aXBhcnRVc2VyRGF0YU9wdGlvbnM7XG5cbiAgcHJpdmF0ZSBkZWZhdWx0VXNlckRhdGE/OiBVc2VyRGF0YTtcblxuICBjb25zdHJ1Y3RvcihvcHRzPzogTXVsdGlwYXJ0VXNlckRhdGFPcHRpb25zKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIGxldCBwYXJ0c1NlcGFyYXRvcjogc3RyaW5nO1xuXG4gICAgLy8gVmFsaWRhdGUgc2VwYXJhdG9yXG4gICAgaWYgKG9wdHM/LnBhcnRzU2VwYXJhdG9yICE9IG51bGwpIHtcbiAgICAgIGlmIChuZXcgUmVnRXhwKE11bHRpcGFydFVzZXJEYXRhLkJPVU5EUllfUEFUVEVSTikudGVzdChvcHRzIS5wYXJ0c1NlcGFyYXRvcikpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGNoYXJhY3RlcnMgaW4gc2VwYXJhdG9yLiBTZXBhcmF0b3IgaGFzIHRvIG1hdGNoIHBhdHRlcm4gJHtNdWx0aXBhcnRVc2VyRGF0YS5CT1VORFJZX1BBVFRFUk59YCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJ0c1NlcGFyYXRvciA9IG9wdHMhLnBhcnRzU2VwYXJhdG9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBwYXJ0c1NlcGFyYXRvciA9ICcrQVdTK0NESytVc2VyK0RhdGErU2VwYXJhdG9yPT0nO1xuICAgIH1cblxuICAgIHRoaXMub3B0cyA9IHtcbiAgICAgIHBhcnRzU2VwYXJhdG9yOiBwYXJ0c1NlcGFyYXRvcixcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgYSBwYXJ0IHRvIHRoZSBsaXN0IG9mIHBhcnRzLlxuICAgKi9cbiAgcHVibGljIGFkZFBhcnQocGFydDogTXVsdGlwYXJ0Qm9keSkge1xuICAgIHRoaXMucGFydHMucHVzaChwYXJ0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgbXVsdGlwYXJ0IHBhcnQgYmFzZWQgb24gYSBVc2VyRGF0YSBvYmplY3QuXG4gICAqXG4gICAqIElmIGBtYWtlRGVmYXVsdGAgaXMgdHJ1ZSwgdGhlbiB0aGUgVXNlckRhdGEgYWRkZWQgYnkgdGhpcyBtZXRob2RcbiAgICogd2lsbCBhbHNvIGJlIHRoZSB0YXJnZXQgb2YgY2FsbHMgdG8gdGhlIGBhZGQqQ29tbWFuZGAgbWV0aG9kcyBvblxuICAgKiB0aGlzIE11bHRpcGFydFVzZXJEYXRhIG9iamVjdC5cbiAgICpcbiAgICogSWYgYG1ha2VEZWZhdWx0YCBpcyBmYWxzZSwgdGhlbiB0aGlzIGlzIHRoZSBzYW1lIGFzIGNhbGxpbmc6XG4gICAqXG4gICAqIGBgYHRzXG4gICAqIGRlY2xhcmUgY29uc3QgbXVsdGlQYXJ0OiBlYzIuTXVsdGlwYXJ0VXNlckRhdGE7XG4gICAqIGRlY2xhcmUgY29uc3QgdXNlckRhdGE6IGVjMi5Vc2VyRGF0YTtcbiAgICogZGVjbGFyZSBjb25zdCBjb250ZW50VHlwZTogc3RyaW5nO1xuICAgKlxuICAgKiBtdWx0aVBhcnQuYWRkUGFydChlYzIuTXVsdGlwYXJ0Qm9keS5mcm9tVXNlckRhdGEodXNlckRhdGEsIGNvbnRlbnRUeXBlKSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBBbiB1bmRlZmluZWQgYG1ha2VEZWZhdWx0YCBkZWZhdWx0cyB0byBlaXRoZXI6XG4gICAqIC0gYHRydWVgIGlmIG5vIGRlZmF1bHQgVXNlckRhdGEgaGFzIGJlZW4gc2V0IHlldDsgb3JcbiAgICogLSBgZmFsc2VgIGlmIHRoZXJlIGlzIG5vIGRlZmF1bHQgVXNlckRhdGEgc2V0LlxuICAgKi9cbiAgcHVibGljIGFkZFVzZXJEYXRhUGFydCh1c2VyRGF0YTogVXNlckRhdGEsIGNvbnRlbnRUeXBlPzogc3RyaW5nLCBtYWtlRGVmYXVsdD86IGJvb2xlYW4pIHtcbiAgICB0aGlzLmFkZFBhcnQoTXVsdGlwYXJ0Qm9keS5mcm9tVXNlckRhdGEodXNlckRhdGEsIGNvbnRlbnRUeXBlKSk7XG4gICAgbWFrZURlZmF1bHQgPSBtYWtlRGVmYXVsdCA/PyAodGhpcy5kZWZhdWx0VXNlckRhdGEgPT09IHVuZGVmaW5lZCA/IHRydWUgOiBmYWxzZSk7XG4gICAgaWYgKG1ha2VEZWZhdWx0KSB7XG4gICAgICB0aGlzLmRlZmF1bHRVc2VyRGF0YSA9IHVzZXJEYXRhO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKTogc3RyaW5nIHtcbiAgICBjb25zdCBib3VuZGFyeSA9IHRoaXMub3B0cy5wYXJ0c1NlcGFyYXRvcjtcbiAgICAvLyBOb3cgYnVpbGQgZmluYWwgTUlNRSBhcmNoaXZlIC0gdGhlcmUgYXJlIGZldyBjaGFuZ2VzIGZyb20gTUlNRSBtZXNzYWdlIHdoaWNoIGFyZSBhY2NlcHRlZCBieSBjbG91ZC1pbml0OlxuICAgIC8vIC0gTUlNRSBSRkMgdXNlcyBDUkxGIHRvIHNlcGFyYXRlIGxpbmVzIC0gY2xvdWQtaW5pdCBpcyBmaW5lIHdpdGggTEYgXFxuIG9ubHlcbiAgICAvLyBOb3RlOiBuZXcgbGluZXMgbWF0dGVycywgbWF0dGVycyBhIGxvdC5cbiAgICB2YXIgcmVzdWx0QXJjaGl2ZSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG4gICAgcmVzdWx0QXJjaGl2ZS5wdXNoKGBDb250ZW50LVR5cGU6IG11bHRpcGFydC9taXhlZDsgYm91bmRhcnk9XCIke2JvdW5kYXJ5fVwiYCk7XG4gICAgcmVzdWx0QXJjaGl2ZS5wdXNoKCdNSU1FLVZlcnNpb246IDEuMCcpO1xuXG4gICAgLy8gQWRkIG5ldyBsaW5lLCB0aGUgbmV4dCBvbmUgd2lsbCBiZSBib3VuZGFyeSAoZW5jYXBzdWxhdGluZyBvciBjbG9zaW5nKVxuICAgIC8vIHNvIHRoaXMgbGluZSB3aWxsIGNvdW50IGludG8gaXQuXG4gICAgcmVzdWx0QXJjaGl2ZS5wdXNoKCcnKTtcblxuICAgIC8vIEFkZCBwYXJ0cyAtIGVhY2ggcGFydCBzdGFydHMgd2l0aCBib3VuZGFyeVxuICAgIHRoaXMucGFydHMuZm9yRWFjaChwYXJ0ID0+IHtcbiAgICAgIHJlc3VsdEFyY2hpdmUucHVzaChgLS0ke2JvdW5kYXJ5fWApO1xuICAgICAgcmVzdWx0QXJjaGl2ZS5wdXNoKC4uLnBhcnQucmVuZGVyQm9keVBhcnQoKSk7XG4gICAgfSk7XG5cbiAgICAvLyBBZGQgY2xvc2luZyBib3VuZGFyeVxuICAgIHJlc3VsdEFyY2hpdmUucHVzaChgLS0ke2JvdW5kYXJ5fS0tYCk7XG4gICAgcmVzdWx0QXJjaGl2ZS5wdXNoKCcnKTsgLy8gRm9yY2UgbmV3IGxpbmUgYXQgdGhlIGVuZFxuXG4gICAgcmV0dXJuIHJlc3VsdEFyY2hpdmUuam9pbignXFxuJyk7XG4gIH1cblxuICBwdWJsaWMgYWRkUzNEb3dubG9hZENvbW1hbmQocGFyYW1zOiBTM0Rvd25sb2FkT3B0aW9ucyk6IHN0cmluZyB7XG4gICAgaWYgKHRoaXMuZGVmYXVsdFVzZXJEYXRhKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZWZhdWx0VXNlckRhdGEuYWRkUzNEb3dubG9hZENvbW1hbmQocGFyYW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKE11bHRpcGFydFVzZXJEYXRhLlVTRV9QQVJUX0VSUk9SKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkRXhlY3V0ZUZpbGVDb21tYW5kKHBhcmFtczogRXhlY3V0ZUZpbGVPcHRpb25zKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGVmYXVsdFVzZXJEYXRhKSB7XG4gICAgICB0aGlzLmRlZmF1bHRVc2VyRGF0YS5hZGRFeGVjdXRlRmlsZUNvbW1hbmQocGFyYW1zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKE11bHRpcGFydFVzZXJEYXRhLlVTRV9QQVJUX0VSUk9SKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkU2lnbmFsT25FeGl0Q29tbWFuZChyZXNvdXJjZTogUmVzb3VyY2UpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kZWZhdWx0VXNlckRhdGEpIHtcbiAgICAgIHRoaXMuZGVmYXVsdFVzZXJEYXRhLmFkZFNpZ25hbE9uRXhpdENvbW1hbmQocmVzb3VyY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoTXVsdGlwYXJ0VXNlckRhdGEuVVNFX1BBUlRfRVJST1IpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhZGRDb21tYW5kcyguLi5jb21tYW5kczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kZWZhdWx0VXNlckRhdGEpIHtcbiAgICAgIHRoaXMuZGVmYXVsdFVzZXJEYXRhLmFkZENvbW1hbmRzKC4uLmNvbW1hbmRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKE11bHRpcGFydFVzZXJEYXRhLlVTRV9QQVJUX0VSUk9SKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkT25FeGl0Q29tbWFuZHMoLi4uY29tbWFuZHM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGVmYXVsdFVzZXJEYXRhKSB7XG4gICAgICB0aGlzLmRlZmF1bHRVc2VyRGF0YS5hZGRPbkV4aXRDb21tYW5kcyguLi5jb21tYW5kcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihNdWx0aXBhcnRVc2VyRGF0YS5VU0VfUEFSVF9FUlJPUik7XG4gICAgfVxuICB9XG59XG4iXX0=