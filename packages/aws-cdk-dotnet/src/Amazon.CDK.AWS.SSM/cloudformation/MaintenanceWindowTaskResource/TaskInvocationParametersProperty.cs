using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.MaintenanceWindowTaskResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html </remarks>
    public class TaskInvocationParametersProperty : DeputyBase, ITaskInvocationParametersProperty
    {
        /// <summary>``MaintenanceWindowTaskResource.TaskInvocationParametersProperty.MaintenanceWindowAutomationParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters-maintenancewindowautomationparameters </remarks>
        [JsiiProperty("maintenanceWindowAutomationParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowAutomationParametersProperty\"}]},\"optional\":true}", true)]
        public object MaintenanceWindowAutomationParameters
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.TaskInvocationParametersProperty.MaintenanceWindowLambdaParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters-maintenancewindowlambdaparameters </remarks>
        [JsiiProperty("maintenanceWindowLambdaParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowLambdaParametersProperty\"}]},\"optional\":true}", true)]
        public object MaintenanceWindowLambdaParameters
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.TaskInvocationParametersProperty.MaintenanceWindowRunCommandParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters-maintenancewindowruncommandparameters </remarks>
        [JsiiProperty("maintenanceWindowRunCommandParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowRunCommandParametersProperty\"}]},\"optional\":true}", true)]
        public object MaintenanceWindowRunCommandParameters
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.TaskInvocationParametersProperty.MaintenanceWindowStepFunctionsParameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-taskinvocationparameters.html#cfn-ssm-maintenancewindowtask-taskinvocationparameters-maintenancewindowstepfunctionsparameters </remarks>
        [JsiiProperty("maintenanceWindowStepFunctionsParameters", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowStepFunctionsParametersProperty\"}]},\"optional\":true}", true)]
        public object MaintenanceWindowStepFunctionsParameters
        {
            get;
            set;
        }
    }
}