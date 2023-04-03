"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staging = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const compat_1 = require("./compat");
/**
 * Deprecated
 * @deprecated use `core.AssetStaging`
 */
class Staging extends core_1.AssetStaging {
    constructor(scope, id, props) {
        super(scope, id, {
            sourcePath: props.sourcePath,
            exclude: props.exclude,
            ignoreMode: props.ignoreMode,
            extraHash: props.extraHash,
            follow: compat_1.toSymlinkFollow(props.follow),
        });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/assets.Staging", "use `core.AssetStaging`");
            jsiiDeprecationWarnings._aws_cdk_assets_StagingProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, Staging);
            }
            throw error;
        }
    }
}
exports.Staging = Staging;
_a = JSII_RTTI_SYMBOL_1;
Staging[_a] = { fqn: "@aws-cdk/assets.Staging", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YWdpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQTZDO0FBRTdDLHFDQUEyQztBQWMzQzs7O0dBR0c7QUFDSCxNQUFhLE9BQVEsU0FBUSxtQkFBWTtJQUN2QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW1CO1FBQzNELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzVCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDNUIsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQzFCLE1BQU0sRUFBRSx3QkFBZSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7U0FDdEMsQ0FBQyxDQUFDOzs7Ozs7OytDQVJNLE9BQU87Ozs7S0FTakI7O0FBVEgsMEJBVUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBc3NldFN0YWdpbmcgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgdG9TeW1saW5rRm9sbG93IH0gZnJvbSAnLi9jb21wYXQnO1xuaW1wb3J0IHsgRmluZ2VycHJpbnRPcHRpb25zIH0gZnJvbSAnLi9mcy9vcHRpb25zJztcblxuLyoqXG4gKiBEZXByZWNhdGVkXG4gKiBAZGVwcmVjYXRlZCB1c2UgYGNvcmUuQXNzZXRTdGFnaW5nUHJvcHNgXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU3RhZ2luZ1Byb3BzIGV4dGVuZHMgRmluZ2VycHJpbnRPcHRpb25zIHtcbiAgLyoqXG4gICAqIExvY2FsIGZpbGUgb3IgZGlyZWN0b3J5IHRvIHN0YWdlLlxuICAgKi9cbiAgcmVhZG9ubHkgc291cmNlUGF0aDogc3RyaW5nO1xufVxuXG4vKipcbiAqIERlcHJlY2F0ZWRcbiAqIEBkZXByZWNhdGVkIHVzZSBgY29yZS5Bc3NldFN0YWdpbmdgXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGFnaW5nIGV4dGVuZHMgQXNzZXRTdGFnaW5nIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IFN0YWdpbmdQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwge1xuICAgICAgc291cmNlUGF0aDogcHJvcHMuc291cmNlUGF0aCxcbiAgICAgIGV4Y2x1ZGU6IHByb3BzLmV4Y2x1ZGUsXG4gICAgICBpZ25vcmVNb2RlOiBwcm9wcy5pZ25vcmVNb2RlLFxuICAgICAgZXh0cmFIYXNoOiBwcm9wcy5leHRyYUhhc2gsXG4gICAgICBmb2xsb3c6IHRvU3ltbGlua0ZvbGxvdyhwcm9wcy5mb2xsb3cpLFxuICAgIH0pO1xuICB9XG59XG4iXX0=