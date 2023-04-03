"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsResourceHandler = exports.NotificationsResourceHandlerProps = void 0;
const fs = require("fs");
const path = require("path");
const iam = require("@aws-cdk/aws-iam");
const cdk = require("@aws-cdk/core");
const constructs_1 = require("constructs");
class NotificationsResourceHandlerProps {
}
exports.NotificationsResourceHandlerProps = NotificationsResourceHandlerProps;
/**
 * A Lambda-based custom resource handler that provisions S3 bucket
 * notifications for a bucket.
 *
 * The resource property schema is:
 *
 * {
 *   BucketName: string, NotificationConfiguration: { see
 *   PutBucketNotificationConfiguration }
 * }
 *
 * For 'Delete' operations, we send an empty NotificationConfiguration as
 * required. We propagate errors and results as-is.
 *
 * Sadly, we can't use @aws-cdk/aws-lambda as it will introduce a dependency
 * cycle, so this uses raw `cdk.Resource`s.
 */
class NotificationsResourceHandler extends constructs_1.Construct {
    /**
     * Defines a stack-singleton lambda function with the logic for a CloudFormation custom
     * resource that provisions bucket notification configuration for a bucket.
     *
     * @returns The ARN of the custom resource lambda function.
     */
    static singleton(context, props = {}) {
        const root = cdk.Stack.of(context);
        // well-known logical id to ensure stack singletonity
        const logicalId = 'BucketNotificationsHandler050a0587b7544547bf325f094a3db834';
        let lambda = root.node.tryFindChild(logicalId);
        if (!lambda) {
            lambda = new NotificationsResourceHandler(root, logicalId, props);
        }
        return lambda;
    }
    constructor(scope, id, props = {}) {
        super(scope, id);
        this.role = props.role ?? new iam.Role(this, 'Role', {
            assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        });
        this.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
        this.role.addToPrincipalPolicy(new iam.PolicyStatement({
            actions: ['s3:PutBucketNotification'],
            resources: ['*'],
        }));
        const resourceType = 'AWS::Lambda::Function';
        class InLineLambda extends cdk.CfnResource {
            constructor() {
                super(...arguments);
                this.tags = new cdk.TagManager(cdk.TagType.STANDARD, resourceType);
            }
            renderProperties(properties) {
                properties.Tags = cdk.listMapper(cdk.cfnTagToCloudFormation)(this.tags.renderTags());
                delete properties.tags;
                return properties;
            }
        }
        const handlerSource = fs.readFileSync(path.join(__dirname, 'lambda/index.py'), 'utf8');
        // Removing lines that starts with '#' (comment lines) in order to fit the 4096 limit
        const handlerSourceWithoutComments = handlerSource.replace(/^ *#.*\n?/gm, '');
        if (handlerSourceWithoutComments.length > 4096) {
            throw new Error(`Source of Notifications Resource Handler is too large (${handlerSourceWithoutComments.length} > 4096)`);
        }
        const resource = new InLineLambda(this, 'Resource', {
            type: resourceType,
            properties: {
                Description: 'AWS CloudFormation handler for "Custom::S3BucketNotifications" resources (@aws-cdk/aws-s3)',
                Code: { ZipFile: handlerSourceWithoutComments },
                Handler: 'index.handler',
                Role: this.role.roleArn,
                Runtime: 'python3.9',
                Timeout: 300,
            },
        });
        resource.node.addDependency(this.role);
        this.functionArn = resource.getAtt('Arn').toString();
    }
    addToRolePolicy(statement) {
        this.role.addToPrincipalPolicy(statement);
    }
}
exports.NotificationsResourceHandler = NotificationsResourceHandler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9ucy1yZXNvdXJjZS1oYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibm90aWZpY2F0aW9ucy1yZXNvdXJjZS1oYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0Isd0NBQXdDO0FBQ3hDLHFDQUFxQztBQUNyQywyQ0FBdUM7QUFFdkMsTUFBYSxpQ0FBaUM7Q0FFN0M7QUFGRCw4RUFFQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBQ0gsTUFBYSw0QkFBNkIsU0FBUSxzQkFBUztJQUN6RDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBa0IsRUFBRSxRQUEyQyxFQUFFO1FBQ3ZGLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRW5DLHFEQUFxRDtRQUNyRCxNQUFNLFNBQVMsR0FBRyw0REFBNEQsQ0FBQztRQUMvRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQWlDLENBQUM7UUFDL0UsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sR0FBRyxJQUFJLDRCQUE0QixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkU7UUFFRCxPQUFPLE1BQU0sQ0FBQztLQUNmO0lBYUQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxRQUEyQyxFQUFFO1FBQ3JGLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFakIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFO1lBQ25ELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxzQkFBc0IsQ0FBQztTQUM1RCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUN4QixHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLDBDQUEwQyxDQUFDLENBQ3ZGLENBQUM7UUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztZQUNyRCxPQUFPLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQztZQUNyQyxTQUFTLEVBQUUsQ0FBQyxHQUFHLENBQUM7U0FDakIsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLFlBQVksR0FBRyx1QkFBdUIsQ0FBQztRQUM3QyxNQUFNLFlBQWEsU0FBUSxHQUFHLENBQUMsV0FBVztZQUExQzs7Z0JBQ2tCLFNBQUksR0FBbUIsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBT2hHLENBQUM7WUFMVyxnQkFBZ0IsQ0FBQyxVQUFlO2dCQUN4QyxVQUFVLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO2dCQUNyRixPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUM7Z0JBQ3ZCLE9BQU8sVUFBVSxDQUFDO1lBQ3BCLENBQUM7U0FDRjtRQUVELE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUV2RixxRkFBcUY7UUFDckYsTUFBTSw0QkFBNEIsR0FBRyxhQUFhLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUU5RSxJQUFJLDRCQUE0QixDQUFDLE1BQU0sR0FBRyxJQUFJLEVBQUU7WUFDOUMsTUFBTSxJQUFJLEtBQUssQ0FBQywwREFBMEQsNEJBQTRCLENBQUMsTUFBTSxVQUFVLENBQUMsQ0FBQztTQUMxSDtRQUVELE1BQU0sUUFBUSxHQUFHLElBQUksWUFBWSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDbEQsSUFBSSxFQUFFLFlBQVk7WUFDbEIsVUFBVSxFQUFFO2dCQUNWLFdBQVcsRUFBRSw0RkFBNEY7Z0JBQ3pHLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSw0QkFBNEIsRUFBRTtnQkFDL0MsT0FBTyxFQUFFLGVBQWU7Z0JBQ3hCLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU87Z0JBQ3ZCLE9BQU8sRUFBRSxXQUFXO2dCQUNwQixPQUFPLEVBQUUsR0FBRzthQUNiO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXZDLElBQUksQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUN0RDtJQUVNLGVBQWUsQ0FBQyxTQUE4QjtRQUNuRCxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQzNDO0NBQ0Y7QUFyRkQsb0VBcUZDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGlhbSBmcm9tICdAYXdzLWNkay9hd3MtaWFtJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5leHBvcnQgY2xhc3MgTm90aWZpY2F0aW9uc1Jlc291cmNlSGFuZGxlclByb3BzIHtcbiAgcm9sZT86IGlhbS5JUm9sZTtcbn1cblxuLyoqXG4gKiBBIExhbWJkYS1iYXNlZCBjdXN0b20gcmVzb3VyY2UgaGFuZGxlciB0aGF0IHByb3Zpc2lvbnMgUzMgYnVja2V0XG4gKiBub3RpZmljYXRpb25zIGZvciBhIGJ1Y2tldC5cbiAqXG4gKiBUaGUgcmVzb3VyY2UgcHJvcGVydHkgc2NoZW1hIGlzOlxuICpcbiAqIHtcbiAqICAgQnVja2V0TmFtZTogc3RyaW5nLCBOb3RpZmljYXRpb25Db25maWd1cmF0aW9uOiB7IHNlZVxuICogICBQdXRCdWNrZXROb3RpZmljYXRpb25Db25maWd1cmF0aW9uIH1cbiAqIH1cbiAqXG4gKiBGb3IgJ0RlbGV0ZScgb3BlcmF0aW9ucywgd2Ugc2VuZCBhbiBlbXB0eSBOb3RpZmljYXRpb25Db25maWd1cmF0aW9uIGFzXG4gKiByZXF1aXJlZC4gV2UgcHJvcGFnYXRlIGVycm9ycyBhbmQgcmVzdWx0cyBhcy1pcy5cbiAqXG4gKiBTYWRseSwgd2UgY2FuJ3QgdXNlIEBhd3MtY2RrL2F3cy1sYW1iZGEgYXMgaXQgd2lsbCBpbnRyb2R1Y2UgYSBkZXBlbmRlbmN5XG4gKiBjeWNsZSwgc28gdGhpcyB1c2VzIHJhdyBgY2RrLlJlc291cmNlYHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb25zUmVzb3VyY2VIYW5kbGVyIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgLyoqXG4gICAqIERlZmluZXMgYSBzdGFjay1zaW5nbGV0b24gbGFtYmRhIGZ1bmN0aW9uIHdpdGggdGhlIGxvZ2ljIGZvciBhIENsb3VkRm9ybWF0aW9uIGN1c3RvbVxuICAgKiByZXNvdXJjZSB0aGF0IHByb3Zpc2lvbnMgYnVja2V0IG5vdGlmaWNhdGlvbiBjb25maWd1cmF0aW9uIGZvciBhIGJ1Y2tldC5cbiAgICpcbiAgICogQHJldHVybnMgVGhlIEFSTiBvZiB0aGUgY3VzdG9tIHJlc291cmNlIGxhbWJkYSBmdW5jdGlvbi5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgc2luZ2xldG9uKGNvbnRleHQ6IENvbnN0cnVjdCwgcHJvcHM6IE5vdGlmaWNhdGlvbnNSZXNvdXJjZUhhbmRsZXJQcm9wcyA9IHt9KSB7XG4gICAgY29uc3Qgcm9vdCA9IGNkay5TdGFjay5vZihjb250ZXh0KTtcblxuICAgIC8vIHdlbGwta25vd24gbG9naWNhbCBpZCB0byBlbnN1cmUgc3RhY2sgc2luZ2xldG9uaXR5XG4gICAgY29uc3QgbG9naWNhbElkID0gJ0J1Y2tldE5vdGlmaWNhdGlvbnNIYW5kbGVyMDUwYTA1ODdiNzU0NDU0N2JmMzI1ZjA5NGEzZGI4MzQnO1xuICAgIGxldCBsYW1iZGEgPSByb290Lm5vZGUudHJ5RmluZENoaWxkKGxvZ2ljYWxJZCkgYXMgTm90aWZpY2F0aW9uc1Jlc291cmNlSGFuZGxlcjtcbiAgICBpZiAoIWxhbWJkYSkge1xuICAgICAgbGFtYmRhID0gbmV3IE5vdGlmaWNhdGlvbnNSZXNvdXJjZUhhbmRsZXIocm9vdCwgbG9naWNhbElkLCBwcm9wcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxhbWJkYTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgQVJOIG9mIHRoZSBoYW5kbGVyJ3MgbGFtYmRhIGZ1bmN0aW9uLiBVc2VkIGFzIGEgc2VydmljZSB0b2tlbiBpbiB0aGVcbiAgICogY3VzdG9tIHJlc291cmNlLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IGZ1bmN0aW9uQXJuOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFRoZSByb2xlIG9mIHRoZSBoYW5kbGVyJ3MgbGFtYmRhIGZ1bmN0aW9uLlxuICAgKi9cbiAgcHVibGljIHJlYWRvbmx5IHJvbGU6IGlhbS5JUm9sZTtcblxuICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogTm90aWZpY2F0aW9uc1Jlc291cmNlSGFuZGxlclByb3BzID0ge30pIHtcbiAgICBzdXBlcihzY29wZSwgaWQpO1xuXG4gICAgdGhpcy5yb2xlID0gcHJvcHMucm9sZSA/PyBuZXcgaWFtLlJvbGUodGhpcywgJ1JvbGUnLCB7XG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnbGFtYmRhLmFtYXpvbmF3cy5jb20nKSxcbiAgICB9KTtcblxuICAgIHRoaXMucm9sZS5hZGRNYW5hZ2VkUG9saWN5KFxuICAgICAgaWFtLk1hbmFnZWRQb2xpY3kuZnJvbUF3c01hbmFnZWRQb2xpY3lOYW1lKCdzZXJ2aWNlLXJvbGUvQVdTTGFtYmRhQmFzaWNFeGVjdXRpb25Sb2xlJyksXG4gICAgKTtcbiAgICB0aGlzLnJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogWydzMzpQdXRCdWNrZXROb3RpZmljYXRpb24nXSxcbiAgICAgIHJlc291cmNlczogWycqJ10sXG4gICAgfSkpO1xuXG4gICAgY29uc3QgcmVzb3VyY2VUeXBlID0gJ0FXUzo6TGFtYmRhOjpGdW5jdGlvbic7XG4gICAgY2xhc3MgSW5MaW5lTGFtYmRhIGV4dGVuZHMgY2RrLkNmblJlc291cmNlIHtcbiAgICAgIHB1YmxpYyByZWFkb25seSB0YWdzOiBjZGsuVGFnTWFuYWdlciA9IG5ldyBjZGsuVGFnTWFuYWdlcihjZGsuVGFnVHlwZS5TVEFOREFSRCwgcmVzb3VyY2VUeXBlKTtcblxuICAgICAgcHJvdGVjdGVkIHJlbmRlclByb3BlcnRpZXMocHJvcGVydGllczogYW55KTogeyBba2V5OiBzdHJpbmddOiBhbnkgfSB7XG4gICAgICAgIHByb3BlcnRpZXMuVGFncyA9IGNkay5saXN0TWFwcGVyKGNkay5jZm5UYWdUb0Nsb3VkRm9ybWF0aW9uKSh0aGlzLnRhZ3MucmVuZGVyVGFncygpKTtcbiAgICAgICAgZGVsZXRlIHByb3BlcnRpZXMudGFncztcbiAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlclNvdXJjZSA9IGZzLnJlYWRGaWxlU3luYyhwYXRoLmpvaW4oX19kaXJuYW1lLCAnbGFtYmRhL2luZGV4LnB5JyksICd1dGY4Jyk7XG5cbiAgICAvLyBSZW1vdmluZyBsaW5lcyB0aGF0IHN0YXJ0cyB3aXRoICcjJyAoY29tbWVudCBsaW5lcykgaW4gb3JkZXIgdG8gZml0IHRoZSA0MDk2IGxpbWl0XG4gICAgY29uc3QgaGFuZGxlclNvdXJjZVdpdGhvdXRDb21tZW50cyA9IGhhbmRsZXJTb3VyY2UucmVwbGFjZSgvXiAqIy4qXFxuPy9nbSwgJycpO1xuXG4gICAgaWYgKGhhbmRsZXJTb3VyY2VXaXRob3V0Q29tbWVudHMubGVuZ3RoID4gNDA5Nikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTb3VyY2Ugb2YgTm90aWZpY2F0aW9ucyBSZXNvdXJjZSBIYW5kbGVyIGlzIHRvbyBsYXJnZSAoJHtoYW5kbGVyU291cmNlV2l0aG91dENvbW1lbnRzLmxlbmd0aH0gPiA0MDk2KWApO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc291cmNlID0gbmV3IEluTGluZUxhbWJkYSh0aGlzLCAnUmVzb3VyY2UnLCB7XG4gICAgICB0eXBlOiByZXNvdXJjZVR5cGUsXG4gICAgICBwcm9wZXJ0aWVzOiB7XG4gICAgICAgIERlc2NyaXB0aW9uOiAnQVdTIENsb3VkRm9ybWF0aW9uIGhhbmRsZXIgZm9yIFwiQ3VzdG9tOjpTM0J1Y2tldE5vdGlmaWNhdGlvbnNcIiByZXNvdXJjZXMgKEBhd3MtY2RrL2F3cy1zMyknLFxuICAgICAgICBDb2RlOiB7IFppcEZpbGU6IGhhbmRsZXJTb3VyY2VXaXRob3V0Q29tbWVudHMgfSxcbiAgICAgICAgSGFuZGxlcjogJ2luZGV4LmhhbmRsZXInLFxuICAgICAgICBSb2xlOiB0aGlzLnJvbGUucm9sZUFybixcbiAgICAgICAgUnVudGltZTogJ3B5dGhvbjMuOScsXG4gICAgICAgIFRpbWVvdXQ6IDMwMCxcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgcmVzb3VyY2Uubm9kZS5hZGREZXBlbmRlbmN5KHRoaXMucm9sZSk7XG5cbiAgICB0aGlzLmZ1bmN0aW9uQXJuID0gcmVzb3VyY2UuZ2V0QXR0KCdBcm4nKS50b1N0cmluZygpO1xuICB9XG5cbiAgcHVibGljIGFkZFRvUm9sZVBvbGljeShzdGF0ZW1lbnQ6IGlhbS5Qb2xpY3lTdGF0ZW1lbnQpIHtcbiAgICB0aGlzLnJvbGUuYWRkVG9QcmluY2lwYWxQb2xpY3koc3RhdGVtZW50KTtcbiAgfVxufVxuIl19