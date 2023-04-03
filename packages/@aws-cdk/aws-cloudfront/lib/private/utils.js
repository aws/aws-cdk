"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDistributionArn = void 0;
const core_1 = require("@aws-cdk/core");
/**
 * Format distribution ARN from stack and distribution ID.
 */
function formatDistributionArn(dist) {
    return core_1.Stack.of(dist).formatArn({
        service: 'cloudfront',
        region: '',
        resource: 'distribution',
        resourceName: dist.distributionId,
    });
}
exports.formatDistributionArn = formatDistributionArn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx3Q0FBc0M7QUFHdEM7O0dBRUc7QUFDSCxTQUFnQixxQkFBcUIsQ0FBQyxJQUFtQjtJQUN2RCxPQUFPLFlBQUssQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzlCLE9BQU8sRUFBRSxZQUFZO1FBQ3JCLE1BQU0sRUFBRSxFQUFFO1FBQ1YsUUFBUSxFQUFFLGNBQWM7UUFDeEIsWUFBWSxFQUFFLElBQUksQ0FBQyxjQUFjO0tBQ2xDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFQRCxzREFPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN0YWNrIH0gZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBJRGlzdHJpYnV0aW9uIH0gZnJvbSAnLi4nO1xuXG4vKipcbiAqIEZvcm1hdCBkaXN0cmlidXRpb24gQVJOIGZyb20gc3RhY2sgYW5kIGRpc3RyaWJ1dGlvbiBJRC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdERpc3RyaWJ1dGlvbkFybihkaXN0OiBJRGlzdHJpYnV0aW9uKSB7XG4gIHJldHVybiBTdGFjay5vZihkaXN0KS5mb3JtYXRBcm4oe1xuICAgIHNlcnZpY2U6ICdjbG91ZGZyb250JyxcbiAgICByZWdpb246ICcnLFxuICAgIHJlc291cmNlOiAnZGlzdHJpYnV0aW9uJyxcbiAgICByZXNvdXJjZU5hbWU6IGRpc3QuZGlzdHJpYnV0aW9uSWQsXG4gIH0pO1xufVxuIl19