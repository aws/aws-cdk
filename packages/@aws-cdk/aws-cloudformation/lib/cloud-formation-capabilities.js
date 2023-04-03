"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudFormationCapabilities = void 0;
/**
 * Capabilities that affect whether CloudFormation is allowed to change IAM resources
 * @deprecated use `core.CfnCapabilities`
 */
var CloudFormationCapabilities;
(function (CloudFormationCapabilities) {
    /**
     * No IAM Capabilities
     *
     * Pass this capability if you wish to block the creation IAM resources.
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
     */
    CloudFormationCapabilities["NONE"] = "";
    /**
     * Capability to create anonymous IAM resources
     *
     * Pass this capability if you're only creating anonymous resources.
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
     */
    CloudFormationCapabilities["ANONYMOUS_IAM"] = "CAPABILITY_IAM";
    /**
     * Capability to create named IAM resources.
     *
     * Pass this capability if you're creating IAM resources that have physical
     * names.
     *
     * `CloudFormationCapabilities.NamedIAM` implies `CloudFormationCapabilities.IAM`; you don't have to pass both.
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
     */
    CloudFormationCapabilities["NAMED_IAM"] = "CAPABILITY_NAMED_IAM";
    /**
     * Capability to run CloudFormation macros
     *
     * Pass this capability if your template includes macros, for example AWS::Include or AWS::Serverless.
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_CreateStack.html
     */
    CloudFormationCapabilities["AUTO_EXPAND"] = "CAPABILITY_AUTO_EXPAND";
})(CloudFormationCapabilities = exports.CloudFormationCapabilities || (exports.CloudFormationCapabilities = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvdWQtZm9ybWF0aW9uLWNhcGFiaWxpdGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNsb3VkLWZvcm1hdGlvbi1jYXBhYmlsaXRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7OztHQUdHO0FBQ0gsSUFBWSwwQkFvQ1g7QUFwQ0QsV0FBWSwwQkFBMEI7SUFDcEM7Ozs7O09BS0c7SUFDSCx1Q0FBUyxDQUFBO0lBRVQ7Ozs7O09BS0c7SUFDSCw4REFBZ0MsQ0FBQTtJQUVoQzs7Ozs7Ozs7T0FRRztJQUNILGdFQUFrQyxDQUFBO0lBRWxDOzs7Ozs7T0FNRztJQUNILG9FQUFzQyxDQUFBO0FBQ3hDLENBQUMsRUFwQ1csMEJBQTBCLEdBQTFCLGtDQUEwQixLQUExQixrQ0FBMEIsUUFvQ3JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDYXBhYmlsaXRpZXMgdGhhdCBhZmZlY3Qgd2hldGhlciBDbG91ZEZvcm1hdGlvbiBpcyBhbGxvd2VkIHRvIGNoYW5nZSBJQU0gcmVzb3VyY2VzXG4gKiBAZGVwcmVjYXRlZCB1c2UgYGNvcmUuQ2ZuQ2FwYWJpbGl0aWVzYFxuICovXG5leHBvcnQgZW51bSBDbG91ZEZvcm1hdGlvbkNhcGFiaWxpdGllcyB7XG4gIC8qKlxuICAgKiBObyBJQU0gQ2FwYWJpbGl0aWVzXG4gICAqXG4gICAqIFBhc3MgdGhpcyBjYXBhYmlsaXR5IGlmIHlvdSB3aXNoIHRvIGJsb2NrIHRoZSBjcmVhdGlvbiBJQU0gcmVzb3VyY2VzLlxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS91c2luZy1pYW0tdGVtcGxhdGUuaHRtbCN1c2luZy1pYW0tY2FwYWJpbGl0aWVzXG4gICAqL1xuICBOT05FID0gJycsXG5cbiAgLyoqXG4gICAqIENhcGFiaWxpdHkgdG8gY3JlYXRlIGFub255bW91cyBJQU0gcmVzb3VyY2VzXG4gICAqXG4gICAqIFBhc3MgdGhpcyBjYXBhYmlsaXR5IGlmIHlvdSdyZSBvbmx5IGNyZWF0aW5nIGFub255bW91cyByZXNvdXJjZXMuXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL3VzaW5nLWlhbS10ZW1wbGF0ZS5odG1sI3VzaW5nLWlhbS1jYXBhYmlsaXRpZXNcbiAgICovXG4gIEFOT05ZTU9VU19JQU0gPSAnQ0FQQUJJTElUWV9JQU0nLFxuXG4gIC8qKlxuICAgKiBDYXBhYmlsaXR5IHRvIGNyZWF0ZSBuYW1lZCBJQU0gcmVzb3VyY2VzLlxuICAgKlxuICAgKiBQYXNzIHRoaXMgY2FwYWJpbGl0eSBpZiB5b3UncmUgY3JlYXRpbmcgSUFNIHJlc291cmNlcyB0aGF0IGhhdmUgcGh5c2ljYWxcbiAgICogbmFtZXMuXG4gICAqXG4gICAqIGBDbG91ZEZvcm1hdGlvbkNhcGFiaWxpdGllcy5OYW1lZElBTWAgaW1wbGllcyBgQ2xvdWRGb3JtYXRpb25DYXBhYmlsaXRpZXMuSUFNYDsgeW91IGRvbid0IGhhdmUgdG8gcGFzcyBib3RoLlxuICAgKiBAbGluayBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQVdTQ2xvdWRGb3JtYXRpb24vbGF0ZXN0L1VzZXJHdWlkZS91c2luZy1pYW0tdGVtcGxhdGUuaHRtbCN1c2luZy1pYW0tY2FwYWJpbGl0aWVzXG4gICAqL1xuICBOQU1FRF9JQU0gPSAnQ0FQQUJJTElUWV9OQU1FRF9JQU0nLFxuXG4gIC8qKlxuICAgKiBDYXBhYmlsaXR5IHRvIHJ1biBDbG91ZEZvcm1hdGlvbiBtYWNyb3NcbiAgICpcbiAgICogUGFzcyB0aGlzIGNhcGFiaWxpdHkgaWYgeW91ciB0ZW1wbGF0ZSBpbmNsdWRlcyBtYWNyb3MsIGZvciBleGFtcGxlIEFXUzo6SW5jbHVkZSBvciBBV1M6OlNlcnZlcmxlc3MuXG4gICAqXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvQVBJUmVmZXJlbmNlL0FQSV9DcmVhdGVTdGFjay5odG1sXG4gICAqL1xuICBBVVRPX0VYUEFORCA9ICdDQVBBQklMSVRZX0FVVE9fRVhQQU5EJ1xufVxuIl19