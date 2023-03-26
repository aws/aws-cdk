"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeTask = void 0;
const sfn = require("../../lib");
class FakeTask extends sfn.TaskStateBase {
    constructor(scope, id, props = {}) {
        super(scope, id, props);
        this.taskMetrics = props.metrics;
    }
    /**
       * @internal
       */
    _renderTask() {
        return {
            Resource: 'my-resource',
            Parameters: sfn.FieldUtils.renderObject({
                MyParameter: 'myParameter',
            }),
        };
    }
}
exports.FakeTask = FakeTask;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS10YXNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZmFrZS10YXNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLGlDQUFpQztBQU1qQyxNQUFhLFFBQVMsU0FBUSxHQUFHLENBQUMsYUFBYTtJQUk3QyxZQUFZLEtBQTJCLEVBQUUsRUFBVSxFQUFFLFFBQXVCLEVBQUU7UUFDNUUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO0tBQ2xDO0lBRUQ7O1NBRUs7SUFDSyxXQUFXO1FBQ25CLE9BQU87WUFDTCxRQUFRLEVBQUUsYUFBYTtZQUN2QixVQUFVLEVBQUUsR0FBRyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUM7Z0JBQ3RDLFdBQVcsRUFBRSxhQUFhO2FBQzNCLENBQUM7U0FDSCxDQUFDO0tBQ0g7Q0FDRjtBQXBCRCw0QkFvQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBjb25zdHJ1Y3RzIGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgc2ZuIGZyb20gJy4uLy4uL2xpYic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmFrZVRhc2tQcm9wcyBleHRlbmRzIHNmbi5UYXNrU3RhdGVCYXNlUHJvcHMge1xuICByZWFkb25seSBtZXRyaWNzPzogc2ZuLlRhc2tNZXRyaWNzQ29uZmlnO1xufVxuXG5leHBvcnQgY2xhc3MgRmFrZVRhc2sgZXh0ZW5kcyBzZm4uVGFza1N0YXRlQmFzZSB7XG4gIHByb3RlY3RlZCByZWFkb25seSB0YXNrTWV0cmljcz86IHNmbi5UYXNrTWV0cmljc0NvbmZpZztcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHRhc2tQb2xpY2llcz86IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogY29uc3RydWN0cy5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBGYWtlVGFza1Byb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICB0aGlzLnRhc2tNZXRyaWNzID0gcHJvcHMubWV0cmljcztcbiAgfVxuXG4gIC8qKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICBwcm90ZWN0ZWQgX3JlbmRlclRhc2soKTogYW55IHtcbiAgICByZXR1cm4ge1xuICAgICAgUmVzb3VyY2U6ICdteS1yZXNvdXJjZScsXG4gICAgICBQYXJhbWV0ZXJzOiBzZm4uRmllbGRVdGlscy5yZW5kZXJPYmplY3Qoe1xuICAgICAgICBNeVBhcmFtZXRlcjogJ215UGFyYW1ldGVyJyxcbiAgICAgIH0pLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==