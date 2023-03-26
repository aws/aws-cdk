"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicalName = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const physical_name_generator_1 = require("./private/physical-name-generator");
const token_1 = require("./token");
/**
 * Includes special markers for automatic generation of physical names.
 */
class PhysicalName {
    constructor() { }
}
_a = JSII_RTTI_SYMBOL_1;
PhysicalName[_a] = { fqn: "@aws-cdk/core.PhysicalName", version: "0.0.0" };
/**
 * Use this to automatically generate a physical name for an AWS resource only
 * if the resource is referenced across environments (account/region).
 * Otherwise, the name will be allocated during deployment by CloudFormation.
 *
 * If you are certain that a resource will be referenced across environments,
 * you may also specify an explicit physical name for it. This option is
 * mostly designed for reusable constructs which may or may not be referenced
 * acrossed environments.
 */
PhysicalName.GENERATE_IF_NEEDED = token_1.Token.asString(new physical_name_generator_1.GeneratedWhenNeededMarker());
exports.PhysicalName = PhysicalName;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGh5c2ljYWwtbmFtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBoeXNpY2FsLW5hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrRUFBOEU7QUFDOUUsbUNBQWdDO0FBRWhDOztHQUVHO0FBQ0gsTUFBYSxZQUFZO0lBYXZCLGlCQUF5Qjs7OztBQVp6Qjs7Ozs7Ozs7O0dBU0c7QUFDb0IsK0JBQWtCLEdBQUcsYUFBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLG1EQUF5QixFQUFFLENBQUMsQ0FBQztBQVhqRixvQ0FBWSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEdlbmVyYXRlZFdoZW5OZWVkZWRNYXJrZXIgfSBmcm9tICcuL3ByaXZhdGUvcGh5c2ljYWwtbmFtZS1nZW5lcmF0b3InO1xuaW1wb3J0IHsgVG9rZW4gfSBmcm9tICcuL3Rva2VuJztcblxuLyoqXG4gKiBJbmNsdWRlcyBzcGVjaWFsIG1hcmtlcnMgZm9yIGF1dG9tYXRpYyBnZW5lcmF0aW9uIG9mIHBoeXNpY2FsIG5hbWVzLlxuICovXG5leHBvcnQgY2xhc3MgUGh5c2ljYWxOYW1lIHtcbiAgLyoqXG4gICAqIFVzZSB0aGlzIHRvIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGUgYSBwaHlzaWNhbCBuYW1lIGZvciBhbiBBV1MgcmVzb3VyY2Ugb25seVxuICAgKiBpZiB0aGUgcmVzb3VyY2UgaXMgcmVmZXJlbmNlZCBhY3Jvc3MgZW52aXJvbm1lbnRzIChhY2NvdW50L3JlZ2lvbikuXG4gICAqIE90aGVyd2lzZSwgdGhlIG5hbWUgd2lsbCBiZSBhbGxvY2F0ZWQgZHVyaW5nIGRlcGxveW1lbnQgYnkgQ2xvdWRGb3JtYXRpb24uXG4gICAqXG4gICAqIElmIHlvdSBhcmUgY2VydGFpbiB0aGF0IGEgcmVzb3VyY2Ugd2lsbCBiZSByZWZlcmVuY2VkIGFjcm9zcyBlbnZpcm9ubWVudHMsXG4gICAqIHlvdSBtYXkgYWxzbyBzcGVjaWZ5IGFuIGV4cGxpY2l0IHBoeXNpY2FsIG5hbWUgZm9yIGl0LiBUaGlzIG9wdGlvbiBpc1xuICAgKiBtb3N0bHkgZGVzaWduZWQgZm9yIHJldXNhYmxlIGNvbnN0cnVjdHMgd2hpY2ggbWF5IG9yIG1heSBub3QgYmUgcmVmZXJlbmNlZFxuICAgKiBhY3Jvc3NlZCBlbnZpcm9ubWVudHMuXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEdFTkVSQVRFX0lGX05FRURFRCA9IFRva2VuLmFzU3RyaW5nKG5ldyBHZW5lcmF0ZWRXaGVuTmVlZGVkTWFya2VyKCkpO1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoKSB7IH1cbn1cbiJdfQ==