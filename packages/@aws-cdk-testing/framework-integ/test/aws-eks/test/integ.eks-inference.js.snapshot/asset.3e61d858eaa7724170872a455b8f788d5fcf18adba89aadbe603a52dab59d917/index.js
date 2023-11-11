"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const consts_1 = require("./consts");
/**
 * Parses the value of "Value" and reflects it back as attribute.
 */
async function handler(event) {
    // dispatch based on resource type
    if (event.ResourceType === consts_1.CfnUtilsResourceType.CFN_JSON) {
        return cfnJsonHandler(event);
    }
    if (event.ResourceType === consts_1.CfnUtilsResourceType.CFN_JSON_STRINGIFY) {
        return cfnJsonStringifyHandler(event);
    }
    throw new Error(`unexpected resource type "${event.ResourceType}"`);
}
exports.handler = handler;
function cfnJsonHandler(event) {
    return {
        Data: {
            Value: JSON.parse(event.ResourceProperties.Value),
        },
    };
}
function cfnJsonStringifyHandler(event) {
    return {
        Data: {
            Value: JSON.stringify(event.ResourceProperties.Value),
        },
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxxQ0FBZ0Q7QUFFaEQ7O0dBRUc7QUFDSSxLQUFLLFVBQVUsT0FBTyxDQUFDLEtBQWtEO0lBRTlFLGtDQUFrQztJQUNsQyxJQUFJLEtBQUssQ0FBQyxZQUFZLEtBQUssNkJBQW9CLENBQUMsUUFBUSxFQUFFO1FBQ3hELE9BQU8sY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzlCO0lBQ0QsSUFBSSxLQUFLLENBQUMsWUFBWSxLQUFLLDZCQUFvQixDQUFDLGtCQUFrQixFQUFFO1FBQ2xFLE9BQU8sdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdkM7SUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixLQUFLLENBQUMsWUFBWSxHQUFHLENBQUMsQ0FBQztBQUN0RSxDQUFDO0FBWEQsMEJBV0M7QUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFrRDtJQUN4RSxPQUFPO1FBQ0wsSUFBSSxFQUFFO1lBQ0osS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQztTQUNsRDtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxLQUFrRDtJQUNqRixPQUFPO1FBQ0wsSUFBSSxFQUFFO1lBQ0osS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQztTQUN0RDtLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuVXRpbHNSZXNvdXJjZVR5cGUgfSBmcm9tICcuL2NvbnN0cyc7XG5cbi8qKlxuICogUGFyc2VzIHRoZSB2YWx1ZSBvZiBcIlZhbHVlXCIgYW5kIHJlZmxlY3RzIGl0IGJhY2sgYXMgYXR0cmlidXRlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuXG4gIC8vIGRpc3BhdGNoIGJhc2VkIG9uIHJlc291cmNlIHR5cGVcbiAgaWYgKGV2ZW50LlJlc291cmNlVHlwZSA9PT0gQ2ZuVXRpbHNSZXNvdXJjZVR5cGUuQ0ZOX0pTT04pIHtcbiAgICByZXR1cm4gY2ZuSnNvbkhhbmRsZXIoZXZlbnQpO1xuICB9XG4gIGlmIChldmVudC5SZXNvdXJjZVR5cGUgPT09IENmblV0aWxzUmVzb3VyY2VUeXBlLkNGTl9KU09OX1NUUklOR0lGWSkge1xuICAgIHJldHVybiBjZm5Kc29uU3RyaW5naWZ5SGFuZGxlcihldmVudCk7XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoYHVuZXhwZWN0ZWQgcmVzb3VyY2UgdHlwZSBcIiR7ZXZlbnQuUmVzb3VyY2VUeXBlfVwiYCk7XG59XG5cbmZ1bmN0aW9uIGNmbkpzb25IYW5kbGVyKGV2ZW50OiBBV1NMYW1iZGEuQ2xvdWRGb3JtYXRpb25DdXN0b21SZXNvdXJjZUV2ZW50KSB7XG4gIHJldHVybiB7XG4gICAgRGF0YToge1xuICAgICAgVmFsdWU6IEpTT04ucGFyc2UoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlZhbHVlKSxcbiAgICB9LFxuICB9O1xufVxuXG5mdW5jdGlvbiBjZm5Kc29uU3RyaW5naWZ5SGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuICByZXR1cm4ge1xuICAgIERhdGE6IHtcbiAgICAgIFZhbHVlOiBKU09OLnN0cmluZ2lmeShldmVudC5SZXNvdXJjZVByb3BlcnRpZXMuVmFsdWUpLFxuICAgIH0sXG4gIH07XG59XG4iXX0=