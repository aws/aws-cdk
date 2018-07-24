using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.LayerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-lifecycleeventconfiguration-shutdowneventconfiguration.html </remarks>
    [JsiiInterface(typeof(IShutdownEventConfigurationProperty), "@aws-cdk/aws-opsworks.cloudformation.LayerResource.ShutdownEventConfigurationProperty")]
    public interface IShutdownEventConfigurationProperty
    {
        /// <summary>``LayerResource.ShutdownEventConfigurationProperty.DelayUntilElbConnectionsDrained``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-lifecycleeventconfiguration-shutdowneventconfiguration.html#cfn-opsworks-layer-lifecycleconfiguration-shutdowneventconfiguration-delayuntilelbconnectionsdrained </remarks>
        [JsiiProperty("delayUntilElbConnectionsDrained", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object DelayUntilElbConnectionsDrained
        {
            get;
            set;
        }

        /// <summary>``LayerResource.ShutdownEventConfigurationProperty.ExecutionTimeout``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-lifecycleeventconfiguration-shutdowneventconfiguration.html#cfn-opsworks-layer-lifecycleconfiguration-shutdowneventconfiguration-executiontimeout </remarks>
        [JsiiProperty("executionTimeout", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object ExecutionTimeout
        {
            get;
            set;
        }
    }
}