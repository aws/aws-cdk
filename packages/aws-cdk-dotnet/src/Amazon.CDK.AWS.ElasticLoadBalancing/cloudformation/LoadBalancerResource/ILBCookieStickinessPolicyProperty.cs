using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancing.cloudformation.LoadBalancerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-LBCookieStickinessPolicy.html </remarks>
    [JsiiInterface(typeof(ILBCookieStickinessPolicyProperty), "@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.LBCookieStickinessPolicyProperty")]
    public interface ILBCookieStickinessPolicyProperty
    {
        /// <summary>``LoadBalancerResource.LBCookieStickinessPolicyProperty.CookieExpirationPeriod``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-LBCookieStickinessPolicy.html#cfn-elb-lbcookiestickinesspolicy-cookieexpirationperiod </remarks>
        [JsiiProperty("cookieExpirationPeriod", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object CookieExpirationPeriod
        {
            get;
            set;
        }

        /// <summary>``LoadBalancerResource.LBCookieStickinessPolicyProperty.PolicyName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-LBCookieStickinessPolicy.html#cfn-elb-lbcookiestickinesspolicy-policyname </remarks>
        [JsiiProperty("policyName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]},\"optional\":true}")]
        object PolicyName
        {
            get;
            set;
        }
    }
}