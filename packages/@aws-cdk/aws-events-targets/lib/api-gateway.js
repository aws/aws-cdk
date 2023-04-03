"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGateway = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const util_1 = require("./util");
/**
 * Use an API Gateway REST APIs as a target for Amazon EventBridge rules.
 */
class ApiGateway {
    constructor(restApi, props) {
        this.restApi = restApi;
        this.props = props;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_events_targets_ApiGatewayProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, ApiGateway);
            }
            throw error;
        }
    }
    /**
     * Returns a RuleTarget that can be used to trigger this API Gateway REST APIs
     * as a result from an EventBridge event.
     *
     * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sqs-permissions
     */
    bind(rule, _id) {
        if (this.props?.deadLetterQueue) {
            util_1.addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
        }
        const wildcardCountsInPath = this.props?.path?.match(/\*/g)?.length ?? 0;
        if (wildcardCountsInPath !== (this.props?.pathParameterValues || []).length) {
            throw new Error('The number of wildcards in the path does not match the number of path pathParameterValues.');
        }
        const restApiArn = this.restApi.arnForExecuteApi(this.props?.method, this.props?.path || '/', this.props?.stage || this.restApi.deploymentStage.stageName);
        const role = this.props?.eventRole || util_1.singletonEventRole(this.restApi);
        role.addToPrincipalPolicy(new iam.PolicyStatement({
            resources: [restApiArn],
            actions: [
                'execute-api:Invoke',
                'execute-api:ManageConnections',
            ],
        }));
        return {
            ...(this.props ? util_1.bindBaseTargetConfig(this.props) : {}),
            arn: restApiArn,
            role,
            deadLetterConfig: this.props?.deadLetterQueue && { arn: this.props.deadLetterQueue?.queueArn },
            input: this.props?.postBody,
            targetResource: this.restApi,
            httpParameters: {
                headerParameters: this.props?.headerParameters,
                queryStringParameters: this.props?.queryStringParameters,
                pathParameterValues: this.props?.pathParameterValues,
            },
        };
    }
}
exports.ApiGateway = ApiGateway;
_a = JSII_RTTI_SYMBOL_1;
ApiGateway[_a] = { fqn: "@aws-cdk/aws-events-targets.ApiGateway", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWdhdGV3YXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcGktZ2F0ZXdheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSx3Q0FBd0M7QUFDeEMsaUNBQXVIO0FBb0V2SDs7R0FFRztBQUNILE1BQWEsVUFBVTtJQUVyQixZQUE0QixPQUFvQixFQUFtQixLQUF1QjtRQUE5RCxZQUFPLEdBQVAsT0FBTyxDQUFhO1FBQW1CLFVBQUssR0FBTCxLQUFLLENBQWtCOzs7Ozs7K0NBRi9FLFVBQVU7Ozs7S0FHcEI7SUFFRDs7Ozs7T0FLRztJQUNJLElBQUksQ0FBQyxJQUFrQixFQUFFLEdBQVk7UUFDMUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRTtZQUMvQix5Q0FBa0MsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQztTQUN0RTtRQUVELE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFFLEtBQUssQ0FBRSxFQUFFLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFDM0UsSUFBSSxvQkFBb0IsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFO1lBQzNFLE1BQU0sSUFBSSxLQUFLLENBQUMsNEZBQTRGLENBQUMsQ0FBQztTQUMvRztRQUVELE1BQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQzlDLElBQUksQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUNsQixJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksSUFBSSxHQUFHLEVBQ3ZCLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FDNUQsQ0FBQztRQUVGLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxJQUFJLHlCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2RSxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO1lBQ2hELFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUN2QixPQUFPLEVBQUU7Z0JBQ1Asb0JBQW9CO2dCQUNwQiwrQkFBK0I7YUFDaEM7U0FDRixDQUFDLENBQUMsQ0FBQztRQUVKLE9BQU87WUFDTCxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsMkJBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDdkQsR0FBRyxFQUFFLFVBQVU7WUFDZixJQUFJO1lBQ0osZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxlQUFlLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsUUFBUSxFQUFFO1lBQzlGLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLFFBQVE7WUFDM0IsY0FBYyxFQUFFLElBQUksQ0FBQyxPQUFPO1lBQzVCLGNBQWMsRUFBRTtnQkFDZCxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLGdCQUFnQjtnQkFDOUMscUJBQXFCLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxxQkFBcUI7Z0JBQ3hELG1CQUFtQixFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsbUJBQW1CO2FBQ3JEO1NBQ0YsQ0FBQztLQUNIOztBQWpESCxnQ0FtREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBhcGkgZnJvbSAnQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXknO1xuaW1wb3J0ICogYXMgZXZlbnRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1ldmVudHMnO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xuaW1wb3J0IHsgYWRkVG9EZWFkTGV0dGVyUXVldWVSZXNvdXJjZVBvbGljeSwgYmluZEJhc2VUYXJnZXRDb25maWcsIHNpbmdsZXRvbkV2ZW50Um9sZSwgVGFyZ2V0QmFzZVByb3BzIH0gZnJvbSAnLi91dGlsJztcblxuLyoqXG4gKiBDdXN0b21pemUgdGhlIEFQSSBHYXRld2F5IEV2ZW50IFRhcmdldFxuICovXG5leHBvcnQgaW50ZXJmYWNlIEFwaUdhdGV3YXlQcm9wcyBleHRlbmRzIFRhcmdldEJhc2VQcm9wcyB7XG5cbiAgLyoqXG4gICAqIFRoZSBtZXRob2QgZm9yIGFwaSByZXNvdXJjZSBpbnZva2VkIGJ5IHRoZSBydWxlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAnKicgdGhhdCB0cmVhdGVkIGFzIEFOWVxuICAgKi9cbiAgcmVhZG9ubHkgbWV0aG9kPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBUaGUgYXBpIHJlc291cmNlIGludm9rZWQgYnkgdGhlIHJ1bGUuXG4gICAqIFdlIGNhbiB1c2Ugd2lsZGNhcmRzKCcqJykgdG8gc3BlY2lmeSB0aGUgcGF0aC4gSW4gdGhhdCBjYXNlLFxuICAgKiBhbiBlcXVhbCBudW1iZXIgb2YgcmVhbCB2YWx1ZXMgbXVzdCBiZSBzcGVjaWZpZWQgZm9yIHBhdGhQYXJhbWV0ZXJWYWx1ZXMuXG4gICAqXG4gICAqIEBkZWZhdWx0ICcvJ1xuICAgKi9cbiAgcmVhZG9ubHkgcGF0aD86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGRlcGxveSBzdGFnZSBvZiBhcGkgZ2F0ZXdheSBpbnZva2VkIGJ5IHRoZSBydWxlLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0aGUgdmFsdWUgb2YgZGVwbG95bWVudFN0YWdlLnN0YWdlTmFtZSBvZiB0YXJnZXQgYXBpIGdhdGV3YXkuXG4gICAqL1xuICByZWFkb25seSBzdGFnZT86IHN0cmluZztcblxuICAvKipcbiAgICogVGhlIGhlYWRlcnMgdG8gYmUgc2V0IHdoZW4gcmVxdWVzdGluZyBBUElcbiAgICpcbiAgICogQGRlZmF1bHQgbm8gaGVhZGVyIHBhcmFtZXRlcnNcbiAgICovXG4gIHJlYWRvbmx5IGhlYWRlclBhcmFtZXRlcnM/OiB7IFtrZXk6IHN0cmluZ106IChzdHJpbmcpIH07XG5cbiAgLyoqXG4gICAqIFRoZSBwYXRoIHBhcmFtZXRlciB2YWx1ZXMgdG8gYmUgdXNlZCB0b1xuICAgKiBwb3B1bGF0ZSB0byB3aWxkY2FyZHMoXCIqXCIpIG9mIHJlcXVlc3RpbmcgYXBpIHBhdGhcbiAgICpcbiAgICogQGRlZmF1bHQgbm8gcGF0aCBwYXJhbWV0ZXJzXG4gICAqL1xuICByZWFkb25seSBwYXRoUGFyYW1ldGVyVmFsdWVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBxdWVyeSBwYXJhbWV0ZXJzIHRvIGJlIHNldCB3aGVuIHJlcXVlc3RpbmcgQVBJLlxuICAgKlxuICAgKiBAZGVmYXVsdCBubyBxdWVyeXN0cmluZyBwYXJhbWV0ZXJzXG4gICAqL1xuICByZWFkb25seSBxdWVyeVN0cmluZ1BhcmFtZXRlcnM/OiB7IFtrZXk6IHN0cmluZ106IChzdHJpbmcpIH07XG5cbiAgLyoqXG4gICAqIFRoaXMgd2lsbCBiZSB0aGUgcG9zdCByZXF1ZXN0IGJvZHkgc2VuZCB0byB0aGUgQVBJLlxuICAgKlxuICAgKiBAZGVmYXVsdCB0aGUgZW50aXJlIEV2ZW50QnJpZGdlIGV2ZW50XG4gICAqL1xuICByZWFkb25seSBwb3N0Qm9keT86IGV2ZW50cy5SdWxlVGFyZ2V0SW5wdXQ7XG5cbiAgLyoqXG4gICAqIFRoZSByb2xlIHRvIGFzc3VtZSBiZWZvcmUgaW52b2tpbmcgdGhlIHRhcmdldFxuICAgKiAoaS5lLiwgdGhlIHBpcGVsaW5lKSB3aGVuIHRoZSBnaXZlbiBydWxlIGlzIHRyaWdnZXJlZC5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBhIG5ldyByb2xlIHdpbGwgYmUgY3JlYXRlZFxuICAgKi9cbiAgcmVhZG9ubHkgZXZlbnRSb2xlPzogaWFtLklSb2xlO1xufVxuXG4vKipcbiAqIFVzZSBhbiBBUEkgR2F0ZXdheSBSRVNUIEFQSXMgYXMgYSB0YXJnZXQgZm9yIEFtYXpvbiBFdmVudEJyaWRnZSBydWxlcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEFwaUdhdGV3YXkgaW1wbGVtZW50cyBldmVudHMuSVJ1bGVUYXJnZXQge1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSByZXN0QXBpOiBhcGkuUmVzdEFwaSwgcHJpdmF0ZSByZWFkb25seSBwcm9wcz86IEFwaUdhdGV3YXlQcm9wcykge1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgYSBSdWxlVGFyZ2V0IHRoYXQgY2FuIGJlIHVzZWQgdG8gdHJpZ2dlciB0aGlzIEFQSSBHYXRld2F5IFJFU1QgQVBJc1xuICAgKiBhcyBhIHJlc3VsdCBmcm9tIGFuIEV2ZW50QnJpZGdlIGV2ZW50LlxuICAgKlxuICAgKiBAc2VlIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9ldmVudGJyaWRnZS9sYXRlc3QvdXNlcmd1aWRlL3Jlc291cmNlLWJhc2VkLXBvbGljaWVzLWV2ZW50YnJpZGdlLmh0bWwjc3FzLXBlcm1pc3Npb25zXG4gICAqL1xuICBwdWJsaWMgYmluZChydWxlOiBldmVudHMuSVJ1bGUsIF9pZD86IHN0cmluZyk6IGV2ZW50cy5SdWxlVGFyZ2V0Q29uZmlnIHtcbiAgICBpZiAodGhpcy5wcm9wcz8uZGVhZExldHRlclF1ZXVlKSB7XG4gICAgICBhZGRUb0RlYWRMZXR0ZXJRdWV1ZVJlc291cmNlUG9saWN5KHJ1bGUsIHRoaXMucHJvcHMuZGVhZExldHRlclF1ZXVlKTtcbiAgICB9XG5cbiAgICBjb25zdCB3aWxkY2FyZENvdW50c0luUGF0aCA9IHRoaXMucHJvcHM/LnBhdGg/Lm1hdGNoKCAvXFwqL2cgKT8ubGVuZ3RoID8/IDA7XG4gICAgaWYgKHdpbGRjYXJkQ291bnRzSW5QYXRoICE9PSAodGhpcy5wcm9wcz8ucGF0aFBhcmFtZXRlclZhbHVlcyB8fCBbXSkubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBudW1iZXIgb2Ygd2lsZGNhcmRzIGluIHRoZSBwYXRoIGRvZXMgbm90IG1hdGNoIHRoZSBudW1iZXIgb2YgcGF0aCBwYXRoUGFyYW1ldGVyVmFsdWVzLicpO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3RBcGlBcm4gPSB0aGlzLnJlc3RBcGkuYXJuRm9yRXhlY3V0ZUFwaShcbiAgICAgIHRoaXMucHJvcHM/Lm1ldGhvZCxcbiAgICAgIHRoaXMucHJvcHM/LnBhdGggfHwgJy8nLFxuICAgICAgdGhpcy5wcm9wcz8uc3RhZ2UgfHwgdGhpcy5yZXN0QXBpLmRlcGxveW1lbnRTdGFnZS5zdGFnZU5hbWUsXG4gICAgKTtcblxuICAgIGNvbnN0IHJvbGUgPSB0aGlzLnByb3BzPy5ldmVudFJvbGUgfHwgc2luZ2xldG9uRXZlbnRSb2xlKHRoaXMucmVzdEFwaSk7XG4gICAgcm9sZS5hZGRUb1ByaW5jaXBhbFBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICByZXNvdXJjZXM6IFtyZXN0QXBpQXJuXSxcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ2V4ZWN1dGUtYXBpOkludm9rZScsXG4gICAgICAgICdleGVjdXRlLWFwaTpNYW5hZ2VDb25uZWN0aW9ucycsXG4gICAgICBdLFxuICAgIH0pKTtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi4odGhpcy5wcm9wcyA/IGJpbmRCYXNlVGFyZ2V0Q29uZmlnKHRoaXMucHJvcHMpIDoge30pLFxuICAgICAgYXJuOiByZXN0QXBpQXJuLFxuICAgICAgcm9sZSxcbiAgICAgIGRlYWRMZXR0ZXJDb25maWc6IHRoaXMucHJvcHM/LmRlYWRMZXR0ZXJRdWV1ZSAmJiB7IGFybjogdGhpcy5wcm9wcy5kZWFkTGV0dGVyUXVldWU/LnF1ZXVlQXJuIH0sXG4gICAgICBpbnB1dDogdGhpcy5wcm9wcz8ucG9zdEJvZHksXG4gICAgICB0YXJnZXRSZXNvdXJjZTogdGhpcy5yZXN0QXBpLFxuICAgICAgaHR0cFBhcmFtZXRlcnM6IHtcbiAgICAgICAgaGVhZGVyUGFyYW1ldGVyczogdGhpcy5wcm9wcz8uaGVhZGVyUGFyYW1ldGVycyxcbiAgICAgICAgcXVlcnlTdHJpbmdQYXJhbWV0ZXJzOiB0aGlzLnByb3BzPy5xdWVyeVN0cmluZ1BhcmFtZXRlcnMsXG4gICAgICAgIHBhdGhQYXJhbWV0ZXJWYWx1ZXM6IHRoaXMucHJvcHM/LnBhdGhQYXJhbWV0ZXJWYWx1ZXMsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxufVxuXG4iXX0=