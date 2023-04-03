function _aws_cdk_aws_events_targets_BatchJobProps(p) {
}
function _aws_cdk_aws_events_targets_BatchJob(p) {
}
function _aws_cdk_aws_events_targets_CodePipelineTargetOptions(p) {
}
function _aws_cdk_aws_events_targets_CodePipeline(p) {
}
function _aws_cdk_aws_events_targets_SnsTopicProps(p) {
}
function _aws_cdk_aws_events_targets_SnsTopic(p) {
}
function _aws_cdk_aws_events_targets_SqsQueueProps(p) {
}
function _aws_cdk_aws_events_targets_SqsQueue(p) {
}
function _aws_cdk_aws_events_targets_CodeBuildProjectProps(p) {
}
function _aws_cdk_aws_events_targets_CodeBuildProject(p) {
}
function _aws_cdk_aws_events_targets_AwsApiInput(p) {
}
function _aws_cdk_aws_events_targets_AwsApiProps(p) {
}
function _aws_cdk_aws_events_targets_AwsApi(p) {
}
function _aws_cdk_aws_events_targets_LambdaFunctionProps(p) {
}
function _aws_cdk_aws_events_targets_LambdaFunction(p) {
}
function _aws_cdk_aws_events_targets_ContainerOverride(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.environment != null)
            for (const o of p.environment)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_events_targets_TaskEnvironmentVariable(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_events_targets_TaskEnvironmentVariable(p) {
}
function _aws_cdk_aws_events_targets_EcsTaskProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.containerOverrides != null)
            for (const o of p.containerOverrides)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_events_targets_ContainerOverride(o);
        if ("securityGroup" in p)
            print("@aws-cdk/aws-events-targets.EcsTaskProps#securityGroup", "use securityGroups instead");
        if (p.securityGroups != null)
            for (const o of p.securityGroups)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-ec2/.warnings.jsii.js")._aws_cdk_aws_ec2_ISecurityGroup(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_events_targets_EcsTask(p) {
}
function _aws_cdk_aws_events_targets_EventBusProps(p) {
}
function _aws_cdk_aws_events_targets_EventBus(p) {
}
function _aws_cdk_aws_events_targets_SfnStateMachineProps(p) {
}
function _aws_cdk_aws_events_targets_SfnStateMachine(p) {
}
function _aws_cdk_aws_events_targets_KinesisStreamProps(p) {
}
function _aws_cdk_aws_events_targets_KinesisStream(p) {
}
function _aws_cdk_aws_events_targets_LogGroupTargetInputOptions(p) {
}
function _aws_cdk_aws_events_targets_LogGroupTargetInput(p) {
}
function _aws_cdk_aws_events_targets_LogGroupProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("event" in p)
            print("@aws-cdk/aws-events-targets.LogGroupProps#event", "use logEvent instead");
        if (!visitedObjects.has(p.logEvent))
            _aws_cdk_aws_events_targets_LogGroupTargetInput(p.logEvent);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_events_targets_CloudWatchLogGroup(p) {
}
function _aws_cdk_aws_events_targets_KinesisFirehoseStreamProps(p) {
}
function _aws_cdk_aws_events_targets_KinesisFirehoseStream(p) {
}
function _aws_cdk_aws_events_targets_ApiGatewayProps(p) {
}
function _aws_cdk_aws_events_targets_ApiGateway(p) {
}
function _aws_cdk_aws_events_targets_ApiDestinationProps(p) {
}
function _aws_cdk_aws_events_targets_ApiDestination(p) {
}
function _aws_cdk_aws_events_targets_TargetBaseProps(p) {
}
function print(name, deprecationMessage) {
    const deprecated = process.env.JSII_DEPRECATED;
    const deprecationMode = ["warn", "fail", "quiet"].includes(deprecated) ? deprecated : "warn";
    const message = `${name} is deprecated.\n  ${deprecationMessage.trim()}\n  This API will be removed in the next major release.`;
    switch (deprecationMode) {
        case "fail":
            throw new DeprecationError(message);
        case "warn":
            console.warn("[WARNING]", message);
            break;
    }
}
function getPropertyDescriptor(obj, prop) {
    const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
    if (descriptor) {
        return descriptor;
    }
    const proto = Object.getPrototypeOf(obj);
    const prototypeDescriptor = proto && getPropertyDescriptor(proto, prop);
    if (prototypeDescriptor) {
        return prototypeDescriptor;
    }
    return {};
}
const visitedObjects = new Set();
class DeprecationError extends Error {
    constructor(...args) {
        super(...args);
        Object.defineProperty(this, "name", {
            configurable: false,
            enumerable: true,
            value: "DeprecationError",
            writable: false,
        });
    }
}
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_events_targets_BatchJobProps, _aws_cdk_aws_events_targets_BatchJob, _aws_cdk_aws_events_targets_CodePipelineTargetOptions, _aws_cdk_aws_events_targets_CodePipeline, _aws_cdk_aws_events_targets_SnsTopicProps, _aws_cdk_aws_events_targets_SnsTopic, _aws_cdk_aws_events_targets_SqsQueueProps, _aws_cdk_aws_events_targets_SqsQueue, _aws_cdk_aws_events_targets_CodeBuildProjectProps, _aws_cdk_aws_events_targets_CodeBuildProject, _aws_cdk_aws_events_targets_AwsApiInput, _aws_cdk_aws_events_targets_AwsApiProps, _aws_cdk_aws_events_targets_AwsApi, _aws_cdk_aws_events_targets_LambdaFunctionProps, _aws_cdk_aws_events_targets_LambdaFunction, _aws_cdk_aws_events_targets_ContainerOverride, _aws_cdk_aws_events_targets_TaskEnvironmentVariable, _aws_cdk_aws_events_targets_EcsTaskProps, _aws_cdk_aws_events_targets_EcsTask, _aws_cdk_aws_events_targets_EventBusProps, _aws_cdk_aws_events_targets_EventBus, _aws_cdk_aws_events_targets_SfnStateMachineProps, _aws_cdk_aws_events_targets_SfnStateMachine, _aws_cdk_aws_events_targets_KinesisStreamProps, _aws_cdk_aws_events_targets_KinesisStream, _aws_cdk_aws_events_targets_LogGroupTargetInputOptions, _aws_cdk_aws_events_targets_LogGroupTargetInput, _aws_cdk_aws_events_targets_LogGroupProps, _aws_cdk_aws_events_targets_CloudWatchLogGroup, _aws_cdk_aws_events_targets_KinesisFirehoseStreamProps, _aws_cdk_aws_events_targets_KinesisFirehoseStream, _aws_cdk_aws_events_targets_ApiGatewayProps, _aws_cdk_aws_events_targets_ApiGateway, _aws_cdk_aws_events_targets_ApiDestinationProps, _aws_cdk_aws_events_targets_ApiDestination, _aws_cdk_aws_events_targets_TargetBaseProps };
