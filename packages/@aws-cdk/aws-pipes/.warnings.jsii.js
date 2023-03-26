function _aws_cdk_aws_pipes_CfnPipeProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.enrichmentParameters))
            _aws_cdk_aws_pipes_CfnPipe_PipeEnrichmentParametersProperty(p.enrichmentParameters);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_pipes_CfnPipe(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_AwsVpcConfigurationProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_BatchArrayPropertiesProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_BatchContainerOverridesProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_BatchEnvironmentVariableProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_BatchJobDependencyProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_BatchResourceRequirementProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_BatchRetryStrategyProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_CapacityProviderStrategyItemProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_DeadLetterConfigProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_EcsContainerOverrideProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_EcsEnvironmentFileProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_EcsEnvironmentVariableProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_EcsEphemeralStorageProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_EcsInferenceAcceleratorOverrideProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_EcsResourceRequirementProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_EcsTaskOverrideProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_FilterProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_FilterCriteriaProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_MQBrokerAccessCredentialsProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_MSKAccessCredentialsProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_NetworkConfigurationProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeEnrichmentHttpParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeEnrichmentParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeSourceActiveMQBrokerParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeSourceDynamoDBStreamParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeSourceKinesisStreamParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeSourceManagedStreamingKafkaParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeSourceParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeSourceRabbitMQBrokerParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeSourceSelfManagedKafkaParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeSourceSqsQueueParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeTargetBatchJobParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeTargetCloudWatchLogsParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeTargetEcsTaskParametersProperty(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/core/.warnings.jsii.js")._aws_cdk_core_CfnTag(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_pipes_CfnPipe_PipeTargetEventBridgeEventBusParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeTargetHttpParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeTargetKinesisStreamParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeTargetLambdaFunctionParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeTargetParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeTargetRedshiftDataParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeTargetSageMakerPipelineParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeTargetSqsQueueParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PipeTargetStateMachineParametersProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PlacementConstraintProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_PlacementStrategyProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_SageMakerPipelineParameterProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_SelfManagedKafkaAccessConfigurationCredentialsProperty(p) {
}
function _aws_cdk_aws_pipes_CfnPipe_SelfManagedKafkaAccessConfigurationVpcProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_pipes_CfnPipeProps, _aws_cdk_aws_pipes_CfnPipe, _aws_cdk_aws_pipes_CfnPipe_AwsVpcConfigurationProperty, _aws_cdk_aws_pipes_CfnPipe_BatchArrayPropertiesProperty, _aws_cdk_aws_pipes_CfnPipe_BatchContainerOverridesProperty, _aws_cdk_aws_pipes_CfnPipe_BatchEnvironmentVariableProperty, _aws_cdk_aws_pipes_CfnPipe_BatchJobDependencyProperty, _aws_cdk_aws_pipes_CfnPipe_BatchResourceRequirementProperty, _aws_cdk_aws_pipes_CfnPipe_BatchRetryStrategyProperty, _aws_cdk_aws_pipes_CfnPipe_CapacityProviderStrategyItemProperty, _aws_cdk_aws_pipes_CfnPipe_DeadLetterConfigProperty, _aws_cdk_aws_pipes_CfnPipe_EcsContainerOverrideProperty, _aws_cdk_aws_pipes_CfnPipe_EcsEnvironmentFileProperty, _aws_cdk_aws_pipes_CfnPipe_EcsEnvironmentVariableProperty, _aws_cdk_aws_pipes_CfnPipe_EcsEphemeralStorageProperty, _aws_cdk_aws_pipes_CfnPipe_EcsInferenceAcceleratorOverrideProperty, _aws_cdk_aws_pipes_CfnPipe_EcsResourceRequirementProperty, _aws_cdk_aws_pipes_CfnPipe_EcsTaskOverrideProperty, _aws_cdk_aws_pipes_CfnPipe_FilterProperty, _aws_cdk_aws_pipes_CfnPipe_FilterCriteriaProperty, _aws_cdk_aws_pipes_CfnPipe_MQBrokerAccessCredentialsProperty, _aws_cdk_aws_pipes_CfnPipe_MSKAccessCredentialsProperty, _aws_cdk_aws_pipes_CfnPipe_NetworkConfigurationProperty, _aws_cdk_aws_pipes_CfnPipe_PipeEnrichmentHttpParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeEnrichmentParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeSourceActiveMQBrokerParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeSourceDynamoDBStreamParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeSourceKinesisStreamParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeSourceManagedStreamingKafkaParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeSourceParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeSourceRabbitMQBrokerParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeSourceSelfManagedKafkaParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeSourceSqsQueueParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeTargetBatchJobParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeTargetCloudWatchLogsParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeTargetEcsTaskParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeTargetEventBridgeEventBusParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeTargetHttpParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeTargetKinesisStreamParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeTargetLambdaFunctionParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeTargetParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeTargetRedshiftDataParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeTargetSageMakerPipelineParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeTargetSqsQueueParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PipeTargetStateMachineParametersProperty, _aws_cdk_aws_pipes_CfnPipe_PlacementConstraintProperty, _aws_cdk_aws_pipes_CfnPipe_PlacementStrategyProperty, _aws_cdk_aws_pipes_CfnPipe_SageMakerPipelineParameterProperty, _aws_cdk_aws_pipes_CfnPipe_SelfManagedKafkaAccessConfigurationCredentialsProperty, _aws_cdk_aws_pipes_CfnPipe_SelfManagedKafkaAccessConfigurationVpcProperty };
