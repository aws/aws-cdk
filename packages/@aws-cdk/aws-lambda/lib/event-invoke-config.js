"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventInvokeConfig = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const core_1 = require("@aws-cdk/core");
const destination_1 = require("./destination");
const lambda_generated_1 = require("./lambda.generated");
/**
 * Configure options for asynchronous invocation on a version or an alias
 *
 * By default, Lambda retries an asynchronous invocation twice if the function
 * returns an error. It retains events in a queue for up to six hours. When an
 * event fails all processing attempts or stays in the asynchronous invocation
 * queue for too long, Lambda discards it.
 */
class EventInvokeConfig extends core_1.Resource {
    constructor(scope, id, props) {
        super(scope, id);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_EventInvokeConfigProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, EventInvokeConfig);
            }
            throw error;
        }
        if (props.maxEventAge && (props.maxEventAge.toSeconds() < 60 || props.maxEventAge.toSeconds() > 21600)) {
            throw new Error('`maximumEventAge` must represent a `Duration` that is between 60 and 21600 seconds.');
        }
        if (props.retryAttempts && (props.retryAttempts < 0 || props.retryAttempts > 2)) {
            throw new Error('`retryAttempts` must be between 0 and 2.');
        }
        new lambda_generated_1.CfnEventInvokeConfig(this, 'Resource', {
            destinationConfig: props.onFailure || props.onSuccess
                ? {
                    ...props.onFailure ? { onFailure: props.onFailure.bind(this, props.function, { type: destination_1.DestinationType.FAILURE }) } : {},
                    ...props.onSuccess ? { onSuccess: props.onSuccess.bind(this, props.function, { type: destination_1.DestinationType.SUCCESS }) } : {},
                }
                : undefined,
            functionName: props.function.functionName,
            maximumEventAgeInSeconds: props.maxEventAge && props.maxEventAge.toSeconds(),
            maximumRetryAttempts: props.retryAttempts ?? undefined,
            qualifier: props.qualifier || '$LATEST',
        });
    }
}
exports.EventInvokeConfig = EventInvokeConfig;
_a = JSII_RTTI_SYMBOL_1;
EventInvokeConfig[_a] = { fqn: "@aws-cdk/aws-lambda.EventInvokeConfig", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnQtaW52b2tlLWNvbmZpZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImV2ZW50LWludm9rZS1jb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQW1EO0FBRW5ELCtDQUE4RDtBQUU5RCx5REFBMEQ7QUEyRDFEOzs7Ozs7O0dBT0c7QUFDSCxNQUFhLGlCQUFrQixTQUFRLGVBQVE7SUFDN0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUE2QjtRQUNyRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDOzs7Ozs7K0NBRlIsaUJBQWlCOzs7O1FBSTFCLElBQUksS0FBSyxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUU7WUFDdEcsTUFBTSxJQUFJLEtBQUssQ0FBQyxxRkFBcUYsQ0FBQyxDQUFDO1NBQ3hHO1FBRUQsSUFBSSxLQUFLLENBQUMsYUFBYSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLElBQUksS0FBSyxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUMvRSxNQUFNLElBQUksS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7U0FDN0Q7UUFFRCxJQUFJLHVDQUFvQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDekMsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUMsU0FBUztnQkFDbkQsQ0FBQyxDQUFDO29CQUNBLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsNkJBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3RILEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLEVBQUUsNkJBQWUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUU7aUJBQ3ZIO2dCQUNELENBQUMsQ0FBQyxTQUFTO1lBQ2IsWUFBWSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWTtZQUN6Qyx3QkFBd0IsRUFBRSxLQUFLLENBQUMsV0FBVyxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFO1lBQzVFLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxhQUFhLElBQUksU0FBUztZQUN0RCxTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVMsSUFBSSxTQUFTO1NBQ3hDLENBQUMsQ0FBQztLQUNKOztBQXhCSCw4Q0F5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEdXJhdGlvbiwgUmVzb3VyY2UgfSBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgRGVzdGluYXRpb25UeXBlLCBJRGVzdGluYXRpb24gfSBmcm9tICcuL2Rlc3RpbmF0aW9uJztcbmltcG9ydCB7IElGdW5jdGlvbiB9IGZyb20gJy4vZnVuY3Rpb24tYmFzZSc7XG5pbXBvcnQgeyBDZm5FdmVudEludm9rZUNvbmZpZyB9IGZyb20gJy4vbGFtYmRhLmdlbmVyYXRlZCc7XG5cbi8qKlxuICogT3B0aW9ucyB0byBhZGQgYW4gRXZlbnRJbnZva2VDb25maWcgdG8gYSBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFdmVudEludm9rZUNvbmZpZ09wdGlvbnMge1xuICAvKipcbiAgICogVGhlIGRlc3RpbmF0aW9uIGZvciBmYWlsZWQgaW52b2NhdGlvbnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gZGVzdGluYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IG9uRmFpbHVyZT86IElEZXN0aW5hdGlvbjtcblxuICAvKipcbiAgICogVGhlIGRlc3RpbmF0aW9uIGZvciBzdWNjZXNzZnVsIGludm9jYXRpb25zLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vIGRlc3RpbmF0aW9uXG4gICAqL1xuICByZWFkb25seSBvblN1Y2Nlc3M/OiBJRGVzdGluYXRpb247XG5cbiAgLyoqXG4gICAqIFRoZSBtYXhpbXVtIGFnZSBvZiBhIHJlcXVlc3QgdGhhdCBMYW1iZGEgc2VuZHMgdG8gYSBmdW5jdGlvbiBmb3JcbiAgICogcHJvY2Vzc2luZy5cbiAgICpcbiAgICogTWluaW11bTogNjAgc2Vjb25kc1xuICAgKiBNYXhpbXVtOiA2IGhvdXJzXG4gICAqXG4gICAqIEBkZWZhdWx0IER1cmF0aW9uLmhvdXJzKDYpXG4gICAqL1xuICByZWFkb25seSBtYXhFdmVudEFnZT86IER1cmF0aW9uO1xuXG4gIC8qKlxuICAgKiBUaGUgbWF4aW11bSBudW1iZXIgb2YgdGltZXMgdG8gcmV0cnkgd2hlbiB0aGUgZnVuY3Rpb24gcmV0dXJucyBhbiBlcnJvci5cbiAgICpcbiAgICogTWluaW11bTogMFxuICAgKiBNYXhpbXVtOiAyXG4gICAqXG4gICAqIEBkZWZhdWx0IDJcbiAgICovXG4gIHJlYWRvbmx5IHJldHJ5QXR0ZW1wdHM/OiBudW1iZXI7XG59XG5cbi8qKlxuICogUHJvcGVydGllcyBmb3IgYW4gRXZlbnRJbnZva2VDb25maWdcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFdmVudEludm9rZUNvbmZpZ1Byb3BzIGV4dGVuZHMgRXZlbnRJbnZva2VDb25maWdPcHRpb25zIHtcbiAgLyoqXG4gICAqIFRoZSBMYW1iZGEgZnVuY3Rpb25cbiAgICovXG4gIHJlYWRvbmx5IGZ1bmN0aW9uOiBJRnVuY3Rpb247XG5cbiAgLyoqXG4gICAqIFRoZSBxdWFsaWZpZXJcbiAgICpcbiAgICogQGRlZmF1bHQgLSBsYXRlc3QgdmVyc2lvblxuICAgKi9cbiAgcmVhZG9ubHkgcXVhbGlmaWVyPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIENvbmZpZ3VyZSBvcHRpb25zIGZvciBhc3luY2hyb25vdXMgaW52b2NhdGlvbiBvbiBhIHZlcnNpb24gb3IgYW4gYWxpYXNcbiAqXG4gKiBCeSBkZWZhdWx0LCBMYW1iZGEgcmV0cmllcyBhbiBhc3luY2hyb25vdXMgaW52b2NhdGlvbiB0d2ljZSBpZiB0aGUgZnVuY3Rpb25cbiAqIHJldHVybnMgYW4gZXJyb3IuIEl0IHJldGFpbnMgZXZlbnRzIGluIGEgcXVldWUgZm9yIHVwIHRvIHNpeCBob3Vycy4gV2hlbiBhblxuICogZXZlbnQgZmFpbHMgYWxsIHByb2Nlc3NpbmcgYXR0ZW1wdHMgb3Igc3RheXMgaW4gdGhlIGFzeW5jaHJvbm91cyBpbnZvY2F0aW9uXG4gKiBxdWV1ZSBmb3IgdG9vIGxvbmcsIExhbWJkYSBkaXNjYXJkcyBpdC5cbiAqL1xuZXhwb3J0IGNsYXNzIEV2ZW50SW52b2tlQ29uZmlnIGV4dGVuZHMgUmVzb3VyY2Uge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogRXZlbnRJbnZva2VDb25maWdQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICBpZiAocHJvcHMubWF4RXZlbnRBZ2UgJiYgKHByb3BzLm1heEV2ZW50QWdlLnRvU2Vjb25kcygpIDwgNjAgfHwgcHJvcHMubWF4RXZlbnRBZ2UudG9TZWNvbmRzKCkgPiAyMTYwMCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignYG1heGltdW1FdmVudEFnZWAgbXVzdCByZXByZXNlbnQgYSBgRHVyYXRpb25gIHRoYXQgaXMgYmV0d2VlbiA2MCBhbmQgMjE2MDAgc2Vjb25kcy4nKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcHMucmV0cnlBdHRlbXB0cyAmJiAocHJvcHMucmV0cnlBdHRlbXB0cyA8IDAgfHwgcHJvcHMucmV0cnlBdHRlbXB0cyA+IDIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ByZXRyeUF0dGVtcHRzYCBtdXN0IGJlIGJldHdlZW4gMCBhbmQgMi4nKTtcbiAgICB9XG5cbiAgICBuZXcgQ2ZuRXZlbnRJbnZva2VDb25maWcodGhpcywgJ1Jlc291cmNlJywge1xuICAgICAgZGVzdGluYXRpb25Db25maWc6IHByb3BzLm9uRmFpbHVyZSB8fCBwcm9wcy5vblN1Y2Nlc3NcbiAgICAgICAgPyB7XG4gICAgICAgICAgLi4ucHJvcHMub25GYWlsdXJlID8geyBvbkZhaWx1cmU6IHByb3BzLm9uRmFpbHVyZS5iaW5kKHRoaXMsIHByb3BzLmZ1bmN0aW9uLCB7IHR5cGU6IERlc3RpbmF0aW9uVHlwZS5GQUlMVVJFIH0pIH0gOiB7fSxcbiAgICAgICAgICAuLi5wcm9wcy5vblN1Y2Nlc3MgPyB7IG9uU3VjY2VzczogcHJvcHMub25TdWNjZXNzLmJpbmQodGhpcywgcHJvcHMuZnVuY3Rpb24sIHsgdHlwZTogRGVzdGluYXRpb25UeXBlLlNVQ0NFU1MgfSkgfSA6IHt9LFxuICAgICAgICB9XG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgICAgZnVuY3Rpb25OYW1lOiBwcm9wcy5mdW5jdGlvbi5mdW5jdGlvbk5hbWUsXG4gICAgICBtYXhpbXVtRXZlbnRBZ2VJblNlY29uZHM6IHByb3BzLm1heEV2ZW50QWdlICYmIHByb3BzLm1heEV2ZW50QWdlLnRvU2Vjb25kcygpLFxuICAgICAgbWF4aW11bVJldHJ5QXR0ZW1wdHM6IHByb3BzLnJldHJ5QXR0ZW1wdHMgPz8gdW5kZWZpbmVkLFxuICAgICAgcXVhbGlmaWVyOiBwcm9wcy5xdWFsaWZpZXIgfHwgJyRMQVRFU1QnLFxuICAgIH0pO1xuICB9XG59XG4iXX0=