using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancing.cloudformation.LoadBalancerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-connectionsettings.html </remarks>
    [JsiiInterface(typeof(IConnectionSettingsProperty), "@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.ConnectionSettingsProperty")]
    public interface IConnectionSettingsProperty
    {
        /// <summary>``LoadBalancerResource.ConnectionSettingsProperty.IdleTimeout``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-connectionsettings.html#cfn-elb-connectionsettings-idletimeout </remarks>
        [JsiiProperty("idleTimeout", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object IdleTimeout
        {
            get;
            set;
        }
    }
}