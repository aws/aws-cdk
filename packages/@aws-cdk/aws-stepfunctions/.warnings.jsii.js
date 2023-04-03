function _aws_cdk_aws_stepfunctions_JsonPath(p) {
}
function _aws_cdk_aws_stepfunctions_Data(p) {
}
function _aws_cdk_aws_stepfunctions_Context(p) {
}
function _aws_cdk_aws_stepfunctions_FieldUtils(p) {
}
function _aws_cdk_aws_stepfunctions_ActivityProps(p) {
}
function _aws_cdk_aws_stepfunctions_Activity(p) {
}
function _aws_cdk_aws_stepfunctions_IActivity(p) {
}
function _aws_cdk_aws_stepfunctions_TaskInput(p) {
}
function _aws_cdk_aws_stepfunctions_InputType(p) {
}
function _aws_cdk_aws_stepfunctions_INextable(p) {
}
function _aws_cdk_aws_stepfunctions_IChainable(p) {
}
function _aws_cdk_aws_stepfunctions_Errors(p) {
}
function _aws_cdk_aws_stepfunctions_RetryProps(p) {
}
function _aws_cdk_aws_stepfunctions_CatchProps(p) {
}
function _aws_cdk_aws_stepfunctions_Condition(p) {
}
function _aws_cdk_aws_stepfunctions_StateMachineType(p) {
}
function _aws_cdk_aws_stepfunctions_LogLevel(p) {
}
function _aws_cdk_aws_stepfunctions_LogOptions(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.level))
            _aws_cdk_aws_stepfunctions_LogLevel(p.level);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_stepfunctions_StateMachineProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.definition))
            _aws_cdk_aws_stepfunctions_IChainable(p.definition);
        if (!visitedObjects.has(p.logs))
            _aws_cdk_aws_stepfunctions_LogOptions(p.logs);
        if (!visitedObjects.has(p.stateMachineType))
            _aws_cdk_aws_stepfunctions_StateMachineType(p.stateMachineType);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_stepfunctions_StateMachine(p) {
}
function _aws_cdk_aws_stepfunctions_IStateMachine(p) {
}
function _aws_cdk_aws_stepfunctions_StateMachineFragment(p) {
}
function _aws_cdk_aws_stepfunctions_SingleStateOptions(p) {
}
function _aws_cdk_aws_stepfunctions_StateTransitionMetric(p) {
}
function _aws_cdk_aws_stepfunctions_Chain(p) {
}
function _aws_cdk_aws_stepfunctions_StateGraph(p) {
}
function _aws_cdk_aws_stepfunctions_IStepFunctionsTask(p) {
}
function _aws_cdk_aws_stepfunctions_StepFunctionsTaskConfig(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("resourceArn" in p)
            print("@aws-cdk/aws-stepfunctions.StepFunctionsTaskConfig#resourceArn", "used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`.");
        if ("heartbeat" in p)
            print("@aws-cdk/aws-stepfunctions.StepFunctionsTaskConfig#heartbeat", "used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`.");
        if ("metricDimensions" in p)
            print("@aws-cdk/aws-stepfunctions.StepFunctionsTaskConfig#metricDimensions", "used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`.");
        if ("metricPrefixPlural" in p)
            print("@aws-cdk/aws-stepfunctions.StepFunctionsTaskConfig#metricPrefixPlural", "used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`.");
        if ("metricPrefixSingular" in p)
            print("@aws-cdk/aws-stepfunctions.StepFunctionsTaskConfig#metricPrefixSingular", "used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`.");
        if ("parameters" in p)
            print("@aws-cdk/aws-stepfunctions.StepFunctionsTaskConfig#parameters", "used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`.");
        if ("policyStatements" in p)
            print("@aws-cdk/aws-stepfunctions.StepFunctionsTaskConfig#policyStatements", "used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`.");
        if (p.policyStatements != null)
            for (const o of p.policyStatements)
                if (!visitedObjects.has(o))
                    require("@aws-cdk/aws-iam/.warnings.jsii.js")._aws_cdk_aws_iam_PolicyStatement(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_stepfunctions_ServiceIntegrationPattern(p) {
}
function _aws_cdk_aws_stepfunctions_ChoiceProps(p) {
}
function _aws_cdk_aws_stepfunctions_Choice(p) {
}
function _aws_cdk_aws_stepfunctions_AfterwardsOptions(p) {
}
function _aws_cdk_aws_stepfunctions_FailProps(p) {
}
function _aws_cdk_aws_stepfunctions_Fail(p) {
}
function _aws_cdk_aws_stepfunctions_ParallelProps(p) {
}
function _aws_cdk_aws_stepfunctions_Parallel(p) {
}
function _aws_cdk_aws_stepfunctions_Result(p) {
}
function _aws_cdk_aws_stepfunctions_PassProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.result))
            _aws_cdk_aws_stepfunctions_Result(p.result);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_stepfunctions_Pass(p) {
}
function _aws_cdk_aws_stepfunctions_StateProps(p) {
}
function _aws_cdk_aws_stepfunctions_State(p) {
}
function _aws_cdk_aws_stepfunctions_FindStateOptions(p) {
}
function _aws_cdk_aws_stepfunctions_SucceedProps(p) {
}
function _aws_cdk_aws_stepfunctions_Succeed(p) {
}
function _aws_cdk_aws_stepfunctions_TaskProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if ("task" in p)
            print("@aws-cdk/aws-stepfunctions.TaskProps#task", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        if (!visitedObjects.has(p.task))
            _aws_cdk_aws_stepfunctions_IStepFunctionsTask(p.task);
        if ("comment" in p)
            print("@aws-cdk/aws-stepfunctions.TaskProps#comment", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        if ("inputPath" in p)
            print("@aws-cdk/aws-stepfunctions.TaskProps#inputPath", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        if ("outputPath" in p)
            print("@aws-cdk/aws-stepfunctions.TaskProps#outputPath", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        if ("parameters" in p)
            print("@aws-cdk/aws-stepfunctions.TaskProps#parameters", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        if ("resultPath" in p)
            print("@aws-cdk/aws-stepfunctions.TaskProps#resultPath", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
        if ("timeout" in p)
            print("@aws-cdk/aws-stepfunctions.TaskProps#timeout", "- replaced by service integration specific classes (i.e. LambdaInvoke, SnsPublish)");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_stepfunctions_Task(p) {
}
function _aws_cdk_aws_stepfunctions_WaitTime(p) {
}
function _aws_cdk_aws_stepfunctions_WaitProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.time))
            _aws_cdk_aws_stepfunctions_WaitTime(p.time);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_stepfunctions_Wait(p) {
}
function _aws_cdk_aws_stepfunctions_MapProps(p) {
}
function _aws_cdk_aws_stepfunctions_Map(p) {
}
function _aws_cdk_aws_stepfunctions_CustomStateProps(p) {
}
function _aws_cdk_aws_stepfunctions_CustomState(p) {
}
function _aws_cdk_aws_stepfunctions_TaskStateBaseProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.credentials))
            _aws_cdk_aws_stepfunctions_Credentials(p.credentials);
        if ("heartbeat" in p)
            print("@aws-cdk/aws-stepfunctions.TaskStateBaseProps#heartbeat", "use `heartbeatTimeout`");
        if (!visitedObjects.has(p.heartbeatTimeout))
            _aws_cdk_aws_stepfunctions_Timeout(p.heartbeatTimeout);
        if (!visitedObjects.has(p.integrationPattern))
            _aws_cdk_aws_stepfunctions_IntegrationPattern(p.integrationPattern);
        if (!visitedObjects.has(p.taskTimeout))
            _aws_cdk_aws_stepfunctions_Timeout(p.taskTimeout);
        if ("timeout" in p)
            print("@aws-cdk/aws-stepfunctions.TaskStateBaseProps#timeout", "use `taskTimeout`");
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_stepfunctions_TaskStateBase(p) {
}
function _aws_cdk_aws_stepfunctions_TaskMetricsConfig(p) {
}
function _aws_cdk_aws_stepfunctions_IntegrationPattern(p) {
}
function _aws_cdk_aws_stepfunctions_Timeout(p) {
}
function _aws_cdk_aws_stepfunctions_Credentials(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (!visitedObjects.has(p.role))
            _aws_cdk_aws_stepfunctions_TaskRole(p.role);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_stepfunctions_TaskRole(p) {
}
function _aws_cdk_aws_stepfunctions_CfnActivityProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_stepfunctions_CfnActivity_TagsEntryProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_stepfunctions_CfnActivity(p) {
}
function _aws_cdk_aws_stepfunctions_CfnActivity_TagsEntryProperty(p) {
}
function _aws_cdk_aws_stepfunctions_CfnStateMachineProps(p) {
    if (p == null)
        return;
    visitedObjects.add(p);
    try {
        if (p.tags != null)
            for (const o of p.tags)
                if (!visitedObjects.has(o))
                    _aws_cdk_aws_stepfunctions_CfnStateMachine_TagsEntryProperty(o);
    }
    finally {
        visitedObjects.delete(p);
    }
}
function _aws_cdk_aws_stepfunctions_CfnStateMachine(p) {
}
function _aws_cdk_aws_stepfunctions_CfnStateMachine_CloudWatchLogsLogGroupProperty(p) {
}
function _aws_cdk_aws_stepfunctions_CfnStateMachine_LogDestinationProperty(p) {
}
function _aws_cdk_aws_stepfunctions_CfnStateMachine_LoggingConfigurationProperty(p) {
}
function _aws_cdk_aws_stepfunctions_CfnStateMachine_S3LocationProperty(p) {
}
function _aws_cdk_aws_stepfunctions_CfnStateMachine_TagsEntryProperty(p) {
}
function _aws_cdk_aws_stepfunctions_CfnStateMachine_TracingConfigurationProperty(p) {
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
module.exports = { print, getPropertyDescriptor, DeprecationError, _aws_cdk_aws_stepfunctions_JsonPath, _aws_cdk_aws_stepfunctions_Data, _aws_cdk_aws_stepfunctions_Context, _aws_cdk_aws_stepfunctions_FieldUtils, _aws_cdk_aws_stepfunctions_ActivityProps, _aws_cdk_aws_stepfunctions_Activity, _aws_cdk_aws_stepfunctions_IActivity, _aws_cdk_aws_stepfunctions_TaskInput, _aws_cdk_aws_stepfunctions_InputType, _aws_cdk_aws_stepfunctions_INextable, _aws_cdk_aws_stepfunctions_IChainable, _aws_cdk_aws_stepfunctions_Errors, _aws_cdk_aws_stepfunctions_RetryProps, _aws_cdk_aws_stepfunctions_CatchProps, _aws_cdk_aws_stepfunctions_Condition, _aws_cdk_aws_stepfunctions_StateMachineType, _aws_cdk_aws_stepfunctions_LogLevel, _aws_cdk_aws_stepfunctions_LogOptions, _aws_cdk_aws_stepfunctions_StateMachineProps, _aws_cdk_aws_stepfunctions_StateMachine, _aws_cdk_aws_stepfunctions_IStateMachine, _aws_cdk_aws_stepfunctions_StateMachineFragment, _aws_cdk_aws_stepfunctions_SingleStateOptions, _aws_cdk_aws_stepfunctions_StateTransitionMetric, _aws_cdk_aws_stepfunctions_Chain, _aws_cdk_aws_stepfunctions_StateGraph, _aws_cdk_aws_stepfunctions_IStepFunctionsTask, _aws_cdk_aws_stepfunctions_StepFunctionsTaskConfig, _aws_cdk_aws_stepfunctions_ServiceIntegrationPattern, _aws_cdk_aws_stepfunctions_ChoiceProps, _aws_cdk_aws_stepfunctions_Choice, _aws_cdk_aws_stepfunctions_AfterwardsOptions, _aws_cdk_aws_stepfunctions_FailProps, _aws_cdk_aws_stepfunctions_Fail, _aws_cdk_aws_stepfunctions_ParallelProps, _aws_cdk_aws_stepfunctions_Parallel, _aws_cdk_aws_stepfunctions_Result, _aws_cdk_aws_stepfunctions_PassProps, _aws_cdk_aws_stepfunctions_Pass, _aws_cdk_aws_stepfunctions_StateProps, _aws_cdk_aws_stepfunctions_State, _aws_cdk_aws_stepfunctions_FindStateOptions, _aws_cdk_aws_stepfunctions_SucceedProps, _aws_cdk_aws_stepfunctions_Succeed, _aws_cdk_aws_stepfunctions_TaskProps, _aws_cdk_aws_stepfunctions_Task, _aws_cdk_aws_stepfunctions_WaitTime, _aws_cdk_aws_stepfunctions_WaitProps, _aws_cdk_aws_stepfunctions_Wait, _aws_cdk_aws_stepfunctions_MapProps, _aws_cdk_aws_stepfunctions_Map, _aws_cdk_aws_stepfunctions_CustomStateProps, _aws_cdk_aws_stepfunctions_CustomState, _aws_cdk_aws_stepfunctions_TaskStateBaseProps, _aws_cdk_aws_stepfunctions_TaskStateBase, _aws_cdk_aws_stepfunctions_TaskMetricsConfig, _aws_cdk_aws_stepfunctions_IntegrationPattern, _aws_cdk_aws_stepfunctions_Timeout, _aws_cdk_aws_stepfunctions_Credentials, _aws_cdk_aws_stepfunctions_TaskRole, _aws_cdk_aws_stepfunctions_CfnActivityProps, _aws_cdk_aws_stepfunctions_CfnActivity, _aws_cdk_aws_stepfunctions_CfnActivity_TagsEntryProperty, _aws_cdk_aws_stepfunctions_CfnStateMachineProps, _aws_cdk_aws_stepfunctions_CfnStateMachine, _aws_cdk_aws_stepfunctions_CfnStateMachine_CloudWatchLogsLogGroupProperty, _aws_cdk_aws_stepfunctions_CfnStateMachine_LogDestinationProperty, _aws_cdk_aws_stepfunctions_CfnStateMachine_LoggingConfigurationProperty, _aws_cdk_aws_stepfunctions_CfnStateMachine_S3LocationProperty, _aws_cdk_aws_stepfunctions_CfnStateMachine_TagsEntryProperty, _aws_cdk_aws_stepfunctions_CfnStateMachine_TracingConfigurationProperty };
