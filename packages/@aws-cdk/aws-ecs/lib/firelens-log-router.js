"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirelensLogRouter = exports.obtainDefaultFluentBitECRImage = exports.FirelensConfigFileType = exports.FirelensLogRouterType = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const iam = require("@aws-cdk/aws-iam");
const ssm = require("@aws-cdk/aws-ssm");
const cdk = require("@aws-cdk/core");
const container_definition_1 = require("./container-definition");
const container_image_1 = require("./container-image");
/**
 * Firelens log router type, fluentbit or fluentd.
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html
 */
var FirelensLogRouterType;
(function (FirelensLogRouterType) {
    /**
     * fluentbit
     */
    FirelensLogRouterType["FLUENTBIT"] = "fluentbit";
    /**
     * fluentd
     */
    FirelensLogRouterType["FLUENTD"] = "fluentd";
})(FirelensLogRouterType = exports.FirelensLogRouterType || (exports.FirelensLogRouterType = {}));
/**
 * Firelens configuration file type, s3 or file path.
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html#firelens-taskdef-customconfig
 */
var FirelensConfigFileType;
(function (FirelensConfigFileType) {
    /**
     * s3
     */
    FirelensConfigFileType["S3"] = "s3";
    /**
     * fluentd
     */
    FirelensConfigFileType["FILE"] = "file";
})(FirelensConfigFileType = exports.FirelensConfigFileType || (exports.FirelensConfigFileType = {}));
/**
 * Render to CfnTaskDefinition.FirelensConfigurationProperty from FirelensConfig
 */
function renderFirelensConfig(firelensConfig) {
    if (!firelensConfig.options) {
        return { type: firelensConfig.type };
    }
    else if (firelensConfig.options.configFileValue === undefined) {
        // config file options work as a pair together to define a custom config source
        // a custom config source is optional,
        // and thus the `config-file-x` keys should be set together or not at all
        return {
            type: firelensConfig.type,
            options: {
                'enable-ecs-log-metadata': firelensConfig.options.enableECSLogMetadata ? 'true' : 'false',
            },
        };
    }
    else {
        // firelensConfig.options.configFileType has been filled with s3 or file type in constructor.
        return {
            type: firelensConfig.type,
            options: {
                'enable-ecs-log-metadata': firelensConfig.options.enableECSLogMetadata ? 'true' : 'false',
                'config-file-type': firelensConfig.options.configFileType,
                'config-file-value': firelensConfig.options.configFileValue,
            },
        };
    }
}
/**
 * SSM parameters for latest fluent bit docker image in ECR
 * https://github.com/aws/aws-for-fluent-bit#using-ssm-to-find-available-versions
 */
const fluentBitImageSSMPath = '/aws/service/aws-for-fluent-bit';
/**
 * Obtain Fluent Bit image in Amazon ECR and setup corresponding IAM permissions.
 * ECR image pull permissions will be granted in task execution role.
 * Cloudwatch logs, Kinesis data stream or firehose permissions will be grant by check options in logDriverConfig.
 * https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html#firelens-using-fluentbit
 */
function obtainDefaultFluentBitECRImage(task, logDriverConfig, imageTag) {
    // grant ECR image pull permissions to executor role
    task.addToExecutionRolePolicy(new iam.PolicyStatement({
        actions: [
            'ecr:GetAuthorizationToken',
            'ecr:BatchCheckLayerAvailability',
            'ecr:GetDownloadUrlForLayer',
            'ecr:BatchGetImage',
        ],
        resources: ['*'],
    }));
    // grant cloudwatch or firehose permissions to task role
    const logName = logDriverConfig && logDriverConfig.logDriver === 'awsfirelens'
        && logDriverConfig.options && logDriverConfig.options.Name;
    if (logName === 'cloudwatch') {
        task.addToTaskRolePolicy(new iam.PolicyStatement({
            actions: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:DescribeLogStreams',
                'logs:PutLogEvents',
            ],
            resources: ['*'],
        }));
    }
    else if (logName === 'firehose') {
        task.addToTaskRolePolicy(new iam.PolicyStatement({
            actions: [
                'firehose:PutRecordBatch',
            ],
            resources: ['*'],
        }));
    }
    else if (logName === 'kinesis') {
        task.addToTaskRolePolicy(new iam.PolicyStatement({
            actions: [
                'kinesis:PutRecords',
            ],
            resources: ['*'],
        }));
    }
    const fluentBitImageTag = imageTag || 'latest';
    const fluentBitImage = `${fluentBitImageSSMPath}/${fluentBitImageTag}`;
    // Not use ContainerImage.fromEcrRepository since it's not support parsing ECR repo URI,
    // use repo ARN might result in complex Fn:: functions in cloudformation template.
    return container_image_1.ContainerImage.fromRegistry(ssm.StringParameter.valueForStringParameter(task, fluentBitImage));
}
exports.obtainDefaultFluentBitECRImage = obtainDefaultFluentBitECRImage;
/**
 * Firelens log router
 */
