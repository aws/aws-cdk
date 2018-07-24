using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancing.cloudformation.LoadBalancerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-connectiondrainingpolicy.html </remarks>
    [JsiiInterface(typeof(IConnectionDrainingPolicyProperty), "@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.ConnectionDrainingPolicyProperty")]
    public interface IConnectionDrainingPolicyProperty
    {
        /// <summary>``LoadBalancerResource.ConnectionDrainingPolicyProperty.Enabled``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-connectiondrainingpolicy.html#cfn-elb-connectiondrainingpolicy-enabled </remarks>
        [JsiiProperty("enabled", "{\"union\":{\"types\":[{\"primitive\":\"boolean\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object Enabled
        {
            get;
            set;
        }

        /// <summary>``LoadBalancerResource.ConnectionDrainingPolicyProperty.Timeout``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-connectiondrainingpolicy.html#cfn-elb-connectiondrainingpolicy-timeout </remarks>
        [JsiiProperty("timeout", "{\"union\":{\"types\":[{\"primitive\":\"number\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object Timeout
        {
            get;
            set;
        }
    }
}