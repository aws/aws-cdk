"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionEventType = exports.Function = exports.FunctionCode = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const core_1 = require("@aws-cdk/core");
const cloudfront_generated_1 = require("./cloudfront.generated");
/**
 * Represents the function's source code
 */
class FunctionCode {
    /**
     * Inline code for function
     * @returns code object with inline code.
     * @param code The actual function code
     */
    static fromInline(code) {
        return new InlineCode(code);
    }
    /**
     * Code from external file for function
     * @returns code object with contents from file.
     * @param options the options for the external file
     */
    static fromFile(options) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_FileCodeOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromFile);
            }
            throw error;
        }
        return new FileCode(options);
    }
}
exports.FunctionCode = FunctionCode;
_a = JSII_RTTI_SYMBOL_1;
FunctionCode[_a] = { fqn: "@aws-cdk/aws-cloudfront.FunctionCode", version: "0.0.0" };
/**
 * Represents the function's source code as inline code
 */
class InlineCode extends FunctionCode {
    constructor(code) {
        super();
        this.code = code;
    }
    render() {
        return this.code;
    }
}
/**
 * Represents the function's source code loaded from an external file
 */
class FileCode extends FunctionCode {
    constructor(options) {
        super();
        this.options = options;
    }
    render() {
        return fs.readFileSync(this.options.filePath, { encoding: 'utf-8' });
    }
}
/**
 * A CloudFront Function
 *
 * @resource AWS::CloudFront::Function
 */
class Function extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_FunctionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Function);
            }
            throw error;
        }
        this.functionName = props.functionName ?? this.generateName();
        const resource = new cloudfront_generated_1.CfnFunction(this, 'Resource', {
            autoPublish: true,
            functionCode: props.code.render(),
            functionConfig: {
                comment: props.comment ?? this.functionName,
                runtime: 'cloudfront-js-1.0',
            },
            name: this.functionName,
        });
        this.functionArn = resource.attrFunctionArn;
        this.functionStage = resource.attrStage;
    }
    /** Imports a function by its name and ARN */
    static fromFunctionAttributes(scope, id, attrs) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_cloudfront_FunctionAttributes(attrs);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fromFunctionAttributes);
            }
            throw error;
        }
        return new class extends core_1.Resource {
            constructor() {
                super(...arguments);
                this.functionName = attrs.functionName;
                this.functionArn = attrs.functionArn;
            }
        }(scope, id);
    }
    generateName() {
        const name = core_1.Stack.of(this).region + core_1.Names.uniqueId(this);
        if (name.length > 64) {
            return name.substring(0, 32) + name.substring(name.length - 32);
        }
        return name;
    }
}
exports.Function = Function;
_b = JSII_RTTI_SYMBOL_1;
Function[_b] = { fqn: "@aws-cdk/aws-cloudfront.Function", version: "0.0.0" };
/**
 * The type of events that a CloudFront function can be invoked in response to.
 */
