using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.OpsWorks.cloudformation.LayerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-lifecycleeventconfiguration.html </remarks>
    public class LifecycleEventConfigurationProperty : DeputyBase, ILifecycleEventConfigurationProperty
    {
        /// <summary>``LayerResource.LifecycleEventConfigurationProperty.ShutdownEventConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-opsworks-layer-lifecycleeventconfiguration.html#cfn-opsworks-layer-lifecycleconfiguration-shutdowneventconfiguration </remarks>
        [JsiiProperty("shutdownEventConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-opsworks.cloudformation.LayerResource.ShutdownEventConfigurationProperty\"}]},\"optional\":true}", true)]
        public object ShutdownEventConfiguration
        {
            get;
            set;
        }
    }
}