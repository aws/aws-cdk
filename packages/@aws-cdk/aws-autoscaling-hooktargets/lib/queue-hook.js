"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueHook = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const common_1 = require("./common");
/**
 * Use an SQS queue as a hook target
 */
class QueueHook {
    constructor(queue) {
        this.queue = queue;
    }
    /**
     * If an `IRole` is found in `options`, grant it access to send messages.
     * Otherwise, create a new `IRole` and grant it access to send messages.
     *
     * @returns the `IRole` with access to send messages and the ARN of the queue it has access to send messages to.
     */
    bind(_scope, options) {
        const role = common_1.createRole(_scope, options.role);
        this.queue.grantSendMessages(role);
        return {
            notificationTargetArn: this.queue.queueArn,
            createdRole: role,
        };
    }
}
exports.QueueHook = QueueHook;
_a = JSII_RTTI_SYMBOL_1;
QueueHook[_a] = { fqn: "@aws-cdk/aws-autoscaling-hooktargets.QueueHook", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUtaG9vay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInF1ZXVlLWhvb2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFHQSxxQ0FBc0M7QUFFdEM7O0dBRUc7QUFDSCxNQUFhLFNBQVM7SUFDcEIsWUFBNkIsS0FBaUI7UUFBakIsVUFBSyxHQUFMLEtBQUssQ0FBWTtLQUM3QztJQUVEOzs7OztPQUtHO0lBQ0ksSUFBSSxDQUFDLE1BQWlCLEVBQUUsT0FBMEM7UUFDdkUsTUFBTSxJQUFJLEdBQUcsbUJBQVUsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbkMsT0FBTztZQUNMLHFCQUFxQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtZQUMxQyxXQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDO0tBQ0g7O0FBbEJILDhCQW1CQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGF1dG9zY2FsaW5nIGZyb20gJ0Bhd3MtY2RrL2F3cy1hdXRvc2NhbGluZyc7XG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnQGF3cy1jZGsvYXdzLXNxcyc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IGNyZWF0ZVJvbGUgfSBmcm9tICcuL2NvbW1vbic7XG5cbi8qKlxuICogVXNlIGFuIFNRUyBxdWV1ZSBhcyBhIGhvb2sgdGFyZ2V0XG4gKi9cbmV4cG9ydCBjbGFzcyBRdWV1ZUhvb2sgaW1wbGVtZW50cyBhdXRvc2NhbGluZy5JTGlmZWN5Y2xlSG9va1RhcmdldCB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgcXVldWU6IHNxcy5JUXVldWUpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiBhbiBgSVJvbGVgIGlzIGZvdW5kIGluIGBvcHRpb25zYCwgZ3JhbnQgaXQgYWNjZXNzIHRvIHNlbmQgbWVzc2FnZXMuXG4gICAqIE90aGVyd2lzZSwgY3JlYXRlIGEgbmV3IGBJUm9sZWAgYW5kIGdyYW50IGl0IGFjY2VzcyB0byBzZW5kIG1lc3NhZ2VzLlxuICAgKlxuICAgKiBAcmV0dXJucyB0aGUgYElSb2xlYCB3aXRoIGFjY2VzcyB0byBzZW5kIG1lc3NhZ2VzIGFuZCB0aGUgQVJOIG9mIHRoZSBxdWV1ZSBpdCBoYXMgYWNjZXNzIHRvIHNlbmQgbWVzc2FnZXMgdG8uXG4gICAqL1xuICBwdWJsaWMgYmluZChfc2NvcGU6IENvbnN0cnVjdCwgb3B0aW9uczogYXV0b3NjYWxpbmcuQmluZEhvb2tUYXJnZXRPcHRpb25zKTogYXV0b3NjYWxpbmcuTGlmZWN5Y2xlSG9va1RhcmdldENvbmZpZyB7XG4gICAgY29uc3Qgcm9sZSA9IGNyZWF0ZVJvbGUoX3Njb3BlLCBvcHRpb25zLnJvbGUpO1xuICAgIHRoaXMucXVldWUuZ3JhbnRTZW5kTWVzc2FnZXMocm9sZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbm90aWZpY2F0aW9uVGFyZ2V0QXJuOiB0aGlzLnF1ZXVlLnF1ZXVlQXJuLFxuICAgICAgY3JlYXRlZFJvbGU6IHJvbGUsXG4gICAgfTtcbiAgfVxufVxuIl19