var FunctionEventType;
(function (FunctionEventType) {
    /**
     * The viewer-request specifies the incoming request
     */
    FunctionEventType["VIEWER_REQUEST"] = "viewer-request";
    /**
     * The viewer-response specifies the outgoing response
     */
    FunctionEventType["VIEWER_RESPONSE"] = "viewer-response";
})(FunctionEventType = exports.FunctionEventType || (exports.FunctionEventType = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnVuY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmdW5jdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx5QkFBeUI7QUFDekIsd0NBQWtFO0FBRWxFLGlFQUFxRDtBQUVyRDs7R0FFRztBQUNILE1BQXNCLFlBQVk7SUFFaEM7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBWTtRQUNuQyxPQUFPLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzdCO0lBRUQ7Ozs7T0FJRztJQUNJLE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBd0I7Ozs7Ozs7Ozs7UUFDN0MsT0FBTyxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM5Qjs7QUFsQkgsb0NBd0JDOzs7QUFZRDs7R0FFRztBQUNILE1BQU0sVUFBVyxTQUFRLFlBQVk7SUFFbkMsWUFBb0IsSUFBWTtRQUM5QixLQUFLLEVBQUUsQ0FBQztRQURVLFNBQUksR0FBSixJQUFJLENBQVE7S0FFL0I7SUFFTSxNQUFNO1FBQ1gsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ2xCO0NBQ0Y7QUFHRDs7R0FFRztBQUNILE1BQU0sUUFBUyxTQUFRLFlBQVk7SUFFakMsWUFBb0IsT0FBd0I7UUFDMUMsS0FBSyxFQUFFLENBQUM7UUFEVSxZQUFPLEdBQVAsT0FBTyxDQUFpQjtLQUUzQztJQUVNLE1BQU07UUFDWCxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztLQUN0RTtDQUNGO0FBd0REOzs7O0dBSUc7QUFDSCxNQUFhLFFBQVMsU0FBUSxlQUFRO0lBMEJwQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW9CO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Ozs7OzsrQ0EzQlIsUUFBUTs7OztRQTZCakIsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUU5RCxNQUFNLFFBQVEsR0FBRyxJQUFJLGtDQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNqRCxXQUFXLEVBQUUsSUFBSTtZQUNqQixZQUFZLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDakMsY0FBYyxFQUFFO2dCQUNkLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxZQUFZO2dCQUMzQyxPQUFPLEVBQUUsbUJBQW1CO2FBQzdCO1lBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxZQUFZO1NBQ3hCLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQztRQUM1QyxJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUM7S0FDekM7SUF6Q0QsNkNBQTZDO0lBQ3RDLE1BQU0sQ0FBQyxzQkFBc0IsQ0FBQyxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUF5Qjs7Ozs7Ozs7OztRQUMxRixPQUFPLElBQUksS0FBTSxTQUFRLGVBQVE7WUFBdEI7O2dCQUNPLGlCQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztnQkFDbEMsZ0JBQVcsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDO1lBQ2xELENBQUM7U0FBQSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztLQUNkO0lBcUNPLFlBQVk7UUFDbEIsTUFBTSxJQUFJLEdBQUcsWUFBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsWUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxRCxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxFQUFFO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQ2pFO1FBQ0QsT0FBTyxJQUFJLENBQUM7S0FDYjs7QUFuREgsNEJBb0RDOzs7QUFFRDs7R0FFRztBQUNILElBQVksaUJBV1g7QUFYRCxXQUFZLGlCQUFpQjtJQUUzQjs7T0FFRztJQUNILHNEQUFpQyxDQUFBO0lBRWpDOztPQUVHO0lBQ0gsd0RBQW1DLENBQUE7QUFDckMsQ0FBQyxFQVhXLGlCQUFpQixHQUFqQix5QkFBaUIsS0FBakIseUJBQWlCLFFBVzVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHsgSVJlc291cmNlLCBOYW1lcywgUmVzb3VyY2UsIFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IENmbkZ1bmN0aW9uIH0gZnJvbSAnLi9jbG91ZGZyb250LmdlbmVyYXRlZCc7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgZnVuY3Rpb24ncyBzb3VyY2UgY29kZVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRnVuY3Rpb25Db2RlIHtcblxuICAvKipcbiAgICogSW5saW5lIGNvZGUgZm9yIGZ1bmN0aW9uXG4gICAqIEByZXR1cm5zIGNvZGUgb2JqZWN0IHdpdGggaW5saW5lIGNvZGUuXG4gICAqIEBwYXJhbSBjb2RlIFRoZSBhY3R1YWwgZnVuY3Rpb24gY29kZVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tSW5saW5lKGNvZGU6IHN0cmluZyk6IEZ1bmN0aW9uQ29kZSB7XG4gICAgcmV0dXJuIG5ldyBJbmxpbmVDb2RlKGNvZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvZGUgZnJvbSBleHRlcm5hbCBmaWxlIGZvciBmdW5jdGlvblxuICAgKiBAcmV0dXJucyBjb2RlIG9iamVjdCB3aXRoIGNvbnRlbnRzIGZyb20gZmlsZS5cbiAgICogQHBhcmFtIG9wdGlvbnMgdGhlIG9wdGlvbnMgZm9yIHRoZSBleHRlcm5hbCBmaWxlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZyb21GaWxlKG9wdGlvbnM6IEZpbGVDb2RlT3B0aW9ucyk6IEZ1bmN0aW9uQ29kZSB7XG4gICAgcmV0dXJuIG5ldyBGaWxlQ29kZShvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiByZW5kZXJzIHRoZSBmdW5jdGlvbiBjb2RlXG4gICAqL1xuICBwdWJsaWMgYWJzdHJhY3QgcmVuZGVyKCk6IHN0cmluZztcbn1cblxuLyoqXG4gKiBPcHRpb25zIHdoZW4gcmVhZGluZyB0aGUgZnVuY3Rpb24ncyBjb2RlIGZyb20gYW4gZXh0ZXJuYWwgZmlsZVxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZpbGVDb2RlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBUaGUgcGF0aCBvZiB0aGUgZmlsZSB0byByZWFkIHRoZSBjb2RlIGZyb21cbiAgICovXG4gIHJlYWRvbmx5IGZpbGVQYXRoOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgZnVuY3Rpb24ncyBzb3VyY2UgY29kZSBhcyBpbmxpbmUgY29kZVxuICovXG5jbGFzcyBJbmxpbmVDb2RlIGV4dGVuZHMgRnVuY3Rpb25Db2RlIHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvZGU6IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY29kZTtcbiAgfVxufVxuXG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgZnVuY3Rpb24ncyBzb3VyY2UgY29kZSBsb2FkZWQgZnJvbSBhbiBleHRlcm5hbCBmaWxlXG4gKi9cbmNsYXNzIEZpbGVDb2RlIGV4dGVuZHMgRnVuY3Rpb25Db2RlIHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG9wdGlvbnM6IEZpbGVDb2RlT3B0aW9ucykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGZzLnJlYWRGaWxlU3luYyh0aGlzLm9wdGlvbnMuZmlsZVBhdGgsIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgQ2xvdWRGcm9udCBGdW5jdGlvblxuICovXG5leHBvcnQgaW50ZXJmYWNlIElGdW5jdGlvbiBleHRlbmRzIElSZXNvdXJjZSB7XG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24uXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHJlYWRvbmx5IGZ1bmN0aW9uTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBmdW5jdGlvbi5cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcmVhZG9ubHkgZnVuY3Rpb25Bcm46IHN0cmluZztcbn1cblxuLyoqXG4gKiBBdHRyaWJ1dGVzIG9mIGFuIGV4aXN0aW5nIENsb3VkRnJvbnQgRnVuY3Rpb24gdG8gaW1wb3J0IGl0XG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRnVuY3Rpb25BdHRyaWJ1dGVzIHtcbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBmdW5jdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGZ1bmN0aW9uTmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBmdW5jdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGZ1bmN0aW9uQXJuOiBzdHJpbmc7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgY3JlYXRpbmcgYSBDbG91ZEZyb250IEZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRnVuY3Rpb25Qcm9wcyB7XG4gIC8qKlxuICAgKiBBIG5hbWUgdG8gaWRlbnRpZnkgdGhlIGZ1bmN0aW9uLlxuICAgKiBAZGVmYXVsdCAtIGdlbmVyYXRlZCBmcm9tIHRoZSBgaWRgXG4gICAqL1xuICByZWFkb25seSBmdW5jdGlvbk5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEEgY29tbWVudCB0byBkZXNjcmliZSB0aGUgZnVuY3Rpb24uXG4gICAqIEBkZWZhdWx0IC0gc2FtZSBhcyBgZnVuY3Rpb25OYW1lYFxuICAgKi9cbiAgcmVhZG9ubHkgY29tbWVudD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIHNvdXJjZSBjb2RlIG9mIHRoZSBmdW5jdGlvbi5cbiAgICovXG4gIHJlYWRvbmx5IGNvZGU6IEZ1bmN0aW9uQ29kZTtcbn1cblxuLyoqXG4gKiBBIENsb3VkRnJvbnQgRnVuY3Rpb25cbiAqXG4gKiBAcmVzb3VyY2UgQVdTOjpDbG91ZEZyb250OjpGdW5jdGlvblxuICovXG5leHBvcnQgY2xhc3MgRnVuY3Rpb24gZXh0ZW5kcyBSZXNvdXJjZSBpbXBsZW1lbnRzIElGdW5jdGlvbiB7XG5cbiAgLyoqIEltcG9ydHMgYSBmdW5jdGlvbiBieSBpdHMgbmFtZSBhbmQgQVJOICovXG4gIHB1YmxpYyBzdGF0aWMgZnJvbUZ1bmN0aW9uQXR0cmlidXRlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBhdHRyczogRnVuY3Rpb25BdHRyaWJ1dGVzKTogSUZ1bmN0aW9uIHtcbiAgICByZXR1cm4gbmV3IGNsYXNzIGV4dGVuZHMgUmVzb3VyY2UgaW1wbGVtZW50cyBJRnVuY3Rpb24ge1xuICAgICAgcHVibGljIHJlYWRvbmx5IGZ1bmN0aW9uTmFtZSA9IGF0dHJzLmZ1bmN0aW9uTmFtZTtcbiAgICAgIHB1YmxpYyByZWFkb25seSBmdW5jdGlvbkFybiA9IGF0dHJzLmZ1bmN0aW9uQXJuO1xuICAgIH0oc2NvcGUsIGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiB0aGUgbmFtZSBvZiB0aGUgQ2xvdWRGcm9udCBmdW5jdGlvblxuICAgKiBAYXR0cmlidXRlXG4gICAqL1xuICBwdWJsaWMgcmVhZG9ubHkgZnVuY3Rpb25OYW1lOiBzdHJpbmc7XG4gIC8qKlxuICAgKiB0aGUgQVJOIG9mIHRoZSBDbG91ZEZyb250IGZ1bmN0aW9uXG4gICAqIEBhdHRyaWJ1dGVcbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBmdW5jdGlvbkFybjogc3RyaW5nO1xuICAvKipcbiAgICogdGhlIGRlcGxveW1lbnQgc3RhZ2Ugb2YgdGhlIENsb3VkRnJvbnQgZnVuY3Rpb25cbiAgICogQGF0dHJpYnV0ZVxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGZ1bmN0aW9uU3RhZ2U6IHN0cmluZztcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRnVuY3Rpb25Qcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICB0aGlzLmZ1bmN0aW9uTmFtZSA9IHByb3BzLmZ1bmN0aW9uTmFtZSA/PyB0aGlzLmdlbmVyYXRlTmFtZSgpO1xuXG4gICAgY29uc3QgcmVzb3VyY2UgPSBuZXcgQ2ZuRnVuY3Rpb24odGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgYXV0b1B1Ymxpc2g6IHRydWUsXG4gICAgICBmdW5jdGlvbkNvZGU6IHByb3BzLmNvZGUucmVuZGVyKCksXG4gICAgICBmdW5jdGlvbkNvbmZpZzoge1xuICAgICAgICBjb21tZW50OiBwcm9wcy5jb21tZW50ID8/IHRoaXMuZnVuY3Rpb25OYW1lLFxuICAgICAgICBydW50aW1lOiAnY2xvdWRmcm9udC1qcy0xLjAnLFxuICAgICAgfSxcbiAgICAgIG5hbWU6IHRoaXMuZnVuY3Rpb25OYW1lLFxuICAgIH0pO1xuXG4gICAgdGhpcy5mdW5jdGlvbkFybiA9IHJlc291cmNlLmF0dHJGdW5jdGlvbkFybjtcbiAgICB0aGlzLmZ1bmN0aW9uU3RhZ2UgPSByZXNvdXJjZS5hdHRyU3RhZ2U7XG4gIH1cblxuICBwcml2YXRlIGdlbmVyYXRlTmFtZSgpOiBzdHJpbmcge1xuICAgIGNvbnN0IG5hbWUgPSBTdGFjay5vZih0aGlzKS5yZWdpb24gKyBOYW1lcy51bmlxdWVJZCh0aGlzKTtcbiAgICBpZiAobmFtZS5sZW5ndGggPiA2NCkge1xuICAgICAgcmV0dXJuIG5hbWUuc3Vic3RyaW5nKDAsIDMyKSArIG5hbWUuc3Vic3RyaW5nKG5hbWUubGVuZ3RoIC0gMzIpO1xuICAgIH1cbiAgICByZXR1cm4gbmFtZTtcbiAgfVxufVxuXG4vKipcbiAqIFRoZSB0eXBlIG9mIGV2ZW50cyB0aGF0IGEgQ2xvdWRGcm9udCBmdW5jdGlvbiBjYW4gYmUgaW52b2tlZCBpbiByZXNwb25zZSB0by5cbiAqL1xuZXhwb3J0IGVudW0gRnVuY3Rpb25FdmVudFR5cGUge1xuXG4gIC8qKlxuICAgKiBUaGUgdmlld2VyLXJlcXVlc3Qgc3BlY2lmaWVzIHRoZSBpbmNvbWluZyByZXF1ZXN0XG4gICAqL1xuICBWSUVXRVJfUkVRVUVTVCA9ICd2aWV3ZXItcmVxdWVzdCcsXG5cbiAgLyoqXG4gICAqIFRoZSB2aWV3ZXItcmVzcG9uc2Ugc3BlY2lmaWVzIHRoZSBvdXRnb2luZyByZXNwb25zZVxuICAgKi9cbiAgVklFV0VSX1JFU1BPTlNFID0gJ3ZpZXdlci1yZXNwb25zZScsXG59XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIENsb3VkRnJvbnQgZnVuY3Rpb24gYW5kIGV2ZW50IHR5cGUgd2hlbiB1c2luZyBDRiBGdW5jdGlvbnMuXG4gKiBUaGUgdHlwZSBvZiB0aGUgYEFkZEJlaGF2aW9yT3B0aW9ucy5mdW5jdGlvbkFzc29jaWF0aW9uc2AgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRnVuY3Rpb25Bc3NvY2lhdGlvbiB7XG4gIC8qKlxuICAgKiBUaGUgQ2xvdWRGcm9udCBmdW5jdGlvbiB0aGF0IHdpbGwgYmUgaW52b2tlZC5cbiAgICovXG4gIHJlYWRvbmx5IGZ1bmN0aW9uOiBJRnVuY3Rpb247XG5cbiAgLyoqIFRoZSB0eXBlIG9mIGV2ZW50IHdoaWNoIHNob3VsZCBpbnZva2UgdGhlIGZ1bmN0aW9uLiAqL1xuICByZWFkb25seSBldmVudFR5cGU6IEZ1bmN0aW9uRXZlbnRUeXBlO1xufVxuIl19