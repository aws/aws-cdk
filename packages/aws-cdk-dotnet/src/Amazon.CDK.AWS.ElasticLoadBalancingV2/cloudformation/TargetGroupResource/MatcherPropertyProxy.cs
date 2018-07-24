using Amazon.CDK;
using AWS.Jsii.Runtime.Deputy;

namespace Amazon.CDK.AWS.ElasticLoadBalancingV2.cloudformation.TargetGroupResource
{
    /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-matcher.html </remarks>
    [JsiiInterfaceProxy(typeof(IMatcherProperty), "@aws-cdk/aws-elasticloadbalancingv2.cloudformation.TargetGroupResource.MatcherProperty")]
    internal class MatcherPropertyProxy : DeputyBase, IMatcherProperty
    {
        private MatcherPropertyProxy(ByRefValue reference): base(reference)
        {
        }

        /// <summary>``TargetGroupResource.MatcherProperty.HttpCode``</summary>
        /// <remarks>link: http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-elasticloadbalancingv2-targetgroup-matcher.html#cfn-elasticloadbalancingv2-targetgroup-matcher-httpcode </remarks>
        [JsiiProperty("httpCode", "{\"union\":{\"types\":[{\"primitive\":\"string\"},{\"fqn\":\"@aws-cdk/cdk.Token\"}]}}")]
        public virtual object HttpCode
        {
            get => GetInstanceProperty<object>();
            set => SetInstanceProperty(value);
        }
    }
}