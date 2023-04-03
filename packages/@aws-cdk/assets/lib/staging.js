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
            follow: (0, compat_1.toSymlinkFollow)(props.follow),
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
_a = JSII_RTTI_SYMBOL_1;
Staging[_a] = { fqn: "@aws-cdk/assets.Staging", version: "0.0.0" };
exports.Staging = Staging;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhZ2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0YWdpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQTZDO0FBRTdDLHFDQUEyQztBQWMzQzs7O0dBR0c7QUFDSCxNQUFhLE9BQVEsU0FBUSxtQkFBWTtJQUN2QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQW1CO1FBQzNELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFO1lBQ2YsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzVCLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTztZQUN0QixVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDNUIsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1lBQzFCLE1BQU0sRUFBRSxJQUFBLHdCQUFlLEVBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztTQUN0QyxDQUFDLENBQUM7Ozs7Ozs7K0NBUk0sT0FBTzs7OztLQVNqQjs7OztBQVRVLDBCQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXNzZXRTdGFnaW5nIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IHRvU3ltbGlua0ZvbGxvdyB9IGZyb20gJy4vY29tcGF0JztcbmltcG9ydCB7IEZpbmdlcnByaW50T3B0aW9ucyB9IGZyb20gJy4vZnMvb3B0aW9ucyc7XG5cbi8qKlxuICogRGVwcmVjYXRlZFxuICogQGRlcHJlY2F0ZWQgdXNlIGBjb3JlLkFzc2V0U3RhZ2luZ1Byb3BzYFxuICovXG5leHBvcnQgaW50ZXJmYWNlIFN0YWdpbmdQcm9wcyBleHRlbmRzIEZpbmdlcnByaW50T3B0aW9ucyB7XG4gIC8qKlxuICAgKiBMb2NhbCBmaWxlIG9yIGRpcmVjdG9yeSB0byBzdGFnZS5cbiAgICovXG4gIHJlYWRvbmx5IHNvdXJjZVBhdGg6IHN0cmluZztcbn1cblxuLyoqXG4gKiBEZXByZWNhdGVkXG4gKiBAZGVwcmVjYXRlZCB1c2UgYGNvcmUuQXNzZXRTdGFnaW5nYFxuICovXG5leHBvcnQgY2xhc3MgU3RhZ2luZyBleHRlbmRzIEFzc2V0U3RhZ2luZyB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBTdGFnaW5nUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHtcbiAgICAgIHNvdXJjZVBhdGg6IHByb3BzLnNvdXJjZVBhdGgsXG4gICAgICBleGNsdWRlOiBwcm9wcy5leGNsdWRlLFxuICAgICAgaWdub3JlTW9kZTogcHJvcHMuaWdub3JlTW9kZSxcbiAgICAgIGV4dHJhSGFzaDogcHJvcHMuZXh0cmFIYXNoLFxuICAgICAgZm9sbG93OiB0b1N5bWxpbmtGb2xsb3cocHJvcHMuZm9sbG93KSxcbiAgICB9KTtcbiAgfVxufVxuIl19