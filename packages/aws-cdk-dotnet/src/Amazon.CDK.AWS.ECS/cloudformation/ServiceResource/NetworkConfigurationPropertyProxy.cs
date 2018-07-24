using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.ServiceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-networkconfiguration.html </remarks>
    [JsiiInterfaceProxy(typeof(INetworkConfigurationProperty), "@aws-cdk/aws-ecs.cloudformation.ServiceResource.NetworkConfigurationProperty")]
    internal class NetworkConfigurationPropertyProxy : DeputyBase, INetworkConfigurationProperty
    {
        private NetworkConfigurationPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``ServiceResource.NetworkConfigurationProperty.AwsvpcConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-networkconfiguration.html#cfn-ecs-service-networkconfiguration-awsvpcconfiguration </remarks>
        [JsiiProperty("awsvpcConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.ServiceResource.AwsVpcConfigurationProperty\"}]},\"optional\":true}")]
        public virtual object AwsvpcConfiguration
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}