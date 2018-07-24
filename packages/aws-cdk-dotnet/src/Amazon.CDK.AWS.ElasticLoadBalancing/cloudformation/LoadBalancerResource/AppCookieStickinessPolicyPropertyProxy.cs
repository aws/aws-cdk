using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancing.cloudformation.LoadBalancerResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-AppCookieStickinessPolicy.html </remarks>
    [JsiiInterfaceProxy(typeof(IAppCookieStickinessPolicyProperty), "@aws-cdk/aws-elasticloadbalancing.cloudformation.LoadBalancerResource.AppCookieStickinessPolicyProperty")]
    internal class AppCookieStickinessPolicyPropertyProxy : DeputyBase, IAppCookieStickinessPolicyProperty
    {
        private AppCookieStickinessPolicyPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``LoadBalancerResource.AppCookieStickinessPolicyProperty.CookieName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-AppCookieStickinessPolicy.html#cfn-elb-appcookiestickinesspolicy-cookiename </remarks>
        [JsiiProperty("cookieName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object CookieName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }

        /// <summary>``LoadBalancerResource.AppCookieStickinessPolicyProperty.PolicyName``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ec2-elb-AppCookieStickinessPolicy.html#cfn-elb-appcookiestickinesspolicy-policyname </remarks>
        [JsiiProperty("policyName", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object PolicyName
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}