using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancing.cloudformation.LoadBalancerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-AppCookieStickinessPolicy.html </remarks>
    [JsiiInterface(typeof(IAppCookieStickinessPolicyProperty), "@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.AppCookieStickinessPolicyProperty")]
    public interface IAppCookieStickinessPolicyProperty
    {
        /// <summary>``LoadBalancerResource.AppCookieStickinessPolicyProperty.CookieName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-AppCookieStickinessPolicy.html#cfn-elb-appcookiestickinesspolicy-cookiename </remarks>
        [JsiiProperty("cookieName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object CookieName
        {
            get;
            set;
        }

        /// <summary>``LoadBalancerResource.AppCookieStickinessPolicyProperty.PolicyName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-AppCookieStickinessPolicy.html#cfn-elb-appcookiestickinesspolicy-policyname </remarks>
        [JsiiProperty("policyName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        object PolicyName
        {
            get;
            set;
        }
    }
}