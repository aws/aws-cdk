"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeTask = void 0;
const sfn = require("aws-cdk-lib/aws-stepfunctions");
/**
 * Task extending sfn.TaskStateBase to facilitate integ testing setting credentials
 */
class FakeTask extends sfn.TaskStateBase {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        this.parameters = props.parameters;
    }
    _renderTask() {
        return {
            Type: 'Task',
            Resource: 'arn:aws:states:::dynamodb:putItem',
            Parameters: {
                TableName: 'my-cool-table',
                Item: {
                    id: {
                        S: 'my-entry',
                    },
                },
                ...this.parameters,
            },
        };
    }
}
exports.FakeTask = FakeTask;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS10YXNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFrZS10YXNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLHFEQUFxRDtBQU1yRDs7R0FFRztBQUNILE1BQWEsUUFBUyxTQUFRLEdBQUcsQ0FBQyxhQUFhO0lBSzdDLFlBQVksS0FBMkIsRUFBRSxFQUFVLEVBQUUsUUFBdUIsRUFBRTtRQUM1RSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7SUFDckMsQ0FBQztJQUVTLFdBQVc7UUFDbkIsT0FBTztZQUNMLElBQUksRUFBRSxNQUFNO1lBQ1osUUFBUSxFQUFFLG1DQUFtQztZQUM3QyxVQUFVLEVBQUU7Z0JBQ1YsU0FBUyxFQUFFLGVBQWU7Z0JBQzFCLElBQUksRUFBRTtvQkFDSixFQUFFLEVBQUU7d0JBQ0YsQ0FBQyxFQUFFLFVBQVU7cUJBQ2Q7aUJBQ0Y7Z0JBQ0QsR0FBRyxJQUFJLENBQUMsVUFBVTthQUNuQjtTQUNGLENBQUM7SUFDSixDQUFDO0NBQ0Y7QUF6QkQsNEJBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMgY29uc3RydWN0cyBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIHNmbiBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc3RlcGZ1bmN0aW9ucyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmFrZVRhc2tQcm9wcyBleHRlbmRzIHNmbi5UYXNrU3RhdGVCYXNlUHJvcHMge1xuICBwYXJhbWV0ZXJzPzogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcbn1cblxuLyoqXG4gKiBUYXNrIGV4dGVuZGluZyBzZm4uVGFza1N0YXRlQmFzZSB0byBmYWNpbGl0YXRlIGludGVnIHRlc3Rpbmcgc2V0dGluZyBjcmVkZW50aWFsc1xuICovXG5leHBvcnQgY2xhc3MgRmFrZVRhc2sgZXh0ZW5kcyBzZm4uVGFza1N0YXRlQmFzZSB7XG4gIHByb3RlY3RlZCByZWFkb25seSB0YXNrTWV0cmljcz86IHNmbi5UYXNrTWV0cmljc0NvbmZpZztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHRhc2tQb2xpY2llcz86IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXTtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHBhcmFtZXRlcnM/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjb25zdHJ1Y3RzLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEZha2VUYXNrUHJvcHMgPSB7fSkge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgIHRoaXMucGFyYW1ldGVycyA9IHByb3BzLnBhcmFtZXRlcnM7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3JlbmRlclRhc2soKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgVHlwZTogJ1Rhc2snLFxuICAgICAgUmVzb3VyY2U6ICdhcm46YXdzOnN0YXRlczo6OmR5bmFtb2RiOnB1dEl0ZW0nLFxuICAgICAgUGFyYW1ldGVyczoge1xuICAgICAgICBUYWJsZU5hbWU6ICdteS1jb29sLXRhYmxlJyxcbiAgICAgICAgSXRlbToge1xuICAgICAgICAgIGlkOiB7XG4gICAgICAgICAgICBTOiAnbXktZW50cnknLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIC4uLnRoaXMucGFyYW1ldGVycyxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIl19