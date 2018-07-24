using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.MaintenanceWindowTaskResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowlambdaparameters.html </remarks>
    public class MaintenanceWindowLambdaParametersProperty : DeputyBase, IMaintenanceWindowLambdaParametersProperty
    {
        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowLambdaParametersProperty.ClientContext``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowlambdaparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowlambdaparameters-clientcontext </remarks>
        [JsiiProperty("clientContext", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object ClientContext
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowLambdaParametersProperty.Payload``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowlambdaparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowlambdaparameters-payload </remarks>
        [JsiiProperty("payload", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Payload
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowLambdaParametersProperty.Qualifier``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowlambdaparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowlambdaparameters-qualifier </remarks>
        [JsiiProperty("qualifier", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}", true)]
        public object Qualifier
        {
            get;
            set;
        }
    }
}