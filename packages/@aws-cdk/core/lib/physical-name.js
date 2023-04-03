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
exports.PhysicalName = PhysicalName;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGh5c2ljYWwtbmFtZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBoeXNpY2FsLW5hbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwrRUFBOEU7QUFDOUUsbUNBQWdDO0FBRWhDOztHQUVHO0FBQ0gsTUFBYSxZQUFZO0lBYXZCLGlCQUF5Qjs7QUFiM0Isb0NBY0M7OztBQWJDOzs7Ozs7Ozs7R0FTRztBQUNvQiwrQkFBa0IsR0FBRyxhQUFLLENBQUMsUUFBUSxDQUFDLElBQUksbURBQXlCLEVBQUUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgR2VuZXJhdGVkV2hlbk5lZWRlZE1hcmtlciB9IGZyb20gJy4vcHJpdmF0ZS9waHlzaWNhbC1uYW1lLWdlbmVyYXRvcic7XG5pbXBvcnQgeyBUb2tlbiB9IGZyb20gJy4vdG9rZW4nO1xuXG4vKipcbiAqIEluY2x1ZGVzIHNwZWNpYWwgbWFya2VycyBmb3IgYXV0b21hdGljIGdlbmVyYXRpb24gb2YgcGh5c2ljYWwgbmFtZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBQaHlzaWNhbE5hbWUge1xuICAvKipcbiAgICogVXNlIHRoaXMgdG8gYXV0b21hdGljYWxseSBnZW5lcmF0ZSBhIHBoeXNpY2FsIG5hbWUgZm9yIGFuIEFXUyByZXNvdXJjZSBvbmx5XG4gICAqIGlmIHRoZSByZXNvdXJjZSBpcyByZWZlcmVuY2VkIGFjcm9zcyBlbnZpcm9ubWVudHMgKGFjY291bnQvcmVnaW9uKS5cbiAgICogT3RoZXJ3aXNlLCB0aGUgbmFtZSB3aWxsIGJlIGFsbG9jYXRlZCBkdXJpbmcgZGVwbG95bWVudCBieSBDbG91ZEZvcm1hdGlvbi5cbiAgICpcbiAgICogSWYgeW91IGFyZSBjZXJ0YWluIHRoYXQgYSByZXNvdXJjZSB3aWxsIGJlIHJlZmVyZW5jZWQgYWNyb3NzIGVudmlyb25tZW50cyxcbiAgICogeW91IG1heSBhbHNvIHNwZWNpZnkgYW4gZXhwbGljaXQgcGh5c2ljYWwgbmFtZSBmb3IgaXQuIFRoaXMgb3B0aW9uIGlzXG4gICAqIG1vc3RseSBkZXNpZ25lZCBmb3IgcmV1c2FibGUgY29uc3RydWN0cyB3aGljaCBtYXkgb3IgbWF5IG5vdCBiZSByZWZlcmVuY2VkXG4gICAqIGFjcm9zc2VkIGVudmlyb25tZW50cy5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgR0VORVJBVEVfSUZfTkVFREVEID0gVG9rZW4uYXNTdHJpbmcobmV3IEdlbmVyYXRlZFdoZW5OZWVkZWRNYXJrZXIoKSk7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHsgfVxufVxuIl19