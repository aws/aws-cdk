"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystem = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const core_1 = require("@aws-cdk/core");
/**
 * Represents the filesystem for the Lambda function
 */
class FileSystem {
    /**
     * @param config the FileSystem configurations for the Lambda function
     */
    constructor(config) {
        this.config = config;
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_lambda_FileSystemConfig(config);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, FileSystem);
            }
            throw error;
        }
    }
    /**
     * mount the filesystem from Amazon EFS
     * @param ap the Amazon EFS access point
     * @param mountPath the target path in the lambda runtime environment
     */
    static fromEfsAccessPoint(ap, mountPath) {
        return new FileSystem({
            localMountPath: mountPath,
            arn: ap.accessPointArn,
            dependency: [ap.fileSystem.mountTargetsAvailable],
            connections: ap.fileSystem.connections,
            policies: [
                new iam.PolicyStatement({
                    actions: ['elasticfilesystem:ClientMount'],
                    resources: ['*'],
                    conditions: {
                        StringEquals: {
                            'elasticfilesystem:AccessPointArn': ap.accessPointArn,
                        },
                    },
                }),
                new iam.PolicyStatement({
                    actions: ['elasticfilesystem:ClientWrite'],
                    resources: [core_1.Stack.of(ap).formatArn({
                            service: 'elasticfilesystem',
                            resource: 'file-system',
                            resourceName: ap.fileSystem.fileSystemId,
                        })],
                }),
            ],
        });
    }
}
exports.FileSystem = FileSystem;
_a = JSII_RTTI_SYMBOL_1;
FileSystem[_a] = { fqn: "@aws-cdk/aws-lambda.FileSystem", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsZXN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpbGVzeXN0ZW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsd0NBQXdDO0FBQ3hDLHdDQUFzQztBQXVDdEM7O0dBRUc7QUFDSCxNQUFhLFVBQVU7SUFrQ3JCOztPQUVHO0lBQ0gsWUFBc0MsTUFBd0I7UUFBeEIsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7Ozs7OzsrQ0FyQ25ELFVBQVU7Ozs7S0FxQzhDO0lBcENuRTs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLGtCQUFrQixDQUFDLEVBQW9CLEVBQUUsU0FBaUI7UUFDdEUsT0FBTyxJQUFJLFVBQVUsQ0FBQztZQUNwQixjQUFjLEVBQUUsU0FBUztZQUN6QixHQUFHLEVBQUUsRUFBRSxDQUFDLGNBQWM7WUFDdEIsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQztZQUNqRCxXQUFXLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXO1lBQ3RDLFFBQVEsRUFBRTtnQkFDUixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7b0JBQ3RCLE9BQU8sRUFBRSxDQUFDLCtCQUErQixDQUFDO29CQUMxQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7b0JBQ2hCLFVBQVUsRUFBRTt3QkFDVixZQUFZLEVBQUU7NEJBQ1osa0NBQWtDLEVBQUUsRUFBRSxDQUFDLGNBQWM7eUJBQ3REO3FCQUNGO2lCQUNGLENBQUM7Z0JBQ0YsSUFBSSxHQUFHLENBQUMsZUFBZSxDQUFDO29CQUN0QixPQUFPLEVBQUUsQ0FBQywrQkFBK0IsQ0FBQztvQkFDMUMsU0FBUyxFQUFFLENBQUMsWUFBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUM7NEJBQ2pDLE9BQU8sRUFBRSxtQkFBbUI7NEJBQzVCLFFBQVEsRUFBRSxhQUFhOzRCQUN2QixZQUFZLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZO3lCQUN6QyxDQUFDLENBQUM7aUJBQ0osQ0FBQzthQUNIO1NBQ0YsQ0FBQyxDQUFDO0tBQ0o7O0FBaENILGdDQXNDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbm5lY3Rpb25zIH0gZnJvbSAnQGF3cy1jZGsvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBlZnMgZnJvbSAnQGF3cy1jZGsvYXdzLWVmcyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0IHsgSURlcGVuZGFibGUgfSBmcm9tICdjb25zdHJ1Y3RzJztcblxuLyoqXG4gKiBGaWxlU3lzdGVtIGNvbmZpZ3VyYXRpb25zIGZvciB0aGUgTGFtYmRhIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmlsZVN5c3RlbUNvbmZpZyB7XG4gIC8qKlxuICAgKiBtb3VudCBwYXRoIGluIHRoZSBsYW1iZGEgcnVudGltZSBlbnZpcm9ubWVudFxuICAgKi9cbiAgcmVhZG9ubHkgbG9jYWxNb3VudFBhdGg6IHN0cmluZztcblxuICAvKipcbiAgICogQVJOIG9mIHRoZSBhY2Nlc3MgcG9pbnRcbiAgICovXG4gIHJlYWRvbmx5IGFybjogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBhcnJheSBvZiBJRGVwZW5kYWJsZSB0aGF0IGxhbWJkYSBmdW5jdGlvbiBkZXBlbmRzIG9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gZGVwZW5kZW5jeVxuICAgKi9cbiAgcmVhZG9ubHkgZGVwZW5kZW5jeT86IElEZXBlbmRhYmxlW11cblxuICAvKipcbiAgICogY29ubmVjdGlvbnMgb2JqZWN0IHVzZWQgdG8gYWxsb3cgaW5ncmVzcyB0cmFmZmljIGZyb20gbGFtYmRhIGZ1bmN0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gY29ubmVjdGlvbnMgcmVxdWlyZWQgdG8gYWRkIGV4dHJhIGluZ3Jlc3MgcnVsZXMgZm9yIExhbWJkYSBmdW5jdGlvblxuICAgKi9cbiAgcmVhZG9ubHkgY29ubmVjdGlvbnM/OiBDb25uZWN0aW9ucztcblxuICAvKipcbiAgICogYWRkaXRpb25hbCBJQU0gcG9saWNpZXMgcmVxdWlyZWQgZm9yIHRoZSBsYW1iZGEgZnVuY3Rpb25cbiAgICpcbiAgICogQGRlZmF1bHQgLSBubyBhZGRpdGlvbmFsIHBvbGljaWVzIHJlcXVpcmVkXG4gICAqL1xuICByZWFkb25seSBwb2xpY2llcz86IGlhbS5Qb2xpY3lTdGF0ZW1lbnRbXTtcbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBmaWxlc3lzdGVtIGZvciB0aGUgTGFtYmRhIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBjbGFzcyBGaWxlU3lzdGVtIHtcbiAgLyoqXG4gICAqIG1vdW50IHRoZSBmaWxlc3lzdGVtIGZyb20gQW1hem9uIEVGU1xuICAgKiBAcGFyYW0gYXAgdGhlIEFtYXpvbiBFRlMgYWNjZXNzIHBvaW50XG4gICAqIEBwYXJhbSBtb3VudFBhdGggdGhlIHRhcmdldCBwYXRoIGluIHRoZSBsYW1iZGEgcnVudGltZSBlbnZpcm9ubWVudFxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBmcm9tRWZzQWNjZXNzUG9pbnQoYXA6IGVmcy5JQWNjZXNzUG9pbnQsIG1vdW50UGF0aDogc3RyaW5nKTogRmlsZVN5c3RlbSB7XG4gICAgcmV0dXJuIG5ldyBGaWxlU3lzdGVtKHtcbiAgICAgIGxvY2FsTW91bnRQYXRoOiBtb3VudFBhdGgsXG4gICAgICBhcm46IGFwLmFjY2Vzc1BvaW50QXJuLFxuICAgICAgZGVwZW5kZW5jeTogW2FwLmZpbGVTeXN0ZW0ubW91bnRUYXJnZXRzQXZhaWxhYmxlXSxcbiAgICAgIGNvbm5lY3Rpb25zOiBhcC5maWxlU3lzdGVtLmNvbm5lY3Rpb25zLFxuICAgICAgcG9saWNpZXM6IFtcbiAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgIGFjdGlvbnM6IFsnZWxhc3RpY2ZpbGVzeXN0ZW06Q2xpZW50TW91bnQnXSxcbiAgICAgICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgICAgICAgIGNvbmRpdGlvbnM6IHtcbiAgICAgICAgICAgIFN0cmluZ0VxdWFsczoge1xuICAgICAgICAgICAgICAnZWxhc3RpY2ZpbGVzeXN0ZW06QWNjZXNzUG9pbnRBcm4nOiBhcC5hY2Nlc3NQb2ludEFybixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfSxcbiAgICAgICAgfSksXG4gICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgICAgICBhY3Rpb25zOiBbJ2VsYXN0aWNmaWxlc3lzdGVtOkNsaWVudFdyaXRlJ10sXG4gICAgICAgICAgcmVzb3VyY2VzOiBbU3RhY2sub2YoYXApLmZvcm1hdEFybih7XG4gICAgICAgICAgICBzZXJ2aWNlOiAnZWxhc3RpY2ZpbGVzeXN0ZW0nLFxuICAgICAgICAgICAgcmVzb3VyY2U6ICdmaWxlLXN5c3RlbScsXG4gICAgICAgICAgICByZXNvdXJjZU5hbWU6IGFwLmZpbGVTeXN0ZW0uZmlsZVN5c3RlbUlkLFxuICAgICAgICAgIH0pXSxcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBjb25maWcgdGhlIEZpbGVTeXN0ZW0gY29uZmlndXJhdGlvbnMgZm9yIHRoZSBMYW1iZGEgZnVuY3Rpb25cbiAgICovXG4gIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgY29uZmlnOiBGaWxlU3lzdGVtQ29uZmlnKSB7IH1cbn1cbiJdfQ==