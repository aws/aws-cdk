"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogRetention = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const logs = require("@aws-cdk/aws-logs");
/**
 * Creates a custom resource to control the retention policy of a CloudWatch Logs
 * log group. The log group is created if it doesn't already exist. The policy
 * is removed when `retentionDays` is `undefined` or equal to `Infinity`.
 *
 * @deprecated use `LogRetention` from '@aws-cdk/aws-logs' instead
 */
class LogRetention extends logs.LogRetention {
    constructor(scope, id, props) {
        super(scope, id, { ...props });
        try {
            jsiiDeprecationWarnings.print("@aws-cdk/aws-lambda.LogRetention", "use `LogRetention` from '");
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_LogRetentionProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, LogRetention);
            }
            throw error;
        }
    }
}
exports.LogRetention = LogRetention;
_a = JSII_RTTI_SYMBOL_1;
LogRetention[_a] = { fqn: "@aws-cdk/aws-lambda.LogRetention", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXJldGVudGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvZy1yZXRlbnRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMENBQTBDO0FBaUIxQzs7Ozs7O0dBTUc7QUFDSCxNQUFhLFlBQWEsU0FBUSxJQUFJLENBQUMsWUFBWTtJQUNqRCxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXdCO1FBQ2hFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7OytDQUZ0QixZQUFZOzs7O0tBR3RCOztBQUhILG9DQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbG9ncyBmcm9tICdAYXdzLWNkay9hd3MtbG9ncyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyoqXG4gKiBSZXRyeSBvcHRpb25zIGZvciBhbGwgQVdTIEFQSSBjYWxscy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMb2dSZXRlbnRpb25SZXRyeU9wdGlvbnMgZXh0ZW5kcyBsb2dzLkxvZ1JldGVudGlvblJldHJ5T3B0aW9ucyB7XG59XG5cbi8qKlxuICogQ29uc3RydWN0aW9uIHByb3BlcnRpZXMgZm9yIGEgTG9nUmV0ZW50aW9uLlxuICpcbiAqIEBkZXByZWNhdGVkIHVzZSBgTG9nUmV0ZW50aW9uUHJvcHNgIGZyb20gJ0Bhd3MtY2RrL2F3cy1sb2dzJyBpbnN0ZWFkXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgTG9nUmV0ZW50aW9uUHJvcHMgZXh0ZW5kcyBsb2dzLkxvZ1JldGVudGlvblByb3BzIHtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgY3VzdG9tIHJlc291cmNlIHRvIGNvbnRyb2wgdGhlIHJldGVudGlvbiBwb2xpY3kgb2YgYSBDbG91ZFdhdGNoIExvZ3NcbiAqIGxvZyBncm91cC4gVGhlIGxvZyBncm91cCBpcyBjcmVhdGVkIGlmIGl0IGRvZXNuJ3QgYWxyZWFkeSBleGlzdC4gVGhlIHBvbGljeVxuICogaXMgcmVtb3ZlZCB3aGVuIGByZXRlbnRpb25EYXlzYCBpcyBgdW5kZWZpbmVkYCBvciBlcXVhbCB0byBgSW5maW5pdHlgLlxuICpcbiAqIEBkZXByZWNhdGVkIHVzZSBgTG9nUmV0ZW50aW9uYCBmcm9tICdAYXdzLWNkay9hd3MtbG9ncycgaW5zdGVhZFxuICovXG5leHBvcnQgY2xhc3MgTG9nUmV0ZW50aW9uIGV4dGVuZHMgbG9ncy5Mb2dSZXRlbnRpb24ge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTG9nUmV0ZW50aW9uUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHsgLi4ucHJvcHMgfSk7XG4gIH1cbn1cbiJdfQ==