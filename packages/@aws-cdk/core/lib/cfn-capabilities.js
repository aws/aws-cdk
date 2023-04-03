"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CfnCapabilities = void 0;
/**
 * Capabilities that affect whether CloudFormation is allowed to change IAM resources
 */
var CfnCapabilities;
(function (CfnCapabilities) {
    /**
     * No IAM Capabilities
     *
     * Pass this capability if you wish to block the creation IAM resources.
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
     */
    CfnCapabilities["NONE"] = "";
    /**
     * Capability to create anonymous IAM resources
     *
     * Pass this capability if you're only creating anonymous resources.
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
     */
    CfnCapabilities["ANONYMOUS_IAM"] = "CAPABILITY_IAM";
    /**
     * Capability to create named IAM resources.
     *
     * Pass this capability if you're creating IAM resources that have physical
     * names.
     *
     * `CloudFormationCapabilities.NamedIAM` implies `CloudFormationCapabilities.IAM`; you don't have to pass both.
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-iam-template.html#using-iam-capabilities
     */
    CfnCapabilities["NAMED_IAM"] = "CAPABILITY_NAMED_IAM";
    /**
     * Capability to run CloudFormation macros
     *
     * Pass this capability if your template includes macros, for example AWS::Include or AWS::Serverless.
     *
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/APIReference/API_CreateStack.html
     */
    CfnCapabilities["AUTO_EXPAND"] = "CAPABILITY_AUTO_EXPAND";
})(CfnCapabilities = exports.CfnCapabilities || (exports.CfnCapabilities = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2ZuLWNhcGFiaWxpdGllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNmbi1jYXBhYmlsaXRpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxJQUFZLGVBb0NYO0FBcENELFdBQVksZUFBZTtJQUN6Qjs7Ozs7T0FLRztJQUNILDRCQUFTLENBQUE7SUFFVDs7Ozs7T0FLRztJQUNILG1EQUFnQyxDQUFBO0lBRWhDOzs7Ozs7OztPQVFHO0lBQ0gscURBQWtDLENBQUE7SUFFbEM7Ozs7OztPQU1HO0lBQ0gseURBQXNDLENBQUE7QUFDeEMsQ0FBQyxFQXBDVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQW9DMUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENhcGFiaWxpdGllcyB0aGF0IGFmZmVjdCB3aGV0aGVyIENsb3VkRm9ybWF0aW9uIGlzIGFsbG93ZWQgdG8gY2hhbmdlIElBTSByZXNvdXJjZXNcbiAqL1xuZXhwb3J0IGVudW0gQ2ZuQ2FwYWJpbGl0aWVzIHtcbiAgLyoqXG4gICAqIE5vIElBTSBDYXBhYmlsaXRpZXNcbiAgICpcbiAgICogUGFzcyB0aGlzIGNhcGFiaWxpdHkgaWYgeW91IHdpc2ggdG8gYmxvY2sgdGhlIGNyZWF0aW9uIElBTSByZXNvdXJjZXMuXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL3VzaW5nLWlhbS10ZW1wbGF0ZS5odG1sI3VzaW5nLWlhbS1jYXBhYmlsaXRpZXNcbiAgICovXG4gIE5PTkUgPSAnJyxcblxuICAvKipcbiAgICogQ2FwYWJpbGl0eSB0byBjcmVhdGUgYW5vbnltb3VzIElBTSByZXNvdXJjZXNcbiAgICpcbiAgICogUGFzcyB0aGlzIGNhcGFiaWxpdHkgaWYgeW91J3JlIG9ubHkgY3JlYXRpbmcgYW5vbnltb3VzIHJlc291cmNlcy5cbiAgICogQGxpbmsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9Vc2VyR3VpZGUvdXNpbmctaWFtLXRlbXBsYXRlLmh0bWwjdXNpbmctaWFtLWNhcGFiaWxpdGllc1xuICAgKi9cbiAgQU5PTllNT1VTX0lBTSA9ICdDQVBBQklMSVRZX0lBTScsXG5cbiAgLyoqXG4gICAqIENhcGFiaWxpdHkgdG8gY3JlYXRlIG5hbWVkIElBTSByZXNvdXJjZXMuXG4gICAqXG4gICAqIFBhc3MgdGhpcyBjYXBhYmlsaXR5IGlmIHlvdSdyZSBjcmVhdGluZyBJQU0gcmVzb3VyY2VzIHRoYXQgaGF2ZSBwaHlzaWNhbFxuICAgKiBuYW1lcy5cbiAgICpcbiAgICogYENsb3VkRm9ybWF0aW9uQ2FwYWJpbGl0aWVzLk5hbWVkSUFNYCBpbXBsaWVzIGBDbG91ZEZvcm1hdGlvbkNhcGFiaWxpdGllcy5JQU1gOyB5b3UgZG9uJ3QgaGF2ZSB0byBwYXNzIGJvdGguXG4gICAqIEBsaW5rIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BV1NDbG91ZEZvcm1hdGlvbi9sYXRlc3QvVXNlckd1aWRlL3VzaW5nLWlhbS10ZW1wbGF0ZS5odG1sI3VzaW5nLWlhbS1jYXBhYmlsaXRpZXNcbiAgICovXG4gIE5BTUVEX0lBTSA9ICdDQVBBQklMSVRZX05BTUVEX0lBTScsXG5cbiAgLyoqXG4gICAqIENhcGFiaWxpdHkgdG8gcnVuIENsb3VkRm9ybWF0aW9uIG1hY3Jvc1xuICAgKlxuICAgKiBQYXNzIHRoaXMgY2FwYWJpbGl0eSBpZiB5b3VyIHRlbXBsYXRlIGluY2x1ZGVzIG1hY3JvcywgZm9yIGV4YW1wbGUgQVdTOjpJbmNsdWRlIG9yIEFXUzo6U2VydmVybGVzcy5cbiAgICpcbiAgICogQGxpbmsgaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FXU0Nsb3VkRm9ybWF0aW9uL2xhdGVzdC9BUElSZWZlcmVuY2UvQVBJX0NyZWF0ZVN0YWNrLmh0bWxcbiAgICovXG4gIEFVVE9fRVhQQU5EID0gJ0NBUEFCSUxJVFlfQVVUT19FWFBBTkQnXG59XG4iXX0=