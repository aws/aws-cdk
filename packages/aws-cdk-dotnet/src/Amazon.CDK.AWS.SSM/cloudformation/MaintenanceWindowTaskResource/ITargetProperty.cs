using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.SSM.cloudformation.MaintenanceWindowTaskResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-target.html </remarks>
    [JsiiInterface(typeof(ITargetProperty), "@aws-cdk/aws-ssm.cloudformation.MaintenanceWindowTaskResource.TargetProperty")]
    public interface ITargetProperty
    {
        /// <summary>``MaintenanceWindowTaskResource.TargetProperty.Key``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-target.html#cfn-ssm-maintenancewindowtask-target-key </remarks>
        [JsiiProperty("key", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Key
        {
            get;
            set;
        }

        /// <summary>``MaintenanceWindowTaskResource.TargetProperty.Values``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssm-maintenancewindowtask-target.html#cfn-ssm-maintenancewindowtask-target-values </remarks>
        [JsiiProperty("values", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"collection\":{\"kind\":\"array\",\"elementtype\":{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}}}]},\"optional\":true}")]
        object Values
        {
            get;
            set;
        }
    }
}