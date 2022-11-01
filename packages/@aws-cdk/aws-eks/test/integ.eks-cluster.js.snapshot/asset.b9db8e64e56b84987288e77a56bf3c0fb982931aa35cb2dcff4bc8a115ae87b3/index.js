"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
/**
 * Parses the value of "Value" and reflects it back as attribute.
 */
async function handler(event) {
    // dispatch based on resource type
    if (event.ResourceType === "Custom::AWSCDKCfnJson" /* CFN_JSON */) {
        return cfnJsonHandler(event);
    }
    if (event.ResourceType === "Custom::AWSCDKCfnJsonStringify" /* CFN_JSON_STRINGIFY */) {
        return cfnJsonStringifyHandler(event);
    }
    throw new Error(`unexpected resource type "${event.ResourceType}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFQTs7R0FFRztBQUNJLEtBQUssVUFBVSxPQUFPLENBQUMsS0FBa0Q7SUFFOUUsa0NBQWtDO0lBQ2xDLElBQUksS0FBSyxDQUFDLFlBQVksMkNBQWtDLEVBQUU7UUFDeEQsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDOUI7SUFDRCxJQUFJLEtBQUssQ0FBQyxZQUFZLDhEQUE0QyxFQUFFO1FBQ2xFLE9BQU8sdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDdkM7SUFFRCxNQUFNLElBQUksS0FBSyxDQUFDLDZCQUE2QixLQUFLLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBWEQsMEJBV0M7QUFFRCxTQUFTLGNBQWMsQ0FBQyxLQUFrRDtJQUN4RSxPQUFPO1FBQ0wsSUFBSSxFQUFFO1lBQ0osS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQztTQUNsRDtLQUNGLENBQUM7QUFDSixDQUFDO0FBRUQsU0FBUyx1QkFBdUIsQ0FBQyxLQUFrRDtJQUNqRixPQUFPO1FBQ0wsSUFBSSxFQUFFO1lBQ0osS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQztTQUN0RDtLQUNGLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuVXRpbHNSZXNvdXJjZVR5cGUgfSBmcm9tICcuL2NvbnN0cyc7XG5cbi8qKlxuICogUGFyc2VzIHRoZSB2YWx1ZSBvZiBcIlZhbHVlXCIgYW5kIHJlZmxlY3RzIGl0IGJhY2sgYXMgYXR0cmlidXRlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuXG4gIC8vIGRpc3BhdGNoIGJhc2VkIG9uIHJlc291cmNlIHR5cGVcbiAgaWYgKGV2ZW50LlJlc291cmNlVHlwZSA9PT0gQ2ZuVXRpbHNSZXNvdXJjZVR5cGUuQ0ZOX0pTT04pIHtcbiAgICByZXR1cm4gY2ZuSnNvbkhhbmRsZXIoZXZlbnQpO1xuICB9XG4gIGlmIChldmVudC5SZXNvdXJjZVR5cGUgPT09IENmblV0aWxzUmVzb3VyY2VUeXBlLkNGTl9KU09OX1NUUklOR0lGWSkge1xuICAgIHJldHVybiBjZm5Kc29uU3RyaW5naWZ5SGFuZGxlcihldmVudCk7XG4gIH1cblxuICB0aHJvdyBuZXcgRXJyb3IoYHVuZXhwZWN0ZWQgcmVzb3VyY2UgdHlwZSBcIiR7ZXZlbnQuUmVzb3VyY2VUeXBlfWApO1xufVxuXG5mdW5jdGlvbiBjZm5Kc29uSGFuZGxlcihldmVudDogQVdTTGFtYmRhLkNsb3VkRm9ybWF0aW9uQ3VzdG9tUmVzb3VyY2VFdmVudCkge1xuICByZXR1cm4ge1xuICAgIERhdGE6IHtcbiAgICAgIFZhbHVlOiBKU09OLnBhcnNlKGV2ZW50LlJlc291cmNlUHJvcGVydGllcy5WYWx1ZSksXG4gICAgfSxcbiAgfTtcbn1cblxuZnVuY3Rpb24gY2ZuSnNvblN0cmluZ2lmeUhhbmRsZXIoZXZlbnQ6IEFXU0xhbWJkYS5DbG91ZEZvcm1hdGlvbkN1c3RvbVJlc291cmNlRXZlbnQpIHtcbiAgcmV0dXJuIHtcbiAgICBEYXRhOiB7XG4gICAgICBWYWx1ZTogSlNPTi5zdHJpbmdpZnkoZXZlbnQuUmVzb3VyY2VQcm9wZXJ0aWVzLlZhbHVlKSxcbiAgICB9LFxuICB9O1xufVxuIl19