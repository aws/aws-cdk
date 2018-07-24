using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ECS.cloudformation.ServiceResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-networkconfiguration.html </remarks>
    [JsiiInterface(typeof(INetworkConfigurationProperty), "@aws-cdk/aws-ecs.cloudformation.ServiceResource.NetworkConfigurationProperty")]
    public interface INetworkConfigurationProperty
    {
        /// <summary>``ServiceResource.NetworkConfigurationProperty.AwsvpcConfiguration``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-service-networkconfiguration.html#cfn-ecs-service-networkconfiguration-awsvpcconfiguration </remarks>
        [JsiiProperty("awsvpcConfiguration", "{\"union\":{\"types\":[{\"fqn\":\"@aws-cdk/cdk.Token\"},{\"fqn\":\"@aws-cdk/aws-ecs.cloudformation.ServiceResource.AwsVpcConfigurationProperty\"}]},\"optional\":true}")]
        object AwsvpcConfiguration
        {
            get;
            set;
        }
    }
}