class FirelensLogRouter extends container_definition_1.ContainerDefinition {
    /**
     * Constructs a new instance of the FirelensLogRouter class.
     */
    constructor(scope, id, props) {
        super(scope, id, props);
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_FirelensLogRouterProps(props);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, FirelensLogRouter);
            }
            throw error;
        }
        const options = props.firelensConfig.options;
        if (options) {
            if ((options.configFileValue && options.configFileType === undefined) || (options.configFileValue === undefined && options.configFileType)) {
                throw new Error('configFileValue and configFileType must be set together to define a custom config source');
            }
            const hasConfig = (options.configFileValue !== undefined);
            const enableECSLogMetadata = options.enableECSLogMetadata || options.enableECSLogMetadata === undefined;
            const configFileType = (options.configFileType === undefined || options.configFileType === FirelensConfigFileType.S3) &&
                (cdk.Token.isUnresolved(options.configFileValue) || /arn:aws[a-zA-Z-]*:s3:::.+/.test(options.configFileValue || ''))
                ? FirelensConfigFileType.S3 : FirelensConfigFileType.FILE;
            this.firelensConfig = {
                type: props.firelensConfig.type,
                options: {
                    enableECSLogMetadata,
                    ...(hasConfig ? {
                        configFileType,
                        configFileValue: options.configFileValue,
                    } : {}),
                },
            };
            if (hasConfig) {
                // grant s3 access permissions
                if (configFileType === FirelensConfigFileType.S3) {
                    props.taskDefinition.addToExecutionRolePolicy(new iam.PolicyStatement({
                        actions: [
                            's3:GetObject',
                        ],
                        resources: [(options.configFileValue ?? '')],
                    }));
                    props.taskDefinition.addToExecutionRolePolicy(new iam.PolicyStatement({
                        actions: [
                            's3:GetBucketLocation',
                        ],
                        resources: [(options.configFileValue ?? '').split('/')[0]],
                    }));
                }
            }
        }
        else {
            this.firelensConfig = props.firelensConfig;
        }
    }
    /**
     * Render this container definition to a CloudFormation object
     */
    renderContainerDefinition(_taskDefinition) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ecs_TaskDefinition(_taskDefinition);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.renderContainerDefinition);
            }
            throw error;
        }
        return {
            ...(super.renderContainerDefinition()),
            firelensConfiguration: this.firelensConfig && renderFirelensConfig(this.firelensConfig),
        };
    }
}
exports.FirelensLogRouter = FirelensLogRouter;
_a = JSII_RTTI_SYMBOL_1;
FirelensLogRouter[_a] = { fqn: "@aws-cdk/aws-ecs.FirelensLogRouter", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlyZWxlbnMtbG9nLXJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImZpcmVsZW5zLWxvZy1yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsd0NBQXdDO0FBQ3hDLHdDQUF3QztBQUN4QyxxQ0FBcUM7QUFHckMsaUVBQW1IO0FBQ25ILHVEQUFtRDtBQUluRDs7O0dBR0c7QUFDSCxJQUFZLHFCQVVYO0FBVkQsV0FBWSxxQkFBcUI7SUFDL0I7O09BRUc7SUFDSCxnREFBdUIsQ0FBQTtJQUV2Qjs7T0FFRztJQUNILDRDQUFtQixDQUFBO0FBQ3JCLENBQUMsRUFWVyxxQkFBcUIsR0FBckIsNkJBQXFCLEtBQXJCLDZCQUFxQixRQVVoQztBQUVEOzs7R0FHRztBQUNILElBQVksc0JBVVg7QUFWRCxXQUFZLHNCQUFzQjtJQUNoQzs7T0FFRztJQUNILG1DQUFTLENBQUE7SUFFVDs7T0FFRztJQUNILHVDQUFhLENBQUE7QUFDZixDQUFDLEVBVlcsc0JBQXNCLEdBQXRCLDhCQUFzQixLQUF0Qiw4QkFBc0IsUUFVakM7QUF3RUQ7O0dBRUc7QUFDSCxTQUFTLG9CQUFvQixDQUFDLGNBQThCO0lBQzFELElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFO1FBQzNCLE9BQU8sRUFBRSxJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3RDO1NBQU0sSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLGVBQWUsS0FBSyxTQUFTLEVBQUU7UUFDL0QsK0VBQStFO1FBQy9FLHNDQUFzQztRQUN0Qyx5RUFBeUU7UUFDekUsT0FBTztZQUNMLElBQUksRUFBRSxjQUFjLENBQUMsSUFBSTtZQUN6QixPQUFPLEVBQUU7Z0JBQ1AseUJBQXlCLEVBQUUsY0FBYyxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPO2FBQzFGO1NBQ0YsQ0FBQztLQUNIO1NBQU07UUFDTCw2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QWUsQ0FBQzt3QkFDcEUsT0FBTyxFQUFFOzRCQUNQLGNBQWM7eUJBQ2Y7d0JBQ0QsU0FBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxDQUFDO3FCQUM3QyxDQUFDLENBQUMsQ0FBQztvQkFDSixLQUFLLENBQUMsY0FBYyxDQUFDLHdCQUF3QixDQUFDLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQzt3QkFDcEUsT0FBTyxFQUFFOzRCQUNQLHNCQUFzQjt5QkFDdkI7d0JBQ0QsU0FBUyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDM0QsQ0FBQyxDQUFDLENBQUM7aUJBQ0w7YUFDRjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQyxjQUFjLENBQUM7U0FDNUM7S0FDRjtJQUVEOztPQUVHO0lBQ0kseUJBQXlCLENBQUMsZUFBZ0M7Ozs7Ozs7Ozs7UUFDL0QsT0FBTztZQUNMLEdBQUcsQ0FBQyxLQUFLLENBQUMseUJBQXlCLEVBQUUsQ0FBQztZQUN0QyxxQkFBcUIsRUFBRSxJQUFJLENBQUMsY0FBYyxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUM7U0FDeEYsQ0FBQztLQUNIOztBQWpFSCw4Q0FrRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzc20gZnJvbSAnQGF3cy1jZGsvYXdzLXNzbSc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCB7IFRhc2tEZWZpbml0aW9uIH0gZnJvbSAnLi9iYXNlL3Rhc2stZGVmaW5pdGlvbic7XG5pbXBvcnQgeyBDb250YWluZXJEZWZpbml0aW9uLCBDb250YWluZXJEZWZpbml0aW9uT3B0aW9ucywgQ29udGFpbmVyRGVmaW5pdGlvblByb3BzIH0gZnJvbSAnLi9jb250YWluZXItZGVmaW5pdGlvbic7XG5pbXBvcnQgeyBDb250YWluZXJJbWFnZSB9IGZyb20gJy4vY29udGFpbmVyLWltYWdlJztcbmltcG9ydCB7IENmblRhc2tEZWZpbml0aW9uIH0gZnJvbSAnLi9lY3MuZ2VuZXJhdGVkJztcbmltcG9ydCB7IExvZ0RyaXZlckNvbmZpZyB9IGZyb20gJy4vbG9nLWRyaXZlcnMvbG9nLWRyaXZlcic7XG5cbi8qKlxuICogRmlyZWxlbnMgbG9nIHJvdXRlciB0eXBlLCBmbHVlbnRiaXQgb3IgZmx1ZW50ZC5cbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzaW5nX2ZpcmVsZW5zLmh0bWxcbiAqL1xuZXhwb3J0IGVudW0gRmlyZWxlbnNMb2dSb3V0ZXJUeXBlIHtcbiAgLyoqXG4gICAqIGZsdWVudGJpdFxuICAgKi9cbiAgRkxVRU5UQklUID0gJ2ZsdWVudGJpdCcsXG5cbiAgLyoqXG4gICAqIGZsdWVudGRcbiAgICovXG4gIEZMVUVOVEQgPSAnZmx1ZW50ZCcsXG59XG5cbi8qKlxuICogRmlyZWxlbnMgY29uZmlndXJhdGlvbiBmaWxlIHR5cGUsIHMzIG9yIGZpbGUgcGF0aC5cbiAqIGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9BbWF6b25FQ1MvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3VzaW5nX2ZpcmVsZW5zLmh0bWwjZmlyZWxlbnMtdGFza2RlZi1jdXN0b21jb25maWdcbiAqL1xuZXhwb3J0IGVudW0gRmlyZWxlbnNDb25maWdGaWxlVHlwZSB7XG4gIC8qKlxuICAgKiBzM1xuICAgKi9cbiAgUzMgPSAnczMnLFxuXG4gIC8qKlxuICAgKiBmbHVlbnRkXG4gICAqL1xuICBGSUxFID0gJ2ZpbGUnLFxufVxuXG4vKipcbiAqIFRoZSBvcHRpb25zIGZvciBmaXJlbGVucyBsb2cgcm91dGVyXG4gKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS91c2luZ19maXJlbGVucy5odG1sI2ZpcmVsZW5zLXRhc2tkZWYtY3VzdG9tY29uZmlnXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRmlyZWxlbnNPcHRpb25zIHtcbiAgLyoqXG4gICAqIEJ5IGRlZmF1bHQsIEFtYXpvbiBFQ1MgYWRkcyBhZGRpdGlvbmFsIGZpZWxkcyBpbiB5b3VyIGxvZyBlbnRyaWVzIHRoYXQgaGVscCBpZGVudGlmeSB0aGUgc291cmNlIG9mIHRoZSBsb2dzLlxuICAgKiBZb3UgY2FuIGRpc2FibGUgdGhpcyBhY3Rpb24gYnkgc2V0dGluZyBlbmFibGUtZWNzLWxvZy1tZXRhZGF0YSB0byBmYWxzZS5cbiAgICogQGRlZmF1bHQgLSB0cnVlXG4gICAqL1xuICByZWFkb25seSBlbmFibGVFQ1NMb2dNZXRhZGF0YT86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEN1c3RvbSBjb25maWd1cmF0aW9uIGZpbGUsIHMzIG9yIGZpbGUuXG4gICAqIEJvdGggY29uZmlnRmlsZVR5cGUgYW5kIGNvbmZpZ0ZpbGVWYWx1ZSBtdXN0IGJlIHVzZWQgdG9nZXRoZXJcbiAgICogdG8gZGVmaW5lIGEgY3VzdG9tIGNvbmZpZ3VyYXRpb24gc291cmNlLlxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGRldGVybWluZWQgYnkgY2hlY2tpbmcgY29uZmlnRmlsZVZhbHVlIHdpdGggUzMgQVJOLlxuICAgKi9cbiAgcmVhZG9ubHkgY29uZmlnRmlsZVR5cGU/OiBGaXJlbGVuc0NvbmZpZ0ZpbGVUeXBlO1xuXG4gIC8qKlxuICAgKiBDdXN0b20gY29uZmlndXJhdGlvbiBmaWxlLCBTMyBBUk4gb3IgYSBmaWxlIHBhdGhcbiAgICogQm90aCBjb25maWdGaWxlVHlwZSBhbmQgY29uZmlnRmlsZVZhbHVlIG11c3QgYmUgdXNlZCB0b2dldGhlclxuICAgKiB0byBkZWZpbmUgYSBjdXN0b20gY29uZmlndXJhdGlvbiBzb3VyY2UuXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm8gY29uZmlnIGZpbGUgdmFsdWVcbiAgICovXG4gIHJlYWRvbmx5IGNvbmZpZ0ZpbGVWYWx1ZT86IHN0cmluZztcbn1cblxuLyoqXG4gKiBGaXJlbGVucyBDb25maWd1cmF0aW9uXG4gKiBodHRwczovL2RvY3MuYXdzLmFtYXpvbi5jb20vQW1hem9uRUNTL2xhdGVzdC9kZXZlbG9wZXJndWlkZS91c2luZ19maXJlbGVucy5odG1sI2ZpcmVsZW5zLXRhc2tkZWZcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGaXJlbGVuc0NvbmZpZyB7XG5cbiAgLyoqXG4gICAqIFRoZSBsb2cgcm91dGVyIHRvIHVzZVxuICAgKiBAZGVmYXVsdCAtIGZsdWVudGJpdFxuICAgKi9cbiAgcmVhZG9ubHkgdHlwZTogRmlyZWxlbnNMb2dSb3V0ZXJUeXBlO1xuXG4gIC8qKlxuICAgKiBGaXJlbGVucyBvcHRpb25zXG4gICAqIEBkZWZhdWx0IC0gbm8gYWRkaXRpb25hbCBvcHRpb25zXG4gICAqL1xuICByZWFkb25seSBvcHRpb25zPzogRmlyZWxlbnNPcHRpb25zO1xufVxuXG4vKipcbiAqIFRoZSBwcm9wZXJ0aWVzIGluIGEgZmlyZWxlbnMgbG9nIHJvdXRlci5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGaXJlbGVuc0xvZ1JvdXRlclByb3BzIGV4dGVuZHMgQ29udGFpbmVyRGVmaW5pdGlvblByb3BzIHtcbiAgLyoqXG4gICAqIEZpcmVsZW5zIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIHJlYWRvbmx5IGZpcmVsZW5zQ29uZmlnOiBGaXJlbGVuc0NvbmZpZztcbn1cblxuLyoqXG4gKiBUaGUgb3B0aW9ucyBmb3IgY3JlYXRpbmcgYSBmaXJlbGVucyBsb2cgcm91dGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZpcmVsZW5zTG9nUm91dGVyRGVmaW5pdGlvbk9wdGlvbnMgZXh0ZW5kcyBDb250YWluZXJEZWZpbml0aW9uT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBGaXJlbGVucyBjb25maWd1cmF0aW9uXG4gICAqL1xuICByZWFkb25seSBmaXJlbGVuc0NvbmZpZzogRmlyZWxlbnNDb25maWc7XG59XG5cbi8qKlxuICogUmVuZGVyIHRvIENmblRhc2tEZWZpbml0aW9uLkZpcmVsZW5zQ29uZmlndXJhdGlvblByb3BlcnR5IGZyb20gRmlyZWxlbnNDb25maWdcbiAqL1xuZnVuY3Rpb24gcmVuZGVyRmlyZWxlbnNDb25maWcoZmlyZWxlbnNDb25maWc6IEZpcmVsZW5zQ29uZmlnKTogQ2ZuVGFza0RlZmluaXRpb24uRmlyZWxlbnNDb25maWd1cmF0aW9uUHJvcGVydHkge1xuICBpZiAoIWZpcmVsZW5zQ29uZmlnLm9wdGlvbnMpIHtcbiAgICByZXR1cm4geyB0eXBlOiBmaXJlbGVuc0NvbmZpZy50eXBlIH07XG4gIH0gZWxzZSBpZiAoZmlyZWxlbnNDb25maWcub3B0aW9ucy5jb25maWdGaWxlVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIGNvbmZpZyBmaWxlIG9wdGlvbnMgd29yayBhcyBhIHBhaXIgdG9nZXRoZXIgdG8gZGVmaW5lIGEgY3VzdG9tIGNvbmZpZyBzb3VyY2VcbiAgICAvLyBhIGN1c3RvbSBjb25maWcgc291cmNlIGlzIG9wdGlvbmFsLFxuICAgIC8vIGFuZCB0aHVzIHRoZSBgY29uZmlnLWZpbGUteGAga2V5cyBzaG91bGQgYmUgc2V0IHRvZ2V0aGVyIG9yIG5vdCBhdCBhbGxcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogZmlyZWxlbnNDb25maWcudHlwZSxcbiAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgJ2VuYWJsZS1lY3MtbG9nLW1ldGFkYXRhJzogZmlyZWxlbnNDb25maWcub3B0aW9ucy5lbmFibGVFQ1NMb2dNZXRhZGF0YSA/ICd0cnVlJyA6ICdmYWxzZScsXG4gICAgICB9LFxuICAgIH07XG4gIH0gZWxzZSB7XG4gICAgLy8gZmlyZWxlbnNDb25maWcub3B0aW9ucy5jb25maWdGaWxlVHlwZSBoYXMgYmVlbiBmaWxsZWQgd2l0aCBzMyBvciBmaWxlIHR5cGUgaW4gY29uc3RydWN0b3IuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6IGZpcmVsZW5zQ29uZmlnLnR5cGUsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgICdlbmFibGUtZWNzLWxvZy1tZXRhZGF0YSc6IGZpcmVsZW5zQ29uZmlnLm9wdGlvbnMuZW5hYmxlRUNTTG9nTWV0YWRhdGEgPyAndHJ1ZScgOiAnZmFsc2UnLFxuICAgICAgICAnY29uZmlnLWZpbGUtdHlwZSc6IGZpcmVsZW5zQ29uZmlnLm9wdGlvbnMuY29uZmlnRmlsZVR5cGUhLFxuICAgICAgICAnY29uZmlnLWZpbGUtdmFsdWUnOiBmaXJlbGVuc0NvbmZpZy5vcHRpb25zLmNvbmZpZ0ZpbGVWYWx1ZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG59XG5cbi8qKlxuICogU1NNIHBhcmFtZXRlcnMgZm9yIGxhdGVzdCBmbHVlbnQgYml0IGRvY2tlciBpbWFnZSBpbiBFQ1JcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9hd3MvYXdzLWZvci1mbHVlbnQtYml0I3VzaW5nLXNzbS10by1maW5kLWF2YWlsYWJsZS12ZXJzaW9uc1xuICovXG5jb25zdCBmbHVlbnRCaXRJbWFnZVNTTVBhdGggPSAnL2F3cy9zZXJ2aWNlL2F3cy1mb3ItZmx1ZW50LWJpdCc7XG5cbi8qKlxuICogT2J0YWluIEZsdWVudCBCaXQgaW1hZ2UgaW4gQW1hem9uIEVDUiBhbmQgc2V0dXAgY29ycmVzcG9uZGluZyBJQU0gcGVybWlzc2lvbnMuXG4gKiBFQ1IgaW1hZ2UgcHVsbCBwZXJtaXNzaW9ucyB3aWxsIGJlIGdyYW50ZWQgaW4gdGFzayBleGVjdXRpb24gcm9sZS5cbiAqIENsb3Vkd2F0Y2ggbG9ncywgS2luZXNpcyBkYXRhIHN0cmVhbSBvciBmaXJlaG9zZSBwZXJtaXNzaW9ucyB3aWxsIGJlIGdyYW50IGJ5IGNoZWNrIG9wdGlvbnMgaW4gbG9nRHJpdmVyQ29uZmlnLlxuICogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL0FtYXpvbkVDUy9sYXRlc3QvZGV2ZWxvcGVyZ3VpZGUvdXNpbmdfZmlyZWxlbnMuaHRtbCNmaXJlbGVucy11c2luZy1mbHVlbnRiaXRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9idGFpbkRlZmF1bHRGbHVlbnRCaXRFQ1JJbWFnZSh0YXNrOiBUYXNrRGVmaW5pdGlvbiwgbG9nRHJpdmVyQ29uZmlnPzogTG9nRHJpdmVyQ29uZmlnLCBpbWFnZVRhZz86IHN0cmluZyk6IENvbnRhaW5lckltYWdlIHtcbiAgLy8gZ3JhbnQgRUNSIGltYWdlIHB1bGwgcGVybWlzc2lvbnMgdG8gZXhlY3V0b3Igcm9sZVxuICB0YXNrLmFkZFRvRXhlY3V0aW9uUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgYWN0aW9uczogW1xuICAgICAgJ2VjcjpHZXRBdXRob3JpemF0aW9uVG9rZW4nLFxuICAgICAgJ2VjcjpCYXRjaENoZWNrTGF5ZXJBdmFpbGFiaWxpdHknLFxuICAgICAgJ2VjcjpHZXREb3dubG9hZFVybEZvckxheWVyJyxcbiAgICAgICdlY3I6QmF0Y2hHZXRJbWFnZScsXG4gICAgXSxcbiAgICByZXNvdXJjZXM6IFsnKiddLFxuICB9KSk7XG5cbiAgLy8gZ3JhbnQgY2xvdWR3YXRjaCBvciBmaXJlaG9zZSBwZXJtaXNzaW9ucyB0byB0YXNrIHJvbGVcbiAgY29uc3QgbG9nTmFtZSA9IGxvZ0RyaXZlckNvbmZpZyAmJiBsb2dEcml2ZXJDb25maWcubG9nRHJpdmVyID09PSAnYXdzZmlyZWxlbnMnXG4gICAgJiYgbG9nRHJpdmVyQ29uZmlnLm9wdGlvbnMgJiYgbG9nRHJpdmVyQ29uZmlnLm9wdGlvbnMuTmFtZTtcbiAgaWYgKGxvZ05hbWUgPT09ICdjbG91ZHdhdGNoJykge1xuICAgIHRhc2suYWRkVG9UYXNrUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICBhY3Rpb25zOiBbXG4gICAgICAgICdsb2dzOkNyZWF0ZUxvZ0dyb3VwJyxcbiAgICAgICAgJ2xvZ3M6Q3JlYXRlTG9nU3RyZWFtJyxcbiAgICAgICAgJ2xvZ3M6RGVzY3JpYmVMb2dTdHJlYW1zJyxcbiAgICAgICAgJ2xvZ3M6UHV0TG9nRXZlbnRzJyxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIH0pKTtcbiAgfSBlbHNlIGlmIChsb2dOYW1lID09PSAnZmlyZWhvc2UnKSB7XG4gICAgdGFzay5hZGRUb1Rhc2tSb2xlUG9saWN5KG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgICAgIGFjdGlvbnM6IFtcbiAgICAgICAgJ2ZpcmVob3NlOlB1dFJlY29yZEJhdGNoJyxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIH0pKTtcbiAgfSBlbHNlIGlmIChsb2dOYW1lID09PSAna2luZXNpcycpIHtcbiAgICB0YXNrLmFkZFRvVGFza1JvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW1xuICAgICAgICAna2luZXNpczpQdXRSZWNvcmRzJyxcbiAgICAgIF0sXG4gICAgICByZXNvdXJjZXM6IFsnKiddLFxuICAgIH0pKTtcbiAgfVxuXG4gIGNvbnN0IGZsdWVudEJpdEltYWdlVGFnID0gaW1hZ2VUYWcgfHwgJ2xhdGVzdCc7XG4gIGNvbnN0IGZsdWVudEJpdEltYWdlID0gYCR7Zmx1ZW50Qml0SW1hZ2VTU01QYXRofS8ke2ZsdWVudEJpdEltYWdlVGFnfWA7XG5cbiAgLy8gTm90IHVzZSBDb250YWluZXJJbWFnZS5mcm9tRWNyUmVwb3NpdG9yeSBzaW5jZSBpdCdzIG5vdCBzdXBwb3J0IHBhcnNpbmcgRUNSIHJlcG8gVVJJLFxuICAvLyB1c2UgcmVwbyBBUk4gbWlnaHQgcmVzdWx0IGluIGNvbXBsZXggRm46OiBmdW5jdGlvbnMgaW4gY2xvdWRmb3JtYXRpb24gdGVtcGxhdGUuXG4gIHJldHVybiBDb250YWluZXJJbWFnZS5mcm9tUmVnaXN0cnkoc3NtLlN0cmluZ1BhcmFtZXRlci52YWx1ZUZvclN0cmluZ1BhcmFtZXRlcih0YXNrLCBmbHVlbnRCaXRJbWFnZSkpO1xufVxuXG4vKipcbiAqIEZpcmVsZW5zIGxvZyByb3V0ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIEZpcmVsZW5zTG9nUm91dGVyIGV4dGVuZHMgQ29udGFpbmVyRGVmaW5pdGlvbiB7XG5cbiAgLyoqXG4gICAqIEZpcmVsZW5zIGNvbmZpZ3VyYXRpb25cbiAgICovXG4gIHB1YmxpYyByZWFkb25seSBmaXJlbGVuc0NvbmZpZzogRmlyZWxlbnNDb25maWc7XG5cbiAgLyoqXG4gICAqIENvbnN0cnVjdHMgYSBuZXcgaW5zdGFuY2Ugb2YgdGhlIEZpcmVsZW5zTG9nUm91dGVyIGNsYXNzLlxuICAgKi9cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEZpcmVsZW5zTG9nUm91dGVyUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcbiAgICBjb25zdCBvcHRpb25zID0gcHJvcHMuZmlyZWxlbnNDb25maWcub3B0aW9ucztcbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgaWYgKChvcHRpb25zLmNvbmZpZ0ZpbGVWYWx1ZSAmJiBvcHRpb25zLmNvbmZpZ0ZpbGVUeXBlID09PSB1bmRlZmluZWQpIHx8IChvcHRpb25zLmNvbmZpZ0ZpbGVWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIG9wdGlvbnMuY29uZmlnRmlsZVR5cGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignY29uZmlnRmlsZVZhbHVlIGFuZCBjb25maWdGaWxlVHlwZSBtdXN0IGJlIHNldCB0b2dldGhlciB0byBkZWZpbmUgYSBjdXN0b20gY29uZmlnIHNvdXJjZScpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBoYXNDb25maWcgPSAob3B0aW9ucy5jb25maWdGaWxlVmFsdWUgIT09IHVuZGVmaW5lZCk7XG4gICAgICBjb25zdCBlbmFibGVFQ1NMb2dNZXRhZGF0YSA9IG9wdGlvbnMuZW5hYmxlRUNTTG9nTWV0YWRhdGEgfHwgb3B0aW9ucy5lbmFibGVFQ1NMb2dNZXRhZGF0YSA9PT0gdW5kZWZpbmVkO1xuICAgICAgY29uc3QgY29uZmlnRmlsZVR5cGUgPSAob3B0aW9ucy5jb25maWdGaWxlVHlwZSA9PT0gdW5kZWZpbmVkIHx8IG9wdGlvbnMuY29uZmlnRmlsZVR5cGUgPT09IEZpcmVsZW5zQ29uZmlnRmlsZVR5cGUuUzMpICYmXG4gICAgICAgIChjZGsuVG9rZW4uaXNVbnJlc29sdmVkKG9wdGlvbnMuY29uZmlnRmlsZVZhbHVlKSB8fCAvYXJuOmF3c1thLXpBLVotXSo6czM6OjouKy8udGVzdChvcHRpb25zLmNvbmZpZ0ZpbGVWYWx1ZSB8fCAnJykpXG4gICAgICAgID8gRmlyZWxlbnNDb25maWdGaWxlVHlwZS5TMyA6IEZpcmVsZW5zQ29uZmlnRmlsZVR5cGUuRklMRTtcblxuICAgICAgdGhpcy5maXJlbGVuc0NvbmZpZyA9IHtcbiAgICAgICAgdHlwZTogcHJvcHMuZmlyZWxlbnNDb25maWcudHlwZSxcbiAgICAgICAgb3B0aW9uczoge1xuICAgICAgICAgIGVuYWJsZUVDU0xvZ01ldGFkYXRhLFxuICAgICAgICAgIC4uLihoYXNDb25maWcgPyB7XG4gICAgICAgICAgICBjb25maWdGaWxlVHlwZSxcbiAgICAgICAgICAgIGNvbmZpZ0ZpbGVWYWx1ZTogb3B0aW9ucy5jb25maWdGaWxlVmFsdWUsXG4gICAgICAgICAgfSA6IHt9KSxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIGlmIChoYXNDb25maWcpIHtcbiAgICAgICAgLy8gZ3JhbnQgczMgYWNjZXNzIHBlcm1pc3Npb25zXG4gICAgICAgIGlmIChjb25maWdGaWxlVHlwZSA9PT0gRmlyZWxlbnNDb25maWdGaWxlVHlwZS5TMykge1xuICAgICAgICAgIHByb3BzLnRhc2tEZWZpbml0aW9uLmFkZFRvRXhlY3V0aW9uUm9sZVBvbGljeShuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgICdzMzpHZXRPYmplY3QnLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJlc291cmNlczogWyhvcHRpb25zLmNvbmZpZ0ZpbGVWYWx1ZSA/PyAnJyldLFxuICAgICAgICAgIH0pKTtcbiAgICAgICAgICBwcm9wcy50YXNrRGVmaW5pdGlvbi5hZGRUb0V4ZWN1dGlvblJvbGVQb2xpY3kobmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICAnczM6R2V0QnVja2V0TG9jYXRpb24nLFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIHJlc291cmNlczogWyhvcHRpb25zLmNvbmZpZ0ZpbGVWYWx1ZSA/PyAnJykuc3BsaXQoJy8nKVswXV0sXG4gICAgICAgICAgfSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlyZWxlbnNDb25maWcgPSBwcm9wcy5maXJlbGVuc0NvbmZpZztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVuZGVyIHRoaXMgY29udGFpbmVyIGRlZmluaXRpb24gdG8gYSBDbG91ZEZvcm1hdGlvbiBvYmplY3RcbiAgICovXG4gIHB1YmxpYyByZW5kZXJDb250YWluZXJEZWZpbml0aW9uKF90YXNrRGVmaW5pdGlvbj86IFRhc2tEZWZpbml0aW9uKTogQ2ZuVGFza0RlZmluaXRpb24uQ29udGFpbmVyRGVmaW5pdGlvblByb3BlcnR5IHtcbiAgICByZXR1cm4ge1xuICAgICAgLi4uKHN1cGVyLnJlbmRlckNvbnRhaW5lckRlZmluaXRpb24oKSksXG4gICAgICBmaXJlbGVuc0NvbmZpZ3VyYXRpb246IHRoaXMuZmlyZWxlbnNDb25maWcgJiYgcmVuZGVyRmlyZWxlbnNDb25maWcodGhpcy5maXJlbGVuc0NvbmZpZyksXG4gICAgfTtcbiAgfVxufVxuIl19