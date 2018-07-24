using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;
using Newtonsoft.Json.Linq;

namespace Amazon.CDK.AWS.SSM.cloudformation.MaintenanceWindowTaskResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowautomationparameters.html </remarks>
    [JsiiInterfaceProxy(typeof(IMaintenanceWindowAutomationParametersProperty), "@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.MaintenanceWindowAutomationParametersProperty")]
    internal class MaintenanceWindowAutomationParametersPropertyProxy : DeputyBase, IMaintenanceWindowAutomationParametersProperty
    {
        private MaintenanceWindowAutomationParametersPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowAutomationParametersProperty.DocumentVersion``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowautomationparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowautomationparameters-documentversion </remarks>
        [JsiiProperty("documentVersion", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object DocumentVersion
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``MaintenanceWindowTaskResource.MaintenanceWindowAutomationParametersProperty.Parameters``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-maintenancewindowautomationparameters.html#cfn-ssm-maintenancewindowtask-maintenancewindowautomationparameters-parameters </remarks>
        [JsiiProperty("parameters", "{\"union\":{\"types\":[{\"primitive\":\"json\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        public virtual object Parameters
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}